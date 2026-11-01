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

interface SmartRecruitersPosting {
  id: string;
  name: string;
  releasedDate?: string;
  company?: {
    identifier: string;
    name: string;
  };
  location?: {
    city?: string;
    region?: string;
    country?: string;
    remote?: boolean;
    hybrid?: boolean;
  };
  department?: {
    label?: string;
  };
}

interface SmartRecruitersResponse {
  totalFound: number;
  content: SmartRecruitersPosting[];
}

@Injectable()
export class SmartRecruitersSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "SMARTRECRUITERS";
  private readonly logger = new Logger(SmartRecruitersSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 10,
    refillTokens: 5,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "SmartRecruitersAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  constructor(private readonly prisma?: PrismaService) {}

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_SMARTRECRUITERS !== "false";
  }

  // Enterprise & Tech employers on SmartRecruiters with major India hiring hubs
  async getCompanies(): Promise<string[]> {
    const set = new Set<string>();
    const custom = process.env.SMARTRECRUITERS_COMPANIES;
    if (custom) {
      custom
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => set.add(s));
    } else {
      ["smartrecruiters", "publicissapient", "visa", "bosch"].forEach((s) =>
        set.add(s),
      );
    }

    if (this.prisma) {
      try {
        const dbComps = await this.prisma.company.findMany({
          where: {
            atsType: AtsType.SMARTRECRUITERS,
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
          `Could not query database companies for SmartRecruiters: ${(err as Error).message}`,
        );
      }
    }
    return Array.from(set);
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("SmartRecruiters adapter is disabled.");
      return [];
    }

    const rawJobs: RawJob[] = [];
    const maxAgeDays = params?.maxAgeDays || 45;
    const oldestAllowedDate = new Date(
      Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
    );
    const companies = await this.getCompanies();

    for (const compId of companies) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://api.smartrecruiters.com/v1/companies/${compId}/postings?limit=100`;
            const res = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            });

            if (res.status === 404) {
              this.logger.debug(
                `SmartRecruiters company [${compId}] not found (HTTP 404).`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `SmartRecruiters [${compId}] returned HTTP ${res.status}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as SmartRecruitersResponse;
          });
        });

        if (!data || !Array.isArray(data.content)) continue;

        for (const item of data.content) {
          const postedAt = item.releasedDate
            ? new Date(item.releasedDate)
            : new Date();
          if (postedAt < oldestAllowedDate) {
            continue;
          }

          const city = item.location?.city || "";
          const region = item.location?.region || "";
          const country = (item.location?.country || "").toLowerCase();
          const locStr = [city, region, country].filter(Boolean).join(", ");
          const locLower = locStr.toLowerCase();

          // Reject non-India foreign locations unless India is in country or location
          const isForeignCountry =
            country &&
            country !== "in" &&
            country !== "india" &&
            !locLower.includes("india");

          if (isForeignCountry && !item.location?.remote) {
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
            item.location?.remote &&
            (locLower.includes("worldwide") ||
              locLower.includes("anywhere") ||
              !country);

          if (!isIndiaExplicit && !isWorldwide) {
            continue;
          }

          const title = item.name;
          const isIntern =
            title.toLowerCase().includes("intern") ||
            title.toLowerCase().includes("internship");

          const isRemote = Boolean(item.location?.remote || isWorldwide);
          const applyUrl = `https://jobs.smartrecruiters.com/${compId}/${item.id}`;

          rawJobs.push({
            title,
            company: item.company?.name || compId.toUpperCase(),
            location: locStr || (isRemote ? "Remote - India" : "India"),
            isRemote,
            skills: item.department?.label ? [item.department.label] : [],
            description: `${title} at ${item.company?.name || compId}. Location: ${locStr}. Direct application via SmartRecruiters portal.`,
            postedAt,
            applyUrl, // Direct human-facing portal URL
            source: "SMARTRECRUITERS",
            sourceJobId: `smartrecruiters-${compId}-${item.id}`,
            employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
            workMode: isRemote
              ? "REMOTE"
              : item.location?.hybrid
                ? "HYBRID"
                : "ONSITE",
            companyWebsite: `https://${compId}.com`,
            rawPayload: {
              companyIdentifier: compId,
              smartRecruitersId: item.id,
            },
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to harvest SmartRecruiters [${compId}]: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `SmartRecruitersSourceAdapter fetched ${rawJobs.length} eligible jobs`,
    );
    return rawJobs;
  }
}
