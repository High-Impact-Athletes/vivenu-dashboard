export class DebugLogger {
  private kv: KVNamespace | null;

  constructor(kv: KVNamespace | null) {
    this.kv = kv;
  }

  private getDebugKey(suffix: string): string {
    return `debug:${suffix}:${Date.now()}`;
  }

  async logApiCall(
    endpoint: string,
    region: string,
    data: any,
    suffix: string
  ): Promise<void> {
    if (!this.kv) {
      console.log(`[DEBUG] ${region} ${endpoint} - ${suffix}`, data);
      return;
    }

    try {
      const debugData = {
        endpoint,
        region,
        data,
        timestamp: new Date().toISOString()
      };

      const key = this.getDebugKey(`${region}_${suffix}`);
      await this.kv.put(key, JSON.stringify(debugData), {
        expirationTtl: 3600 // 1 hour
      });

      console.log(`[DEBUG] Logged to KV: ${key}`);
    } catch (error) {
      console.warn('Debug logger KV error:', error);
    }
  }

  async logProcessedMetrics(region: string, metrics: any[]): Promise<void> {
    if (!this.kv) {
      console.log(`[DEBUG] ${region} processed metrics:`, metrics);
      return;
    }

    try {
      const debugData = {
        region,
        metrics,
        timestamp: new Date().toISOString()
      };

      const key = this.getDebugKey(`${region}_metrics`);
      await this.kv.put(key, JSON.stringify(debugData), {
        expirationTtl: 3600 // 1 hour
      });

      console.log(`[DEBUG] Logged metrics to KV: ${key}`);
    } catch (error) {
      console.warn('Debug logger KV error:', error);
    }
  }

  async getRecentLogs(region?: string, limit: number = 10): Promise<any[]> {
    if (!this.kv) {
      return [];
    }

    try {
      const prefix = region ? `debug:${region}_` : 'debug:';
      const list = await this.kv.list({ prefix, limit });

      const logs = await Promise.all(
        list.keys.map(async (key) => {
          const data = await this.kv!.get(key.name, 'json');
          return { key: key.name, ...data };
        })
      );

      return logs.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.warn('Failed to get debug logs:', error);
      return [];
    }
  }
}