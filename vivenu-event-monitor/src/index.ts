import { Env } from './types/env';
import { handleEventUpdatedWebhook } from './handlers/webhook';
import { handleScheduledPoll, performEventPoll } from './handlers/scheduled';
import { EventTracker } from './services/tracking';
import { GoogleSheetsClient } from './services/sheets';
import { createVivenuClients } from './services/vivenu';
import { log } from './services/validation';

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		const url = new URL(request.url);
		
		try {
			switch (url.pathname) {
				
				case '/health':
					return await handleHealthCheck(env);
				
				case '/status':
					return await handleStatus(env);
				
				case '/poll/manual':
					return await handleManualPoll(request, env);
				
				case '/test/google-auth':
					return await handleGoogleAuthTest(env);
				
				case '/test/ticket-data':
					return await handleTicketDataTest(env);
				
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
		return new Response('Health check failed', { status: 500 });
	}
}

async function handleStatus(env: Env): Promise<Response> {
	try {
		const statusData = {
			status: 'operational',
			timestamp: new Date().toISOString(),
			kv: await getKvStatus(env.KV),
			webhooks: await getWebhookStats(env.KV)
		};

		return new Response(JSON.stringify(statusData, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});

	} catch (error) {
		log('error', 'Status handler failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});

		return new Response('Status check failed', { status: 500 });
	}
}

async function getKvStatus(kv: KVNamespace | null): Promise<any> {
	if (!kv) {
		return { status: 'not_configured' };
	}

	try {
		// Test KV by setting and getting a test key
		const testKey = `test_${Date.now()}`;
		await kv.put(testKey, 'test', { expirationTtl: 60 });
		const result = await kv.get(testKey);
		await kv.delete(testKey);

		return {
			status: result === 'test' ? 'healthy' : 'error',
			readable: true,
			writable: true
		};
	} catch (error) {
		return {
			status: 'error',
			error: (error as Error).message
		};
	}
}

async function getWebhookStats(kv: KVNamespace | null): Promise<any> {
	if (!kv) {
		return { status: 'not_configured' };
	}

	try {
		// List recent webhook keys
		const list = await kv.list({ prefix: 'webhook:event-updated:', limit: 10 });
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

async function handleManualPoll(request: Request, env: Env): Promise<Response> {
	try {
		// Allow both GET and POST requests
		if (request.method !== 'GET' && request.method !== 'POST') {
			return new Response('Method Not Allowed', { 
				status: 405,
				headers: { 'Allow': 'GET, POST' }
			});
		}

		// Parse query parameters
		const url = new URL(request.url);
		const region = url.searchParams.get('region')?.toUpperCase() || undefined;

		log('info', 'Manual poll triggered', {
			method: request.method,
			region: region || 'all',
			userAgent: request.headers.get('User-Agent'),
			timestamp: new Date().toISOString()
		});

		// Execute the poll
		const pollResult = await performEventPoll(env, 'manual', region);

		// Return detailed response
		const response = {
			...pollResult,
			message: pollResult.status === 'completed' ? 
				`Manual poll completed successfully${region ? ` for region ${region}` : ''}` : 
				pollResult.status === 'partial' ? 
					`Manual poll completed with some errors${region ? ` for region ${region}` : ''}` : 
					`Manual poll failed${region ? ` for region ${region}` : ''}`,
			endpoint: '/poll/manual',
			triggeredBy: 'manual',
			requestedRegion: region || 'all'
		};

		const httpStatus = pollResult.status === 'completed' ? 200 : 
						  pollResult.status === 'partial' ? 207 : 500;

		return new Response(JSON.stringify(response, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: httpStatus
		});

	} catch (error) {
		log('error', 'Manual poll handler failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});

		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Manual poll handler failed',
			error: (error as Error).message,
			endpoint: '/poll/manual',
			triggeredBy: 'manual'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleGoogleAuthTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting Google Auth test');
		
		const sheetsClient = new GoogleSheetsClient(env);
		
		// Test authentication only - don't try to access sheets
		const testResult: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/google-auth',
			status: 'testing'
		};
		
		try {
			// Test cross-tabulated write format
			await sheetsClient.testCrossTabWrite();
			
			testResult.status = 'success';
			testResult.message = 'Google Sheets authentication and cross-tab write successful';
			
			log('info', 'Google Auth and write test completed successfully');
			
		} catch (error) {
			testResult.status = 'failed';
			testResult.error = (error as Error).message;
			testResult.message = 'Google Sheets authentication failed';
			
			log('error', 'Google Auth test failed', {
				error: (error as Error).message,
				stack: (error as Error).stack
			});
		}
		
		const httpStatus = testResult.status === 'success' ? 200 : 500;
		
		return new Response(JSON.stringify(testResult, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: httpStatus
		});
		
	} catch (error) {
		log('error', 'Google Auth test handler failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Google Auth test handler failed',
			error: (error as Error).message,
			endpoint: '/test/google-auth'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleTicketDataTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting ticket data test');
		
		// Get one DACH event to examine ticket types
		const clients = createVivenuClients(env);
		const dachClient = clients.find(client => client.region === 'DACH');
		
		if (!dachClient) {
			throw new Error('DACH client not found');
		}
		
		const events = await dachClient.getAllEvents();
		const hyroxEvents = events.filter(event => 
			event.name.toLowerCase().includes('hyrox') ||
			event.name.toLowerCase().includes('race')
		);
		
		if (hyroxEvents.length === 0) {
			throw new Error('No HYROX events found');
		}
		
		// Get metrics for the first event
		const firstEvent = hyroxEvents[0];
		const metrics = await dachClient.getTicketMetrics(firstEvent._id);
		
		if (!metrics) {
			throw new Error('Failed to get ticket metrics');
		}
		
		// Show the ticket types data structure
		const testResult = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/ticket-data',
			eventId: metrics.eventId,
			eventName: metrics.eventName,
			ticketTypes: metrics.ticketTypes,
			ticketTypeNames: metrics.ticketTypes.map(t => t.name),
			sampleCrossTabHeaders: ['Event ID'],
			status: 'success'
		};
		
		// Generate what the cross-tab headers would look like
		for (const ticketType of metrics.ticketTypes) {
			testResult.sampleCrossTabHeaders.push(`${ticketType.name} - Sold`);
			testResult.sampleCrossTabHeaders.push(`${ticketType.name} - Available`);
		}
		
		return new Response(JSON.stringify(testResult, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});
		
	} catch (error) {
		log('error', 'Ticket data test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Ticket data test failed',
			error: (error as Error).message,
			endpoint: '/test/ticket-data'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}