import { log } from '../services/validation';

export class DebugLogger {
  private kv: KVNamespace | null;
  private sessionId: string;

  constructor(kv: KVNamespace | null) {
    this.kv = kv;
    this.sessionId = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async logApiCall(endpoint: string, region: string, data: any, filename?: string): Promise<void> {
    if (!this.kv) {
      log('warn', 'Debug logging skipped - no KV available');
      return;
    }

    const timestamp = new Date().toISOString();
    const logKey = `debug:${this.sessionId}:${filename || endpoint.replace(/[/\?&=]/g, '_')}:${region}`;
    
    const logData = {
      timestamp,
      sessionId: this.sessionId,
      endpoint,
      region,
      dataType: Array.isArray(data) ? 'array' : typeof data,
      dataLength: Array.isArray(data) ? data.length : 1,
      data
    };

    try {
      await this.kv.put(logKey, JSON.stringify(logData, null, 2), {
        expirationTtl: 24 * 60 * 60 // Keep debug logs for 24 hours
      });

      log('info', `Debug logged API call: ${endpoint}`, {
        region,
        logKey,
        dataLength: logData.dataLength
      });
    } catch (error) {
      log('error', 'Failed to save debug log', {
        endpoint,
        region,
        error: (error as Error).message
      });
    }
  }

  async logProcessedMetrics(region: string, metrics: any[]): Promise<void> {
    await this.logApiCall('processed-metrics', region, metrics, 'final_metrics');
  }

  getSessionId(): string {
    return this.sessionId;
  }
}