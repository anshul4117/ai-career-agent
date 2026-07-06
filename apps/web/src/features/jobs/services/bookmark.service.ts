import { mockJobs } from "../mock/jobs-data";
import type { Job } from "../types/jobs.types";

export const bookmarkService = {
  /**
   * Fetches all saved/bookmarked job listings
   */
  async getSavedJobs(): Promise<Job[]> {
    return mockJobs.filter((j) => j.isSaved);
  },

  /**
   * Saves a job by ID
   */
  async saveJob(id: string): Promise<boolean> {
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.isSaved = true;
      return true;
    }
    return false;
  },

  /**
   * Unsaves a job by ID
   */
  async unsaveJob(id: string): Promise<boolean> {
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.isSaved = false;
      return true;
    }
    return false;
  }
};
