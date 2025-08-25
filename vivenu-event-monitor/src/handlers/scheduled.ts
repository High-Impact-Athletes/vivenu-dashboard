import { Env } from '../types/env';
import { EventMetrics } from '../types/vivenu';
import { createVivenuClients } from '../services/vivenu';
import { GoogleSheetsClient } from '../services/sheets';
import { EventTracker } from '../services/tracking';
import { log } from '../services/validation';

export async function handleScheduledPoll(controller: ScheduledController, env: Env): Promise<void> {
  const startTime = Date.now();
  
  log('info', 'Starting scheduled poll of all events', {
    scheduledTime: new Date(controller.scheduledTime).toISOString(),
    environment: env.ENVIRONMENT
  });

  try {
    const clients = createVivenuClients(env);
    const allEventMetrics: EventMetrics[] = [];
    const regionStats: Record<string, any> = {};

    // Poll each region
    for (const client of clients) {
      const regionStartTime = Date.now();
      
      try {
        log('info', `Polling region ${client.region}...`);
        
        // Get all events for this region
        const events = await client.getAllEvents();
        
        // Filter for HYROX events (assuming HYROX is in the event name)
        const hyroxEvents = events.filter(event => 
          event.name.toLowerCase().includes('hyrox') ||
          event.name.toLowerCase().includes('race')
        );

        log('info', `Found ${hyroxEvents.length} HYROX events in ${client.region}`, {
          totalEvents: events.length,
          hyroxEvents: hyroxEvents.length
        });

        // Get metrics for each HYROX event
        const eventMetrics: EventMetrics[] = [];
        for (const event of hyroxEvents) {
          try {
            const metrics = await client.getTicketMetrics(event._id);
            if (metrics) {
              eventMetrics.push(metrics);
            }
            
            // Small delay between events to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            log('warn', `Failed to get metrics for event ${event._id}`, {
              region: client.region,
              eventId: event._id,
              eventName: event.name,
              error: (error as Error).message
            });
          }
        }

        allEventMetrics.push(...eventMetrics);
        
        const regionDuration = Date.now() - regionStartTime;
        regionStats[client.region] = {
          totalEvents: events.length,
          hyroxEvents: hyroxEvents.length,
          processedEvents: eventMetrics.length,
          durationMs: regionDuration
        };

        log('info', `Completed polling region ${client.region}`, {
          eventsProcessed: eventMetrics.length,
          durationMs: regionDuration
        });

      } catch (error) {
        log('error', `Failed to poll region ${client.region}`, {
          error: (error as Error).message,
          stack: (error as Error).stack
        });
        
        regionStats[client.region] = {
          error: (error as Error).message,
          durationMs: Date.now() - regionStartTime
        };
      }
    }

    // Update Google Sheets with all collected data
    if (allEventMetrics.length > 0) {
      log('info', `Updating Google Sheets with ${allEventMetrics.length} events`);
      
      const sheetsClient = new GoogleSheetsClient(env);
      await sheetsClient.updateEventsSheet(allEventMetrics);
      await sheetsClient.updateTicketTypesSheet(allEventMetrics);
      
      // Update sales date changes sheet with recent changes
      const eventTracker = new EventTracker(env.KV);
      const recentChanges = await eventTracker.getRecentChanges(100);
      if (recentChanges.length > 0) {
        await sheetsClient.updateSalesDateChangesSheet(recentChanges);
        log('info', `Updated Sales Date Changes sheet with ${recentChanges.length} changes`);
      }
      
      // Cache the last successful poll
      await cacheLastPoll(allEventMetrics, env.KV);
      
      log('info', 'Successfully updated Google Sheets');
    } else {
      log('warn', 'No event metrics collected to update sheets');
    }

    const totalDuration = Date.now() - startTime;
    
    log('info', 'Completed scheduled poll', {
      totalEvents: allEventMetrics.length,
      totalDurationMs: totalDuration,
      regionStats
    });

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    
    log('error', 'Scheduled poll failed', {
      error: (error as Error).message,
      stack: (error as Error).stack,
      durationMs: totalDuration
    });
    
    throw error;
  }
}

async function cacheLastPoll(metrics: EventMetrics[], kv: KVNamespace): Promise<void> {
  const pollData = {
    timestamp: new Date().toISOString(),
    eventCount: metrics.length,
    regions: Array.from(new Set(metrics.map(m => m.region))),
    summary: {
      totalCapacity: metrics.reduce((sum, m) => sum + m.totalCapacity, 0),
      totalSold: metrics.reduce((sum, m) => sum + m.totalSold, 0),
      totalAvailable: metrics.reduce((sum, m) => sum + m.totalAvailable, 0)
    },
    topEvents: metrics
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 10)
      .map(m => ({
        name: m.eventName,
        region: m.region,
        sold: m.totalSold,
        capacity: m.totalCapacity,
        percentSold: m.percentSold
      }))
  };

  await kv.put('last_poll_summary', JSON.stringify(pollData), {
    expirationTtl: 7 * 24 * 60 * 60 // Cache for 7 days
  });

  log('info', 'Cached poll summary', {
    eventCount: metrics.length,
    totalSold: pollData.summary.totalSold,
    totalCapacity: pollData.summary.totalCapacity
  });
}