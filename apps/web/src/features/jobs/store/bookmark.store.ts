"use client";

import { create } from "zustand";
import type { Job } from "../types/jobs.types";
import { bookmarkService } from "../services/bookmark.service";
import { useJobsStore } from "./jobs.store";

interface BookmarkState {
  savedJobs: Job[];
  recentlyViewed: Job[];
  loading: boolean;

  // Actions
  fetchSavedJobs: () => Promise<void>;
  toggleSaveJob: (job: Job) => Promise<void>;
  addRecentlyViewed: (job: Job) => void;
  loadRecentlyViewed: () => void;
}

export const useBookmarkStore = create<BookmarkState>((set, get) => ({
  savedJobs: [],
  recentlyViewed: [],
  loading: false,

  fetchSavedJobs: async () => {
    set({ loading: true });
    try {
      const list = await bookmarkService.getSavedJobs();
      set({ savedJobs: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  toggleSaveJob: async (job) => {
    const wasSaved = job.isSaved;

    // Toggle in mock database
    if (wasSaved) {
      await bookmarkService.unsaveJob(job.id);
    } else {
      await bookmarkService.saveJob(job.id);
    }

    const updatedJob = { ...job, isSaved: !wasSaved, savedAt: !wasSaved ? new Date().toISOString() : undefined };

    set((state) => {
      const isNowSaved = !wasSaved;
      const updatedList = isNowSaved
        ? [...state.savedJobs.filter((j) => j.id !== job.id), updatedJob]
        : state.savedJobs.filter((j) => j.id !== job.id);
      return { savedJobs: updatedList };
    });

    // Sync with main jobs store
    const jobsStore = useJobsStore.getState();
    if (jobsStore) {
      // Toggle locally in jobs list if listing exists there
      const hasJob = jobsStore.jobs.some((j) => j.id === job.id);
      if (hasJob) {
        jobsStore.toggleSaveJob(job.id);
      }
    }
  },

  addRecentlyViewed: (job) => {
    const current = get().recentlyViewed;
    const filtered = current.filter((j) => j.id !== job.id);
    const updated = [job, ...filtered].slice(0, 10);

    set({ recentlyViewed: updated });
    
    // Persist to localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("ai_career_agent_recent_jobs", JSON.stringify(updated));
    }
  },

  loadRecentlyViewed: () => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("ai_career_agent_recent_jobs");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          set({ recentlyViewed: parsed });
        } catch {
          // Ignore parse errors
        }
      }
    }
  }
}));
