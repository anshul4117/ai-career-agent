import { AtsDetectorService } from "./ats-detector.service";
import { CompanyImporterService } from "./company-importer.service";
import { CompanyDiscoveryService } from "./company-discovery.service";
import {
  isPrivateIp,
  validateSafeUrl,
  SsrfSecurityException,
} from "./ssrf-validator";
import { extractDomain } from "../scripts/backfill-companies";
import { AtsType, CompanyType } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

describe("Phase 2: Company Registry & ATS Detection Suite", () => {
  describe("SSRF Validator", () => {
    it("should identify private and loopback IPv4 addresses", () => {
      expect(isPrivateIp("127.0.0.1")).toBe(true);
      expect(isPrivateIp("127.1.2.3")).toBe(true);
      expect(isPrivateIp("10.0.0.1")).toBe(true);
      expect(isPrivateIp("10.254.254.254")).toBe(true);
      expect(isPrivateIp("192.168.1.1")).toBe(true);
      expect(isPrivateIp("172.16.0.1")).toBe(true);
      expect(isPrivateIp("172.31.255.255")).toBe(true);
      expect(isPrivateIp("169.254.169.254")).toBe(true); // AWS/GCP metadata
      expect(isPrivateIp("0.0.0.0")).toBe(true);
      expect(isPrivateIp("255.255.255.255")).toBe(true);
    });

    it("should identify private and loopback IPv6 addresses", () => {
      expect(isPrivateIp("::1")).toBe(true);
      expect(isPrivateIp("::")).toBe(true);
      expect(isPrivateIp("fc00::1")).toBe(true);
      expect(isPrivateIp("fd12:3456:789a::1")).toBe(true);
      expect(isPrivateIp("fe80::1")).toBe(true);
    });

    it("should allow valid public IP addresses", () => {
      expect(isPrivateIp("8.8.8.8")).toBe(false);
      expect(isPrivateIp("1.1.1.1")).toBe(false);
      expect(isPrivateIp("104.244.42.1")).toBe(false);
      expect(isPrivateIp("172.32.0.1")).toBe(false); // Outside 172.16-31
    });

    it("should block prohibited protocols and internal hostnames", async () => {
      await expect(validateSafeUrl("ftp://example.com")).rejects.toThrow(
        SsrfSecurityException,
      );
      await expect(validateSafeUrl("file:///etc/passwd")).rejects.toThrow(
        SsrfSecurityException,
      );
      await expect(validateSafeUrl("http://localhost:3000")).rejects.toThrow(
        SsrfSecurityException,
      );
      await expect(
        validateSafeUrl("http://internal.service.local"),
      ).rejects.toThrow(SsrfSecurityException);
      await expect(validateSafeUrl("http://127.0.0.1/admin")).rejects.toThrow(
        SsrfSecurityException,
      );
      await expect(
        validateSafeUrl("http://169.254.169.254/latest/meta-data"),
      ).rejects.toThrow(SsrfSecurityException);
    });

    it("should allow safe external URLs", async () => {
      const parsed = await validateSafeUrl("https://example.com/careers");
      expect(parsed.hostname).toBe("example.com");
      expect(parsed.protocol).toBe("https:");
    });
  });

  describe("AtsDetectorService", () => {
    let detector: AtsDetectorService;

    beforeEach(() => {
      detector = new AtsDetectorService();
    });

    it("should detect ATS type and slug from direct URL patterns", () => {
      // Greenhouse
      expect(
        detector.detectFromUrlPattern("https://boards.greenhouse.io/stripe"),
      ).toEqual({
        atsType: AtsType.GREENHOUSE,
        atsSlug: "stripe",
      });
      expect(
        detector.detectFromUrlPattern("https://job-boards.greenhouse.io/figma"),
      ).toEqual({
        atsType: AtsType.GREENHOUSE,
        atsSlug: "figma",
      });
      expect(
        detector.detectFromUrlPattern(
          "https://boards.greenhouse.io/embed/job_board?for=coinbase",
        ),
      ).toEqual({
        atsType: AtsType.GREENHOUSE,
        atsSlug: "coinbase",
      });

      // Lever
      expect(
        detector.detectFromUrlPattern("https://jobs.lever.co/cred"),
      ).toEqual({
        atsType: AtsType.LEVER,
        atsSlug: "cred",
      });

      // Ashby
      expect(
        detector.detectFromUrlPattern("https://jobs.ashbyhq.com/linear"),
      ).toEqual({
        atsType: AtsType.ASHBY,
        atsSlug: "linear",
      });

      // SmartRecruiters
      expect(
        detector.detectFromUrlPattern(
          "https://careers.smartrecruiters.com/bosch",
        ),
      ).toEqual({
        atsType: AtsType.SMARTRECRUITERS,
        atsSlug: "bosch",
      });
      expect(
        detector.detectFromUrlPattern("https://jobs.smartrecruiters.com/visa"),
      ).toEqual({
        atsType: AtsType.SMARTRECRUITERS,
        atsSlug: "visa",
      });

      // Workable
      expect(
        detector.detectFromUrlPattern("https://apply.workable.com/invideo"),
      ).toEqual({
        atsType: AtsType.WORKABLE,
        atsSlug: "invideo",
      });

      // Recruitee
      expect(
        detector.detectFromUrlPattern("https://hotjar.recruitee.com"),
      ).toEqual({
        atsType: AtsType.RECRUITEE,
        atsSlug: "hotjar",
      });

      // Non-matching
      expect(
        detector.detectFromUrlPattern("https://example.com/careers"),
      ).toBeNull();
    });

    it("should block SSRF URLs during detectAndValidate", async () => {
      const res = await detector.detectAndValidate(
        "http://127.0.0.1:8080/careers",
      );
      expect(res.atsType).toBe(AtsType.NONE);
      expect(res.endpointOk).toBe(false);
      expect(res.reason).toContain("SSRF security filter");
    });

    it("should return endpointOk=false and confidence=LOW when public endpoint fails", async () => {
      jest.spyOn(detector, "validatePublicEndpoint").mockResolvedValueOnce({
        ok: false,
        error: "HTTP 404",
      });

      const res = await detector.detectAndValidate(
        "https://jobs.lever.co/non-existent-company-xyz-999",
      );

      expect(res.atsType).toBe(AtsType.LEVER);
      expect(res.atsSlug).toBe("non-existent-company-xyz-999");
      expect(res.endpointOk).toBe(false);
      expect(res.confidence).toBe("LOW");
      expect(res.reason).toContain("public endpoint failed");
    });

    it("should return endpointOk=true and confidence=HIGH when public endpoint succeeds", async () => {
      jest.spyOn(detector, "validatePublicEndpoint").mockResolvedValueOnce({
        ok: true,
        jobCount: 15,
        sampleApplyUrl: "https://boards.greenhouse.io/stripe/jobs/123",
      });

      const res = await detector.detectAndValidate(
        "https://boards.greenhouse.io/stripe",
      );

      expect(res.atsType).toBe(AtsType.GREENHOUSE);
      expect(res.atsSlug).toBe("stripe");
      expect(res.endpointOk).toBe(true);
      expect(res.confidence).toBe("HIGH");
      expect(res.jobCount).toBe(15);
      expect(res.sampleApplyUrl).toBe(
        "https://boards.greenhouse.io/stripe/jobs/123",
      );
    });

    it("should inspect HTML content and find embedded ATS links", () => {
      const htmlWithIframe = `
        <html>
          <body>
            <h1>Careers</h1>
            <iframe src="https://boards.greenhouse.io/embed/job_board?for=razorpay"></iframe>
          </body>
        </html>
      `;
      const detected = detector.detectFromUrlPattern(htmlWithIframe);
      expect(detected).toEqual({
        atsType: AtsType.GREENHOUSE,
        atsSlug: "razorpay",
      });
    });
  });

  describe("CompanyImporterService", () => {
    let importer: CompanyImporterService;
    let mockPrisma: Record<string, Record<string, jest.Mock>>;
    let mockAtsDetector: Record<string, jest.Mock>;

    beforeEach(() => {
      mockPrisma = {
        company: {
          findFirst: jest.fn(),
          findUnique: jest.fn(),
          upsert: jest.fn(),
        },
      };

      mockAtsDetector = {
        detectAndValidate: jest.fn().mockResolvedValue({
          atsType: AtsType.LEVER,
          atsSlug: "alpha",
          endpointOk: true,
          jobCount: 5,
          confidence: "HIGH",
          reason: "Validated",
        }),
      };

      importer = new CompanyImporterService(
        mockPrisma as unknown as PrismaService,
        mockAtsDetector as unknown as AtsDetectorService,
      );
    });

    it("should parse CSV content into structured rows, ignoring comments", () => {
      const csv = `name,website,careerUrl,city,state,companyType,sizeBand,notes
# Comment row
Alpha Tech,https://alphatech.in,https://jobs.lever.co/alpha,Bengaluru,Karnataka,STARTUP,51-200,High growth
Beta Systems,https://betasystems.com,,Pune,Maharashtra,INDIAN_LARGE,1001-5000,Enterprise`;

      const rows = importer.parseCsv(csv);
      expect(rows).toHaveLength(2);
      expect(rows[0].name).toBe("Alpha Tech");
      expect(rows[0].companyType).toBe("STARTUP");
      expect(rows[0].sizeBand).toBe("51-200");
      expect(rows[1].name).toBe("Beta Systems");
      expect(rows[1].companyType).toBe("INDIAN_LARGE");
    });

    it("should handle in-batch domain deduplication", async () => {
      const rows = [
        { name: "Alpha One", website: "https://alphatech.in" },
        {
          name: "Alpha Two (Duplicate)",
          website: "https://alphatech.in/careers",
        },
      ];

      const summary = await importer.importCompanies(rows, { dryRun: true });
      expect(summary.totalRows).toBe(2);
      expect(summary.importedCount).toBe(1);
      expect(summary.skippedDuplicates).toBe(1);
      expect(summary.results[1].status).toBe("SKIPPED_DUPLICATE");
    });

    it("should perform dry-run without writing to database", async () => {
      const rows = [
        {
          name: "Razorpay",
          website: "https://razorpay.com",
          companyType: "INDIAN_LARGE",
        },
      ];

      const summary = await importer.importCompanies(rows, { dryRun: true });
      expect(summary.dryRun).toBe(true);
      expect(summary.importedCount).toBe(1);
      expect(summary.results[0].status).toBe("DRY_RUN");
      expect(mockPrisma.company.upsert).not.toHaveBeenCalled();
    });

    it("should record failed status for rows missing name", async () => {
      const rows = [{ name: "", website: "https://invalid.com" }];

      const summary = await importer.importCompanies(rows, { dryRun: false });
      expect(summary.failedCount).toBe(1);
      expect(summary.results[0].status).toBe("FAILED");
      expect(summary.errors[0].error).toContain("Missing company name");
    });

    it("should resolve companyType from sizeBand or explicit type", async () => {
      const rows = [
        { name: "MegaCorp", sizeBand: "5000+" },
        { name: "SmallCo", sizeBand: "11-50" },
        { name: "ForeignMnc", companyType: "MNC" },
        { name: "MysteryCo" },
      ];

      const summary = await importer.importCompanies(rows, { dryRun: true });
      expect(summary.results[0].companyType).toBe(CompanyType.INDIAN_LARGE);
      expect(summary.results[1].companyType).toBe(CompanyType.STARTUP);
      expect(summary.results[2].companyType).toBe(CompanyType.MNC);
      expect(summary.results[3].companyType).toBe(CompanyType.UNKNOWN_REVIEW);
    });
  });

  describe("Migration Backfill Logic", () => {
    it("should correctly extract and clean domains from various URL formats", () => {
      expect(extractDomain("https://www.swiggy.com/careers")).toBe(
        "swiggy.com",
      );
      expect(extractDomain("http://jobs.lever.co/cred")).toBe("jobs.lever.co");
      expect(extractDomain("sub.domain.co.in/path?query=1")).toBe(
        "sub.domain.co.in",
      );
      expect(extractDomain("https://CRED.CLUB/")).toBe("cred.club");
      expect(extractDomain(null)).toBeNull();
      expect(extractDomain("not a valid domain")).toBeNull();
    });
  });

  describe("CompanyDiscoveryService", () => {
    let discovery: CompanyDiscoveryService;
    let mockPrisma: Record<string, Record<string, jest.Mock>>;
    let mockDetector: Record<string, jest.Mock>;

    beforeEach(() => {
      mockPrisma = {
        job: {
          findMany: jest
            .fn()
            .mockResolvedValue([
              { applyUrl: "https://jobs.lever.co/clevertap/123" },
            ]),
        },
        company: {
          findFirst: jest.fn().mockResolvedValue(null), // Clevertap not yet registered
          findMany: jest.fn().mockResolvedValue([]),
          create: jest.fn().mockResolvedValue({
            id: "comp-new-1",
            name: "Clevertap",
            companySlug: "clevertap",
            companyType: CompanyType.UNKNOWN_REVIEW,
            atsType: AtsType.LEVER,
            atsSlug: "clevertap",
            verified: true,
          }),
          update: jest.fn(),
        },
      };

      mockDetector = {
        detectFromUrlPattern: jest.fn().mockReturnValue({
          atsType: AtsType.LEVER,
          atsSlug: "clevertap",
        }),
        validatePublicEndpoint: jest.fn().mockResolvedValue({
          ok: true,
          jobCount: 12,
          sampleApplyUrl: "https://jobs.lever.co/clevertap/123",
        }),
        detectAndValidate: jest.fn(),
      };

      discovery = new CompanyDiscoveryService(
        mockPrisma as unknown as PrismaService,
        mockDetector as unknown as AtsDetectorService,
      );
    });

    it("should discover unregistered company from job applyUrl and create as UNKNOWN_REVIEW", async () => {
      const summary = await discovery.runDiscovery();

      expect(summary.totalJobsScanned).toBe(1);
      expect(summary.newlyCreatedCompanies).toBe(1);
      expect(summary.verifiedAtsCount).toBe(1);
      expect(mockPrisma.company.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            companySlug: "clevertap",
            companyType: CompanyType.UNKNOWN_REVIEW,
            atsType: AtsType.LEVER,
            atsSlug: "clevertap",
            verified: true,
          }),
        }),
      );
    });
  });
});
