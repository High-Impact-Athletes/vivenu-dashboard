import { Env } from '../types/env';
import { handleAvailabilityRequest } from './availability';

export async function handleScheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
  const when = new Date(controller.scheduledTime).toISOString();
  console.log(JSON.stringify({ level: 'info', message: 'Scheduled trigger executed', scheduledTime: when }));

  try {
    // Trigger export to Google Sheets via internal handler to reuse logic
    const request = new Request('http://internal/api/dashboard/export-to-sheets', { method: 'POST' });
    const response = await handleAvailabilityRequest(request, env, ctx);

    const text = await response.text();
    console.log(JSON.stringify({ level: 'info', message: 'Scheduled export response', status: response.status, body: text }));
  } catch (error) {
    console.log(JSON.stringify({ level: 'error', message: 'Scheduled export failed', error: (error as Error).message }));
  }
}