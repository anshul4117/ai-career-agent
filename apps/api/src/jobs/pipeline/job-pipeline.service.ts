import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { JobNormalizerService } from "./job-normalizer.service";
import { JobDeduplicatorService } from "./job-deduplicator.service";
import { JobSpamDetectorService } from "./job-spam-detector.service";
import { JobAnomalyDetectorService } from "./job-anomaly-detector.service";
import { JobQualityScorerService } from "./job-quality-scorer.service";
import { JobUrlValidatorService } from "./job-url-validator.service";
import { SourceRegistryService } from "./sources/source-registry.service";
import {
  GreenhouseSourceAdapter,
  LeverSourceAdapter,
  AshbySourceAdapter,
  SmartRecruitersSourceAdapter,
  WorkableSourceAdapter,
  RemotiveSourceAdapter,
  RemoteOKSourceAdapter,
  AdzunaSourceAdapter,
  JSearchSourceAdapter,
  JoobleSourceAdapter,
  CareerjetSourceAdapter,
} from "./sources/adapters";
import { rawJobToRawJobInput } from "./sources/job-source.interface";
import { PipelineProcessedJob, RawJobInput } from "./types/job-pipeline.types";
import {
  JobSourcePlatform,
  Prisma,
  UrlValidationState,
  VerificationConfidence,
} from "@prisma/client";

export interface PipelineExecutionSummary {
  totalIngested: number;
  approvedCount: number;
  duplicateCount: number;
  spamCount: number;
  anomalyCount: number;
  newCount: number;
  updatedCount: number;
  rejectedCount: number;
  durationMs: number;
  jobs: {
    id: string;
    title: string;
    company: string;
    qualityScore: number;
    status: string;
  }[];
}

@Injectable()
export class JobPipelineService implements OnModuleInit {
  private readonly logger = new Logger(JobPipelineService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly normalizer: JobNormalizerService,
    private readonly deduplicator: JobDeduplicatorService,
    private readonly spamDetector: JobSpamDetectorService,
    private readonly anomalyDetector: JobAnomalyDetectorService,
    private readonly qualityScorer: JobQualityScorerService,
    private readonly urlValidator: JobUrlValidatorService,
    private readonly sourceRegistry: SourceRegistryService,
    private readonly greenhouseAdapter: GreenhouseSourceAdapter,
    private readonly leverAdapter: LeverSourceAdapter,
    private readonly ashbyAdapter: AshbySourceAdapter,
    private readonly smartRecruitersAdapter: SmartRecruitersSourceAdapter,
    private readonly workableAdapter: WorkableSourceAdapter,
    private readonly remotiveAdapter: RemotiveSourceAdapter,
    private readonly remoteOKAdapter: RemoteOKSourceAdapter,
    private readonly adzunaAdapter: AdzunaSourceAdapter,
    private readonly jsearchAdapter: JSearchSourceAdapter,
    private readonly joobleAdapter: JoobleSourceAdapter,
    private readonly careerjetAdapter: CareerjetSourceAdapter,
  ) {}

  onModuleInit() {
    // Register all pluggable adapters into the registry
    this.sourceRegistry.register(this.greenhouseAdapter);
    this.sourceRegistry.register(this.leverAdapter);
    this.sourceRegistry.register(this.ashbyAdapter);
    this.sourceRegistry.register(this.smartRecruitersAdapter);
    this.sourceRegistry.register(this.workableAdapter);
    this.sourceRegistry.register(this.remotiveAdapter);
    this.sourceRegistry.register(this.remoteOKAdapter);
    this.sourceRegistry.register(this.adzunaAdapter);
    this.sourceRegistry.register(this.jsearchAdapter);
    this.sourceRegistry.register(this.joobleAdapter);
    this.sourceRegistry.register(this.careerjetAdapter);

    this.logger.log(
      "JobPipelineService initialized with Pluggable Source Layer.",
    );
  }

