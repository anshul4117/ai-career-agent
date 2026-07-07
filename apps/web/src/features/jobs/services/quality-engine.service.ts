import type { Job } from "../types/jobs.types";
 
export interface DuplicateResult {
  status: "Unique" | "Possible Duplicate" | "Duplicate";
  score: number;
  reason: string;
}
 
export interface FreshnessResult {
  score: number; // 0 to 100
  label: string;  // e.g. "95%", "Expired"
  category: "Today" | "1-3 Days" | "4-7 Days" | "8-14 Days" | "15-30 Days" | "30+ Days";
}
 
export interface TrustFactorEvaluation {
  name: string;
  description: string;
  met: boolean;
}
 
export interface TrustResult {
  score: number; // 0 to 100
  label: "Low" | "Medium" | "High" | "Verified";
  factors: TrustFactorEvaluation[];
}
 
export interface OverallQualityResult {
  score: number; // 0 to 100
  label: "Excellent" | "Very Good" | "Good" | "Average" | "Poor";
}
 
export const qualityEngineService = {
  /**
   * Evaluates duplicate probability by scanning company name, title, location, type, salary, and external ID.
   */
  calculateDuplicate(job: Job, allJobs: Job[]): DuplicateResult {
    // Exclude the current job itself
    const otherJobs = allJobs.filter((j) => j.id !== job.id);
 
    // 1. Direct External Job ID Overlap
    const exactIdMatch = otherJobs.find((j) => j.sourceJobId && j.sourceJobId === job.sourceJobId);
    if (exactIdMatch) {
      return {
        status: "Duplicate",
        score: 100,
        reason: `Matches external posting ID (${job.sourceJobId}) from ${exactIdMatch.companyInfo.name}.`
      };
    }
 
    // 2. Exact Metadata Overlap
    const exactMetaMatch = otherJobs.find((j) => 
      j.companyInfo.name.toLowerCase() === job.companyInfo.name.toLowerCase() &&
      j.title.toLowerCase() === job.title.toLowerCase() &&
      j.location.toLowerCase() === job.location.toLowerCase() &&
      j.employmentType === job.employmentType
    );
 
    if (exactMetaMatch) {
      return {
        status: "Duplicate",
        score: 95,
        reason: "Identical company title, job role, location, and employment type found."
      };
    }
 
    // 3. Partial / Possible Overlap
    const possibleMatch = otherJobs.find((j) => 
      j.companyInfo.name.toLowerCase() === job.companyInfo.name.toLowerCase() &&
      j.title.toLowerCase() === job.title.toLowerCase()
    );
 
    if (possibleMatch) {
      const locationDiff = possibleMatch.location.toLowerCase() !== job.location.toLowerCase();
      const salaryDiff = possibleMatch.salaryMin !== job.salaryMin || possibleMatch.salaryMax !== job.salaryMax;
      
      let diffReason = "";
      if (locationDiff && salaryDiff) diffReason = "location and salary details differ";
      else if (locationDiff) diffReason = "geographic location differs";
      else if (salaryDiff) diffReason = "compensation rates differ";
 
      return {
        status: "Possible Duplicate",
        score: 50,
        reason: `Matches company and job title with ${possibleMatch.location} posting, but ${diffReason}.`
      };
    }
 
    // 4. Safe / Unique listing
    return {
      status: "Unique",
      score: 0,
      reason: "No matching company title metadata duplicates detected in active scanner index."
    };
  },
 
  /**
   * Calculates post freshness based on elapsed days since creation date
   */
  calculateFreshness(job: Job): FreshnessResult {
    const postedTime = new Date(job.postedDate).getTime();
    const ageMs = Date.now() - postedTime;
    const dayMs = 24 * 60 * 60 * 1000;
    const ageDays = ageMs / dayMs;
 
    if (ageDays < 1) {
      return { score: 95, label: "95%", category: "Today" };
    } else if (ageDays <= 3) {
      return { score: 80, label: "80%", category: "1-3 Days" };
    } else if (ageDays <= 7) {
      return { score: 60, label: "60%", category: "4-7 Days" };
    } else if (ageDays <= 14) {
      return { score: 40, label: "40%", category: "8-14 Days" };
    } else if (ageDays <= 30) {
      return { score: 20, label: "20%", category: "15-30 Days" };
    } else {
      return { score: 0, label: "Expired", category: "30+ Days" };
    }
  },
 
  /**
   * Computes trust score by looking at provider authenticity and complete parameters
   */
  calculateTrust(job: Job): TrustResult {
    const factors: TrustFactorEvaluation[] = [
      {
        name: "Official Company Website",
        description: "Listing provides a direct link to the company's verified website.",
        met: !!job.companyInfo.website && job.companyInfo.website.startsWith("http")
      },
      {
        name: "Verified Provider Source",
        description: "Ingested from a reputable board such as Y Combinator or Greenhouse.",
        met: job.source === "wellfound" || job.source === "ycombinator" || job.source === "greenhouse"
      },
      {
        name: "Indexed Job Board",
        description: "Scanned from known aggregators rather than manually submitted.",
        met: job.source !== "manual"
      },
      {
        name: "Salary Disclosed",
        description: "Transparency in salary structure and compensation guidelines.",
        met: job.salaryMin !== null || job.salaryMax !== null
      },
      {
        name: "Company Logo Available",
        description: "Listing includes an authorized corporate brand asset logo.",
        met: !!job.companyInfo.logoUrl && job.companyInfo.logoUrl.length > 5
      },
      {
        name: "Detailed Job Specifications",
        description: "Description contains rich information outlining expectations (> 150 chars).",
        met: !!job.description && job.description.length > 150
      },
      {
        name: "Secure Application Portal",
        description: "Routes users to secure external application pages.",
        met: !!job.externalApplyUrl && job.externalApplyUrl.startsWith("https")
      },
      {
        name: "Verified Hiring Partner",
        description: "Company represents an actively managed account or easy-apply partner.",
        met: job.easyApply === true || job.trustScore >= 85
      }
    ];
 
    const metCount = factors.filter((f) => f.met).length;
    const score = Math.round((metCount / factors.length) * 100);
 
    let label: "Low" | "Medium" | "High" | "Verified";
    if (metCount <= 2) label = "Low";
    else if (metCount <= 4) label = "Medium";
    else if (metCount <= 6) label = "High";
    else label = "Verified";
 
    return {
      score,
      label,
      factors
    };
  },
 
  /**
   * Merges all factors to produce a unified quality score grade.
   */
  calculateOverallQuality(
    duplicateStatus: "Unique" | "Possible Duplicate" | "Duplicate",
    freshnessScore: number,
    trustScore: number
  ): OverallQualityResult {
    // If it's a confirmed duplicate, penalty caps the quality score at Poor.
    if (duplicateStatus === "Duplicate") {
      return { score: 15, label: "Poor" };
    }
 
    let baseScore = (freshnessScore * 0.4) + (trustScore * 0.6);
 
    // Possible duplicate applies a 20% penalty
    if (duplicateStatus === "Possible Duplicate") {
      baseScore = baseScore * 0.8;
    }
 
    const score = Math.round(baseScore);
 
    let label: "Excellent" | "Very Good" | "Good" | "Average" | "Poor";
    if (score >= 85) label = "Excellent";
    else if (score >= 70) label = "Very Good";
    else if (score >= 50) label = "Good";
    else if (score >= 30) label = "Average";
    else label = "Poor";
 
    return {
      score,
      label
    };
  }
};
