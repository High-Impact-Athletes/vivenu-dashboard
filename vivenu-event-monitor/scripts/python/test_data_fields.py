#!/usr/bin/env python3
"""
Test vVenue Data Fields API for Atlanta25 Event
This script tests the data fields configured for checkout on specific ticket types
"""

import os
import json
import requests
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
env_path = Path(__file__).parent / '.env'
load_dotenv(env_path)

# Configuration
BASE_URL = "https://vivenu.com/api"
USA_API_KEY = os.getenv('USA_API')

# Atlanta25 specific IDs
ATLANTA25_EVENT_ID = "6894f94a097ce9a51c15cef4"
TICKET_TYPE_ID = "6894f94a097ce9a51c15cf20"

def get_headers():
    """Get authorization headers for API requests"""
    return {
        'Authorization': f'Bearer {USA_API_KEY}',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }

def get_seller_id():
    """Get seller ID from the event"""
    url = f"{BASE_URL}/events/{ATLANTA25_EVENT_ID}"
    response = requests.get(url, headers=get_headers())
    
    if response.status_code == 200:
        event_data = response.json()
        return event_data.get('sellerId')
    else:
        print(f"❌ Failed to get event data: {response.status_code}")
        print(response.text)
        return None

def test_data_fields_resolve(seller_id):
    """Test the data fields resolve endpoint with different parameters"""
    
    print("\n" + "="*80)
    print("TESTING DATA FIELDS API FOR ATLANTA25")
    print("="*80)
    
    test_cases = [
        {
            "name": "Data Fields for Specific Ticket Type (CHECKOUT scope)",
            "params": {
                "sellerId": seller_id,
                "scope": "CHECKOUT",
                "ticketTypeId": TICKET_TYPE_ID,
                "eventId": ATLANTA25_EVENT_ID
            }
        },
        {
            "name": "Data Fields for Event Level (CHECKOUT scope)",
            "params": {
                "sellerId": seller_id,
                "scope": "CHECKOUT",
                "eventId": ATLANTA25_EVENT_ID
            }
        },
        {
            "name": "Data Fields for Customer Scope",
            "params": {
                "sellerId": seller_id,
                "scope": "CUSTOMER",
                "eventId": ATLANTA25_EVENT_ID,
                "ticketTypeId": TICKET_TYPE_ID
            }
        },
        {
            "name": "Data Fields for Ticket Scope",
            "params": {
                "sellerId": seller_id,
                "scope": "TICKET",
                "eventId": ATLANTA25_EVENT_ID,
                "ticketTypeId": TICKET_TYPE_ID
            }
        }
    ]
    
    for test_case in test_cases:
        print(f"\n🧪 Test: {test_case['name']}")
        print("-" * 60)
        
        url = f"{BASE_URL}/data-fields/resolve"
        
        try:
            response = requests.get(url, params=test_case['params'], headers=get_headers())
            
            print(f"URL: {response.url}")
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data_fields = response.json()
                
                if not data_fields:
                    print("✅ No data fields configured for this scope/context")
                else:
                    print(f"\n✅ Found {len(data_fields)} data field(s):")
                    
                    for idx, field in enumerate(data_fields, 1):
                        print(f"\n  Field #{idx}:")
                        print(f"    ID: {field.get('_id', 'N/A')}")
                        print(f"    Name: {field.get('name', 'N/A')}")
                        print(f"    Type: {field.get('type', 'N/A')}")
                        print(f"    Slug: {field.get('slug', 'N/A')}")
                        
                        if field.get('description'):
                            print(f"    Description: {field.get('description')}")
                        
                        if field.get('options'):
                            print(f"    Options: {', '.join(field.get('options'))}")
                        
                        if field.get('title'):
                            print(f"    Title: {field.get('title')}")
                        
                        # Check for any additional fields
                        known_fields = {'_id', 'name', 'type', 'slug', 'description', 'options', 'title'}
                        additional = {k: v for k, v in field.items() if k not in known_fields}
                        if additional:
                            print(f"    Additional Properties: {json.dumps(additional, indent=6)}")
                
            else:
                print(f"❌ Request failed: {response.status_code}")
                print(f"Response: {response.text}")
                
        except Exception as e:
            print(f"❌ Error: {str(e)}")

