import { mockCompanies, mockJobs } from "../mock/jobs-data";
import type { Company, Job, CompanyFilters } from "../types/jobs.types";

export const companyService = {
  /**
   * Retrieves all companies based on filters and pagination
   */
  async getCompanies(params: {
    filters: CompanyFilters;
    sorting: "name" | "positions";
    page: number;
    limit: number;
  }): Promise<{ companies: Company[]; total: number }> {
    let filtered = [...mockCompanies];
    const { filters } = params;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (c) => c.name.toLowerCase().includes(kw) ||
               c.industry.toLowerCase().includes(kw) ||
               c.cultureDescription.toLowerCase().includes(kw)
      );
    }

    if (filters.industry && filters.industry !== "all") {
      const ind = filters.industry.toLowerCase();
      filtered = filtered.filter((c) => c.industry.toLowerCase() === ind);
    }

    if (filters.companySize && filters.companySize.length > 0) {
      filtered = filtered.filter((c) => filters.companySize.includes(c.companySize));
    }

    if (filters.isActivelyHiring !== null) {
      filtered = filtered.filter((c) => c.isActivelyHiring === filters.isActivelyHiring);
    }

    // Sort companies
    if (params.sorting === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (params.sorting === "positions") {
      filtered.sort((a, b) => b.openPositionsCount - a.openPositionsCount);
    }

    const total = filtered.length;
    const offset = (params.page - 1) * params.limit;
    const paginated = filtered.slice(offset, offset + params.limit);

    // Artificial latency for loading transitions
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      companies: paginated,
      total
    };
  },

  /**
   * Retrieves single company by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const company = mockCompanies.find((c) => c.id === id);
    return company || null;
  },

  /**
   * Fetches all open job listings for a specific company
   */
  async getCompanyJobs(companyId: string): Promise<Job[]> {
    return mockJobs.filter((j) => j.companyId === companyId);
  },

  /**
   * Retrieves companies in similar industries
   */
  async getSimilarCompanies(companyId: string): Promise<Company[]> {
    const target = mockCompanies.find((c) => c.id === companyId);
    if (!target) return [];

    return mockCompanies
      .filter((c) => c.id !== companyId && c.industry.toLowerCase() === target.industry.toLowerCase())
      .slice(0, 3);
  }
};
