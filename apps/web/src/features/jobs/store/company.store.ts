"use client";

import { create } from "zustand";
import type { Company, Job, CompanyFilters } from "../types/jobs.types";
import { companyService } from "../services/company.service";

interface CompanyState {
  companies: Company[];
  totalCount: number;
  selectedCompany: Company | null;
  companyJobs: Job[];
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  sorting: "name" | "positions";
  filters: CompanyFilters;

  // Actions
  fetchCompanies: () => Promise<void>;
  selectCompany: (id: string) => Promise<void>;
  updateFilters: (updates: Partial<CompanyFilters>) => void;
  resetFilters: () => void;
  setSorting: (sort: "name" | "positions") => void;
  setPage: (p: number) => void;
}

const DEFAULT_FILTERS: CompanyFilters = {
  keyword: "",
  industry: "all",
  companySize: [],
  isActivelyHiring: null
};

export const useCompanyStore = create<CompanyState>((set, get) => ({
  companies: [],
  totalCount: 0,
  selectedCompany: null,
  companyJobs: [],
  loading: false,
  error: null,
  page: 1,
  limit: 9,
  sorting: "name",
  filters: DEFAULT_FILTERS,

  fetchCompanies: async () => {
    set({ loading: true, error: null });
    try {
      const { filters, sorting, page, limit } = get();
      const { companies, total } = await companyService.getCompanies({
        filters,
        sorting,
        page,
        limit
      });
      set({ companies, totalCount: total, loading: false });
    } catch (err) {
      set({ error: (err as Error).message || "Failed to fetch companies", loading: false });
    }
  },

  selectCompany: async (id) => {
    set({ loading: true, error: null });
    try {
      const [company, jobs] = await Promise.all([
        companyService.getCompanyById(id),
        companyService.getCompanyJobs(id)
      ]);
      set({ selectedCompany: company, companyJobs: jobs, loading: false });
    } catch (err) {
      set({ error: (err as Error).message || "Failed to load company details", loading: false });
    }
  },

  updateFilters: (updates) => {
    set((state) => ({
      filters: { ...state.filters, ...updates },
      page: 1
    }));
    get().fetchCompanies();
  },

  resetFilters: () => {
    set({ filters: DEFAULT_FILTERS, page: 1 });
    get().fetchCompanies();
  },

  setSorting: (sort) => {
    set({ sorting: sort, page: 1 });
    get().fetchCompanies();
  },

  setPage: (p) => {
    set({ page: p });
    get().fetchCompanies();
  }
}));
