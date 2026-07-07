export type RemoteType = "remote" | "hybrid" | "onsite";
export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";
export type ExperienceLevel = "entry" | "mid" | "senior" | "lead";

export interface JobCompanyInfo {
  name: string;
  logoUrl: string | null;
  industry: string;
  website: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyInfo: JobCompanyInfo;
  location: string;
  remoteType: RemoteType;
  employmentType: EmploymentType;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  experienceLevel: ExperienceLevel;
  skillsRequired: string[];
  benefits: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
  expiryDate: string | null;
  source: "wellfound" | "ycombinator" | "greenhouse" | "manual";
  sourceJobId: string;
  externalApplyUrl: string;
  trustScore: number;
  freshnessScore: number;
  matchScore?: number;
  isSaved: boolean;
  savedAt?: string;
  isApplied: boolean;
  viewedAt: string | null;
  easyApply?: boolean;
}

export type FundingStage = "seed" | "series-a" | "series-b" | "series-c" | "ipo" | "bootstrapped";

export interface CompanySocials {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string;
  industry: string;
  fundingStage: FundingStage;
  companySize: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  headquarters: string;
  techStack: string[];
  cultureDescription: string;
  benefitsList: string[];
  isActivelyHiring: boolean;
  socialLinks: CompanySocials;
  openPositionsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface JobFilters {
  keyword: string;
  company: string;
  location: string;
  experienceLevel: ExperienceLevel[];
  remoteType: RemoteType[];
  employmentType: EmploymentType[];
  salaryMin: number | null;
  skills: string[];
  industry: string;
  datePosted: "any" | "24h" | "week" | "month";
  easyApply: boolean;
  matchScoreMin: number | null;
}

export interface CompanyFilters {
  keyword: string;
  industry: string;
  companySize: string[];
  isActivelyHiring: boolean | null;
}
