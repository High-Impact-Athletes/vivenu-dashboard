import { Env } from '../types/env';
import { EventMetrics } from '../types/vivenu';
import { createVivenuClients } from '../services/vivenu';
import { GoogleSheetsClient } from '../services/sheets';
import { EventTracker } from '../services/tracking';
import { log } from '../services/validation';

export interface PollResult {
  status: 'completed' | 'failed' | 'partial';
  timestamp: string;
  totalEvents: number;
  totalDurationMs: number;
  regionStats: Record<string, any>;
  sheetsUpdated: boolean;
  errors: string[];
}

export async function performEventPoll(env: Env, source: 'scheduled' | 'manual' = 'scheduled', targetRegion?: string): Promise<PollResult> {
  const startTime = Date.now();
  const errors: string[] = [];
  
  log('info', `Starting ${source} poll${targetRegion ? ` for region ${targetRegion}` : ' of all events'}`, {
    timestamp: new Date().toISOString(),
    environment: env.ENVIRONMENT,
    targetRegion: targetRegion || 'all'
  });

  try {
    let clients = createVivenuClients(env);
    
    // Filter to specific region if requested
    if (targetRegion) {
      clients = clients.filter(client => client.region === targetRegion);
      if (clients.length === 0) {
        throw new Error(`Invalid or disabled region: ${targetRegion}`);
      }
    }
    
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

        // For manual testing, process only the first HYROX event to avoid timeouts
        const eventsToProcess = source === 'manual' ? hyroxEvents.slice(0, 1) : hyroxEvents;
        
        if (source === 'manual' && eventsToProcess.length > 0) {
          log('info', `Processing single event for manual test: ${eventsToProcess[0].name}`, {
            eventId: eventsToProcess[0]._id,
            eventName: eventsToProcess[0].name,
            region: client.region
          });
        }

        // Get metrics for each HYROX event
        const eventMetrics: EventMetrics[] = [];
        for (const event of eventsToProcess) {
          try {
            const metrics = await client.getTicketMetrics(event._id);
            if (metrics) {
              eventMetrics.push(metrics);
            }
            
            // Small delay between events to be nice to the API
            await new Promise(resolve => setTimeout(resolve, 200));
            
          } catch (error) {
            const errorMessage = `Failed to get metrics for event ${event._id} in ${client.region}: ${(error as Error).message}`;
            errors.push(errorMessage);
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
        const errorMessage = `Failed to poll region ${client.region}: ${(error as Error).message}`;
        errors.push(errorMessage);
        
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

    let sheetsUpdated = false;
    
    // Update Google Sheets with all collected data
    if (allEventMetrics.length > 0) {
      try {
        log('info', `Updating Google Sheets with ${allEventMetrics.length} events`);
        
        const sheetsClient = new GoogleSheetsClient(env);
        log('info', 'Updating consolidated Master sheet with all event data');
        await sheetsClient.updateMasterSheet(allEventMetrics);
        
        // Sales date tracking moved outside Google Sheets - could be handled by webhooks/JSON files
        
        // Cache the last successful poll
        if (env.KV) {
          await cacheLastPoll(allEventMetrics, env.KV);
        }
        
        sheetsUpdated = true;
        log('info', 'Successfully updated Google Sheets');
      } catch (error) {
        const errorMessage = `Failed to update Google Sheets: ${(error as Error).message}`;
        errors.push(errorMessage);
        log('error', 'Failed to update Google Sheets', {
          error: (error as Error).message,
          stack: (error as Error).stack
        });
      }
    } else {
      log('warn', 'No event metrics collected to update sheets');
    }

    const totalDuration = Date.now() - startTime;
    
    const result: PollResult = {
      status: errors.length === 0 ? 'completed' : (allEventMetrics.length > 0 ? 'partial' : 'failed'),
      timestamp: new Date().toISOString(),
      totalEvents: allEventMetrics.length,
      totalDurationMs: totalDuration,
      regionStats,
      sheetsUpdated,
      errors
    };
    
    log('info', `Completed ${source} poll`, {
      totalEvents: allEventMetrics.length,
      totalDurationMs: totalDuration,
      status: result.status,
      errorsCount: errors.length
    });

    return result;

  } catch (error) {
    const totalDuration = Date.now() - startTime;
    const errorMessage = `Poll failed: ${(error as Error).message}`;
    
    log('error', `${source} poll failed`, {
      error: (error as Error).message,
      stack: (error as Error).stack,
      durationMs: totalDuration
    });
    
    return {
      status: 'failed',
      timestamp: new Date().toISOString(),
      totalEvents: 0,
      totalDurationMs: totalDuration,
      regionStats: {},
      sheetsUpdated: false,
      errors: [errorMessage]
    };
  }
}

export async function handleScheduledPoll(controller: ScheduledController, env: Env): Promise<void> {
  log('info', 'Starting scheduled poll', {
    scheduledTime: new Date(controller.scheduledTime).toISOString()
  });

  const result = await performEventPoll(env, 'scheduled');
  
  if (result.status === 'failed') {
    throw new Error(`Scheduled poll failed: ${result.errors.join(', ')}`);
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