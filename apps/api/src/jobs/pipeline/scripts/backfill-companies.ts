import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";
import { CompanyType, AtsType } from "@prisma/client";

export function extractDomain(urlOrDomain?: string | null): string | null {
  if (!urlOrDomain) return null;
  let clean = urlOrDomain.trim().toLowerCase();
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?/i, "");
  clean = clean.split("/")[0].split("?")[0].split(":")[0];
  if (clean.includes(".") && !clean.includes(" ")) {
    return clean;
  }
  return null;
}

const KNOWN_MNCS = new Set([
  "coinbase",
  "stripe",
  "figma",
  "brex",
  "coalition technologies",
  "lemon.io",
  "askable",
]);

const KNOWN_INDIAN_LARGE = new Set([
  "swiggy",
  "zomato",
  "phonepe",
  "razorpay",
  "meesho",
  "browserstack",
]);

const KNOWN_STARTUPS = new Set([
  "cred",
  "zepto",
  "groww",
  "slice",
  "urban company",
  "postman",
  "ather energy",
  "juspay",
  "jupiter",
  "clevertap",
  "yellow.ai",
]);

const KNOWN_ATS: Record<string, { atsType: AtsType; atsSlug: string }> = {
  coinbase: { atsType: AtsType.GREENHOUSE, atsSlug: "coinbase" },
  stripe: { atsType: AtsType.GREENHOUSE, atsSlug: "stripe" },
  figma: { atsType: AtsType.GREENHOUSE, atsSlug: "figma" },
  cred: { atsType: AtsType.LEVER, atsSlug: "cred" },
};

export async function backfillCompanies() {
  const prisma = new PrismaService();
  console.log("=== BACKFILLING EXISTING COMPANIES IN DB ===");

  const companies = await prisma.company.findMany();
  console.log(`Found ${companies.length} companies to classify.`);

  let updatedCount = 0;

  for (const comp of companies) {
    const nameLower = comp.name.toLowerCase();
    const domain =
      extractDomain(comp.websiteUrl) ||
      extractDomain(`${comp.companySlug}.com`);

    let companyType: CompanyType = CompanyType.UNKNOWN_REVIEW;
    if (KNOWN_MNCS.has(nameLower)) {
      companyType = CompanyType.MNC;
    } else if (KNOWN_INDIAN_LARGE.has(nameLower)) {
      companyType = CompanyType.INDIAN_LARGE;
    } else if (KNOWN_STARTUPS.has(nameLower)) {
      companyType = CompanyType.STARTUP;
    }

    const atsInfo = KNOWN_ATS[comp.companySlug] || KNOWN_ATS[nameLower];
    const atsType = atsInfo ? atsInfo.atsType : AtsType.NONE;
    const atsSlug = atsInfo ? atsInfo.atsSlug : null;
    const verified = Boolean(atsInfo);

    await prisma.company.update({
      where: { id: comp.id },
      data: {
        domain: domain || undefined,
        companyType,
        atsType,
        atsSlug,
        verified,
        lastCheckedAt: new Date(),
      },
    });

    updatedCount++;
  }

  console.log(`Backfilled ${updatedCount} companies successfully.`);
  await prisma.$disconnect();
}

if (require.main === module) {
  backfillCompanies().catch(console.error);
}
