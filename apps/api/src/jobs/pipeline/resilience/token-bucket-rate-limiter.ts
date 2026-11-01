import { Logger } from "@nestjs/common";

export interface RateLimiterOptions {
  capacity: number;
  refillTokens: number;
  refillIntervalMs: number;
}

export class TokenBucketRateLimiter {
  private tokens: number;
  private lastRefillTimestamp: number;
  private readonly capacity: number;
  private readonly refillTokens: number;
  private readonly refillIntervalMs: number;
  private readonly logger = new Logger(TokenBucketRateLimiter.name);

  constructor(options: RateLimiterOptions) {
    this.capacity = options.capacity;
    this.tokens = options.capacity;
    this.refillTokens = options.refillTokens;
    this.refillIntervalMs = options.refillIntervalMs;
    this.lastRefillTimestamp = Date.now();
  }

  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefillTimestamp;
    if (elapsed > 0) {
      const tokensToAdd = (elapsed / this.refillIntervalMs) * this.refillTokens;
      this.tokens = Math.min(this.capacity, this.tokens + tokensToAdd);
      this.lastRefillTimestamp = now;
    }
  }

  async acquire(tokensRequired = 1): Promise<void> {
    while (true) {
      this.refill();

      if (this.tokens >= tokensRequired) {
        this.tokens -= tokensRequired;
        return;
      }

      const missingTokens = tokensRequired - this.tokens;
      const waitTimeMs = Math.ceil(
        (missingTokens / this.refillTokens) * this.refillIntervalMs,
      );

      this.logger.debug(
        `Rate limit reached. Waiting ${waitTimeMs}ms for refill...`,
      );
      await new Promise((resolve) =>
        setTimeout(resolve, Math.max(50, waitTimeMs)),
      );
    }
  }
}
