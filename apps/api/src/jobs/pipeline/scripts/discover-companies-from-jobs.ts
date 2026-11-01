import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";
import { AtsDetectorService } from "../company-registry/ats-detector.service";
import { CompanyDiscoveryService } from "../company-registry/company-discovery.service";

async function main() {
  console.log("=== RUNNING COMPANY DISCOVERY FROM JOB RECORDS ===");
  const prisma = new PrismaService();
  const detector = new AtsDetectorService();
  const discovery = new CompanyDiscoveryService(prisma, detector);

  const summary = await discovery.runDiscovery();

  console.log("\n=== DISCOVERY EXECUTION SUMMARY ===");
  console.log(`Total Jobs Scanned:        ${summary.totalJobsScanned}`);
  console.log(`Total Companies Scanned:   ${summary.totalCompaniesScanned}`);
  console.log(`Newly Created Companies:   ${summary.newlyCreatedCompanies}`);
  console.log(`Newly Discovered ATS:      ${summary.newlyDiscoveredAts}`);
  console.log(`Verified ATS Count:        ${summary.verifiedAtsCount}`);

  console.log("\nDiscovered Companies:");
  console.table(
    summary.companies.slice(0, 30).map((c) => ({
      Name: c.name,
      Domain: c.domain || "N/A",
      ATS: c.atsType,
      Slug: c.atsSlug || "N/A",
      "Live Jobs": c.jobCount ?? "N/A",
      Verified: c.verified ? "YES" : "NO",
    })),
  );

  await prisma.$disconnect();
}

main().catch(console.error);