  async runPipeline(params?: {
    query?: string;
    location?: string;
    maxPages?: number;
    providerNames?: string[];
  }): Promise<PipelineExecutionSummary> {
    const pipelineStartTime = Date.now();
    this.logger.log(
      `Starting Job Collection Pipeline. Query: "${params?.query || "all"}"`,
    );

    const summary: PipelineExecutionSummary = {
      totalIngested: 0,
      approvedCount: 0,
      duplicateCount: 0,
      spamCount: 0,
      anomalyCount: 0,
      newCount: 0,
      updatedCount: 0,
      rejectedCount: 0,
      durationMs: 0,
      jobs: [],
    };

    const enabledAdapters = this.sourceRegistry.getEnabledAdapters(
      params?.providerNames,
    );
    this.logger.log(
      `Executing ${enabledAdapters.length} active source adapter(s): ${enabledAdapters.map((a) => a.sourceName).join(", ")}`,
    );

    for (const adapter of enabledAdapters) {
      const adapterStartTime = Date.now();
      let fetchedJobs: RawJobInput[] = [];
      let adapterApproved = 0;
      let adapterNew = 0;
      let adapterUpdated = 0;
      let adapterRejected = 0;
      let adapterDuplicate = 0;
      let adapterSpam = 0;
      let adapterAnomaly = 0;
      let status = "SUCCESS";
      let errorMsg: string | undefined = undefined;

      try {
        const rawJobs = await adapter.fetch(params);
        fetchedJobs = rawJobs.map((rj) => rawJobToRawJobInput(rj));
        this.logger.log(
          `Adapter [${adapter.sourceName}] yielded ${fetchedJobs.length} raw jobs`,
        );
      } catch (err: unknown) {
        status = "FAILED";
        errorMsg = (err as Error).message;
        this.logger.error(
          `Error harvesting from adapter ${adapter.sourceName}: ${errorMsg}`,
          (err as Error).stack,
        );
      }

      summary.totalIngested += fetchedJobs.length;

      for (const raw of fetchedJobs) {
        try {
          const processed = await this.processJob(raw);

          if (processed.duplicate.isDuplicate) {
            adapterDuplicate++;
            summary.duplicateCount++;
          }
          if (processed.spam.isSpam) {
            adapterSpam++;
            summary.spamCount++;
          }
          if (processed.anomaly.isAnomaly) {
            adapterAnomaly++;
            summary.anomalyCount++;
          }

          const {
            job: savedJob,
            isNew,
            isActive,
          } = await this.persistJob(processed);

          if (isNew) {
            adapterNew++;
            summary.newCount++;
          } else {
            adapterUpdated++;
            summary.updatedCount++;
          }

          if (isActive) {
            adapterApproved++;
            summary.approvedCount++;
          } else {
            adapterRejected++;
            summary.rejectedCount++;
          }

          summary.jobs.push({
            id: savedJob.id,
            title: savedJob.title,
            company: processed.normalized.companyName,
            qualityScore: savedJob.qualityScore,
            status: processed.status,
          });
        } catch (jobErr) {
          this.logger.error(`Failed to process job: "${raw.title}"`, jobErr);
        }
      }

      const adapterDurationMs = Date.now() - adapterStartTime;

      // Persist structured CollectionLog for this source
      try {
        await this.prisma.collectionLog.create({
          data: {
            source: adapter.sourceName,
            totalIngested: fetchedJobs.length,
            approvedCount: adapterApproved,
            newCount: adapterNew,
            updatedCount: adapterUpdated,
            rejectedCount: adapterRejected,
            duplicateCount: adapterDuplicate,
            spamCount: adapterSpam,
            anomalyCount: adapterAnomaly,
            durationMs: adapterDurationMs,
            status,
            errorMessage: errorMsg,
          },
        });
      } catch (logErr) {
        this.logger.warn(
          `Failed to record collection log for ${adapter.sourceName}: ${(logErr as Error).message}`,
        );
      }
    }

    summary.durationMs = Date.now() - pipelineStartTime;
    this.logger.log(
      `Pipeline complete in ${summary.durationMs}ms. Ingested: ${summary.totalIngested}, Approved: ${summary.approvedCount}, New: ${summary.newCount}, Updated: ${summary.updatedCount}, Rejected: ${summary.rejectedCount}`,
    );

    return summary;
  }

