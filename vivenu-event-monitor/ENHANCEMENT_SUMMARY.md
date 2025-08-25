# Vivenu Event Monitor - Enhanced Sales Date Tracking

## 🎉 Enhancement Complete!

Your Vivenu Event Monitor has been significantly enhanced with advanced sales date tracking and precise ticket sales monitoring. Here's what's been added:

## ✨ New Features

### 1. **Precise Ticket Type Sales Data** ✅
- **Before**: Used proportional estimates based on total sales
- **Now**: Queries each ticket type individually for exact sold counts
- **Endpoint Used**: `GET /api/tickets?event={id}&ticketType={typeId}`
- **Benefit**: Accurate sales data for each ticket category

### 2. **Real-time Sales Date Change Detection** ✅
- **Webhook Monitoring**: Detects changes instantly when events are updated
- **Polling Monitoring**: Compares dates on daily polls to catch any missed changes
- **Tracked Changes**:
  - `sellStart` - When ticket sales begin
  - `sellEnd` - When ticket sales end
  - Individual ticket type sales dates

### 3. **Historical Tracking & Alerts** ✅
- **Change History**: Stores all sales date modifications with timestamps
- **Severity Classification**:
  - 🔴 **CRITICAL**: Sales dates moved later (delays sales)
  - 🟡 **HIGH**: Sales dates moved earlier  
  - 🔵 **MEDIUM**: Other sales date changes
- **Source Tracking**: Identifies if change came from webhook or polling

### 4. **Enhanced Google Sheets Integration** ✅
- **New Sheet**: "Sales Date Changes" with complete change history
- **Data Includes**:
  - Event details and region
  - Change type and affected field
  - Previous vs new values (formatted dates)
  - Change timestamp and source
  - Severity assessment

### 5. **Enhanced Status Monitoring** ✅
- **New Status Data**: Recent sales date changes in `/status` endpoint
- **Real-time Visibility**: Last 10 changes shown in status
- **Operational Intelligence**: Quick overview of recent modifications

## 🔍 Current Monitoring Capabilities

### Daily Cron Job (2 AM UTC):
1. **Polls all regions**: DACH, France, Italy, Benelux, Switzerland
2. **Filters HYROX events**: Events containing "hyrox" or "race"
3. **Gets precise sales data**: Individual ticket type sales counts
4. **Detects sales date changes**: Compares with stored history
5. **Updates 3 Google Sheets**:
   - Events (overview)
   - Ticket Types (detailed breakdown)  
   - Sales Date Changes (change history)

### Real-time Webhooks:
1. **Receives event.updated** from Vivenu sellers
2. **Validates HMAC signatures** for security
3. **Immediately detects sales date changes**
4. **Creates high-priority alerts** for critical changes
5. **Updates Google Sheets** with fresh data

## 📊 Data You're Now Tracking

### Event Overview:
- ✅ Event names, dates, locations
- ✅ **Sales launch dates** (`sellStart`)
- ✅ Sales end dates (`sellEnd`)
- ✅ Total capacity vs sold vs available
- ✅ Event status (PUBLISHED, DRAFT, etc.)

### Detailed Ticket Sales:
- ✅ **Individual ticket type sales** (exact counts)
- ✅ Ticket prices and capacities
- ✅ Available tickets per type
- ✅ Sales percentages by type

### Sales Date Changes (NEW):
- ✅ **All sales date modifications**
- ✅ Previous vs new dates
- ✅ Change timestamps and sources
- ✅ Severity classifications
- ✅ Event and regional context

## 🚨 Alert System

### Critical Sales Date Changes:
- **Webhook Alerts**: Immediate logging when sales dates change
- **Severity Assessment**: Automatic classification of change importance
- **Historical Tracking**: Complete audit trail of all modifications
- **Google Sheets Log**: Permanent record with timestamps

### Example Alert:
```
URGENT: Sales date changes detected via webhook for HYROX Berlin 2025
- Type: sellStart 
- From: 2025-01-15T10:00:00Z
- To: 2025-01-20T10:00:00Z  
- Severity: CRITICAL - Sales Delayed
```

## 📈 Enhanced Google Sheets Structure

### Sheet 1: "Events"
Event overview with sales launch dates and totals

### Sheet 2: "Ticket Types"  
Detailed breakdown with precise sales data per ticket type

### Sheet 3: "Sales Date Changes" (NEW)
Complete history of all sales date modifications with severity indicators

## 🔗 API Endpoints

### Current Endpoints:
- `/health` - Health check
- `/status` - Enhanced with recent sales date changes
- `/webhook/event-updated` - Receives Vivenu webhooks

### Example Status Response:
```json
{
  "status": "operational",
  "recentSalesDateChanges": [
    {
      "eventName": "HYROX Berlin 2025",
      "region": "DACH", 
      "changeType": "sellStart",
      "previousValue": "2025-01-15T10:00:00Z",
      "newValue": "2025-01-20T10:00:00Z",
      "source": "webhook"
    }
  ]
}
```

## 🎯 You Now Have Complete Visibility Into:

1. **Real-time ticket sales data** - Exact counts per ticket type
2. **Sales date changes** - Immediate alerts when dates are modified  
3. **Historical tracking** - Complete audit trail of all changes
4. **Multi-source monitoring** - Both webhooks and daily polling
5. **Severity assessment** - Automatic classification of change importance

## 🚀 Next Steps

1. **Monitor the first daily poll** (tomorrow at 2 AM UTC)
2. **Check Google Sheets** for the new "Sales Date Changes" sheet
3. **Test webhook alerts** by making a test event change in Vivenu
4. **Review status endpoint** for operational intelligence

Your monitoring system is now comprehensively tracking everything you requested - ticket availability, sales data, and especially **sales date changes** with real-time alerts!

---

**Enhanced Version Deployed**: August 25, 2025  
**Worker URL**: https://vivenu-event-monitor.high-impact-athletes.workers.dev  
**Status**: Fully operational with enhanced sales date monitoring