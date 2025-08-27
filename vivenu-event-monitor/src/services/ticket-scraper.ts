import { Env } from '../types/env';
import { log } from './validation';
import { fetchWithRetry } from '../utils/retry';

export interface ScrapedTicket {
  _id: string;
  ticketName: string;
  name: string;
  email?: string;
  status: string;
  createdAt: string;
  realPrice?: number;
  barcode?: string;
  eventId: string;
}

export interface TicketScrapingResult {
  tickets: ScrapedTicket[];
  totalFetched: number;
  expectedTotal: number;
  completionRate: number;
  scrapedAt: string;
}

export interface TicketTypeCount {
  ticketName: string;
  soldCount: number;
  isPrimary: boolean;
}

export class TicketScraper {
  private region: string;
  private apiKey: string;
  private baseUrl: string;

  constructor(region: string, env: Env) {
    this.region = region;
    this.apiKey = env[`${region}_API` as keyof Env] as string;
    
    if (!this.apiKey) {
      throw new Error(`No API key found for region ${region}`);
    }

    // Determine base URL based on region
    if (region === 'DEV' || region === 'TEST') {
      this.baseUrl = 'https://vivenu.dev/api';
    } else {
      this.baseUrl = 'https://vivenu.com/api';
    }
  }

  /**
   * Check if a ticket type is secondary (should be excluded from availability)
   */
  private isSecondaryTicket(ticketName: string): boolean {
    const secondaryIndicators = [
      'ATHLETE 2',
      'TEAM MEMBER',
      'Sportograf Photo Package',
      'Photo Package'
    ];
    
    return secondaryIndicators.some(indicator => 
      ticketName.toUpperCase().includes(indicator.toUpperCase())
    );
  }

  /**
   * Exponential backoff with jitter for retries
   */
  private exponentialBackoff(attempt: number): number {
    const baseDelay = 1000; // 1 second
    const maxDelay = 30000; // 30 seconds
    const delay = Math.min(baseDelay * (2 ** attempt), maxDelay);
    // Add 20% jitter to avoid thundering herd
    const jitter = delay * 0.2 * Math.random();
    return delay + jitter;
  }

  /**
   * Fetch ALL tickets for an event with robust pagination and error handling
   * Based on historical_sync.py:get_tickets_for_event()
   */
  async scrapeAllTickets(eventId: string): Promise<TicketScrapingResult> {
    log(`🎫 Starting comprehensive ticket scraping for event ${eventId}`);
    
    const allTickets: ScrapedTicket[] = [];
    let skip = 0;
    let initialBatchSize = 100;
    let batchSize = initialBatchSize;
    const minBatchSize = 10;
    let callCount = 0;
    const maxRetries = 3;
    let expectedTotal: number | null = null;
    
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json'
    };

