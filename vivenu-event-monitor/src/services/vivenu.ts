import { Env } from '../types/env';
import { VivenuEvent, VivenuListResponse, EventMetrics, TicketTypeMetrics } from '../types/vivenu';
import { fetchWithRetry } from '../utils/retry';
import { log } from './validation';

// Region configuration
export const REGIONS = [
  { name: 'USA', apiKey: 'USA_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'DACH', apiKey: 'DACH_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'FRANCE', apiKey: 'FRANCE_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'ITALY', apiKey: 'ITALY_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'BENELUX', apiKey: 'BENELUX_API', baseUrl: 'PROD' as const, enabled: true },
  { name: 'SWITZERLAND', apiKey: 'SWITZERLAND_API', baseUrl: 'PROD' as const, enabled: true },
];

const BASE_URLS = {
  PROD: 'https://vivenu.com/api',
  DEV: 'https://vivenu.dev/api'
};

export class VivenuClient {
  public readonly region: string;
  private readonly apiKey: string;
  private readonly baseUrl: string;
  
  constructor(region: string, apiKey: string, baseUrl: 'PROD' | 'DEV' = 'PROD') {
    this.region = region;
    this.apiKey = apiKey;
    this.baseUrl = BASE_URLS[baseUrl];
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async getAllEvents(eventIds?: string[]): Promise<VivenuEvent[]> {
    try {
      // If no specific event IDs provided, return empty array
      // (The old method of listing all events doesn't work with Vivenu API)
      if (!eventIds || eventIds.length === 0) {
        log('warn', `No event IDs provided for ${this.region} - cannot list all events`, { region: this.region });
        return [];
      }

      log('info', `Fetching ${eventIds.length} specific events for ${this.region}`, { 
        region: this.region,
        eventIds 
      });
      
      const events: VivenuEvent[] = [];
      
      // Fetch each event individually
      for (const eventId of eventIds) {
        try {
          const url = `${this.baseUrl}/events/${eventId}?include=tickets`;
          const response = await fetchWithRetry(url, {
            headers: this.getHeaders()
          });

          if (!response.ok) {
            log('warn', `Failed to fetch event ${eventId}`, {
              region: this.region,
              eventId,
              status: response.status,
              statusText: response.statusText
            });
            continue;
          }

          const event: VivenuEvent = await response.json();
          events.push(event);
          
          log('info', `Successfully fetched event: ${event.name}`, {
            region: this.region,
            eventId: event._id,
            ticketTypes: event.tickets?.length || 0
          });
          
        } catch (error) {
          log('error', `Error fetching event ${eventId}`, {
            region: this.region,
            eventId,
            error: (error as Error).message
          });
          continue;
        }
      }
      
      log('info', `Found ${events.length}/${eventIds.length} events in ${this.region}`, { 
        region: this.region,
        requested: eventIds.length,
        found: events.length
      });

      return events;
    } catch (error) {
      log('error', `Failed to fetch events for ${this.region}`, {
        region: this.region,
        error: (error as Error).message
      });
      return [];
    }
  }

  /**
   * Get ALL events from this seller account using pagination.
   * This is the true "list all events" method that uses the /api/events endpoint.
   */
  async getAllEventsFromSeller(): Promise<VivenuEvent[]> {
    try {
      log('info', `Fetching ALL events from ${this.region} seller account`, { region: this.region });
      
      const allEvents: VivenuEvent[] = [];
      let skip = 0;
      const batchSize = 100;
      let totalFetched = 0;
      
      while (true) {
        const url = `${this.baseUrl}/events?top=${batchSize}&skip=${skip}`;
        
        log('debug', `Fetching events batch: skip=${skip}, batchSize=${batchSize}`, {
          region: this.region,
          url,
          totalFetched
        });
        
        const response = await fetchWithRetry(url, {
          headers: this.getHeaders()
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status} ${response.statusText}`);
        }

        const data: VivenuListResponse<VivenuEvent> = await response.json();
        const events = data.rows || [];
        
        log('debug', `Received ${events.length} events, total in response: ${data.total}`, {
          region: this.region,
          batchReceived: events.length,
          totalInResponse: data.total,
          currentTotal: allEvents.length
        });
        
        allEvents.push(...events);
        totalFetched += events.length;
        
        // Break if no more events or we've fetched everything
        if (events.length === 0 || (data.total && totalFetched >= data.total)) {
          break;
        }
        
        skip += events.length;
      }
      
      log('info', `Successfully fetched ${allEvents.length} total events from ${this.region}`, {
        region: this.region,
        totalEvents: allEvents.length,
        eventNames: allEvents.map(e => e.name)
      });

      return allEvents;
    } catch (error) {
      log('error', `Failed to fetch all events from ${this.region}`, {
        region: this.region,
        error: (error as Error).message
      });
      return [];
    }
  }

  // REMOVED: getTicketMetrics() method - This method was fundamentally broken
  // It relied on ticket.sold from the Vivenu API, which doesn't provide accurate sold counts
  // All ticket sales data must come from comprehensive ticket scraping via AvailabilityService
  // If you need ticket data, use AvailabilityService.getEventAvailability() instead

  async findEventsWithCharityTickets(eventIds?: string[]): Promise<VivenuEvent[]> {
    try {
      const allEvents = await this.getAllEvents(eventIds);
      
      const eventsWithCharity = allEvents.filter(event => {
        // Filter for HYROX events first
        const isHyroxEvent = event.name.toLowerCase().includes('hyrox') || 
                           event.name.toLowerCase().includes('race');
        
        if (!isHyroxEvent || !event.tickets) {
          return false;
        }

        // Check if any ticket types contain charity/donation
        const hasCharityTickets = event.tickets.some(ticket => 
          ticket.active && (
            ticket.name.toLowerCase().includes('charity') ||
            ticket.name.toLowerCase().includes('donation') ||
            ticket.name.toLowerCase().includes('good cause')
          )
        );

        return hasCharityTickets;
      });

      log('info', `Found ${eventsWithCharity.length} HYROX events with charity tickets in ${this.region}`, {
        region: this.region,
        totalEvents: allEvents.length,
        hyroxWithCharity: eventsWithCharity.length,
        eventNames: eventsWithCharity.map(e => e.name)
      });

      return eventsWithCharity;
    } catch (error) {
      log('error', `Failed to find events with charity tickets in ${this.region}`, {
        region: this.region,
        error: (error as Error).message
      });
      return [];
    }
  }
}

/**
 * Read all event IDs from the KV store where value is "true"
 */
export async function getEventIdsFromKV(kv: KVNamespace | null | undefined): Promise<string[]> {
  if (!kv) {
    log('warn', 'KV store not available - cannot read event IDs');
    return [];
  }

  try {
    log('info', 'Reading event IDs from KV store');
    
    // List all keys in the KV store
    const listResult = await kv.list();
    const eventIds: string[] = [];
    
    // Check each key to see if its value is "true"
    for (const key of listResult.keys) {
      try {
        const value = await kv.get(key.name);
        if (value === 'true') {
          eventIds.push(key.name);
          log('debug', `Found event ID in KV store: ${key.name}`);
        }
      } catch (error) {
        log('warn', `Failed to read KV key ${key.name}`, {
          error: (error as Error).message
        });
      }
    }
    
    log('info', `Found ${eventIds.length} event IDs in KV store`, {
      eventIds: eventIds
    });
    
    return eventIds;
  } catch (error) {
    log('error', 'Failed to read event IDs from KV store', {
      error: (error as Error).message
    });
    return [];
  }
}

/**
 * Cross-region event discovery: Find events from KV store across all seller accounts
 */
export async function discoverKVEventsAcrossRegions(env: Env): Promise<{ event: VivenuEvent; region: string; client: VivenuClient }[]> {
  try {
    log('info', 'Starting cross-region event discovery using KV store');
    
    // Step 1: Get event IDs from KV store
    const kvEventIds = await getEventIdsFromKV(env.EVENT_IDS);
    if (kvEventIds.length === 0) {
      log('warn', 'No event IDs found in KV store');
      return [];
    }

    log('info', `Looking for ${kvEventIds.length} events from KV store across all regions`, {
      kvEventIds: kvEventIds
    });

    // Step 2: Create clients for all regions
    const clients = createVivenuClients(env);
    if (clients.length === 0) {
      log('error', 'No Vivenu clients available - check API key configuration');
      return [];
    }

    log('info', `Created ${clients.length} Vivenu clients for regions: ${clients.map(c => c.region).join(', ')}`);

    // Step 3: For each region, get all events and check for matches
    const discoveredEvents: { event: VivenuEvent; region: string; client: VivenuClient }[] = [];
    
    for (const client of clients) {
      try {
        log('info', `Searching for KV events in ${client.region}...`);
        
        // Get all events from this seller account
        const allEventsInRegion = await client.getAllEventsFromSeller();
        
        log('info', `Found ${allEventsInRegion.length} total events in ${client.region}`, {
          region: client.region,
          eventNames: allEventsInRegion.map(e => e.name)
        });

        // Check which ones match our KV store event IDs
        const matchingEvents = allEventsInRegion.filter(event => kvEventIds.includes(event._id));
        
        log('info', `Found ${matchingEvents.length} matching events in ${client.region}`, {
          region: client.region,
          matchingEventIds: matchingEvents.map(e => e._id),
          matchingEventNames: matchingEvents.map(e => e.name)
        });

        // Add to discovered events
        for (const event of matchingEvents) {
          discoveredEvents.push({
            event,
            region: client.region,
            client
          });
        }
        
      } catch (error) {
        log('error', `Failed to search for events in ${client.region}`, {
          region: client.region,
          error: (error as Error).message
        });
        // Continue with other regions
      }
    }

    log('info', `Cross-region discovery completed: found ${discoveredEvents.length}/${kvEventIds.length} events`, {
      foundEvents: discoveredEvents.map(d => ({ eventId: d.event._id, eventName: d.event.name, region: d.region })),
      missingEventIds: kvEventIds.filter(id => !discoveredEvents.some(d => d.event._id === id))
    });

    return discoveredEvents;
    
  } catch (error) {
    log('error', 'Failed cross-region event discovery', {
      error: (error as Error).message
    });
    return [];
  }
}

export function createVivenuClients(env: Env): VivenuClient[] {
  const clients: VivenuClient[] = [];
  
  for (const region of REGIONS) {
    if (!region.enabled) continue;
    
    const apiKey = env[region.apiKey as keyof Env] as string;
    if (apiKey) {
      clients.push(new VivenuClient(region.name, apiKey, region.baseUrl));
    } else {
      log('warn', `No API key found for region ${region.name}`, {
        region: region.name,
        apiKeyVar: region.apiKey
      });
    }
  }
  
  log('info', `Created ${clients.length} Vivenu clients`, {
    regions: clients.map(c => c.region)
  });
  
  return clients;
}