import { RawJobInput } from "../types/job-pipeline.types";

export interface JobProviderQueryParams {
  query?: string;
  location?: string;
  page?: number;
  limit?: number;
  country?: string;
}

export interface IJobProvider {
  readonly providerName: string;
  fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]>;
}
