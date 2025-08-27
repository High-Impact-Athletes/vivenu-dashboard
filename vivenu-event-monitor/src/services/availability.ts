import { 
  EventAvailability, 
  TicketTypeAvailability, 
  ShopAvailability,
  AvailabilityCache,
  DashboardData 
} from '../types/availability';
import { VivenuEvent, VivenuTicket, VivenuListResponse } from '../types/vivenu';
import { Env } from '../types/env';
import { fetchWithRetry } from '../utils/retry';
import { RateLimiter } from '../utils/rate-limiter';
import { log } from './validation';
import { DebugLogger } from '../utils/debug-logger';
import { TicketScraper, TicketScrapingResult } from './ticket-scraper';

const BASE_URLS = {
  PROD: 'https://vivenu.com/api',
  DEV: 'https://vivenu.dev/api'
};

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY_PREFIX = 'availability:';
const SCRAPED_TICKETS_CACHE_KEY_PREFIX = 'scraped_tickets:';

export class AvailabilityService {
  private baseUrl: string;
  private apiKey: string;
  private region: string;
  private rateLimiter: RateLimiter;
  private debugLogger: DebugLogger;
  private kv: KVNamespace | null;
  private ticketScraper: TicketScraper;

  constructor(region: string, apiKey: string, baseUrl: 'PROD' | 'DEV', kv: KVNamespace | null, env: Env) {
    this.region = region;
    this.baseUrl = BASE_URLS[baseUrl];
    this.apiKey = apiKey;
    this.kv = kv;
    this.rateLimiter = new RateLimiter(kv, 100, 60); // 100 requests per minute
    this.debugLogger = new DebugLogger(kv);
    this.ticketScraper = new TicketScraper(region, env);
  }

