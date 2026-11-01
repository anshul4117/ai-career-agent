import { Logger } from "@nestjs/common";

export enum CircuitState {
  CLOSED = "CLOSED",
  OPEN = "OPEN",
  HALF_OPEN = "HALF_OPEN",
}

export interface CircuitBreakerOptions {
  failureThreshold?: number; // default: 3
  recoveryTimeoutMs?: number; // default: 60000 (1 min)
  name?: string;
}

export class CircuitBreakerOpenException extends Error {
  constructor(name: string, remainingTimeMs: number) {
    super(
      `Circuit breaker [${name}] is OPEN. Fast-failing request. Retry after ${Math.ceil(remainingTimeMs / 1000)}s.`,
    );
    this.name = "CircuitBreakerOpenException";
  }
}

export class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private consecutiveFailures = 0;
  private lastFailureTime = 0;
  private readonly failureThreshold: number;
  private readonly recoveryTimeoutMs: number;
  private readonly name: string;
  private readonly logger = new Logger(CircuitBreaker.name);

  constructor(options: CircuitBreakerOptions = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.recoveryTimeoutMs = options.recoveryTimeoutMs || 60000;
    this.name = options.name || "DefaultCircuit";
  }

  getState(): CircuitState {
    if (this.state === CircuitState.OPEN) {
      const elapsed = Date.now() - this.lastFailureTime;
      if (elapsed >= this.recoveryTimeoutMs) {
        this.state = CircuitState.HALF_OPEN;
        this.logger.log(
          `Circuit [${this.name}] shifted from OPEN to HALF_OPEN.`,
        );
      }
    }
    return this.state;
  }

  async execute<T>(action: () => Promise<T>): Promise<T> {
    const currentState = this.getState();

    if (currentState === CircuitState.OPEN) {
      const remaining =
        this.recoveryTimeoutMs - (Date.now() - this.lastFailureTime);
      throw new CircuitBreakerOpenException(this.name, Math.max(0, remaining));
    }

    try {
      const result = await action();
      this.recordSuccess();
      return result;
    } catch (err) {
      this.recordFailure(err);
      throw err;
    }
  }

  private recordSuccess(): void {
    if (this.state === CircuitState.HALF_OPEN) {
      this.logger.log(
        `Circuit [${this.name}] trial call succeeded. Resetting to CLOSED.`,
      );
    }
    this.consecutiveFailures = 0;
    this.state = CircuitState.CLOSED;
  }

  private recordFailure(err: unknown): void {
    this.consecutiveFailures++;
    this.lastFailureTime = Date.now();
    const errMsg = (err as Error)?.message || String(err);

    if (this.state === CircuitState.HALF_OPEN) {
      this.state = CircuitState.OPEN;
      this.logger.warn(
        `Circuit [${this.name}] trial call failed (${errMsg}). Re-opening circuit.`,
      );
    } else if (this.consecutiveFailures >= this.failureThreshold) {
      this.state = CircuitState.OPEN;
      this.logger.warn(
        `Circuit [${this.name}] tripped to OPEN after ${this.consecutiveFailures} consecutive failures. (${errMsg})`,
      );
    }
  }
}
