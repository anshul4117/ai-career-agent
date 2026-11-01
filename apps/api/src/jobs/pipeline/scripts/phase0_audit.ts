import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";

export async function runPhase0Audit() {
  const prisma = new PrismaService();

  console.log("=== PHASE 0 AUDIT: LIVE DATABASE & LINK ANALYSIS ===");

  // 1. Total Counts
  const totalJobs = await prisma.job.count();
  const activeJobs = await prisma.job.count({ where: { isActive: true } });
  const spamJobs = await prisma.job.count({ where: { isSpam: true } });
  const anomalyJobs = await prisma.job.count({ where: { isAnomaly: true } });
  const indianJobs = await prisma.job.count({
    where: { isActive: true, isIndiaJob: true },
  });

  console.log(`Total Jobs in DB: ${totalJobs}`);
  console.log(`Active Jobs: ${activeJobs}`);
  console.log(`Spam Jobs: ${spamJobs}`);
  console.log(`Anomaly Jobs: ${anomalyJobs}`);
  console.log(
    `Indian Jobs: ${indianJobs} (${((indianJobs / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );

  // 2. Company Distribution (Top 25 companies + % share)
  const companyDistribution = await prisma.company.findMany({
    select: {
      name: true,
      companySlug: true,
      industry: true,
      _count: { select: { jobs: { where: { isActive: true } } } },
    },
    orderBy: { jobs: { _count: "desc" } },
    take: 25,
  });

  console.log("\n--- Top 25 Companies by Active Jobs (% Share) ---");
  for (const c of companyDistribution) {
    const count = c._count.jobs;
    const share = ((count / (activeJobs || 1)) * 100).toFixed(2);
    console.log(` - ${c.name.padEnd(25)}: ${count} jobs (${share}%)`);
  }

  // 3. Location Distribution
  const allActiveJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      location: true,
      experienceMinYears: true,
      experienceMaxYears: true,
      employmentType: true,
      applyUrl: true,
      validatedApplyUrl: true,
      validationState: true,
      company: { select: { name: true } },
      jobSources: { select: { source: true, sourceJobUrl: true }, take: 1 },
    },
  });

  const cityMap = new Map<string, number>();
  for (const j of allActiveJobs) {
    const loc = (j.location || "Unspecified").trim();
    cityMap.set(loc, (cityMap.get(loc) || 0) + 1);
  }

  const sortedCities = Array.from(cityMap.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  console.log("\n--- Top Locations by Active Jobs ---");
  for (const [city, count] of sortedCities.slice(0, 20)) {
    const share = ((count / (activeJobs || 1)) * 100).toFixed(1);
    console.log(` - ${city.padEnd(30)}: ${count} jobs (${share}%)`);
  }

  // 4. Experience Level Distribution
  let fresherCount = 0; // 0-1 yrs or INTERNSHIP
  let juniorCount = 0; // 1-3 yrs
  let midCount = 0; // 3-5 yrs
  let seniorCount = 0; // 5+ yrs
  let unstatedExp = 0;

  for (const j of allActiveJobs) {
    if (j.employmentType === "INTERNSHIP" || j.experienceMinYears === 0) {
      fresherCount++;
    } else if (j.experienceMinYears && j.experienceMinYears <= 2) {
      juniorCount++;
    } else if (j.experienceMinYears && j.experienceMinYears <= 5) {
      midCount++;
    } else if (j.experienceMinYears && j.experienceMinYears > 5) {
      seniorCount++;
    } else {
      unstatedExp++;
    }
  }

  console.log("\n--- Experience Level Distribution ---");
  console.log(
    ` - Fresher / Intern (0-1y): ${fresherCount} (${((fresherCount / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Junior (1-3y):           ${juniorCount} (${((juniorCount / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Mid-Level (3-5y):         ${midCount} (${((midCount / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Senior (5y+):             ${seniorCount} (${((seniorCount / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Unstated / General:       ${unstatedExp} (${((unstatedExp / (activeJobs || 1)) * 100).toFixed(1)}%)`,
  );

  // 5. Source Breakdown
  const sources = await prisma.jobSource.groupBy({
    by: ["source"],
    _count: true,
  });
  console.log("\n--- Source Distribution ---");
  for (const s of sources) {
    console.log(
      ` - ${s.source.padEnd(15)}: ${s._count} (${((s._count / (activeJobs || 1)) * 100).toFixed(1)}%)`,
    );
  }

  // 6. Stratified Sample of Apply Links
  console.log(
    "\n--- Stratified Sampling of Apply Links (Cap 10 per Company) ---",
  );
  const companyJobsMap = new Map<string, typeof allActiveJobs>();
  for (const job of allActiveJobs) {
    const list = companyJobsMap.get(job.company.name) || [];
    if (list.length < 10) {
      list.push(job);
      companyJobsMap.set(job.company.name, list);
    }
  }

  const stratifiedSample: typeof allActiveJobs = [];
  for (const jobs of companyJobsMap.values()) {
    stratifiedSample.push(...jobs);
  }

  let directCompanyOrAtsCount = 0;
  let aggregatorOrTrackingCount = 0;
  let rawApiEndpointsCount = 0;

  const atsDomains = [
    "greenhouse.io",
    "lever.co",
    "ashbyhq.com",
    "smartrecruiters.com",
    "workday.com",
    "myworkdayjobs.com",
    "jobvite.com",
    "bamboohr.com",
  ];
  const aggregatorDomains = [
    "adzuna",
    "jsearch",
    "rapidapi",
    "indeed",
    "naukri",
    "monster",
    "ziprecruiter",
    "linkedin.com/jobs/view",
  ];

  for (const j of stratifiedSample) {
    const targetUrl =
      j.validatedApplyUrl || j.applyUrl || j.jobSources[0]?.sourceJobUrl || "";
    if (
      targetUrl.includes("boards-api.greenhouse.io") ||
      targetUrl.includes("/api/")
    ) {
      rawApiEndpointsCount++;
    }

    const isAtsOrCompany =
      atsDomains.some((d) => targetUrl.includes(d)) ||
      targetUrl.includes(
        j.company.name.toLowerCase().replace(/[^a-z0-9]/g, ""),
      ) ||
      j.validationState === "VERIFIED";

    const isAggregator = aggregatorDomains.some((d) => targetUrl.includes(d));

    if (isAtsOrCompany && !isAggregator) {
      directCompanyOrAtsCount++;
    } else {
      aggregatorOrTrackingCount++;
    }
  }

  console.log(
    `Sampled: ${stratifiedSample.length} jobs (stratified across ${companyJobsMap.size} companies)`,
  );
  console.log(
    ` - Direct Company / ATS Portal Links: ${directCompanyOrAtsCount} (${((directCompanyOrAtsCount / stratifiedSample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Raw API URLs stored as applyUrl:   ${rawApiEndpointsCount} (${((rawApiEndpointsCount / stratifiedSample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Aggregator / Tracking Links:        ${aggregatorOrTrackingCount} (${((aggregatorOrTrackingCount / stratifiedSample.length) * 100).toFixed(1)}%)`,
  );

  await prisma.$disconnect();

  return {
    totalJobs,
    activeJobs,
    indianJobs,
    topCompanies: companyDistribution
      .slice(0, 10)
      .map((c) => ({ name: c.name, count: c._count.jobs })),
    stratifiedSampleSize: stratifiedSample.length,
    rawApiEndpointsCount,
  };
}

if (require.main === module) {
  runPhase0Audit().catch(console.error);
}
