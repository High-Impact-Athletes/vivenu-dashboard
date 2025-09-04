# Vivenu Event Monitoring Worker - Requirements Specification

## Executive Summary
Build a Cloudflare Worker that monitors HYROX events across all Vivenu seller accounts, tracking event launch dates, ticket sales, and inventory in real-time. The system will subscribe to webhooks for event updates and perform daily polling for sales metrics, storing all data in a PostgreSQL database for analytics and reporting.

## System Architecture Overview

### Components
1. **Cloudflare Worker**: Main application hosting webhook endpoint and scheduled tasks
2. **Webhook Endpoint**: Receives `event.updated` notifications from Vivenu
3. **Scheduled Polling**: Daily cron job to fetch ticket sales data
4. **PostgreSQL Database**: Primary data storage for event metrics and historical tracking
5. **KV Storage**: Cache for API keys, event metadata, and rate limiting
6. **Google Sheets API**: Legacy export destination (optional)

### Data Flow
```
Vivenu Webhooks → Worker Endpoint → Process Event Updates → PostgreSQL Database
Cron Trigger → Worker → Poll All Events → Comprehensive Ticket Scraping → PostgreSQL Database
                                                                        ↓
                                                          (Optional) Google Sheets Export
```

## 1. Vivenu API Integration

### 1.1 Authentication Pattern
Based on the existing codebase, Vivenu uses Bearer token authentication:

```javascript
// Example from existing Python implementation
const headers = {
  'Authorization': `Bearer ${apiKey}`,
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};
```

### 1.2 API Endpoints
The worker needs to interact with these Vivenu endpoints:

```javascript
// Base URLs (auto-detect based on region)
const BASE_URLS = {
  PROD: 'https://vivenu.com/api',
  DEV: 'https://vivenu.dev/api'
};

// Key endpoints
GET /api/events           // List all events
GET /api/events/{id}      // Get event details with tickets
GET /api/tickets          // Get tickets with filtering
POST /api/webhooks        // Subscribe to webhooks
```

### 1.3 Multi-Region Configuration
Store API keys for all seller accounts in Cloudflare environment variables:

```javascript
// Environment variables needed
VIVENU_SECRET           // HMAC secret for webhook validation
DACH_API               // Germany, Austria, Switzerland
FRANCE_API             // France events
ITALY_API              // Italy events
BENELUX_API            // Netherlands, Belgium, Luxembourg
USA_API                // United States events
CANADA_API             // Canada events
AUSTRALIA_API          // Australia & Oceania
NORWAY_API             // Norway events
// ... additional regions as needed
```

## 2. Webhook Implementation

### 2.1 Webhook Subscription
Register webhook for `event.updated` events on each seller account:

```javascript
// Webhook registration payload
{
  "url": "https://your-worker.workers.dev/webhook/event-updated",
  "events": ["event.updated"],
  "active": true,
  "headers": {
    "X-Custom-Auth": "your-secret-token"
  }
}
```

### 2.2 Webhook Payload Structure
Based on the existing ticket.created webhook example:

```javascript
// Expected event.updated webhook structure
{
  "id": "webhook-uuid",
  "sellerId": "seller-account-id",
  "webhookId": "webhook-config-id",
  "type": "event.updated",
  "mode": "prod",
  "data": {
    "event": {
      "_id": "event-id",
      "name": "HYROX Berlin 2025",
      "start": "2025-05-17T08:00:00Z",
      "salesStart": "2025-01-15T10:00:00Z",  // Ticket sales launch date
      "status": "PUBLISHED",
      "tickets": [...],  // If included
      // ... other event fields
    }
  }
}
```

### 2.3 HMAC Signature Validation
Validate webhook authenticity using HMAC-SHA256:

```javascript
async function validateWebhookSignature(payload, signature, secret) {
  const encoder = new TextEncoder();
  const data = encoder.encode(payload);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, data);
  const computedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return computedSignature === signature;
}
```

## 3. Daily Polling Implementation

### 3.1 Scheduled Trigger
Configure Cloudflare cron trigger for daily execution:

```javascript
// wrangler.toml
[triggers]
crons = ["0 2 * * *"]  // Daily at 2 AM UTC
```

### 3.2 Event Discovery
Poll all events from each seller account:

