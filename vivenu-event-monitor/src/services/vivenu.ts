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