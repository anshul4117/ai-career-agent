import { Injectable, Logger } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

interface JSearchJobItem {
  job_id: string;
  job_title: string;
  employer_name?: string;
  employer_logo?: string;
  employer_website?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_is_remote?: boolean;
  job_employment_type?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_description?: string;
  job_apply_link?: string;
  job_posted_at_datetime_utc?: string;
}

interface JSearchApiResponse {
  data?: JSearchJobItem[];
}

@Injectable()
export class JSearchJobProvider implements IJobProvider {
  readonly providerName = "JSEARCH";
  private readonly logger = new Logger(JSearchJobProvider.name);

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    const rapidApiKey = process.env.RAPIDAPI_KEY || process.env.JSEARCH_API_KEY;

    if (!rapidApiKey) {
      this.logger.debug(
        "RapidAPI / JSearch key not configured in environment. Skipping JSearch provider.",
      );
      return [];
    }

    const query = params?.query || "software engineer in India";
    const page = params?.page || 1;
    const url = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(query)}&page=${page}&num_pages=1`;

    try {
      const response = await fetch(url, {
        headers: {
          "X-RapidAPI-Key": rapidApiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      });

      if (!response.ok) {
        this.logger.warn(`JSearch API returned status ${response.status}`);
        return [];
      }

      const res = (await response.json()) as JSearchApiResponse;
      if (!res.data || !Array.isArray(res.data)) {
        return [];
      }

      return res.data.map((item) => ({
        externalId: `jsearch-${item.job_id}`,
        source: "JSEARCH",
        title: item.job_title,
        companyName: item.employer_name || "Unknown Company",
        companyWebsite: item.employer_website,
        companyLogo: item.employer_logo,
        location:
          [item.job_city, item.job_state, item.job_country]
            .filter(Boolean)
            .join(", ") || "Remote",
        workMode: item.job_is_remote ? "REMOTE" : undefined,
        employmentType: item.job_employment_type,
        salaryMin: item.job_min_salary,
        salaryMax: item.job_max_salary,
        currency: item.job_salary_currency || "INR",
        salaryPeriod: item.job_salary_period,
        description: item.job_description || item.job_title,
        applyUrl: item.job_apply_link || "",
        postedAt: item.job_posted_at_datetime_utc
          ? new Date(item.job_posted_at_datetime_utc)
          : new Date(),
      }));
    } catch (err) {
      this.logger.error("Failed to fetch jobs from JSearch", err);
      return [];
    }
  }
}