```javascript
async function getAllEvents(region, apiKey) {
  const baseUrl = getBaseUrl(region);
  const allEvents = [];
  let skip = 0;
  const batchSize = 100;
  
  while (true) {
    const response = await fetch(`${baseUrl}/events?top=${batchSize}&skip=${skip}`, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    const data = await response.json();
    const events = data.rows || [];
    allEvents.push(...events);
    
    if (events.length === 0 || allEvents.length >= data.total) {
      break;
    }
    skip += events.length;
  }
  
  return allEvents;
}
```

### 3.3 Ticket Sales Data Collection
For each event, collect ticket inventory and sales:

```javascript
async function getTicketMetrics(eventId, apiKey, region) {
  const baseUrl = getBaseUrl(region);
  
  // Get event with ticket types
  const eventResponse = await fetch(`${baseUrl}/events/${eventId}?include=tickets`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  const event = await eventResponse.json();
  
  // Get purchased tickets count
  const ticketsResponse = await fetch(`${baseUrl}/tickets?event=${eventId}&top=1`, {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    }
  });
  
  const ticketsData = await ticketsResponse.json();
  const totalSold = ticketsData.total || 0;
  
  // Calculate available tickets
  const ticketTypes = event.tickets || [];
  const totalCapacity = ticketTypes.reduce((sum, t) => sum + (t.amount || 0), 0);
  const totalAvailable = totalCapacity - totalSold;
  
  return {
    eventId: event._id,
    eventName: event.name,
    eventDate: event.start,
    salesStartDate: event.salesStart,
    totalCapacity,
    totalSold,
    totalAvailable,
    ticketTypes: ticketTypes.map(t => ({
      id: t._id,
      name: t.name,
      price: t.price,
      capacity: t.amount,
      sold: t.sold || 0,  // If available
      available: (t.amount || 0) - (t.sold || 0)
    }))
  };
}
```

**UNCERTAINTY**: The exact field names for ticket inventory (sold/available) may vary. The existing codebase shows `amount` for capacity, but the sold count field needs verification.

## 4. PostgreSQL Database Integration

### 4.1 Database Connection
Use Neon PostgreSQL with connection pooling:

```javascript
// Environment variables needed
DATABASE_URL  // Primary requirement - Neon PostgreSQL connection string

// Optional legacy Google Sheets support
GOOGLE_SERVICE_ACCOUNT_EMAIL
GOOGLE_PRIVATE_KEY
GOOGLE_SHEET_ID
```

### 4.2 Database Schema
PostgreSQL tables for comprehensive event tracking:

```sql
-- Core event metadata
CREATE TABLE events (
  event_id VARCHAR PRIMARY KEY,
  event_name VARCHAR NOT NULL,
  event_date TIMESTAMP,
  sales_start_date TIMESTAMP,
  region VARCHAR NOT NULL,
  status VARCHAR NOT NULL
);

-- Ticket type definitions
CREATE TABLE ticket_types (
  event_id VARCHAR NOT NULL,
  ticket_type_id VARCHAR NOT NULL,
  ticket_type_name VARCHAR NOT NULL,
  PRIMARY KEY (event_id, ticket_type_id)
);

-- Time-series event snapshots
CREATE TABLE event_snapshots (
  snapshot_time TIMESTAMP NOT NULL,
  event_id VARCHAR NOT NULL,
  total_capacity INTEGER,
  total_sold INTEGER,
  total_available INTEGER,
  percent_sold DECIMAL,
  last_updated TIMESTAMP
);

-- Time-series ticket type snapshots
CREATE TABLE ticket_type_snapshots (
  snapshot_time TIMESTAMP NOT NULL,
  event_id VARCHAR NOT NULL,
  ticket_type_id VARCHAR NOT NULL,
  capacity INTEGER,
  sold INTEGER,
  available INTEGER
);
```

### 4.3 Data Storage Strategy
- Use PostgreSQL transactions for atomic updates
- Upsert event metadata and ticket types
- Insert time-series snapshots for historical tracking
- Comprehensive scraping provides accurate sold counts
- Optimized for analytical queries and reporting

## 5. Worker Implementation Structure

### 5.1 Main Worker File
```javascript
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    if (url.pathname === '/webhook/event-updated' && request.method === 'POST') {
      return handleEventUpdatedWebhook(request, env);
    }
    
    if (url.pathname === '/health') {
      return new Response('OK', { status: 200 });
    }
    
    return new Response('Not Found', { status: 404 });
  },
  
  async scheduled(event, env, ctx) {
    // Daily polling logic
    await pollAllEventsAndUpdateSheets(env);
  }
};
```

