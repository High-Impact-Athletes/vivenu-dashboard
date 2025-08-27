# vVenue Availability Dashboard Setup Guide

## Overview
The vVenue Availability Dashboard provides real-time tracking of ticket availability across all events and regions. It calculates sold vs. available tickets by querying the vVenue API and displays the data in an intuitive web interface.

## Features
- ✅ **Real-time availability tracking** - Live ticket sold/available counts
- ✅ **Multi-region support** - Track events across all vVenue regions
- ✅ **Visual progress indicators** - Color-coded status (available/limited/sold out)
- ✅ **Caching optimization** - 5-minute cache to reduce API load
- ✅ **Auto-refresh dashboard** - Updates every 2 minutes
- ✅ **Mobile responsive** - Works on all device sizes
- ✅ **API endpoints** - Programmatic access to availability data

## Architecture
```
Dashboard Frontend (HTML/JS) 
    ↓
API Endpoints (/api/availability, /api/dashboard/data)
    ↓  
Availability Service (calculates sold vs capacity)
    ↓
vVenue API (events + tickets count)
    ↓
KV Cache (5min TTL)
```

## Prerequisites
1. **Node.js** and **npm** installed
2. **Wrangler CLI** for Cloudflare Workers
3. **vVenue API keys** for each region
4. **Environment variables** configured (see below)

## Setup Instructions

### 1. Install Dependencies
```bash
cd vivenu-event-monitor
npm install
```

### 2. Configure Environment Variables

#### Local Development (.env file)
Create a `.env` file in the root directory:
```bash
# Copy from existing .env file - it should already have:
VIVENU_SECRET=your-secret
DACH_API=your-dach-api-key
FRANCE_API=your-france-api-key
ITALY_API=your-italy-api-key
BENELUX_API=your-benelux-api-key
SWITZERLAND_API=your-switzerland-api-key
USA_API=your-usa-api-key
CANADA_API=your-canada-api-key
AUSTRALIA_API=your-australia-api-key
NORWAY_API=your-norway-api-key

# Event IDs for each region
FRANKFURT_EVENT=your-event-id
NICE_EVENT=your-event-id
ATLANTA25_EVENT=6894f94a097ce9a51c15cef4
# ... (other event IDs)
```

#### Production (Cloudflare Secrets)
The wrangler.toml is already configured. Set secrets via:
```bash
wrangler secret put USA_API
wrangler secret put DACH_API
# ... (other API keys as listed in wrangler.toml)
```

### 3. Local Development Testing

#### Start the Development Server
```bash
npm run dev
# or
wrangler dev --env development
```
This starts the worker locally at `http://localhost:8787`

#### Test the Endpoints
```bash
# Run the availability test script
python test_availability.py

# Or manually test endpoints:
curl http://localhost:8787/health
curl http://localhost:8787/api/dashboard/data
curl http://localhost:8787/api/availability/6894f94a097ce9a51c15cef4?region=USA
```

#### View the Dashboard
Open your browser to:
- **Dashboard**: `http://localhost:8787/dashboard`
- **API Data**: `http://localhost:8787/api/dashboard/data`

### 4. Production Deployment
```bash
# Deploy to staging
wrangler deploy --env staging

# Deploy to production
wrangler deploy
```

## API Endpoints

### Dashboard
- `GET /dashboard` - HTML dashboard interface
- `GET /` - Same as /dashboard

### Availability Data
- `GET /api/dashboard/data` - Complete dashboard data (all events)
- `GET /api/availability/{eventId}` - Single event availability
- `GET /api/availability/{eventId}/{ticketTypeId}` - Specific ticket type
- `GET /api/availability/{eventId}/shop/{shopId}` - Shop-specific sales

### Query Parameters
- `?region=USA` - Filter by specific region
- `?includeShops=true` - Include shop breakdown

### Example Responses

