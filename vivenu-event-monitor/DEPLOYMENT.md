# Vivenu Event Monitor - Deployment Checklist

## Pre-Deployment Setup

### 1. Create KV Namespaces
```bash
# Create production KV namespace
wrangler kv:namespace create "KV"
# Output: { binding = "KV", id = "YOUR_KV_NAMESPACE_ID" }

# Create preview/dev KV namespace
wrangler kv:namespace create "KV" --preview
# Output: { binding = "KV", preview_id = "YOUR_KV_PREVIEW_ID" }
```

### 2. Update wrangler.toml
Replace placeholder values in `wrangler.toml`:
- `YOUR_KV_NAMESPACE_ID` → actual production KV namespace ID
- `YOUR_KV_PREVIEW_ID` → actual preview KV namespace ID  
- `YOUR_GOOGLE_SHEET_ID` → your Google Sheet ID
- `YOUR_DEV_KV_NAMESPACE_ID` → dev KV namespace ID (if using)
- `YOUR_STAGING_KV_NAMESPACE_ID` → staging KV namespace ID (if using)

### 3. Google Sheets Setup
1. Create Google Cloud Project
2. Enable Google Sheets API
3. Create Service Account
4. Download JSON key file
5. Create/prepare Google Sheet with two tabs: "Events" and "Ticket Types"
6. Share sheet with service account email (Editor permissions)

### 4. Gather API Keys
Collect API keys from each Vivenu seller account:
- DACH (Germany/Austria)
- FRANCE  
- ITALY
- BENELUX (Netherlands/Belgium/Luxembourg)
- SWITZERLAND
- USA, CANADA, AUSTRALIA, NORWAY (when available)

## Deployment Steps

### 1. Set Secrets
```bash
# Required secrets
wrangler secret put VIVENU_SECRET
wrangler secret put GOOGLE_SERVICE_ACCOUNT_EMAIL
wrangler secret put GOOGLE_PRIVATE_KEY

# Regional API keys (set the ones you have)
wrangler secret put DACH_API
wrangler secret put FRANCE_API
wrangler secret put ITALY_API
wrangler secret put BENELUX_API
wrangler secret put SWITZERLAND_API

# Optional (set when available)
wrangler secret put USA_API
wrangler secret put CANADA_API
wrangler secret put AUSTRALIA_API
wrangler secret put NORWAY_API
```

### 2. Deploy Worker
```bash
# Deploy to production
npm run deploy

# Or deploy to staging first
wrangler deploy --env staging
```

### 3. Test Deployment
```bash
# Test health endpoint
curl https://your-worker.your-subdomain.workers.dev/health

# Test status endpoint
curl https://your-worker.your-subdomain.workers.dev/status
```

### 4. Register Webhooks
For each Vivenu seller account:
1. Log into Vivenu seller dashboard
2. Go to Integrations/Webhooks section
3. Add new webhook:
   - **URL**: `https://your-worker.your-subdomain.workers.dev/webhook/event-updated`
   - **Events**: `event.updated`
   - **Secret**: Same value as VIVENU_SECRET

## Verification Steps

### 1. Check Worker Status
- [ ] Health endpoint returns `{"status":"healthy"}`
- [ ] Status endpoint shows environment and version info
- [ ] No errors in `wrangler tail`

### 2. Test Google Sheets Integration
- [ ] Service account has Editor access to sheet
- [ ] Sheet has "Events" and "Ticket Types" tabs
- [ ] No authentication errors in logs

### 3. Test API Connectivity
- [ ] Worker can connect to Vivenu APIs
- [ ] No authentication errors for enabled regions
- [ ] Rate limiting working correctly

### 4. Test Webhook Reception
- [ ] Webhook endpoint accessible externally
- [ ] HMAC signature validation working
- [ ] Events processed and logged correctly

### 5. Test Scheduled Jobs
- [ ] Cron trigger configured (daily at 2 AM UTC)
- [ ] First scheduled run completes successfully
- [ ] Google Sheets updated with event data
- [ ] Status endpoint shows last poll results

## Monitoring Setup

### 1. Cloudflare Dashboard
- Set up alerts for worker errors
- Monitor execution duration (should be < 30 seconds)
- Track request volume and success rates

### 2. Log Monitoring
```bash
# Watch real-time logs
wrangler tail

# Filter for errors only
wrangler tail --format pretty | grep '"level":"error"'
```

### 3. Health Checks
Set up external monitoring for:
- `https://your-worker.your-subdomain.workers.dev/health`
- Expected response: `200 OK` with `{"status":"healthy"}`

## Troubleshooting Common Issues

### Deployment Fails
- Check KV namespace IDs in wrangler.toml
- Verify all required secrets are set: `wrangler secret list`
- Check TypeScript compilation: `npx tsc --noEmit`

### Google Sheets Errors
- Verify service account email/key are correct
- Check Sheet ID in environment variables
- Ensure service account has Editor permissions on sheet

### Webhook Signature Failures
- Verify VIVENU_SECRET matches webhook configuration
- Check webhook URL is exactly correct (no extra slashes)
- Test with sample webhook payload

### API Connection Issues
- Verify API keys are correct for each region
- Check if regions are enabled in `src/services/vivenu.ts`
- Monitor rate limiting in logs

## Production Checklist

- [ ] All secrets configured
- [ ] KV namespaces created and configured
- [ ] Google Sheets set up with proper permissions
- [ ] Worker deployed successfully
- [ ] Health endpoint responding
- [ ] Webhooks registered in all Vivenu accounts
- [ ] First scheduled poll completed successfully
- [ ] Monitoring alerts configured
- [ ] Error logging working
- [ ] Rate limiting operational

## Rollback Plan

If issues occur after deployment:

1. **Immediate rollback**: 
   ```bash
   wrangler rollback
   ```

2. **Disable scheduled jobs**: Update wrangler.toml to comment out crons, redeploy

3. **Disable regions**: Set `enabled: false` for problematic regions in code

4. **Emergency stop**: Delete worker deployment if critical issues occur

## Maintenance

### Regular Tasks
- Monitor error rates and address issues
- Update API keys when they rotate
- Check Google Sheets for data quality
- Review and optimize rate limits based on usage

### Quarterly Tasks  
- Review and update regional configurations
- Check for new HYROX events and regions
- Update dependencies and security patches
- Validate webhook integrations still active

---

*Deployment Guide v1.0 - Updated: August 2024*