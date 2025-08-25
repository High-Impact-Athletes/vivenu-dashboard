# Vivenu Event Monitor

A Cloudflare Worker that monitors HYROX events across all Vivenu seller accounts, tracking event launch dates, ticket sales, and inventory in real-time. The system subscribes to webhooks for event updates and performs daily polling for sales metrics, exporting all data to Google Sheets for analytics.

## Architecture

- **Cloudflare Worker**: Main application hosting webhook endpoint and scheduled tasks
- **Webhook Endpoint**: Receives `event.updated` notifications from Vivenu
- **Scheduled Polling**: Daily cron job to fetch ticket sales data
- **Google Sheets API**: Data export destination
- **KV Storage**: Cache for API keys, event metadata, and rate limiting

## Features

- ✅ Real-time event update webhooks with HMAC validation
- ✅ Daily polling of all HYROX events across multiple regions
- ✅ Automatic Google Sheets export (Events + Ticket Types sheets)
- ✅ Rate limiting and retry logic for API calls
- ✅ Comprehensive error handling and logging
- ✅ Health check and status endpoints
- ✅ Multi-region support (DACH, France, Italy, Benelux, Switzerland)

## Setup

### 1. Prerequisites

- Node.js 18+ and npm
- Cloudflare account with Workers enabled
- Google Cloud Project with Sheets API enabled
- Vivenu API keys for each seller account

### 2. Installation

```bash
npm install
```

### 3. Create KV Namespace

```bash
# Create production KV namespace
wrangler kv:namespace create "KV"

# Create preview KV namespace for development
wrangler kv:namespace create "KV" --preview
```

Update the namespace IDs in `wrangler.toml`.

### 4. Set up Google Sheets

1. Create a Google Cloud project
2. Enable the Google Sheets API
3. Create a service account and download the JSON key
4. Share your Google Sheet with the service account email
5. Get your Google Sheet ID from the URL

### 5. Configure Secrets

Set all sensitive data as Wrangler secrets:

```bash
# Vivenu webhook secret
wrangler secret put VIVENU_SECRET

# Regional API keys (get these from each Vivenu seller account)
wrangler secret put DACH_API
wrangler secret put FRANCE_API
wrangler secret put ITALY_API
wrangler secret put BENELUX_API
wrangler secret put SWITZERLAND_API

# Optional regional keys (set when available)
wrangler secret put USA_API
wrangler secret put CANADA_API
wrangler secret put AUSTRALIA_API
wrangler secret put NORWAY_API

# Google Sheets service account
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY
```

### 6. Update Configuration

Update `wrangler.toml` with your values:
- KV namespace IDs
- Google Sheet ID
- Environment variables

## Deployment

### Development

```bash
npm run dev
```

The worker will be available at http://localhost:8787

### Production

```bash
npm run deploy
```

## API Endpoints

### Webhook Endpoint
- **URL**: `https://your-worker.your-subdomain.workers.dev/webhook/event-updated`
- **Method**: POST
- **Purpose**: Receives event.updated webhooks from Vivenu
- **Authentication**: HMAC-SHA256 signature validation

### Health Check
- **URL**: `/health`
- **Method**: GET
- **Returns**: Worker health status and basic info

### Status
- **URL**: `/status`
- **Method**: GET  
- **Returns**: Detailed status including last poll results and webhook stats

## Webhook Registration

Register the webhook endpoint in each Vivenu seller account:

1. Go to your Vivenu seller dashboard
2. Navigate to Webhooks/Integrations
3. Add new webhook:
   - **URL**: `https://your-worker.your-subdomain.workers.dev/webhook/event-updated`
   - **Events**: `event.updated`
   - **Secret**: Use the same value as VIVENU_SECRET

## Google Sheets Format

The worker exports data to two sheets:

### Events Sheet
| Event ID | Region | Event Name | Event Date | Sales Launch Date | Status | Total Capacity | Total Sold | Total Available | Percent Sold | Last Updated |

### Ticket Types Sheet  
| Event ID | Event Name | Region | Ticket Type ID | Ticket Name | Price | Currency | Capacity | Sold | Available | Last Updated |

## Monitoring

### Logs
- All operations are logged with structured JSON
- View logs: `wrangler tail`

### Metrics
- Health endpoint for uptime monitoring
- Status endpoint for operational details
- KV storage tracks recent webhook activity

### Scheduled Jobs
- Runs daily at 2 AM UTC
- Polls all configured regions for HYROX events
- Updates Google Sheets with latest data
- Caches summary for status endpoint

## Configuration

### Regional API Keys

The worker supports multiple regions. Enable/disable regions in `src/services/vivenu.ts`:

```typescript
export const REGIONS: RegionConfig[] = [
  { name: 'DACH', apiKey: 'DACH_API', baseUrl: 'PROD', enabled: true },
  { name: 'FRANCE', apiKey: 'FRANCE_API', baseUrl: 'PROD', enabled: true },
  // ... etc
];
```

### Rate Limiting

Default rate limits (configurable in `RateLimiter` class):
- 100 requests per minute per region
- Automatic backoff on 429 responses
- Built-in delays between batch operations

### Retry Logic

Automatic retry with exponential backoff:
- Network errors: 3 retries with backoff
- Rate limit (429): Extended wait based on Retry-After header  
- Server errors (5xx): 3 retries with backoff
- Client errors (4xx): No retry

## Troubleshooting

### Common Issues

**"KV namespace not found"**
- Ensure KV namespace is created and ID is correct in wrangler.toml
- Deploy with `npm run deploy` after updating

**"Invalid webhook signature"**
- Verify VIVENU_SECRET matches the webhook secret in Vivenu
- Check webhook registration URL is exactly correct

**"Google Sheets API error"**
- Verify service account has access to the sheet
- Check Google Sheets API is enabled
- Ensure private key format is correct (newlines as `\n`)

**"API key not found for region"**
- Check secret is set: `wrangler secret list`
- Verify secret name matches the region configuration

### Development Tips

1. **Test webhook locally**: Use `wrangler dev` and tools like ngrok
2. **Check logs**: Use `wrangler tail` to see real-time logs
3. **Validate data**: Use `/status` endpoint to check last poll results
4. **Test Google Sheets**: Verify service account permissions

## Security

- All API keys stored as Cloudflare secrets (never in code)
- HMAC-SHA256 signature validation for webhooks  
- No sensitive data logged
- Rate limiting prevents API abuse
- Read-only access to Vivenu APIs

## Version History

- **v1.0.0**: Initial implementation with webhook and polling support

## Support

For issues or questions:
1. Check the logs with `wrangler tail`
2. Verify configuration in `wrangler.toml`
3. Test endpoints with `/health` and `/status`
4. Review this README for common solutions