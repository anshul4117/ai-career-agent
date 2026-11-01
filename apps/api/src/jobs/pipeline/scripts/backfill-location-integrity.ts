import * as dotenv from "dotenv";
dotenv.config();

import { NestFactory } from "@nestjs/core";
import { AppModule } from "../../../app.module";
import { PrismaService } from "../../../prisma/prisma.service";
import { LocationDerivationService } from "../stages/location-derivation.service";
import { LocationConfidence, LocationSource } from "@prisma/client";

async function main() {
  const isApply = process.argv.includes("--apply");
  console.log(
    `=== RUNNING LOCATION INTEGRITY AUDIT & BACKFILL (Mode: ${isApply ? "APPLY" : "DRY RUN"}) ===\n`,
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ["error", "warn"],
  });

  const prisma = app.get(PrismaService);
  const derivationService = new LocationDerivationService();

  const allJobs = await prisma.job.findMany({
    select: {
      id: true,
      title: true,
      location: true,
      rawLocation: true,
      description: true,
      isActive: true,
      company: { select: { name: true } },
      jobSources: { select: { source: true, sourceJobUrl: true }, take: 1 },
    },
  });

  console.log(`Found ${allJobs.length} total jobs in database.`);

  let exactSourceCount = 0;
  let parsedTextCount = 0;
  let queryHintCount = 0;
  let panIndiaCount = 0;

  // Track the breakdown of previous Noida/Delhi/Gurgaon/Mumbai tagged jobs
  const previouslyTaggedStats: Record<
    string,
    { total: number; confirmedInText: number; queryHintOnly: number }
  > = {
    Noida: { total: 0, confirmedInText: 0, queryHintOnly: 0 },
    Delhi: { total: 0, confirmedInText: 0, queryHintOnly: 0 },
    Gurgaon: { total: 0, confirmedInText: 0, queryHintOnly: 0 },
    Mumbai: { total: 0, confirmedInText: 0, queryHintOnly: 0 },
  };

  const sampleUpdates: Record<string, unknown>[] = [];

  for (const job of allJobs) {
    const locStr = job.location || "";
    const isJooble =
      job.jobSources?.[0]?.sourceJobUrl?.includes("jooble") || false;
    let detectedQueriedCity: string | null = null;

    // Check if job was previously rewritten with a city tag
    for (const city of ["Noida", "Delhi", "Gurgaon", "Mumbai"]) {
      if (locStr.toLowerCase().includes(city.toLowerCase())) {
        detectedQueriedCity = city;
        previouslyTaggedStats[city].total++;
        break;
      }
    }

    // Determine the true rawLocation from source:
    // If it was ingested from Jooble during the slice, Jooble only gave "India"
    const trueRawLocation =
      job.rawLocation || (isJooble ? "India" : job.location || "India");

    const derived = derivationService.deriveLocation({
      rawLocation: trueRawLocation,
      title: job.title,
      description: job.description,
      queriedCity: isJooble ? detectedQueriedCity : undefined,
    });

    if (detectedQueriedCity) {
      if (
        derived.city &&
        derived.locationConfidence !== LocationConfidence.LOW
      ) {
        previouslyTaggedStats[detectedQueriedCity].confirmedInText++;
      } else {
        previouslyTaggedStats[detectedQueriedCity].queryHintOnly++;
      }
    }

    if (derived.locationConfidence === LocationConfidence.HIGH) {
      exactSourceCount++;
    } else if (derived.locationConfidence === LocationConfidence.MEDIUM) {
      parsedTextCount++;
    } else if (derived.locationSource === LocationSource.QUERY_HINT) {
      queryHintCount++;
    } else {
      panIndiaCount++;
    }

    if (sampleUpdates.length < 15) {
      sampleUpdates.push({
        Title: job.title.slice(0, 25),
        Company: job.company.name.slice(0, 15),
        OldLocation: job.location,
        NewRawLocation: derived.rawLocation,
        DerivedCity: derived.city || "NONE",
        QueriedCity: derived.queriedCity || "NONE",
        Confidence: derived.locationConfidence,
        Source: derived.locationSource,
      });
    }

    if (isApply) {
      await prisma.job.update({
        where: { id: job.id },
        data: {
          rawLocation: derived.rawLocation,
          city: derived.city,
          state: derived.state,
          queriedCity: derived.queriedCity,
          locationSource: derived.locationSource,
          locationConfidence: derived.locationConfidence,
          location: derived.city
            ? `${derived.city}, India`
            : derived.rawLocation,
        },
      });
    }
  }

  console.log("\n=== AUDIT REPORT: PREVIOUSLY TAGGED TARGET CITY JOBS ===");
  console.table(
    Object.entries(previouslyTaggedStats).map(([city, stats]) => ({
      City: city,
      "Previously Tagged": stats.total,
      "Confirmed (Title/Desc Evidence)": stats.confirmedInText,
      "QUERY_HINT Only (No City Evidence)": stats.queryHintOnly,
    })),
  );

  console.log("\n=== OVERALL CONFIDENCE & DERIVATION BREAKDOWN ===");
  console.log(
    `HIGH Confidence (Explicit Source City):        ${exactSourceCount}`,
  );
  console.log(
    `MEDIUM Confidence (Parsed from Title/Desc):     ${parsedTextCount}`,
  );
  console.log(
    `LOW Confidence (QUERY_HINT Only, No City Proof): ${queryHintCount}`,
  );
  console.log(
    `Pan-India / Remote Unspecified:                 ${panIndiaCount}`,
  );

  console.log("\n=== SAMPLE DERIVATION UPDATES ===");
  console.table(sampleUpdates);

  if (!isApply) {
    console.log(
      "\n[DRY RUN COMPLETE] To persist these updates to the database, run with --apply.",
    );
  } else {
    console.log(
      "\n[SUCCESS] Backfill applied cleanly to all rows in the database.",
    );
  }

  await app.close();
}

main().catch((err) => {
  console.error("Backfill error:", err);
  process.exit(1);
});
