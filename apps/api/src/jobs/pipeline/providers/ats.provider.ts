import { Injectable, Logger } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

interface LeverPosting {
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

interface GreenhouseJob {
  id: number;
  title: string;
  absolute_url: string;
  location?: { name: string };
  updated_at?: string;
  content?: string;
  departments?: { name: string }[];
}

interface GreenhouseResponse {
  jobs: GreenhouseJob[];
}

@Injectable()
export class AtsJobProvider implements IJobProvider {
  readonly providerName = "ATS_LIVE";
  private readonly logger = new Logger(AtsJobProvider.name);

  // Configurable list of enterprise tech companies on public Lever and Greenhouse ATS
  private readonly leverCompanies = (
    process.env.LEVER_COMPANIES || "cred,khatabook,urbancompany,udaan"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  private readonly greenhouseCompanies = (
    process.env.GREENHOUSE_COMPANIES || "stripe,coinbase,figma,brex"
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    const rawJobs: RawJobInput[] = [];

    // 1. Ingest from Lever ATS Boards
    for (const company of this.leverCompanies) {
      try {
        const url = `https://api.lever.co/v0/postings/${company}?mode=json`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          this.logger.debug(
            `Lever company "${company}" returned status ${res.status}`,
          );
          continue;
        }

        const postings = (await res.json()) as LeverPosting[];
        if (!Array.isArray(postings)) continue;

        for (const p of postings) {
          const loc =
            p.categories?.location ||
            (p.categories?.allLocations &&
              p.categories.allLocations.join(", ")) ||
            (p.country === "IN" ? "India" : "Remote");

          // Determine work mode
          const workMode =
            p.workplaceType?.toUpperCase() === "REMOTE"
              ? "REMOTE"
              : p.workplaceType?.toUpperCase() === "HYBRID"
                ? "HYBRID"
                : "ONSITE";

          const empType = p.categories?.commitment
            ?.toLowerCase()
            .includes("intern")
            ? "INTERNSHIP"
            : p.categories?.commitment?.toLowerCase().includes("part")
              ? "PART_TIME"
              : p.categories?.commitment?.toLowerCase().includes("contract")
                ? "CONTRACT"
                : "FULL_TIME";

          rawJobs.push({
            externalId: `lever-${company}-${p.id}`,
            source: "COMPANY",
            title: p.text,
            companyName: company.toUpperCase(),
            companyWebsite: `https://${company}.com`,
            location: loc,
            workMode,
            employmentType: empType,
            description: p.descriptionPlain || p.description || p.text,
            applyUrl: p.applyUrl || p.hostedUrl,
            postedAt: p.createdAt ? new Date(p.createdAt) : new Date(),
            skillsRaw: [p.categories?.team, p.categories?.department].filter(
              Boolean,
            ) as string[],
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to fetch Lever jobs for ${company}: ${(err as Error).message}`,
        );
      }
    }

    // 2. Ingest from Greenhouse ATS Boards
    for (const company of this.greenhouseCompanies) {
      try {
        const url = `https://boards-api.greenhouse.io/v1/boards/${company}/jobs?content=true`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });

        if (!res.ok) {
          this.logger.debug(
            `Greenhouse company "${company}" returned status ${res.status}`,
          );
          continue;
        }

        const data = (await res.json()) as GreenhouseResponse;
        if (!data.jobs || !Array.isArray(data.jobs)) continue;

        for (const j of data.jobs) {
          const locName = j.location?.name || "Global / Remote";
          const locLower = locName.toLowerCase();

          // Reject foreign locations explicitly
          const isForeign =
            /\b(usa?|united states|canada|uk|united kingdom|london|germany|berlin|france|paris|australia|singapore|ireland|dublin|netherlands|brazil|emea|latam|europe|us-remote|us remote)\b/i.test(
              locLower,
            );
          if (isForeign && !locLower.includes("india")) continue;

          const isIndiaExplicit =
            locLower.includes("india") ||
            locLower.includes("bangalore") ||
            locLower.includes("bengaluru") ||
            locLower.includes("hyderabad") ||
            locLower.includes("gurgaon") ||
            locLower.includes("gurugram") ||
            locLower.includes("noida") ||
            locLower.includes("delhi") ||
            locLower.includes("mumbai") ||
            locLower.includes("pune") ||
            locLower.includes("chennai") ||
            locLower.includes("kolkata") ||
            locLower.includes("ahmedabad") ||
            locLower.includes("jaipur") ||
            locLower.includes("chandigarh") ||
            locLower.includes("indore") ||
            locLower.includes("lucknow") ||
            locLower.includes("kanpur");

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
            externalId: `greenhouse-${company}-${j.id}`,
            source: "COMPANY",
            title,
            companyName: company.charAt(0).toUpperCase() + company.slice(1),
            companyWebsite: `https://${company}.com`,
            location: locName,
            employmentType: isIntern ? "INTERNSHIP" : "FULL_TIME",
            description: j.content || j.title,
            applyUrl: j.absolute_url,
            postedAt: j.updated_at ? new Date(j.updated_at) : new Date(),
            skillsRaw: j.departments?.map((d) => d.name) || [],
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Failed to fetch Greenhouse jobs for ${company}: ${(err as Error).message}`,
        );
      }
    }

    // Apply filtering if params provided
    if (!params) return rawJobs;

    let filtered = rawJobs;
    if (params.query) {
      const q = params.query.toLowerCase();
      filtered = filtered.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          (j.skillsRaw && j.skillsRaw.some((s) => s.toLowerCase().includes(q))),
      );
    }

    if (params.location) {
      const loc = params.location.toLowerCase();
      filtered = filtered.filter((j) =>
        (j.location || "").toLowerCase().includes(loc),
      );
    }

    return filtered;
  }
}
