import { EventMetrics, TicketTypeMetrics } from '../types/vivenu';
import { SalesDateChange } from '../types/tracking';
import { Env } from '../types/env';
import { fetchWithRetry } from '../utils/retry';
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
  private kv: KVNamespace;

  constructor(env: Env) {
    this.serviceAccountEmail = env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    this.privateKey = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');
    this.sheetId = env.GOOGLE_SHEET_ID;
    this.kv = env.KV;
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a cached token
    const cachedAuth = await this.kv.get('google_sheets_auth');
    if (cachedAuth) {
      const auth: GoogleSheetsAuth = JSON.parse(cachedAuth);
      if (auth.expires_at > Date.now()) {
        return auth.access_token;
      }
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

    // Convert PEM format to proper format for Web Crypto API
    const pemHeader = '-----BEGIN PRIVATE KEY-----';
    const pemFooter = '-----END PRIVATE KEY-----';
    const pemContents = this.privateKey
      .replace(pemHeader, '')
      .replace(pemFooter, '')
      .replace(/\s/g, '');
    
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
    
    if (!tokenData.access_token) {
      throw new Error('Failed to get access token from Google');
    }

    // Cache the token
    const auth: GoogleSheetsAuth = {
      access_token: tokenData.access_token,
      expires_at: now + (tokenData.expires_in - 60) * 1000 // Subtract 60s for safety
    };

    await this.kv.put('google_sheets_auth', JSON.stringify(auth), {
      expirationTtl: tokenData.expires_in - 60
    });

    return tokenData.access_token;
  }

  async updateEventsSheet(events: EventMetrics[]): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      // Prepare data for batch update
      const headers = [
        'Event ID', 'Region', 'Event Name', 'Event Date', 'Sales Launch Date', 
        'Status', 'Total Capacity', 'Total Sold', 'Total Available', 
        'Percent Sold', 'Last Updated'
      ];

      const rows: SheetRow[] = events.map(event => ({
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
      }));

      await this.updateSheet('Events', headers, rows, accessToken);
      
      log('info', `Updated Events sheet with ${events.length} events`);
    } catch (error) {
      log('error', 'Failed to update Events sheet', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  async updateTicketTypesSheet(events: EventMetrics[]): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const headers = [
        'Event ID', 'Event Name', 'Region', 'Ticket Type ID', 'Ticket Name', 
        'Price', 'Currency', 'Capacity', 'Sold', 'Available', 'Last Updated'
      ];

      const rows: SheetRow[] = [];
      
      for (const event of events) {
        for (const ticketType of event.ticketTypes) {
          rows.push({
            'Event ID': event.eventId,
            'Event Name': event.eventName,
            'Region': event.region,
            'Ticket Type ID': ticketType.id,
            'Ticket Name': ticketType.name,
            'Price': ticketType.price,
            'Currency': 'EUR', // Default, could be enhanced to track actual currency
            'Capacity': ticketType.capacity,
            'Sold': ticketType.sold,
            'Available': ticketType.available,
            'Last Updated': new Date(event.lastUpdated).toLocaleString()
          });
        }
      }

      await this.updateSheet('Ticket Types', headers, rows, accessToken);
      
      log('info', `Updated Ticket Types sheet with ${rows.length} ticket types`);
    } catch (error) {
      log('error', 'Failed to update Ticket Types sheet', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  async updateSalesDateChangesSheet(changes: SalesDateChange[]): Promise<void> {
    try {
      const accessToken = await this.getAccessToken();
      
      const headers = [
        'Event ID', 'Event Name', 'Region', 'Change Type', 'Field',
        'Previous Value', 'New Value', 'Changed At', 'Source', 'Severity'
      ];

      const rows: SheetRow[] = changes.map(change => {
        const formatDate = (dateStr: string | null) => {
          return dateStr ? new Date(dateStr).toLocaleString() : 'Not set';
        };

        const getSeverity = (change: SalesDateChange) => {
          if (change.changeType === 'sellStart') {
            if (change.previousValue && change.newValue && 
                new Date(change.newValue) > new Date(change.previousValue)) {
              return 'CRITICAL - Sales Delayed';
            }
            if (change.previousValue && change.newValue && 
                new Date(change.newValue) < new Date(change.previousValue)) {
              return 'HIGH - Sales Moved Earlier';
            }
            return 'MEDIUM - Sales Date Changed';
          }
          return 'LOW - Other Change';
        };

        return {
          'Event ID': change.eventId,
          'Event Name': change.eventName,
          'Region': change.region,
          'Change Type': change.changeType,
          'Field': change.field,
          'Previous Value': formatDate(change.previousValue),
          'New Value': formatDate(change.newValue),
          'Changed At': new Date(change.changedAt).toLocaleString(),
          'Source': change.source.toUpperCase(),
          'Severity': getSeverity(change)
        };
      });

      // Use append mode for changes sheet to maintain history
      await this.appendToSheet('Sales Date Changes', headers, rows, accessToken);
      
      log('info', `Appended ${rows.length} sales date changes to sheet`);
    } catch (error) {
      log('error', 'Failed to update Sales Date Changes sheet', {
        error: (error as Error).message
      });
      throw error;
    }
  }

  private async updateSheet(
    sheetName: string, 
    headers: string[], 
    rows: SheetRow[], 
    accessToken: string
  ): Promise<void> {
    // Clear the sheet first
    await fetchWithRetry(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}:clear`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      }
    );

    // Prepare data for batch update
    const values = [
      headers,
      ...rows.map(row => headers.map(header => row[header] || ''))
    ];

    // Update with new data
    await fetchWithRetry(
      `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${sheetName}?valueInputOption=USER_ENTERED`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          values
        })
      }
    );
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

      const existingData = await existingDataResponse.json();
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