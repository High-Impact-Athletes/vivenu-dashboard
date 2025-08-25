import { 
  VivenuEvent, 
  VivenuListResponse, 
  VivenuTicket, 
  EventMetrics,
  TicketTypeMetrics 
} from '../types/vivenu';
import { Env, RegionConfig } from '../types/env';
import { fetchWithRetry } from '../utils/retry';
import { RateLimiter } from '../utils/rate-limiter';
import { log } from './validation';
import { EventTracker } from './tracking';

const BASE_URLS = {
  PROD: 'https://vivenu.com/api',
  DEV: 'https://vivenu.dev/api'
};

export const REGIONS: RegionConfig[] = [
  { name: 'DACH', apiKey: 'DACH_API', baseUrl: 'PROD', enabled: true },
  { name: 'FRANCE', apiKey: 'FRANCE_API', baseUrl: 'PROD', enabled: true },
  { name: 'ITALY', apiKey: 'ITALY_API', baseUrl: 'PROD', enabled: true },
  { name: 'BENELUX', apiKey: 'BENELUX_API', baseUrl: 'PROD', enabled: true },
  { name: 'SWITZERLAND', apiKey: 'SWITZERLAND_API', baseUrl: 'PROD', enabled: true },
  { name: 'USA', apiKey: 'USA_API', baseUrl: 'PROD', enabled: false },
  { name: 'CANADA', apiKey: 'CANADA_API', baseUrl: 'PROD', enabled: false },
  { name: 'AUSTRALIA', apiKey: 'AUSTRALIA_API', baseUrl: 'PROD', enabled: false },
  { name: 'NORWAY', apiKey: 'NORWAY_API', baseUrl: 'PROD', enabled: false }
];

export class VivenuClient {
  private baseUrl: string;
  private apiKey: string;
  public readonly region: string;
  private rateLimiter: RateLimiter;
  private eventTracker: EventTracker;

  constructor(region: string, apiKey: string, baseUrl: 'PROD' | 'DEV', kv: KVNamespace) {
    this.region = region;
    this.baseUrl = BASE_URLS[baseUrl];
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(kv, 100, 60); // 100 requests per minute
    this.eventTracker = new EventTracker(kv);
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  async getAllEvents(): Promise<VivenuEvent[]> {
    await this.rateLimiter.waitIfNeeded(this.region);
    
    const allEvents: VivenuEvent[] = [];
    let skip = 0;
    const batchSize = 100;

    while (true) {
      const url = `${this.baseUrl}/events?top=${batchSize}&skip=${skip}`;
      
      try {
        const response = await fetchWithRetry(url, {
          headers: this.getHeaders()
        });

        const data: VivenuListResponse<VivenuEvent> = await response.json();
        const events = data.rows || [];
        
        allEvents.push(...events);
        
        log('info', `Fetched ${events.length} events from ${this.region}`, {
          region: this.region,
          skip,
          total: data.total
        });

        if (events.length === 0 || allEvents.length >= data.total) {
          break;
        }
        
        skip += events.length;
        
        // Small delay between pages to be nice to the API
        await new Promise(resolve => setTimeout(resolve, 100));
        
      } catch (error) {
        log('error', `Failed to fetch events from ${this.region}`, {
          region: this.region,
          error: (error as Error).message,
          skip
        });
        throw error;
      }
    }

    return allEvents;
  }

  async getEvent(eventId: string): Promise<VivenuEvent> {
    await this.rateLimiter.waitIfNeeded(this.region);
    
    const url = `${this.baseUrl}/events/${eventId}?include=tickets`;
    
    const response = await fetchWithRetry(url, {
      headers: this.getHeaders()
    });

    return await response.json();
  }

  async getTicketMetrics(eventId: string): Promise<EventMetrics | null> {
    try {
      await this.rateLimiter.waitIfNeeded(this.region);
      
      // Get event with ticket types
      const event = await this.getEvent(eventId);
      
      // Calculate metrics with precise ticket type sales data
      const ticketTypes = event.tickets || [];
      const totalCapacity = ticketTypes.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      // Get precise ticket type metrics
      const ticketTypeMetrics: TicketTypeMetrics[] = [];
      let totalSold = 0;
      
      for (const ticketType of ticketTypes) {
        await this.rateLimiter.waitIfNeeded(this.region);
        
        try {
          // Query tickets sold for this specific ticket type
          const ticketTypeUrl = `${this.baseUrl}/tickets?event=${eventId}&ticketType=${ticketType._id}&top=1`;
          const ticketTypeResponse = await fetchWithRetry(ticketTypeUrl, {
            headers: this.getHeaders()
          });
          
          const ticketTypeData: VivenuListResponse<VivenuTicket> = await ticketTypeResponse.json();
          const ticketTypeSold = ticketTypeData.total || 0;
          
          totalSold += ticketTypeSold;
          
          ticketTypeMetrics.push({
            id: ticketType._id,
            name: ticketType.name,
            price: ticketType.price,
            capacity: ticketType.amount,
            sold: ticketTypeSold,
            available: Math.max(0, ticketType.amount - ticketTypeSold)
          });
          
          log('info', `Ticket type sales data`, {
            region: this.region,
            eventId,
            ticketType: ticketType.name,
            sold: ticketTypeSold,
            capacity: ticketType.amount
          });
          
          // Small delay between ticket type queries
          await new Promise(resolve => setTimeout(resolve, 100));
          
        } catch (error) {
          log('warn', `Failed to get sales for ticket type ${ticketType._id}`, {
            region: this.region,
            eventId,
            ticketTypeId: ticketType._id,
            ticketTypeName: ticketType.name,
            error: (error as Error).message
          });
          
          // Fallback to including ticket type with unknown sales
          ticketTypeMetrics.push({
            id: ticketType._id,
            name: ticketType.name,
            price: ticketType.price,
            capacity: ticketType.amount,
            sold: 0, // Unknown, so we set to 0
            available: ticketType.amount // Assume all available
          });
        }
      }
      
      const totalAvailable = Math.max(0, totalCapacity - totalSold);
      const percentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

      // Track sales date changes
      await this.eventTracker.trackEvent(event, this.region, 'polling');

      return {
        eventId: event._id,
        eventName: event.name,
        eventDate: event.start,
        salesStartDate: event.sellStart,
        region: this.region,
        status: event.status,
        totalCapacity,
        totalSold,
        totalAvailable,
        percentSold: Math.round(percentSold * 100) / 100,
        ticketTypes: ticketTypeMetrics,
        lastUpdated: new Date().toISOString()
      };
      
    } catch (error) {
      log('error', `Failed to get ticket metrics for event ${eventId}`, {
        region: this.region,
        eventId,
        error: (error as Error).message
      });
      return null;
    }
  }
}

export function createVivenuClients(env: Env): VivenuClient[] {
  const clients: VivenuClient[] = [];
  
  for (const region of REGIONS) {
    if (!region.enabled) continue;
    
    const apiKey = env[region.apiKey] as string;
    if (!apiKey) {
      log('warn', `API key not found for region ${region.name}`, { region: region.name });
      continue;
    }
    
    clients.push(new VivenuClient(region.name, apiKey, region.baseUrl, env.KV));
  }
  
  return clients;
}