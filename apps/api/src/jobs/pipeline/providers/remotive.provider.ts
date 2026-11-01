import { Injectable, Logger } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo?: string;
  category?: string;
  tags?: string[];
  job_type?: string;
  publication_date?: string;
  candidate_required_location?: string;
  salary?: string;
  description?: string;
}

interface RemotiveResponse {
  jobs?: RemotiveJob[];
}

@Injectable()
export class RemotiveJobProvider implements IJobProvider {
  readonly providerName = "REMOTIVE";
  private readonly logger = new Logger(RemotiveJobProvider.name);

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    try {
      const url =
        "https://remotive.com/api/remote-jobs?category=software-dev&limit=30";
      const res = await fetch(url, { headers: { Accept: "application/json" } });

      if (!res.ok) {
        this.logger.warn(`Remotive API responded with status ${res.status}`);
        return [];
      }

      const data = (await res.json()) as RemotiveResponse;
      if (!data.jobs || !Array.isArray(data.jobs)) {
        return [];
      }

      const filtered = params?.query
        ? data.jobs.filter((j) => {
            const q = params.query?.toLowerCase() || "";
            return (
              j.title.toLowerCase().includes(q) ||
              j.company_name.toLowerCase().includes(q) ||
              j.tags?.some((t) => t.toLowerCase().includes(q))
            );
          })
        : data.jobs;

      return filtered.slice(0, 25).map((job) => {
        const { min, max } = this.parseSalary(job.salary);

        return {
          externalId: `remotive-${job.id}`,
          source: "REMOTIVE",
          title: job.title,
          companyName: job.company_name,
          companyLogo: job.company_logo,
          location: job.candidate_required_location || "Remote",
          workMode: "REMOTE",
          employmentType: job.job_type,
          salaryMin: min,
          salaryMax: max,
          currency: "USD",
          salaryPeriod: "YEARLY",
          description: this.stripHtml(job.description || job.title),
          applyUrl: job.url,
          postedAt: job.publication_date
            ? new Date(job.publication_date)
            : new Date(),
          skillsRaw: job.tags || [],
        };
      });
    } catch (err) {
      this.logger.error("Failed to fetch live jobs from Remotive", err);
      return [];
    }
  }

  private parseSalary(salaryStr?: string): { min?: number; max?: number } {
    if (!salaryStr) return {};
    const numbers = salaryStr.match(/\d+([.,]\d+)?/g);
    if (!numbers || numbers.length === 0) return {};

    const clean = numbers.map((n) => parseFloat(n.replace(/,/g, "")));
    if (clean.length === 1) {
      const val = clean[0] < 1000 ? clean[0] * 1000 : clean[0];
      return { min: val, max: val };
    }
    const min = clean[0] < 1000 ? clean[0] * 1000 : clean[0];
    const max = clean[1] < 1000 ? clean[1] * 1000 : clean[1];
    return { min, max };
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/p>/gi, "\n\n")
      .replace(/<li>/gi, "- ")
      .replace(/<\/li>/gi, "\n")
      .replace(/<[^>]+>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }
}
