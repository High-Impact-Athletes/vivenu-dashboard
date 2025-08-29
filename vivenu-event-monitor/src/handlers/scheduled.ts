import { Env } from '../types/env';
import { handleAvailabilityRequest } from './availability';

export async function handleScheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  const when = new Date(controller.scheduledTime).toISOString();
  console.log(JSON.stringify({ level: 'info', message: 'Scheduled trigger executed', scheduledTime: when }));

  try {
    // Trigger export to Google Sheets using new analytics-friendly dashboard format
    const request = new Request('http://internal/api/dashboard/export-to-sheets?format=dashboard', { method: 'POST' });
    const response = await handleAvailabilityRequest(request, env, ctx);

    const text = await response.text();
    console.log(JSON.stringify({ 
      level: 'info', 
      message: 'Scheduled dashboard export response', 
      status: response.status, 
      format: 'dashboard',
      body: text 
    }));
  } catch (error) {
    console.log(JSON.stringify({ 
      level: 'error', 
      message: 'Scheduled dashboard export failed', 
      error: (error as Error).message 
    }));
  }
}