import { QueryMatrixService } from "./query-matrix.service";
import { SourceRegistryService } from "../sources/source-registry.service";

describe("QueryMatrixService Suite", () => {
  let queryMatrix: QueryMatrixService;
  let sourceRegistry: SourceRegistryService;

  beforeEach(() => {
    sourceRegistry = new SourceRegistryService();

    // Register test mock adapters
    sourceRegistry.register({
      sourceName: "JOOBLE",
      isEnabled: true,
      fetch: jest.fn(),
    });
    sourceRegistry.register({
      sourceName: "ADZUNA",
      isEnabled: false,
      fetch: jest.fn(),
    });
    sourceRegistry.register({
      sourceName: "JSEARCH",
      isEnabled: false,
      fetch: jest.fn(),
    });

    queryMatrix = new QueryMatrixService(sourceRegistry);
  });

  describe("Matrix Generation & Configuration", () => {
    it("should generate a rich multi-dimensional slice matrix", () => {
      const totalSlices = queryMatrix.getTotalSliceCount();
      expect(totalSlices).toBeGreaterThan(500);
    });

    it("should include both tech and non-IT SME categories", () => {
      const batch = queryMatrix.getNextBatch(100);

      const hasSoftware = batch.some(
        (s) => s.category === "software_engineering",
      );
      const hasSales = batch.some((s) => s.category === "sales_bd");
      const hasSupport = batch.some((s) => s.category === "customer_support");
      const hasBackOffice = batch.some((s) => s.category === "back_office");
      const hasAccounts = batch.some((s) => s.category === "accounts_finance");

      expect(hasSoftware).toBe(true);
      expect(hasSales).toBe(true);
      expect(hasSupport).toBe(true);
      expect(hasBackOffice).toBe(true);
      expect(hasAccounts).toBe(true);
    });

    it("should cover Tier-2/3 cities prominently", () => {
      const tier2_3Batch = queryMatrix.getNextBatch(200, true);
      const cities = new Set(tier2_3Batch.map((s) => s.city));

      expect(cities.has("Meerut")).toBe(true);
      expect(cities.has("Lucknow")).toBe(true);
      expect(cities.has("Kanpur")).toBe(true);
      expect(cities.has("Indore")).toBe(true);
      expect(cities.has("Jaipur")).toBe(true);
      expect(cities.has("Bhopal")).toBe(true);
      expect(cities.has("Nagpur")).toBe(true);
      expect(cities.has("Chandigarh")).toBe(true);
    });
  });

  describe("Slice Rotation", () => {
    it("should rotate sequentially across runs without repeating slices in adjacent batches", () => {
      const batch1 = queryMatrix.getNextBatch(5);
      const batch2 = queryMatrix.getNextBatch(5);

      const batch1Ids = new Set(batch1.map((s) => s.id));
      const hasOverlap = batch2.some((s) => batch1Ids.has(s.id));

      expect(hasOverlap).toBe(false);
    });
  });

  describe("Yield Tracking", () => {
    it("should accumulate yield metrics and report top performing slices", () => {
      const [sliceA, sliceB] = queryMatrix.getNextBatch(2);

      queryMatrix.recordYield(sliceA, {
        fetched: 25,
        indiaEligible: 24,
        newJobs: 8,
        tier2Or3Jobs: 8,
      });

      queryMatrix.recordYield(sliceB, {
        fetched: 10,
        indiaEligible: 2,
        newJobs: 0,
        tier2Or3Jobs: 0,
      });

      const summary = queryMatrix.getYieldSummary();

      expect(summary.totalFetched).toBe(35);
      expect(summary.totalNewJobs).toBe(8);
      expect(summary.tier2Or3JobsCollected).toBe(8);
      expect(summary.slicesExecuted).toBe(2);
      expect(summary.zeroYieldSlicesCount).toBe(1);
      expect(summary.topSlices[0].sliceId).toBe(sliceA.id);
    });
  });

  describe("Source Status & Transparency Reporting", () => {
    it("should explicitly report Adzuna and JSearch as unavailable: needs card", () => {
      const statuses = queryMatrix.getSourceStatusReport();

      const adzuna = statuses.find((s) => s.sourceName === "ADZUNA");
      expect(adzuna).toBeDefined();
      expect(adzuna?.status).toBe("UNAVAILABLE");
      expect(adzuna?.reason).toBe("unavailable: needs card");
      expect(adzuna?.contributing).toBe(false);

      const jsearch = statuses.find((s) => s.sourceName === "JSEARCH");
      expect(jsearch).toBeDefined();
      expect(jsearch?.status).toBe("UNAVAILABLE");
      expect(jsearch?.reason).toBe("unavailable: needs card");
      expect(jsearch?.contributing).toBe(false);

      const jooble = statuses.find((s) => s.sourceName === "JOOBLE");
      expect(jooble?.status).toBe("ACTIVE");
      expect(jooble?.contributing).toBe(true);
    });
  });
});
