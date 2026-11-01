import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { JobPipelineService } from "../job-pipeline.service";
import { QueryMatrixService } from "../query-matrix/query-matrix.service";
import { PrismaService } from "../../../prisma/prisma.service";

async function main() {
  console.log("=== EXECUTING PHASE 3 QUERY MATRIX PIPELINE SLICE BATCH ===");
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["log", "warn", "error"],
  });

  const pipelineService = app.get(JobPipelineService);
  const matrixService = app.get(QueryMatrixService);
  const prisma = app.get(PrismaService);

  // 1. Fetch next batch of slices (e.g. 6 interleaved slices across IT and non-IT)
  const batchSize = 6;
  const slices = matrixService.getNextBatch(batchSize);
  console.log(`Fetched ${slices.length} query slices for current batch:`);
  console.table(
    slices.map((s) => ({
      ID: s.id,
      Category: s.category,
      Keyword: s.keyword,
      City: `${s.city} (${s.tier})`,
      Exp: s.experienceBand,
      Mode: s.workMode,
      Query: s.queryTerm,
    })),
  );

  // 2. Execute pipeline for each slice and track yields
  for (const slice of slices) {
    console.log(
      `\n--- Running Slice [${slice.id}] ${slice.category}: "${slice.queryTerm}" in ${slice.city} ---`,
    );
    const summary = await pipelineService.runPipeline({
      query: slice.queryTerm,
      location: slice.city,
      maxPages: 1,
      providerNames: ["JOOBLE", "CAREERJET"],
    });

    // Record yield in query matrix
    matrixService.recordYield(slice, {
      fetched: summary.totalIngested,
      indiaEligible: summary.approvedCount + summary.rejectedCount,
      newJobs: summary.newCount,
      tier2Or3Jobs:
        slice.tier === "TIER_2" || slice.tier === "TIER_3"
          ? summary.totalIngested
          : 0,
    });

    console.log(
      `Slice [${slice.id}] Finished -> Ingested: ${summary.totalIngested}, Approved: ${summary.approvedCount}, New: ${summary.newCount}, Rejected: ${summary.rejectedCount}`,
    );
  }

  // 3. Print Yield Summary
  console.log("\n=== QUERY MATRIX YIELD SUMMARY ===");
  const yieldSummary = matrixService.getYieldSummary();
  console.log(`Total Matrix Slices:   ${yieldSummary.totalSlicesInMatrix}`);
  console.log(`Slices Executed:       ${yieldSummary.slicesExecuted}`);
  console.log(`Total Jobs Fetched:    ${yieldSummary.totalFetched}`);
  console.log(`Total New Jobs:        ${yieldSummary.totalNewJobs}`);
  console.log(`Tier-2/3 Jobs:         ${yieldSummary.tier2Or3JobsCollected}`);
  console.log(`Zero Yield Slices:     ${yieldSummary.zeroYieldSlicesCount}`);

  // 4. Source Transparency Report
  console.log("\n=== SOURCE STATUS & CONTRIBUTIONS ===");
  console.table(matrixService.getSourceStatusReport());

  // 5. Database Status
  const [totalJobs, activeJobs, mncJobs, startupJobs] = await Promise.all([
    prisma.job.count(),
    prisma.job.count({ where: { isActive: true } }),
    prisma.job.count({
      where: {
        isActive: true,
        company: { companyType: "MNC" },
      },
    }),
    prisma.job.count({
      where: {
        isActive: true,
        company: { companyType: "STARTUP" },
      },
    }),
  ]);

  console.log("\n=== POST-INGESTION DATABASE COUNTS ===");
  console.log(`Total Jobs in DB:  ${totalJobs}`);
  console.log(`Active Jobs in DB: ${activeJobs}`);
  console.log(`Active MNC Jobs:   ${mncJobs}`);
  console.log(`Active Startups:   ${startupJobs}`);

  await app.close();
}

main().catch((err) => {
  console.error("Error executing query matrix slice runner:", err);
  process.exit(1);
});
