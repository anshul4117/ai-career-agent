import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";
import { TokenBucketRateLimiter } from "../../resilience/token-bucket-rate-limiter";
import { CircuitBreaker } from "../../resilience/circuit-breaker";
import { withRetry } from "../../resilience/with-retry";

interface JoobleJobItem {
  id: string;
  title: string;
  location: string;
  snippet?: string;
  salary?: string;
  source?: string;
  type?: string;
  link: string;
  company?: string;
  updated?: string;
}

interface JoobleApiResponse {
  totalCount: number;
  jobs: JoobleJobItem[];
}

@Injectable()
export class JoobleSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "JOOBLE";
  private readonly logger = new Logger(JoobleSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 5,
    refillTokens: 2,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "JoobleAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  get isEnabled(): boolean {
    return (
      Boolean(process.env.JOOBLE_API_KEY) &&
      process.env.ENABLE_SOURCE_JOOBLE !== "false"
    );
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug(
        "Jooble adapter is disabled or JOOBLE_API_KEY is not configured.",
      );
      return [];
    }

    const apiKey = process.env.JOOBLE_API_KEY!;
    const rawJobs: RawJob[] = [];
    const maxPages = params?.maxPages || 3;
    const query = params?.query || "fresher";
    const location = params?.location || "India";

    for (let page = 1; page <= maxPages; page++) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://jooble.org/api/${apiKey}`;
            const res = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
              body: JSON.stringify({
                keywords: query,
                location: location.toLowerCase().includes("india")
                  ? location
                  : `${location}, India`,
                page,
              }),
            });

            if (res.status === 404 || res.status === 400) {
              this.logger.debug(
                `Jooble query [${query} in ${location}] returned HTTP ${res.status}.`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Jooble API returned HTTP ${res.status}: ${res.statusText}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as JoobleApiResponse;
          });
        });

        if (!data || !Array.isArray(data.jobs) || data.jobs.length === 0) {
          break; // No more jobs
        }

        for (const item of data.jobs) {
          if (!item.title || !item.link) continue;

          const rawLoc = item.location?.trim() || "India";
          const queried =
            location && location.toLowerCase() !== "india"
              ? location
              : undefined;

          rawJobs.push({
            sourceJobId: `jooble-${item.id}`,
            source: this.sourceName,
            title: item.title,
            company: item.company?.trim() || "Local Employer",
            location: rawLoc,
            rawLocation: rawLoc,
            queriedCity: queried,
            isRemote: Boolean(item.location?.toLowerCase().includes("remote")),
            description: item.snippet || item.title,
            applyUrl: item.link,
            applyLinkStatus: "redirect_aggregator",
            postedAt: item.updated ? new Date(item.updated) : new Date(),
            skills: [],
            rawPayload: {
              ...item,
              aggregator: "jooble",
            },
          });
        }

        // If returned less than 20 jobs, no next page exists
        if (data.jobs.length < 20) {
          break;
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Jooble API fetch error on page ${page} for query "${query}" in "${location}": ${(err as Error).message}`,
        );
        break;
      }
    }

    this.logger.log(
      `Jooble fetched ${rawJobs.length} jobs for query "${query}" in "${location}".`,
    );
    return rawJobs;
  }
}
