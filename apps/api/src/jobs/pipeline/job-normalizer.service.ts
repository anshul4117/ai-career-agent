import { Injectable } from "@nestjs/common";
import * as crypto from "crypto";
import { EmploymentType, SalaryPeriod, WorkMode } from "@prisma/client";
import { NormalizedJob, RawJobInput } from "./types/job-pipeline.types";
import { LocationDerivationService } from "./stages/location-derivation.service";

const TECH_SKILLS_TAXONOMY = [
  "JavaScript",
  "TypeScript",
  "Python",
  "Java",
  "Go",
  "Golang",
  "Rust",
  "C++",
  "C#",
  "Ruby",
  "PHP",
  "Kotlin",
  "Swift",
  "React",
  "Next.js",
  "Vue",
  "Angular",
  "Svelte",
  "Node.js",
  "Express",
  "NestJS",
  "FastAPI",
  "Django",
  "Flask",
  "Spring Boot",
  "HTML",
  "CSS",
  "TailwindCSS",
  "Sass",
  "Bootstrap",
  "PostgreSQL",
  "MySQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "DynamoDB",
  "Prisma",
  "TypeORM",
  "Elasticsearch",
  "AWS",
  "GCP",
  "Azure",
  "Docker",
  "Kubernetes",
  "Terraform",
  "CI/CD",
  "GitHub Actions",
  "Vercel",
  "GraphQL",
  "REST",
  "gRPC",
  "Kafka",
  "RabbitMQ",
  "Microservices",
  "PyTorch",
  "TensorFlow",
  "NLP",
  "LLM",
  "RAG",
  "LangChain",
  "Vector DB",
  "OpenAI",
  "Jest",
  "Playwright",
  "Cypress",
  "Git",
  "Linux",
];

@Injectable()
export class JobNormalizerService {
  constructor(
    private readonly locationDerivationService: LocationDerivationService = new LocationDerivationService(),
  ) {}

  normalize(raw: RawJobInput): NormalizedJob {
    const title = this.cleanString(raw.title);
    const companyName = this.cleanString(raw.companyName);
    const description = raw.description?.trim() || "";
    const rawLocation = this.cleanString(
      raw.rawLocation || raw.location || "Remote",
    );

    const derivedLoc = this.locationDerivationService.deriveLocation({
      rawLocation,
      title,
      description,
      queriedCity: raw.queriedCity,
    });

    // If city is verified (HIGH or MEDIUM), format display as "${city}, India", else keep rawLocation
    const location = derivedLoc.city
      ? `${derivedLoc.city}, India`
      : rawLocation;

    const jobSlug = this.generateSlug(
      `${companyName}-${title}-${raw.externalId}`,
    );
    const companySlug = this.generateSlug(companyName);

    const workMode = this.normalizeWorkMode(
      raw.workMode,
      title,
      location,
      description,
    );
    const employmentType = this.normalizeEmploymentType(
      raw.employmentType,
      title,
      description,
    );
    const salaryPeriod = this.normalizeSalaryPeriod(raw.salaryPeriod);
    const currency = (raw.currency || "INR").toUpperCase();

    const skillsRequired = this.extractSkills(
      title,
      description,
      raw.skillsRaw,
    );
    const { responsibilities, requirements, benefits } =
      this.extractSections(description);

    const fingerprint = this.computeFingerprint(title, companyName, location);

    const { isIndiaEligible, reason: indiaEligibilityReason } =
      this.evaluateIndiaEligibility(
        location,
        title,
        companyName,
        description,
        currency,
      );

    return {
      externalId: raw.externalId,
      source: raw.source || "UNKNOWN",
      title,
      jobSlug,
      companyName,
      companySlug,
      companyWebsite: raw.companyWebsite,
      companyLogo: raw.companyLogo,
      location,
      rawLocation: derivedLoc.rawLocation,
      city: derivedLoc.city,
      state: derivedLoc.state,
      queriedCity: derivedLoc.queriedCity,
      locationSource: derivedLoc.locationSource,
      locationConfidence: derivedLoc.locationConfidence,
      workMode,
      employmentType,
      experienceMinYears:
        raw.experienceMinYears ??
        this.extractExperience(title, description)?.min,
      experienceMaxYears:
        raw.experienceMaxYears ??
        this.extractExperience(title, description)?.max,
      salaryMin: raw.salaryMin ? Math.round(raw.salaryMin) : undefined,
      salaryMax: raw.salaryMax ? Math.round(raw.salaryMax) : undefined,
      currency,
      salaryPeriod,
      description,
      applyUrl: raw.applyUrl || "",
      applyLinkStatus: raw.applyLinkStatus,
      postedAt: raw.postedAt ? new Date(raw.postedAt) : new Date(),
      skillsRequired,
      responsibilities,
      requirements,
      benefits,
      fingerprint,
      isIndiaJob: isIndiaEligible,
      isIndiaEligible,
      indiaEligibilityReason,
    };
  }

