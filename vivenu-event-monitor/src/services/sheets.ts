import { EventMetrics, TicketTypeMetrics } from '../types/vivenu';
import { EventAvailability } from '../types/availability';
import { SalesDateChange } from '../types/tracking';
import { Env } from '../types/env';
import { fetchWithRetry } from '../utils/retry';
import { settings } from './settings';
import { log } from './validation';

interface GoogleSheetsAuth {
  access_token: string;
  expires_at: number;
}

interface SheetRow {
  [key: string]: string | number;
}

export class GoogleSheetsClient {
  private serviceAccountEmail: string;
  private privateKey: string;
  private sheetId: string;
  private kv: KVNamespace | null;

  constructor(env: Env) {
    this.serviceAccountEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL || '';
    this.privateKey = env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '';
    this.sheetId = env.GOOGLE_SHEET_ID || '';
    this.kv = env.KV || null;
  }

  async getAccessToken(): Promise<string> {
    // Check if we have a cached token
    let cachedAuth = null;
    if (this.kv) {
      cachedAuth = await this.kv.get('google_sheets_auth');
    }
    
    if (cachedAuth) {
      const auth: GoogleSheetsAuth = JSON.parse(cachedAuth);
      if (auth.expires_at > Date.now()) {
        log('info', 'Using cached Google Sheets access token');
        return auth.access_token;
      }
      log('info', 'Cached token expired, generating new one');
    }

    log('info', 'Starting Google Sheets authentication', {
      serviceAccountEmail: this.serviceAccountEmail ? 'configured' : 'missing',
      privateKeyLength: this.privateKey ? this.privateKey.length : 0,
      sheetId: this.sheetId ? 'configured' : 'missing'
    });

    // Validate required fields
    if (!this.serviceAccountEmail) {
      throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not configured');
    }
    if (!this.privateKey) {
      throw new Error('GOOGLE_PRIVATE_KEY is not configured');
    }
    if (!this.sheetId) {
      throw new Error('GOOGLE_SHEET_ID is not configured');
    }

    // Generate new JWT token
    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const payload = {
      iss: this.serviceAccountEmail,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    log('info', 'JWT payload created', {
      issuer: payload.iss,
      scope: payload.scope,
      audience: payload.aud,
      issuedAt: new Date(payload.iat * 1000).toISOString(),
      expiresAt: new Date(payload.exp * 1000).toISOString()
    });

    // Convert PEM format to proper format for Web Crypto API
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = this.privateKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');
    
    log('info', 'Processing private key', {
      originalLength: this.privateKey.length,
      hasHeader: this.privateKey.includes(pemHeader),
      hasFooter: this.privateKey.includes(pemFooter),
      contentsLength: pemContents.length
    });
    
    const binaryDer = atob(pemContents);
    const privateKeyBuffer = new Uint8Array(binaryDer.length);
    for (let i = 0; i < binaryDer.length; i++) {
      privateKeyBuffer[i] = binaryDer.charCodeAt(i);
    }

    const key = await crypto.subtle.importKey(
      'pkcs8',
      privateKeyBuffer,
      {
        name: 'RSASSA-PKCS1-v1_5',
        hash: 'SHA-256'
      },
      false,
      ['sign']
    );

    // Create JWT
    const headerB64 = btoa(JSON.stringify(header)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const payloadB64 = btoa(JSON.stringify(payload)).replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
    const dataToSign = `${headerB64}.${payloadB64}`;

    const signature = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5',
      key,
      new TextEncoder().encode(dataToSign)
    );

    const signatureB64 = btoa(String.fromCharCode(...new Uint8Array(signature)))
      .replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');

    const jwt = `${dataToSign}.${signatureB64}`;

    // Exchange JWT for access token
    log('info', 'Exchanging JWT for access token', {
      jwtLength: jwt.length,
      grantType: 'urn:ietf:params:oauth:grant-type:jwt-bearer'
    });

    const tokenResponse = await fetchWithRetry('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      }).toString()
    });

    const tokenData: any = await tokenResponse.json();
    
    log('info', 'Token exchange response', {
      status: tokenResponse.status,
      hasAccessToken: !!tokenData.access_token,
      tokenType: tokenData.token_type,
      expiresIn: tokenData.expires_in,
      error: tokenData.error,
      errorDescription: tokenData.error_description
    });
    
    if (!tokenResponse.ok) {
      throw new Error(`HTTP ${tokenResponse.status}: ${tokenResponse.statusText}. Error: ${tokenData.error || 'Unknown'}, Description: ${tokenData.error_description || 'No details'}`);
    }
    
    if (!tokenData.access_token) {
      throw new Error(`Failed to get access token from Google. Error: ${tokenData.error || 'Unknown'}, Description: ${tokenData.error_description || 'No access_token in response'}`);
    }

    // Cache the token if KV is available
    const auth: GoogleSheetsAuth = {
      access_token: tokenData.access_token,
      expires_at: now + (tokenData.expires_in - 60) * 1000 // Subtract 60s for safety
    };

    if (this.kv) {
      await this.kv.put('google_sheets_auth', JSON.stringify(auth), {
        expirationTtl: tokenData.expires_in - 60
      });
    }

    return tokenData.access_token;
  }

