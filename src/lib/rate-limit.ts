interface RateLimitRecord {
  count: number;
  resetAt: number;
}

class MemoryRateLimiter {
  private store: Map<string, RateLimitRecord> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    // Periodically prune expired rate limit buckets
    if (typeof setInterval !== "undefined") {
      this.cleanupInterval = setInterval(() => {
        const now = Date.now();
        for (const [key, record] of this.store.entries()) {
          if (record.resetAt <= now) {
            this.store.delete(key);
          }
        }
      }, 60_000);
      if (this.cleanupInterval.unref) {
        this.cleanupInterval.unref();
      }
    }
  }

  /**
   * Check if a request identifier exceeds the rate limit.
   * @param key Unique key (e.g. `login:${ip}`)
   * @param maxRequests Maximum allowed requests in the time window
   * @param windowSeconds Duration of the rate limit window in seconds
   * @returns { success: boolean, remaining: number, resetInSeconds: number }
   */
  public check(
    key: string,
    maxRequests: number,
    windowSeconds: number
  ): { success: boolean; remaining: number; resetInSeconds: number } {
    const now = Date.now();
    const windowMs = windowSeconds * 1000;
    const existing = this.store.get(key);

    if (!existing || existing.resetAt <= now) {
      this.store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      });
      return {
        success: true,
        remaining: maxRequests - 1,
        resetInSeconds: windowSeconds,
      };
    }

    if (existing.count >= maxRequests) {
      const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
      return {
        success: false,
        remaining: 0,
        resetInSeconds,
      };
    }

    existing.count += 1;
    const resetInSeconds = Math.max(1, Math.ceil((existing.resetAt - now) / 1000));
    return {
      success: true,
      remaining: Math.max(0, maxRequests - existing.count),
      resetInSeconds,
    };
  }

  /**
   * Reset rate limit bucket manually (e.g., upon successful login)
   */
  public reset(key: string): void {
    this.store.delete(key);
  }
}

// Global singleton instance across Next.js invocations
const globalLimiter = new MemoryRateLimiter();

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const ip = forwardedFor.split(",")[0].trim();
    if (ip) return ip;
  }
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  const cfConnectingIp = headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();
  return "127.0.0.1";
}

export function rateLimit(
  key: string,
  maxRequests: number,
  windowSeconds: number
) {
  return globalLimiter.check(key, maxRequests, windowSeconds);
}

export function resetRateLimit(key: string): void {
  globalLimiter.reset(key);
}
