import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";
import { TokenBucketRateLimiter } from "../../resilience/token-bucket-rate-limiter";
import { CircuitBreaker } from "../../resilience/circuit-breaker";
import { withRetry } from "../../resilience/with-retry";

interface RemoteOKJobItem {
  id: string | number;
  slug?: string;
  position: string;
  company: string;
  company_logo?: string;
  location?: string;
  tags?: string[];
  description?: string;
  date?: string;
  url: string;
  salary_min?: number;
  salary_max?: number;
}

@Injectable()
export class RemoteOKSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "REMOTEOK";
  private readonly logger = new Logger(RemoteOKSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 5,
    refillTokens: 1,
    refillIntervalMs: 2000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "RemoteOKAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_REMOTEOK !== "false";
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("RemoteOK adapter is disabled.");
      return [];
    }

    try {
      await this.rateLimiter.acquire();

      const items = await this.circuitBreaker.execute(async () => {
        return withRetry(async () => {
          const res = await fetch("https://remoteok.com/api", {
            headers: {
              Accept: "application/json",
              "User-Agent":
                "AICareerAgent-JobPipeline/1.0 (contact: support@aiagent.in)",
            },
          });

          if (!res.ok) {
            const err = new Error(`RemoteOK API returned HTTP ${res.status}`);
            (err as { status?: number }).status = res.status;
            throw err;
          }

          return (await res.json()) as unknown[];
        });
      });

      if (!Array.isArray(items) || items.length <= 1) return [];

      // The first element of RemoteOK array is legal/metadata object, subsequent items are jobs
      const jobs = items.slice(1) as RemoteOKJobItem[];

      const maxAgeDays = params?.maxAgeDays || 45;
      const oldestAllowedDate = new Date(
        Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
      );
      const rawJobs: RawJob[] = [];

      for (const j of jobs) {
        if (!j.position || !j.url) continue;

        const postedAt = j.date ? new Date(j.date) : new Date();
        if (postedAt < oldestAllowedDate) {
          continue;
        }

        const loc = (j.location || "").toLowerCase();

        // Reject explicit non-India countries
        const isForeign =
          /\b(usa?|united states|canada|uk|united kingdom|europe|germany|latin america|latam|emea|australia|berlin|london)\b/i.test(
            loc,
          );
        if (isForeign && !loc.includes("india")) {
          continue;
        }

        const isIndiaExplicit =
          loc.includes("india") ||
          /\b(bengaluru|bangalore|hyderabad|gurgaon|gurugram|noida|delhi|mumbai|pune|chennai|kolkata|ahmedabad|jaipur|chandigarh|indore|lucknow|kanpur)\b/i.test(
            loc,
          );

        const isWorldwide =
          loc === "worldwide" ||
          loc === "anywhere" ||
          loc.includes("anywhere") ||
          !loc;

        if (!isIndiaExplicit && !isWorldwide) {
          continue;
        }

        const isIntern =
          j.position.toLowerCase().includes("intern") ||
          (j.tags && j.tags.some((t) => t.toLowerCase().includes("intern")));

        rawJobs.push({
          title: j.position,
          company: j.company,
          location: j.location || "Worldwide Remote",
          isRemote: true,
          skills: j.tags || [],
          description: j.description || j.position,
          postedAt,
          applyUrl: j.url, // Human-facing RemoteOK apply URL
          source: "REMOTEOK",
          sourceJobId: `remoteok-${j.id}`,
          employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
          workMode: "REMOTE",
          salaryMin: j.salary_min,
          salaryMax: j.salary_max,
          currency: "USD",
          companyLogo: j.company_logo,
          rawPayload: { remoteOkId: j.id, slug: j.slug },
        });
      }

      this.logger.log(
        `RemoteOKSourceAdapter fetched ${rawJobs.length} eligible jobs`,
      );
      return rawJobs;
    } catch (err: unknown) {
      this.logger.warn(
        `Failed to fetch from RemoteOK API: ${(err as Error).message}`,
      );
      return [];
    }
  }
}
