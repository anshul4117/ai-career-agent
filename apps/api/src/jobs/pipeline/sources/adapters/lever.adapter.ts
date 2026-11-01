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

interface LeverPostingItem {
  id: string;
  text: string;
  hostedUrl: string;
  applyUrl: string;
  descriptionPlain?: string;
  description?: string;
  categories?: {
    commitment?: string;
    department?: string;
    location?: string;
    team?: string;
    allLocations?: string[];
  };
  country?: string;
  workplaceType?: string;
  createdAt?: number;
}

@Injectable()
export class LeverSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "LEVER";
  private readonly logger = new Logger(LeverSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 10,
    refillTokens: 5,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "LeverAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  constructor(private readonly prisma?: PrismaService) {}

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_LEVER !== "false";
  }

  async getSites(): Promise<string[]> {
    const set = new Set<string>();
    const custom = process.env.LEVER_SITES;
    if (custom) {
      custom
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => set.add(s));
    } else {
      ["cred"].forEach((s) => set.add(s));
    }

    if (this.prisma) {
      try {
        const dbComps = await this.prisma.company.findMany({
          where: {
            atsType: AtsType.LEVER,
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
          `Could not query database companies for Lever: ${(err as Error).message}`,
        );
      }
    }
    return Array.from(set);
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("Lever adapter is disabled.");
      return [];
    }

    const rawJobs: RawJob[] = [];
    const maxAgeDays = params?.maxAgeDays || 45;
    const oldestAllowedTimestamp =
      Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    const sites = await this.getSites();

    for (const site of sites) {
      try {
        await this.rateLimiter.acquire();

        const postings = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://api.lever.co/v0/postings/${site}?mode=json`;
            const res = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            });

            if (res.status === 404) {
              this.logger.debug(`Lever site [${site}] not found (HTTP 404).`);
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Lever [${site}] returned HTTP ${res.status}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as LeverPostingItem[];
          });
        });

        if (!Array.isArray(postings)) continue;

        for (const p of postings) {
          if (p.createdAt && p.createdAt < oldestAllowedTimestamp) {
            continue; // Filter stale postings
          }

          const loc =
            p.categories?.location ||
            (p.categories?.allLocations &&
              p.categories.allLocations.join(", ")) ||
            (p.country === "IN" ? "India" : "Remote");

          const locLower = loc.toLowerCase();

          // Reject foreign explicit locations unless India is explicitly present
          const isForeign =
            /\b(usa?|united states|canada|uk|united kingdom|london|germany|berlin|france|paris|australia|singapore|ireland|dublin|netherlands|brazil|emea|latam|europe|us-remote|us remote)\b/i.test(
              locLower,
            );
          if (isForeign && !locLower.includes("india")) {
            continue;
          }

          const isIndiaExplicit =
            p.country === "IN" ||
            locLower.includes("india") ||
            /\b(bengaluru|bangalore|hyderabad|gurgaon|gurugram|noida|delhi|mumbai|pune|chennai|kolkata|ahmedabad|jaipur|chandigarh|indore|lucknow|kanpur|kochi|nagpur|bhopal|surat|patna)\b/i.test(
              locLower,
            );

          const isWorldwide =
            locLower === "worldwide" ||
            locLower === "anywhere" ||
            locLower.includes("work from anywhere");

          if (!isIndiaExplicit && !isWorldwide) {
            continue;
          }

          const workplace = (p.workplaceType || "").toUpperCase();
          const isRemote = workplace === "REMOTE" || isWorldwide;

          const commitment = (p.categories?.commitment || "").toLowerCase();
          const employmentType = commitment.includes("intern")
            ? "INTERNSHIP"
            : commitment.includes("part")
              ? "PART_TIME"
              : commitment.includes("contract")
                ? "CONTRACT"
                : "FULL_TIME";

          const skills = [p.categories?.team, p.categories?.department].filter(
            Boolean,
          ) as string[];

          rawJobs.push({
            title: p.text,
            company: site.toUpperCase(),
            location: loc,
            isRemote,
            skills,
            description: p.descriptionPlain || p.description || p.text,
            postedAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            applyUrl: p.hostedUrl || p.applyUrl, // Direct human-facing URL on jobs.lever.co
            source: "LEVER",
            sourceJobId: `lever-${site}-${p.id}`,
            employmentType,
            workMode: isRemote
              ? "REMOTE"
              : workplace === "HYBRID"
                ? "HYBRID"
                : "ONSITE",
            companyWebsite: `https://${site}.com`,
            rawPayload: { site, leverId: p.id },
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to harvest Lever site [${site}]: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `LeverSourceAdapter fetched ${rawJobs.length} eligible jobs`,
    );
    return rawJobs;
  }
}
