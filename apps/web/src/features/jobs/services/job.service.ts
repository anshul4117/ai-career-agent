import { mockJobs, mockCompanies } from "../mock/jobs-data";
import type { Job, Company, JobFilters } from "../types/jobs.types";

export const jobService = {
  /**
   * Fetch similar jobs by checking overlapping tags
   */
  async getSimilarJobs(jobId: string): Promise<Job[]> {
    const targetJob = mockJobs.find((j) => j.id === jobId);
    if (!targetJob) return [];

    return mockJobs
      .filter((j) => j.id !== jobId && (
        j.title.toLowerCase() === targetJob.title.toLowerCase() ||
        j.skillsRequired.some((skill) => targetJob.skillsRequired.includes(skill))
      ))
      .slice(0, 3);
  },

  /**
   * Retrieves single job details by ID
   */
  async getJobById(id: string): Promise<Job | null> {
    const job = mockJobs.find((j) => j.id === id);
    return job || null;
  },

  /**
   * Retrieves single company profile by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const company = mockCompanies.find((c) => c.id === id);
    return company || null;
  },
 
  /**
   * Retrieves all jobs in the database
   */
  async getAllJobs(): Promise<Job[]> {
    return [...mockJobs];
  },

  /**
   * Executes filter, sort, and pagination workflows on client-side mock collection
   */
  async getJobs(params: {
    filters: JobFilters;
    sorting: "recent" | "match" | "salary_desc" | "salary_asc";
    page: number;
    limit: number;
  }): Promise<{ jobs: Job[]; total: number }> {
    // 1. Filter jobs
    let filtered = [...mockJobs];
    const { filters } = params;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase();
      filtered = filtered.filter(
        (j) => j.title.toLowerCase().includes(kw) ||
               j.description.toLowerCase().includes(kw) ||
               j.skillsRequired.some((s) => s.toLowerCase().includes(kw))
      );
    }

    if (filters.company) {
      const co = filters.company.toLowerCase();
      filtered = filtered.filter((j) => j.companyInfo.name.toLowerCase().includes(co));
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase();
      filtered = filtered.filter((j) => j.location.toLowerCase().includes(loc));
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filtered = filtered.filter((j) => filters.experienceLevel.includes(j.experienceLevel));
    }

    if (filters.remoteType && filters.remoteType.length > 0) {
      filtered = filtered.filter((j) => filters.remoteType.includes(j.remoteType));
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      filtered = filtered.filter((j) => filters.employmentType.includes(j.employmentType));
    }

    if (filters.salaryMin !== null) {
      const sMin = filters.salaryMin;
      filtered = filtered.filter((j) => j.salaryMax !== null && j.salaryMax >= sMin);
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((j) =>
        filters.skills.some((skill) => j.skillsRequired.some(js => js.toLowerCase() === skill.toLowerCase()))
      );
    }

    if (filters.industry) {
      const ind = filters.industry.toLowerCase();
      filtered = filtered.filter((j) => {
        const company = mockCompanies.find((c) => c.id === j.companyId);
        return company ? company.industry.toLowerCase().includes(ind) : false;
      });
    }

    if (filters.datePosted && filters.datePosted !== "any") {
      const now = Date.now();
      const dayMs = 24 * 60 * 60 * 1000;
      filtered = filtered.filter((j) => {
        const postedTime = new Date(j.postedDate).getTime();
        const ageMs = now - postedTime;
        if (filters.datePosted === "24h") return ageMs <= dayMs;
        if (filters.datePosted === "week") return ageMs <= 7 * dayMs;
        if (filters.datePosted === "month") return ageMs <= 30 * dayMs;
        return true;
      });
    }

    if (filters.easyApply) {
      filtered = filtered.filter((j) => !!j.easyApply);
    }

    if (filters.matchScoreMin !== null) {
      const minScore = filters.matchScoreMin;
      filtered = filtered.filter((j) => j.trustScore >= minScore);
    }

    // 2. Sort jobs
    if (params.sorting === "recent") {
      filtered.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    } else if (params.sorting === "salary_desc") {
      filtered.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (params.sorting === "salary_asc") {
      filtered.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else if (params.sorting === "match") {
      filtered.sort((a, b) => (b.trustScore || 0) - (a.trustScore || 0));
    }

    // 3. Paginate
    const total = filtered.length;
    const offset = (params.page - 1) * params.limit;
    const paginated = filtered.slice(offset, offset + params.limit);

    // Artificial latency for visual loaders (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      jobs: paginated,
      total
    };
  }
};
