import { Env } from '../types/env';
import { handleAvailabilityRequest } from './availability';

export async function handleScheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  const when = new Date(controller.scheduledTime).toISOString();
  console.log(JSON.stringify({ level: 'info', message: 'Scheduled trigger executed', scheduledTime: when }));

  try {
    // Trigger auto-discovery export to Google Sheets - finds all HYROX events with charity tickets
    const request = new Request('http://internal/api/dashboard/export-to-sheets?source=vivenu&format=dashboard', { method: 'POST' });
    const response = await handleAvailabilityRequest(request, env, ctx);

    const text = await response.text();
    console.log(JSON.stringify({ 
      level: 'info', 
      message: 'Scheduled auto-discovery export response', 
      status: response.status, 
      source: 'vivenu',
      format: 'dashboard',
      body: text 
    }));
  } catch (error) {
    console.log(JSON.stringify({ 
      level: 'error', 
      message: 'Scheduled auto-discovery export failed', 
      error: (error as Error).message 
    }));
  }
}