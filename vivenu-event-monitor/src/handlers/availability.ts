import { AvailabilityService } from '../services/availability';
import { GoogleSheetsClient } from '../services/sheets';
import { EventMetrics } from '../types/vivenu';
import { Env } from '../types/env';
import { REGIONS } from '../services/vivenu';
import { log } from '../services/validation';

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
    // Reuse the same data-building logic
    const dataResponse = await handleDashboardData(request, env, ctx);
    if (!dataResponse.ok) {
      return dataResponse;
    }

    const dashboardData = await dataResponse.json();
    const events = dashboardData.events as Array<{
      eventId: string;
      eventName: string;
      eventDate: string;
      region: string;
      ticketTypes: Array<{ name: string; capacity: number; sold: number; available: number }>;
      totals: { capacity: number; sold: number; available: number; percentSold: number };
      lastUpdated: string;
    }>;

    // Map to EventMetrics for Sheets client
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

    const sheets = new GoogleSheetsClient(env);
    await sheets.updateMasterSheet(metrics);

    return new Response(JSON.stringify({
      status: 'success',
      message: 'Dashboard exported to Google Sheets',
      eventsExported: metrics.length,
      timestamp: new Date().toISOString()
    }, null, 2), {
      headers: { 'Content-Type': 'application/json' }
    });
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