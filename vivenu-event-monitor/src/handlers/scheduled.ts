import { Env } from '../types/env';
import { handleAvailabilityRequest } from './availability';

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