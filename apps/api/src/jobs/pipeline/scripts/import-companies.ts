import * as dotenv from "dotenv";
dotenv.config();

import * as fs from "fs";
import * as path from "path";
import { PrismaService } from "../../../prisma/prisma.service";
import { AtsDetectorService } from "../company-registry/ats-detector.service";
import { CompanyImporterService } from "../company-registry/company-importer.service";

async function main() {
  const args = process.argv.slice(2);
  const fileArg = args.find((a) => a.startsWith("--file="))?.split("=")[1];
  const dryRun = args.includes("--dry-run");

  if (!fileArg) {
    console.error(
      "Usage: npx ts-node import-companies.ts --file=<path/to/companies.csv> [--dry-run]",
    );
    process.exit(1);
  }

  const resolvedPath = path.resolve(process.cwd(), fileArg);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }

  console.log(`=== COMPANY IMPORTER CLI (Dry Run: ${dryRun}) ===`);
  console.log(`Source File: ${resolvedPath}`);

  const content = fs.readFileSync(resolvedPath, "utf-8");
  const prisma = new PrismaService();
  const atsDetector = new AtsDetectorService();
  const importer = new CompanyImporterService(prisma, atsDetector);

  const rows = importer.parseCsv(content);
  console.log(`Parsed ${rows.length} rows from CSV.`);

  const summary = await importer.importCompanies(rows, { dryRun });

  console.log("\n=== IMPORT EXECUTION SUMMARY ===");
  console.log(`Total Rows Processed: ${summary.totalRows}`);
  console.log(`Imported New:         ${summary.importedCount}`);
  console.log(`Updated Existing:     ${summary.updatedCount}`);
  console.log(`Skipped Duplicates:   ${summary.skippedDuplicates}`);
  console.log(`Failed Rows:          ${summary.failedCount}`);

  if (summary.errors.length > 0) {
    console.log("\nErrors Encountered:");
    console.table(summary.errors);
  }

  console.log("\nRow-by-Row Details:");
  console.table(
    summary.results.map((r) => ({
      Row: r.rowNumber,
      Name: r.name,
      Domain: r.domain || "N/A",
      Status: r.status,
      ATS: r.atsType,
      Slug: r.atsSlug || "N/A",
      Verified: r.verified ? "YES" : "NO",
      Type: r.companyType,
    })),
  );

  await prisma.$disconnect();
}

main().catch(console.error);