#### Dashboard Data (`/api/dashboard/data`)
```json
{
  "events": [
    {
      "eventId": "6894f94a097ce9a51c15cef4",
      "eventName": "HYROX Atlanta",
      "eventDate": "2025-03-15T10:00:00Z",
      "region": "USA",
      "totals": {
        "capacity": 2500,
        "sold": 1847,
        "available": 653,
        "percentSold": 73.88,
        "status": "limited"
      },
      "ticketTypes": [
        {
          "id": "6894f94a097ce9a51c15cf20",
          "name": "CHARITY | HYROX WOMEN | Sunday",
          "capacity": 50,
          "sold": 35,
          "available": 15,
          "percentSold": 70.0,
          "status": "limited",
          "price": 0
        }
      ],
      "lastUpdated": "2025-08-27T14:30:00Z"
    }
  ],
  "summary": {
    "totalEvents": 15,
    "totalCapacity": 45000,
    "totalSold": 32150,
    "totalAvailable": 12850,
    "avgPercentSold": 71.4,
    "eventsNearSoldOut": 8,
    "eventsSoldOut": 2
  }
}
```

## How It Works

### Availability Calculation
Since vVenue doesn't provide direct availability data, the system calculates it by:

1. **Get Event Capacity**: Query `/api/events/{id}?include=tickets` for ticket type amounts
2. **Get Sold Count**: Query `/api/tickets?event={id}&top=1` for total sold
3. **Calculate**: `available = capacity - sold`

### Caching Strategy
- **5-minute cache** in Cloudflare KV for availability data
- **Stale-while-revalidate** pattern for better performance
- **Per-event caching** to optimize API usage

### Status Classification
- **Available**: < 80% sold (green)
- **Limited**: 80-99% sold (yellow)  
- **Sold Out**: 100% sold (red)

## Troubleshooting

### Common Issues

#### 1. "Region not found" errors
- Check that API keys are configured for the region
- Verify event IDs are mapped correctly in `.env`

#### 2. Rate limiting
- The service includes built-in rate limiting (100 requests/minute)
- Cached responses reduce API load

#### 3. Local development not working
- Ensure `.env` file has all required variables
- Check that `wrangler dev` is using the correct environment

#### 4. Dashboard shows no data
- Check browser console for API errors
- Verify `/api/dashboard/data` returns valid JSON
- Check that events are configured in environment

### Debug Endpoints
```bash
# Check health
curl http://localhost:8787/health

# Test specific event
curl "http://localhost:8787/api/availability/6894f94a097ce9a51c15cef4?region=USA"

# View all dashboard data
curl http://localhost:8787/api/dashboard/data | jq .
```

### Logs and Monitoring
- Development: Check console output from `wrangler dev`
- Production: View logs in Cloudflare dashboard
- KV usage: Monitor in Cloudflare KV dashboard

## Performance Considerations

### API Usage Optimization
- **Caching**: 5-minute TTL reduces API calls by ~90%
- **Proportional estimation**: Estimates ticket-type breakdown to avoid per-type queries
- **Batch processing**: Processes multiple events efficiently

### Rate Limiting
- Built-in 100 requests/minute limit per region
- Exponential backoff on API failures
- Queue system for batch operations

### Caching Headers
- Dashboard HTML: 5-minute cache
- API responses: 1-minute cache
- Static assets: Longer cache times

## Extending the Dashboard

### Adding New Metrics
1. Update `AvailabilityService` in `src/services/availability.ts`
2. Add new fields to types in `src/types/availability.ts`
3. Update dashboard HTML to display new metrics

### Adding New Endpoints
1. Add routes to `src/handlers/availability.ts`
2. Update routing in `src/index.ts`
3. Add tests to `test_availability.py`

### Custom Alert System
The foundation is in place for alerts when events near sold-out status. See `AvailabilityAlert` type for structure.

## Production Checklist

Before deploying to production:

- ✅ All API keys configured as secrets
- ✅ Event IDs properly mapped in environment
- ✅ KV namespace created and bound
- ✅ Cron triggers configured (optional)
- ✅ Local testing passed
- ✅ Dashboard displays correctly
- ✅ Performance tested with real data

## Support

For issues with:
- **vVenue API**: Check vVenue documentation
- **Cloudflare Workers**: Check Wrangler docs
- **Dashboard functionality**: Check browser console and worker logs