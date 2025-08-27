export class RateLimiter {
  private kv: KVNamespace | null;
  private limit: number;
  private windowSizeMs: number;

  constructor(kv: KVNamespace | null, limit: number = 100, windowSizeSeconds: number = 60) {
    this.kv = kv;
    this.limit = limit;
    this.windowSizeMs = windowSizeSeconds * 1000;
  }

  private getRateLimitKey(identifier: string): string {
    return `rate_limit:${identifier}`;
  }

  async waitIfNeeded(identifier: string): Promise<void> {
    if (!this.kv) {
      // No rate limiting without KV
      return;
    }

    const key = this.getRateLimitKey(identifier);
    const now = Date.now();
    const windowStart = now - this.windowSizeMs;

    try {
      // Get current request count for this window
      const currentCountStr = await this.kv.get(key);
      const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;

      if (currentCount >= this.limit) {
        // Rate limit exceeded, wait until window resets
        const waitTime = this.windowSizeMs - (now % this.windowSizeMs);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }

      // Increment counter
      await this.kv.put(key, (currentCount + 1).toString(), {
        expirationTtl: Math.ceil(this.windowSizeMs / 1000)
      });

    } catch (error) {
      // If KV fails, don't block the request
      console.warn('Rate limiter KV error:', error);
    }
  }

  async getRemainingRequests(identifier: string): Promise<number> {
    if (!this.kv) {
      return this.limit;
    }

    try {
      const key = this.getRateLimitKey(identifier);
      const currentCountStr = await this.kv.get(key);
      const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
      return Math.max(0, this.limit - currentCount);
    } catch (error) {
      return this.limit;
    }
  }
}