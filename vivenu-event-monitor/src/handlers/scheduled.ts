import { Env } from '../types/env';

export async function handleScheduled(controller: ScheduledController, env: Env): Promise<void> {
  const when = new Date(controller.scheduledTime).toISOString();
  console.log(JSON.stringify({ level: 'info', message: 'Scheduled trigger executed', scheduledTime: when }));
}