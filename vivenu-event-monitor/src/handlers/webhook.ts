import { Env } from '../types/env';
import { VivenuWebhookPayload } from '../types/vivenu';
import { WebhookResponse } from '../types/webhook';
import { validateWebhookSignature, log } from '../services/validation';
import { GoogleSheetsClient } from '../services/sheets';
import { createVivenuClients } from '../services/vivenu';
import { EventTracker } from '../services/tracking';

export async function handleEventUpdatedWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Validate request method
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    // Get the payload
    const payload = await request.text();
    if (!payload) {
      return new Response('Empty payload', { status: 400 });
    }

    // Validate HMAC signature
    const signature = request.headers.get('x-vivenu-signature') || 
                     request.headers.get('x-vivenu-webhook-signature');
    
    const validation = await validateWebhookSignature(payload, signature, env.VIVENU_SECRET);
    if (!validation.isValid) {
      log('warn', 'Invalid webhook signature', { error: validation.error });
      return new Response('Invalid signature', { status: 401 });
    }

    // Parse the webhook payload
    let webhookData: VivenuWebhookPayload;
    try {
      webhookData = JSON.parse(payload);
    } catch (error) {
      log('error', 'Failed to parse webhook payload', { error: (error as Error).message });
      return new Response('Invalid JSON payload', { status: 400 });
    }

    // Validate webhook type
    if (webhookData.type !== 'event.updated') {
      log('info', `Received webhook type ${webhookData.type}, ignoring`, {
        type: webhookData.type,
        eventId: webhookData.data.event?._id
      });
      return new Response('OK', { status: 200 });
    }

    // Process the event update
    const result = await processEventUpdate(webhookData, env);
    
    if (result.success) {
      log('info', 'Successfully processed event update webhook', {
        eventId: webhookData.data.event?._id,
        eventName: webhookData.data.event?.name,
        sellerId: webhookData.sellerId
      });
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      });
    } else {
      log('error', 'Failed to process event update webhook', {
        eventId: webhookData.data.event?._id,
        error: result.error
      });
      return new Response(JSON.stringify(result), {
        headers: { 'Content-Type': 'application/json' },
        status: 500
      });
    }

  } catch (error) {
    log('error', 'Unexpected error in webhook handler', {
      error: (error as Error).message,
      stack: (error as Error).stack
    });

    return new Response(JSON.stringify({
      success: false,
      error: 'Internal server error'
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 500
    });
  }
}

async function processEventUpdate(
  webhookData: VivenuWebhookPayload,
  env: Env
): Promise<WebhookResponse> {
  try {
    const event = webhookData.data.event;
    if (!event) {
      return { success: false, error: 'No event data in webhook' };
    }

    // Track sales date changes immediately from webhook data
    const eventTracker = new EventTracker(env.KV || null);
    
    // Find the region for this seller by trying each API key
    const clients = createVivenuClients(env);
    let eventMetrics = null;
    let detectedRegion = 'unknown';

    // Try to get updated metrics for this event from all regions
    for (const client of clients) {
      try {
        eventMetrics = await client.getTicketMetrics(event._id);
        if (eventMetrics) {
          detectedRegion = client.region;
          break;
        }
      } catch (error) {
        // Continue to next client if this one fails
        continue;
      }
    }

    // Track sales date changes from webhook (high priority)
    const salesDateChanges = await eventTracker.trackEvent(event, detectedRegion, 'webhook');
    
    if (salesDateChanges.length > 0) {
      log('warn', `URGENT: Sales date changes detected via webhook for ${event.name}`, {
        eventId: event._id,
        eventName: event.name,
        region: detectedRegion,
        changesCount: salesDateChanges.length,
        changes: salesDateChanges.map(c => ({
          type: c.changeType,
          from: c.previousValue,
          to: c.newValue
        }))
      });
    }

    if (!eventMetrics) {
      // If we can't get metrics, at least cache the basic event info
      await cacheEventUpdate(event, env.KV);
      return { 
        success: true, 
        message: 'Event update cached, but metrics unavailable' 
      };
    }

    // Update Google Sheets with the new data
    const sheetsClient = new GoogleSheetsClient(env);
    await sheetsClient.updateEventsSheet([eventMetrics]);
    await sheetsClient.updateTicketTypesSheet([eventMetrics]);

    // Cache the event update
    await cacheEventUpdate(event, env.KV);

    return { 
      success: true, 
      message: 'Event update processed successfully' 
    };

  } catch (error) {
    return { 
      success: false, 
      error: `Processing failed: ${(error as Error).message}` 
    };
  }
}

async function cacheEventUpdate(event: any, kv: KVNamespace): Promise<void> {
  const cacheKey = `event_update:${event._id}`;
  const cacheData = {
    eventId: event._id,
    name: event.name,
    start: event.start,
    sellStart: event.sellStart,
    status: event.status,
    updatedAt: event.updatedAt,
    receivedAt: new Date().toISOString()
  };

  await kv.put(cacheKey, JSON.stringify(cacheData), {
    expirationTtl: 7 * 24 * 60 * 60 // Cache for 7 days
  });

  log('info', 'Cached event update', {
    eventId: event._id,
    eventName: event.name
  });
}