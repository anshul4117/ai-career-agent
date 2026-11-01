import { Injectable, Logger } from "@nestjs/common";
import {
  JobSourceAdapter,
  JobFetchParams,
  RawJob,
} from "../job-source.interface";

@Injectable()
export class JSearchSourceAdapter implements JobSourceAdapter {
  readonly sourceName = "JSEARCH";
  private readonly logger = new Logger(JSearchSourceAdapter.name);

  get isEnabled(): boolean {
    const hasKey = Boolean(process.env.RAPIDAPI_KEY);
    return hasKey && process.env.ENABLE_SOURCE_JSEARCH !== "false";
  }

  async fetch(params?: JobFetchParams): Promise<RawJob[]> {
    if (!this.isEnabled) {
      this.logger.debug(
        "JSearch adapter disabled: RAPIDAPI_KEY not provided (free public sources active).",
      );
      return [];
    }

    const key = process.env.RAPIDAPI_KEY;
    const rawJobs: RawJob[] = [];
    const query = encodeURIComponent(
      params?.query ? `${params.query} in India` : "software engineer in India",
    );

    try {
      const url = `https://jsearch.p.rapidapi.com/search?query=${query}&page=1&num_pages=1&country=in`;
      const res = await fetch(url, {
        headers: {
          "x-rapidapi-key": key as string,
          "x-rapidapi-host": "jsearch.p.rapidapi.com",
        },
      });

      if (!res.ok) return [];

      const data = await res.json();
      if (!data.data || !Array.isArray(data.data)) return [];

      for (const item of data.data) {
        rawJobs.push({
          title: item.job_title,
          company: item.employer_name || "Unknown",
          location: `${item.job_city || ""}, ${item.job_state || ""}, India`,
          isRemote: Boolean(item.job_is_remote),
          skills: item.job_required_skills || [],
          description: item.job_description || item.job_title,
          postedAt: item.job_posted_at_datetime_utc
            ? new Date(item.job_posted_at_datetime_utc)
            : new Date(),
          applyUrl: item.job_apply_link,
          source: "JSEARCH",
          sourceJobId: `jsearch-${item.job_id}`,
          companyLogo: item.employer_logo,
          employmentType: item.job_employment_type,
        });
      }
    } catch (err: unknown) {
      this.logger.warn(`JSearch fetch failed: ${(err as Error).message}`);
    }

    return rawJobs;
  }
}