def get_ticket_type_details():
    """Get details about the specific ticket type"""
    print("\n" + "="*80)
    print(f"TICKET TYPE DETAILS (ID: {TICKET_TYPE_ID})")
    print("="*80)
    
    url = f"{BASE_URL}/events/{ATLANTA25_EVENT_ID}?include=tickets"
    
    try:
        response = requests.get(url, headers=get_headers())
        
        if response.status_code == 200:
            event_data = response.json()
            tickets = event_data.get('tickets', [])
            
            # Find our specific ticket type
            ticket_type = None
            for ticket in tickets:
                if ticket.get('_id') == TICKET_TYPE_ID:
                    ticket_type = ticket
                    break
            
            if ticket_type:
                print(f"\n✅ Found Ticket Type:")
                print(f"  Name: {ticket_type.get('name', 'N/A')}")
                print(f"  Price: ${ticket_type.get('price', 0)}")
                print(f"  Amount/Capacity: {ticket_type.get('amount', 'N/A')}")
                print(f"  Status: {ticket_type.get('status', 'N/A')}")
                
                # Check if there are data field references
                if 'dataFields' in ticket_type:
                    print(f"\n  Data Fields References:")
                    print(f"    {json.dumps(ticket_type['dataFields'], indent=6)}")
                
                # Check for any field configuration
                if 'fields' in ticket_type:
                    print(f"\n  Fields Configuration:")
                    print(f"    {json.dumps(ticket_type['fields'], indent=6)}")
                    
                # Look for any other field-related properties
                field_related = {k: v for k, v in ticket_type.items() 
                               if 'field' in k.lower() or 'data' in k.lower() or 'question' in k.lower()}
                if field_related:
                    print(f"\n  Other Field-Related Properties:")
                    for key, value in field_related.items():
                        print(f"    {key}: {value}")
                
            else:
                print(f"❌ Ticket type {TICKET_TYPE_ID} not found in event")
                print(f"\n📋 Available ticket types in this event:")
                for ticket in tickets:
                    print(f"  - {ticket.get('name')} (ID: {ticket.get('_id')})")
        else:
            print(f"❌ Failed to get event details: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def get_all_data_fields(seller_id):
    """Get all data fields for the seller to see what's available"""
    print("\n" + "="*80)
    print("ALL DATA FIELDS FOR SELLER")
    print("="*80)
    
    url = f"{BASE_URL}/data-fields"
    
    try:
        response = requests.get(url, headers=get_headers())
        
        if response.status_code == 200:
            all_fields = response.json()
            
            if not all_fields:
                print("No data fields found for this seller")
            else:
                print(f"\n✅ Found {len(all_fields)} total data field(s) for seller:")
                
                for idx, field in enumerate(all_fields, 1):
                    print(f"\n  Field #{idx}:")
                    print(f"    ID: {field.get('_id', 'N/A')}")
                    print(f"    Name: {field.get('name', 'N/A')}")
                    print(f"    Type: {field.get('type', 'N/A')}")
                    print(f"    Slug: {field.get('slug', 'N/A')}")
                    
                    if field.get('title'):
                        print(f"    Title: {field.get('title')}")
                    
                    if field.get('description'):
                        print(f"    Description: {field.get('description')}")
                    
                    if field.get('isPersonalData'):
                        print(f"    Is Personal Data: {field.get('isPersonalData')}")
                    
                    if field.get('options'):
                        print(f"    Options: {', '.join(field.get('options'))}")
                    
                    if field.get('settings'):
                        print(f"    Settings: {json.dumps(field.get('settings'), indent=6)}")
                        
        else:
            print(f"❌ Failed to get all data fields: {response.status_code}")
            print(response.text)
            
    except Exception as e:
        print(f"❌ Error: {str(e)}")

def main():
    """Main function to run all tests"""
    
    # Check if API key is configured
    if not USA_API_KEY:
        print("❌ USA_API key not found in .env file")
        return
    
    print(f"🔑 Using USA API Key: {USA_API_KEY[:20]}...")
    print(f"📅 Event ID: {ATLANTA25_EVENT_ID}")
    print(f"🎫 Ticket Type ID: {TICKET_TYPE_ID}")
    
    # Get seller ID first
    print("\n📡 Getting seller ID from event...")
    seller_id = get_seller_id()
    
    if not seller_id:
        print("❌ Could not retrieve seller ID. Exiting.")
        return
    
    print(f"✅ Seller ID: {seller_id}")
    
    # Run tests
    get_ticket_type_details()
    test_data_fields_resolve(seller_id)
    get_all_data_fields(seller_id)
    
    print("\n" + "="*80)
    print("✅ All tests completed!")
    print("="*80)

if __name__ == "__main__":
    main()