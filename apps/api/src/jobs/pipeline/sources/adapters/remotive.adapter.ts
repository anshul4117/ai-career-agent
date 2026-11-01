import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";
import { TokenBucketRateLimiter } from "../../resilience/token-bucket-rate-limiter";
import { CircuitBreaker } from "../../resilience/circuit-breaker";
import { withRetry } from "../../resilience/with-retry";

interface RemotiveJobItem {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category?: string;
  tags?: string[];
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

interface RemotiveApiResponse {
  "job-count": number;
  jobs: RemotiveJobItem[];
}

@Injectable()
export class RemotiveSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "REMOTIVE";
  private readonly logger = new Logger(RemotiveSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 5,
    refillTokens: 2,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "RemotiveAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_REMOTIVE !== "false";
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("Remotive adapter is disabled.");
      return [];
    }

    try {
      await this.rateLimiter.acquire();

      const data = await this.circuitBreaker.execute(async () => {
        return withRetry(async () => {
          const res = await fetch(
            "https://remotive.com/api/remote-jobs?limit=50",
            {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            },
          );

          if (!res.ok) {
            const err = new Error(`Remotive API returned HTTP ${res.status}`);
            (err as { status?: number }).status = res.status;
            throw err;
          }

          return (await res.json()) as RemotiveApiResponse;
        });
      });

      if (!data || !Array.isArray(data.jobs)) return [];

      const maxAgeDays = params?.maxAgeDays || 45;
      const oldestAllowedDate = new Date(
        Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
      );
      const rawJobs: RawJob[] = [];

      for (const j of data.jobs) {
        const postedAt = j.publication_date
          ? new Date(j.publication_date)
          : new Date();
        if (postedAt < oldestAllowedDate) {
          continue;
        }

        const reqLoc = (j.candidate_required_location || "").toLowerCase();

        // Reject explicit non-India countries/regions
        const isForeign =
          /\b(usa?|united states|canada|uk|united kingdom|europe|germany|latin america|latam|emea|australia)\b/i.test(
            reqLoc,
          );
        if (isForeign && !reqLoc.includes("india")) {
          continue;
        }

        const isIndiaExplicit = reqLoc.includes("india");
        const isWorldwide =
          reqLoc === "worldwide" ||
          reqLoc === "anywhere" ||
          reqLoc.includes("anywhere") ||
          !reqLoc;

        if (!isIndiaExplicit && !isWorldwide) {
          continue;
        }

        const isIntern =
          j.title.toLowerCase().includes("intern") ||
          (j.job_type || "").toLowerCase().includes("intern");

        rawJobs.push({
          title: j.title,
          company: j.company_name,
          location: j.candidate_required_location || "Worldwide Remote",
          isRemote: true,
          skills: j.tags || [],
          description: j.description || j.title,
          postedAt,
          applyUrl: j.url, // Canonical Remotive posting URL
          source: "REMOTIVE",
          sourceJobId: `remotive-${j.id}`,
          employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
          workMode: "REMOTE",
          companyLogo: j.company_logo,
          rawPayload: { remotiveId: j.id, tags: j.tags },
        });
      }

      this.logger.log(
        `RemotiveSourceAdapter fetched ${rawJobs.length} eligible jobs`,
      );
      return rawJobs;
    } catch (err: unknown) {
      this.logger.warn(
        `Failed to fetch from Remotive API: ${(err as Error).message}`,
      );
      return [];
    }
  }
}
