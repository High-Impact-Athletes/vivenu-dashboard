import { Env } from '../types/env';
import { handleAvailabilityRequest } from './availability';

/**
 * Handles scheduled cron triggers for automated event data collection.
 * 
 * Runs daily at 4 AM UTC to collect comprehensive ticket availability data
 * from all configured Vivenu events and stores it in PostgreSQL database.
 * 
 * Uses comprehensive ticket scraping for accurate sold counts rather than
 * basic API calls that return misleading zero values.
 * 
 * @param controller - Cloudflare scheduled controller
 * @param env - Environment variables and secrets
 * @param ctx - Execution context
 */
export async function handleScheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  const when = new Date(controller.scheduledTime).toISOString();
  console.log(JSON.stringify({ level: 'info', message: 'Scheduled trigger executed', scheduledTime: when }));

  try {
    // Primary export: PostgreSQL database using comprehensive ticket scraping
    const request = new Request('http://internal/api/dashboard/export-to-sheets?source=vivenu&format=postgres', { method: 'POST' });
    const response = await handleAvailabilityRequest(request, env, ctx);

    const text = await response.text();
    console.log(JSON.stringify({ 
      level: 'info', 
      message: 'Scheduled PostgreSQL export response', 
      status: response.status, 
      source: 'vivenu',
      format: 'postgres',
      body: text 
    }));
  } catch (error) {
    console.log(JSON.stringify({ 
      level: 'error', 
      message: 'Scheduled PostgreSQL export failed', 
      error: (error as Error).message 
    }));
  }
}