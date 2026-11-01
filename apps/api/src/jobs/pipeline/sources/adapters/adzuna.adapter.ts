import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";

@Injectable()
export class AdzunaSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "ADZUNA";
  private readonly logger = new Logger(AdzunaSourceAdapter.name);

  get isEnabled(): boolean {
    const hasKeys = Boolean(
      process.env.ADZUNA_APP_ID && process.env.ADZUNA_APP_KEY,
    );
    return hasKeys && process.env.ENABLE_SOURCE_ADZUNA !== "false";
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug(
        "Adzuna adapter disabled: ADZUNA_APP_ID or ADZUNA_APP_KEY not provided (free public sources active).",
      );
      return [];
    }

    // When keys are provided, query Adzuna India API
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;
    const rawJobs: RawJob[] = [];
    const maxPages = params?.maxPages || 2;
    const query = encodeURIComponent(params?.query || "software engineer");

    for (let page = 1; page <= maxPages; page++) {
      try {
        const url = `https://api.adzuna.com/v1/api/jobs/in/search/${page}?app_id=${appId}&app_key=${appKey}&what=${query}&content-type=application/json`;
        const res = await fetch(url, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) break;

        const data = await res.json();
        if (!data.results || !Array.isArray(data.results)) break;

        for (const item of data.results) {
          rawJobs.push({
            title: item.title,
            company: item.company?.display_name || "Unknown",
            location: item.location?.display_name || "India",
            isRemote: (item.location?.display_name || "")
              .toLowerCase()
              .includes("remote"),
            skills: item.category?.tag ? [item.category.tag] : [],
            description: item.description || item.title,
            postedAt: item.created ? new Date(item.created) : new Date(),
            applyUrl: item.redirect_url,
            source: "ADZUNA",
            sourceJobId: `adzuna-${item.id}`,
            salaryMin: item.salary_min,
            salaryMax: item.salary_max,
            currency: "INR",
          });
        }
      } catch (err: unknown) {
        this.logger.warn(
          `Adzuna fetch failed on page ${page}: ${(err as Error).message}`,
        );
        break;
      }
    }

    return rawJobs;
  }
}
