# Secrets to Configure for Vivenu Event Monitor

The worker is now deployed at: https://vivenu-event-monitor.high-impact-athletes.workers.dev

## Required Secrets

Run these commands to set up the required secrets:

### 1. Vivenu Webhook Secret
```bash
wrangler secret put VIVENU_SECRET
# Enter the value: d5e4a4e5-609e-441e-b654-e657c70ec1a5
```

### 2. Regional API Keys
```bash
# DACH (Germany, Austria, Switzerland)
wrangler secret put DACH_API
# Enter: key_611f2e6886734d6ee9182ada53cf45694d7e6da8a4a1d4c6fe2192d921d1637bc36480f7764f1a0134d3d46770e9ad5d

# Switzerland
wrangler secret put SWITZERLAND_API  
# Enter: key_cb739ff4a1fa16653c2a765c4c67d84451d8f96e97db539b40ae34a1280d17fd9a66f518e3857ecb3a1456e2fce58ef7

# France
wrangler secret put FRANCE_API
# Enter: key_a5ce101a481abe393f806508fdfa3235dc1e0fb1884378268a4bb607b2cb9df7dacdc0eff3caaa34dbaf22e912a38a91

# Italy
wrangler secret put ITALY_API
# Enter: key_9ff41bad0424187dc54b189d73af2aadf16c121a5cadb67b2416df4e3416d8a6ba2b527c3ff058f3c8070ec3ac8f4bd9

# Benelux
wrangler secret put BENELUX_API
# Enter: key_4b6ba4c752835f2cdc07d4d1fc50df7d998543e4286bb0c73857092fd71ff153b09f56842feffbcca89c3df9ef8f884b
```

### 3. Google Sheets Service Account (Required for Sheets Export)
```bash
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
# Enter your service account email

wrangler secret put GOOGLE_PRIVATE_KEY
# Enter your private key (paste the entire key including BEGIN/END lines)

wrangler secret put GOOGLE_SHEET_ID
# Enter your Google Sheet ID
```

### 4. Optional Regional Keys (when available)
```bash
wrangler secret put USA_API
wrangler secret put CANADA_API
wrangler secret put AUSTRALIA_API
wrangler secret put NORWAY_API
```

## Current Status

✅ Worker deployed to: https://vivenu-event-monitor.high-impact-athletes.workers.dev
✅ Health check working: /health endpoint returns 200 OK
✅ KV namespace configured
✅ Cron schedule configured (daily at 2 AM UTC)

## Next Steps

1. Configure the secrets listed above
2. Set up Google Sheets:
   - Create a Google Cloud project
   - Enable Google Sheets API
   - Create service account
   - Share your Google Sheet with the service account
3. Register webhooks in each Vivenu seller account:
   - URL: https://vivenu-event-monitor.high-impact-athletes.workers.dev/webhook/event-updated
   - Events: event.updated
   - Secret: Use the VIVENU_SECRET value

## Test URLs

- Health: https://vivenu-event-monitor.high-impact-athletes.workers.dev/health
- Status: https://vivenu-event-monitor.high-impact-athletes.workers.dev/status

## Monitoring

View logs:
```bash
wrangler tail
```

View real-time errors:
```bash
wrangler tail --format pretty | grep error
```