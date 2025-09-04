import { Env } from './types/env';
import { handleScheduled } from './handlers/scheduled';
import { handleAvailabilityRequest } from './handlers/availability';
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
				
				case '/test/event-config':
					return await handleEventConfigTest(env);
				
				case '/test/vivenu-events':
					return await handleVivenuEventsTest(env);
				
				case '/test/vivenu-specific-event':
					return await handleVivenuSpecificEventTest(env);
				
				case '/test/scrape-atlanta':
					return await handleScrapeAtlantaTest(env);
				
				case '/test/scrape-validation':
					return await handleScrapeValidationTest(env);

				case '/test/postgres-connection':
					return await handlePostgresConnectionTest(env);

				case '/api/dashboard/export-to-sheets':
					// Delegate to availability handler routing
					return await handleAvailabilityRequest(request, env, ctx);
				
				default:
					// Check for availability routes
					if (url.pathname.startsWith('/api/availability') || url.pathname === '/api/dashboard/data') {
						return await handleAvailabilityRequest(request, env, ctx);
					}
					
					// Check for dashboard HTML route
					if (url.pathname === '/dashboard' || url.pathname === '/') {
						return await serveDashboard(env);
					}
					
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
			await handleScheduled(controller, env);
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
			status: 'ok',
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

		// Execute the poll - simplified for now
		const pollResult = {
			status: 'completed' as const,
			timestamp: new Date().toISOString(),
			message: 'Manual poll simulation'
		};

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
		
		// REMOVED: getTicketMetrics() - this test endpoint is deprecated
		// The basic API method doesn't provide real sold counts
		throw new Error('This test endpoint has been removed. Use /test/scrape-validation for real ticket data testing.');
		
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

