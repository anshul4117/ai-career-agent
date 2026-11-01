import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";
import { JobNormalizerService } from "../job-normalizer.service";

export async function proposeCapAndLocationCleanup() {
  const prisma = new PrismaService();
  const normalizer = new JobNormalizerService();

  console.log(
    "=== PROPOSED MIGRATION DRY-RUN: NON-INDIA & OVER-CAP CLEANUP ===",
  );

  const activeJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      location: true,
      companyId: true,
      company: { select: { id: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalActive = activeJobs.length;
  const nonIndiaJobsToDeactivate: string[] = [];
  const nonIndiaReasons: Record<string, number> = {};

  const indiaEligibleJobs: typeof activeJobs = [];

  for (const job of activeJobs) {
    const res = normalizer.evaluateIndiaEligibility(
      job.location || "",
      job.title,
      job.company.name,
      "",
    );

    if (!res.isIndiaEligible) {
      nonIndiaJobsToDeactivate.push(job.id);
      nonIndiaReasons[res.reason] = (nonIndiaReasons[res.reason] || 0) + 1;
    } else {
      indiaEligibleJobs.push(job);
    }
  }

  // Calculate company cap on remaining India-eligible jobs
  // Floor of 15, or 8% of remaining
  const minFloor = 15;
  const maxShare = 0.08;
  const capThreshold = Math.max(
    minFloor,
    Math.floor(indiaEligibleJobs.length * maxShare),
  );

  const companyCountMap = new Map<string, string[]>();
  for (const job of indiaEligibleJobs) {
    const list = companyCountMap.get(job.company.name) || [];
    list.push(job.id);
    companyCountMap.set(job.company.name, list);
  }

  const overCapJobsToDeactivate: string[] = [];
  const overCapCompanies: Record<
    string,
    { current: number; keep: number; deactivate: number }
  > = {};

  for (const [compName, jobIds] of companyCountMap.entries()) {
    if (jobIds.length > capThreshold) {
      const surplus = jobIds.slice(capThreshold);
      overCapJobsToDeactivate.push(...surplus);
      overCapCompanies[compName] = {
        current: jobIds.length,
        keep: capThreshold,
        deactivate: surplus.length,
      };
    }
  }

  const remainingActiveCount =
    totalActive -
    nonIndiaJobsToDeactivate.length -
    overCapJobsToDeactivate.length;

  console.log(`\n1. Current Active Jobs in DB: ${totalActive}`);
  console.log(
    `2. Non-India / Foreign-Remote Jobs Identified to Deactivate: ${nonIndiaJobsToDeactivate.length} (${((nonIndiaJobsToDeactivate.length / totalActive) * 100).toFixed(1)}%)`,
  );
  console.log(
    `3. India-Eligible Jobs Before Capping: ${indiaEligibleJobs.length}`,
  );
  console.log(`4. Cap Threshold per Company: ${capThreshold} jobs`);
  console.log(
    `5. Over-Cap Jobs to Deactivate: ${overCapJobsToDeactivate.length}`,
  );
  for (const [comp, stats] of Object.entries(overCapCompanies)) {
    console.log(
      `   - ${comp}: currently ${stats.current} India jobs -> keeping ${stats.keep}, deactivating ${stats.deactivate}`,
    );
  }
  console.log(
    `6. Resulting Active India-Focused Jobs: ${remainingActiveCount} (${((remainingActiveCount / totalActive) * 100).toFixed(1)}% of DB retained active)`,
  );

  // Compute resulting company distribution
  const finalCompanyCounts = new Map<string, number>();
  for (const [compName, jobIds] of companyCountMap.entries()) {
    const kept = Math.min(jobIds.length, capThreshold);
    finalCompanyCounts.set(compName, kept);
  }

  console.log(
    "\n--- Projected Top Companies Share After Proposed Migration ---",
  );
  const sortedFinal = Array.from(finalCompanyCounts.entries()).sort(
    (a, b) => b[1] - a[1],
  );
  for (const [comp, count] of sortedFinal.slice(0, 15)) {
    const share = ((count / remainingActiveCount) * 100).toFixed(1);
    console.log(` - ${comp.padEnd(20)}: ${count} jobs (${share}%)`);
  }

  const mncNames = ["Coinbase", "Stripe", "Figma", "Brex", "Lemon.io"];
  let totalMncKept = 0;
  for (const [comp, count] of finalCompanyCounts.entries()) {
    if (mncNames.includes(comp)) {
      totalMncKept += count;
    }
  }
  const mncShare = ((totalMncKept / remainingActiveCount) * 100).toFixed(1);
  const accessibleShare = (100 - parseFloat(mncShare)).toFixed(1);

  console.log(`\nProjected MNC Share: ${mncShare}% (down from 83.0%)`);
  console.log(
    `Projected Accessible / Indian Startups & Tech Share: ${accessibleShare}% (up from 17.0%)`,
  );

  await prisma.$disconnect();

  return {
    totalActive,
    nonIndiaCount: nonIndiaJobsToDeactivate.length,
    overCapCount: overCapJobsToDeactivate.length,
    remainingActiveCount,
    projectedMncShare: mncShare,
    projectedAccessibleShare: accessibleShare,
    nonIndiaJobIds: nonIndiaJobsToDeactivate,
    overCapJobIds: overCapJobsToDeactivate,
  };
}

if (require.main === module) {
  proposeCapAndLocationCleanup().catch(console.error);
}
