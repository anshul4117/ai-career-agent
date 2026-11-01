import { IndiaTechJobProvider } from "./india-tech.provider";

describe("IndiaTechJobProvider", () => {
  let provider: IndiaTechJobProvider;

  beforeEach(() => {
    provider = new IndiaTechJobProvider();
  });

  it("should have providerName INDIA_TECH", () => {
    expect(provider.providerName).toBe("INDIA_TECH");
  });

  it("should return authentic Indian tech jobs and internships", async () => {
    const jobs = await provider.fetchJobs();
    expect(jobs.length).toBeGreaterThanOrEqual(20);

    const internships = jobs.filter((j) => j.employmentType === "INTERNSHIP");
    expect(internships.length).toBeGreaterThanOrEqual(10);

    for (const job of jobs) {
      expect(job.title).toBeTruthy();
      expect(job.companyName).toBeTruthy();
      expect(job.applyUrl).toMatch(/^https:\/\//);
      expect(job.currency).toBe("INR");
      expect(job.skillsRaw && job.skillsRaw.length).toBeGreaterThan(0);
      expect(job.location).toMatch(/India/i);
    }
  });

  it("should filter jobs by query", async () => {
    const internJobs = await provider.fetchJobs({ query: "intern" });
    expect(internJobs.length).toBeGreaterThan(0);
    internJobs.forEach((j) => {
      const match =
        j.title.toLowerCase().includes("intern") ||
        j.companyName.toLowerCase().includes("intern") ||
        (j.skillsRaw &&
          j.skillsRaw.some((s) => s.toLowerCase().includes("intern")));
      expect(match).toBe(true);
    });
  });
});
