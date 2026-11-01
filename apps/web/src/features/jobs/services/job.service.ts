import { mockJobs, mockCompanies } from "../mock/jobs-data";
import type {
  Job,
  Company,
  JobFilters,
  RemoteType,
  EmploymentType,
  ExperienceLevel,
} from "../types/jobs.types";
import { useProfileStore } from "@/features/profile";
import { matchEngineService } from "./match-engine.service";
import { apiClient } from "@/lib/api-client";

export interface RawBackendJob {
  id: string;
  title: string;
  companyId?: string;
  company?: {
    id: string;
    name: string;
    logoUrl: string | null;
    websiteUrl: string | null;
    industry: string | null;
  };
  location?: string;
  workMode?: string;
  employmentType?: string;
  experienceMinYears?: number;
  salaryMin?: number | null;
  salaryMax?: number | null;
  currency?: string;
  skillsRequired?: string[];
  benefits?: string[];
  description?: string;
  responsibilities?: string[];
  requirements?: string[];
  postedAt?: string;
  expiresAt?: string | null;
  jobSources?: {
    source: string;
    sourceJobId?: string;
    sourceJobUrl?: string;
  }[];
  source?: string;
  primaryApplyUrl?: string;
  applyUrl?: string;
  validatedApplyUrl?: string;
  validationState?: string;
  verificationConfidence?: string;
  isIndiaJob?: boolean;
  qualityScore?: number;
  qualityBreakdown?: {
    freshness?: number;
  };
  isSaved?: boolean;
}

export function mapBackendJobToFrontendJob(raw: RawBackendJob): Job {
  const workModeStr = String(raw.workMode || "").toLowerCase();
  const remoteType: RemoteType = workModeStr.includes("remote")
    ? "remote"
    : workModeStr.includes("hybrid")
      ? "hybrid"
      : "onsite";

  const empTypeStr = String(raw.employmentType || "").toLowerCase();
  const employmentType: EmploymentType = empTypeStr.includes("part")
    ? "part-time"
    : empTypeStr.includes("contract")
      ? "contract"
      : empTypeStr.includes("intern")
        ? "internship"
        : "full-time";

  const expMin = raw.experienceMinYears;
  const experienceLevel: ExperienceLevel =
    expMin !== undefined && expMin >= 5
      ? "senior"
      : expMin !== undefined && expMin >= 2
        ? "mid"
        : "entry";

  const rawSource = String(
    raw.jobSources?.[0]?.source || raw.source || "manual",
  ).toLowerCase();
  const source: Job["source"] = rawSource.includes("wellfound")
    ? "wellfound"
    : rawSource.includes("yc") || rawSource.includes("ycombinator")
      ? "ycombinator"
      : rawSource.includes("greenhouse")
        ? "greenhouse"
        : "manual";

  return {
    id: raw.id,
    title: raw.title,
    companyId: raw.company?.id || raw.companyId || "co-default",
    companyInfo: {
      name: raw.company?.name || "Unknown Company",
      logoUrl: raw.company?.logoUrl || null,
      industry: raw.company?.industry || "Technology",
      website: raw.company?.websiteUrl || "",
    },
    location: raw.location || "Remote",
    remoteType,
    employmentType,
    salaryMin: raw.salaryMin ?? null,
    salaryMax: raw.salaryMax ?? null,
    currency: raw.currency || "INR",
    experienceLevel,
    skillsRequired: raw.skillsRequired || [],
    benefits: raw.benefits || [],
    description: raw.description || "",
    responsibilities: raw.responsibilities || [],
    requirements: raw.requirements || [],
    postedDate: raw.postedAt || new Date().toISOString(),
    expiryDate: raw.expiresAt || null,
    source,
    sourceJobId: raw.jobSources?.[0]?.sourceJobId || raw.id,
    externalApplyUrl:
      raw.validatedApplyUrl || raw.primaryApplyUrl || raw.applyUrl || "",
    trustScore: raw.qualityScore || 85,
    freshnessScore: raw.qualityBreakdown?.freshness
      ? Math.round((raw.qualityBreakdown.freshness / 15) * 100)
      : 90,
    isSaved: !!raw.isSaved,
    isApplied: false,
    viewedAt: null,
  };
}

