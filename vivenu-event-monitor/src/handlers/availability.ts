import { AvailabilityService } from '../services/availability';
import { GoogleSheetsClient } from '../services/sheets';
import { PostgresClient } from '../services/postgres';
import { EventMetrics } from '../types/vivenu';
import { EventAvailability } from '../types/availability';
import { Env } from '../types/env';
import { REGIONS, createVivenuClients, discoverKVEventsAcrossRegions } from '../services/vivenu';
import { log } from '../services/validation';

/**
 * Handles event availability API requests including dashboard data and exports.
 * 
 * Primary export format is PostgreSQL database storage for persistent analytics.
 * Also supports legacy Google Sheets export and real-time dashboard data.
 * 
 * Uses comprehensive ticket scraping to provide accurate sold counts rather
 * than basic API calls that return misleading zero values.
 */
export async function handleAvailabilityRequest(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const pathParts = url.pathname.split('/').filter(Boolean);
  
  // Extract parameters from path
  // Expected paths:
  // /api/availability/{eventId}
  // /api/availability/{eventId}/{ticketTypeId}
  // /api/availability/{eventId}/shop/{shopId}
  // /api/dashboard/data
  // /api/dashboard/export-to-sheets
  
  if (pathParts[1] === 'dashboard' && pathParts[2] === 'data') {
    return handleDashboardData(request, env, ctx);
  }

  if (pathParts[1] === 'dashboard' && pathParts[2] === 'export-to-sheets') {
    return handleDashboardExport(request, env, ctx);
  }
  
  if (pathParts[1] !== 'availability' || pathParts.length < 3) {
    return new Response(JSON.stringify({
      error: 'Invalid endpoint',
      message: 'Use /api/availability/{eventId} or /api/availability/{eventId}/{ticketTypeId}'
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  const eventId = pathParts[2];
  const region = url.searchParams.get('region')?.toUpperCase();
  
  // Determine region from event ID or query parameter
  const availabilityService = await getAvailabilityService(env, region, eventId);
  
  if (!availabilityService) {
    return new Response(JSON.stringify({
      error: 'Region not found',
      message: 'Could not determine region for this event'
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  try {
    // Check if shop-specific request
    if (pathParts[3] === 'shop' && pathParts[4]) {
      const shopId = pathParts[4];
      const event = await availabilityService.getEventAvailability(eventId, false);
      const shopSold = await availabilityService.getTicketCount(eventId, undefined, shopId);
      
      return new Response(JSON.stringify({
        eventId,
        eventName: event.eventName,
        shopId,
        sold: shopSold,
        totalSold: event.totals.sold,
        percentOfTotal: event.totals.sold > 0 ? (shopSold / event.totals.sold) * 100 : 0
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60' 
        }
      });
    }
    
    // Check if ticket type specific request
    if (pathParts[3]) {
      const ticketTypeId = pathParts[3];
      const availability = await availabilityService.getAccurateTicketTypeAvailability(eventId, ticketTypeId);
      
      if (!availability) {
        return new Response(JSON.stringify({
          error: 'Ticket type not found',
          message: `Ticket type ${ticketTypeId} not found in event ${eventId}`
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      return new Response(JSON.stringify(availability), {
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=60'
        }
      });
    }
    
    // Get full event availability
    const includeShops = url.searchParams.get('includeShops') === 'true';
    const availability = await availabilityService.getEventAvailability(eventId, includeShops);
    
    return new Response(JSON.stringify(availability), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60'
      }
    });
    
  } catch (error) {
    log('error', 'Failed to get availability', {
      eventId,
      error: (error as Error).message
    });
    
    return new Response(JSON.stringify({
      error: 'Failed to get availability',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDashboardData(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  const url = new URL(request.url);
  const region = url.searchParams.get('region')?.toUpperCase();
  
  try {
    // Get all configured events
    const allEvents: { eventId: string; region: string; service: AvailabilityService }[] = [];
    
    // If specific region requested
    if (region) {
      const regionConfig = REGIONS.find(r => r.name === region && r.enabled);
      if (regionConfig) {
        const apiKey = env[regionConfig.apiKey as keyof Env] as string;
        if (apiKey) {
          const service = new AvailabilityService(region, apiKey, regionConfig.baseUrl, env.KV || null, env);
          
          // Get event IDs for this region from environment
          const eventIds = getEventIdsForRegion(env, region);
          for (const eventId of eventIds) {
            allEvents.push({ eventId, region, service });
          }
        }
      }
    } else {
      // Get all regions
      for (const regionConfig of REGIONS) {
        if (!regionConfig.enabled) continue;
        
        const apiKey = env[regionConfig.apiKey as keyof Env] as string;
        if (!apiKey) continue;
        
        const service = new AvailabilityService(
          regionConfig.name,
          apiKey,
          regionConfig.baseUrl,
          env.KV || null,
          env
        );
        
        const eventIds = getEventIdsForRegion(env, regionConfig.name);
        for (const eventId of eventIds) {
          allEvents.push({ eventId, region: regionConfig.name, service });
        }
      }
    }
    
    // Fetch availability for all events
    const availabilities = await Promise.all(
      allEvents.map(async ({ eventId, service }) => {
        try {
          return await service.getEventAvailability(eventId, false);
        } catch (error) {
          log('error', `Failed to get availability for ${eventId}`, {
            error: (error as Error).message
          });
          return null;
        }
      })
    );
    
    // Filter out failed requests and calculate summary
    const validAvailabilities = availabilities.filter(a => a !== null);
    
    let totalCapacity = 0;
    let totalSold = 0;
    let totalAvailable = 0;
    let eventsNearSoldOut = 0;
    let eventsSoldOut = 0;
    
    for (const event of validAvailabilities) {
      if (!event) continue;
      totalCapacity += event.totals.capacity;
      totalSold += event.totals.sold;
      totalAvailable += event.totals.available;
      
      if (event.totals.status === 'soldout') {
        eventsSoldOut++;
      } else if (event.totals.status === 'limited') {
        eventsNearSoldOut++;
      }
    }
    
    const avgPercentSold = totalCapacity > 0 
      ? (totalSold / totalCapacity) * 100 
      : 0;
    
    const dashboardData = {
      events: validAvailabilities,
      summary: {
        totalEvents: validAvailabilities.length,
        totalCapacity,
        totalSold,
        totalAvailable,
        avgPercentSold: Math.round(avgPercentSold * 100) / 100,
        eventsNearSoldOut,
        eventsSoldOut
      },
      lastRefresh: new Date().toISOString()
    };
    
    return new Response(JSON.stringify(dashboardData), {
      headers: { 
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=60',
        'Access-Control-Allow-Origin': '*'
      }
    });
    
  } catch (error) {
    log('error', 'Failed to get dashboard data', {
      error: (error as Error).message
    });
    
    return new Response(JSON.stringify({
      error: 'Failed to get dashboard data',
      message: (error as Error).message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function handleDashboardExport(
  request: Request,
  env: Env,
  ctx: ExecutionContext
): Promise<Response> {
  try {
    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'postgres'; // 'postgres' (primary), 'dashboard' (Google Sheets), or 'wide' (legacy cross-tab)
    const source = url.searchParams.get('source') || 'dashboard'; // 'dashboard' or 'vivenu'
    const clear = url.searchParams.get('clear') === 'true';

    log('info', 'Dashboard export requested', {
      format,
      source,
      clear
    });

    // Get data based on source
    let dashboardData;
    if (source === 'vivenu') {
      // KV Store auto-discovery - find all events from KV store across all seller accounts
      log('info', 'Starting KV store event discovery across all regions');
      
      // Discover all events from KV store across all regions
      const allKVEvents = await discoverKVEventsAcrossRegions(env);

      if (allKVEvents.length === 0) {
        log('warn', 'No events found from KV store in any region');
        dashboardData = {
          events: [],
          summary: {
            totalEvents: 0,
            totalCapacity: 0,
            totalSold: 0,
            totalAvailable: 0,
            avgPercentSold: 0,
            eventsNearSoldOut: 0,
            eventsSoldOut: 0
          },
          lastRefresh: new Date().toISOString()
        };
      } else {
        // Use comprehensive ticket scraping for accurate data
        const eventsPromises = allKVEvents.map(async ({ event, region, client }) => {
          try {
            // Get the API key from environment for this region
            const regionConfig = REGIONS.find(r => r.name === region && r.enabled);
            if (!regionConfig) {
              throw new Error(`No region configuration found for ${region}`);
            }
            
            const apiKey = env[regionConfig.apiKey as keyof Env] as string;
            if (!apiKey) {
              throw new Error(`No API key configured for region ${region} (missing ${regionConfig.apiKey})`);
            }
            
            // Create AvailabilityService for this region to get comprehensive scraping
            const availabilityService = new AvailabilityService(
              region, 
              apiKey, 
              regionConfig.baseUrl,
              env.KV || null,
              env
            );
            
            // Get comprehensive availability with ticket scraping
            const availability = await availabilityService.getEventAvailability(event._id, false);
            return availability;
          } catch (error) {
            const errorMsg = `Comprehensive ticket scraping FAILED for ${event.name} (${event._id}) in ${region}: ${(error as Error).message}`;
            log('error', errorMsg, {
              eventId: event._id,
              region: region,
              eventName: event.name,
              error: (error as Error).message
            });
            // FAIL FAST - Do not return null, throw error to prevent silent failures
            throw new Error(errorMsg);
          }
        });

        // No filtering needed - all events must succeed or the entire export fails
        const events = await Promise.all(eventsPromises);

        // VALIDATION: Ensure comprehensive scraping worked - no silent zero-sold failures
        const eventsWithSales = events.filter(event => event.totals.sold > 0);
        if (eventsWithSales.length === 0 && events.length > 0) {
          throw new Error(`CRITICAL: All ${events.length} events show 0 tickets sold. Comprehensive ticket scraping has failed. This indicates the basic API fallback is being used instead of real ticket scraping. Export aborted to prevent misleading data.`);
        }
        
        const percentWithSales = events.length > 0 ? (eventsWithSales.length / events.length) * 100 : 0;
        if (percentWithSales < 50) {
          log('warn', `WARNING: Only ${eventsWithSales.length}/${events.length} events (${percentWithSales.toFixed(1)}%) have ticket sales data. This may indicate scraping issues.`);
        }

        log('info', `Data validation passed: ${eventsWithSales.length}/${events.length} events have real ticket sales data`, {
          totalEvents: events.length,
          eventsWithSales: eventsWithSales.length,
          percentWithSales: percentWithSales.toFixed(1)
        });

        // Calculate summary
        let totalCapacity = 0;
        let totalSold = 0;
        let totalAvailable = 0;
        let eventsSoldOut = 0;
        let eventsNearSoldOut = 0;

        for (const event of events) {
          totalCapacity += event.totals.capacity;
          totalSold += event.totals.sold;
          totalAvailable += event.totals.available;
          
          if (event.totals.status === 'soldout') {
            eventsSoldOut++;
          } else if (event.totals.status === 'limited') {
            eventsNearSoldOut++;
          }
        }

        const avgPercentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

        dashboardData = {
          events,
          summary: {
            totalEvents: events.length,
            totalCapacity,
            totalSold,
            totalAvailable,
            avgPercentSold: Math.round(avgPercentSold * 100) / 100,
            eventsNearSoldOut,
            eventsSoldOut
          },
          lastRefresh: new Date().toISOString()
        };

        log('info', 'KV store discovery completed', {
          totalEventsFound: allKVEvents.length,
          eventsWithMetrics: events.length,
          totalCapacity,
          totalSold,
          regions: [...new Set(events.map(e => e.region))]
        });
      }
    } else {
      // Use existing dashboard data logic
      const dataResponse = await handleDashboardData(request, env, ctx);
      if (!dataResponse.ok) {
        return dataResponse;
      }
      dashboardData = await dataResponse.json();
    }

    const events = dashboardData.events;

    if (format === 'postgres') {
      // Primary export to PostgreSQL database
      if (!env.DATABASE_URL) {
        return new Response(JSON.stringify({
          status: 'failed',
          error: 'DATABASE_URL not configured'
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      const postgres = new PostgresClient(env.DATABASE_URL);
      await postgres.writeSnapshot(events);

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Dashboard exported to PostgreSQL database',
        format: 'postgres',
        eventsExported: events.length,
        totalTicketTypes: events.reduce((sum, event) => sum + event.ticketTypes.length, 0),
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Google Sheets export (optional, legacy support)
    const sheets = new GoogleSheetsClient(env);

    if (format === 'dashboard') {
      // New analytics-friendly format
      await sheets.updateDashboardSheet(events);
      
      return new Response(JSON.stringify({
        status: 'success',
        message: 'Dashboard exported to Google Sheets (Analytics format)',
        format: 'dashboard',
        eventsExported: events.length,
        totalRows: events.reduce((sum, event) => 
          sum + event.ticketTypes.length + 1 + (event.charityStats ? 1 : 0), 0),
        timestamp: new Date().toISOString()
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      // Legacy cross-tabulated format
      const metrics: EventMetrics[] = events.map(ev => ({
        eventId: ev.eventId,
        eventName: ev.eventName,
        eventDate: ev.eventDate,
        salesStartDate: undefined,
        region: ev.region,
        status: undefined,
        totalCapacity: ev.totals.capacity,
        totalSold: ev.totals.sold,
        totalAvailable: ev.totals.available,
        percentSold: Math.round(ev.totals.percentSold * 100) / 100,
        ticketTypes: ev.ticketTypes.map(t => ({
          id: t.name,
          name: t.name,
          price: 0,
          capacity: t.capacity,
          sold: t.sold,
          available: t.available,
        })),
        lastUpdated: ev.lastUpdated
      }));

      await sheets.updateMasterSheet(metrics);

      return new Response(JSON.stringify({
        status: 'success',
        message: 'Dashboard exported to Google Sheets (Cross-tab format)',
        format: 'wide',
        eventsExported: metrics.length,
        timestamp: new Date().toISOString()
      }, null, 2), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({
      status: 'failed',
      error: (error as Error).message
    }, null, 2), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

async function getAvailabilityService(
  env: Env,
  region: string | null,
  eventId: string
): Promise<AvailabilityService | null> {
  // If region is provided, use it
  if (region) {
    const regionConfig = REGIONS.find(r => r.name === region && r.enabled);
    if (regionConfig) {
      const apiKey = env[regionConfig.apiKey as keyof Env] as string;
      if (apiKey) {
        return new AvailabilityService(region, apiKey, regionConfig.baseUrl, env.KV || null, env);
      }
    }
  }
  
  // Try to determine region from environment event mappings
  for (const regionConfig of REGIONS) {
    if (!regionConfig.enabled) continue;
    
    const eventIds = getEventIdsForRegion(env, regionConfig.name);
    if (eventIds.includes(eventId)) {
      const apiKey = env[regionConfig.apiKey as keyof Env] as string;
      if (apiKey) {
        return new AvailabilityService(
          regionConfig.name,
          apiKey,
          regionConfig.baseUrl,
          env.KV || null,
          env
        );
      }
    }
  }
  
  return null;
}

function getEventIdsForRegion(env: Env, region: string): string[] {
  const eventIds: string[] = [];
  
  // Map of region to event environment variable prefixes
  const regionEventMap: Record<string, string[]> = {
    'DACH': ['FRANKFURT', 'HAMBURG', 'STUTTGART', 'VIENNA', 'KOLN'],
    'FRANCE': ['PARIS', 'BORDEAUX', 'TOULOUSE', 'NICE', 'LYON', 'PARISGRANDPALAIS'],
    'ITALY': ['ROME', 'VERONA', 'TURIN', 'BOLOGNA'],
    'BENELUX': ['MAASTRICHT', 'UTRECHT', 'AMSTERDAM', 'BELGIUM', 'ROTTERDAM'],
    'SWITZERLAND': ['GENEVA', 'STGALLEN'],
    'USA': ['CHICAGO', 'DALLAS', 'ANAHEIM', 'PHOENIX', 'LASVEGAS', 'MIAMIBEACH', 'WASHINGTONDC', 'ATLANTA25'],
    'CANADA': ['TORONTO'],
    'AUSTRALIA': ['PERTH', 'MELBOURNE', 'BRISBANE', 'AUCKLAND'],
    'NORWAY': ['OSLO', 'STOCKHOLM', 'COPENHAGEN']
  };
  
  const prefixes = regionEventMap[region] || [];
  
  for (const prefix of prefixes) {
    const eventId = env[`${prefix}_EVENT` as keyof Env] as string;
    if (eventId && !eventId.startsWith('your_') && eventId !== '') {
      eventIds.push(eventId);
    }
  }
  
  return eventIds;
}