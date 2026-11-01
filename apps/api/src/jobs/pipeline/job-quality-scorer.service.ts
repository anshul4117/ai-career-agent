import { Injectable } from "@nestjs/common";
import {
  NormalizedJob,
  QualityBreakdown,
  QualityScoreResult,
} from "./types/job-pipeline.types";

@Injectable()
export class JobQualityScorerService {
  calculateQuality(job: NormalizedJob): QualityScoreResult {
    const descriptionCompleteness = this.scoreDescriptionCompleteness(job);
    const companyCredibility = this.scoreCompanyCredibility(job);
    const applyLinkValidity = this.scoreApplyLinkValidity(job);
    const salaryTransparency = this.scoreSalaryTransparency(job);
    const skillsClarity = this.scoreSkillsClarity(job);
    const freshness = this.scoreFreshness(job);

    const qualityScore = Math.min(
      100,
      descriptionCompleteness +
        companyCredibility +
        applyLinkValidity +
        salaryTransparency +
        skillsClarity +
        freshness,
    );

    const breakdown: QualityBreakdown = {
      descriptionCompleteness,
      companyCredibility,
      applyLinkValidity,
      salaryTransparency,
      skillsClarity,
      freshness,
    };

    return {
      qualityScore,
      breakdown,
    };
  }

  // 1. Description Completeness (Max 25 pts)
  private scoreDescriptionCompleteness(job: NormalizedJob): number {
    let score = 0;
    const words = job.description.trim().split(/\s+/).filter(Boolean);

    // Word count (up to 15 pts)
    if (words.length >= 200) {
      score += 15;
    } else if (words.length >= 100) {
      score += 8;
    } else if (words.length >= 40) {
      score += 4;
    }

    // Explicit structural sections (up to 10 pts)
    if (job.responsibilities && job.responsibilities.length >= 2) {
      score += 5;
    }
    if (job.requirements && job.requirements.length >= 2) {
      score += 5;
    }

    return score;
  }

  // 2. Company Credibility (Max 20 pts)
  private scoreCompanyCredibility(job: NormalizedJob): number {
    let score = 0;

    // Company Name validity (5 pts)
    if (
      job.companyName &&
      job.companyName.length >= 3 &&
      !job.companyName.toLowerCase().includes("unknown")
    ) {
      score += 5;
    }

    // Company Website (10 pts)
    if (job.companyWebsite && job.companyWebsite.startsWith("http")) {
      score += 10;
    }

    // Company Logo (5 pts)
    if (job.companyLogo && job.companyLogo.startsWith("http")) {
      score += 5;
    }

    return score;
  }

  // 3. Apply Link Validity (Max 15 pts)
  private scoreApplyLinkValidity(job: NormalizedJob): number {
    let score = 0;
    const url = job.applyUrl || "";

    if (url.startsWith("https://")) {
      score += 10;
    } else if (url.startsWith("http://")) {
      score += 5;
    }

    // Reputable or direct domains (5 pts)
    const lower = url.toLowerCase();
    if (
      lower.includes("greenhouse.io") ||
      lower.includes("lever.co") ||
      lower.includes("workday.com") ||
      lower.includes("smartrecruiters.com") ||
      lower.includes("ashbyhq.com") ||
      (job.companyWebsite &&
        lower.includes(this.extractHostname(job.companyWebsite)))
    ) {
      score += 5;
    }

    return score;
  }

  // 4. Salary Transparency (Max 10 pts)
  private scoreSalaryTransparency(job: NormalizedJob): number {
    if (
      job.salaryMin !== undefined &&
      job.salaryMax !== undefined &&
      job.salaryMin > 0
    ) {
      return 10; // Full transparency: both min & max
    }
    if (job.salaryMin !== undefined || job.salaryMax !== undefined) {
      return 5; // Partial transparency
    }
    return 0; // Undisclosed
  }

  // 5. Skills Clarity (Max 15 pts)
  private scoreSkillsClarity(job: NormalizedJob): number {
    const count = job.skillsRequired?.length || 0;
    if (count >= 4) return 15;
    if (count >= 2) return 10;
    if (count >= 1) return 5;
    return 0;
  }

  // 6. Freshness (Max 15 pts)
  private scoreFreshness(job: NormalizedJob): number {
    const now = Date.now();
    const postedTime = new Date(job.postedAt).getTime();
    const diffHours = Math.max(0, (now - postedTime) / (1000 * 60 * 60));

    if (diffHours <= 24) return 15; // Past 24 hours
    if (diffHours <= 24 * 7) return 12; // Past week
    if (diffHours <= 24 * 14) return 8; // Past 2 weeks
    if (diffHours <= 24 * 30) return 4; // Past month
    return 1; // Older than a month
  }

  private extractHostname(url: string): string {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return "";
    }
  }
}
