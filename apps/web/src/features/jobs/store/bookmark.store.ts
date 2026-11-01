"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Job } from "../types/jobs.types";
import { bookmarkService } from "../services/bookmark.service";
import { useJobsStore } from "./jobs.store";
import { mockJobs } from "../mock/jobs-data";

interface BookmarkState {
  savedJobs: Job[];
  recentlyViewed: Job[];
  loading: boolean;

  // Actions
  fetchSavedJobs: () => Promise<void>;
  toggleSaveJob: (job: Job) => Promise<void>;
  setJobApplied: (id: string, isApplied: boolean) => void;
  addRecentlyViewed: (job: Job) => void;
  loadRecentlyViewed: () => void;
  toggleArchiveJob: (id: string) => Promise<void>;
  updateNotesAndLabels: (
    id: string,
    notes: string,
    labels: string[],
  ) => Promise<void>;
}

export const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      savedJobs: [],
      recentlyViewed: [],
      loading: false,

      fetchSavedJobs: async () => {
        set({ loading: true });
        try {
          const list = await bookmarkService.getSavedJobs();
          if (list && list.length > 0) {
            set((state) => {
              const localIds = new Set(state.savedJobs.map((j) => j.id));
              const newFromBackend = list.filter((j) => !localIds.has(j.id));
              return {
                savedJobs: [...state.savedJobs, ...newFromBackend],
                loading: false,
              };
            });
            return;
          }
        } catch {
          // Backend fetch failed, preserve local savedJobs
        }
        set((state) => {
          if (state.savedJobs.length === 0) {
            return {
              savedJobs: mockJobs.filter((j) => j.isSaved),
              loading: false,
            };
          }
          return { loading: false };
        });
      },

      toggleSaveJob: async (job) => {
        const isCurrentlySaved = get().savedJobs.some((j) => j.id === job.id);
        const willBeSaved = !isCurrentlySaved;

        const updatedJob: Job = {
          ...job,
          isSaved: willBeSaved,
          savedAt: willBeSaved ? new Date().toISOString() : undefined,
        };

        set((state) => ({
          savedJobs: willBeSaved
            ? [updatedJob, ...state.savedJobs.filter((j) => j.id !== job.id)]
            : state.savedJobs.filter((j) => j.id !== job.id),
        }));

        // Sync with main jobs store
        const jobsStore = useJobsStore.getState();
        if (jobsStore) {
          jobsStore.setJobSaved(job.id, willBeSaved);
        }

        // Background sync with API
        try {
          if (willBeSaved) {
            await bookmarkService.saveJob(job.id);
          } else {
            await bookmarkService.unsaveJob(job.id);
          }
        } catch {
          // Local storage is authoritative fallback
        }
      },

      setJobApplied: (id, isApplied) => {
        set((state) => ({
          savedJobs: state.savedJobs.map((j) =>
            j.id === id ? { ...j, isApplied } : j,
          ),
        }));
      },

      addRecentlyViewed: (job) => {
        const current = get().recentlyViewed;
        const filtered = current.filter((j) => j.id !== job.id);
        const updated = [job, ...filtered].slice(0, 10);
        set({ recentlyViewed: updated });
      },

      loadRecentlyViewed: () => {
        // Hydration handled by persist middleware
      },

      toggleArchiveJob: async (id) => {
        set({ loading: true });
        await bookmarkService.toggleArchiveJob(id);
        const updated = get().savedJobs.map((j) => {
          if (j.id === id) {
            return { ...j, isArchived: !j.isArchived };
          }
          return j;
        });
        set({ savedJobs: updated, loading: false });
      },

      updateNotesAndLabels: async (id, notes, labels) => {
        set({ loading: true });
        await bookmarkService.updateNotesAndLabels(id, notes, labels);
        const updated = get().savedJobs.map((j) => {
          if (j.id === id) {
            return { ...j, notes, labels };
          }
          return j;
        });
        set({ savedJobs: updated, loading: false });
      },
    }),
    {
      name: "ai-career-agent-saved-jobs",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
