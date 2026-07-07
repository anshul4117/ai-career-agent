"use client";
 
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Job, JobFilters } from "../types/jobs.types";
import { jobService } from "../services/job.service";
 
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
 
  // Actions
  fetchJobs: () => Promise<void>;
  selectJob: (id: string) => Promise<void>;
  updateFilters: (updates: Partial<JobFilters>) => void;
  resetFilters: () => void;
  setSorting: (sort: "recent" | "match" | "salary_desc" | "salary_asc") => void;
  setPage: (p: number) => void;
  toggleSaveJob: (id: string) => void;
  addRecentSearch: (query: string) => void;
  saveSearch: (name: string) => void;
  removeSavedSearch: (id: string) => void;
  loadSearches: () => void;
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
 
      fetchJobs: async () => {
        set({ loading: true, error: null });
        try {
          const { filters, sorting, page, limit } = get();
          const { jobs, total } = await jobService.getJobs({
            filters,
            sorting,
            page,
            limit
          });
          set({ jobs, totalCount: total, loading: false });
        } catch (err) {
          set({ error: (err as Error).message || "Failed to fetch jobs", loading: false });
        }
      },
 
      selectJob: async (id) => {
        set({ loading: true });
        try {
          const job = await jobService.getJobById(id);
          if (job) {
            // Update recently viewed list, keeping up to 10 unique elements
            const currentRecent = get().recentlyViewed;
            const filteredRecent = currentRecent.filter((j) => j.id !== id);
            const updatedRecent = [job, ...filteredRecent].slice(0, 10);
 
            set({ 
              selectedJob: job, 
              recentlyViewed: updatedRecent, 
              loading: false 
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
          page: 1 // reset to first page on filters change
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
        // 1. Toggle in search results list
        const updatedJobs = get().jobs.map((j) => {
          if (j.id === id) {
            return { ...j, isSaved: !j.isSaved };
          }
          return j;
        });
 
        // 2. Toggle in active details selection
        const selected = get().selectedJob;
        const updatedSelected = selected && selected.id === id 
          ? { ...selected, isSaved: !selected.isSaved } 
          : selected;
 
        set({ jobs: updatedJobs, selectedJob: updatedSelected });
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
          filters: { ...filters }
        };
        set({ savedSearches: [newSaved, ...current] });
      },
 
      removeSavedSearch: (id) => {
        const current = get().savedSearches;
        set({ savedSearches: current.filter((s) => s.id !== id) });
      },
 
      loadSearches: () => {
        // Handled automatically by Zustand persist storage
      }
    }),
    {
      name: "ai-career-agent-jobs-search-state-v2",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        page: state.page,
        sorting: state.sorting,
        filters: state.filters,
        recentSearches: state.recentSearches,
        savedSearches: state.savedSearches,
      }),
    }
  )
);