  /**
   * Deactivates jobs unseen for N days (default 14 days).
   */
  async expireStaleJobs(days = 14): Promise<number> {
    const cutoffDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    this.logger.log(
      `Checking for stale jobs unseen since ${cutoffDate.toISOString()}...`,
    );

    const result = await this.prisma.job.updateMany({
      where: {
        isActive: true,
        lastSeenAt: { lt: cutoffDate },
      },
      data: {
        isActive: false,
        indiaEligibilityReason: `EXPIRED_UNSEEN_${days}_DAYS`,
      },
    });

    this.logger.log(`Expired ${result.count} stale jobs.`);
    return result.count;
  }

  async getCollectionMetrics() {
    const [
      totalJobs,
      activeJobs,
      indianJobs,
      internships,
      spamJobs,
      anomalyJobs,
      verifiedUrls,
      sourceBreakdown,
      recentLogs,
    ] = await Promise.all([
      this.prisma.job.count(),
      this.prisma.job.count({ where: { isActive: true } }),
      this.prisma.job.count({ where: { isActive: true, isIndiaJob: true } }),
      this.prisma.job.count({
        where: { isActive: true, employmentType: "INTERNSHIP" },
      }),
      this.prisma.job.count({ where: { isSpam: true } }),
      this.prisma.job.count({ where: { isAnomaly: true } }),
      this.prisma.job.count({
        where: {
          isActive: true,
          validationState: {
            in: [UrlValidationState.VERIFIED, UrlValidationState.REDIRECTED],
          },
        },
      }),
      this.prisma.jobSource.groupBy({
        by: ["source"],
        _count: true,
      }),
      this.prisma.collectionLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 15,
      }),
    ]);

    return {
      totalJobs,
      activeJobs,
      indianJobs,
      internships,
      spamJobs,
      anomalyJobs,
      verifiedUrls,
      sourceBreakdown: sourceBreakdown.map((s) => ({
        source: s.source,
        count: s._count,
      })),
      recentLogs,
      lastSyncAt: recentLogs[0]?.createdAt || new Date(),
    };
  }

  async processJob(raw: RawJobInput): Promise<PipelineProcessedJob> {
    // Stage 1: Normalization
    const normalized = this.normalizer.normalize(raw);

    // Stage 2: Deduplication
    const duplicate = await this.deduplicator.checkDuplicate(normalized);

    // Stage 3: Spam Detection
    const spam = this.spamDetector.detectSpam(normalized);

    // Stage 4: Anomaly Detection
    const anomaly = this.anomalyDetector.detectAnomalies(normalized);

    // Stage 5: Quality Scoring
    const quality = this.qualityScorer.calculateQuality(normalized);

    // Stage 6: URL Validation & Recognition
    const urlValidation = await this.urlValidator.validateUrl(
      normalized.applyUrl,
      { checkHttp: false },
    );

    let status: PipelineProcessedJob["status"] = "APPROVED";
    if (spam.isSpam) {
      status = "FLAGGED_SPAM";
    } else if (duplicate.isDuplicate) {
      status = "DUPLICATE";
    } else if (anomaly.isAnomaly) {
      status = "FLAGGED_ANOMALY";
    }

    return {
      normalized,
      duplicate,
      spam,
      anomaly,
      quality,
      urlValidation,
      status,
    };
  }

  private async persistJob(processed: PipelineProcessedJob): Promise<{
    job: { id: string; title: string; qualityScore: number };
    isNew: boolean;
    isActive: boolean;
  }> {
    const { normalized, spam, anomaly, quality, duplicate, urlValidation } =
      processed;

    // 1. Upsert Company
    const company = await this.prisma.company.upsert({
      where: { companySlug: normalized.companySlug },
      update: {
        websiteUrl: normalized.companyWebsite || undefined,
        logoUrl: normalized.companyLogo || undefined,
        lastJobSeenAt: new Date(),
      },
      create: {
        name: normalized.companyName,
        companySlug: normalized.companySlug,
        websiteUrl: normalized.companyWebsite,
        logoUrl: normalized.companyLogo,
        industry: "Technology",
        isHiring: true,
        lastJobSeenAt: new Date(),
      },
    });

    // 2. Check if job already exists (for new vs updated count & link preference)
    const existingJob = await this.prisma.job.findUnique({
      where: { jobSlug: normalized.jobSlug },
      select: {
        id: true,
        isActive: true,
        applyUrl: true,
        applyLinkStatus: true,
      },
    });
    const isNew = !existingJob;

    // 3. Compute Per-Company Cap & India Eligibility
    const maxShare = Number(process.env.MAX_COMPANY_JOB_SHARE || "0.08");
    const minFloor = Number(process.env.MIN_COMPANY_JOB_FLOOR || "15");
    const activeJobsTotal = await this.prisma.job.count({
      where: { isActive: true },
    });
    const capThreshold = Math.max(
      minFloor,
      Math.floor(activeJobsTotal * maxShare),
    );

    const existingCompanyActiveCount = await this.prisma.job.count({
      where: {
        companyId: company.id,
        isActive: true,
        NOT: { jobSlug: normalized.jobSlug },
      },
    });

    let isCapped = false;
    if (existingCompanyActiveCount >= capThreshold) {
      isCapped = true;
      this.logger.warn(
        `Company "${normalized.companyName}" exceeded active cap (${existingCompanyActiveCount} >= ${capThreshold}). Job "${normalized.title}" marked inactive.`,
      );
    }

    const isActive =
      !spam.isSpam &&
      !duplicate.isDuplicate &&
      !isCapped &&
      normalized.isIndiaEligible;

    // Prefer direct ATS apply URLs over redirect aggregator URLs
    let effectiveApplyUrl = normalized.applyUrl;
    let effectiveApplyStatus = normalized.applyLinkStatus || "direct_ats";

    if (
      existingJob?.applyLinkStatus === "direct_ats" &&
      normalized.applyLinkStatus === "redirect_aggregator"
    ) {
      effectiveApplyUrl = existingJob.applyUrl || normalized.applyUrl;
      effectiveApplyStatus = "direct_ats";
    }

    const hiddenReason = !isActive
      ? isCapped
        ? "DEACTIVATED_OVER_COMPANY_CAP_LIMIT"
        : normalized.indiaEligibilityReason
      : null;
    const hiddenAt = !isActive ? new Date() : null;

    const job = await this.prisma.job.upsert({
      where: { jobSlug: normalized.jobSlug },
      update: {
        title: normalized.title,
        location: normalized.location,
        rawLocation: normalized.rawLocation,
        city: normalized.city,
        state: normalized.state,
        queriedCity: normalized.queriedCity,
        locationSource: normalized.locationSource,
        locationConfidence: normalized.locationConfidence,
        workMode: normalized.workMode,
        employmentType: normalized.employmentType,
        experienceMinYears: normalized.experienceMinYears,
        experienceMaxYears: normalized.experienceMaxYears,
        salaryMin: normalized.salaryMin,
        salaryMax: normalized.salaryMax,
        currency: normalized.currency,
        salaryPeriod: normalized.salaryPeriod,
        description: normalized.description,
        applyUrl: effectiveApplyUrl,
        applyLinkStatus: effectiveApplyStatus,
        skillsRequired: normalized.skillsRequired,
        responsibilities: normalized.responsibilities,
        requirements: normalized.requirements,
        benefits: normalized.benefits,
        qualityScore: quality.qualityScore,
        qualityBreakdown: quality.breakdown as unknown as Prisma.InputJsonValue,
        spamScore: spam.spamScore,
        isSpam: spam.isSpam,
        isAnomaly: anomaly.isAnomaly,
        anomalyReasons:
          anomaly.anomalyReasons as unknown as Prisma.InputJsonValue,
        fingerprint: normalized.fingerprint,
        duplicateOfJobId: duplicate.duplicateOfJobId,
        isIndiaJob: normalized.isIndiaJob,
        isIndiaEligible: normalized.isIndiaEligible,
        indiaEligibilityReason: isCapped
          ? "DEACTIVATED_OVER_COMPANY_CAP_LIMIT"
          : normalized.indiaEligibilityReason,
        hiddenReason,
        hiddenAt,
        validationState:
          (urlValidation?.validationState as UrlValidationState) ||
          UrlValidationState.UNVERIFIED,
        verificationConfidence:
          (urlValidation?.verificationConfidence as VerificationConfidence) ||
          VerificationConfidence.UNVERIFIED,
        validatedApplyUrl:
          urlValidation?.validatedApplyUrl || effectiveApplyUrl,
        urlLastCheckedAt: new Date(),
        lastSeenAt: new Date(),
        isActive,
      },
      create: {
        companyId: company.id,
        title: normalized.title,
        jobSlug: normalized.jobSlug,
        location: normalized.location,
        rawLocation: normalized.rawLocation,
        city: normalized.city,
        state: normalized.state,
        queriedCity: normalized.queriedCity,
        locationSource: normalized.locationSource,
        locationConfidence: normalized.locationConfidence,
        workMode: normalized.workMode,
        employmentType: normalized.employmentType,
        experienceMinYears: normalized.experienceMinYears,
        experienceMaxYears: normalized.experienceMaxYears,
        salaryMin: normalized.salaryMin,
        salaryMax: normalized.salaryMax,
        currency: normalized.currency,
        salaryPeriod: normalized.salaryPeriod,
        description: normalized.description,
        applyUrl: effectiveApplyUrl,
        applyLinkStatus: effectiveApplyStatus,
        skillsRequired: normalized.skillsRequired,
        responsibilities: normalized.responsibilities,
        requirements: normalized.requirements,
        benefits: normalized.benefits,
        qualityScore: quality.qualityScore,
        qualityBreakdown: quality.breakdown as unknown as Prisma.InputJsonValue,
        spamScore: spam.spamScore,
        isSpam: spam.isSpam,
        isAnomaly: anomaly.isAnomaly,
        anomalyReasons:
          anomaly.anomalyReasons as unknown as Prisma.InputJsonValue,
        fingerprint: normalized.fingerprint,
        duplicateOfJobId: duplicate.duplicateOfJobId,
        isIndiaJob: normalized.isIndiaJob,
        isIndiaEligible: normalized.isIndiaEligible,
        indiaEligibilityReason: isCapped
          ? "DEACTIVATED_OVER_COMPANY_CAP_LIMIT"
          : normalized.indiaEligibilityReason,
        hiddenReason,
        hiddenAt,
        validationState:
          (urlValidation?.validationState as UrlValidationState) ||
          UrlValidationState.UNVERIFIED,
        verificationConfidence:
          (urlValidation?.verificationConfidence as VerificationConfidence) ||
          VerificationConfidence.UNVERIFIED,
        validatedApplyUrl:
          urlValidation?.validatedApplyUrl || effectiveApplyUrl,
        urlLastCheckedAt: new Date(),
        lastSeenAt: new Date(),
        isActive,
        postedAt: normalized.postedAt,
      },
      select: {
        id: true,
        title: true,
        qualityScore: true,
      },
    });

    // 4. Idempotent Upsert on JobSource
    const sourcePlatform = this.mapSourcePlatform(normalized.source);
    await this.prisma.jobSource.upsert({
      where: {
        jobId_source: {
          jobId: job.id,
          source: sourcePlatform,
        },
      },
      update: {
        sourceJobId: normalized.externalId,
        sourceJobUrl: normalized.applyUrl,
        lastVerifiedAt: new Date(),
        isActive: true,
      },
      create: {
        jobId: job.id,
        source: sourcePlatform,
        sourceJobId: normalized.externalId,
        sourceJobUrl: normalized.applyUrl,
        lastVerifiedAt: new Date(),
        isActive: true,
      },
    });

    return { job, isNew, isActive };
  }

  private mapSourcePlatform(rawSource: string): JobSourcePlatform {
    const s = (rawSource || "").toUpperCase();
    if (s.includes("WELLFOUND")) return JobSourcePlatform.WELLFOUND;
    if (s.includes("YC")) return JobSourcePlatform.YC;
    if (s.includes("INTERNSHALA")) return JobSourcePlatform.INTERNSHALA;
    if (s.includes("NAUKRI")) return JobSourcePlatform.NAUKRI;
    if (s.includes("LINKEDIN")) return JobSourcePlatform.LINKEDIN;
    return JobSourcePlatform.COMPANY;
  }
}
