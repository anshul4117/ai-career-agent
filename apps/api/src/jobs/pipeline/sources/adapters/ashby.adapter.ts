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

interface AshbyJobItem {
  id: string;
  title: string;
  department?: string;
  team?: string;
  employmentType?: string;
  location?: string;
  secondaryLocations?: { location: string }[];
  isRemote?: boolean;
  workplaceType?: string;
  publishedAt?: string;
  jobUrl?: string;
  compensation?: {
    compensationTierSummary?: string;
    minValue?: number;
    maxValue?: number;
    currency?: string;
    period?: string;
  };
  address?: {
    postalAddress?: {
      addressCountry?: string;
      addressLocality?: string;
    };
  };
}

interface AshbyResponse {
  jobs: AshbyJobItem[];
}

@Injectable()
export class AshbySourceAdapter implements JobSourceAdapter {
  readonly sourceName = "ASHBY";
  private readonly logger = new Logger(AshbySourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 10,
    refillTokens: 5,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "AshbyAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  constructor(private readonly prisma?: PrismaService) {}

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_ASHBY !== "false";
  }

  async getOrganizations(): Promise<string[]> {
    const set = new Set<string>();
    const custom = process.env.ASHBY_ORGS;
    if (custom) {
      custom
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => set.add(s));
    } else {
      ["linear", "ramp", "notion", "ashby"].forEach((s) => set.add(s));
    }

    if (this.prisma) {
      try {
        const dbComps = await this.prisma.company.findMany({
          where: {
            atsType: AtsType.ASHBY,
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
          `Could not query database companies for Ashby: ${(err as Error).message}`,
        );
      }
    }
    return Array.from(set);
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("Ashby adapter is disabled.");
      return [];
    }

    const rawJobs: RawJob[] = [];
    const maxAgeDays = params?.maxAgeDays || 45;
    const oldestAllowedDate = new Date(
      Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
    );
    const orgs = await this.getOrganizations();

    for (const org of orgs) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://api.ashbyhq.com/posting-api/job-board/${org}?includeCompensation=true`;
            const res = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            });

            if (res.status === 404) {
              this.logger.debug(
                `Ashby organization [${org}] not found (HTTP 404).`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Ashby [${org}] returned HTTP ${res.status}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as AshbyResponse;
          });
        });

        if (!data || !Array.isArray(data.jobs)) continue;

        for (const j of data.jobs) {
          const publishedAt = j.publishedAt
            ? new Date(j.publishedAt)
            : new Date();
          if (publishedAt < oldestAllowedDate) {
            continue;
          }

          const loc =
            j.location || j.address?.postalAddress?.addressLocality || "Remote";
          const locLower = loc.toLowerCase();
          const country = (
            j.address?.postalAddress?.addressCountry || ""
          ).toLowerCase();

          // Reject foreign explicit countries/regions unless India is present
          const isForeign =
            /\b(usa?|united states|canada|uk|united kingdom|london|germany|berlin|france|paris|australia|singapore|ireland|dublin|netherlands|brazil|emea|latam|europe|european union)\b/i.test(
              locLower,
            ) ||
            /\b(usa?|united states|canada|uk|united kingdom|germany|france|australia|singapore)\b/i.test(
              country,
            );

          if (
            isForeign &&
            !locLower.includes("india") &&
            !country.includes("india")
          ) {
            continue;
          }

          const isIndiaExplicit =
            country === "in" ||
            country === "india" ||
            locLower.includes("india") ||
            /\b(bengaluru|bangalore|hyderabad|gurgaon|gurugram|noida|delhi|mumbai|pune|chennai|kolkata|ahmedabad|jaipur|chandigarh|indore|lucknow|kanpur|kochi|nagpur|bhopal|surat|patna)\b/i.test(
              locLower,
            );

          const isWorldwide =
            locLower === "worldwide" ||
            locLower === "anywhere" ||
            locLower.includes("work from anywhere") ||
            (j.isRemote && (locLower === "remote" || !loc));

          if (!isIndiaExplicit && !isWorldwide) {
            continue;
          }

          const isIntern =
            j.title.toLowerCase().includes("intern") ||
            (j.employmentType || "").toLowerCase().includes("intern");

          const isRemote = Boolean(
            j.isRemote || j.workplaceType === "Remote" || isWorldwide,
          );

          const applyUrl =
            j.jobUrl || `https://jobs.ashbyhq.com/${org}/${j.id}`;

          rawJobs.push({
            title: j.title,
            company: org.charAt(0).toUpperCase() + org.slice(1),
            location: loc,
            isRemote,
            skills: [j.department, j.team].filter(Boolean) as string[],
            description: `${j.title} at ${org}. Department: ${j.department || "General"}. Location: ${loc}. Apply directly via Ashby.`,
            postedAt: publishedAt,
            applyUrl, // Direct canonical human URL
            source: "ASHBY",
            sourceJobId: `ashby-${org}-${j.id}`,
            employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
            workMode: isRemote ? "REMOTE" : "HYBRID",
            salaryMin: j.compensation?.minValue,
            salaryMax: j.compensation?.maxValue,
            currency: j.compensation?.currency,
            salaryPeriod:
              j.compensation?.period?.toUpperCase() === "YEARLY"
                ? "YEARLY"
                : undefined,
            companyWebsite: `https://${org}.com`,
            rawPayload: { org, ashbyId: j.id },
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to harvest Ashby organization [${org}]: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `AshbySourceAdapter fetched ${rawJobs.length} eligible jobs`,
    );
    return rawJobs;
  }
}
