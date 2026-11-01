import { Test, TestingModule } from "@nestjs/testing";
import { JobsService } from "./jobs.service";
import { PrismaService } from "../prisma/prisma.service";
import { NotFoundException } from "@nestjs/common";

describe("JobsService", () => {
  let service: JobsService;

  const mockPrismaService = {
    job: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    savedJob: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      upsert: jest.fn(),
      delete: jest.fn(),
    },
    jobApplication: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        JobsService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = moduleRef.get<JobsService>(JobsService);
    jest.clearAllMocks();
  });

  it("should return paginated jobs with isSaved flag", async () => {
    const mockJobs = [
      {
        id: "job-1",
        title: "Frontend Engineer",
        qualityScore: 85,
        applyUrl: "https://example.com/apply",
        company: { name: "Acme" },
        jobSources: [],
      },
    ];

    mockPrismaService.job.count.mockResolvedValue(1);
    mockPrismaService.job.findMany.mockResolvedValue(mockJobs);
    mockPrismaService.savedJob.findMany.mockResolvedValue([{ jobId: "job-1" }]);

    const result = await service.findAll({ page: 1, limit: 10 }, "user-1");

    expect(result.items).toHaveLength(1);
    expect(result.items[0].isSaved).toBe(true);
    expect(result.pagination.total).toBe(1);
  });

  it("should throw NotFoundException if job does not exist", async () => {
    mockPrismaService.job.findUnique.mockResolvedValue(null);

    await expect(service.findOne("non-existent")).rejects.toThrow(
      NotFoundException,
    );
  });

  it("should save job for user", async () => {
    mockPrismaService.job.findUnique.mockResolvedValue({ id: "job-1" });
    mockPrismaService.savedJob.upsert.mockResolvedValue({ id: "saved-1" });

    const result = await service.saveJob("user-1", "job-1", {
      notes: "Interesting role",
    });

    expect(mockPrismaService.savedJob.upsert).toHaveBeenCalled();
    expect(result.success).toBe(true);
  });

  it("should unsave job for user", async () => {
    mockPrismaService.savedJob.delete.mockResolvedValue({ id: "saved-1" });

    const result = await service.unsaveJob("user-1", "job-1");

    expect(result.success).toBe(true);
  });

  it("should construct search filter for 'intern' query targeting INTERNSHIP employment type", async () => {
    mockPrismaService.job.count.mockResolvedValue(0);
    mockPrismaService.job.findMany.mockResolvedValue([]);

    await service.findAll({ search: "intern" });

    expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          AND: expect.arrayContaining([
            expect.objectContaining({
              OR: [
                { employmentType: "INTERNSHIP" },
                { title: { contains: "intern", mode: "insensitive" } },
              ],
            }),
          ]),
        }),
      }),
    );
  });

  it("should construct search filter for skills/title query targeting title, company and skills", async () => {
    mockPrismaService.job.count.mockResolvedValue(0);
    mockPrismaService.job.findMany.mockResolvedValue([]);

    await service.findAll({ search: "React" });

    expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: [
            { title: { contains: "React", mode: "insensitive" } },
            { company: { name: { contains: "React", mode: "insensitive" } } },
            { location: { contains: "react", mode: "insensitive" } },
            { skillsRequired: { hasSome: ["React", "react", "REACT"] } },
          ],
        }),
      }),
    );
  });

  describe("Location search behavior with explicit widening", () => {
    it("should return exact match with widened: { applied: false } when exact matches >= 5", async () => {
      // Mock 6 exact matches in Noida
      mockPrismaService.job.count.mockResolvedValue(6);
      mockPrismaService.job.findMany.mockResolvedValue([
        {
          id: "job-noida-1",
          title: "Backend Engineer",
          city: "Noida",
          location: "Noida, India",
          workMode: "ONSITE",
          company: { name: "LocalCo" },
          jobSources: [],
        },
      ]);

      const result = await service.findAll({ location: "Noida" });

      expect(result.widened.applied).toBe(false);
      expect(result.items[0].matchType).toBe("EXACT");
      expect(mockPrismaService.job.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            OR: expect.arrayContaining([
              { city: { equals: "Noida", mode: "insensitive" } },
            ]),
          }),
        }),
      );
    });

    it("should apply widening flag when exact matches < 5 and nearby cluster cities exist", async () => {
      // 1st count call: exact match count = 1 (< 5)
      // 2nd count call: widened count = 10
      mockPrismaService.job.count
        .mockResolvedValueOnce(1)
        .mockResolvedValueOnce(10);

      mockPrismaService.job.findMany.mockResolvedValue([
        {
          id: "job-noida-1",
          title: "Backend Engineer",
          city: "Noida",
          location: "Noida, India",
          workMode: "ONSITE",
          company: { name: "LocalCo" },
          jobSources: [],
        },
        {
          id: "job-gurgaon-1",
          title: "DevOps Engineer",
          city: "Gurgaon",
          location: "Gurgaon, India",
          workMode: "ONSITE",
          company: { name: "MNC" },
          jobSources: [],
        },
      ]);

      const result = await service.findAll({ location: "Noida" });

      expect(result.widened.applied).toBe(true);
      expect(result.widened.cities).toEqual(
        expect.arrayContaining(["Delhi", "Gurgaon", "Faridabad", "Ghaziabad"]),
      );
      expect(result.widened.reason).toContain("Noida");

      expect(result.items[0].matchType).toBe("EXACT");
      expect(result.items[1].matchType).toBe("NEARBY");
    });

    it("should handle no-match case when 0 matches exist anywhere", async () => {
      // exact count = 0, widened count = 0
      mockPrismaService.job.count
        .mockResolvedValueOnce(0)
        .mockResolvedValueOnce(0);
      mockPrismaService.job.findMany.mockResolvedValue([]);

      const result = await service.findAll({ location: "Noida" });

      expect(result.items).toHaveLength(0);
      expect(result.pagination.total).toBe(0);
      expect(result.widened.applied).toBe(true);
      expect(result.widened.reason).toContain("No exact matches in Noida");
    });
  });
});
