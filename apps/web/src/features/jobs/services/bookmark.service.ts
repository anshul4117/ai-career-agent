import { mockJobs } from "../mock/jobs-data";
import type { Job } from "../types/jobs.types";
import { apiClient } from "@/lib/api-client";
import { mapBackendJobToFrontendJob, RawBackendJob } from "./job.service";

export const bookmarkService = {
  /**
   * Fetches all saved/bookmarked job listings
   */
  async getSavedJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get<RawBackendJob[]>("/jobs/saved");
      if (response && Array.isArray(response)) {
        return response.map(mapBackendJobToFrontendJob);
      }
    } catch {
      // Fallback to local mocks
    }
    return mockJobs.filter((j) => j.isSaved);
  },

  /**
   * Saves a job by ID
   */
  async saveJob(id: string): Promise<boolean> {
    try {
      await apiClient.post(`/jobs/${id}/save`, {});
      return true;
    } catch {
      const job = mockJobs.find((j) => j.id === id);
      if (job) {
        job.isSaved = true;
        return true;
      }
      return false;
    }
  },

  /**
   * Unsaves a job by ID
   */
  async unsaveJob(id: string): Promise<boolean> {
    try {
      await apiClient.delete(`/jobs/${id}/save`);
      return true;
    } catch {
      const job = mockJobs.find((j) => j.id === id);
      if (job) {
        job.isSaved = false;
        return true;
      }
      return false;
    }
  },

  /**
   * Archives or restores a job by ID
   */
  async toggleArchiveJob(id: string): Promise<boolean> {
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.isArchived = !job.isArchived;
      return true;
    }
    return false;
  },

  /**
   * Updates notes and labels for a saved job
   */
  async updateNotesAndLabels(
    id: string,
    notes: string,
    labels: string[],
  ): Promise<boolean> {
    const job = mockJobs.find((j) => j.id === id);
    if (job) {
      job.notes = notes;
      job.labels = labels;
      return true;
    }
    return false;
  },
};
