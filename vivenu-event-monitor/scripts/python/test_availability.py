#!/usr/bin/env python3
"""
Vivenu Availability Dashboard - Test Script

Tests the new availability endpoints and dashboard functionality
"""

import requests
import json
import time
from datetime import datetime

# Configuration for local testing
BASE_URL = "http://localhost:8787"  # Default Wrangler dev server
TIMEOUT = 30

# For production testing, change to:
# BASE_URL = "https://vivenu-event-monitor.high-impact-athletes.workers.dev"

# Test Atlanta25 event
TEST_EVENT_ID = "6894f94a097ce9a51c15cef4"
TEST_TICKET_TYPE_ID = "6894f94a097ce9a51c15cf20"  # Charity Women ticket

def format_response(response: requests.Response, start_time: float) -> dict:
    """Format response for display"""
    duration = round((time.time() - start_time) * 1000, 2)
    
    try:
        response_data = response.json()
    except:
        response_data = response.text
    
    return {
        "url": response.url,
        "status_code": response.status_code,
        "duration_ms": duration,
        "data": response_data
    }

def print_test_result(test_name: str, result: dict) -> None:
    """Print formatted test result"""
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")
    print(f"URL: {result['url']}")
    print(f"Status: {result['status_code']}")
    print(f"Duration: {result['duration_ms']}ms")
    print(f"Timestamp: {datetime.now().strftime('%H:%M:%S')}")
    
    if result['status_code'] == 200:
        print("✅ SUCCESS")
    else:
        print(f"❌ FAILED ({result['status_code']})")
    
    print(f"\nResponse:")
    if isinstance(result['data'], dict):
        print(json.dumps(result['data'], indent=2))
    else:
        print(result['data'])

def test_dashboard_html():
    """Test dashboard HTML serving"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/dashboard", timeout=TIMEOUT)
        result = format_response(response, start_time)
        
        # For HTML responses, just show success/failure and length
        if response.status_code == 200:
            result['data'] = f"HTML content ({len(response.text)} chars)"
            
        return result
    except Exception as e:
        return {
            "url": f"{BASE_URL}/dashboard",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_dashboard_data():
    """Test dashboard data API"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/api/dashboard/data", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/api/dashboard/data",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_event_availability():
    """Test event availability endpoint"""
    start_time = time.time()
    try:
        response = requests.get(
            f"{BASE_URL}/api/availability/{TEST_EVENT_ID}",
            params={"region": "USA"},
            timeout=TIMEOUT
        )
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/api/availability/{TEST_EVENT_ID}",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_ticket_type_availability():
    """Test specific ticket type availability"""
    start_time = time.time()
    try:
        response = requests.get(
            f"{BASE_URL}/api/availability/{TEST_EVENT_ID}/{TEST_TICKET_TYPE_ID}",
            params={"region": "USA"},
            timeout=TIMEOUT
        )
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/api/availability/{TEST_EVENT_ID}/{TEST_TICKET_TYPE_ID}",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_health_check():
    """Test basic health check"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/health",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def run_all_tests():
    """Run all availability tests"""
    print(f"🚀 Testing Availability Dashboard")
    print(f"Base URL: {BASE_URL}")
    print(f"Test Event: {TEST_EVENT_ID}")
    print(f"Test Ticket Type: {TEST_TICKET_TYPE_ID}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    tests = [
        ("Health Check", test_health_check),
        ("Dashboard HTML", test_dashboard_html),
        ("Dashboard Data API", test_dashboard_data),
        ("Event Availability", test_event_availability),
        ("Ticket Type Availability", test_ticket_type_availability),
    ]
    
    results = {}
    total_start = time.time()
    
    for test_name, test_func in tests:
        print(f"\n🧪 Running {test_name}...")
        results[test_name] = test_func()
        print_test_result(test_name, results[test_name])
        time.sleep(1)  # Small delay between tests
    
    # Summary
    total_duration = round((time.time() - total_start) * 1000, 2)
    successful = sum(1 for result in results.values() 
                    if result.get('status_code') in [200, 207])
    
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total Duration: {total_duration}ms")
    print(f"Tests Run: {len(tests)}")
    print(f"Successful: {successful}/{len(tests)}")
    
    # Show errors
    errors = [(name, result) for name, result in results.items() 
              if result.get('status_code') not in [200, 207] or 'error' in result]
    
    if errors:
        print(f"\n❌ Issues found:")
        for name, result in errors:
            status = result.get('status_code', 'ERROR')
            error = result.get('error', 'Unknown error')
            print(f"  {name}: {status} - {error}")
    else:
        print(f"\n✅ All tests passed!")
    
    print(f"\n💡 Next steps:")
    print(f"1. Visit {BASE_URL}/dashboard to see the live dashboard")
    print(f"2. Check {BASE_URL}/api/dashboard/data for JSON data")
    print(f"3. Deploy to production when ready")

def interactive_menu():
    """Interactive test menu"""
    while True:
        print(f"\n{'='*60}")
        print(f"VIVENU AVAILABILITY DASHBOARD - TEST MENU")
        print(f"{'='*60}")
        print(f"Base URL: {BASE_URL}")
        print(f"\nSelect a test:")
        print(f"1. Health Check")
        print(f"2. Dashboard HTML")
        print(f"3. Dashboard Data API")
        print(f"4. Event Availability")
        print(f"5. Ticket Type Availability")
        print(f"6. Run All Tests")
        print(f"7. Change Base URL")
        print(f"8. Exit")
        
        choice = input(f"\nEnter choice (1-8): ").strip()
        
        if choice == '1':
            print_test_result("Health Check", test_health_check())
        elif choice == '2':
            print_test_result("Dashboard HTML", test_dashboard_html())
        elif choice == '3':
            print_test_result("Dashboard Data API", test_dashboard_data())
        elif choice == '4':
            print_test_result("Event Availability", test_event_availability())
        elif choice == '5':
            print_test_result("Ticket Type Availability", test_ticket_type_availability())
        elif choice == '6':
            run_all_tests()
        elif choice == '7':
            global BASE_URL
            new_url = input("Enter new base URL (e.g., http://localhost:8787): ").strip()
            if new_url:
                BASE_URL = new_url
                print(f"✅ Base URL updated to: {BASE_URL}")
        elif choice == '8':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1-8.")

if __name__ == "__main__":
    try:
        import requests
    except ImportError:
        print("❌ Error: 'requests' library not found.")
        print("Install with: pip install requests")
        exit(1)
    
    # Check if we should run all tests or interactive menu
    import sys
    if len(sys.argv) > 1 and sys.argv[1] == "--all":
        run_all_tests()
    else:
        interactive_menu()