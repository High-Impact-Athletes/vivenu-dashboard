#!/bin/bash

# Script to manually trigger PostgreSQL export
# This runs the same export that would happen at 4 AM UTC via the cron job

echo "🚀 Starting manual PostgreSQL export..."
echo ""

# Check if the worker is running
if ! curl -s http://localhost:8787/health > /dev/null 2>&1; then
    echo "⚠️  Worker is not running. Starting it now..."
    cd vivenu-event-monitor
    npm run dev &
    WORKER_PID=$!
    echo "Worker started with PID: $WORKER_PID"
    echo "Waiting for worker to be ready..."
    sleep 5
else
    echo "✅ Worker is already running"
fi

echo ""
echo "📤 Triggering PostgreSQL export..."
echo "This will:"
echo "  - Auto-discover all HYROX events with charity tickets"
echo "  - Perform comprehensive ticket scraping for accurate counts"
echo "  - Export data to PostgreSQL database"
echo ""
echo "⏳ This may take 2-5 minutes depending on the number of events..."
echo ""

# Trigger the export
response=$(curl -X POST \
  "http://localhost:8787/api/dashboard/export-to-sheets?source=vivenu&format=postgres" \
  -H "Content-Type: application/json" \
  --max-time 600 \
  -s)

# Check if successful
if echo "$response" | grep -q '"status":"success"'; then
    echo "✅ Export completed successfully!"
    echo ""
    echo "Response:"
    echo "$response" | python3 -m json.tool 2>/dev/null || echo "$response"
else
    echo "❌ Export failed or timed out"
    echo ""
    echo "Response:"
    echo "$response"
    exit 1
fi