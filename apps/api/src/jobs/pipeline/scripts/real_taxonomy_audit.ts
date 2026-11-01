import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";

async function main() {
  const prisma = new PrismaService();

  const activeJobs = await prisma.job.findMany({
    where: { isActive: true },
    include: {
      company: {
        select: {
          name: true,
          companyType: true,
          companySlug: true,
        },
      },
    },
  });

  const UNICORNS_AND_LARGE = new Set([
    "cred",
    "razorpay",
    "groww",
    "swiggy",
    "zepto",
    "phonepe",
    "browserstack",
    "postman",
    "zomato",
    "meesho",
    "slice",
    "urban company",
    "ather energy",
    "juspay",
    "jupiter",
  ]);

  let mncCount = 0;
  let indianLargeCount = 0;
  let smallStartupCount = 0;
  let smeCount = 0;
  let agencyCount = 0;
  let govtCount = 0;
  let unknownReviewCount = 0;

  const companyCounts: Record<string, number> = {};

  for (const job of activeJobs) {
    const compSlug = job.company?.companySlug?.toLowerCase() || "";
    const compName = job.company?.name || "Unknown";
    companyCounts[compName] = (companyCounts[compName] || 0) + 1;

    // Check real taxonomy: if company is unicorn or large tech, classify under INDIAN_LARGE
    if (job.company?.companyType === "MNC") {
      mncCount++;
    } else if (
      job.company?.companyType === "INDIAN_LARGE" ||
      UNICORNS_AND_LARGE.has(compSlug)
    ) {
      indianLargeCount++;
    } else if (job.company?.companyType === "STARTUP") {
      smallStartupCount++;
    } else if (job.company?.companyType === "SME") {
      smeCount++;
    } else if (job.company?.companyType === "AGENCY") {
      agencyCount++;
    } else if (job.company?.companyType === "GOVT") {
      govtCount++;
    } else {
      unknownReviewCount++;
    }
  }

  const totalActive = activeJobs.length;
  const realAccessible = smallStartupCount + smeCount + agencyCount + govtCount;
  const accessibleShare =
    totalActive > 0 ? (realAccessible / totalActive) * 100 : 0;

  console.log("=== REAL TAXONOMY AUDIT ===");
  console.log(`Total Active Jobs: ${totalActive}`);
  console.log(
    `MNC:               ${mncCount} (${((mncCount / totalActive) * 100).toFixed(1)}%)`,
  );
  console.log(
    `INDIAN_LARGE (incl unicorns): ${indianLargeCount} (${((indianLargeCount / totalActive) * 100).toFixed(1)}%)`,
  );
  console.log(
    `STARTUP (small/seed/early):   ${smallStartupCount} (${((smallStartupCount / totalActive) * 100).toFixed(1)}%)`,
  );
  console.log(`SME:                          ${smeCount}`);
  console.log(`AGENCY:                       ${agencyCount}`);
  console.log(`GOVT:                         ${govtCount}`);
  console.log(
    `UNKNOWN_REVIEW:               ${unknownReviewCount} (${((unknownReviewCount / totalActive) * 100).toFixed(1)}%)`,
  );
  console.log(
    `\nREAL ACCESSIBLE (STARTUP + SME + AGENCY + GOVT): ${realAccessible} (${accessibleShare.toFixed(1)}%)`,
  );

  console.log("\nTop 20 Active Companies:");
  const sorted = Object.entries(companyCounts).sort((a, b) => b[1] - a[1]);
  console.table(
    sorted.slice(0, 20).map(([company, jobs]) => ({
      company,
      jobs,
      pct: `${((jobs / totalActive) * 100).toFixed(1)}%`,
    })),
  );

  await prisma.$disconnect();
}

main().catch(console.error);
