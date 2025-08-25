# Historical Sync Documentation

## Overview
The Historical Sync system pulls purchased tickets from Vivenu events and sends them to the HIA webhook endpoint as simulated `ticket.created` events. This allows processing of tickets that were sold before the webhook integration was set up.

## Architecture

### Components
1. **`pull_purchased_tickets.py`** - Retrieves purchased tickets from Vivenu API
2. **`historical_sync.py`** - Main orchestrator that pulls tickets and sends webhooks
3. **Progress tracking** - JSON files track sync progress per region

### Data Flow
```
Vivenu API (/api/tickets) 
    ↓ (pull purchased tickets)
historical_sync.py
    ↓ (filter tickets)
    ↓ (transform to webhook format)
HIA Webhook Endpoint
```

## Setup Requirements

### Environment Variables
Add to your `.env` file:
```bash
# API Keys for each region
DEV_API=your_dev_api_key
PROD_API=your_production_api_key
ITALY_API=your_italy_api_key
DACH_API=your_dach_api_key
# ... etc for each region
```

### Prerequisites
1. Python 3.x with required packages:
   ```bash
   pip install requests python-dotenv
   ```
2. Read-only API access to Vivenu
3. Ticket type IDs must be registered in the CloudFlare KV store

## Usage

### Test Mode
Test with a single ticket:
```bash
python historical_sync.py --test
```

### Full Event Sync
Sync all tickets from an event:
```bash
python historical_sync.py <REGION> <EVENT_ID>

# Examples:
python historical_sync.py DEV 6864d4f427c2aa9b05cd17ee
python historical_sync.py PROD 68108c20c5c88849372bfb61
python historical_sync.py ITALY 67abc123def456789
```

### Pull Tickets Only (No Webhook)
To just download ticket data without sending webhooks:
```bash
python pull_purchased_tickets.py <REGION> <EVENT_ID>
```

## Filtering Logic

The system applies two filters to tickets:

### 1. Status Filter
Only processes tickets with status:
- ✅ `VALID` - Active, valid tickets
- ✅ `DETAILSREQUIRED` - Tickets pending personalization
- ❌ `RESERVED` - Skipped
- ❌ `INVALID` - Skipped
- ❌ Any other status - Skipped

### 2. Charity Filter
Only processes tickets containing "CHARITY" in the ticket name:
- ✅ "HYROX MEN | CHARITY HIA"
- ✅ "CHARITY | HYROX DOUBLES WOMEN"
- ❌ "HYROX WOMEN" (no charity designation)
- ❌ "HYROX PRO MEN" (no charity designation)

## Rate Limiting

- **Ticket Pulling**: No rate limit (batches of 100)
- **Webhook Sending**: 1.8 seconds between each webhook
  - ~33 tickets per minute
  - ~2,000 tickets per hour
  - 1,000 tickets takes ~30 minutes

## Webhook Format

Each ticket is wrapped in a webhook envelope:
```json
{
  "id": "generated-uuid",
  "sellerId": "from-ticket",
  "type": "ticket.created",
  "mode": "prod",
  "data": {
    "ticket": {
      // Full ticket object from Vivenu API
      "_id": "ticket-id",
      "ticketName": "HYROX MEN | CHARITY HIA",
      "firstname": "John",
      "lastname": "Doe",
      "email": "john@example.com",
      "status": "VALID",
      "barcode": "ABC123",
      // ... all other ticket fields
    }
  }
}
```

## Progress Tracking

Progress is saved to `historical_sync_progress_<REGION>.json`:
```json
{
  "events_processed": ["event_id_1", "event_id_2"],
  "tickets_sent": 150,
  "errors": [],
  "last_run": "2025-07-29T15:30:00Z"
}
```

- Events are marked as processed after completion
- If interrupted, the sync will skip already-processed events
- Error details are logged for troubleshooting

## Output Files

### From `pull_purchased_tickets.py`:
```
purchased_tickets/
└── <event_id>/
    ├── all_tickets.json      # All tickets in one file
    ├── metadata.json         # Statistics and summary
    └── individual/           # Individual ticket files
        ├── HYgzx3nvev_Paddy McCann.json
        └── ...
```

### From `historical_sync.py`:
```
historical_sync_progress_<REGION>.json  # Progress tracking
```

## Endpoints

- **DEV/TEST**: `https://vivenu.dev/api/tickets`
- **PRODUCTION**: `https://vivenu.com/api/tickets`
- **Webhook (test)**: `https://vivenu-filter.high-impact-athletes.workers.dev/test-created`
- **Webhook (prod)**: `https://vivenu-filter.high-impact-athletes.workers.dev/ticket-created`

## Error Handling

1. **Network Errors**: Logged and sync continues with next ticket
2. **Invalid Ticket Data**: Skipped with warning
3. **Webhook Failures**: Logged in progress file with full error details
4. **API Rate Limits**: Built-in delays prevent hitting limits

## Best Practices

1. **Test First**: Always run with `--test` flag before full sync
2. **Monitor Progress**: Check console output for filtering results
3. **Verify KV Store**: Ensure ticket type IDs are registered before syncing
4. **Use Test Endpoint**: Test with `/test-created` before production
5. **Check Logs**: Review progress file for any errors

## Troubleshooting

### "ticketTypeId not found in KV store"
- The ticket type ID needs to be added to CloudFlare KV store
- This is expected for test/dev environments

### No tickets found
- Verify the event ID is correct
- Check that tickets have been sold for the event
- Ensure API key has proper permissions

### Webhook failures
- Check network connectivity
- Verify webhook endpoint is correct
- Review error details in progress file

## Example Full Workflow

1. **Pull tickets to review**:
   ```bash
   python pull_purchased_tickets.py PROD 68108c20c5c88849372bfb61
   ```

2. **Test with single ticket**:
   ```bash
   python historical_sync.py --test
   ```

3. **Run full sync**:
   ```bash
   python historical_sync.py PROD 68108c20c5c88849372bfb61
   ```

4. **Monitor output**:
   ```
   Found 1000 total tickets
   Filtering results:
     - Total tickets: 1000
     - Rejected (wrong status): 50
     - Rejected (not charity): 200
     - ✅ Tickets to send: 750
   ```

5. **Check progress**:
   ```bash
   cat historical_sync_progress_PROD.json
   ```

## Security Notes

- All operations are READ-ONLY from Vivenu
- No modifications are made to ticket data
- API keys should be kept secure in `.env` file
- Progress files may contain ticket IDs but no personal data

---
*Last Updated: July 29, 2025*