    while (true) {
      callCount++;
      const url = `${this.baseUrl}/tickets`;
      const params = new URLSearchParams({
        event: eventId,
        top: batchSize.toString(),
        skip: skip.toString()
      });

      log(`📞 API Call #${callCount}: skip=${skip}, batch_size=${batchSize}`);

      // Retry logic for 503 errors and other failures
      let success = false;
      let tickets: any[] = [];
      let total = 0;

      for (let attempt = 0; attempt < maxRetries; attempt++) {
        try {
          const startTime = Date.now();
          
          const response = await fetchWithRetry(`${url}?${params}`, {
            method: 'GET',
            headers,
            timeout: 15000
          });

          if (response.status === 503) {
            const delay = this.exponentialBackoff(attempt);
            log(`⏳ 503 Service Unavailable (attempt ${attempt + 1}/${maxRetries})`);
            
            if (attempt < maxRetries - 1) {
              log(`⏰ Waiting ${(delay / 1000).toFixed(1)}s before retry...`);
              await new Promise(resolve => setTimeout(resolve, delay));
              
              // Reduce batch size on repeated 503s
              if (attempt > 0 && batchSize > minBatchSize) {
                batchSize = Math.max(minBatchSize, Math.floor(batchSize / 2));
                params.set('top', batchSize.toString());
                log(`📉 Reducing batch size to ${batchSize}`);
              }
              continue;
            } else {
              log(`❌ Failed after ${maxRetries} 503 attempts`);
              break;
            }
          }

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          tickets = data.rows || [];
          total = data.total || 0;
          
          const elapsed = Date.now() - startTime;

          // Set expected total on first successful call
          if (expectedTotal === null) {
            expectedTotal = total;
            log(`🎯 Expected total tickets: ${expectedTotal.toLocaleString()}`);
          }

          allTickets.push(...tickets.map(ticket => ({
            _id: ticket._id,
            ticketName: ticket.ticketName,
            name: ticket.name,
            email: ticket.email,
            status: ticket.status,
            createdAt: ticket.createdAt,
            realPrice: ticket.realPrice,
            barcode: ticket.barcode,
            eventId: ticket.eventId || eventId
          })));

          // Progress logging
          const progressPct = expectedTotal > 0 ? (allTickets.length / expectedTotal * 100) : 0;
          log(`✅ Got ${tickets.length} tickets in ${elapsed}ms`);
          log(`📊 Progress: ${allTickets.length.toLocaleString()}/${expectedTotal.toLocaleString()} (${progressPct.toFixed(1)}%)`);

          success = true;
          break;

        } catch (error) {
          const delay = this.exponentialBackoff(attempt);
          log(`🔄 Request error (attempt ${attempt + 1}/${maxRetries}): ${error}`);
          
          if (attempt < maxRetries - 1) {
            log(`⏰ Waiting ${(delay / 1000).toFixed(1)}s before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
            continue;
          } else {
            log(`❌ Failed after ${maxRetries} attempts: ${error}`);
            break;
          }
        }
      }

      if (!success) {
        log(`❌ Batch failed at skip=${skip}`);
        log(`📊 Successfully fetched ${allTickets.length} tickets before failure`);
        break;
      }

      // Check completion conditions
      if (tickets.length === 0) {
        log(`🏁 No more tickets returned - stopping`);
        break;
      } else if (expectedTotal && allTickets.length >= expectedTotal) {
        log(`🏁 Got all expected tickets (${allTickets.length.toLocaleString()}) - stopping`);
        break;
      }

      skip += tickets.length;

      // Small delay between requests to be nice to the API
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Calculate completion rate
    const completionRate = expectedTotal ? (allTickets.length / expectedTotal * 100) : 0;

    log(`\n📥 SCRAPING COMPLETE!`);
    log(`   Total tickets fetched: ${allTickets.length.toLocaleString()}`);
    log(`   Expected tickets: ${(expectedTotal || 0).toLocaleString()}`);
    log(`   Completion rate: ${completionRate.toFixed(1)}%`);
    log(`   API calls made: ${callCount}`);

    if (completionRate < 95) {
      log(`   ⚠️  WARNING: Only got ${completionRate.toFixed(1)}% of expected tickets!`);
    }

    return {
      tickets: allTickets,
      totalFetched: allTickets.length,
      expectedTotal: expectedTotal || 0,
      completionRate,
      scrapedAt: new Date().toISOString()
    };
  }

  /**
   * Analyze scraped tickets to get accurate per-type sold counts
   * Filters out secondary tickets automatically
   */
  getTicketTypeCounts(scrapingResult: TicketScrapingResult): TicketTypeCount[] {
    const counts = new Map<string, number>();
    
    // Count tickets by type, filtering out secondary tickets
    for (const ticket of scrapingResult.tickets) {
      const ticketName = ticket.ticketName;
      const isPrimary = !this.isSecondaryTicket(ticketName);
      
      if (isPrimary) {
        counts.set(ticketName, (counts.get(ticketName) || 0) + 1);
      }
    }

    // Convert to array and sort by count (highest first)
    return Array.from(counts.entries())
      .map(([ticketName, soldCount]) => ({
        ticketName,
        soldCount,
        isPrimary: true
      }))
      .sort((a, b) => b.soldCount - a.soldCount);
  }

  /**
   * Filter ticket types from event data to exclude secondary tickets
   */
  filterPrimaryTicketTypes(ticketTypes: any[]): any[] {
    return ticketTypes.filter(ticketType => !this.isSecondaryTicket(ticketType.name));
  }

  /**
   * Get sold count for a specific ticket type from scraped data
   */
  getSoldCountForTicketType(scrapingResult: TicketScrapingResult, ticketTypeName: string): number {
    return scrapingResult.tickets
      .filter(ticket => ticket.ticketName === ticketTypeName)
      .length;
  }
}