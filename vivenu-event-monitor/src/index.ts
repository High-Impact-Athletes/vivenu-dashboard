import { Env } from './types/env';
import { handleEventUpdatedWebhook } from './handlers/webhook';
import { handleScheduledPoll } from './handlers/scheduled';
import { EventTracker } from './services/tracking';
import { log } from './services/validation';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		try {
			switch (url.pathname) {
				case '/webhook/event-updated':
					return await handleEventUpdatedWebhook(request, env);
				
				case '/health':
					return await handleHealthCheck(env);
				
				case '/status':
					return await handleStatus(env);
				
				default:
					return new Response('Not Found', { status: 404 });
			}
		} catch (error) {
			log('error', 'Unhandled error in fetch handler', {
				pathname: url.pathname,
				error: (error as Error).message,
				stack: (error as Error).stack
			});
			
			return new Response('Internal Server Error', { status: 500 });
		}
	},

	async scheduled(controller: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
		try {
			await handleScheduledPoll(controller, env);
		} catch (error) {
			log('error', 'Scheduled event handler failed', {
				error: (error as Error).message,
				stack: (error as Error).stack,
				scheduledTime: new Date(controller.scheduledTime).toISOString()
			});
			
			throw error;
		}
	}
} satisfies ExportedHandler<Env>;

async function handleHealthCheck(env: Env): Promise<Response> {
	try {
		const healthData = {
			status: 'healthy',
			timestamp: new Date().toISOString(),
			environment: env.ENVIRONMENT,
			version: '1.0.0'
		};

		return new Response(JSON.stringify(healthData), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({
			status: 'unhealthy',
			error: (error as Error).message,
			timestamp: new Date().toISOString()
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleStatus(env: Env): Promise<Response> {
	try {
		const lastPollData = env.KV ? await env.KV.get('last_poll_summary') : null;
		const recentWebhooks = env.KV ? await getRecentWebhookStats(env.KV) : null;
		
		// Get recent sales date changes
		let recentChanges = null;
		if (env.KV) {
			const eventTracker = new EventTracker(env.KV);
			const changes = await eventTracker.getRecentChanges(10);
			recentChanges = changes.map(c => ({
				eventName: c.eventName,
				region: c.region,
				changeType: c.changeType,
				previousValue: c.previousValue,
				newValue: c.newValue,
				changedAt: c.changedAt,
				source: c.source
			}));
		}
		
		const statusData = {
			status: 'operational',
			timestamp: new Date().toISOString(),
			environment: env.ENVIRONMENT || 'unknown',
			lastPoll: lastPollData ? JSON.parse(lastPollData) : null,
			recentWebhooks,
			recentSalesDateChanges: recentChanges,
			version: '1.0.0'
		};

		return new Response(JSON.stringify(statusData, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});
	} catch (error) {
		return new Response(JSON.stringify({
			status: 'error',
			error: (error as Error).message,
			timestamp: new Date().toISOString()
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function getRecentWebhookStats(kv: KVNamespace): Promise<any> {
	try {
		const list = await kv.list({ prefix: 'event_update:' });
		const recentCount = list.keys.length;
		
		return {
			recentEventUpdates: recentCount,
			lastUpdate: list.keys.length > 0 ? list.keys[0].name : null
		};
	} catch (error) {
		return {
			error: 'Failed to fetch webhook stats'
		};
	}
}