### 5.2 Region Configuration
```javascript
const REGIONS = [
  { name: 'DACH', apiKey: 'DACH_API', baseUrl: 'PROD' },
  { name: 'FRANCE', apiKey: 'FRANCE_API', baseUrl: 'PROD' },
  { name: 'ITALY', apiKey: 'ITALY_API', baseUrl: 'PROD' },
  { name: 'BENELUX', apiKey: 'BENELUX_API', baseUrl: 'PROD' },
  { name: 'USA', apiKey: 'USA_API', baseUrl: 'PROD' },
  { name: 'CANADA', apiKey: 'CANADA_API', baseUrl: 'PROD' },
  { name: 'AUSTRALIA', apiKey: 'AUSTRALIA_API', baseUrl: 'PROD' },
  { name: 'NORWAY', apiKey: 'NORWAY_API', baseUrl: 'PROD' }
];
```

## 6. Error Handling & Resilience

### 6.1 Rate Limiting
Implement rate limiting to avoid API throttling:

```javascript
// Use Cloudflare KV for rate limit tracking
async function checkRateLimit(env, region) {
  const key = `ratelimit:${region}`;
  const limit = 100; // requests per minute
  const window = 60; // seconds
  
  const current = await env.KV.get(key);
  if (current && parseInt(current) >= limit) {
    throw new Error(`Rate limit exceeded for ${region}`);
  }
  
  await env.KV.put(key, (parseInt(current || 0) + 1).toString(), {
    expirationTtl: window
  });
}
```

### 6.2 Retry Logic
Implement exponential backoff for failed requests:

```javascript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      
      if (response.status === 429) {
        // Rate limited - wait longer
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 5000));
        continue;
      }
      
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 6.3 Logging
Use Cloudflare Logpush or console logs for monitoring:

```javascript
function log(level, message, data = {}) {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data
  }));
}
```

## 7. Deployment Configuration

### 7.1 Wrangler Configuration
```toml
name = "vivenu-event-monitor"
main = "src/index.js"
compatibility_date = "2024-01-01"

[env.production]
kv_namespaces = [
  { binding = "KV", id = "your-kv-namespace-id" }
]

[triggers]
crons = ["0 2 * * *"]

[vars]
GOOGLE_SHEET_ID = "your-sheet-id"  # Optional - legacy support only
```

### 7.2 Environment Variables
```bash
# Set via wrangler secret

# Primary database (REQUIRED)
wrangler secret put DATABASE_URL

# Regional API keys
wrangler secret put VIVENU_SECRET
wrangler secret put DACH_API
wrangler secret put FRANCE_API
wrangler secret put ITALY_API
wrangler secret put BENELUX_API
wrangler secret put USA_API
wrangler secret put CANADA_API
wrangler secret put AUSTRALIA_API
wrangler secret put NORWAY_API

# Optional legacy Google Sheets support
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY
```

## 8. Testing Strategy

### 8.1 Local Development
Use Miniflare for local testing:

```javascript
// test-local.js
const { Miniflare } = require('miniflare');

