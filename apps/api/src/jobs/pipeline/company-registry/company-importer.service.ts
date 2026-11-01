import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../../../prisma/prisma.service";
import { AtsDetectorService } from "./ats-detector.service";
import { CompanyType, AtsType, Company } from "@prisma/client";
import { extractDomain } from "../scripts/backfill-companies";

export interface CompanyImportRow {
  name: string;
  website?: string;
  careerUrl?: string;
  city?: string;
  state?: string;
  companyType?: string;
  sizeBand?: string;
  notes?: string;
}

export interface RowImportResult {
  rowNumber: number;
  name: string;
  domain: string | null;
  status: "IMPORTED" | "UPDATED" | "SKIPPED_DUPLICATE" | "FAILED" | "DRY_RUN";
  atsType: AtsType;
  atsSlug: string | null;
  verified: boolean;
  companyType: CompanyType;
  error?: string;
}

export interface CompanyImportSummary {
  dryRun: boolean;
  totalRows: number;
  importedCount: number;
  updatedCount: number;
  skippedDuplicates: number;
  failedCount: number;
  results: RowImportResult[];
  errors: { row: number; error: string }[];
}

@Injectable()
export class CompanyImporterService {
  private readonly logger = new Logger(CompanyImporterService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly atsDetector: AtsDetectorService,
  ) {}

  /**
   * Parse CSV string into CompanyImportRow array.
   */
  parseCsv(csvContent: string): CompanyImportRow[] {
    const lines = csvContent
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length <= 1) return [];

    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const nameIdx = header.indexOf("name");
    const websiteIdx = header.indexOf("website");
    const careerUrlIdx = header.indexOf("careerurl");
    const cityIdx = header.indexOf("city");
    const stateIdx = header.indexOf("state");
    const typeIdx = header.indexOf("companytype");
    const sizeIdx = header.indexOf("sizeband");
    const notesIdx = header.indexOf("notes");

    const rows: CompanyImportRow[] = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      // Skip commented or empty rows
      if (line.startsWith("#") || line.startsWith("//")) continue;

      // Basic comma split respecting quoted values
      const cols = this.splitCsvLine(line);
      if (!cols || cols.length === 0) continue;

      const name = nameIdx !== -1 ? cols[nameIdx] : cols[0];
      if (!name) continue;

