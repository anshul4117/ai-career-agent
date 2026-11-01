import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AtsDetectorService } from "./ats-detector.service";
import { AtsType, CompanyType } from "@prisma/client";

export interface DiscoveredCompanyItem {
  name: string;
  domain?: string | null;
  companySlug: string;
  atsType: AtsType;
  atsSlug?: string | null;
  jobCount?: number;
  verified: boolean;
  status: "CREATED_NEW" | "UPDATED_EXISTING" | "UNVERIFIED";
}

export interface DiscoverySummary {
  totalJobsScanned: number;
  totalCompaniesScanned: number;
  newlyDiscoveredAts: number;
  newlyCreatedCompanies: number;
  verifiedAtsCount: number;
  companies: DiscoveredCompanyItem[];
}

@Injectable()
export class CompanyDiscoveryService {
  private readonly logger = new Logger(CompanyDiscoveryService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly atsDetector: AtsDetectorService,
  ) {}

  /**
   * Discovers companies and ATS profiles from existing job records and registry.
   * Discovered companies not currently in registry are created as UNKNOWN_REVIEW.
   */
  async runDiscovery(): Promise<DiscoverySummary> {
    this.logger.log(
      "Starting company ATS discovery from job records and registry...",
    );

    const summary: DiscoverySummary = {
      totalJobsScanned: 0,
      totalCompaniesScanned: 0,
      newlyDiscoveredAts: 0,
      newlyCreatedCompanies: 0,
      verifiedAtsCount: 0,
      companies: [],
    };

    // 1. Scan job records for ATS URLs not in the registry
    const jobsWithApplyUrls = await this.prisma.job.findMany({
      where: {
        applyUrl: { not: null },
      },
      select: {
        applyUrl: true,
      },
      distinct: ["applyUrl"],
    });

    summary.totalJobsScanned = jobsWithApplyUrls.length;

    const seenSlugs = new Set<string>();

    for (const job of jobsWithApplyUrls) {
      if (!job.applyUrl) continue;
      const patternMatch = this.atsDetector.detectFromUrlPattern(job.applyUrl);
      if (!patternMatch || !patternMatch.atsSlug) continue;

      const slug = patternMatch.atsSlug.toLowerCase();
      if (seenSlugs.has(slug)) continue;
      seenSlugs.add(slug);

      // Check if already in registry by atsSlug or companySlug
      const existing = await this.prisma.company.findFirst({
        where: {
          OR: [{ atsSlug: slug }, { companySlug: slug }],
        },
      });

      if (!existing) {
        // Discovered an unregistered company from job applyUrl!
        const validation = await this.atsDetector.validatePublicEndpoint(
          patternMatch.atsType,
          slug,
        );

        const companyName = this.formatCompanyNameFromSlug(slug);

        const newCompany = await this.prisma.company.create({
          data: {
            name: companyName,
            companySlug: slug,
            careerUrl: validation.sampleApplyUrl || job.applyUrl,
            careerPageUrl: validation.sampleApplyUrl || job.applyUrl,
            companyType: CompanyType.UNKNOWN_REVIEW,
            atsType: patternMatch.atsType,
            atsSlug: slug,
            verified: validation.ok,
            lastCheckedAt: new Date(),
          },
        });

        summary.newlyCreatedCompanies++;
        if (validation.ok) {
          summary.newlyDiscoveredAts++;
          summary.verifiedAtsCount++;
        }

        summary.companies.push({
          name: newCompany.name,
          companySlug: newCompany.companySlug,
          domain: newCompany.domain,
          atsType: newCompany.atsType,
          atsSlug: newCompany.atsSlug,
          jobCount: validation.jobCount,
          verified: newCompany.verified,
          status: "CREATED_NEW",
        });

        this.logger.log(
          `Discovered new company [${newCompany.name}] from jobs: ATS ${patternMatch.atsType} (${slug}) (verified: ${validation.ok})`,
        );
      }
    }

    // 2. Scan existing unverified companies in the registry
    const unverifiedCompanies = await this.prisma.company.findMany({
      where: {
        OR: [{ atsType: AtsType.NONE }, { verified: false }],
      },
      include: {
        jobs: {
          select: { applyUrl: true },
          take: 5,
        },
      },
    });

    summary.totalCompaniesScanned = unverifiedCompanies.length;

    for (const comp of unverifiedCompanies) {
      const candidateUrls = [
        comp.careerUrl,
        comp.careerPageUrl,
        ...comp.jobs.map((j) => j.applyUrl),
        comp.websiteUrl,
      ].filter(Boolean) as string[];

      let detected = false;

      for (const targetUrl of candidateUrls) {
        const result = await this.atsDetector.detectAndValidate(targetUrl);

        if (result.atsType !== AtsType.NONE && result.endpointOk) {
          await this.prisma.company.update({
            where: { id: comp.id },
            data: {
              atsType: result.atsType,
              atsSlug: result.atsSlug,
              careerUrl: result.sampleApplyUrl || targetUrl,
              verified: true,
              lastCheckedAt: new Date(),
            },
          });

          summary.newlyDiscoveredAts++;
          summary.verifiedAtsCount++;
          summary.companies.push({
            name: comp.name,
            companySlug: comp.companySlug,
            domain: comp.domain,
            atsType: result.atsType,
            atsSlug: result.atsSlug,
            jobCount: result.jobCount,
            verified: true,
            status: "UPDATED_EXISTING",
          });

          this.logger.log(
            `Discovered & verified ATS for existing [${comp.name}]: ${result.atsType} (${result.atsSlug}) with ${result.jobCount} live jobs.`,
          );
          detected = true;
          break;
        }
      }

      if (!detected) {
        summary.companies.push({
          name: comp.name,
          companySlug: comp.companySlug,
          domain: comp.domain,
          atsType: comp.atsType,
          atsSlug: comp.atsSlug,
          verified: comp.verified,
          status: "UNVERIFIED",
        });
      }
    }

    this.logger.log(
      `Discovery complete. Jobs scanned: ${summary.totalJobsScanned}, Unverified companies scanned: ${summary.totalCompaniesScanned}, Newly created: ${summary.newlyCreatedCompanies}, Newly verified ATS: ${summary.newlyDiscoveredAts}`,
    );

    return summary;
  }

  private formatCompanyNameFromSlug(slug: string): string {
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }
}
