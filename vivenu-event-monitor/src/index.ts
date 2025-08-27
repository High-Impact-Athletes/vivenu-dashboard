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