export const jobService = {
  /**
   * Fetch similar jobs by checking overlapping tags
   */
  async getSimilarJobs(jobId: string): Promise<Job[]> {
    const all = await this.getAllJobs();
    const targetJob = all.find((j) => j.id === jobId);
    if (!targetJob) return [];

    return all
      .filter(
        (j) =>
          j.id !== jobId &&
          (j.title.toLowerCase() === targetJob.title.toLowerCase() ||
            j.skillsRequired.some((skill) =>
              targetJob.skillsRequired.includes(skill),
            )),
      )
      .slice(0, 3);
  },

  /**
   * Retrieves single job details by ID
   */
  async getJobById(id: string): Promise<Job | null> {
    try {
      const response = await apiClient.get<RawBackendJob>(`/jobs/${id}`);
      if (response && response.id) {
        return mapBackendJobToFrontendJob(response);
      }
    } catch {
      // API call failed
    }

    const allowMock =
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_ENABLE_MOCK_JOBS === "true";

    if (allowMock) {
      const job = mockJobs.find((j) => j.id === id);
      return job || null;
    }
    return null;
  },

  /**
   * Retrieves single company profile by ID
   */
  async getCompanyById(id: string): Promise<Company | null> {
    const allowMock =
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_ENABLE_MOCK_JOBS === "true";

    if (allowMock) {
      const company = mockCompanies.find((c) => c.id === id);
      return company || null;
    }
    return null;
  },

  /**
   * Retrieves all jobs in the database
   */
  async getAllJobs(): Promise<Job[]> {
    try {
      const response = await apiClient.get<{ items: RawBackendJob[] }>(
        "/jobs?limit=100",
      );
      if (response?.items && response.items.length > 0) {
        return response.items.map(mapBackendJobToFrontendJob);
      }
    } catch {
      // API call failed
    }

    const allowMock =
      process.env.NODE_ENV !== "production" &&
      process.env.NEXT_PUBLIC_ENABLE_MOCK_JOBS === "true";

    if (allowMock) {
      return [...mockJobs];
    }
    return [];
  },

  /**
   * Executes filter, sort, and pagination workflows on client-side collection
   */
  async getJobs(params: {
    filters: JobFilters;
    sorting: "recent" | "match" | "salary_desc" | "salary_asc";
    page: number;
    limit: number;
  }): Promise<{ jobs: Job[]; total: number }> {
    // 1. Filter jobs
    let filtered = await this.getAllJobs();
    const { filters } = params;

    if (filters.keyword) {
      const kw = filters.keyword.toLowerCase().trim();
      const isIntern =
        kw === "intern" || kw === "internship" || kw === "trainee";
      filtered = filtered.filter((j) => {
        if (isIntern) {
          return (
            j.employmentType === "internship" ||
            j.title.toLowerCase().includes("intern")
          );
        }
        const titleMatch = j.title.toLowerCase().includes(kw);
        const companyMatch = j.companyInfo.name.toLowerCase().includes(kw);
        const skillsMatch = j.skillsRequired.some((s) =>
          s.toLowerCase().includes(kw),
        );
        const empMatch = j.employmentType.toLowerCase().includes(kw);
        const kwLocAliases = [kw];
        if (
          kw === "ncr" ||
          kw.includes("delhi") ||
          kw === "noida" ||
          kw === "gurgaon" ||
          kw === "gurugram" ||
          kw === "newdelhi"
        ) {
          kwLocAliases.push(
            "ncr",
            "delhi",
            "new delhi",
            "noida",
            "gurgaon",
            "gurugram",
            "faridabad",
            "ghaziabad",
          );
        } else if (kw === "bangalore" || kw === "bengaluru") {
          kwLocAliases.push("bangalore", "bengaluru");
        } else if (kw === "mumbai" || kw === "bombay") {
          kwLocAliases.push("mumbai", "bombay", "navi mumbai", "thane");
        }
        const locationMatch = kwLocAliases.some((alias) =>
          j.location.toLowerCase().includes(alias),
        );

        // Word-boundary match for description so searching "intern" never matches "international"
        const wordRegex = new RegExp(
          `\\b${kw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
          "i",
        );
        const descMatch = wordRegex.test(j.description);

        return (
          titleMatch ||
          companyMatch ||
          skillsMatch ||
          empMatch ||
          descMatch ||
          locationMatch
        );
      });
    }

    if (filters.company) {
      const co = filters.company.toLowerCase();
      filtered = filtered.filter((j) =>
        j.companyInfo.name.toLowerCase().includes(co),
      );
    }

    if (filters.location) {
      const loc = filters.location.toLowerCase().trim();
      const locAliases = [loc];
      if (
        loc === "ncr" ||
        loc.includes("delhi") ||
        loc === "noida" ||
        loc === "gurgaon" ||
        loc === "gurugram" ||
        loc === "newdelhi"
      ) {
        locAliases.push(
          "ncr",
          "delhi",
          "new delhi",
          "noida",
          "gurgaon",
          "gurugram",
          "faridabad",
          "ghaziabad",
        );
      } else if (loc === "bangalore" || loc === "bengaluru") {
        locAliases.push("bangalore", "bengaluru");
      } else if (loc === "mumbai" || loc === "bombay") {
        locAliases.push("mumbai", "bombay", "navi mumbai", "thane");
      }
      filtered = filtered.filter((j) =>
        locAliases.some((alias) => j.location.toLowerCase().includes(alias)),
      );
    }

    if (filters.experienceLevel && filters.experienceLevel.length > 0) {
      filtered = filtered.filter((j) =>
        filters.experienceLevel.includes(j.experienceLevel),
      );
    }

    if (filters.remoteType && filters.remoteType.length > 0) {
      filtered = filtered.filter((j) =>
        filters.remoteType.includes(j.remoteType),
      );
    }

    if (filters.employmentType && filters.employmentType.length > 0) {
      filtered = filtered.filter((j) =>
        filters.employmentType.includes(j.employmentType),
      );
    }

    if (filters.salaryMin !== null) {
      const sMin = filters.salaryMin;
      filtered = filtered.filter(
        (j) => j.salaryMax !== null && j.salaryMax >= sMin,
      );
    }

    if (filters.skills && filters.skills.length > 0) {
      filtered = filtered.filter((j) =>
        filters.skills.some((skill) =>
          j.skillsRequired.some(
            (js) => js.toLowerCase() === skill.toLowerCase(),
          ),
        ),
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

    // Map AI match and quality scores dynamically based on the current candidate profile
    const profileState = useProfileStore.getState();
    const userProfile = profileState.profile;

    let jobsWithScores = filtered.map((job) => {
      const qualityScore = Math.round(
        job.freshnessScore * 0.4 + job.trustScore * 0.6,
      );
      let matchScore = 0;
      let missingSkillsCount = 0;
      if (userProfile) {
        const yearsOfExp = userProfile.career?.yearsOfExperience || 0;
        const report = matchEngineService.calculateOverallMatch(
          profileState.skills,
          profileState.education,
          profileState.preferences,
          yearsOfExp,
          job,
          qualityScore,
        );
        matchScore = report.overallScore;
        missingSkillsCount = report.skills.missing.length;
      } else {
        matchScore = Math.round(job.trustScore * 0.8);
      }
      return {
        ...job,
        computedMatchScore: matchScore,
        computedQualityScore: qualityScore,
        missingSkillsCount,
      };
    });

    // Apply filters.matchFilter
    if (filters.matchFilter && filters.matchFilter !== "all") {
      const filterMode = filters.matchFilter;
      jobsWithScores = jobsWithScores.filter((item) => {
        if (filterMode === "90") return item.computedMatchScore >= 90;
        if (filterMode === "80") return item.computedMatchScore >= 80;
        if (filterMode === "70") return item.computedMatchScore >= 70;
        if (filterMode === "high_match") return item.computedMatchScore >= 80;
        if (filterMode === "missing_skills")
          return item.missingSkillsCount <= 2;
        if (filterMode === "high_quality_match") {
          return (
            item.computedMatchScore >= 80 && item.computedQualityScore >= 80
          );
        }
        return true;
      });
    }

    const isIndiaJob = (j: Job) => {
      const loc = j.location.toLowerCase();
      return (
        loc.includes("india") ||
        loc.includes("bangalore") ||
        loc.includes("bengaluru") ||
        loc.includes("gurgaon") ||
        loc.includes("gurugram") ||
        loc.includes("mumbai") ||
        loc.includes("hyderabad") ||
        loc.includes("pune") ||
        loc.includes("noida") ||
        loc.includes("delhi") ||
        loc.includes("chennai")
      );
    };

    // 2. Sort jobs
    if (params.sorting === "recent") {
      jobsWithScores.sort((a, b) => {
        const aIndia = isIndiaJob(a);
        const bIndia = isIndiaJob(b);
        if (aIndia && !bIndia) return -1;
        if (!aIndia && bIndia) return 1;
        return (
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
        );
      });
    } else if (params.sorting === "salary_desc") {
      jobsWithScores.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
    } else if (params.sorting === "salary_asc") {
      jobsWithScores.sort((a, b) => (a.salaryMin || 0) - (b.salaryMin || 0));
    } else if (params.sorting === "match") {
      // Recommended: sort by highest match score, then highest quality score
      jobsWithScores.sort((a, b) => {
        if (b.computedMatchScore !== a.computedMatchScore) {
          return b.computedMatchScore - a.computedMatchScore;
        }
        return b.computedQualityScore - a.computedQualityScore;
      });
    }

    // 3. Paginate
    const total = jobsWithScores.length;
    const offset = (params.page - 1) * params.limit;
    const paginated = (jobsWithScores as Job[]).slice(
      offset,
      offset + params.limit,
    );

    // Artificial latency for visual loaders (200ms)
    await new Promise((resolve) => setTimeout(resolve, 200));

    return {
      jobs: paginated,
      total,
    };
  },
};
