import { env, createExecutionContext, waitOnExecutionContext, SELF } from 'cloudflare:test';
import { describe, it, expect } from 'vitest';
import worker from '../src';

describe('Worker skeleton', () => {
	it('GET /health returns ok (unit)', async () => {
		const request = new Request<unknown, IncomingRequestCfProperties>('http://example.com/health');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		await waitOnExecutionContext(ctx);
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json.status).toBe('ok');
	});

	it('POST /webhook/event-updated returns 200 (integration)', async () => {
		const request = new Request('http://example.com/webhook/event-updated', { method: 'POST', body: '{}' });
		const response = await SELF.fetch(request);
		expect(response.status).toBe(200);
		const json = await response.json();
		expect(json.ok).toBe(true);
	});
});