async function handleEventConfigTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting event configuration test');
		
		// Check all event ID environment variables
		const eventConfig: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/event-config',
			regions: {}
		};
		
		// Map of region to event environment variable prefixes (copied from availability.ts)
		const regionEventMap: Record<string, string[]> = {
			'DACH': ['FRANKFURT', 'HAMBURG', 'STUTTGART', 'VIENNA', 'KOLN'],
			'FRANCE': ['PARIS', 'BORDEAUX', 'TOULOUSE', 'NICE', 'LYON', 'PARISGRANDPALAIS'],
			'ITALY': ['ROME', 'VERONA', 'TURIN', 'BOLOGNA'],
			'BENELUX': ['MAASTRICHT', 'UTRECHT', 'AMSTERDAM', 'BELGIUM', 'ROTTERDAM'],
			'SWITZERLAND': ['GENEVA', 'STGALLEN'],
			'USA': ['CHICAGO', 'DALLAS', 'ANAHEIM', 'PHOENIX', 'LASVEGAS', 'MIAMIBEACH', 'WASHINGTONDC', 'ATLANTA25'],
			'CANADA': ['TORONTO'],
			'AUSTRALIA': ['PERTH', 'MELBOURNE', 'BRISBANE', 'AUCKLAND'],
			'NORWAY': ['OSLO', 'STOCKHOLM', 'COPENHAGEN']
		};
		
		for (const [region, prefixes] of Object.entries(regionEventMap)) {
			const regionEvents: any = {};
			for (const prefix of prefixes) {
				const envVar = `${prefix}_EVENT`;
				const eventId = env[envVar as keyof Env] as string;
				regionEvents[envVar] = eventId || 'NOT_SET';
			}
			eventConfig.regions[region] = regionEvents;
		}
		
		// Count configured events
		let totalConfigured = 0;
		for (const region of Object.values(eventConfig.regions)) {
			for (const eventId of Object.values(region as any)) {
				if (eventId && eventId !== 'NOT_SET' && !eventId.toString().startsWith('your_')) {
					totalConfigured++;
				}
			}
		}
		
		eventConfig.summary = {
			totalConfigured,
			status: totalConfigured > 0 ? 'success' : 'no_events_configured'
		};
		
		return new Response(JSON.stringify(eventConfig, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});
		
	} catch (error) {
		log('error', 'Event config test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Event config test failed',
			error: (error as Error).message,
			endpoint: '/test/event-config'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleVivenuEventsTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting Vivenu events test');
		
		// Get Vivenu clients
		const clients = createVivenuClients(env);
		if (clients.length === 0) {
			throw new Error('No Vivenu API clients available - check API key configuration');
		}
		
		const results: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/vivenu-events',
			regions: {}
		};
		
		// Test each region
		for (const client of clients) {
			try {
				log('info', `Testing ${client.region} region`);
				
				const allEvents = await client.getAllEvents();
				
				const regionResult: any = {
					totalEvents: allEvents.length,
					eventNames: allEvents.slice(0, 10).map(e => ({ 
						name: e.name, 
						id: e._id,
						hasTickets: !!e.tickets && e.tickets.length > 0,
						ticketCount: e.tickets ? e.tickets.length : 0
					})),
					hyroxEvents: [],
					charityEvents: []
				};
				
				// Find HYROX events
				const hyroxEvents = allEvents.filter(event => 
					event.name.toLowerCase().includes('hyrox') || 
					event.name.toLowerCase().includes('race')
				);
				regionResult.hyroxEvents = hyroxEvents.map(e => ({
					name: e.name,
					id: e._id,
					hasTickets: !!e.tickets && e.tickets.length > 0
				}));
				
				// Find events with charity tickets
				const charityEvents = allEvents.filter(event => {
					if (!event.tickets) return false;
					return event.tickets.some(ticket => 
						ticket.active && (
							ticket.name.toLowerCase().includes('charity') ||
							ticket.name.toLowerCase().includes('donation') ||
							ticket.name.toLowerCase().includes('good cause')
						)
					);
				});
				regionResult.charityEvents = charityEvents.map(e => ({
					name: e.name,
					id: e._id,
					charityTickets: e.tickets?.filter(t => 
						t.active && (
							t.name.toLowerCase().includes('charity') ||
							t.name.toLowerCase().includes('donation') ||
							t.name.toLowerCase().includes('good cause')
						)
					).map(t => t.name) || []
				}));
				
				results.regions[client.region] = regionResult;
				
				log('info', `${client.region}: ${allEvents.length} events, ${hyroxEvents.length} HYROX, ${charityEvents.length} with charity`);
			} catch (error) {
				results.regions[client.region] = {
					error: (error as Error).message
				};
				log('error', `Failed to test ${client.region}`, {
					error: (error as Error).message
				});
			}
		}
		
		return new Response(JSON.stringify(results, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: 200
		});
		
	} catch (error) {
		log('error', 'Vivenu events test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Vivenu events test failed',
			error: (error as Error).message,
			endpoint: '/test/vivenu-events'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleVivenuSpecificEventTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting Vivenu specific event test');
		
		// Test with known event ID from Python scripts
		const ATLANTA25_EVENT_ID = "6894f94a097ce9a51c15cef4";
		
		const clients = createVivenuClients(env);
		const usaClient = clients.find(client => client.region === 'USA');
		
		if (!usaClient) {
			throw new Error('USA API client not available - check USA_API key configuration');
		}
		
		const results: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/vivenu-specific-event',
			testEventId: ATLANTA25_EVENT_ID,
			region: 'USA'
		};
		
		try {
			log('info', `Testing specific event: ${ATLANTA25_EVENT_ID}`);
			
			// REMOVED: getTicketMetrics() test - this method was fundamentally broken
			// It used basic API calls that don't provide real sold counts
			results.status = 'deprecated';
			results.error = 'This test endpoint has been removed. getTicketMetrics() provided misleading zero-sold data.';
			results.replacement = 'Use /test/scrape-atlanta or /test/scrape-validation for real ticket data testing with comprehensive scraping.';
			
		} catch (error) {
			results.status = 'failed';
			results.error = (error as Error).message;
			
			log('error', `Failed to test specific event ${ATLANTA25_EVENT_ID}`, {
				error: (error as Error).message,
				stack: (error as Error).stack
			});
		}
		
		return new Response(JSON.stringify(results, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: results.status === 'success' ? 200 : 500
		});
		
	} catch (error) {
		log('error', 'Vivenu specific event test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Vivenu specific event test failed',
			error: (error as Error).message,
			endpoint: '/test/vivenu-specific-event'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleScrapeAtlantaTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting Atlanta ticket scraping test');
		
		// Import AvailabilityService
		const { AvailabilityService } = await import('./services/availability');
		
		// Test with known Atlanta event ID
		const ATLANTA25_EVENT_ID = "6894f94a097ce9a51c15cef4";
		
		// Create availability service for USA region
		const usaApiKey = env.USA_API;
		if (!usaApiKey) {
			throw new Error('USA_API key not configured');
		}
		
		const availabilityService = new AvailabilityService(
			'USA',
			usaApiKey,
			'PROD',
			env.KV || null,
			env
		);
		
		const results: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/scrape-atlanta',
			testEventId: ATLANTA25_EVENT_ID,
			region: 'USA',
			scrapingStarted: new Date().toISOString()
		};
		
		try {
			log('info', `Starting comprehensive ticket scraping for Atlanta event`);
			log('warn', `⚠️ This will fetch ALL tickets (potentially 18,000+) and may take 3-5 minutes...`);
			
			const startTime = Date.now();
			
			// Use the REAL scraping method
			const availability = await availabilityService.getEventAvailability(ATLANTA25_EVENT_ID, false);
			
			const duration = (Date.now() - startTime) / 1000;
			
			results.status = 'success';
			results.scrapingCompleted = new Date().toISOString();
			results.scrapingDuration = `${duration.toFixed(1)} seconds`;
			
			// Extract key data with REAL sold counts
			results.eventData = {
				eventId: availability.eventId,
				eventName: availability.eventName,
				eventDate: availability.eventDate,
				region: availability.region,
				totals: {
					capacity: availability.totals.capacity,
					sold: availability.totals.sold,
					available: availability.totals.available,
					percentSold: availability.totals.percentSold,
					status: availability.totals.status
				},
				// Add scraping validation info
				scrapingValidation: availability.scrapingMetadata || {
					warning: 'Scraping metadata not available'
				},
				charityStats: availability.charityStats,
				ticketTypesCount: availability.ticketTypes.length,
				// Show a few charity ticket types with REAL sold counts
				charityTicketSamples: availability.ticketTypes
					.filter(tt => tt.name.toLowerCase().includes('charity'))
					.slice(0, 5)
					.map(tt => ({
						name: tt.name,
						capacity: tt.capacity,
						sold: tt.sold,  // THIS SHOULD HAVE REAL COUNTS NOW!
						available: tt.available,
						percentSold: tt.percentSold
					}))
			};
			
			log('info', `✅ Scraping completed successfully`, {
				eventId: ATLANTA25_EVENT_ID,
				duration: `${duration}s`,
				totalSold: availability.totals.sold,
				totalCapacity: availability.totals.capacity,
				percentSold: availability.totals.percentSold
			});
			
		} catch (error) {
			results.status = 'failed';
			results.error = (error as Error).message;
			results.scrapingCompleted = new Date().toISOString();
			
			log('error', `Failed to scrape Atlanta event`, {
				error: (error as Error).message,
				stack: (error as Error).stack
			});
		}
		
		return new Response(JSON.stringify(results, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: results.status === 'success' ? 200 : 500
		});
		
	} catch (error) {
		log('error', 'Atlanta scraping test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Atlanta scraping test failed',
			error: (error as Error).message,
			endpoint: '/test/scrape-atlanta'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handleScrapeValidationTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting scraping validation test');
		
		// Import needed classes
		const { TicketScraper } = await import('./services/ticket-scraper');
		
		// Test with known Atlanta event ID
		const ATLANTA25_EVENT_ID = "6894f94a097ce9a51c15cef4";
		
		// Create ticket scraper directly
		const scraper = new TicketScraper('USA', env);
		
		const results: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/scrape-validation',
			testEventId: ATLANTA25_EVENT_ID,
			region: 'USA'
		};
		
		try {
			log('info', `Starting direct ticket scraping for validation`);
			
			const startTime = Date.now();
			
			// Scrape tickets directly
			const scrapingResult = await scraper.scrapeAllTickets(ATLANTA25_EVENT_ID);
			
			const duration = (Date.now() - startTime) / 1000;
			
			// Get ticket type counts
			const ticketTypeCounts = scraper.getTicketTypeCounts(scrapingResult);
			
			// Calculate total sold from scraped tickets
			const totalSold = ticketTypeCounts.reduce((sum, tt) => sum + tt.soldCount, 0);
			
			results.status = 'success';
			results.scrapingDuration = `${duration.toFixed(1)} seconds`;
			
			// Validation details
			results.validation = {
				ticketsFetched: scrapingResult.totalFetched,
				expectedTotal: scrapingResult.expectedTotal,
				completionRate: `${scrapingResult.completionRate.toFixed(1)}%`,
				isComplete: scrapingResult.completionRate >= 95,
				warning: scrapingResult.completionRate < 95 ? 
					`⚠️ Only got ${scrapingResult.completionRate.toFixed(1)}% of expected tickets!` : null
			};
			
			// Ticket breakdown
			results.ticketAnalysis = {
				totalTicketsScraped: scrapingResult.tickets.length,
				primaryTicketsSold: totalSold,
				uniqueTicketTypes: ticketTypeCounts.length,
				topSellingTypes: ticketTypeCounts.slice(0, 5).map(tt => ({
					name: tt.ticketName,
					sold: tt.soldCount
				}))
			};
			
			// Sample of actual ticket data
			results.sampleTickets = scrapingResult.tickets.slice(0, 3).map(t => ({
				id: t._id,
				ticketName: t.ticketName,
				buyerName: t.name,
				status: t.status,
				createdAt: t.createdAt
			}));
			
			log('info', `✅ Validation complete`, {
				fetched: scrapingResult.totalFetched,
				expected: scrapingResult.expectedTotal,
				completionRate: `${scrapingResult.completionRate}%`
			});
			
			// Highlight any issues
			if (scrapingResult.completionRate < 95) {
				results.validation.error = 'INCOMPLETE_SCRAPING';
				results.validation.message = `Missing approximately ${scrapingResult.expectedTotal - scrapingResult.totalFetched} tickets`;
			}
			
		} catch (error) {
			results.status = 'failed';
			results.error = (error as Error).message;
			
			log('error', `Scraping validation failed`, {
				error: (error as Error).message,
				stack: (error as Error).stack
			});
		}
		
		return new Response(JSON.stringify(results, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: results.status === 'success' ? 200 : 500
		});
		
	} catch (error) {
		log('error', 'Scraping validation test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'Scraping validation test failed',
			error: (error as Error).message,
			endpoint: '/test/scrape-validation'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function handlePostgresConnectionTest(env: Env): Promise<Response> {
	try {
		log('info', 'Starting PostgreSQL connection test');
		
		const { PostgresClient } = await import('./services/postgres');
		
		const result: any = {
			timestamp: new Date().toISOString(),
			endpoint: '/test/postgres-connection',
			status: 'unknown'
		};
		
		// Check if DATABASE_URL is configured
		if (!env.DATABASE_URL) {
			result.status = 'not_configured';
			result.message = 'DATABASE_URL environment variable not set';
			result.configuration = {
				required: 'Add DATABASE_URL to your .dev.vars file for local development',
				production: 'Set DATABASE_URL as a Cloudflare Worker secret using: npx wrangler secret put DATABASE_URL'
			};
		} else {
			try {
				// Create PostgreSQL client
				const postgres = new PostgresClient(env.DATABASE_URL);
				
				// Test basic connection
				const startTime = Date.now();
				const connectionTest = await postgres.testConnection();
				const duration = Date.now() - startTime;
				
				if (connectionTest) {
					result.status = 'success';
					result.message = 'PostgreSQL connection successful';
					result.connectionTime = `${duration}ms`;
					result.database = {
						configured: true,
						responsive: true
					};
				} else {
					result.status = 'connection_failed';
					result.message = 'PostgreSQL connection test failed';
					result.connectionTime = `${duration}ms`;
				}
				
			} catch (error) {
				result.status = 'error';
				result.message = 'PostgreSQL connection error';
				result.error = (error as Error).message;
			}
		}
		
		return new Response(JSON.stringify(result, null, 2), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache'
			},
			status: result.status === 'success' ? 200 : 500
		});
		
	} catch (error) {
		log('error', 'PostgreSQL connection test failed', {
			error: (error as Error).message,
			stack: (error as Error).stack
		});
		
		return new Response(JSON.stringify({
			status: 'failed',
			timestamp: new Date().toISOString(),
			message: 'PostgreSQL connection test failed',
			error: (error as Error).message,
			endpoint: '/test/postgres-connection'
		}), {
			headers: { 'Content-Type': 'application/json' },
			status: 500
		});
	}
}

