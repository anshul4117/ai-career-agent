"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Job, JobFilters } from "../types/jobs.types";
import { jobService } from "../services/job.service";
import { useCompanyStore } from "./company.store";
import { useBookmarkStore } from "./bookmark.store";
import { useApplicationStore } from "@/features/applications/store/application.store";

interface JobsState {
  jobs: Job[];
  totalCount: number;
  selectedJob: Job | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  sorting: "recent" | "match" | "salary_desc" | "salary_asc";
  filters: JobFilters;
  recentlyViewed: Job[];
  recentSearches: string[];
  savedSearches: { id: string; name: string; filters: JobFilters }[];
  popularSearches: string[];
  comparedJobIds: string[];

  // Actions
  fetchJobs: () => Promise<void>;
  selectJob: (id: string) => Promise<void>;
  updateFilters: (updates: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSorting: (sort: "recent" | "match" | "salary_desc" | "salary_asc") => void;
  setPage: (p: number) => void;
  toggleSaveJob: (id: string) => void;
  setJobSaved: (id: string, isSaved: boolean) => void;
  setJobApplied: (id: string, isApplied: boolean) => void;
  addRecentSearch: (query: string) => void;
  saveSearch: (name: string) => void;
  removeSavedSearch: (id: string) => void;
  loadSearches: () => void;

  // Phase 5 New Actions
  loadJobs: () => Promise<void>;
  searchJobs: (query: string) => Promise<void>;
  filterJobs: (updates: Partial<JobFilters>) => Promise<void>;
  saveJob: (id: string) => Promise<void>;
  unsaveJob: (id: string) => Promise<void>;
  compareJobs: (ids: string[]) => void;
  loadCompany: (id: string) => Promise<void>;
}

const DEFAULT_FILTERS: JobFilters = {
  keyword: "",
  company: "",
  location: "",
  experienceLevel: [],
  remoteType: [],
  employmentType: [],
  salaryMin: null,
  skills: [],
  industry: "",
  datePosted: "any",
  easyApply: false,
  matchScoreMin: null,
  matchFilter: "all",
};

export const useJobsStore = create<JobsState>()(
  persist(
    (set, get) => ({
      jobs: [],
      totalCount: 0,
      selectedJob: null,
      loading: false,
      error: null,
      page: 1,
      limit: 10,
      sorting: "recent",
      filters: DEFAULT_FILTERS,
      recentlyViewed: [],
      recentSearches: [],
      savedSearches: [],
      popularSearches: ["React", "Go", "Kubernetes", "Fintech", "DevOps"],
      comparedJobIds: [],

      fetchJobs: async () => {
        set({ loading: true, error: null });
        try {
          const { filters, sorting, page, limit } = get();
          const { jobs, total } = await jobService.getJobs({
            filters,
            sorting,
            page,
            limit,
          });

          // Sync saved & applied status with bookmark and application stores
          const savedIds = new Set(
            useBookmarkStore.getState().savedJobs.map((s) => s.id),
          );
          const appliedIds = new Set(
            useApplicationStore
              .getState()
              .applications.filter((a) => a.status === "APPLIED")
              .map((a) => a.jobId)
              .filter(Boolean),
          );

          const syncedJobs = jobs.map((j) => ({
            ...j,
            isSaved: savedIds.has(j.id) || j.isSaved,
            isApplied: appliedIds.has(j.id) || j.isApplied,
          }));

          set({ jobs: syncedJobs, totalCount: total, loading: false });
        } catch (err) {
          set({
            error: (err as Error).message || "Failed to fetch jobs",
            loading: false,
          });
        }
      },

      selectJob: async (id) => {
        set({ loading: true });
        try {
          const job = await jobService.getJobById(id);
          if (job) {
            const isSaved = useBookmarkStore
              .getState()
              .savedJobs.some((s) => s.id === id);
            const isApplied = useApplicationStore
              .getState()
              .applications.some(
                (a) => a.jobId === id && a.status === "APPLIED",
              );
            const enrichedJob: Job = {
              ...job,
              isSaved: isSaved || job.isSaved,
              isApplied: isApplied || job.isApplied,
            };

            const currentRecent = get().recentlyViewed;
            const filteredRecent = currentRecent.filter((j) => j.id !== id);
            const updatedRecent = [enrichedJob, ...filteredRecent].slice(0, 10);

            set({
              selectedJob: enrichedJob,
              recentlyViewed: updatedRecent,
              loading: false,
            });
          } else {
            set({ selectedJob: null, loading: false });
          }
        } catch {
          set({ selectedJob: null, loading: false });
        }
      },

      updateFilters: (updates) => {
        set((state) => ({
          filters: { ...state.filters, ...updates },
          page: 1,
        }));
        get().fetchJobs();
      },

      resetFilters: () => {
        set({ filters: DEFAULT_FILTERS, page: 1 });
        get().fetchJobs();
      },

      setSorting: (sort) => {
        set({ sorting: sort, page: 1 });
        get().fetchJobs();
      },

      setPage: (p) => {
        set({ page: p });
        get().fetchJobs();
      },

      toggleSaveJob: (id) => {
        const targetJob =
          get().jobs.find((j) => j.id === id) ||
          (get().selectedJob?.id === id ? get().selectedJob : null);

        if (targetJob) {
          useBookmarkStore.getState().toggleSaveJob(targetJob);
        } else {
          set((state) => ({
            jobs: state.jobs.map((j) =>
              j.id === id ? { ...j, isSaved: !j.isSaved } : j,
            ),
            selectedJob:
              state.selectedJob?.id === id
                ? { ...state.selectedJob, isSaved: !state.selectedJob.isSaved }
                : state.selectedJob,
          }));
        }
      },

      setJobSaved: (id, isSaved) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, isSaved } : j)),
          selectedJob:
            state.selectedJob?.id === id
              ? { ...state.selectedJob, isSaved }
              : state.selectedJob,
        }));
      },

      setJobApplied: (id, isApplied) => {
        set((state) => ({
          jobs: state.jobs.map((j) => (j.id === id ? { ...j, isApplied } : j)),
          selectedJob:
            state.selectedJob?.id === id
              ? { ...state.selectedJob, isApplied }
              : state.selectedJob,
        }));
      },

      addRecentSearch: (query) => {
        if (!query.trim()) return;
        const current = get().recentSearches;
        const filtered = current.filter((q) => q !== query);
        const updated = [query, ...filtered].slice(0, 5);
        set({ recentSearches: updated });
      },

      saveSearch: (name) => {
        const filters = get().filters;
        const current = get().savedSearches;
        const newSaved = {
          id: `search_${Date.now()}`,
          name,
          filters: { ...filters },
        };
        set({ savedSearches: [newSaved, ...current] });
      },

      removeSavedSearch: (id) => {
        const current = get().savedSearches;
        set({ savedSearches: current.filter((s) => s.id !== id) });
      },

      loadSearches: () => {
        // Handled automatically by Zustand persist storage
      },

      // Phase 5 Actions
      loadJobs: async () => {
        await get().fetchJobs();
      },

      searchJobs: async (query) => {
        get().addRecentSearch(query);
        set((state) => ({
          filters: { ...state.filters, keyword: query },
          page: 1,
        }));
        await get().fetchJobs();
      },

      filterJobs: async (updates) => {
        set((state) => ({
          filters: { ...state.filters, ...updates },
          page: 1,
        }));
        await get().fetchJobs();
      },

      saveJob: async (id) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800)); // 800ms simulated delay
        const targetJob =
          get().jobs.find((j) => j.id === id) || get().selectedJob;
        if (targetJob) {
          const updated = {
            ...targetJob,
            isSaved: true,
            savedAt: new Date().toISOString(),
          };

          // Toggle save status locally
          set((state) => {
            const list = state.jobs.map((j) => (j.id === id ? updated : j));
            return {
              jobs: list,
              selectedJob:
                state.selectedJob?.id === id ? updated : state.selectedJob,
              loading: false,
            };
          });
        } else {
          set({ loading: false });
        }
      },

      unsaveJob: async (id) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const targetJob =
          get().jobs.find((j) => j.id === id) || get().selectedJob;
        if (targetJob) {
          const updated = { ...targetJob, isSaved: false, savedAt: undefined };

          set((state) => {
            const list = state.jobs.map((j) => (j.id === id ? updated : j));
            return {
              jobs: list,
              selectedJob:
                state.selectedJob?.id === id ? updated : state.selectedJob,
              loading: false,
            };
          });
        } else {
          set({ loading: false });
        }
      },

      compareJobs: (ids) => {
        set({ comparedJobIds: ids.slice(0, 3) });
      },

      loadCompany: async (id) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));
        const companyStore = useCompanyStore.getState();
        if (companyStore) {
          await companyStore.selectCompany(id);
        }
        set({ loading: false });
      },
    }),
    {
      name: "ai-career-agent-jobs-search-state-v3",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        page: state.page,
        sorting: state.sorting,
        filters: state.filters,
        recentSearches: state.recentSearches,
        savedSearches: state.savedSearches,
        comparedJobIds: state.comparedJobIds,
      }),
    },
  ),
);
