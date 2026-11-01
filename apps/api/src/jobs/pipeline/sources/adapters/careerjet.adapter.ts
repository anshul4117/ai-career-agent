import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";
import { TokenBucketRateLimiter } from "../../resilience/token-bucket-rate-limiter";
import { CircuitBreaker } from "../../resilience/circuit-breaker";
import { withRetry } from "../../resilience/with-retry";
import * as crypto from "crypto";

interface CareerjetJobItem {
  url: string;
  title: string;
  date?: string;
  description?: string;
  company?: string;
  locations?: string;
  salary?: string;
  site?: string;
}

interface CareerjetApiResponse {
  type: string;
  hits?: number;
  pages?: number;
  jobs?: CareerjetJobItem[];
  error?: string;
}

@Injectable()
export class CareerjetSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "CAREERJET";
  private readonly logger = new Logger(CareerjetSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 5,
    refillTokens: 2,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "CareerjetAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  get isEnabled(): boolean {
    return (
      Boolean(process.env.CAREERJET_API_KEY) &&
      process.env.ENABLE_SOURCE_CAREERJET === "true"
    );
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug(
        "Careerjet adapter is disabled by configuration (Careerjet publisher terms prohibit offline bulk storage & requires IP whitelisting).",
      );
      return [];
    }

    const apiKey = process.env.CAREERJET_API_KEY!;
    const rawJobs: RawJob[] = [];
    const maxPages = params?.maxPages || 3;
    const query = params?.query || "fresher";
    const location = params?.location || "India";

    for (let page = 1; page <= maxPages; page++) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = new URL("https://search.api.careerjet.net/v4/query");
            url.searchParams.set("locale_code", "en_IN");
            url.searchParams.set("keywords", query);
            url.searchParams.set("location", location);
            url.searchParams.set("page", String(page));
            url.searchParams.set("page_size", "20");
            url.searchParams.set("user_ip", "103.21.124.1");
            url.searchParams.set("user_agent", "AICareerAgent-JobPipeline/1.0");

            const authHeader = `Basic ${Buffer.from(apiKey + ":").toString("base64")}`;

            const res = await fetch(url.toString(), {
              method: "GET",
              headers: {
                Authorization: authHeader,
                Accept: "application/json",
              },
            });

            if (res.status === 403 || res.status === 401) {
              const errBody = await res.text();
              const err = new Error(
                `Careerjet v4 returned HTTP ${res.status}: ${errBody}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            if (res.status === 404 || res.status === 400) {
              this.logger.debug(
                `Careerjet query [${query} in ${location}] returned HTTP ${res.status}.`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Careerjet API returned HTTP ${res.status}: ${res.statusText}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as CareerjetApiResponse;
          });
        });

        if (
          !data ||
          data.type === "ERROR" ||
          data.type === "LOCATIONS" ||
          !Array.isArray(data.jobs) ||
          data.jobs.length === 0
        ) {
          if (data?.type === "LOCATIONS") {
            this.logger.debug(
              `Careerjet returned ambiguous locations for query "${location}".`,
            );
          }
          if (data?.error) {
            this.logger.warn(`Careerjet error: ${data.error}`);
          }
          break; // No more jobs
        }

        for (const item of data.jobs) {
          if (!item.title || !item.url) continue;

          const externalHash = crypto
            .createHash("md5")
            .update(item.url)
            .digest("hex")
            .slice(0, 16);

          rawJobs.push({
            sourceJobId: `careerjet-${externalHash}`,
            source: this.sourceName,
            title: item.title,
            company: item.company?.trim() || "Local Employer",
            location: item.locations || location,
            rawLocation: item.locations || location,
            queriedCity: location.toLowerCase().includes("india")
              ? undefined
              : location,
            isRemote: Boolean(item.locations?.toLowerCase().includes("remote")),
            description: item.description || item.title,
            applyUrl: item.url,
            applyLinkStatus: "redirect_aggregator",
            postedAt: item.date ? new Date(item.date) : new Date(),
            skills: [],
            rawPayload: {
              ...item,
              aggregator: "careerjet",
            },
          });
        }

        if (data.jobs.length < 20 || (data.pages && page >= data.pages)) {
          break;
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Careerjet API fetch error on page ${page} for query "${query}" in "${location}": ${(err as Error).message}`,
        );
        break;
      }
    }

    this.logger.log(
      `Careerjet fetched ${rawJobs.length} jobs for query "${query}" in "${location}".`,
    );
    return rawJobs;
  }
}