const mf = new Miniflare({
  script: './src/index.js',
  kvNamespaces: ['KV'],
  bindings: {
    VIVENU_SECRET: 'test-secret',
    DACH_API: 'test-api-key'
  }
});
```

### 8.2 Integration Tests
Test with DEV Vivenu environment first:

```javascript
// Use DEV API keys and endpoints
const DEV_CONFIG = {
  baseUrl: 'https://vivenu.dev/api',
  apiKey: process.env.DEV_API,
  testEventId: '6864d4f427c2aa9b05cd17ee' // From existing codebase
};
```

## 9. Monitoring & Alerts

### 9.1 Key Metrics
- Webhook processing latency
- Daily poll completion rate
- API error rates by region
- PostgreSQL write success rate
- Database connection health
- Scraping accuracy and completeness

### 9.2 Alerting
Set up Cloudflare Analytics alerts for:
- Worker errors > threshold
- Execution time > 30 seconds
- KV storage usage > 80%

## 10. Security Considerations

### 10.1 Secrets Management
- Never log API keys or sensitive data
- Use Cloudflare secrets for all credentials
- Rotate API keys regularly

### 10.2 Input Validation
- Validate all webhook payloads
- Sanitize data before Google Sheets export
- Implement request size limits

## 11. Areas of Uncertainty

### 11.1 Webhook Registration
**UNCERTAINTY**: The exact process for registering webhooks with Vivenu is not documented in the existing codebase. You may need to:
- Use Vivenu's admin dashboard to register webhooks manually
- Or use their API endpoint (likely `POST /api/webhooks`)
- Contact Vivenu support for webhook setup documentation

### 11.2 Ticket Inventory Fields
**UNCERTAINTY**: The exact field names for real-time ticket availability may vary:
- The codebase shows `amount` for total capacity
- But the fields for `sold` and `available` counts need verification
- May need to calculate from purchased tickets count

### 11.3 Event Status Values
**UNCERTAINTY**: The complete list of event status values is not clear:
- Seen: `PUBLISHED`, `DRAFT`
- May include: `CANCELLED`, `POSTPONED`, `SOLDOUT`
- Verify with Vivenu API documentation

### 11.4 Rate Limits
**UNCERTAINTY**: Vivenu API rate limits are not documented in the codebase:
- Assume conservative limits (100 requests/minute)
- Monitor 429 responses and adjust accordingly
- May vary by endpoint and account type

## 12. Migration from Existing System

### 12.1 Transition Plan
1. Deploy worker in monitoring-only mode
2. Run parallel to any existing systems
3. Validate data accuracy for 1 week
4. Switch over once confidence established

### 12.2 Historical Data
- Use the existing `historical_sync.py` pattern for initial data load
- Backfill Google Sheets with historical event data if needed

## 13. Example Implementation References

### 13.1 API Authentication (from pull_all_tickets.py)
```python
headers = {
    "Authorization": f"Bearer {self.api_key}",
    "Content-Type": "application/json",
    "Accept": "application/json"
}
```

### 13.2 Pagination Pattern (from historical_sync.py)
```python
while True:
    url = f"{self.base_url}/tickets"
    params = {"event": event_id, "top": batch_size, "skip": skip}
    response = requests.get(url, headers=self.headers, params=params)
    data = response.json()
    tickets = data.get("rows", [])
    total = data.get("total", 0)
    all_tickets.extend(tickets)
    if len(tickets) == 0 or len(all_tickets) >= total:
        break
    skip += len(tickets)
```

### 13.3 HMAC Validation (from historical_sync.py)
```python
signature = hmac.new(
    self.vivenu_secret.encode('utf-8'),
    payload.encode('utf-8'),
    hashlib.sha256
).hexdigest()
```

## 14. Success Criteria

The worker will be considered successful when it:
1. ✅ Receives and processes event.updated webhooks within 5 seconds
2. ✅ Completes daily polling of all regions within 10 minutes (comprehensive scraping)
3. ✅ Writes to PostgreSQL database with < 0.1% error rate
4. ✅ Maintains 99.9% uptime
5. ✅ Provides accurate real-time visibility into all HYROX events globally
6. ✅ Achieves >95% ticket scraping completeness for reliable sold counts

## 15. Next Steps

1. **Create new repository** for the Cloudflare Worker project
2. **Set up Cloudflare account** and Workers environment
3. **Configure Google Cloud** service account for Sheets API
4. **Implement core worker** with webhook endpoint
5. **Add polling logic** for daily ticket metrics
6. **Integrate Google Sheets** export
7. **Deploy to staging** with DEV Vivenu account
8. **Test thoroughly** with real webhook events
9. **Deploy to production** with all region API keys
10. **Monitor and iterate** based on performance

---

## Appendix A: Useful Resources

- Vivenu API Documentation: (Request from Vivenu support)
- Cloudflare Workers: https://developers.cloudflare.com/workers/
- Google Sheets API: https://developers.google.com/sheets/api
- Existing codebase patterns: `/scripts/`, `/utils/` directories

## Appendix B: Contact Information

For questions about:
- **Vivenu API**: Contact Vivenu technical support
- **HYROX accounts**: Contact HYROX operations team
- **Implementation details**: Reference this specification and existing codebase

---

*Specification Version: 1.0*
*Date: 2025-08-23*
*Status: Ready for implementation*