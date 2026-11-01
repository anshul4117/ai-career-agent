import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { JobPipelineService } from "../job-pipeline.service";
import { PrismaService } from "../../../prisma/prisma.service";
import { LocationConfidence } from "@prisma/client";

async function main() {
  console.log(
    "=== RUNNING TIER-2/3 QUERY MATRIX INGESTION (HONEST TAXONOMY & CONFIDENCE) ===\n",
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["warn", "error"],
  });

  const pipeline = app.get(JobPipelineService);
  const prisma = app.get(PrismaService);

  const targetCities = [
    "Meerut",
    "Lucknow",
    "Kanpur",
    "Agra",
    "Varanasi",
    "Indore",
    "Bhopal",
    "Jaipur",
    "Nagpur",
    "Chandigarh",
    "Dehradun",
    "Noida",
  ];

  const roleCategories = [
    // IT roles
    { role: "software engineer", category: "IT" },
    { role: "fresher developer", category: "IT" },
    // Non-IT roles
    { role: "sales fresher", category: "SALES" },
    { role: "customer support", category: "SUPPORT" },
    { role: "accountant tally", category: "ACCOUNTS" },
    { role: "marketing executive", category: "MARKETING" },
    { role: "operations associate", category: "OPERATIONS" },
    { role: "teacher tutor", category: "TEACHING" },
  ];

  const perCityResults: Record<
    string,
    {
      queriesRun: number;
      rawFetched: number;
      approved: number;
    }
  > = {};

  for (const city of targetCities) {
    perCityResults[city] = { queriesRun: 0, rawFetched: 0, approved: 0 };

    for (const r of roleCategories) {
      try {
        perCityResults[city].queriesRun++;
        const summary = await pipeline.runPipeline({
          query: r.role,
          location: city,
          maxPages: 1,
          providerNames: ["JOOBLE"],
        });
        perCityResults[city].rawFetched += summary.totalIngested;
        perCityResults[city].approved += summary.approvedCount;
      } catch (err: unknown) {
        console.error(
          `Error querying "${r.role}" in "${city}":`,
          (err as Error).message,
        );
      }
    }
    console.log(
      `Finished queries for ${city.padEnd(12)} -> Fetched: ${perCityResults[city].rawFetched}, Approved: ${perCityResults[city].approved}`,
    );
  }

  // Generate Honest Location Report from Database
  console.log("\n=== HONEST CITY-LEVEL SUPPLY REPORT (ACTIVE JOBS ONLY) ===");
  const allActiveJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      id: true,
      city: true,
      queriedCity: true,
      locationConfidence: true,
      locationSource: true,
      location: true,
      isIndiaJob: true,
      company: { select: { companyType: true } },
    },
  });

  const citySupplyMap: Record<
    string,
    {
      exactConfirmedHigh: number;
      textParsedMedium: number;
      queryHintOnlyLow: number;
      totalVerifiableSupply: number;
    }
  > = {};

  for (const city of targetCities) {
    citySupplyMap[city] = {
      exactConfirmedHigh: 0,
      textParsedMedium: 0,
      queryHintOnlyLow: 0,
      totalVerifiableSupply: 0,
    };
  }

  let panIndiaOrRemote = 0;

  for (const j of allActiveJobs) {
    if (j.city && citySupplyMap[j.city]) {
      if (j.locationConfidence === LocationConfidence.HIGH) {
        citySupplyMap[j.city].exactConfirmedHigh++;
        citySupplyMap[j.city].totalVerifiableSupply++;
      } else if (j.locationConfidence === LocationConfidence.MEDIUM) {
        citySupplyMap[j.city].textParsedMedium++;
        citySupplyMap[j.city].totalVerifiableSupply++;
      }
    } else if (j.queriedCity && citySupplyMap[j.queriedCity]) {
      citySupplyMap[j.queriedCity].queryHintOnlyLow++;
    } else {
      panIndiaOrRemote++;
    }
  }

  console.table(
    Object.entries(citySupplyMap).map(([city, s]) => ({
      City: city,
      "HIGH (Source City)": s.exactConfirmedHigh,
      "MEDIUM (Parsed from Text)": s.textParsedMedium,
      "VERIFIABLE SUPPLY (High+Med)": s.totalVerifiableSupply,
      "LOW (QUERY_HINT Only, No Proof)": s.queryHintOnlyLow,
    })),
  );

  console.log(`Pan-India / Remote Active Jobs: ${panIndiaOrRemote}`);
  console.log(`Total Active Jobs in DB: ${allActiveJobs.length}`);

  await app.close();
}

main().catch((e) => {
  console.error("Execution failed:", e);
  process.exit(1);
});