  evaluateIndiaEligibility(
    location: string,
    title: string,
    companyName: string,
    description: string,
    currency?: string,
  ): { isIndiaEligible: boolean; reason: string } {
    const locLower = (location || "").toLowerCase().trim();
    const titleLower = (title || "").toLowerCase().trim();
    const compLower = (companyName || "").toLowerCase().trim();

    // 1. Foreign blacklist check (e.g. Remote - US/USA/Canada/EU/UK/EMEA/LATAM/Singapore/Australia)
    const foreignPatterns = [
      /\b(usa?|united states)\b/i,
      /\bcanada\b/i,
      /\b(uk|united kingdom|london)\b/i,
      /\b(germany|berlin)\b/i,
      /\b(france|paris)\b/i,
      /\b(australia|sydney|melbourne)\b/i,
      /\b(singapore)\b/i,
      /\b(ireland|dublin)\b/i,
      /\b(netherlands|amsterdam)\b/i,
      /\b(brazil)\b/i,
      /\b(emea|latam|europe)\b/i,
      /\bus-remote\b/i,
      /\bus remote\b/i,
    ];

    for (const p of foreignPatterns) {
      if (p.test(locLower) && !locLower.includes("india")) {
        return {
          isIndiaEligible: false,
          reason: `FOREIGN_LOCATION_SPECIFIED: ${location}`,
        };
      }
    }

    // 2. Explicit India mentions in location
    if (
      locLower.includes("india") ||
      locLower.includes("bharat") ||
      /\b(remote - india|india remote|remote in india|remote, india)\b/i.test(
        locLower,
      )
    ) {
      return { isIndiaEligible: true, reason: "EXPLICIT_INDIA_LOCATION" };
    }

    // 3. Indian metropolitan and Tier-2/3 tech cities / state names
    const indianLocations = [
      "bangalore",
      "bengaluru",
      "gurgaon",
      "gurugram",
      "noida",
      "delhi",
      "new delhi",
      "mumbai",
      "hyderabad",
      "pune",
      "chennai",
      "kolkata",
      "ahmedabad",
      "jaipur",
      "kochi",
      "chandigarh",
      "indore",
      "coimbatore",
      "bhopal",
      "nagpur",
      "trivandrum",
      "thiruvananthapuram",
      "mysore",
      "mysuru",
      "visakhapatnam",
      "vizag",
      "lucknow",
      "kanpur",
      "bhubaneswar",
      "patna",
      "surat",
      "vadodara",
      "mohali",
      "karnataka",
      "telangana",
      "maharashtra",
      "tamil nadu",
      "haryana",
      "uttar pradesh",
      "kerala",
      "gujarat",
      "rajasthan",
      "punjab",
      "west bengal",
    ];

    for (const place of indianLocations) {
      const regex = new RegExp(`\\b${place}\\b`, "i");
      if (regex.test(locLower) || regex.test(titleLower)) {
        return {
          isIndiaEligible: true,
          reason: `INDIAN_LOCATION_MATCH: ${place}`,
        };
      }
    }

    // 4. Explicit worldwide / global remote
    if (
      locLower === "worldwide" ||
      locLower === "anywhere" ||
      locLower === "global remote" ||
      locLower.includes("work from anywhere")
    ) {
      return { isIndiaEligible: true, reason: "WORLDWIDE_REMOTE_ELIGIBLE" };
    }

    // 5. Generic or unspecified remote
    if (locLower.includes("remote")) {
      const foreignMncCompanies = [
        "coinbase",
        "stripe",
        "figma",
        "brex",
        "lemon.io",
        "meta",
        "google",
        "apple",
        "microsoft",
        "amazon",
      ];
      if (foreignMncCompanies.includes(compLower)) {
        return {
          isIndiaEligible: false,
          reason: `FOREIGN_MNC_UNSPECIFIED_REMOTE: ${companyName}`,
        };
      }
      return {
        isIndiaEligible: true,
        reason: `DOMESTIC_COMPANY_REMOTE: ${companyName}`,
      };
    }

    // 6. Currency INR with no foreign indicators
    if (currency === "INR") {
      return { isIndiaEligible: true, reason: "INR_CURRENCY_DOMESTIC" };
    }

    return {
      isIndiaEligible: false,
      reason: `UNVERIFIED_LOCATION: ${location}`,
    };
  }

