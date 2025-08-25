#!/usr/bin/env python3
"""
Vivenu Event Monitor - Endpoint Testing Script

This script provides easy testing of the worker endpoints without requiring
approval for each curl command. Run with: python test_endpoints.py
"""

import requests
import json
import time
from typing import Dict, Any, Optional
from datetime import datetime

# Configuration
BASE_URL = "https://vivenu-event-monitor.high-impact-athletes.workers.dev"
TIMEOUT = 30  # seconds

def format_response(response: requests.Response, start_time: float) -> Dict[str, Any]:
    """Format response for consistent display"""
    duration = round((time.time() - start_time) * 1000, 2)  # ms
    
    try:
        response_data = response.json()
    except:
        response_data = response.text
    
    return {
        "url": response.url,
        "status_code": response.status_code,
        "duration_ms": duration,
        "headers": dict(response.headers),
        "data": response_data
    }

def print_result(test_name: str, result: Dict[str, Any]) -> None:
    """Print test result in a formatted way"""
    print(f"\n{'='*60}")
    print(f"TEST: {test_name}")
    print(f"{'='*60}")
    print(f"URL: {result['url']}")
    print(f"Status: {result['status_code']}")
    print(f"Duration: {result['duration_ms']}ms")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"\nResponse:")
    print(json.dumps(result['data'], indent=2))

def test_health() -> Dict[str, Any]:
    """Test the health endpoint"""
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

def test_google_auth() -> Dict[str, Any]:
    """Test Google Sheets authentication"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/test/google-auth", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/test/google-auth",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_ticket_data() -> Dict[str, Any]:
    """Test ticket data structure inspection"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/test/ticket-data", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/test/ticket-data",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_manual_poll_dach() -> Dict[str, Any]:
    """Test manual poll for DACH region only"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/poll/manual?region=DACH", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/poll/manual?region=DACH",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_manual_poll_all() -> Dict[str, Any]:
    """Test manual poll for all regions"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/poll/manual", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/poll/manual",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def test_status() -> Dict[str, Any]:
    """Test the status endpoint"""
    start_time = time.time()
    try:
        response = requests.get(f"{BASE_URL}/status", timeout=TIMEOUT)
        return format_response(response, start_time)
    except Exception as e:
        return {
            "url": f"{BASE_URL}/status",
            "error": str(e),
            "duration_ms": round((time.time() - start_time) * 1000, 2)
        }

def run_test(test_name: str, test_func):
    """Run a single test and print results"""
    print(f"\n🧪 Running {test_name}...")
    result = test_func()
    print_result(test_name, result)
    return result

def run_all_tests():
    """Run all tests in sequence"""
    tests = [
        ("Health Check", test_health),
        ("Status Check", test_status),
        ("Google Auth Test", test_google_auth),
        ("Ticket Data Test", test_ticket_data),
        ("Manual Poll (DACH)", test_manual_poll_dach),
    ]
    
    print(f"🚀 Running all tests against {BASE_URL}")
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    results = {}
    total_start = time.time()
    
    for test_name, test_func in tests:
        results[test_name] = run_test(test_name, test_func)
        time.sleep(1)  # Small delay between tests
    
    total_duration = round((time.time() - total_start) * 1000, 2)
    
    # Summary
    print(f"\n{'='*60}")
    print(f"SUMMARY")
    print(f"{'='*60}")
    print(f"Total Duration: {total_duration}ms")
    print(f"Tests Run: {len(tests)}")
    
    successful = sum(1 for result in results.values() if result.get('status_code') == 200)
    print(f"Successful: {successful}/{len(tests)}")
    
    # Show any errors
    errors = [(name, result) for name, result in results.items() 
              if result.get('status_code') not in [200, 207] or 'error' in result]
    
    if errors:
        print(f"\n❌ Issues found:")
        for name, result in errors:
            status = result.get('status_code', 'ERROR')
            error = result.get('error', result.get('data', {}).get('errors', ['Unknown error']))
            print(f"  {name}: {status} - {error}")
    else:
        print(f"\n✅ All tests passed!")

def interactive_menu():
    """Interactive menu for running specific tests"""
    while True:
        print(f"\n{'='*60}")
        print(f"VIVENU EVENT MONITOR - ENDPOINT TESTER")
        print(f"{'='*60}")
        print(f"Base URL: {BASE_URL}")
        print(f"\nSelect a test to run:")
        print(f"1. Health Check")
        print(f"2. Status Check") 
        print(f"3. Google Auth Test")
        print(f"4. Ticket Data Test")
        print(f"5. Manual Poll (DACH only)")
        print(f"6. Manual Poll (All regions)")
        print(f"7. Run All Tests")
        print(f"8. Exit")
        
        choice = input(f"\nEnter choice (1-8): ").strip()
        
        if choice == '1':
            run_test("Health Check", test_health)
        elif choice == '2':
            run_test("Status Check", test_status)
        elif choice == '3':
            run_test("Google Auth Test", test_google_auth)
        elif choice == '4':
            run_test("Ticket Data Test", test_ticket_data)
        elif choice == '5':
            run_test("Manual Poll (DACH)", test_manual_poll_dach)
        elif choice == '6':
            run_test("Manual Poll (All regions)", test_manual_poll_all)
        elif choice == '7':
            run_all_tests()
        elif choice == '8':
            print("👋 Goodbye!")
            break
        else:
            print("❌ Invalid choice. Please enter 1-8.")

if __name__ == "__main__":
    # Check if requests is available
    try:
        import requests
    except ImportError:
        print("❌ Error: 'requests' library not found.")
        print("Install with: pip install requests")
        exit(1)
    
    interactive_menu()