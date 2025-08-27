#!/usr/bin/env python3
"""
HYROX Historical Data Sync - Main Orchestrator

This script pulls historical ticket data from Vivenu events and sends them
to the HIA webhook endpoint as simulated ticket.created events.

Usage:
    python historical_sync.py <REGION> <EVENT_ID> [--batch-size N] [--resume]
    python historical_sync.py --test  # Test with single ticket
    
Options:
    --batch-size N  Process N tickets per batch (default: 50)
    --resume        Continue from last processed ticket
"""

import os
import sys
import json
import uuid
import time
import hmac
import hashlib
import argparse
import requests
import subprocess
from datetime import datetime
from typing import Dict, List, Any, Optional
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

class HistoricalSync:
    def __init__(self, region: str, safety_mode: bool = True):
        self.region = region.upper()
        self.safety_mode = safety_mode
        self.api_key = os.getenv(f"{self.region}_API")
        
        if not self.api_key:
            raise ValueError(f"No API key found for region {self.region}")
        
        # Determine base URL based on region
        if self.region in ["DEV", "TEST"]:
            self.base_url = "https://vivenu.dev/api"
        else:
            self.base_url = "https://vivenu.com/api"
        
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }
        
        # Webhook endpoint - production endpoint
        self.webhook_url = "https://vivenu-filter.high-impact-athletes.workers.dev/ticket-created"
        
        # HMAC secret for webhook signature
        self.vivenu_secret = os.getenv("VIVENU_SECRET")
        if not self.vivenu_secret:
            print("⚠️ WARNING: VIVENU_SECRET not configured in .env - webhooks will fail signature validation")
        
        # Progress tracking
        self.progress_file = Path(f"historical_sync_progress_{self.region}.json")
        self.progress = self.load_progress()
    
    def get_event_id_for_region(self, region: str) -> str:
        """Get event ID from environment for region"""
        event_key = f"{region}_EVENT"
        event_id = os.getenv(event_key)
        if not event_id or event_id.startswith("your_") or event_id == "":
            available_regions = []
            # Check for configured regions
            for key in os.environ:
                if key.endswith("_EVENT"):
                    event_id_val = os.getenv(key)
                    if event_id_val and not event_id_val.startswith("your_"):
                        region_name = key.replace("_EVENT", "")
                        available_regions.append(region_name)
            
            if available_regions:
                available_list = ", ".join(sorted(available_regions))
                raise ValueError(f"No event ID configured for {region}. Available regions: {available_list}")
            else:
                raise ValueError(f"No event ID configured for {region}. Set {event_key} in .env file.")
        return event_id
        
    def load_progress(self) -> Dict[str, Any]:
        """Load progress from file if exists"""
        if self.progress_file.exists():
            with open(self.progress_file, 'r') as f:
                data = json.load(f)
                # Ensure event_progress exists for backward compatibility
                if "event_progress" not in data:
                    data["event_progress"] = {}
                return data
        return {
            "events_processed": [],
            "tickets_sent": 0,
            "errors": [],
            "last_run": None,
            "event_progress": {}
        }
    
    def save_progress(self):
        """Save progress to file"""
        self.progress["last_run"] = datetime.utcnow().isoformat()
        with open(self.progress_file, 'w') as f:
            json.dump(self.progress, f, indent=2)
    
    def get_event_data(self, event_id: str) -> Optional[Dict[str, Any]]:
        """Fetch event data from Vivenu API"""
        url = f"{self.base_url}/events/{event_id}"
        try:
            response = requests.get(url, headers=self.headers)
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            print(f"Error fetching event {event_id}: {e}")
            return None
    
    def get_tickets_for_event(self, event_id: str) -> List[Dict[str, Any]]:
        """Fetch all PURCHASED tickets for an event with robust 503 error handling"""
        all_tickets = []
        skip = 0
        initial_batch_size = 100
        batch_size = initial_batch_size
        min_batch_size = 10
        call_count = 0
        max_retries = 3
        base_delay = 1
        max_delay = 30
        expected_total = None
        
        print(f"📥 Fetching all tickets for event {event_id} with robust 503 handling...")
        
        def exponential_backoff(attempt: int) -> float:
            """Calculate exponential backoff delay with jitter"""
            delay = min(base_delay * (2 ** attempt), max_delay)
            # Add 20% jitter to avoid thundering herd
            import random
            jitter = delay * 0.2 * random.random()
            return delay + jitter
        
        while True:
            call_count += 1
            url = f"{self.base_url}/tickets"
            params = {
                "event": event_id,
                "top": batch_size,
                "skip": skip
            }
            
            print(f"   📞 API Call #{call_count}: skip={skip}, batch_size={batch_size}")
            
            # Retry logic for 503 errors
            success = False
            for attempt in range(max_retries):
                try:
                    start_time = time.time()
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
                                params["top"] = batch_size
                                print(f"   📉 Reducing batch size to {batch_size}")
                            continue
                        else:
                            print(f"   ❌ Failed after {max_retries} 503 attempts")
                            break
                    
                    response.raise_for_status()
                    data = response.json()
                    
                    tickets = data.get("rows", [])
                    total = data.get("total", 0)
                    elapsed = time.time() - start_time
                    
                    # Set expected total on first successful call
                    if expected_total is None:
                        expected_total = total
                        print(f"   🎯 Expected total tickets: {expected_total:,}")
                    
                    all_tickets.extend(tickets)
                    
                    # Progress logging
                    progress_pct = (len(all_tickets) / expected_total * 100) if expected_total > 0 else 0
                    print(f"   ✅ Got {len(tickets)} tickets in {elapsed:.1f}s")
                    print(f"   📊 Progress: {len(all_tickets):,}/{expected_total:,} ({progress_pct:.1f}%)")
                    
                    success = True
                    break
                    
                except requests.exceptions.RequestException as e:
                    delay = exponential_backoff(attempt)
                    print(f"   🔄 Request error (attempt {attempt + 1}/{max_retries}): {str(e)}")
                    if attempt < max_retries - 1:
                        print(f"   ⏰ Waiting {delay:.1f}s before retry...")
                        time.sleep(delay)
                        continue
                    else:
                        print(f"   ❌ Failed after {max_retries} attempts: {str(e)}")
                        break
            
            if not success:
                print(f"   ❌ Batch failed at skip={skip}")
                print(f"   📊 Successfully fetched {len(all_tickets)} tickets before failure")
                break
            
            # Check completion conditions
            if len(tickets) == 0:
                print(f"   🏁 No more tickets returned - stopping")
                break
            elif len(all_tickets) >= expected_total:
                print(f"   🏁 Got all expected tickets ({len(all_tickets):,}) - stopping")
                break
            
            skip += len(tickets)
            
            # Small delay between requests to be nice to the API
            time.sleep(0.2)
        
        # Validate completeness
        completion_rate = (len(all_tickets) / expected_total * 100) if expected_total else 0
        
        print(f"\n📥 FETCH COMPLETE!")
        print(f"   Total tickets fetched: {len(all_tickets):,}")
        print(f"   Expected tickets: {expected_total:,}")
        print(f"   Completion rate: {completion_rate:.1f}%")
        print(f"   API calls made: {call_count}")
        
        if completion_rate < 95:
            print(f"   ⚠️  WARNING: Only got {completion_rate:.1f}% of expected tickets!")
        
        return all_tickets
    
    def generate_hmac_signature(self, payload: str) -> str:
        """Generate HMAC-SHA256 signature for webhook payload"""
        if not self.vivenu_secret:
            raise ValueError("VIVENU_SECRET not configured in .env")
        
        # Generate HMAC-SHA256 in hex format (matching Vivenu's format)
        signature = hmac.new(
            self.vivenu_secret.encode('utf-8'),
            payload.encode('utf-8'),
            hashlib.sha256
        ).hexdigest()
        
        return signature
    
    def transform_to_webhook(self, ticket: Dict[str, Any]) -> Dict[str, Any]:
        """Transform purchased ticket to webhook format matching example_berlin_ticket.json"""
        # Generate webhook metadata
        webhook_id = str(uuid.uuid4())
        
        # Build webhook structure - ticket already has all needed fields
        webhook_data = {
            "id": webhook_id,
            "sellerId": ticket.get("sellerId", ""),
            "webhookId": f"historical-sync-{webhook_id[:8]}",
            "type": "ticket.created",
            "mode": "prod",  # or "test" for testing
            "data": {
                "ticket": ticket  # Pass the entire ticket object as-is
            }
        }
        
        return webhook_data
    
    def send_webhook(self, webhook_data: Dict[str, Any]) -> bool:
        """Send webhook to endpoint with HMAC signature"""
        try:
            # Convert webhook data to JSON string for signature
            payload = json.dumps(webhook_data, separators=(',', ':'))
            
            # Generate HMAC signature
            headers = {"Content-Type": "application/json"}
            if self.vivenu_secret:
                signature = self.generate_hmac_signature(payload)
                headers["x-vivenu-signature"] = signature
                print(f"🔑 Generated HMAC signature: {signature[:16]}...")
            
            print(f"Sending to: {self.webhook_url}")
            response = requests.post(
                self.webhook_url,
                data=payload,  # Use data instead of json to send exact payload we signed
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 200:
                ticket_info = webhook_data['data']['ticket']
                print(f"✓ Sent ticket: {ticket_info.get('ticketName', 'Unknown')} - {ticket_info.get('name', 'Unknown')}")
                print(f"Response: {response.text}")
                return True
            else:
                print(f"✗ Failed to send ticket: {response.status_code} - {response.text}")
                self.progress["errors"].append({
                    "ticket_id": webhook_data['data']['ticket']['_id'],
                    "error": f"HTTP {response.status_code}: {response.text}",
                    "timestamp": datetime.utcnow().isoformat()
                })
                return False
                
        except Exception as e:
            print(f"✗ Error sending webhook: {e}")
            self.progress["errors"].append({
                "ticket_id": webhook_data['data']['ticket']['_id'],
                "error": str(e),
                "timestamp": datetime.utcnow().isoformat()
            })
            return False
    
    def analyze_ticket_types(self, tickets: List[Dict[str, Any]]) -> Dict[str, int]:
        """Analyze ticket types and return counts"""
        ticket_types = {}
        for ticket in tickets:
            ticket_name = ticket.get('ticketName', ticket.get('name', 'Unknown'))
            ticket_types[ticket_name] = ticket_types.get(ticket_name, 0) + 1
        return dict(sorted(ticket_types.items(), key=lambda x: x[1], reverse=True))
    
    def is_team_ticket(self, ticket_name: str) -> bool:
        """Check if ticket is part of a team (doubles, relay, etc.)"""
        team_indicators = ['DOUBLES', 'RELAY', 'ATHLETE 2', 'TEAM MEMBER']
        return any(indicator in ticket_name.upper() for indicator in team_indicators)
    
    def get_team_tickets(self, tickets: List[Dict[str, Any]], start_index: int) -> List[Dict[str, Any]]:
        """Get all tickets that are part of the same team purchase"""
        if start_index >= len(tickets):
            return []
        
        first_ticket = tickets[start_index]
        first_ticket_name = first_ticket.get('ticketName', '')
        created_at = first_ticket.get('createdAt', '')
        
        # If not a team ticket, return just the single ticket
        if not self.is_team_ticket(first_ticket_name):
            return [first_ticket]
        
        # For team tickets, find all tickets from the same purchase (same timestamp)
        team_tickets = []
        for i in range(start_index, len(tickets)):
            ticket = tickets[i]
            ticket_created_at = ticket.get('createdAt', '')
            ticket_name = ticket.get('ticketName', '')
            
            # Stop if we've moved to a different timestamp (different purchase)
            if ticket_created_at != created_at:
                break
            
            # Include all team-related tickets from this purchase
            if self.is_team_ticket(ticket_name):
                team_tickets.append(ticket)
        
        return team_tickets
    
    def sync_event(self, event_id: str, batch_size: int = 50, resume: bool = False, dry_run: bool = False, quiet: bool = False, validate: bool = False, test_batch: int = None):
        """Sync all tickets from a single event with batch processing"""
        print(f"\n{'='*60}")
        if dry_run:
            print("🔍 DRY RUN MODE - No webhooks will be sent")
        print(f"Syncing event: {event_id}")
        print(f"Region: {self.region}")
        print(f"Webhook URL: {self.webhook_url}")
        print(f"Batch size: {batch_size}")
        print(f"Resume mode: {resume}")
        print(f"{'='*60}\n")
        
        # Initialize event progress if not exists
        if event_id not in self.progress["event_progress"]:
            self.progress["event_progress"][event_id] = {
                "total_tickets": 0,
                "processed_tickets": 0,
                "sent_ticket_ids": [],
                "last_processed_index": -1,
                "status": "pending",
                "batches_completed": 0
            }
        
        event_progress = self.progress["event_progress"][event_id]
        
        # Check if already fully processed
        if event_progress["status"] == "completed" and not resume:
            print(f"Event {event_id} already fully processed. Use --resume to reprocess.")
            return
        
        # Note: We don't need to fetch event data separately for purchased tickets
        # The tickets already contain all necessary information
        print(f"Fetching purchased tickets for event {event_id}...")
        
        # Get tickets
        all_tickets = self.get_tickets_for_event(event_id)
        print(f"Found {len(all_tickets)} total tickets")
        
        if not all_tickets:
            print("No tickets found for this event")
            return
        
        # Filter tickets
        filtered_tickets = []
        status_rejected = 0
        charity_rejected = 0
        
        for ticket in all_tickets:
            ticket_name = ticket.get('ticketName', ticket.get('name', ''))
            status = ticket.get('status', '')
            
            # Check status filter - only VALID and DETAILSREQUIRED
            if status not in ['VALID', 'DETAILSREQUIRED']:
                status_rejected += 1
                if not quiet:
                    print(f"  ⚠️ Skipping {ticket_name} - Status: {status}")
                continue
                
            # Check charity filter - must contain CHARITY
            if 'CHARITY' not in ticket_name.upper():
                charity_rejected += 1
                if not quiet:
                    print(f"  ⚠️ Skipping {ticket_name} - Not a charity ticket")
                continue
                
            filtered_tickets.append(ticket)
        
        print(f"\nFiltering results:")
        print(f"  - Total tickets: {len(all_tickets)}")
        print(f"  - Rejected (wrong status): {status_rejected}")
        print(f"  - Rejected (not charity): {charity_rejected}")
        print(f"  - ✅ Tickets to send: {len(filtered_tickets)}")
        
        if not filtered_tickets:
            print("\nNo tickets passed the filters!")
            return
        
        tickets = filtered_tickets
        
        # Sort tickets chronologically (oldest first)
        tickets.sort(key=lambda t: t.get('createdAt', ''))
        
        # Apply test batch with smart team handling
        if test_batch is not None:
            print(f"\n🧪 TEST BATCH MODE: Limiting to {test_batch} tickets with smart team handling")
            original_count = len(tickets)
            
            test_tickets = []
            i = 0
            while i < len(tickets) and len(test_tickets) < test_batch:
                # Get team tickets starting from current position
                team_tickets = self.get_team_tickets(tickets, i)
                
                # If adding this team would exceed the limit, decide whether to include
                if len(test_tickets) + len(team_tickets) > test_batch:
                    # If we have room for at least one ticket, and this is a single ticket, add it
                    if len(team_tickets) == 1 and len(test_tickets) < test_batch:
                        test_tickets.extend(team_tickets)
                    # Otherwise, stop here to avoid splitting teams
                    break
                else:
                    # Add the full team
                    test_tickets.extend(team_tickets)
                
                # Move past this team
                i += len(team_tickets)
            
            tickets = test_tickets
            print(f"   📊 Selected {len(tickets)} tickets from {original_count} total (preserving team integrity)")
            
            # Show what we're testing
            if tickets:
                first_ticket = tickets[0]
                first_name = first_ticket.get('ticketName', 'Unknown')
                first_customer = first_ticket.get('name', 'Unknown')
                
                if self.is_team_ticket(first_name):
                    print(f"   🏆 First purchase is a TEAM event: {first_name} ({len(tickets)} tickets)")
                    for i, ticket in enumerate(tickets):
                        customer = ticket.get('name', 'Unknown')
                        ticket_type = ticket.get('ticketName', 'Unknown')
                        print(f"     [{i+1}] {ticket_type} - {customer}")
                else:
                    print(f"   🏃 First purchase is individual: {first_name} - {first_customer}")
        
        # Update event progress with total count
        event_progress["total_tickets"] = len(tickets)
        
        # Dry run analysis
        if dry_run:
            print(f"\n{'='*50}")
            print("📊 TICKET TYPE BREAKDOWN:")
            print(f"{'='*50}")
            ticket_types = self.analyze_ticket_types(tickets)
            for ticket_type, count in ticket_types.items():
                print(f"  - {ticket_type}: {count} tickets")
            
            print(f"\n{'='*50}")
            print("📅 CHRONOLOGICAL RANGE:")
            print(f"{'='*50}")
            if tickets:
                dates = [t.get('createdAt', '') for t in tickets if t.get('createdAt')]
                if dates:
                    earliest = min(dates)
                    latest = max(dates)
                    print(f"  - Earliest ticket: {earliest}")
                    print(f"  - Latest ticket: {latest}")
                    try:
                        earliest_dt = datetime.fromisoformat(earliest.replace('Z', '+00:00'))
                        latest_dt = datetime.fromisoformat(latest.replace('Z', '+00:00'))
                        days_span = (latest_dt - earliest_dt).days
                        print(f"  - Span: {days_span} days")
                    except:
                        pass
            
            # Calculate actual starting point for resume
            actual_start_index = 0
            if resume and event_progress["last_processed_index"] >= 0:
                actual_start_index = event_progress["last_processed_index"] + 1
            
            # Calculate actual batch details
            actual_end_index = min(actual_start_index + batch_size, len(tickets))
            remaining_tickets = len(tickets) - actual_start_index
            total_batches = (remaining_tickets + batch_size - 1) // batch_size
            
            print(f"\n{'='*50}")
            if resume and actual_start_index > 0:
                print(f"📦 BATCH PREVIEW (Tickets {actual_start_index + 1}-{actual_end_index} of {len(tickets)}):")
            else:
                print(f"📦 BATCH PREVIEW (First {min(batch_size, len(tickets))} tickets):")
            print(f"{'='*50}")
            
            # Show tickets from the actual starting point
            for i in range(actual_start_index, min(actual_end_index, len(tickets))):
                ticket = tickets[i]
                created_at = ticket.get('createdAt', 'No date')
                ticket_name = ticket.get('ticketName', ticket.get('name', 'Unknown'))
                customer_name = ticket.get('name', 'Unknown')
                print(f"[{i+1}] {created_at} - {ticket_name} - {customer_name}")
            
            print(f"\n{'='*50}")
            print(f"Would process {total_batches} batch(es) total")
            if remaining_tickets > 0:
                batch_breakdown = []
                for b in range(total_batches):
                    start = actual_start_index + (b * batch_size)
                    end = min(start + batch_size, len(tickets))
                    batch_breakdown.append(str(end - start))
                print(f"Batch sizes: {' + '.join(batch_breakdown)} = {remaining_tickets} tickets")
                
                if resume and actual_start_index > 0:
                    print(f"Already processed: {actual_start_index} tickets")
                    print(f"Remaining to process: {remaining_tickets} tickets")
            else:
                print("All tickets already processed!")
            print(f"{'='*50}\n")
            
            if remaining_tickets == 0:
                print("✅ All tickets have been processed! Nothing left to do.")
            elif not resume or event_progress["last_processed_index"] < 0:
                print("✅ Ready to process! Remove --dry-run to start sending webhooks.")
            else:
                print(f"✅ Ready to resume from ticket {actual_start_index + 1}! Remove --dry-run to continue.")
            return
        
        # Determine starting point
        start_index = 0
        if resume and event_progress["last_processed_index"] >= 0:
            start_index = event_progress["last_processed_index"] + 1
            print(f"\nResuming from ticket index {start_index}")
        
        # Calculate batch boundaries
        end_index = min(start_index + batch_size, len(tickets))
        batch_number = (start_index // batch_size) + 1
        total_batches = (len(tickets) + batch_size - 1) // batch_size
        
        print(f"\nProcessing batch {batch_number}/{total_batches} (tickets {start_index + 1}-{end_index} of {len(tickets)})")
        print(f"Already processed: {len(event_progress['sent_ticket_ids'])} tickets\n")
        
        # Process tickets in current batch
        success_count = 0
        batch_success_count = 0
        
        for i in range(start_index, end_index):
            ticket = tickets[i]
            ticket_id = ticket.get('_id', '')
            ticket_name = ticket.get('ticketName', ticket.get('name', 'Unknown'))
            customer_name = ticket.get('name', 'Unknown Customer')
            
            # Check if ticket already sent (duplicate prevention)
            if ticket_id in event_progress['sent_ticket_ids']:
                print(f"[{i+1}/{len(tickets)}] Skipping (already sent): {ticket_name} - {customer_name}")
                continue
            
            print(f"[{i+1}/{len(tickets)}] Processing: {ticket_name} - {customer_name}")
            
            # Transform to webhook format
            webhook_data = self.transform_to_webhook(ticket)
            
            # Send webhook
            if self.send_webhook(webhook_data):
                batch_success_count += 1
                success_count += 1
                self.progress["tickets_sent"] += 1
                event_progress["sent_ticket_ids"].append(ticket_id)
                event_progress["processed_tickets"] += 1
            
            # Update progress after each ticket
            event_progress["last_processed_index"] = i
            self.save_progress()
            
            # Rate limiting - being generous to avoid overwhelming the system
            # 1.8 seconds between requests = ~33 tickets/minute = ~2,000 tickets/hour
            time.sleep(1.8)  # 1.8 seconds between requests
        
        # Update batch completion
        event_progress["batches_completed"] = batch_number
        
        # Check if event is fully processed
        if event_progress["processed_tickets"] >= event_progress["total_tickets"]:
            event_progress["status"] = "completed"
            if event_id not in self.progress["events_processed"]:
                self.progress["events_processed"].append(event_id)
        else:
            event_progress["status"] = "in_progress"
        
        self.save_progress()
        
        print(f"\n{'='*60}")
        print(f"Batch {batch_number} complete: {batch_success_count}/{end_index - start_index} tickets sent successfully")
        print(f"Event progress: {event_progress['processed_tickets']}/{event_progress['total_tickets']} tickets processed")
        print(f"Total tickets sent (all time): {self.progress['tickets_sent']}")
        
        if event_progress["status"] == "in_progress":
            print(f"\nTo continue processing, run:")
            print(f"python historical_sync.py {self.region} {event_id} --resume")
        
        print(f"{'='*60}\n")
    
    def test_single_ticket(self):
        """Test with a single purchased ticket"""
        print("\n=== TEST MODE: Sending single purchased ticket ===\n")
        
        # Use local test data
        test_event_id = "6864d4f427c2aa9b05cd17ee"
        
        # Load purchased tickets from local file
        tickets_file = Path(f"purchased_tickets/{test_event_id}/all_tickets.json")
        if tickets_file.exists():
            with open(tickets_file, 'r') as f:
                tickets = json.load(f)
        else:
            print(f"Failed to find purchased tickets data at {tickets_file}")
            print("Run 'python pull_purchased_tickets.py DEV {event_id}' first")
            return
        
        if not tickets:
            print("No tickets found in file")
            return
        
        # Filter tickets using same logic as sync
        valid_tickets = []
        for ticket in tickets:
            ticket_name = ticket.get("ticketName", ticket.get("name", ""))
            status = ticket.get("status", "")
            
            # Must be VALID or DETAILSREQUIRED
            if status not in ['VALID', 'DETAILSREQUIRED']:
                continue
                
            # Must be charity ticket
            if "CHARITY" not in ticket_name.upper():
                continue
                
            valid_tickets.append(ticket)
        
        if not valid_tickets:
            print("No tickets passed the filters (CHARITY + VALID/DETAILSREQUIRED status)")
            return
        
        # Prefer HIA charity tickets
        test_ticket = None
        for ticket in valid_tickets:
            ticket_name = ticket.get("ticketName", ticket.get("name", ""))
            if "HIA" in ticket_name.upper():
                test_ticket = ticket
                break
        
        if not test_ticket:
            test_ticket = valid_tickets[0]
        
        print(f"Test ticket: {test_ticket.get('ticketName', 'Unknown')}")
        print(f"Customer: {test_ticket.get('name', 'Unknown')}")
        print(f"Email: {test_ticket.get('email', 'No email')}")
        print(f"Price: {test_ticket.get('realPrice', 0)}")
        print(f"Status: {test_ticket.get('status', 'Unknown')}")
        print(f"Barcode: {test_ticket.get('barcode', 'Unknown')}")
        print(f"ID: {test_ticket.get('_id', 'Unknown')}\n")
        
        # Transform and send
        webhook_data = self.transform_to_webhook(test_ticket)
        
        print("Webhook payload preview:")
        # Show abbreviated version
        preview = {
            "id": webhook_data["id"],
            "type": webhook_data["type"],
            "mode": webhook_data["mode"],
            "data": {
                "ticket": {
                    "_id": webhook_data["data"]["ticket"]["_id"],
                    "ticketName": webhook_data["data"]["ticket"].get("ticketName"),
                    "name": webhook_data["data"]["ticket"].get("name"),
                    "email": webhook_data["data"]["ticket"].get("email"),
                    "status": webhook_data["data"]["ticket"].get("status"),
                    "...and all other fields...": "..."
                }
            }
        }
        print(json.dumps(preview, indent=2))
        
        if self.vivenu_secret:
            print("\n✅ HMAC signature will be generated")
        else:
            print("\n⚠️ WARNING: No VIVENU_SECRET - webhook will fail")
        
        print("\nSending to webhook endpoint...")
        
        if self.send_webhook(webhook_data):
            print("\n✓ Test successful!")
        else:
            print("\n✗ Test failed!")

def main():
    # Simple argument handling - check for test mode first
    if len(sys.argv) > 1 and sys.argv[1] == "--test":
        sync = HistoricalSync("DEV")
        sync.test_single_ticket()
        return
    
    # Parse arguments for normal mode
    parser = argparse.ArgumentParser(description='HYROX Historical Data Sync')
    parser.add_argument('region', help='Region code (e.g., PARIS, FRANKFURT)')
    parser.add_argument('event_id', nargs='?', help='Event ID to sync (optional if configured in .env)')
    parser.add_argument('--batch-size', type=int, default=50, help='Number of tickets to process per batch (default: 50)')
    parser.add_argument('--resume', action='store_true', help='Resume from last processed ticket')
    parser.add_argument('--dry-run', action='store_true', help='Preview what would be sent without actually sending webhooks')
    parser.add_argument('--quiet', action='store_true', help='Suppress non-charity ticket skip messages')
    parser.add_argument('--no-validate', action='store_true', help='Skip validation (NOT recommended - validation runs by default)')
    parser.add_argument('--test-batch', type=int, metavar='N', help='Process only first N tickets (smart team handling - use 1-5 for testing)')
    
    # Check if we have enough arguments
    if len(sys.argv) < 2:
        print("Usage: python historical_sync.py <REGION> [EVENT_ID] [--batch-size N] [--resume] [--dry-run] [--quiet] [--no-validate] [--test-batch N]")
        print("       python historical_sync.py --test")
        print("\nIf EVENT_ID is not provided, it will be looked up from .env file using <REGION>_EVENT")
        sys.exit(1)
    
    args = parser.parse_args()
    
    sync = HistoricalSync(args.region)
    
    # Get event ID - either from argument or from .env file
    if args.event_id:
        event_id = args.event_id
        print(f"Using provided event ID: {event_id}")
    else:
        try:
            event_id = sync.get_event_id_for_region(args.region)
            print(f"Using event ID from .env for {args.region}: {event_id}")
        except ValueError as e:
            print(f"Error: {e}")
            sys.exit(1)
    
    # Run validation by default (unless --no-validate is specified)
    if not args.no_validate:
        print(f"\n{'='*60}")
        print(f"🔍 VALIDATION RUNNING (default behavior)")
        print(f"{'='*60}")
        
        validation_script = Path(__file__).parent.parent / "validation" / "get_ticket_totals_validator.py"
        if validation_script.exists():
            print(f"Running validation script: {validation_script}")
            try:
                result = subprocess.run([sys.executable, str(validation_script), args.region], 
                                      timeout=600)  # 10 minute timeout
                if result.returncode != 0:
                    print(f"❌ Validation failed! Aborting historical sync.")
                    sys.exit(1)
                else:
                    print(f"✅ Validation passed! Proceeding with sync...")
            except subprocess.TimeoutExpired:
                print(f"⏰ Validation timed out! Aborting historical sync.")
                sys.exit(1)
            except Exception as e:
                print(f"❌ Error running validation: {e}")
                print(f"Aborting historical sync.")
                sys.exit(1)
        else:
            print(f"⚠️  Validation script not found at {validation_script}")
            print(f"Aborting historical sync.")
            sys.exit(1)
    else:
        print(f"\n{'='*60}")
        print(f"⚠️  VALIDATION SKIPPED (--no-validate specified)")
        print(f"❌ WARNING: This is NOT recommended - you may process wrong ticket counts!")
        print(f"{'='*60}")
    
    sync.sync_event(event_id, batch_size=args.batch_size, resume=args.resume, dry_run=args.dry_run, 
                   quiet=args.quiet, validate=not args.no_validate, test_batch=args.test_batch)

if __name__ == "__main__":
    main()