      rows.push({
        name: name.trim(),
        website: websiteIdx !== -1 ? cols[websiteIdx]?.trim() : undefined,
        careerUrl: careerUrlIdx !== -1 ? cols[careerUrlIdx]?.trim() : undefined,
        city: cityIdx !== -1 ? cols[cityIdx]?.trim() : undefined,
        state: stateIdx !== -1 ? cols[stateIdx]?.trim() : undefined,
        companyType: typeIdx !== -1 ? cols[typeIdx]?.trim() : undefined,
        sizeBand: sizeIdx !== -1 ? cols[sizeIdx]?.trim() : undefined,
        notes: notesIdx !== -1 ? cols[notesIdx]?.trim() : undefined,
      });
    }

    return rows;
  }

  private splitCsvLine(line: string): string[] {
    const result: string[] = [];
    let cur = "";
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        result.push(cur.trim());
        cur = "";
      } else {
        cur += char;
      }
    }
    result.push(cur.trim());
    return result;
  }

  async importCompanies(
    rows: CompanyImportRow[],
    options: { dryRun?: boolean } = {},
  ): Promise<CompanyImportSummary> {
    const dryRun = Boolean(options.dryRun);
    this.logger.log(
      `Starting company import for ${rows.length} rows (Dry Run: ${dryRun})`,
    );

    const summary: CompanyImportSummary = {
      dryRun,
      totalRows: rows.length,
      importedCount: 0,
      updatedCount: 0,
      skippedDuplicates: 0,
      failedCount: 0,
      results: [],
      errors: [],
    };

    const seenDomainsInBatch = new Set<string>();

    for (let i = 0; i < rows.length; i++) {
      const rowNum = i + 1;
      const row = rows[i];

      if (!row.name) {
        summary.failedCount++;
        summary.errors.push({ row: rowNum, error: "Missing company name" });
        summary.results.push({
          rowNumber: rowNum,
          name: "Unknown",
          domain: null,
          status: "FAILED",
          atsType: AtsType.NONE,
          atsSlug: null,
          verified: false,
          companyType: CompanyType.UNKNOWN_REVIEW,
          error: "Missing company name",
        });
        continue;
      }

      const domain =
        extractDomain(row.website) ||
        extractDomain(row.careerUrl) ||
        extractDomain(`${this.slugify(row.name)}.com`);

      // In-batch domain deduplication
      if (domain && seenDomainsInBatch.has(domain)) {
        summary.skippedDuplicates++;
        summary.results.push({
          rowNumber: rowNum,
          name: row.name,
          domain,
          status: "SKIPPED_DUPLICATE",
          atsType: AtsType.NONE,
          atsSlug: null,
          verified: false,
          companyType: CompanyType.UNKNOWN_REVIEW,
          error: `Duplicate domain [${domain}] in import payload`,
        });
        continue;
      }

      if (domain) {
        seenDomainsInBatch.add(domain);
      }

      try {
        // Run ATS detection & public endpoint validation
        const targetDetectUrl = row.careerUrl || row.website || domain || "";
        const atsResult =
          await this.atsDetector.detectAndValidate(targetDetectUrl);

        // Determine companyType
        const resolvedType = this.resolveCompanyType(
          row.companyType,
          row.sizeBand,
        );

        const companySlug = this.slugify(row.name);

        if (dryRun) {
          summary.importedCount++;
          summary.results.push({
            rowNumber: rowNum,
            name: row.name,
            domain,
            status: "DRY_RUN",
            atsType: atsResult.atsType,
            atsSlug: atsResult.atsSlug || null,
            verified: atsResult.endpointOk,
            companyType: resolvedType,
          });
          continue;
        }

        // Live Upsert: find by domain or companySlug
        let existing: Company | null = null;
        if (domain) {
          existing = await this.prisma.company.findFirst({
            where: { domain },
          });
        }
        if (!existing) {
          existing = await this.prisma.company.findUnique({
            where: { companySlug },
          });
        }

        const isNew = !existing;

        const resolvedState =
          row.state || this.inferStateFromCity(row.city) || existing?.state;

        await this.prisma.company.upsert({
          where: { companySlug },
          update: {
            name: row.name,
            domain: domain || undefined,
            websiteUrl: row.website || existing?.websiteUrl,
            careerUrl: row.careerUrl || existing?.careerUrl,
            careerPageUrl: row.careerUrl || existing?.careerPageUrl,
            city: row.city || existing?.city,
            state: resolvedState,
            sizeBand: row.sizeBand || existing?.sizeBand,
            companyType: resolvedType,
            atsType:
              atsResult.atsType !== AtsType.NONE
                ? atsResult.atsType
                : existing?.atsType,
            atsSlug: atsResult.atsSlug || existing?.atsSlug,
            verified: atsResult.endpointOk || Boolean(existing?.verified),
            lastCheckedAt: new Date(),
          },
          create: {
            name: row.name,
            companySlug,
            domain,
            websiteUrl: row.website,
            careerUrl: row.careerUrl,
            careerPageUrl: row.careerUrl,
            city: row.city,
            state: resolvedState,
            sizeBand: row.sizeBand,
            companyType: resolvedType,
            atsType: atsResult.atsType,
            atsSlug: atsResult.atsSlug,
            verified: atsResult.endpointOk,
            lastCheckedAt: new Date(),
          },
        });

        if (isNew) {
          summary.importedCount++;
        } else {
          summary.updatedCount++;
        }

        summary.results.push({
          rowNumber: rowNum,
          name: row.name,
          domain,
          status: isNew ? "IMPORTED" : "UPDATED",
          atsType: atsResult.atsType,
          atsSlug: atsResult.atsSlug || null,
          verified: atsResult.endpointOk,
          companyType: resolvedType,
        });
      } catch (err: unknown) {
        summary.failedCount++;
        const errMsg = (err as Error).message || String(err);
        summary.errors.push({ row: rowNum, error: errMsg });
        summary.results.push({
          rowNumber: rowNum,
          name: row.name,
          domain,
          status: "FAILED",
          atsType: AtsType.NONE,
          atsSlug: null,
          verified: false,
          companyType: CompanyType.UNKNOWN_REVIEW,
          error: errMsg,
        });
      }
    }

    return summary;
  }

  private resolveCompanyType(rawType?: string, sizeBand?: string): CompanyType {
    if (rawType) {
      const upper = rawType.toUpperCase().trim();
      if (upper === "MNC") return CompanyType.MNC;
      if (upper === "INDIAN_LARGE") return CompanyType.INDIAN_LARGE;
      if (upper === "STARTUP") return CompanyType.STARTUP;
      if (upper === "SME") return CompanyType.SME;
      if (upper === "AGENCY") return CompanyType.AGENCY;
      if (upper === "GOVT") return CompanyType.GOVT;
    }

    if (sizeBand) {
      const s = sizeBand.trim();
      if (s === "1001-5000" || s === "5000+") {
        return CompanyType.INDIAN_LARGE;
      }
      if (s === "1-10" || s === "11-50" || s === "51-200") {
        return CompanyType.STARTUP;
      }
    }

    return CompanyType.UNKNOWN_REVIEW;
  }

  private inferStateFromCity(city?: string): string | undefined {
    if (!city) return undefined;
    const c = city.toLowerCase().trim();
    if (
      [
        "meerut",
        "lucknow",
        "kanpur",
        "noida",
        "greater noida",
        "ghaziabad",
        "agra",
        "varanasi",
      ].includes(c)
    ) {
      return "Uttar Pradesh";
    }
    if (["indore", "bhopal", "gwalior", "jabalpur"].includes(c)) {
      return "Madhya Pradesh";
    }
    if (["jaipur", "udaipur", "jodhpur", "kota"].includes(c)) {
      return "Rajasthan";
    }
    if (
      ["chandigarh", "mohali", "ludhiana", "amritsar", "panchkula"].includes(c)
    ) {
      return c === "chandigarh" ? "Chandigarh (UT)" : "Punjab";
    }
    if (["nagpur", "pune", "mumbai", "nashik"].includes(c)) {
      return "Maharashtra";
    }
    if (["bengaluru", "bangalore", "mysore", "mysuru"].includes(c)) {
      return "Karnataka";
    }
    if (["hyderabad", "warangal"].includes(c)) {
      return "Telangana";
    }
    if (["chennai", "coimbatore", "madurai"].includes(c)) {
      return "Tamil Nadu";
    }
    if (["kochi", "thiruvananthapuram", "trivandrum"].includes(c)) {
      return "Kerala";
    }
    if (["patna"].includes(c)) return "Bihar";
    if (["bhubaneswar"].includes(c)) return "Odisha";
    if (["kolkata"].includes(c)) return "West Bengal";
    return undefined;
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
}
