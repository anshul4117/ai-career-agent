import { JoobleSourceAdapter } from "./jooble.adapter";
import { CareerjetSourceAdapter } from "./careerjet.adapter";
import { StructuredCareerPageCollector } from "../../company-registry/structured-career-page.collector";
import { AtsDetectorService } from "../../company-registry/ats-detector.service";

describe("Aggregator Adapters & Structured Collector Suite", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
    jest.restoreAllMocks();
  });

  describe("JoobleSourceAdapter", () => {
    it("should report isEnabled based on JOOBLE_API_KEY configuration", () => {
      process.env.JOOBLE_API_KEY = "test-jooble-key";
      const adapterWithKey = new JoobleSourceAdapter();
      expect(adapterWithKey.isEnabled).toBe(true);

      delete process.env.JOOBLE_API_KEY;
      const adapterWithoutKey = new JoobleSourceAdapter();
      expect(adapterWithoutKey.isEnabled).toBe(false);
    });

    it("should parse fixture response into RawJob array with redirect_aggregator apply status", async () => {
      process.env.JOOBLE_API_KEY = "test-key";
      const adapter = new JoobleSourceAdapter();

      const mockJoobleResponse = {
        totalCount: 1,
        jobs: [
          {
            id: "123456",
            title: "Junior Python Developer",
            location: "Lucknow, Uttar Pradesh",
            snippet:
              "Looking for a junior python developer with Django experience.",
            salary: "₹3,50,000 - ₹5,00,000",
            source: "Company Direct",
            type: "Full-time",
            link: "https://jooble.org/desc/123456",
            company: "Awadh Tech Solutions",
            updated: "2026-11-01T10:00:00.000Z",
          },
        ],
      };

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => mockJoobleResponse,
      } as Response);

      const jobs = await adapter.fetch({
        query: "python",
        location: "Lucknow",
        maxPages: 1,
      });

      expect(jobs).toHaveLength(1);
      const job = jobs[0];
      expect(job.title).toBe("Junior Python Developer");
      expect(job.company).toBe("Awadh Tech Solutions");
      expect(job.location).toBe("Lucknow, Uttar Pradesh");
      expect(job.sourceJobId).toBe("jooble-123456");
      expect(job.source).toBe("JOOBLE");
      expect(job.applyUrl).toBe("https://jooble.org/desc/123456");
      expect(job.applyLinkStatus).toBe("redirect_aggregator");
    });
  });

  describe("CareerjetSourceAdapter", () => {
    it("should report isEnabled based on CAREERJET_API_KEY and ENABLE_SOURCE_CAREERJET configuration", () => {
      process.env.CAREERJET_API_KEY = "test-careerjet-key";
      process.env.ENABLE_SOURCE_CAREERJET = "true";
      const adapterWithKey = new CareerjetSourceAdapter();
      expect(adapterWithKey.isEnabled).toBe(true);

      delete process.env.CAREERJET_API_KEY;
      const adapterWithoutKey = new CareerjetSourceAdapter();
      expect(adapterWithoutKey.isEnabled).toBe(false);
    });

    it("should pass required parameters and parse Careerjet jobs with redirect_aggregator status", async () => {
      process.env.CAREERJET_API_KEY = "test-cj-key";
      process.env.ENABLE_SOURCE_CAREERJET = "true";
      const adapter = new CareerjetSourceAdapter();

      const mockCareerjetResponse = {
        type: "JOBS",
        hits: 1,
        pages: 1,
        jobs: [
          {
            url: "https://jobviewtrack.com/v2/test-tracking-link-123",
            title: "Frontend Trainee (React)",
            date: "Sun, 01 Nov 2026 08:00:00 GMT",
            description:
              "Exciting opportunity for freshers in React and TypeScript.",
            company: "Malwa Tech Labs",
            locations: "Indore, Madhya Pradesh",
            salary: "₹3 LPA",
          },
        ],
      };

      global.fetch = jest
        .fn()
        .mockImplementationOnce((urlStr: string, options?: RequestInit) => {
          const parsed = new URL(urlStr);
          expect(urlStr).toContain("https://search.api.careerjet.net/v4/query");
          expect(parsed.searchParams.get("locale_code")).toBe("en_IN");
          expect(parsed.searchParams.get("keywords")).toBe("react");
          expect(parsed.searchParams.get("location")).toBe("Indore");
          expect(
            (options?.headers as Record<string, string>)?.Authorization,
          ).toBe(`Basic ${Buffer.from("test-cj-key:").toString("base64")}`);

          return Promise.resolve({
            ok: true,
            status: 200,
            json: async () => mockCareerjetResponse,
          } as Response);
        });

      const jobs = await adapter.fetch({
        query: "react",
        location: "Indore",
        maxPages: 1,
      });

      expect(jobs).toHaveLength(1);
      const job = jobs[0];
      expect(job.title).toBe("Frontend Trainee (React)");
      expect(job.company).toBe("Malwa Tech Labs");
      expect(job.location).toBe("Indore, Madhya Pradesh");
      expect(job.applyUrl).toBe(
        "https://jobviewtrack.com/v2/test-tracking-link-123",
      );
      expect(job.applyLinkStatus).toBe("redirect_aggregator");
    });
  });

  describe("StructuredCareerPageCollector", () => {
    let atsDetector: AtsDetectorService;
    let collector: StructuredCareerPageCollector;

    beforeEach(() => {
      atsDetector = new AtsDetectorService();
      collector = new StructuredCareerPageCollector(atsDetector);
    });

    it("should extract schema.org JobPosting JSON-LD when present", async () => {
      jest.spyOn(atsDetector, "isRobotsAllowed").mockResolvedValue(true);

      const htmlWithJsonLd = `
        <html>
          <head>
            <script type="application/ld+json">
              {
                "@context": "https://schema.org/",
                "@type": "JobPosting",
                "title": "Graduate Engineer Trainee",
                "description": "Full-time position for B.Tech / MCA freshers.",
                "datePosted": "2026-11-01",
                "directApply": "https://localtech.in/apply/get",
                "jobLocation": {
                  "@type": "Place",
                  "address": {
                    "addressLocality": "Meerut"
                  }
                }
              }
            </script>
          </head>
          <body><h1>Careers at LocalTech</h1></body>
        </html>
      `;

      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        arrayBuffer: async () => Buffer.from(htmlWithJsonLd),
      } as unknown as Response);

      const jobs = await collector.collectFromStructuredCareerPage({
        id: "comp-1",
        name: "LocalTech Meerut",
        careerUrl: "https://localtech.in/careers",
        city: "Meerut",
        state: "Uttar Pradesh",
      });

      expect(jobs).toHaveLength(1);
      expect(jobs[0].title).toBe("Graduate Engineer Trainee");
      expect(jobs[0].company).toBe("LocalTech Meerut");
      expect(jobs[0].location).toBe("Meerut");
      expect(jobs[0].applyLinkStatus).toBe("company_portal");
    });

    it("should respect robots.txt and not scrape if disallowed", async () => {
      jest.spyOn(atsDetector, "isRobotsAllowed").mockResolvedValue(false);

      const jobs = await collector.collectFromStructuredCareerPage({
        id: "comp-2",
        name: "Protected Enterprise",
        careerUrl: "https://protected.com/careers",
      });

      expect(jobs).toEqual([]);
    });

    it("should return empty array if page has no structured data", async () => {
      jest.spyOn(atsDetector, "isRobotsAllowed").mockResolvedValue(true);

      const plainHtml =
        "<html><body><h1>Send resume to hr@example.com</h1></body></html>";
      global.fetch = jest.fn().mockResolvedValueOnce({
        ok: true,
        status: 200,
        arrayBuffer: async () => Buffer.from(plainHtml),
      } as unknown as Response);

      const jobs = await collector.collectFromStructuredCareerPage({
        id: "comp-3",
        name: "Plain HTML Company",
        careerUrl: "https://plain.com/careers",
      });

      expect(jobs).toEqual([]);
    });
  });
});
