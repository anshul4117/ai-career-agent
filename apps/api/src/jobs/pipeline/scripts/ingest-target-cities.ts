import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { JobPipelineService } from "../job-pipeline.service";
import { PrismaService } from "../../../prisma/prisma.service";

async function main() {
  console.log(
    "=== INGESTING REAL JOBS FOR NOIDA, MUMBAI, DELHI, NCR, NEW DELHI ===",
  );
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["log", "warn", "error"],
  });

  const pipeline = app.get(JobPipelineService);
  const prisma = app.get(PrismaService);

  const targetLocations = [
    {
      city: "Noida",
      queries: ["software engineer", "developer", "fresher", "sales"],
    },
    {
      city: "Delhi",
      queries: ["software engineer", "fresher", "data analyst", "accountant"],
    },
    {
      city: "Mumbai",
      queries: ["software engineer", "finance", "fresher", "marketing"],
    },
    {
      city: "Gurgaon",
      queries: [
        "software engineer",
        "fresher",
        "business analyst",
        "operations",
      ],
    },
  ];

  for (const loc of targetLocations) {
    for (const q of loc.queries) {
      console.log(`\nFetching Jooble: "${q}" in "${loc.city}"...`);
      try {
        const result = await pipeline.runPipeline({
          query: q,
          location: loc.city,
          maxPages: 1,
          providerNames: ["JOOBLE"],
        });
        console.log(
          `Result for ${loc.city} ("${q}"): Ingested: ${result.totalIngested}, Approved: ${result.approvedCount}, New: ${result.newCount}`,
        );
      } catch (err: unknown) {
        console.error(
          `Error fetching ${loc.city} ("${q}"):`,
          (err as Error).message,
        );
      }
    }
  }

  // Check counts per location in DB
  const sampleJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      location: true,
      company: { select: { name: true, companyType: true } },
    },
    take: 30,
    orderBy: { createdAt: "desc" },
  });

  console.log("\n=== SAMPLE RECENTLY INGESTED ACTIVE JOBS ===");
  console.table(
    sampleJobs.map((j) => ({
      ID: j.id.slice(0, 8),
      Title: j.title.slice(0, 30),
      Company: j.company.name.slice(0, 20),
      Type: j.company.companyType,
      Location: j.location,
    })),
  );

  const cityCounts = await prisma.job.groupBy({
    by: ["location"],
    _count: { id: true },
    where: { isActive: true },
  });

  console.log("\n=== ACTIVE JOBS BREAKDOWN BY LOCATION IN DB ===");
  console.table(
    cityCounts.map((c) => ({ Location: c.location, ActiveJobs: c._count.id })),
  );

  await app.close();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
