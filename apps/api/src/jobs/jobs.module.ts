import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { JobsController } from "./jobs.controller";
import { JobsService } from "./jobs.service";
import { JobPipelineService } from "./pipeline/job-pipeline.service";
import { JobNormalizerService } from "./pipeline/job-normalizer.service";
import { JobDeduplicatorService } from "./pipeline/job-deduplicator.service";
import { JobSpamDetectorService } from "./pipeline/job-spam-detector.service";
import { JobAnomalyDetectorService } from "./pipeline/job-anomaly-detector.service";
import { JobQualityScorerService } from "./pipeline/job-quality-scorer.service";
import { JobUrlValidatorService } from "./pipeline/job-url-validator.service";
import { SourceRegistryService } from "./pipeline/sources/source-registry.service";
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
} from "./pipeline/sources/adapters";
import { JobSchedulerService } from "./pipeline/scheduler/job-scheduler.service";
import { AtsDetectorService } from "./pipeline/company-registry/ats-detector.service";
import { CompanyImporterService } from "./pipeline/company-registry/company-importer.service";
import { CompanyDiscoveryService } from "./pipeline/company-registry/company-discovery.service";
import { StructuredCareerPageCollector } from "./pipeline/company-registry/structured-career-page.collector";
import { QueryMatrixService } from "./pipeline/query-matrix/query-matrix.service";
import { LocationDerivationService } from "./pipeline/stages/location-derivation.service";
import { AtsJobProvider } from "./pipeline/providers/ats.provider";
import { IndiaTechJobProvider } from "./pipeline/providers/india-tech.provider";
import { SeedTechJobProvider } from "./pipeline/providers/seed-tech.provider";
import { AdzunaJobProvider } from "./pipeline/providers/adzuna.provider";
import { JSearchJobProvider } from "./pipeline/providers/jsearch.provider";
import { RemotiveJobProvider } from "./pipeline/providers/remotive.provider";

@Module({
  imports: [PrismaModule],
  controllers: [JobsController],
  providers: [
    JobsService,
    JobPipelineService,
    LocationDerivationService,
    JobNormalizerService,
    JobDeduplicatorService,
    JobSpamDetectorService,
    JobAnomalyDetectorService,
    JobQualityScorerService,
    JobUrlValidatorService,
    SourceRegistryService,
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
    JobSchedulerService,
    AtsDetectorService,
    CompanyImporterService,
    CompanyDiscoveryService,
    StructuredCareerPageCollector,
    QueryMatrixService,
    // Legacy providers kept for mock/isolated evaluation
    AtsJobProvider,
    IndiaTechJobProvider,
    SeedTechJobProvider,
    AdzunaJobProvider,
    JSearchJobProvider,
    RemotiveJobProvider,
  ],
  exports: [
    JobsService,
    JobPipelineService,
    LocationDerivationService,
    JobUrlValidatorService,
    SourceRegistryService,
    JobSchedulerService,
    AtsDetectorService,
    CompanyImporterService,
    CompanyDiscoveryService,
    QueryMatrixService,
  ],
})
export class JobsModule {}
