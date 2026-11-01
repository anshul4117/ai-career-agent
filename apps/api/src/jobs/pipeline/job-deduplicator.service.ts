import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import {
  DuplicateDetectionResult,
  NormalizedJob,
} from "./types/job-pipeline.types";

@Injectable()
export class JobDeduplicatorService {
  constructor(private readonly prisma: PrismaService) {}

  async checkDuplicate(
    normalizedJob: NormalizedJob,
  ): Promise<DuplicateDetectionResult> {
    // 1. Exact Fingerprint Lookup (Fastest, O(1) indexed)
    if (normalizedJob.fingerprint) {
      const exactMatch = await this.prisma.job.findFirst({
        where: {
          fingerprint: normalizedJob.fingerprint,
          NOT: { jobSlug: normalizedJob.jobSlug },
        },
        select: { id: true },
      });

      if (exactMatch) {
        return {
          isDuplicate: true,
          duplicateOfJobId: exactMatch.id,
          similarityScore: 1.0,
        };
      }
    }

    // 2. Exact Title + Same Company Slug Lookup
    const company = await this.prisma.company.findFirst({
      where: { companySlug: normalizedJob.companySlug },
      select: { id: true },
    });

    if (company) {
      const sameCompanyJobs = await this.prisma.job.findMany({
        where: {
          companyId: company.id,
          isActive: true,
          NOT: { jobSlug: normalizedJob.jobSlug },
        },
        select: { id: true, title: true, description: true },
        take: 20,
      });

      for (const existingJob of sameCompanyJobs) {
        const titleSim = this.computeJaccardSimilarity(
          normalizedJob.title,
          existingJob.title,
        );
        if (titleSim >= 0.85) {
          const descSim = this.computeJaccardSimilarity(
            normalizedJob.description.substring(0, 500),
            existingJob.description.substring(0, 500),
          );

          if (descSim >= 0.7) {
            return {
              isDuplicate: true,
              duplicateOfJobId: existingJob.id,
              similarityScore: (titleSim + descSim) / 2,
            };
          }
        }
      }
    }

    return {
      isDuplicate: false,
      similarityScore: 0.0,
    };
  }

  computeJaccardSimilarity(str1: string, str2: string): number {
    const set1 = new Set(this.tokenize(str1));
    const set2 = new Set(this.tokenize(str2));

    if (set1.size === 0 && set2.size === 0) return 1.0;
    if (set1.size === 0 || set2.size === 0) return 0.0;

    let intersectionCount = 0;
    for (const token of set1) {
      if (set2.has(token)) {
        intersectionCount++;
      }
    }

    const unionCount = set1.size + set2.size - intersectionCount;
    return unionCount === 0 ? 0.0 : intersectionCount / unionCount;
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w.length > 2);
  }
}
