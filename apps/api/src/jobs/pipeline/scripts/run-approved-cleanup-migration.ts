import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";
import { proposeCapAndLocationCleanup } from "./propose-cap-and-location-cleanup";

/**
 * CAUTION: Run ONLY after explicit user approval!
 * This migration marks 297 non-India jobs and 34 over-cap jobs as isActive = false.
 * It is additive and reversible (does NOT delete any database rows).
 */
async function main() {
  console.log("=== EXECUTING APPROVED MIGRATION: CAP & LOCATION CLEANUP ===");
  const prisma = new PrismaService();

  const proposal = await proposeCapAndLocationCleanup();
  const allToDeactivate = [
    ...proposal.nonIndiaJobIds,
    ...proposal.overCapJobIds,
  ];

  console.log(`Deactivating ${allToDeactivate.length} jobs in database...`);

  // 1. Mark non-India jobs
  await prisma.job.updateMany({
    where: { id: { in: proposal.nonIndiaJobIds } },
    data: {
      isActive: false,
      isIndiaEligible: false,
      indiaEligibilityReason: "DEACTIVATED_FOREIGN_OR_NON_INDIA_LOCATION",
    },
  });

  // 2. Mark over-cap jobs
  await prisma.job.updateMany({
    where: { id: { in: proposal.overCapJobIds } },
    data: {
      isActive: false,
      isIndiaEligible: true,
      indiaEligibilityReason: "DEACTIVATED_OVER_COMPANY_CAP_LIMIT",
    },
  });

  // 3. Update remaining active India jobs with eligible flag
  await prisma.job.updateMany({
    where: {
      isActive: true,
      NOT: { id: { in: allToDeactivate } },
    },
    data: {
      isIndiaEligible: true,
      indiaEligibilityReason: "VERIFIED_INDIA_ELIGIBLE",
    },
  });

  const finalActiveCount = await prisma.job.count({
    where: { isActive: true },
  });
  console.log(`Migration Complete! Current Active Jobs: ${finalActiveCount}`);

  await prisma.$disconnect();
}

if (require.main === module) {
  main().catch(console.error);
}
