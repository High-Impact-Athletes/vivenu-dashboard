#!/usr/bin/env python3
"""
Event Sales Test with Comprehensive Ticket Scraping
Tests real sales percentages by scraping ALL tickets

This script:
1. Fetches event details for any region
2. Scrapes ALL tickets with pagination
3. Filters out secondary tickets with inflated capacities
4. Calculates real sales percentages from actual data
5. Validates accurate sales numbers

Usage:
    python test_frankfurt_sales.py FRANKFURT
    python test_frankfurt_sales.py PARIS
    python test_frankfurt_sales.py VERONA
"""

import os
import sys
import json
import time
import requests
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Any, Optional
from collections import defaultdict
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

BASE_URL = 'https://vivenu.com/api'

class EventSalesTest:
    def __init__(self, region: str):
        self.region = region.upper()
        
        # Get event ID and API key from environment
        self.event_id = os.getenv(f'{self.region}_EVENT')
        if not self.event_id:
            raise ValueError(f"No event ID found for {self.region}. Set {self.region}_EVENT in .env file")
        
        # Try region-specific API first, then fall back to seller API
        self.api_key = os.getenv(f'{self.region}_API')
        if not self.api_key:
            # Try to get the base seller API (e.g., DACH_API for Frankfurt)
            if self.region in ['FRANKFURT', 'HAMBURG', 'STUTTGART', 'VIENNA', 'KOLN']:
                self.api_key = os.getenv('DACH_API')
            elif self.region in ['PARIS', 'NICE', 'BORDEAUX', 'TOULOUSE', 'LYON']:
                self.api_key = os.getenv('FRANCE_API')
            elif self.region in ['ROME', 'VERONA', 'TURIN', 'BOLOGNA']:
                self.api_key = os.getenv('ITALY_API')
            elif self.region in ['CHICAGO', 'DALLAS', 'ANAHEIM', 'ATLANTA25']:
                self.api_key = os.getenv('USA_API')
            elif self.region in ['GENEVA', 'STGALLEN']:
                self.api_key = os.getenv('SWITZERLAND_API')
            elif self.region in ['MAASTRICHT', 'UTRECHT', 'AMSTERDAM', 'BELGIUM', 'ROTTERDAM']:
                self.api_key = os.getenv('BENELUX_API')
            
            if not self.api_key:
                raise ValueError(f"No API key found for {self.region}")
        
        self.headers = {
            'Authorization': f'Bearer {self.api_key}',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
        
        # Progress tracking
        self.progress_file = Path(f'{self.region.lower()}_test_progress.json')
        self.results_file = Path(f'{self.region.lower()}_test_results.json')
        
    def save_progress(self, data: Dict):
        """Save progress to file"""
        with open(self.progress_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"📁 Progress saved to {self.progress_file}")
    
    def save_results(self, data: Dict):
        """Save final results to file"""
        with open(self.results_file, 'w') as f:
            json.dump(data, f, indent=2, default=str)
        print(f"📁 Results saved to {self.results_file}")
    
    def is_secondary_ticket(self, ticket_name: str) -> bool:
        """Check if a ticket is secondary (should be filtered out)"""
        secondary_indicators = [
            'ATHLETE 2',
            'TEAM MEMBER',
            'TEAM MEMBERS',
            'Sportograf Photo Package',
            'Photo Package',
            'Volunteering',
            'ATHLETE2',
            'ATHLETEN 2'
        ]
        
        ticket_upper = ticket_name.upper()
        for indicator in secondary_indicators:
            if indicator.upper() in ticket_upper:
                return True
        return False
    
    def get_event_with_tickets(self) -> Dict:
        """Fetch event details with ticket types"""
        print(f"\n📋 Fetching event details for {self.region}...")
        url = f"{BASE_URL}/events/{self.event_id}?include=tickets"
        
        response = requests.get(url, headers=self.headers)
        if response.status_code != 200:
            raise Exception(f"Failed to fetch event: {response.status_code}")
        
        event = response.json()
        print(f"✅ Event: {event.get('name')}")
        return event
    
    def scrape_all_tickets(self) -> Dict:
        """Comprehensively scrape ALL tickets with robust error handling"""
        all_tickets = []
        skip = 0
        batch_size = 1000  # Maximum allowed by API
        min_batch_size = 10
        call_count = 0
        max_retries = 3
        base_delay = 1
        max_delay = 30
        
        print(f"\n🎫 Starting comprehensive ticket scraping...")
        print(f"⚠️  This will take several minutes for ~18,000 tickets")
        
        def exponential_backoff(attempt: int) -> float:
            """Calculate exponential backoff delay"""
            import random
            delay = min(base_delay * (2 ** attempt), max_delay)
            jitter = delay * 0.2 * random.random()
            return delay + jitter
        
        start_time = datetime.now()
        
        while True:
            call_count += 1
            url = f"{BASE_URL}/tickets"
            params = {
                "event": self.event_id,
                "top": batch_size,
                "skip": skip
                # Note: No status filter in params - API doesn't support it
            }
            
            print(f"\n📞 API Call #{call_count}: skip={skip}, batch_size={batch_size}")
            
            # Retry logic for 503 errors
            success = False
            for attempt in range(max_retries):
                try:
                    response = requests.get(url, headers=self.headers, params=params, timeout=15)
                    
                    if response.status_code == 503:
                        delay = exponential_backoff(attempt)
                        print(f"   ⏳ 503 Service Unavailable (attempt {attempt + 1}/{max_retries})")
                        if attempt < max_retries - 1:
                            print(f"   ⏰ Waiting {delay:.1f}s before retry...")
                            time.sleep(delay)
                            
                            # Reduce batch size on repeated 503s
                            if attempt > 0 and batch_size > min_batch_size:
                                batch_size = max(min_batch_size, batch_size // 2)
                                print(f"   📉 Reduced batch size to {batch_size}")
                            continue
                        else:
                            raise Exception("Max retries exceeded for 503 error")
                    
                    response.raise_for_status()
                    success = True
                    break
                    
                except requests.exceptions.Timeout:
                    print(f"   ⏱️ Timeout (attempt {attempt + 1}/{max_retries})")
                    if attempt < max_retries - 1:
                        time.sleep(exponential_backoff(attempt))
                        continue
                    raise
                
                except Exception as e:
                    if attempt < max_retries - 1:
                        print(f"   ❌ Error: {e} (attempt {attempt + 1}/{max_retries})")
                        time.sleep(exponential_backoff(attempt))
                        continue
                    raise
            
            if not success:
                raise Exception("Failed to fetch tickets after all retries")
            
            data = response.json()
            # Use 'rows' not 'data' - matching historical_sync.py
            tickets = data.get('rows', [])
            total = data.get('total', 0)
            
            if not tickets:
                print(f"✅ Scraping complete! Total tickets: {len(all_tickets)}")
                break
            
            all_tickets.extend(tickets)
            skip += len(tickets)
            
            # Progress update
            progress_pct = (skip / total * 100) if total > 0 else 0
            elapsed = (datetime.now() - start_time).total_seconds()
            rate = skip / elapsed if elapsed > 0 else 0
            eta = (total - skip) / rate if rate > 0 else 0
            
            print(f"   📊 Progress: {skip}/{total} ({progress_pct:.1f}%)")
            print(f"   ⏱️ Rate: {rate:.1f} tickets/sec, ETA: {eta:.0f}s")
            
            # Save progress periodically
            if call_count % 10 == 0:
                self.save_progress({
                    'tickets_fetched': skip,
                    'total_expected': total,
                    'api_calls': call_count,
                    'elapsed_seconds': elapsed,
                    'timestamp': datetime.now().isoformat()
                })
            
            # Rate limiting
            time.sleep(0.5)  # Be nice to the API
        
        # Final summary
        elapsed_total = (datetime.now() - start_time).total_seconds()
        print(f"\n✅ Scraping complete!")
        print(f"   Total tickets fetched: {len(all_tickets)}")
        print(f"   API calls made: {call_count}")
        print(f"   Time elapsed: {elapsed_total:.1f}s")
        
        return {
            'tickets': all_tickets,
            'total_fetched': len(all_tickets),
            'api_calls': call_count,
            'elapsed_seconds': elapsed_total,
            'scraped_at': datetime.now().isoformat()
        }
    
    def analyze_tickets(self, event_data: Dict, scraping_result: Dict) -> Dict:
        """Analyze scraped tickets and calculate real percentages"""
        tickets = scraping_result['tickets']
        ticket_types = event_data.get('tickets', [])
        
        # Count tickets by type
        ticket_counts = defaultdict(int)
        for ticket in tickets:
            ticket_type_id = ticket.get('ticketTypeId')
            if ticket_type_id:
                ticket_counts[ticket_type_id] += 1
        
        # Build results
        results = []
        total_capacity = 0
        total_sold = 0
        charity_result = None
        
        print(f"\n📊 TICKET TYPE ANALYSIS")
        print("=" * 80)
        
        for ticket_type in ticket_types:
            type_id = ticket_type.get('_id')
            type_name = ticket_type.get('name', 'Unknown')
            capacity = ticket_type.get('amount', 0)
            
            # Skip secondary tickets
            if self.is_secondary_ticket(type_name):
                print(f"⏭️  Skipping secondary ticket: {type_name} (capacity: {capacity:,})")
                continue
            
            sold_count = ticket_counts.get(type_id, 0)
            available = max(0, capacity - sold_count)
            percent_sold = (sold_count / capacity * 100) if capacity > 0 else 0
            
            result = {
                'id': type_id,
                'name': type_name,
                'capacity': capacity,
                'sold': sold_count,
                'available': available,
                'percent_sold': round(percent_sold, 2),
                'is_secondary': False
            }
            
            results.append(result)
            total_capacity += capacity
            total_sold += sold_count
            
            # Track charity specifically
            if 'charity' in type_name.lower():
                charity_result = result
            
            # Print primary tickets only
            if capacity > 0:
                status = "🔴 SOLD OUT" if percent_sold >= 100 else "🟡 LIMITED" if percent_sold >= 80 else "🟢 AVAILABLE"
                print(f"{type_name:40} {sold_count:5}/{capacity:5} ({percent_sold:6.2f}%) {status}")
        
        # Overall statistics
        total_percent = (total_sold / total_capacity * 100) if total_capacity > 0 else 0
        
        print(f"\n{'='*80}")
        print(f"{'TOTALS (Primary Tickets Only)':40} {total_sold:5}/{total_capacity:5} ({total_percent:6.2f}%)")
        
        # Highlight charity calculation
        if charity_result:
            print(f"\n🎯 CHARITY VALIDATION")
            print("=" * 80)
            print(f"Ticket Type: {charity_result['name']}")
            print(f"Capacity: {charity_result['capacity']}")
            print(f"Sold: {charity_result['sold']}")
            print(f"Available: {charity_result['available']}")
            print(f"Percent Sold: {charity_result['percent_sold']}%")
            print(f"\nExpected: ~46% sold (95/205)")
            print(f"Actual: {charity_result['percent_sold']}% sold ({charity_result['sold']}/{charity_result['capacity']})")
            
            if abs(charity_result['percent_sold'] - 46.3) < 5:
                print("✅ VALIDATION PASSED: Charity calculation is correct!")
            else:
                print("❌ VALIDATION FAILED: Charity calculation differs from expected")
        
        return {
            'ticket_types': results,
            'totals': {
                'capacity': total_capacity,
                'sold': total_sold,
                'available': total_capacity - total_sold,
                'percent_sold': round(total_percent, 2)
            },
            'charity_validation': charity_result,
            'scraping_stats': {
                'total_tickets_scraped': scraping_result['total_fetched'],
                'api_calls': scraping_result['api_calls'],
                'elapsed_seconds': scraping_result['elapsed_seconds']
            }
        }
    
    def run_test(self):
        """Run the complete test"""
        print(f"🎯 {self.region} EVENT SALES TEST")
        print("=" * 80)
        print(f"Event ID: {self.event_id}")
        print(f"Region: {self.region}")
        print(f"API Key: {self.api_key[:20]}...")
        
        try:
            # Step 1: Get event data
            event_data = self.get_event_with_tickets()
            total_ticket_types = len(event_data.get('tickets', []))
            print(f"Total ticket types: {total_ticket_types}")
            
            # Step 2: Scrape all tickets
            scraping_result = self.scrape_all_tickets()
            
            # Step 3: Analyze and calculate
            analysis = self.analyze_tickets(event_data, scraping_result)
            
            # Save final results
            self.save_results(analysis)
            
            print(f"\n{'='*80}")
            print("✅ TEST COMPLETE!")
            print(f"📁 Results saved to: {self.results_file}")
            print(f"📁 Progress log saved to: {self.progress_file}")
            
            return True
            
        except Exception as e:
            print(f"\n❌ Test failed: {e}")
            import traceback
            traceback.print_exc()
            return False

def main():
    """Main entry point"""
    if len(sys.argv) < 2:
        print("Usage: python test_frankfurt_sales.py <REGION>")
        print("\nExamples:")
        print("  python test_frankfurt_sales.py FRANKFURT")
        print("  python test_frankfurt_sales.py PARIS")
        print("  python test_frankfurt_sales.py NICE")
        print("  python test_frankfurt_sales.py VERONA")
        print("  python test_frankfurt_sales.py ATLANTA25")
        print("\nAvailable regions are defined in your .env file")
        sys.exit(1)
    
    region = sys.argv[1]
    
    print(f"Starting {region} sales test...")
    print("This will scrape all tickets and may take several minutes.")
    print("")
    
    try:
        test = EventSalesTest(region)
        success = test.run_test()
        sys.exit(0 if success else 1)
    except ValueError as e:
        print(f"❌ Configuration error: {e}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    main()