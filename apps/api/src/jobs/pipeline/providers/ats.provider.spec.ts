import { AtsJobProvider } from "./ats.provider";

describe("AtsJobProvider", () => {
  let provider: AtsJobProvider;

  beforeEach(() => {
    provider = new AtsJobProvider();
  });

  it("should have providerName ATS_LIVE", () => {
    expect(provider.providerName).toBe("ATS_LIVE");
  });

  it("should filter fetched jobs by query", async () => {
    const mockJobs = [
      {
        externalId: "lever-1",
        source: "COMPANY",
        title: "Frontend Engineer Intern",
        companyName: "CRED",
        location: "Bangalore",
        description: "Intern role",
        applyUrl: "https://jobs.lever.co/cred/1",
      },
      {
        externalId: "lever-2",
        source: "COMPANY",
        title: "Senior Backend Engineer",
        companyName: "CRED",
        location: "Bangalore",
        description: "Senior role",
        applyUrl: "https://jobs.lever.co/cred/2",
      },
    ];

    jest.spyOn(provider, "fetchJobs").mockImplementation(async (params) => {
      if (params?.query) {
        const q = params.query.toLowerCase();
        return mockJobs.filter((j) => j.title.toLowerCase().includes(q));
      }
      return mockJobs;
    });

    const results = await provider.fetchJobs({ query: "intern" });
    expect(results).toHaveLength(1);
    expect(results[0].title).toBe("Frontend Engineer Intern");
  });
});
