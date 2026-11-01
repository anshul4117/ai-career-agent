import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";
import { TokenBucketRateLimiter } from "../../resilience/token-bucket-rate-limiter";
import { CircuitBreaker } from "../../resilience/circuit-breaker";
import { withRetry } from "../../resilience/with-retry";
import { PrismaService } from "../../../../prisma/prisma.service";
import { AtsType } from "@prisma/client";

interface WorkableJobItem {
  id?: string;
  shortcode: string;
  title: string;
  url: string;
  department?: string;
  description?: string;
  employment_type?: string;
  experience?: string;
  telecommuting?: boolean;
  published_on?: string;
  city?: string;
  country?: string;
  country_code?: string;
  state?: string;
  location?: {
    city?: string;
    region?: string;
    country?: string;
    countryCode?: string;
    telecommuting?: boolean;
  };
}

interface WorkableResponse {
  name: string;
  description?: string;
  jobs: WorkableJobItem[];
}

@Injectable()
export class WorkableSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "WORKABLE";
  private readonly logger = new Logger(WorkableSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 10,
    refillTokens: 5,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "WorkableAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  constructor(private readonly prisma?: PrismaService) {}

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_WORKABLE !== "false";
  }

  // Workable accounts with tech hiring
  async getAccounts(): Promise<string[]> {
    const set = new Set<string>();
    const custom = process.env.WORKABLE_ACCOUNTS;
    if (custom) {
      custom
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => set.add(s));
    } else {
      ["invideo", "haptik"].forEach((s) => set.add(s));
    }

    if (this.prisma) {
      try {
        const dbComps = await this.prisma.company.findMany({
          where: {
            atsType: AtsType.WORKABLE,
            verified: true,
            atsSlug: { not: null },
          },
          select: { atsSlug: true },
        });
        dbComps.forEach((c) => {
          if (c.atsSlug) set.add(c.atsSlug.toLowerCase());
        });
      } catch (err: unknown) {
        this.logger.debug(
          `Could not query database companies for Workable: ${(err as Error).message}`,
        );
      }
    }
    return Array.from(set);
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("Workable adapter is disabled.");
      return [];
    }

    const rawJobs: RawJob[] = [];
    const maxAgeDays = params?.maxAgeDays || 45;
    const oldestAllowedDate = new Date(
      Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
    );
    const accounts = await this.getAccounts();

    for (const account of accounts) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://apply.workable.com/api/v1/widget/accounts/${account}?details=true`;
            const res = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            });

            if (res.status === 404) {
              this.logger.debug(
                `Workable account [${account}] not found (HTTP 404).`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Workable [${account}] returned HTTP ${res.status}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as WorkableResponse;
          });
        });

        if (!data || !Array.isArray(data.jobs)) continue;

        for (const j of data.jobs) {
          const postedAt = j.published_on
            ? new Date(j.published_on)
            : new Date();
          if (postedAt < oldestAllowedDate) {
            continue;
          }

          const city = j.city || j.location?.city || "";
          const country = (
            j.country ||
            j.location?.country ||
            ""
          ).toLowerCase();
          const countryCode = (
            j.country_code ||
            j.location?.countryCode ||
            ""
          ).toLowerCase();
          const locStr = [
            city,
            j.state || j.location?.region,
            j.country || j.location?.country,
          ]
            .filter(Boolean)
            .join(", ");
          const locLower = locStr.toLowerCase();

          // Reject foreign non-India locations
          const isForeign =
            (countryCode && countryCode !== "in") ||
            (country && country !== "india" && !locLower.includes("india"));

          const isRemote = Boolean(
            j.telecommuting || j.location?.telecommuting,
          );

          if (isForeign && !isRemote) {
            continue;
          }

          const isIndiaExplicit =
            countryCode === "in" ||
            country === "india" ||
            locLower.includes("india") ||
            /\b(bengaluru|bangalore|hyderabad|gurgaon|gurugram|noida|delhi|mumbai|pune|chennai|kolkata|ahmedabad|jaipur|chandigarh|indore|lucknow|kanpur|kochi|nagpur|bhopal|surat|patna)\b/i.test(
              locLower,
            );

          const isWorldwide =
            isRemote &&
            (!country || country === "worldwide" || country === "anywhere");

          if (!isIndiaExplicit && !isWorldwide) {
            continue;
          }

          const isIntern =
            j.title.toLowerCase().includes("intern") ||
            (j.employment_type || "").toLowerCase().includes("intern");

          rawJobs.push({
            title: j.title,
            company: data.name || account.toUpperCase(),
            location: locStr || (isRemote ? "Remote - India" : "India"),
            isRemote,
            skills: j.department ? [j.department] : [],
            description:
              j.description ||
              `${j.title} at ${data.name || account}. Direct apply via Workable portal.`,
            postedAt,
            applyUrl: j.url, // Human-facing apply link
            source: "WORKABLE",
            sourceJobId: `workable-${account}-${j.shortcode}`,
            employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
            workMode: isRemote ? "REMOTE" : "ONSITE",
            companyWebsite: `https://${account}.com`,
            rawPayload: { account, shortcode: j.shortcode },
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to harvest Workable account [${account}]: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `WorkableSourceAdapter fetched ${rawJobs.length} eligible jobs`,
    );
    return rawJobs;
  }
}
