import { Logger } from "@nestjs/common";

export interface RetryOptions {
  maxRetries?: number; // default: 3
  baseDelayMs?: number; // default: 500ms
  maxDelayMs?: number; // default: 5000ms
  retryableStatuses?: number[]; // default: [408, 429, 500, 502, 503, 504]
}

const defaultRetryableStatuses = [408, 429, 500, 502, 503, 504];
const logger = new Logger("WithRetry");

export async function withRetry<T>(
  action: (attempt: number) => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const maxRetries = options.maxRetries ?? 3;
  const baseDelayMs = options.baseDelayMs ?? 500;
  const maxDelayMs = options.maxDelayMs ?? 5000;
  const retryableStatuses =
    options.retryableStatuses ?? defaultRetryableStatuses;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await action(attempt);
    } catch (err: unknown) {
      lastError = err;

      if (attempt > maxRetries) {
        break;
      }

      const status = (err as { status?: number })?.status;
      // Do not retry on client errors like 400, 401, 403, 404
      if (status && !retryableStatuses.includes(status)) {
        throw err;
      }

      // Calculate exponential backoff with full jitter
      const expDelay = Math.min(
        maxDelayMs,
        baseDelayMs * Math.pow(2, attempt - 1),
      );
      const jitter = Math.random() * 0.4 + 0.8; // 80% to 120% jitter
      const delay = Math.round(expDelay * jitter);

      logger.warn(
        `Attempt ${attempt}/${maxRetries} failed: ${(err as Error)?.message || String(err)}. Retrying in ${delay}ms...`,
      );

      await new Promise((res) => setTimeout(res, delay));
    }
  }

  throw lastError;
}
