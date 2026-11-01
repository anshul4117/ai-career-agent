import * as dotenv from "dotenv";
dotenv.config();

import { Test, TestingModule } from "@nestjs/testing";
import { PrismaModule } from "../../prisma/prisma.module";
import { PrismaService } from "../../prisma/prisma.service";
import { JobPipelineService } from "./job-pipeline.service";
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
import { LocationDerivationService } from "./stages/location-derivation.service";
import { RawJobInput } from "./types/job-pipeline.types";

describe("JobPipelineService - End-to-End Job Saving", () => {
  let moduleRef: TestingModule;
  let pipelineService: JobPipelineService;
  let prisma: PrismaService;
  const testJobSlug = `test-e2e-engineer-save-${Date.now()}`;

  beforeAll(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [PrismaModule],
      providers: [
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
      ],
    }).compile();

    pipelineService = moduleRef.get<JobPipelineService>(JobPipelineService);
    prisma = moduleRef.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
    try {
      // Clean up test records
      await prisma.jobSource.deleteMany({
        where: { job: { jobSlug: testJobSlug } },
      });
      await prisma.job.deleteMany({
        where: { jobSlug: testJobSlug },
      });
      await prisma.$disconnect();
    } catch {
      // Ignore cleanup error in case DB is unreachable
    }
    await moduleRef.close();
  });

  it("should process and save a valid sample job end-to-end to the database without mocking the write step", async () => {
    const rawInput: RawJobInput = {
      externalId: `ext-${Date.now()}`,
      source: "COMPANY",
      title: "Senior Fullstack Engineer (India Remote)",
      companyName: "Acme Cloud India",
      location: "Bengaluru, Karnataka, India",
      description:
        "Building scalable high-throughput cloud infrastructure using TypeScript, React, and Node.js. 4+ years of relevant experience.",
      applyUrl: "https://acmecloud.example.com/careers/senior-fullstack",
      employmentType: "FULL_TIME",
      postedAt: new Date(),
    };

    // 1. Process through pipeline stages
    const processed = await pipelineService.processJob(rawInput);
    expect(processed.status).toBe("APPROVED");
    expect(processed.normalized.isIndiaEligible).toBe(true);

    // Override slug for controlled idempotent cleanup
    processed.normalized.jobSlug = testJobSlug;

    // 2. Persist to real database (end-to-end write)
    const pipelineInternal = pipelineService as unknown as {
      persistJob: (p: typeof processed) => Promise<{
        job: { id: string };
        isActive: boolean;
      }>;
    };
    const persisted = await pipelineInternal.persistJob(processed);
    expect(persisted.job).toBeDefined();
    expect(persisted.job.id).toBeDefined();
    expect(persisted.isActive).toBe(true);

    // 3. Verify record in PostgreSQL database
    const dbJob = await prisma.job.findUnique({
      where: { id: persisted.job.id },
      include: {
        company: true,
        jobSources: true,
      },
    });

    expect(dbJob).not.toBeNull();
    expect(dbJob?.title).toBe("Senior Fullstack Engineer (India Remote)");
    expect(dbJob?.company.name).toBe("Acme Cloud India");
    expect(dbJob?.isActive).toBe(true);
    expect(dbJob?.locationConfidence).toBe("HIGH");
    expect(dbJob?.city).toBe("Bengaluru");
  });
});
