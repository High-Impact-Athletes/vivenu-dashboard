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
import { DebugLogger } from '../utils/debug-logger';

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
  private debugLogger: DebugLogger;

  constructor(region: string, apiKey: string, baseUrl: 'PROD' | 'DEV', kv: KVNamespace | null) {
    this.region = region;
    this.baseUrl = BASE_URLS[baseUrl];
    this.apiKey = apiKey;
    this.rateLimiter = new RateLimiter(kv, 100, 60); // 100 requests per minute
    this.eventTracker = new EventTracker(kv);
    this.debugLogger = new DebugLogger(kv);
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

        // Debug log the first batch of events
        if (skip === 0) {
          await this.debugLogger.logApiCall(`/events?top=${batchSize}&skip=0`, this.region, events, 'events_first_batch');
        }

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
      
      log('info', `Getting simplified ticket metrics for event ${eventId}`, {
        region: this.region,
        eventId
      });
      
      // Get event with ticket types
      const event = await this.getEvent(eventId);
      await this.debugLogger.logApiCall(`/events/${eventId}`, this.region, event, 'event_details');
      
      const ticketTypes = event.tickets || [];
      const totalCapacity = ticketTypes.reduce((sum, t) => sum + (t.amount || 0), 0);
      
      log('info', `Event has ${ticketTypes.length} ticket types, total capacity: ${totalCapacity}`, {
        region: this.region,
        eventId,
        ticketTypesCount: ticketTypes.length,
        totalCapacity
      });

      // SIMPLIFIED: Just get the total sold count with a lightweight API call
      await this.rateLimiter.waitIfNeeded(this.region);
      const totalTicketsUrl = `${this.baseUrl}/tickets?event=${eventId}&top=1`; // Just get 1 ticket + total count
      
      log('info', `Getting total ticket count: ${totalTicketsUrl}`, {
        region: this.region,
        eventId
      });

      const totalTicketsResponse = await fetchWithRetry(totalTicketsUrl, {
        headers: this.getHeaders()
      });

      const totalTicketsData: VivenuListResponse<VivenuTicket> = await totalTicketsResponse.json();
      const totalSold = totalTicketsData.total || 0;

      log('info', `Got total sold count: ${totalSold}`, {
        region: this.region,
        eventId,
        totalSold
      });

      // Debug log the response
      await this.debugLogger.logApiCall(totalTicketsUrl, this.region, {
        total: totalSold,
        sampleTicket: totalTicketsData.rows?.[0] || null
      }, 'total_tickets_count');

      // Build simplified ticket type metrics (capacity only, no individual sold counts)
      const ticketTypeMetrics: TicketTypeMetrics[] = [];
      for (const ticketType of ticketTypes) {
        ticketTypeMetrics.push({
          id: ticketType._id,
          name: ticketType.name,
          price: ticketType.price,
          capacity: ticketType.amount,
          sold: 0, // We don't break down by ticket type anymore
          available: ticketType.amount // Show full capacity as available
        });
      }
      
      const totalAvailable = Math.max(0, totalCapacity - totalSold);
      const percentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;

      // Track sales date changes
      await this.eventTracker.trackEvent(event, this.region, 'polling');

      const metrics = {
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

      // Debug log the final metrics
      await this.debugLogger.logProcessedMetrics(this.region, [metrics]);

      log('info', `Successfully calculated simplified ticket metrics`, {
        region: this.region,
        eventId,
        totalCapacity,
        totalSold,
        percentSold: metrics.percentSold,
        ticketTypesCount: ticketTypeMetrics.length
      });

      return metrics;
      
    } catch (error) {
      log('error', `Failed to get ticket metrics for event ${eventId}`, {
        region: this.region,
        eventId,
        error: (error as Error).message,
        stack: (error as Error).stack
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
    
    clients.push(new VivenuClient(region.name, apiKey, region.baseUrl, env.KV || null));
  }
  
  return clients;
}