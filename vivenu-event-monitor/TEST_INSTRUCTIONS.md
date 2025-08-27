# Frankfurt Charity Calculation Test

This standalone test validates that the comprehensive ticket scraping approach correctly calculates Frankfurt charity tickets as **46% sold (95/205)** instead of the incorrect 8% from proportional estimation.

## Quick Start

1. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env and add your DACH_API key
   ```

2. **Run the test**:
   ```bash
   npm run test:frankfurt
   ```
   
   OR directly:
   ```bash
   node test_frankfurt_charity.js
   ```

## What the Test Does

1. **Initializes services** using your DACH API key
2. **Fetches Frankfurt event data** (event ID: `688893B5193E98F877D838E0`)
3. **Filters out secondary tickets** (ATHLETE 2, TEAM MEMBER, etc.) with inflated 10,000+ capacity
4. **Scrapes ALL tickets** (18,000+ tickets) - this takes several minutes
5. **Calculates real charity metrics** from actual ticket data
6. **Validates against expected result**: 95 sold / 205 total = 46.3% sold

## Expected Output

```
🎯 FRANKFURT CHARITY CALCULATION TEST
=====================================
Event ID: 688893B5193E98F877D838E0
Region: DACH

🔄 Step 1: Fetching event and ticket types...
Event: Wings for Life World Run Frankfurt
Primary ticket types (after filtering): 30

🎫 Step 2: Comprehensive ticket scraping...
📊 Scraping complete: 18,754/18,754 tickets (100.0%)

🔍 Step 3: Analyzing ticket types...
Primary ticket types found:
  - Charity Frankfurt: 95 sold
  - Men's Relay: 1,245 sold
  - Mixed Relay: 823 sold
  ...

📊 CHARITY CALCULATION RESULTS:
================================
Ticket Type: Charity Frankfurt
Capacity: 205
Sold: 95
Available: 110
Percent Sold: 46.3%
Status: available

🎯 VALIDATION:
==============
Expected: 95 sold / 205 total = 46.3% sold
Actual: 95 sold / 205 total = 46.3% sold
✅ SUCCESS: Charity calculation matches expected result!
```

## Output Files

The test creates these files for verification:

- **`frankfurt_scraping_progress.json`** - Real-time scraping progress
- **`frankfurt_charity_tickets.json`** - Detailed charity ticket breakdown  
- **`frankfurt_results.json`** - Final validation results

## Troubleshooting

**Missing API Key**:
```
❌ Missing DACH_API environment variable
Please set DACH_API=your_api_key_here
```
→ Edit `.env` file and add your DACH region API key

**Module Import Errors**:
→ Ensure `package.json` has `"type": "module"` 

**API Rate Limits**:
→ The script includes automatic retry logic and exponential backoff

## Key Features

- ✅ **No web server required** - runs completely standalone
- ✅ **Progress saved to files** - you can monitor progress externally  
- ✅ **Real ticket data** - no proportional estimation
- ✅ **Secondary ticket filtering** - removes inflated ATHLETE 2/TEAM MEMBER tickets
- ✅ **Validates the fix** - confirms 46% vs incorrect 8% calculation

## Background

The original dashboard incorrectly calculated charity as 8% sold because:
1. Secondary tickets like "ATHLETE 2" had 10,000 capacity each
2. This inflated the total capacity calculation
3. Proportional estimation gave wrong percentages

This test proves the comprehensive ticket scraping approach filters out secondary tickets and uses real data, showing the correct 46% sold rate.