  async updateMasterSheet(events: EventMetrics[]): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      log('info', 'Creating consolidated master sheet', {
        eventsCount: events.length
      });

      // Step 1: Collect all unique ticket type names across all events
      const allTicketNames = new Set<string>();
      for (const event of events) {
        for (const ticketType of event.ticketTypes) {
          // Clean ticket name: remove special chars and normalize
          const cleanName = ticketType.name
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/\//g, '-') // Replace slashes with dashes
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
          allTicketNames.add(cleanName);
        }
      }

      // Sort ticket names alphabetically for consistent column ordering
      // Limit ticket types based on settings
      const maxTicketTypes = settings.getMaxTicketTypes();
      const sortedTicketNames = Array.from(allTicketNames).sort().slice(0, maxTicketTypes);
      
      log('info', 'Found unique ticket types', {
        ticketTypes: sortedTicketNames,
        count: sortedTicketNames.length
      });

      // Step 2: Create consolidated headers: Event metadata + ticket type columns
      const soldSuffix = settings.getSoldSuffix();
      const availableSuffix = settings.getAvailableSuffix();
      
      const headers = [
        'Event ID', 'Region', 'Event Name', 'Event Date', 'Sales Launch Date', 
        'Status', 'Total Capacity', 'Total Sold', 'Total Available', 
        'Percent Sold', 'Last Updated'
      ];
      
      for (const ticketName of sortedTicketNames) {
        headers.push(`${ticketName}${soldSuffix}`);
        headers.push(`${ticketName}${availableSuffix}`);
      }

      log('info', 'Generated consolidated headers', {
        totalHeaders: headers.length,
        metadataColumns: 11,
        ticketColumns: sortedTicketNames.length * 2
      });

      // Step 3: Build consolidated data rows - one row per event with all data
      const rows: SheetRow[] = [];
      
