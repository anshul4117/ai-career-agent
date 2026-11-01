import {
  EmploymentType,
  WorkMode,
  SalaryPeriod,
  LocationSource,
  LocationConfidence,
} from "@prisma/client";

export interface RawJobInput {
  externalId: string;
  source: string;
  title: string;
  companyName: string;
  companyWebsite?: string;
  companyLogo?: string;
  location?: string;
  rawLocation?: string;
  city?: string;
  state?: string;
  queriedCity?: string;
  locationSource?: LocationSource;
  locationConfidence?: LocationConfidence;
  workMode?: string | WorkMode;
  employmentType?: string | EmploymentType;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryPeriod?: string | SalaryPeriod;
  description: string;
  applyUrl: string;
  applyLinkStatus?: string;
  postedAt?: Date | string;
  skillsRaw?: string[];
}

export interface NormalizedJob {
  externalId: string;
  source: string;
  title: string;
  jobSlug: string;
  companyName: string;
  companySlug: string;
  companyWebsite?: string;
  companyLogo?: string;
  location: string;
  rawLocation: string;
  city: string | null;
  state: string | null;
  queriedCity: string | null;
  locationSource: LocationSource;
  locationConfidence: LocationConfidence;
  workMode: WorkMode;
  employmentType: EmploymentType;
  experienceMinYears?: number;
  experienceMaxYears?: number;
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  salaryPeriod: SalaryPeriod;
  description: string;
  applyUrl: string;
  applyLinkStatus?: string;
  postedAt: Date;
  skillsRequired: string[];
  responsibilities: string[];
  requirements: string[];
  benefits: string[];
  fingerprint: string;
  isIndiaJob: boolean;
  isIndiaEligible: boolean;
  indiaEligibilityReason: string;
}

export interface SpamDetectionResult {
  isSpam: boolean;
  spamScore: number; // 0.0 - 1.0
  reasons: string[];
}

export interface AnomalyDetectionResult {
  isAnomaly: boolean;
  anomalyReasons: string[];
}

export interface QualityBreakdown {
  descriptionCompleteness: number; // 0 - 25
  companyCredibility: number; // 0 - 20
  applyLinkValidity: number; // 0 - 15
  salaryTransparency: number; // 0 - 10
  skillsClarity: number; // 0 - 15
  freshness: number; // 0 - 15
}

export interface QualityScoreResult {
  qualityScore: number; // 0 - 100
  breakdown: QualityBreakdown;
}

export interface DuplicateDetectionResult {
  isDuplicate: boolean;
  duplicateOfJobId?: string;
  similarityScore: number;
}

export interface PipelineProcessedJob {
  normalized: NormalizedJob;
  duplicate: DuplicateDetectionResult;
  spam: SpamDetectionResult;
  anomaly: AnomalyDetectionResult;
  quality: QualityScoreResult;
  urlValidation?: {
    validationState: string;
    verificationConfidence: string;
    validatedApplyUrl?: string;
    isAtsPortal: boolean;
  };
  status: "APPROVED" | "FLAGGED_SPAM" | "FLAGGED_ANOMALY" | "DUPLICATE";
}