  detectIsIndiaJob(
    location: string,
    title: string,
    description: string,
    currency?: string,
  ): boolean {
    return this.evaluateIndiaEligibility(
      location,
      title,
      "",
      description,
      currency,
    ).isIndiaEligible;
  }

  private cleanString(str: string): string {
    return (str || "")
      .replace(/[\r\n\t]+/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  generateSlug(input: string): string {
    return input
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .substring(0, 100);
  }

  computeFingerprint(title: string, company: string, location: string): string {
    const normTitle = title.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normCompany = company.toLowerCase().replace(/[^a-z0-9]/g, "");
    const normLocation = location.toLowerCase().includes("remote")
      ? "remote"
      : location.toLowerCase().replace(/[^a-z0-9]/g, "");

    const str = `${normCompany}_${normTitle}_${normLocation}`;
    return crypto.createHash("sha256").update(str).digest("hex");
  }

  private normalizeWorkMode(
    rawWorkMode: string | WorkMode | undefined,
    title: string,
    location: string,
    description: string,
  ): WorkMode {
    if (rawWorkMode) {
      const modeStr = String(rawWorkMode).toUpperCase();
      if (modeStr.includes("REMOTE")) return WorkMode.REMOTE;
      if (modeStr.includes("HYBRID")) return WorkMode.HYBRID;
      if (modeStr.includes("ONSITE") || modeStr.includes("IN_PERSON"))
        return WorkMode.ONSITE;
    }

    const combined =
      `${title} ${location} ${description.substring(0, 300)}`.toLowerCase();
    if (
      combined.includes("remote") ||
      combined.includes("work from anywhere") ||
      combined.includes("wfh")
    ) {
      return WorkMode.REMOTE;
    }
    if (combined.includes("hybrid")) {
      return WorkMode.HYBRID;
    }
    return WorkMode.ONSITE;
  }

  private normalizeEmploymentType(
    rawType: string | EmploymentType | undefined,
    title: string,
    description: string,
  ): EmploymentType {
    if (rawType) {
      const t = String(rawType).toUpperCase();
      if (/\bFULL[- ]?TIME\b/.test(t)) return EmploymentType.FULL_TIME;
      if (/\bPART[- ]?TIME\b/.test(t)) return EmploymentType.PART_TIME;
      if (/\b(CONTRACT|FREELANCE)\b/.test(t)) return EmploymentType.CONTRACT;
      if (
        /\bINTERN(SHIP)?\b/.test(t) &&
        !/\bINTERNAL\b/.test(t) &&
        !/\bINTERNATIONAL\b/.test(t)
      ) {
        return EmploymentType.INTERNSHIP;
      }
    }

    const titleLower = title.toLowerCase();
    if (
      /\bintern(ship|s)?\b/i.test(titleLower) &&
      !/\binternal\b/i.test(titleLower) &&
      !/\binternational\b/i.test(titleLower)
    ) {
      return EmploymentType.INTERNSHIP;
    }

    const descSample = description.substring(0, 400).toLowerCase();
    if (
      /\bintern(ship|s)?\b/i.test(descSample) &&
      !/\binternal\b/i.test(descSample) &&
      !/\binternational\b/i.test(descSample)
    ) {
      return EmploymentType.INTERNSHIP;
    }

    const combined = `${titleLower} ${descSample}`;
    if (/\b(contract|freelance)\b/i.test(combined))
      return EmploymentType.CONTRACT;
    if (/\bpart[- ]time\b/i.test(combined)) return EmploymentType.PART_TIME;
    return EmploymentType.FULL_TIME;
  }

  private normalizeSalaryPeriod(period?: string | SalaryPeriod): SalaryPeriod {
    if (!period) return SalaryPeriod.YEARLY;
    const p = String(period).toUpperCase();
    if (p.includes("HOUR")) return SalaryPeriod.HOURLY;
    if (p.includes("MONTH")) return SalaryPeriod.MONTHLY;
    if (p.includes("YEAR") || p.includes("ANNUAL")) return SalaryPeriod.YEARLY;
    return SalaryPeriod.YEARLY;
  }

  extractSkills(
    title: string,
    description: string,
    rawSkills?: string[],
  ): string[] {
    const foundSkills = new Set<string>();

    if (rawSkills && Array.isArray(rawSkills)) {
      for (const s of rawSkills) {
        if (s && s.trim().length > 1) {
          foundSkills.add(s.trim());
        }
      }
    }

    const combinedText = ` ${title} ${description} `;

    for (const skill of TECH_SKILLS_TAXONOMY) {
      // Escape for regex and check word boundaries
      const escaped = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
      const regex = new RegExp(
        `(?<=[^a-zA-Z0-9]|^)${escaped}(?=[^a-zA-Z0-9]|$)`,
        "i",
      );
      if (regex.test(combinedText)) {
        foundSkills.add(skill);
      }
    }

    return Array.from(foundSkills).slice(0, 20);
  }

  private extractExperience(
    title: string,
    description: string,
  ): { min?: number; max?: number } | null {
    const text = `${title}\n${description}`;
    const expRegex =
      /(\d{1,2})\s*(?:-|to)\s*(\d{1,2})\s*\+?\s*(?:years?|yrs?)/i;
    const singleExpRegex =
      /(\d{1,2})\s*\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i;

    const match = text.match(expRegex);
    if (match) {
      const min = parseInt(match[1], 10);
      const max = parseInt(match[2], 10);
      return { min, max: Math.max(min, max) };
    }

    const singleMatch = text.match(singleExpRegex);
    if (singleMatch) {
      const min = parseInt(singleMatch[1], 10);
      return { min };
    }

    return null;
  }

  private extractSections(description: string): {
    responsibilities: string[];
    requirements: string[];
    benefits: string[];
  } {
    const lines = description.split("\n");
    const responsibilities: string[] = [];
    const requirements: string[] = [];
    const benefits: string[] = [];

    let currentSection:
      "responsibilities" | "requirements" | "benefits" | "none" = "none";

    for (const line of lines) {
      const trimmed = line.trim();
      const lower = trimmed.toLowerCase();

      if (
        lower.includes("responsibilit") ||
        lower.includes("what you will do") ||
        lower.includes("duties")
      ) {
        currentSection = "responsibilities";
        continue;
      } else if (
        lower.includes("requirement") ||
        lower.includes("what you need") ||
        lower.includes("qualificat")
      ) {
        currentSection = "requirements";
        continue;
      } else if (
        lower.includes("benefit") ||
        lower.includes("perks") ||
        lower.includes("what we offer")
      ) {
        currentSection = "benefits";
        continue;
      }

      if (
        trimmed.startsWith("-") ||
        trimmed.startsWith("*") ||
        trimmed.startsWith("•")
      ) {
        const item = trimmed.replace(/^[-*•]\s*/, "");
        if (item.length > 5) {
          if (currentSection === "responsibilities")
            responsibilities.push(item);
          if (currentSection === "requirements") requirements.push(item);
          if (currentSection === "benefits") benefits.push(item);
        }
      }
    }

    return { responsibilities, requirements, benefits };
  }
}
