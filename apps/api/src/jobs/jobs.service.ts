import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { QueryJobsDto, SaveJobDto } from "./dto/query-jobs.dto";
import { Prisma } from "@prisma/client";
import {
  getCityClusterInfo,
  JobMatchType,
  WidenedLocationMeta,
} from "./config/regional-clusters.config";

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryJobsDto, userId?: string) {
    const {
      search,
      location,
      workMode,
      employmentType,
      minSalary,
      minQualityScore,
      includeSpam,
      skills,
      page = 1,
      limit = 20,
    } = query;

    const skip = (page - 1) * limit;

    const baseWhere: Prisma.JobWhereInput = {
      isActive: true,
      isSpam: includeSpam ? undefined : false,
      ...(workMode && { workMode }),
      ...(employmentType && { employmentType }),
      ...(minSalary && {
        OR: [
          { salaryMin: { gte: minSalary } },
          { salaryMax: { gte: minSalary } },
        ],
      }),
      ...(minQualityScore !== undefined && {
        qualityScore: { gte: minQualityScore },
      }),
      ...(search &&
        (() => {
          const sTrim = search.trim();
          const isInternQuery = /\bintern(ship)?\b/i.test(sTrim);

          if (isInternQuery) {
            const remaining = sTrim.replace(/\bintern(ship)?\b/gi, "").trim();
            const remCluster = remaining ? getCityClusterInfo(remaining) : null;
            const remainingLocationClauses = remCluster
              ? remCluster.aliases.map((a) => ({
                  location: { contains: a, mode: "insensitive" as const },
                }))
              : [];
            return {
              AND: [
                {
                  OR: [
                    { employmentType: "INTERNSHIP" as const },
                    {
                      title: {
                        contains: "intern",
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
                {
                  NOT: [
                    {
                      title: {
                        contains: "internal",
                        mode: "insensitive" as const,
                      },
                    },
                    {
                      title: {
                        contains: "international",
                        mode: "insensitive" as const,
                      },
                    },
                  ],
                },
                ...(remaining
                  ? [
                      {
                        OR: [
                          {
                            title: {
                              contains: remaining,
                              mode: "insensitive" as const,
                            },
                          },
                          {
                            company: {
                              name: {
                                contains: remaining,
                                mode: "insensitive" as const,
                              },
                            },
                          },
                          ...remainingLocationClauses,
                          {
                            skillsRequired: {
                              hasSome: [
                                remaining,
                                remaining.toLowerCase(),
                                remaining.toUpperCase(),
                              ],
                            },
                          },
                        ],
                      },
                    ]
                  : []),
              ],
            };
          }

          const words = sTrim.split(/\s+/).filter((w) => w.length > 1);
          const skillMatches =
            words.length > 1
              ? Array.from(
                  new Set([
                    sTrim,
                    sTrim.toLowerCase(),
                    sTrim.toUpperCase(),
                    ...words,
                  ]),
                )
              : [sTrim, sTrim.toLowerCase(), sTrim.toUpperCase()];

          const searchCluster = getCityClusterInfo(sTrim);
          const searchLocationClauses = searchCluster.aliases.map((a) => ({
            location: { contains: a, mode: "insensitive" as const },
          }));

          return {
            OR: [
              { title: { contains: sTrim, mode: "insensitive" as const } },
              {
                company: {
                  name: { contains: sTrim, mode: "insensitive" as const },
                },
              },
              ...searchLocationClauses,
              { skillsRequired: { hasSome: skillMatches } },
              ...(words.length > 1
                ? [
                    {
                      AND: words.map((w) => {
                        const wordCluster = getCityClusterInfo(w);
                        const wordLocClauses = wordCluster.aliases.map((a) => ({
                          location: {
                            contains: a,
                            mode: "insensitive" as const,
                          },
                        }));
                        return {
                          OR: [
                            {
                              title: {
                                contains: w,
                                mode: "insensitive" as const,
                              },
                            },
                            {
                              company: {
                                name: {
                                  contains: w,
                                  mode: "insensitive" as const,
                                },
                              },
                            },
                            ...wordLocClauses,
                            {
                              skillsRequired: {
                                hasSome: [w, w.toLowerCase(), w.toUpperCase()],
                              },
                            },
                          ],
                        };
                      }),
                    },
                  ]
                : []),
            ],
          };
        })()),
      ...(skills &&
        skills.length > 0 && {
          skillsRequired: { hasSome: skills },
        }),
    };

    let effectiveWhere: Prisma.JobWhereInput = { ...baseWhere };
    let widened: WidenedLocationMeta = { applied: false };
    let matchTypeResolver: (j: {
      city?: string | null;
      queriedCity?: string | null;
      location?: string | null;
      workMode?: string | null;
    }) => JobMatchType;

    if (location) {
      const clusterInfo = getCityClusterInfo(location);
      const { canonicalCity, clusterName, nearbyCities, aliases } = clusterInfo;

      // 1. Exact match query
      const exactLocWhere: Prisma.JobWhereInput = {
        OR: [
          { city: { equals: canonicalCity, mode: "insensitive" } },
          ...aliases.map((a) => ({
            location: { contains: a, mode: "insensitive" as const },
          })),
        ],
      };

      const exactCount = await this.prisma.job.count({
        where: { ...baseWhere, ...exactLocWhere },
      });

      if (exactCount >= 5 || nearbyCities.length === 0) {
        if (exactCount > 0) {
          effectiveWhere = { ...baseWhere, ...exactLocWhere };
          widened = { applied: false };
          matchTypeResolver = () => "EXACT";
        } else {
          // Zero exact matches and no regional cluster: check pan-India remote
          const remoteWhere: Prisma.JobWhereInput = {
            ...baseWhere,
            OR: [
              { workMode: "REMOTE" },
              { location: { contains: "Remote", mode: "insensitive" } },
            ],
          };
          const remoteCount = await this.prisma.job.count({
            where: remoteWhere,
          });
          if (remoteCount > 0) {
            effectiveWhere = remoteWhere;
            widened = {
              applied: true,
              reason: `No exact matches in ${canonicalCity}, showing pan-India remote jobs`,
              cities: [],
            };
            matchTypeResolver = () => "REMOTE_INDIA";
          } else {
            // No matches at all
            effectiveWhere = { ...baseWhere, ...exactLocWhere };
            widened = { applied: false };
            matchTypeResolver = () => "EXACT";
          }
        }
      } else {
        // exactCount < 5 and nearby cluster cities exist: apply explicit widening
        const widenedCities = [canonicalCity, ...nearbyCities];
        const widenedLocWhere: Prisma.JobWhereInput = {
          OR: [
            { city: { in: widenedCities, mode: "insensitive" } },
            { queriedCity: { in: widenedCities, mode: "insensitive" } },
            ...widenedCities.map((c) => ({
              location: { contains: c, mode: "insensitive" as const },
            })),
            { workMode: "REMOTE" },
          ],
        };

        effectiveWhere = { ...baseWhere, ...widenedLocWhere };
        widened = {
          applied: true,
          reason:
            exactCount === 0
              ? `No exact matches in ${canonicalCity}, showing nearby ${clusterName || "regional"} cities`
              : `Few exact matches in ${canonicalCity}, showing nearby ${clusterName || "regional"} cities`,
          cities: nearbyCities,
        };

        const canonicalLower = canonicalCity.toLowerCase();
        const nearbyLower = new Set(nearbyCities.map((c) => c.toLowerCase()));

        matchTypeResolver = (j) => {
          const jCity = (j.city || "").toLowerCase();
          const jQueried = (j.queriedCity || "").toLowerCase();
          const jLoc = (j.location || "").toLowerCase();

          if (
            jCity === canonicalLower ||
            aliases.some((a) => jLoc.includes(a))
          ) {
            return "EXACT";
          }
          if (
            nearbyLower.has(jCity) ||
            nearbyLower.has(jQueried) ||
            Array.from(nearbyLower).some((nc) => jLoc.includes(nc))
          ) {
            return "NEARBY";
          }
          if (j.workMode === "REMOTE" || jLoc.includes("remote")) {
            return "REMOTE_INDIA";
          }
          return "PAN_INDIA";
        };
      }
    } else {
      matchTypeResolver = (j) => {
        if (
          j.workMode === "REMOTE" ||
          (j.location || "").toLowerCase().includes("remote")
        ) {
          return "REMOTE_INDIA";
        }
        if (j.city) return "EXACT";
        return "PAN_INDIA";
      };
    }

    const [total, rawJobs] = await Promise.all([
      this.prisma.job.count({ where: effectiveWhere }),
      this.prisma.job.findMany({
        where: effectiveWhere,
        include: {
          company: {
            select: {
              id: true,
              name: true,
              companySlug: true,
              logoUrl: true,
              websiteUrl: true,
              industry: true,
            },
          },
          jobSources: {
            select: {
              id: true,
              source: true,
              sourceJobUrl: true,
            },
            take: 1,
          },
        },
        orderBy: [
          { isIndiaJob: "desc" },
          { qualityScore: "desc" },
          { postedAt: "desc" },
        ],
        skip,
        take: limit,
      }),
    ]);

    // When widened is applied, ensure EXACT matches sort above NEARBY and REMOTE
    const jobs = [...rawJobs];
    if (widened.applied && location) {
      const canonicalLower =
        getCityClusterInfo(location).canonicalCity.toLowerCase();
      jobs.sort((a, b) => {
        const aExact = (a.city || "").toLowerCase() === canonicalLower ? 0 : 1;
        const bExact = (b.city || "").toLowerCase() === canonicalLower ? 0 : 1;
        return aExact - bExact;
      });
    }

    // Check saved status if userId provided
    let savedJobIds = new Set<string>();
    if (userId) {
      const saved = await this.prisma.savedJob.findMany({
        where: { userId, jobId: { in: jobs.map((j) => j.id) } },
        select: { jobId: true },
      });
      savedJobIds = new Set(saved.map((s) => s.jobId));
    }

    const items = jobs.map((j) => ({
      ...j,
      matchType: matchTypeResolver(j),
      isSaved: savedJobIds.has(j.id),
      primaryApplyUrl:
        j.validatedApplyUrl ||
        j.applyUrl ||
        j.jobSources[0]?.sourceJobUrl ||
        "",
    }));

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      widened,
    };
  }

  async findOne(id: string, userId?: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      include: {
        company: true,
        jobSources: true,
      },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${id} not found`);
    }

    let isSaved = false;
    if (userId) {
      const saved = await this.prisma.savedJob.findUnique({
        where: {
          userId_jobId: { userId, jobId: id },
        },
      });
      isSaved = !!saved;
    }

    return {
      ...job,
      isSaved,
      primaryApplyUrl: job.applyUrl || job.jobSources[0]?.sourceJobUrl || "",
    };
  }

  async saveJob(userId: string, jobId: string, dto?: SaveJobDto) {
    const job = await this.prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    const saved = await this.prisma.savedJob.upsert({
      where: {
        userId_jobId: { userId, jobId },
      },
      update: {
        notes: dto?.notes,
      },
      create: {
        userId,
        jobId,
        notes: dto?.notes,
      },
    });

    return { success: true, saved };
  }

  async unsaveJob(userId: string, jobId: string) {
    try {
      await this.prisma.savedJob.delete({
        where: {
          userId_jobId: { userId, jobId },
        },
      });
    } catch {
      // Ignore if not previously saved
    }

    return { success: true };
  }

  async getSavedJobs(userId: string) {
    const saved = await this.prisma.savedJob.findMany({
      where: { userId },
      include: {
        job: {
          include: {
            company: {
              select: {
                id: true,
                name: true,
                logoUrl: true,
                websiteUrl: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return saved.map((s) => ({
      ...s.job,
      savedAt: s.createdAt,
      savedNotes: s.notes,
      isSaved: true,
    }));
  }

  async trackApplication(userId: string, jobId: string) {
    const job = await this.prisma.job.findUnique({
      where: { id: jobId },
      include: { jobSources: true },
    });

    if (!job) {
      throw new NotFoundException(`Job with ID ${jobId} not found`);
    }

    // Record application intent if not already existing
    const existing = await this.prisma.jobApplication.findFirst({
      where: { userId, jobId },
    });

    if (!existing) {
      await this.prisma.jobApplication.create({
        data: {
          userId,
          jobId,
          jobSourceId: job.jobSources[0]?.id,
          status: "APPLIED",
          appliedAt: new Date(),
        },
      });
    }

    return {
      success: true,
      applyUrl: job.applyUrl || job.jobSources[0]?.sourceJobUrl || "",
    };
  }
}
