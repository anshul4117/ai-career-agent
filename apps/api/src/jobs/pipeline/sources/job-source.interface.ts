import { RawJobInput } from "../types/job-pipeline.types";
import { LocationSource, LocationConfidence } from "@prisma/client";

export interface RawJob {
  title: string;
  company: string;
  location: string;
  isRemote: boolean;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryPeriod?: string;
  expMin?: number;
  expMax?: number;
  skills: string[];
  description: string;
  postedAt?: Date;
  applyUrl: string; // Direct human-facing URL only. NEVER raw JSON API endpoints!
  source: string;
  sourceJobId: string;
  companyWebsite?: string;
  companyLogo?: string;
  employmentType?: string;
  workMode?: string;
  applyLinkStatus?: string;
  rawPayload?: Record<string, unknown>;
  rawLocation?: string;
  queriedCity?: string;
  city?: string;
  state?: string;
  locationSource?: string;
  locationConfidence?: string;
}

export interface JobFetchParams {
  query?: string;
  location?: string;
  maxPages?: number;
  maxAgeDays?: number;
}

export interface JobSourceAdapter {
  readonly sourceName: string;
  readonly isEnabled: boolean;
  fetch(params?: JobFetchParams): Promise<RawJob[]>;
}

export function rawJobToRawJobInput(job: RawJob): RawJobInput {
  return {
    externalId: job.sourceJobId,
    source: job.source,
    title: job.title,
    companyName: job.company,
    companyWebsite: job.companyWebsite,
    companyLogo: job.companyLogo,
    location: job.location,
    rawLocation: job.rawLocation || job.location,
    queriedCity: job.queriedCity,
    city: job.city,
    state: job.state,
    locationSource: job.locationSource as LocationSource | undefined,
    locationConfidence: job.locationConfidence as
      LocationConfidence | undefined,
    workMode: job.workMode || (job.isRemote ? "REMOTE" : "ONSITE"),
    employmentType: job.employmentType,
    experienceMinYears: job.expMin,
    experienceMaxYears: job.expMax,
    salaryMin: job.salaryMin,
    salaryMax: job.salaryMax,
    currency: job.currency,
    salaryPeriod: job.salaryPeriod,
    description: job.description,
    applyUrl: job.applyUrl,
    applyLinkStatus: job.applyLinkStatus,
    postedAt: job.postedAt,
    skillsRaw: job.skills,
  };
}
