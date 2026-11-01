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

interface GreenhouseJobItem {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name: string };
  updated_at?: string;
  content?: string;
  departments?: { name: string }[];
}

interface GreenhouseBoardResponse {
  jobs: GreenhouseJobItem[];
}

@Injectable()
export class GreenhouseSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "GREENHOUSE";
  private readonly logger = new Logger(GreenhouseSourceAdapter.name);

  private readonly rateLimiter = new TokenBucketRateLimiter({
    capacity: 10,
    refillTokens: 5,
    refillIntervalMs: 1000,
  });

  private readonly circuitBreaker = new CircuitBreaker({
    name: "GreenhouseAPI",
    failureThreshold: 3,
    recoveryTimeoutMs: 60000,
  });

  constructor(private readonly prisma?: PrismaService) {}

  get isEnabled(): boolean {
    return process.env.ENABLE_SOURCE_GREENHOUSE !== "false";
  }

  async getBoards(): Promise<string[]> {
    const set = new Set<string>();
    const custom = process.env.GREENHOUSE_BOARDS;
    if (custom) {
      custom
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
        .forEach((s) => set.add(s));
    } else {
      ["stripe", "coinbase", "figma"].forEach((s) => set.add(s));
    }

    if (this.prisma) {
      try {
        const dbComps = await this.prisma.company.findMany({
          where: {
            atsType: AtsType.GREENHOUSE,
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
          `Could not query database companies for Greenhouse: ${(err as Error).message}`,
        );
      }
    }
    return Array.from(set);
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug("Greenhouse adapter is disabled.");
      return [];
    }

    const rawJobs: RawJob[] = [];
    const maxAgeDays = params?.maxAgeDays || 45;
    const oldestAllowedDate = new Date(
      Date.now() - maxAgeDays * 24 * 60 * 60 * 1000,
    );
    const boards = await this.getBoards();

    for (const board of boards) {
      try {
        await this.rateLimiter.acquire();

        const data = await this.circuitBreaker.execute(async () => {
          return withRetry(async () => {
            const url = `https://boards-api.greenhouse.io/v1/boards/${board}/jobs?content=true`;
            const res = await fetch(url, {
              headers: {
                Accept: "application/json",
                "User-Agent": "AICareerAgent-JobPipeline/1.0",
              },
            });

            if (res.status === 404) {
              this.logger.debug(
                `Greenhouse board [${board}] not found (HTTP 404).`,
              );
              return null;
            }

            if (!res.ok) {
              const err = new Error(
                `Greenhouse [${board}] returned HTTP ${res.status}`,
              );
              (err as { status?: number }).status = res.status;
              throw err;
            }

            return (await res.json()) as GreenhouseBoardResponse;
          });
        });

        if (!data || !Array.isArray(data.jobs)) continue;

        for (const j of data.jobs) {
          const postedAt = j.updated_at ? new Date(j.updated_at) : new Date();
          if (postedAt < oldestAllowedDate) {
            continue; // Filter out stale jobs older than maxAgeDays
          }

          const loc = j.location?.name || "Global / Remote";
          const locLower = loc.toLowerCase();

          // Reject foreign explicit locations unless India is mentioned
          const isForeign =
            /\b(usa?|united states|canada|uk|united kingdom|london|germany|berlin|france|paris|australia|singapore|ireland|dublin|netherlands|brazil|emea|latam|europe|us-remote|us remote)\b/i.test(
              locLower,
            );
          if (isForeign && !locLower.includes("india")) {
            continue;
          }

          const isIndiaExplicit =
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

          const title = j.title;
          const isIntern =
            title.toLowerCase().includes("intern") ||
            title.toLowerCase().includes("internship");

          rawJobs.push({
            title,
            company: board.charAt(0).toUpperCase() + board.slice(1),
            location: loc,
            isRemote: locLower.includes("remote") || isWorldwide,
            skills: j.departments?.map((d) => d.name) || [],
            description: j.content || j.title,
            postedAt,
            applyUrl: j.absolute_url, // Human-facing URL on greenhouse.io
            source: "GREENHOUSE",
            sourceJobId: `greenhouse-${board}-${j.id}`,
            employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
            companyWebsite: `https://${board}.com`,
            rawPayload: { board, greenhouseId: j.id },
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to harvest Greenhouse board [${board}]: ${(err as Error).message}`,
        );
      }
    }

    this.logger.log(
      `GreenhouseSourceAdapter fetched ${rawJobs.length} eligible jobs`,
    );
    return rawJobs;
  }
}
