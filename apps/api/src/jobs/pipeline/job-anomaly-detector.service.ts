import { Injectable } from "@nestjs/common";
import { SalaryPeriod } from "@prisma/client";
import {
  AnomalyDetectionResult,
  NormalizedJob,
} from "./types/job-pipeline.types";

@Injectable()
export class JobAnomalyDetectorService {
  detectAnomalies(job: NormalizedJob): AnomalyDetectionResult {
    const reasons: string[] = [];

    // 1. Inverted Salary Boundaries
    if (job.salaryMin !== undefined && job.salaryMax !== undefined) {
      if (job.salaryMin > job.salaryMax) {
        reasons.push(
          "Inverted salary range: minimum salary exceeds maximum salary.",
        );
      }
    }

    // 2. Statistical Outlier Boundaries by Period & Currency
    if (job.salaryMin !== undefined || job.salaryMax !== undefined) {
      const min = job.salaryMin || 0;
      const max = job.salaryMax || job.salaryMin || 0;

      if (job.salaryPeriod === SalaryPeriod.HOURLY) {
        // Hourly rate > $600/hr or > ₹50,000/hr is an extreme anomaly
        const threshold = job.currency === "INR" ? 50000 : 600;
        if (max > threshold) {
          reasons.push(
            `Abnormal hourly rate exceeding statistical maximum (${max} ${job.currency}/hr).`,
          );
        }
        if (min < 1) {
          reasons.push("Abnormal hourly rate near zero.");
        }
      } else if (job.salaryPeriod === SalaryPeriod.MONTHLY) {
        // Monthly > ₹50 Lakhs/month or > $150,000/month
        const threshold = job.currency === "INR" ? 5000000 : 150000;
        if (max > threshold) {
          reasons.push(
            `Abnormal monthly salary exceeding statistical bounds (${max} ${job.currency}/mo).`,
          );
        }
        if (min > 0 && min < (job.currency === "INR" ? 2000 : 100)) {
          reasons.push(
            "Abnormally low monthly wage below minimum labor floor.",
          );
        }
      } else {
        // Annual: In INR, > ₹10 Crores (100,000,000) or in USD > $2,000,000 is an extreme anomaly
        const threshold = job.currency === "INR" ? 100000000 : 2000000;
        if (max > threshold) {
          reasons.push(
            `Abnormal annual salary exceeding realistic market scale (${max} ${job.currency}/yr).`,
          );
        }
        if (min > 0 && min < (job.currency === "INR" ? 50000 : 5000)) {
          reasons.push("Abnormally low annual compensation.");
        }
      }

      // Check extreme ratio spread: e.g. min = 10,000, max = 1,000,000 (100x spread)
      if (min > 0 && max / min > 15) {
        reasons.push(
          `Unrealistic salary spread ratio (${Math.round(max / min)}x difference between min and max).`,
        );
      }
    }

    // 3. Experience Anomalies
    if (job.experienceMinYears !== undefined) {
      if (job.experienceMinYears < 0) {
        reasons.push("Negative experience requirements.");
      }
      if (job.experienceMinYears > 25) {
        reasons.push(
          `Abnormal experience requirement exceeding 25 years (${job.experienceMinYears} years).`,
        );
      }
    }

    if (
      job.experienceMinYears !== undefined &&
      job.experienceMaxYears !== undefined &&
      job.experienceMinYears > job.experienceMaxYears
    ) {
      reasons.push("Minimum experience exceeds maximum experience.");
    }

    // 4. Missing or Empty Identity Details
    if (job.companyName.length < 2) {
      reasons.push("Unidentifiable company name (less than 2 characters).");
    }

    if (job.title.length < 3) {
      reasons.push("Unidentifiable job title (less than 3 characters).");
    }

    return {
      isAnomaly: reasons.length > 0,
      anomalyReasons: reasons,
    };
  }
}
