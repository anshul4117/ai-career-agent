import { Injectable, Logger } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

interface AdzunaJobItem {
  id: string;
  title: string;
  company?: { display_name?: string };
  location?: { display_name?: string };
  description?: string;
  salary_min?: number;
  salary_max?: number;
  created?: string;
  redirect_url?: string;
}

interface AdzunaApiResponse {
  results?: AdzunaJobItem[];
}

@Injectable()
export class AdzunaJobProvider implements IJobProvider {
  readonly providerName = "ADZUNA";
  private readonly logger = new Logger(AdzunaJobProvider.name);

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    const appId = process.env.ADZUNA_APP_ID;
    const appKey = process.env.ADZUNA_APP_KEY;

    if (!appId || !appKey) {
      this.logger.debug(
        "Adzuna credentials not configured in environment. Skipping Adzuna provider.",
      );
      return [];
    }

    const country = params?.country || "in"; // default to India
    const page = params?.page || 1;
    const query = encodeURIComponent(params?.query || "software engineer");
    const location = params?.location
      ? `&where=${encodeURIComponent(params.location)}`
      : "";

    const url = `https://api.adzuna.com/v1/api/jobs/${country}/search/${page}?app_id=${appId}&app_key=${appKey}&what=${query}${location}&content-type=application/json`;

    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok) {
        this.logger.warn(`Adzuna API returned status ${response.status}`);
        return [];
      }

      const data = (await response.json()) as AdzunaApiResponse;
      if (!data.results || !Array.isArray(data.results)) {
        return [];
      }

      return data.results.map((item) => ({
        externalId: `adzuna-${item.id}`,
        source: "ADZUNA",
        title: item.title,
        companyName: item.company?.display_name || "Unknown Company",
        location: item.location?.display_name || "India",
        salaryMin: item.salary_min,
        salaryMax: item.salary_max,
        currency: "INR",
        description: item.description || item.title,
        applyUrl: item.redirect_url || "",
        postedAt: item.created ? new Date(item.created) : new Date(),
      }));
    } catch (err) {
      this.logger.error("Failed to fetch jobs from Adzuna", err);
      return [];
    }
  }
}