      for (const event of events) {
        // Start with event metadata
        const row: SheetRow = {
          'Event ID': event.eventId,
          'Region': event.region,
          'Event Name': event.eventName,
          'Event Date': new Date(event.eventDate).toLocaleDateString(),
          'Sales Launch Date': event.salesStartDate ? new Date(event.salesStartDate).toLocaleDateString() : '',
          'Status': event.status || '',
          'Total Capacity': event.totalCapacity,
          'Total Sold': event.totalSold,
          'Total Available': event.totalAvailable,
          'Percent Sold': `${event.percentSold}%`,
          'Last Updated': new Date(event.lastUpdated).toLocaleString()
        };

        // Initialize all ticket type columns to empty
        for (const ticketName of sortedTicketNames) {
          row[`${ticketName}${soldSuffix}`] = '';
          row[`${ticketName}${availableSuffix}`] = '';
        }

        // Populate columns for ticket types that exist in this event
        for (const ticketType of event.ticketTypes) {
          // Clean ticket name to match the header
          const cleanName = ticketType.name
            .replace(/[()]/g, '') // Remove parentheses
            .replace(/\//g, '-') // Replace slashes with dashes
            .replace(/\s+/g, ' ') // Normalize spaces
            .trim();
          
          // Only populate if this ticket type is in our limited set
          if (sortedTicketNames.includes(cleanName)) {
            row[`${cleanName}${soldSuffix}`] = ticketType.sold;
            row[`${cleanName}${availableSuffix}`] = ticketType.available;
          }
        }

        rows.push(row);
        
        log('info', `Created consolidated row for event ${event.eventId}`, {
          eventId: event.eventId,
          ticketTypesInEvent: event.ticketTypes.length,
          totalColumns: Object.keys(row).length
        });
      }

      // Write to Master sheet starting at A1
      await this.updateSheetRange(settings.getMasterFullRange(), headers, rows, accessToken);
      
      log('info', `Updated consolidated Master sheet`, {
        eventsCount: events.length,
        uniqueTicketTypes: sortedTicketNames.length,
        totalColumns: headers.length
      });
    } catch (error) {
      log('error', 'Failed to update Master sheet', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  async updateDashboardSheet(events: EventAvailability[]): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      log('info', 'Creating analytics-friendly dashboard sheet', {
        eventsCount: events.length
      });

      // Analytics-friendly headers (long format)
      const headers = [
        'Timestamp',
        'Event ID',
        'Event Name', 
        'Event Date',
        'Region',
        'Ticket Type Name',
        'Ticket Type ID',
        'Price',
        'Capacity',
        'Sold',
        'Available',
        'Percent Sold',
        'Status',
        'Is Charity',
        'Last Updated'
      ];

      const rows: SheetRow[] = [];
      const timestamp = new Date().toISOString();
      
      for (const event of events) {
        // Add event total row
        rows.push({
          'Timestamp': timestamp,
          'Event ID': event.eventId,
          'Event Name': event.eventName,
          'Event Date': new Date(event.eventDate).toLocaleDateString(),
          'Region': event.region,
          'Ticket Type Name': 'TOTAL',
          'Ticket Type ID': 'TOTAL',
          'Price': 0,
          'Capacity': event.totals.capacity,
          'Sold': event.totals.sold,
          'Available': event.totals.available,
          'Percent Sold': event.totals.percentSold,
          'Status': event.totals.status,
          'Is Charity': false,
          'Last Updated': new Date(event.lastUpdated).toLocaleString()
        });

        // Add each ticket type as a separate row
        for (const ticketType of event.ticketTypes) {
          const isCharity = ticketType.name.toLowerCase().includes('charity') || 
                           ticketType.name.toLowerCase().includes('donation');
          
          rows.push({
            'Timestamp': timestamp,
            'Event ID': event.eventId,
            'Event Name': event.eventName,
            'Event Date': new Date(event.eventDate).toLocaleDateString(),
            'Region': event.region,
            'Ticket Type Name': ticketType.name,
            'Ticket Type ID': ticketType.id,
            'Price': ticketType.price || 0,
            'Capacity': ticketType.capacity,
            'Sold': ticketType.sold,
            'Available': ticketType.available,
            'Percent Sold': ticketType.percentSold,
            'Status': ticketType.status,
            'Is Charity': isCharity,
            'Last Updated': new Date(event.lastUpdated).toLocaleString()
          });
        }

        // Add charity stats if available
        if (event.charityStats) {
          rows.push({
            'Timestamp': timestamp,
            'Event ID': event.eventId,
            'Event Name': event.eventName,
            'Event Date': new Date(event.eventDate).toLocaleDateString(),
            'Region': event.region,
            'Ticket Type Name': 'CHARITY_TOTAL',
            'Ticket Type ID': 'CHARITY_TOTAL',
            'Price': 0,
            'Capacity': event.charityStats.capacity,
            'Sold': event.charityStats.sold,
            'Available': event.charityStats.available,
            'Percent Sold': event.charityStats.percentSold,
            'Status': event.charityStats.percentSold >= 95 ? 'soldout' : event.charityStats.percentSold >= 80 ? 'limited' : 'available',
            'Is Charity': true,
            'Last Updated': new Date(event.lastUpdated).toLocaleString()
          });
        }
        
        log('info', `Created dashboard rows for event ${event.eventId}`, {
          eventId: event.eventId,
          ticketTypesCount: event.ticketTypes.length,
          totalRows: event.ticketTypes.length + (event.charityStats ? 2 : 1)
        });
      }

      // Choose append or replace based on settings
      if (settings.isDashboardAppendMode()) {
        await this.appendToDashboardSheet(settings.getDashboardSheetName(), headers, rows, accessToken);
      } else {
        await this.updateSheetRange(settings.getDashboardFullRange(), headers, rows, accessToken);
      }
      
      log('info', `Updated analytics dashboard sheet`, {
        eventsCount: events.length,
        totalRows: rows.length,
        appendMode: settings.isDashboardAppendMode()
      });
    } catch (error) {
      log('error', 'Failed to update Dashboard sheet', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  private async appendToDashboardSheet(
    sheetName: string,
    headers: string[],
    rows: SheetRow[],
    accessToken: string
  ): Promise<void> {
    if (rows.length === 0) return;

    try {
      // Check if sheet exists and has headers
      const existingDataResponse = await fetchWithRetry(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:Z1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const existingData: any = await existingDataResponse.json();
      const hasHeaders = existingData.values && existingData.values.length > 0;

      // Prepare data to append
      const values = hasHeaders 
        ? rows.map(row => headers.map(header => row[header] || ''))
        : [headers, ...rows.map(row => headers.map(header => row[header] || ''))];

      // Append new data
      const appendResponse = await fetchWithRetry(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values
          })
        }
      );

      if (!appendResponse.ok) {
        const errorText = await appendResponse.text();
        throw new Error(`Failed to append to dashboard sheet: ${errorText}`);
      }

      log('info', `Successfully appended ${values.length} rows to dashboard sheet`);
    } catch (error) {
      log('warn', `Failed to append to dashboard sheet ${sheetName}, trying full update instead`, {
        error: (error as Error).message
      });
      // Fallback to full update if append fails
      await this.updateSheetRange(settings.getDashboardFullRange(), headers, rows, accessToken);
    }
  }

  // Obsolete functions removed:
  // - updateTicketTypesSheet() -> replaced by updateMasterSheet()
  // - updateSalesDateChangesSheet() -> sales date tracking moved outside Google Sheets

  private async updateSheet(
    sheetName: string, 
    headers: string[], 
    rows: SheetRow[], 
    accessToken: string
  ): Promise<void> {
    log('info', `Updating sheet ${sheetName}`, {
      sheetName,
      headersCount: headers.length,
      rowsCount: rows.length,
      sheetId: this.sheetId
    });

    // Clear the sheet first
    const clearUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}:clear`;
    log('info', `Clearing sheet: ${clearUrl}`);
    
    const clearResponse = await fetchWithRetry(clearUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    });

    if (!clearResponse.ok) {
      const clearError = await clearResponse.text();
      log('error', `Failed to clear sheet ${sheetName}`, {
        status: clearResponse.status,
        statusText: clearResponse.statusText,
        error: clearError,
        url: clearUrl
      });
      throw new Error(`Failed to clear sheet ${sheetName}: HTTP ${clearResponse.status} ${clearResponse.statusText}. ${clearError}`);
    }

    log('info', `Successfully cleared sheet ${sheetName}`);

    // Prepare data for batch update
    const values = [
      headers,
      ...rows.map(row => headers.map(header => row[header] || ''))
    ];

    // Update with new data
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}?valueInputOption=USER_ENTERED`;
    log('info', `Updating sheet with data: ${updateUrl}`, {
      valuesCount: values.length,
      firstRowSample: values[0]?.slice(0, 3) // Show first 3 columns of header
    });

    const updateResponse = await fetchWithRetry(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values
      })
    });

    if (!updateResponse.ok) {
      const updateError = await updateResponse.text();
      log('error', `Failed to update sheet ${sheetName}`, {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error: updateError,
        url: updateUrl
      });
      throw new Error(`Failed to update sheet ${sheetName}: HTTP ${updateResponse.status} ${updateResponse.statusText}. ${updateError}`);
    }

    log('info', `Successfully updated sheet ${sheetName}`);
  }

  private async updateSheetRange(
    range: string, 
    headers: string[], 
    rows: SheetRow[], 
    accessToken: string
  ): Promise<void> {
    log('info', `Updating sheet range ${range}`, {
      range,
      headersCount: headers.length,
      rowsCount: rows.length
    });

    // Prepare data for batch update (headers + rows)
    const values = [
      headers,
      ...rows.map(row => headers.map(header => row[header] || ''))
    ];

    // Update with new data at specific range
    const updateUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?valueInputOption=USER_ENTERED`;
    log('info', `Updating sheet range with data: ${updateUrl}`, {
      valuesCount: values.length,
      firstRowSample: values[0]?.slice(0, 3) // Show first 3 columns of header
    });

    const updateResponse = await fetchWithRetry(updateUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values
      })
    });

    if (!updateResponse.ok) {
      const updateError = await updateResponse.text();
      log('error', `Failed to update sheet range ${range}`, {
        status: updateResponse.status,
        statusText: updateResponse.statusText,
        error: updateError,
        url: updateUrl
      });
      throw new Error(`Failed to update sheet range ${range}: HTTP ${updateResponse.status} ${updateResponse.statusText}. ${updateError}`);
    }

    log('info', `Successfully updated sheet range ${range}`);
  }

  // Removed appendToSheetRange - no longer needed with consolidated approach

  async testCrossTabWrite(): Promise<void> {
    try {
      log('info', 'Testing simple cross-tabulated write');
      
      const accessToken = await this.getAccessToken();
      log('info', 'Got access token for cross-tab test');
      
      // Simple static test data
      const headers = ['Event ID', 'Ticket A Sold', 'Ticket A Available', 'Ticket B Sold', 'Ticket B Available'];
      const rows = [{
        'Event ID': 'test123',
        'Ticket A Sold': 10,
        'Ticket A Available': 90,
        'Ticket B Sold': 5,
        'Ticket B Available': 95
      }];

      log('info', 'Test headers and rows created', {
        headers,
        rows
      });

      // Write to a safe range using settings
      const testRange = settings.getFullSheetRange(settings.getMasterSheetName(), 'A20');
      await this.updateSheetRange(testRange, headers, rows, accessToken);
      
      log('info', 'Cross-tab test write successful!');

    } catch (error) {
      log('error', 'Cross-tab test write failed', {
        error: (error as Error).message,
        stack: (error as Error).stack
      });
      throw error;
    }
  }

  async testBasicWrite(): Promise<void> {
    try {
      log('info', 'Starting basic write test to Sheet1 A1');
      
      const accessToken = await this.getAccessToken();
      log('info', 'Got access token for basic write test');
      
      // Simple write to Master sheet A1  
      const testRange = settings.getFullSheetRange(settings.getEventsSheetName(), 'A1');
      const testUrl = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${testRange}?valueInputOption=USER_ENTERED`;
      log('info', `Testing basic write to: ${testUrl}`);
      
      const response = await fetchWithRetry(testUrl, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values: [["Hello World"]]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        log('error', 'Basic write test failed', {
          status: response.status,
          statusText: response.statusText,
          error: errorText,
          url: testUrl
        });
        throw new Error(`Basic write failed: HTTP ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result: any = await response.json();
      log('info', 'Basic write test successful', {
        result: result,
        updatedCells: result.updatedCells,
        updatedRows: result.updatedRows
      });

    } catch (error) {
      log('error', 'Basic write test failed', {
        error: (error as Error).message,
        stack: (error as Error).stack
      });
      throw error;
    }
  }

  private async appendToSheet(
    sheetName: string, 
    headers: string[], 
    rows: SheetRow[], 
    accessToken: string
  ): Promise<void> {
    if (rows.length === 0) return;

    // Check if sheet exists and has headers
    try {
      const existingDataResponse = await fetchWithRetry(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}!A1:Z1`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const existingData: any = await existingDataResponse.json();
      const hasHeaders = existingData.values && existingData.values.length > 0;

      // Prepare data to append
      const values = hasHeaders 
        ? rows.map(row => headers.map(header => row[header] || ''))
        : [headers, ...rows.map(row => headers.map(header => row[header] || ''))];

      // Append new data
      await fetchWithRetry(
        `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}:append?valueInputOption=USER_ENTERED`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            values
          })
        }
      );
    } catch (error) {
      log('warn', `Failed to append to sheet ${sheetName}, trying full update instead`, {
        error: (error as Error).message
      });
      // Fallback to full update if append fails
      await this.updateSheet(sheetName, headers, rows, accessToken);
    }
  }
}