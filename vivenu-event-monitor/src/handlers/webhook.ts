import { Env } from '../types/env';

export async function handleEventUpdatedWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  // Intentionally ignore payload and perform no side effects
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'Content-Type': 'application/json' },
    status: 200
  });
}