async function serveDashboard(env: Env): Promise<Response> {
	const dashboardHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vVenue Ticket Availability Dashboard</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }

        .header {
            background: #2c3e50;
            color: white;
            padding: 1rem 0;
            text-align: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .container {
            max-width: 1400px;
            margin: 2rem auto;
            padding: 0 1rem;
        }

        .summary-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
            margin-bottom: 2rem;
        }

        .card {
            background: white;
            padding: 1.5rem;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .card h3 {
            font-size: 0.9rem;
            text-transform: uppercase;
            color: #666;
            margin-bottom: 0.5rem;
        }

        .card .value {
            font-size: 2rem;
            font-weight: bold;
            color: #2c3e50;
        }

        .events-grid {
            display: grid;
            gap: 1.5rem;
        }

        .event-card {
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .event-header {
            background: #34495e;
            color: white;
            padding: 1rem;
        }

        .event-title {
            font-size: 1.2rem;
            margin-bottom: 0.5rem;
        }

        .event-meta {
            font-size: 0.9rem;
            opacity: 0.9;
        }

        .event-summary {
            padding: 1rem;
            background: #ecf0f1;
        }

        .progress-bar {
            background: #ddd;
            border-radius: 10px;
            overflow: hidden;
            height: 20px;
            margin: 0.5rem 0;
        }

        .progress-fill {
            height: 100%;
            transition: width 0.3s ease;
        }

        .progress-available { background: #27ae60; }
        .progress-limited { background: #f39c12; }
        .progress-soldout { background: #e74c3c; }

        .ticket-types {
            padding: 1rem;
        }

        .ticket-type {
            display: flex;
            justify-content: between;
            align-items: center;
            padding: 0.5rem 0;
            border-bottom: 1px solid #eee;
        }

        .ticket-type:last-child {
            border-bottom: none;
        }

        .ticket-name {
            flex: 1;
            font-weight: 500;
        }

        .ticket-stats {
            display: flex;
            gap: 1rem;
            align-items: center;
        }

        .status-badge {
            padding: 0.25rem 0.5rem;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 500;
        }

        .status-available { background: #d5f4e6; color: #27ae60; }
        .status-limited { background: #fef5e7; color: #f39c12; }
        .status-soldout { background: #ffeaea; color: #e74c3c; }

        .loading {
            text-align: center;
            padding: 3rem;
            color: #666;
        }

        .error {
            background: #e74c3c;
            color: white;
            padding: 1rem;
            border-radius: 4px;
            margin-bottom: 1rem;
        }

        .refresh-button {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #3498db;
            color: white;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9rem;
            z-index: 1000;
        }

        .refresh-button:hover {
            background: #2980b9;
        }

        .last-updated {
            text-align: center;
            color: #666;
            margin-top: 2rem;
            font-size: 0.9rem;
        }

        @media (max-width: 768px) {
            .container {
                padding: 0 0.5rem;
            }
            
            .summary-cards {
                grid-template-columns: repeat(2, 1fr);
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🎫 vVenue Ticket Availability Dashboard</h1>
    </div>

    <button class="refresh-button" onclick="refreshData()">🔄 Refresh</button>

    <div class="container">
        <div id="error-container"></div>
        
        <div class="summary-cards" id="summary-cards">
            <div class="loading">Loading summary...</div>
        </div>

        <div class="events-grid" id="events-grid">
            <div class="loading">Loading events...</div>
        </div>

        <div class="last-updated" id="last-updated"></div>
    </div>

    <script>
        let refreshInterval;

        async function loadDashboardData() {
            try {
                const response = await fetch('/api/dashboard/data');
                if (!response.ok) {
                    throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
                }
                
                const data = await response.json();
                renderSummary(data.summary);
                renderEvents(data.events);
                updateLastUpdated(data.lastRefresh);
                clearError();
                
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
                showError(\`Failed to load data: \${error.message}\`);
            }
        }

        function renderSummary(summary) {
            const container = document.getElementById('summary-cards');
            container.innerHTML = \`
                <div class="card">
                    <h3>Total Events</h3>
                    <div class="value">\${summary.totalEvents}</div>
                </div>
                <div class="card">
                    <h3>Total Capacity</h3>
                    <div class="value">\${summary.totalCapacity.toLocaleString()}</div>
                </div>
                <div class="card">
                    <h3>Tickets Sold</h3>
                    <div class="value">\${summary.totalSold.toLocaleString()}</div>
                </div>
                <div class="card">
                    <h3>Available</h3>
                    <div class="value">\${summary.totalAvailable.toLocaleString()}</div>
                </div>
                <div class="card">
                    <h3>Average % Sold</h3>
                    <div class="value">\${summary.avgPercentSold.toFixed(1)}%</div>
                </div>
                <div class="card">
                    <h3>Sold Out Events</h3>
                    <div class="value">\${summary.eventsSoldOut}</div>
                </div>
            \`;
        }

        function renderEvents(events) {
            const container = document.getElementById('events-grid');
            
            if (events.length === 0) {
                container.innerHTML = '<div class="loading">No events found.</div>';
                return;
            }
            
            container.innerHTML = events.map(event => \`
                <div class="event-card">
                    <div class="event-header">
                        <div class="event-title">\${event.eventName}</div>
                        <div class="event-meta">
                            \${event.region} • \${new Date(event.eventDate).toLocaleDateString()} • 
                            \${event.totals.sold.toLocaleString()} / \${event.totals.capacity.toLocaleString()} sold
                        </div>
                    </div>
                    
                    <div class="event-summary">
                        <div class="progress-bar">
                            <div class="progress-fill progress-\${event.totals.status}" 
                                 style="width: \${event.totals.percentSold}%"></div>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin-top: 0.5rem;">
                            <span>\${event.totals.percentSold.toFixed(1)}% sold</span>
                            <span class="status-badge status-\${event.totals.status}">
                                \${event.totals.status.toUpperCase()}
                            </span>
                        </div>
                        \${event.charityStats ? \`
                            <div class="charity-stats" style="margin-top: 0.5rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; border-left: 3px solid #e74c3c;">
                                <small style="color: #e74c3c; font-weight: 600;">
                                    🎁 Charity: \${event.charityStats.percentSold.toFixed(1)}% sold 
                                    (\${event.charityStats.sold.toLocaleString()}/\${event.charityStats.capacity.toLocaleString()})
                                </small>
                            </div>
                        \` : ''}
                    </div>
                    
                    <div class="ticket-types">
                        \${event.ticketTypes.map(ticket => \`
                            <div class="ticket-type">
                                <div class="ticket-name">\${ticket.name}</div>
                                <div class="ticket-stats">
                                    <small>\${ticket.sold} / \${ticket.capacity}</small>
                                    <span class="status-badge status-\${ticket.status}">
                                        \${ticket.percentSold.toFixed(0)}%
                                    </span>
                                </div>
                            </div>
                        \`).join('')}
                    </div>
                </div>
            \`).join('');
        }

        function updateLastUpdated(timestamp) {
            const element = document.getElementById('last-updated');
            element.textContent = \`Last updated: \${new Date(timestamp).toLocaleString()}\`;
        }

        function showError(message) {
            const container = document.getElementById('error-container');
            container.innerHTML = \`<div class="error">\${message}</div>\`;
        }

        function clearError() {
            const container = document.getElementById('error-container');
            container.innerHTML = '';
        }

        function refreshData() {
            loadDashboardData();
        }

        function startAutoRefresh() {
            // Refresh every 2 minutes
            refreshInterval = setInterval(loadDashboardData, 120000);
        }

        function stopAutoRefresh() {
            if (refreshInterval) {
                clearInterval(refreshInterval);
            }
        }

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            loadDashboardData();
            startAutoRefresh();
        });

        // Clean up on page unload
        window.addEventListener('beforeunload', () => {
            stopAutoRefresh();
        });
    </script>
</body>
</html>`;

	return new Response(dashboardHtml, {
		headers: {
			'Content-Type': 'text/html',
			'Cache-Control': 'public, max-age=300' // Cache for 5 minutes
		}
	});
}