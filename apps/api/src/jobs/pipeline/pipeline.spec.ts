import { JobNormalizerService } from "./job-normalizer.service";
import { JobSpamDetectorService } from "./job-spam-detector.service";
import { JobAnomalyDetectorService } from "./job-anomaly-detector.service";
import { JobQualityScorerService } from "./job-quality-scorer.service";
import { RawJobInput } from "./types/job-pipeline.types";
import { SalaryPeriod, WorkMode } from "@prisma/client";

describe("Job Pipeline Services", () => {
  let normalizer: JobNormalizerService;
  let spamDetector: JobSpamDetectorService;
  let anomalyDetector: JobAnomalyDetectorService;
  let qualityScorer: JobQualityScorerService;

  beforeEach(() => {
    normalizer = new JobNormalizerService();
    spamDetector = new JobSpamDetectorService();
    anomalyDetector = new JobAnomalyDetectorService();
    qualityScorer = new JobQualityScorerService();
  });

  describe("JobNormalizerService", () => {
    it("should normalize title, slug, and extract technical skills", () => {
      const raw: RawJobInput = {
        externalId: "ext-1",
        source: "WELLFOUND",
        title: "Senior Full Stack Dev (React/Node)",
        companyName: "TechCorp Labs",
        description:
          "We are looking for a dev with experience in React, TypeScript, Node.js, and PostgreSQL.",
        applyUrl: "https://techcorp.com/apply",
      };

      const normalized = normalizer.normalize(raw);

      expect(normalized.title).toBe("Senior Full Stack Dev (React/Node)");
      expect(normalized.companySlug).toBe("techcorp-labs");
      expect(normalized.skillsRequired).toContain("React");
      expect(normalized.skillsRequired).toContain("TypeScript");
      expect(normalized.skillsRequired).toContain("Node.js");
      expect(normalized.skillsRequired).toContain("PostgreSQL");
      expect(normalized.fingerprint).toBeDefined();
    });

    it("should generate identical fingerprints for same company, title, and location regardless of casing", () => {
      const fp1 = normalizer.computeFingerprint(
        "Frontend Engineer",
        "Stripe",
        "Remote",
      );
      const fp2 = normalizer.computeFingerprint(
        "frontend engineer",
        "stripe",
        "remote - anywhere",
      );

      expect(fp1).toBe(fp2);
    });

    it("should accurately detect Indian tech hubs and Pan-India opportunities", () => {
      expect(
        normalizer.detectIsIndiaJob(
          "Bangalore, India",
          "SDE 1",
          "Work in Bengaluru",
        ),
      ).toBe(true);
      expect(
        normalizer.detectIsIndiaJob(
          "Gurgaon, Haryana",
          "Frontend Dev",
          "Gurugram office",
        ),
      ).toBe(true);
      expect(
        normalizer.detectIsIndiaJob(
          "Remote - India",
          "Backend Engineer",
          "WFH in India",
        ),
      ).toBe(true);
      expect(
        normalizer.detectIsIndiaJob(
          "Hyderabad",
          "Cloud Engineer",
          "Hyderabad office",
        ),
      ).toBe(true);
      expect(
        normalizer.detectIsIndiaJob(
          "San Francisco, CA",
          "Staff Engineer",
          "Silicon valley office",
        ),
      ).toBe(false);
      expect(
        normalizer.detectIsIndiaJob("Berlin, Germany", "DevOps", "Berlin team"),
      ).toBe(false);
    });
  });

  describe("JobSpamDetectorService", () => {
    it("should flag payment and upfront fee scams with high spam score", () => {
      const raw: RawJobInput = {
        externalId: "spam-1",
        source: "TELEGRAM",
        title: "EARN 50000 DAILY WORK FROM HOME",
        companyName: "Quick Cash",
        description:
          "Pay upfront registration fee 2000 INR to start. Contact on WhatsApp or Telegram @fastcash.",
        applyUrl: "http://bit.ly/scam-link",
      };

      const normalized = normalizer.normalize(raw);
      const result = spamDetector.detectSpam(normalized);

      expect(result.isSpam).toBe(true);
      expect(result.spamScore).toBeGreaterThanOrEqual(0.4);
      expect(result.reasons.length).toBeGreaterThan(0);
    });

    it("should pass legitimate engineering roles with zero or minimal spam score", () => {
      const raw: RawJobInput = {
        externalId: "clean-1",
        source: "COMPANY",
        title: "Senior Backend Engineer",
        companyName: "Acme Cloud",
        description:
          "Design distributed microservices with Go and PostgreSQL. Full medical insurance and equity.",
        applyUrl: "https://acme.com/careers/backend",
      };

      const normalized = normalizer.normalize(raw);
      const result = spamDetector.detectSpam(normalized);

      expect(result.isSpam).toBe(false);
      expect(result.spamScore).toBeLessThan(0.4);
    });
  });

  describe("JobAnomalyDetectorService", () => {
    it("should detect inverted salary where min exceeds max", () => {
      const raw: RawJobInput = {
        externalId: "anom-1",
        source: "COMPANY",
        title: "DevOps Engineer",
        companyName: "CloudTech",
        salaryMin: 5000000,
        salaryMax: 2000000,
        description: "Kubernetes and Terraform operations.",
        applyUrl: "https://cloudtech.com/jobs/1",
      };

      const normalized = normalizer.normalize(raw);
      const result = anomalyDetector.detectAnomalies(normalized);

      expect(result.isAnomaly).toBe(true);
      expect(result.anomalyReasons[0]).toContain(
        "minimum salary exceeds maximum",
      );
    });

    it("should detect unrealistic experience requirements exceeding 25 years", () => {
      const raw: RawJobInput = {
        externalId: "anom-2",
        source: "COMPANY",
        title: "Junior React Developer (30+ years experience)",
        companyName: "Enterprise LLC",
        description: "Requires 30+ years of React experience.",
        applyUrl: "https://enterprise.com/jobs/junior",
      };

      const normalized = normalizer.normalize(raw);
      const result = anomalyDetector.detectAnomalies(normalized);

      expect(result.isAnomaly).toBe(true);
      expect(
        result.anomalyReasons.some((r) => r.includes("exceeding 25 years")),
      ).toBe(true);
    });
  });

  describe("JobQualityScorerService", () => {
    it("should compute comprehensive 0-100 score across 6 dimensions", () => {
      const raw: RawJobInput = {
        externalId: "qual-1",
        source: "YC",
        title: "Staff Software Engineer",
        companyName: "Stripe",
        companyWebsite: "https://stripe.com",
        companyLogo: "https://stripe.com/logo.png",
        salaryMin: 3500000,
        salaryMax: 5000000,
        currency: "INR",
        salaryPeriod: SalaryPeriod.YEARLY,
        workMode: WorkMode.REMOTE,
        description: `### Responsibilities
- Architect globally distributed financial payment engines handling billions of dollars.
- Build resilient fault-tolerant systems in Go and TypeScript.

### Requirements
- 6+ years of distributed backend systems experience with PostgreSQL and Kafka.
- Experience with high-availability transaction processing.

### Benefits
- Comprehensive medical, dental, and vision insurance.
- Flexible remote work and generous 401k matching.`,
        applyUrl: "https://stripe.com/jobs/staff-eng",
        postedAt: new Date(),
      };

      const normalized = normalizer.normalize(raw);
      const result = qualityScorer.calculateQuality(normalized);

      expect(result.qualityScore).toBeGreaterThanOrEqual(70);
      expect(result.breakdown.companyCredibility).toBe(20);
      expect(result.breakdown.applyLinkValidity).toBe(15);
      expect(result.breakdown.salaryTransparency).toBe(10);
      expect(result.breakdown.freshness).toBe(15);
    });
  });
});
