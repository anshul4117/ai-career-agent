import { SourceRegistryService } from "./source-registry.service";
import { GreenhouseSourceAdapter } from "./adapters/greenhouse.adapter";
import { LeverSourceAdapter } from "./adapters/lever.adapter";
import { AshbySourceAdapter } from "./adapters/ashby.adapter";
import { SmartRecruitersSourceAdapter } from "./adapters/smartrecruiters.adapter";
import { WorkableSourceAdapter } from "./adapters/workable.adapter";
import { RemotiveSourceAdapter } from "./adapters/remotive.adapter";
import { RemoteOKSourceAdapter } from "./adapters/remoteok.adapter";
import { AdzunaSourceAdapter } from "./adapters/adzuna.adapter";
import { JSearchSourceAdapter } from "./adapters/jsearch.adapter";
import { rawJobToRawJobInput } from "./job-source.interface";

describe("Phase 1 Source Layer", () => {
  let registry: SourceRegistryService;

  beforeEach(() => {
    registry = new SourceRegistryService();
  });

  it("should register adapters and filter enabled ones", () => {
    const greenhouse = new GreenhouseSourceAdapter();
    const adzuna = new AdzunaSourceAdapter(); // Should be disabled if no ADZUNA keys in env

    registry.register(greenhouse);
    registry.register(adzuna);

    expect(registry.getAdapter("GREENHOUSE")).toBe(greenhouse);
    expect(registry.getAllAdapters().length).toBe(2);

    const enabled = registry.getEnabledAdapters();
    expect(enabled).toContain(greenhouse);
    if (!process.env.ADZUNA_APP_ID) {
      expect(enabled).not.toContain(adzuna);
    }
  });

  it("should correctly convert RawJob to RawJobInput", () => {
    const rawJob = {
      title: "Backend Engineer",
      company: "Swiggy",
      location: "Bengaluru, India",
      isRemote: false,
      salaryMin: 1200000,
      salaryMax: 1800000,
      currency: "INR",
      salaryPeriod: "YEARLY",
      expMin: 1,
      expMax: 3,
      skills: ["Node.js", "TypeScript", "PostgreSQL"],
      description:
        "Hiring software engineer for Swiggy food delivery platform.",
      postedAt: new Date("2026-10-15"),
      applyUrl: "https://boards.greenhouse.io/swiggy/jobs/123",
      source: "GREENHOUSE",
      sourceJobId: "greenhouse-swiggy-123",
      employmentType: "FULL_TIME",
      workMode: "ONSITE",
    };

    const input = rawJobToRawJobInput(rawJob);

    expect(input.externalId).toBe("greenhouse-swiggy-123");
    expect(input.source).toBe("GREENHOUSE");
    expect(input.companyName).toBe("Swiggy");
    expect(input.workMode).toBe("ONSITE");
    expect(input.experienceMinYears).toBe(1);
    expect(input.salaryMin).toBe(1200000);
    expect(input.skillsRaw).toEqual(["Node.js", "TypeScript", "PostgreSQL"]);
  });

  it("should gracefully disable paid key-requiring adapters when keys are absent", () => {
    const adzuna = new AdzunaSourceAdapter();
    const jsearch = new JSearchSourceAdapter();

    if (!process.env.ADZUNA_APP_ID) {
      expect(adzuna.isEnabled).toBe(false);
    }
    if (!process.env.RAPIDAPI_KEY) {
      expect(jsearch.isEnabled).toBe(false);
    }
  });

  it("should enable free public ATS and JSON adapters by default", () => {
    const greenhouse = new GreenhouseSourceAdapter();
    const lever = new LeverSourceAdapter();
    const ashby = new AshbySourceAdapter();
    const smartRecruiters = new SmartRecruitersSourceAdapter();
    const workable = new WorkableSourceAdapter();
    const remotive = new RemotiveSourceAdapter();
    const remoteok = new RemoteOKSourceAdapter();

    expect(greenhouse.isEnabled).toBe(true);
    expect(lever.isEnabled).toBe(true);
    expect(ashby.isEnabled).toBe(true);
    expect(smartRecruiters.isEnabled).toBe(true);
    expect(workable.isEnabled).toBe(true);
    expect(remotive.isEnabled).toBe(true);
    expect(remoteok.isEnabled).toBe(true);
  });
});
