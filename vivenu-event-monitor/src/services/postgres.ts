import { neon } from '@neondatabase/serverless';
import type { EventAvailability } from '../types/availability';
import { log } from './validation';

export class PostgresClient {
  private sql: ReturnType<typeof neon>;

  constructor(databaseUrl: string) {
    if (!databaseUrl) {
      throw new Error('DATABASE_URL is required');
    }
    this.sql = neon(databaseUrl);
  }

  async writeSnapshot(events: EventAvailability[]): Promise<void> {
    if (!events || events.length === 0) {
      log('warn', 'No events provided to writeSnapshot');
      return;
    }

    log('info', `Writing snapshot for ${events.length} events to PostgreSQL`);

    try {
      // Build all queries for a single transaction
      const queries = [];

      for (const event of events) {
        // 1. Upsert event metadata
        queries.push(
          this.sql`
            INSERT INTO events (event_id, event_name, event_date, sales_start_date, region, status)
            VALUES (
              ${event.eventId}, 
              ${event.eventName}, 
              ${event.eventDate}, 
              ${null}, 
              ${event.region}, 
              ${event.totals.status}
            )
            ON CONFLICT (event_id) 
            DO UPDATE SET
              event_name = EXCLUDED.event_name,
              event_date = EXCLUDED.event_date,
              region = EXCLUDED.region,
              status = EXCLUDED.status
          `
        );

        // 2. Upsert ticket type definitions
        for (const ticketType of event.ticketTypes) {
          queries.push(
            this.sql`
              INSERT INTO ticket_types (event_id, ticket_type_id, ticket_type_name)
              VALUES (${event.eventId}, ${ticketType.id}, ${ticketType.name})
              ON CONFLICT (event_id, ticket_type_id)
              DO UPDATE SET ticket_type_name = EXCLUDED.ticket_type_name
            `
          );
        }

        // 3. Insert event snapshot
        const now = new Date().toISOString();
        queries.push(
          this.sql`
            INSERT INTO event_snapshots (
              snapshot_time, event_id, total_capacity, total_sold, 
              total_available, percent_sold, last_updated
            )
            VALUES (
              ${now}, ${event.eventId}, ${event.totals.capacity}, 
              ${event.totals.sold}, ${event.totals.available}, 
              ${event.totals.percentSold}, ${event.lastUpdated}
            )
          `
        );

        // 4. Insert ticket type snapshots
        for (const ticketType of event.ticketTypes) {
          queries.push(
            this.sql`
              INSERT INTO ticket_type_snapshots (
                snapshot_time, event_id, ticket_type_id, 
                capacity, sold, available
              )
              VALUES (
                ${now}, ${event.eventId}, ${ticketType.id},
                ${ticketType.capacity}, ${ticketType.sold}, ${ticketType.available}
              )
            `
          );
        }
      }

      // Execute all queries in a single transaction
      await this.sql.transaction(queries);

      log('info', `Successfully wrote snapshot for ${events.length} events to PostgreSQL`, {
        totalEvents: events.length,
        totalTicketTypes: events.reduce((sum, e) => sum + e.ticketTypes.length, 0),
        totalQueries: queries.length
      });

    } catch (error) {
      log('error', 'Failed to write snapshot to PostgreSQL', {
        error: (error as Error).message,
        eventsCount: events.length
      });
      throw error;
    }
  }

  async testConnection(): Promise<boolean> {
    try {
      const result = await this.sql`SELECT 1 as test`;
      return result.length === 1 && result[0].test === 1;
    } catch (error) {
      log('error', 'PostgreSQL connection test failed', {
        error: (error as Error).message
      });
      return false;
    }
  }

  async getLastSnapshotTime(eventId: string): Promise<Date | null> {
    try {
      const result = await this.sql`
        SELECT MAX(snapshot_time) as last_snapshot
        FROM event_snapshots
        WHERE event_id = ${eventId}
      `;
      
      if (result.length > 0 && result[0].last_snapshot) {
        return new Date(result[0].last_snapshot);
      }
      return null;
    } catch (error) {
      log('warn', 'Failed to get last snapshot time', {
        eventId,
        error: (error as Error).message
      });
      return null;
    }
  }
}