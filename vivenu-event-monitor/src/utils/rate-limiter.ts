import { Env } from '../types/env';

export class RateLimiter {
  private kv: KVNamespace | null;
  private limit: number;
  private windowSeconds: number;

  constructor(kv: KVNamespace | null, limit = 100, windowSeconds = 60) {
    this.kv = kv;
    this.limit = limit;
    this.windowSeconds = windowSeconds;
  }

  async checkLimit(key: string): Promise<boolean> {
    if (!this.kv) {
      // If KV is not available, allow all requests (no rate limiting)
      return true;
    }
    
    const rateLimitKey = `ratelimit:${key}`;
    const current = await this.kv.get(rateLimitKey);
    const count = current ? parseInt(current) : 0;

    if (count >= this.limit) {
      return false;
    }

    await this.kv.put(
      rateLimitKey,
      (count + 1).toString(),
      { expirationTtl: this.windowSeconds }
    );

    return true;
  }

  async getRemainingRequests(key: string): Promise<number> {
    if (!this.kv) {
      return this.limit;
    }
    
    const rateLimitKey = `ratelimit:${key}`;
    const current = await this.kv.get(rateLimitKey);
    const count = current ? parseInt(current) : 0;
    return Math.max(0, this.limit - count);
  }

  async waitIfNeeded(key: string): Promise<void> {
    const canProceed = await this.checkLimit(key);
    if (!canProceed) {
      const remaining = await this.getRemainingRequests(key);
      console.log(`Rate limit exceeded for ${key}. ${remaining} requests remaining in window.`);
      // Wait for a portion of the window before continuing
      await new Promise(resolve => setTimeout(resolve, (this.windowSeconds * 1000) / 4));
    }
  }
}