  private getHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
  }

  private determineStatus(percentSold: number): 'available' | 'limited' | 'soldout' {
    if (percentSold >= 100) return 'soldout';
    if (percentSold >= 80) return 'limited';
    return 'available';
  }

  private getCacheKey(eventId: string, suffix: string = ''): string {
    return `${CACHE_KEY_PREFIX}${this.region}:${eventId}${suffix ? ':' + suffix : ''}`;
  }

  private getScrapedTicketsCacheKey(eventId: string): string {
    return `${SCRAPED_TICKETS_CACHE_KEY_PREFIX}${this.region}:${eventId}`;
  }

  async getCachedAvailability(eventId: string): Promise<EventAvailability | null> {
    if (!this.kv) return null;
    
    try {
      const cacheKey = this.getCacheKey(eventId);
      const cached = await this.kv.get<AvailabilityCache>(cacheKey, 'json');
      
      if (cached && new Date(cached.expiresAt) > new Date()) {
        log('info', `Using cached availability for ${eventId}`, {
          region: this.region,
          expiresAt: cached.expiresAt
        });
        return cached.data;
      }
    } catch (error) {
      log('warn', `Failed to get cached availability`, {
        region: this.region,
        eventId,
        error: (error as Error).message
      });
    }
    
    return null;
  }

  async cacheAvailability(eventId: string, data: EventAvailability): Promise<void> {
    if (!this.kv) return;
    
    try {
      const cache: AvailabilityCache = {
        data,
        cachedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + CACHE_TTL_MS).toISOString()
      };
      
      const cacheKey = this.getCacheKey(eventId);
      await this.kv.put(cacheKey, JSON.stringify(cache), {
        expirationTtl: Math.floor(CACHE_TTL_MS / 1000)
      });
      
      log('info', `Cached availability for ${eventId}`, {
        region: this.region,
        expiresAt: cache.expiresAt
      });
    } catch (error) {
      log('warn', `Failed to cache availability`, {
        region: this.region,
        eventId,
        error: (error as Error).message
      });
    }
  }

  async getScrapedTickets(eventId: string): Promise<TicketScrapingResult | null> {
    if (!this.kv) {
      // No caching available, scrape fresh
      return await this.ticketScraper.scrapeAllTickets(eventId);
    }

    try {
      const cacheKey = this.getScrapedTicketsCacheKey(eventId);
      const cached = await this.kv.get<TicketScrapingResult>(cacheKey, 'json');
      
      if (cached && new Date(cached.scrapedAt) > new Date(Date.now() - CACHE_TTL_MS)) {
        log('info', `Using cached scraped tickets for ${eventId}`, {
          region: this.region,
          ticketCount: cached.totalFetched,
          scrapedAt: cached.scrapedAt
        });
        return cached;
      }
    } catch (error) {
      log('warn', `Failed to get cached scraped tickets`, {
        region: this.region,
        eventId,
        error: (error as Error).message
      });
    }

    // No valid cache, scrape fresh
    const scrapingResult = await this.ticketScraper.scrapeAllTickets(eventId);
    
    // Cache the result
    if (this.kv && scrapingResult) {
      try {
        const cacheKey = this.getScrapedTicketsCacheKey(eventId);
        await this.kv.put(cacheKey, JSON.stringify(scrapingResult), {
          expirationTtl: Math.floor(CACHE_TTL_MS / 1000)
        });
        
        log('info', `Cached scraped tickets for ${eventId}`, {
          region: this.region,
          ticketCount: scrapingResult.totalFetched
        });
      } catch (error) {
        log('warn', `Failed to cache scraped tickets`, {
          region: this.region,
          eventId,
          error: (error as Error).message
        });
      }
    }

    return scrapingResult;
  }

  async getEventWithTickets(eventId: string): Promise<VivenuEvent> {
    await this.rateLimiter.waitIfNeeded(this.region);
    
    const url = `${this.baseUrl}/events/${eventId}?include=tickets`;
    const response = await fetchWithRetry(url, {
      headers: this.getHeaders()
    });
    
    return await response.json();
  }

  async getTicketCount(
    eventId: string, 
    ticketTypeId?: string,
    shopId?: string,
    statusFilter: string = 'VALID,DETAILSREQUIRED'
  ): Promise<number> {
    await this.rateLimiter.waitIfNeeded(this.region);
    
    const params = new URLSearchParams({
      event: eventId,
      top: '1',
      status: statusFilter
    });
    
    if (ticketTypeId) {
      params.append('ticketTypeId', ticketTypeId);
    }
    
    if (shopId) {
      params.append('underShopId', shopId);
    }
    
    const url = `${this.baseUrl}/tickets?${params.toString()}`;
    
    log('debug', `Getting ticket count: ${url}`, {
      region: this.region,
      eventId,
      ticketTypeId,
      shopId
    });
    
    const response = await fetchWithRetry(url, {
      headers: this.getHeaders()
    });
    
    const data: VivenuListResponse<VivenuTicket> = await response.json();
    return data.total || 0;
  }

  async getTicketTypeAvailability(
    event: VivenuEvent,
    ticketTypeId: string
  ): Promise<TicketTypeAvailability | null> {
    const ticketType = event.tickets?.find(t => t._id === ticketTypeId);
    if (!ticketType) return null;
    
    const capacity = ticketType.amount || 0;
    const sold = await this.getTicketCount(event._id, ticketTypeId);
    const available = Math.max(0, capacity - sold);
    const percentSold = capacity > 0 ? (sold / capacity) * 100 : 0;
    
    return {
      id: ticketType._id,
      name: ticketType.name,
      capacity,
      sold,
      available,
      percentSold: Math.round(percentSold * 100) / 100,
      status: this.determineStatus(percentSold),
      price: ticketType.price
    };
  }

  async getEventAvailability(
    eventId: string, 
    includeShops: boolean = false
  ): Promise<EventAvailability> {
    // Check cache first
    const cached = await this.getCachedAvailability(eventId);
    if (cached && !includeShops) {
      return cached;
    }
    
    log('info', `Calculating availability for event ${eventId} using comprehensive ticket scraping`, {
      region: this.region,
      includeShops
    });
    
    // Get event with ticket types
    const event = await this.getEventWithTickets(eventId);
    const allTicketTypes = event.tickets || [];
    
    // Filter out secondary tickets from capacity calculation
    const primaryTicketTypes = this.ticketScraper.filterPrimaryTicketTypes(allTicketTypes);
    
    log('info', `Filtered ticket types: ${allTicketTypes.length} → ${primaryTicketTypes.length} (removed secondary tickets)`, {
      region: this.region,
      eventId
    });
    
    // Get comprehensive ticket scraping results
    const scrapingResult = await this.getScrapedTickets(eventId);
    
    if (!scrapingResult) {
      log('error', `Failed to scrape tickets for event ${eventId}`, {
        region: this.region
      });
      throw new Error(`Failed to scrape tickets for event ${eventId}`);
    }
    
    // Get accurate per-type sold counts from scraped data
    const ticketTypeCounts = this.ticketScraper.getTicketTypeCounts(scrapingResult);
    
    log('info', `Scraped ${scrapingResult.totalFetched} tickets, found ${ticketTypeCounts.length} primary ticket types with sales`, {
      region: this.region,
      eventId,
      completionRate: scrapingResult.completionRate
    });
    
    // Calculate ticket type availability using real scraped data
    const ticketTypeAvailability: TicketTypeAvailability[] = [];
    let totalCapacity = 0;
    let totalSold = 0;
    
    for (const ticketType of primaryTicketTypes) {
      const capacity = ticketType.amount || 0;
      totalCapacity += capacity;
      
      // Get REAL sold count from scraped data
      const soldCount = this.ticketScraper.getSoldCountForTicketType(scrapingResult, ticketType.name);
      totalSold += soldCount;
      
      const available = Math.max(0, capacity - soldCount);
      const percentSold = capacity > 0 ? (soldCount / capacity) * 100 : 0;
      
      ticketTypeAvailability.push({
        id: ticketType._id,
        name: ticketType.name,
        capacity,
        sold: soldCount, // REAL count, not estimated!
        available,
        percentSold: Math.round(percentSold * 100) / 100,
        status: this.determineStatus(percentSold),
        price: ticketType.price
      });
    }
    
    // Calculate totals from primary tickets only
    const totalAvailable = Math.max(0, totalCapacity - totalSold);
    const totalPercentSold = totalCapacity > 0 ? (totalSold / totalCapacity) * 100 : 0;
    
    // Get shop breakdown if requested
    let shops: ShopAvailability[] | undefined;
    if (includeShops && event.underShops) {
      shops = [];
      for (const shop of event.underShops) {
        const shopSold = await this.getTicketCount(eventId, undefined, shop._id);
        shops.push({
          shopId: shop._id,
          shopName: shop.name || shop._id,
          sold: shopSold,
          percentOfTotal: totalSold > 0 ? (shopSold / totalSold) * 100 : 0
        });
      }
    }
    
    const availability: EventAvailability = {
      eventId: event._id,
      eventName: event.name,
      eventDate: event.start,
      region: this.region,
      ticketTypes: ticketTypeAvailability,
      totals: {
        capacity: totalCapacity,
        sold: totalSold,
        available: totalAvailable,
        percentSold: Math.round(totalPercentSold * 100) / 100,
        status: this.determineStatus(totalPercentSold)
      },
      shops,
      lastUpdated: new Date().toISOString()
    };
    
    // Cache the result
    await this.cacheAvailability(eventId, availability);
    
    // Log to debug
    await this.debugLogger.logProcessedMetrics(this.region, [{
      eventId: availability.eventId,
      eventName: availability.eventName,
      totalCapacity: availability.totals.capacity,
      totalSold: availability.totals.sold,
      percentSold: availability.totals.percentSold
    }]);
    
    log('info', `Availability calculated successfully`, {
      region: this.region,
      eventId,
      capacity: totalCapacity,
      sold: totalSold,
      percentSold: availability.totals.percentSold
    });
    
    return availability;
  }

  async getMultipleEventsAvailability(eventIds: string[]): Promise<EventAvailability[]> {
    const results: EventAvailability[] = [];
    
    for (const eventId of eventIds) {
      try {
        const availability = await this.getEventAvailability(eventId, false);
        results.push(availability);
      } catch (error) {
        log('error', `Failed to get availability for event ${eventId}`, {
          region: this.region,
          error: (error as Error).message
        });
      }
    }
    
    return results;
  }

  async getDashboardData(eventIds: string[]): Promise<DashboardData> {
    const events = await this.getMultipleEventsAvailability(eventIds);
    
    // Calculate summary statistics
    let totalCapacity = 0;
    let totalSold = 0;
    let totalAvailable = 0;
    let eventsNearSoldOut = 0;
    let eventsSoldOut = 0;
    
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
    
    const avgPercentSold = totalCapacity > 0 
      ? (totalSold / totalCapacity) * 100 
      : 0;
    
    return {
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
  }

  async getAccurateTicketTypeAvailability(
    eventId: string,
    ticketTypeId: string
  ): Promise<TicketTypeAvailability | null> {
    // This method fetches actual sold count for a specific ticket type
    // Use sparingly due to API rate limits
    
    const event = await this.getEventWithTickets(eventId);
    const ticketType = event.tickets?.find(t => t._id === ticketTypeId);
    
    if (!ticketType) return null;
    
    const capacity = ticketType.amount || 0;
    const sold = await this.getTicketCount(eventId, ticketTypeId);
    const available = Math.max(0, capacity - sold);
    const percentSold = capacity > 0 ? (sold / capacity) * 100 : 0;
    
    return {
      id: ticketType._id,
      name: ticketType.name,
      capacity,
      sold,
      available,
      percentSold: Math.round(percentSold * 100) / 100,
      status: this.determineStatus(percentSold),
      price: ticketType.price
    };
  }
}