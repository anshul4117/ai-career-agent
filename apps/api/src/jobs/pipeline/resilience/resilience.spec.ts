import { TokenBucketRateLimiter } from "./token-bucket-rate-limiter";
import {
  CircuitBreaker,
  CircuitBreakerOpenException,
  CircuitState,
} from "./circuit-breaker";
import { withRetry } from "./with-retry";

describe("Resilience Layer", () => {
  describe("TokenBucketRateLimiter", () => {
    it("should acquire tokens immediately when available", async () => {
      const limiter = new TokenBucketRateLimiter({
        capacity: 5,
        refillTokens: 1,
        refillIntervalMs: 100,
      });

      const start = Date.now();
      await limiter.acquire(2);
      const elapsed = Date.now() - start;
      expect(elapsed).toBeLessThan(50);
    });
  });

  describe("CircuitBreaker", () => {
    it("should trip to OPEN after failure threshold is reached", async () => {
      const cb = new CircuitBreaker({
        name: "TestCircuit",
        failureThreshold: 2,
        recoveryTimeoutMs: 1000,
      });

      // 1st failure
      await expect(
        cb.execute(async () => {
          throw new Error("HTTP 500");
        }),
      ).rejects.toThrow("HTTP 500");
      expect(cb.getState()).toBe(CircuitState.CLOSED);

      // 2nd failure -> trips circuit
      await expect(
        cb.execute(async () => {
          throw new Error("HTTP 500");
        }),
      ).rejects.toThrow("HTTP 500");
      expect(cb.getState()).toBe(CircuitState.OPEN);

      // Fast-fail while OPEN without calling action
      let actionCalled = false;
      await expect(
        cb.execute(async () => {
          actionCalled = true;
        }),
      ).rejects.toBeInstanceOf(CircuitBreakerOpenException);
      expect(actionCalled).toBe(false);
    });
  });

  describe("withRetry", () => {
    it("should succeed without retry if initial call succeeds", async () => {
      let attempts = 0;
      const res = await withRetry(async (attempt) => {
        attempts = attempt;
        return "success";
      });
      expect(res).toBe("success");
      expect(attempts).toBe(1);
    });

    it("should retry on retryable failure and return success on eventual resolution", async () => {
      let attempts = 0;
      const res = await withRetry(
        async (attempt) => {
          attempts = attempt;
          if (attempt === 1) {
            const err = new Error("Network timeout");
            (err as { status?: number }).status = 504;
            throw err;
          }
          return "recovered";
        },
        { baseDelayMs: 20, maxRetries: 2 },
      );
      expect(res).toBe("recovered");
      expect(attempts).toBe(2);
    });
  });
});
