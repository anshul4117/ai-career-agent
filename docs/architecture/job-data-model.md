# Job Discovery: Schema & Data Model Specifications

## 1. Purpose
Define strict TypeScript schemas and metadata parameters for Job and Company entities. This document serves as the Single Source of Truth for frontend stores and database schemas.

---

## 2. Job Entity Model (TypeScript Specification)

```typescript
export type RemoteType = "remote" | "hybrid" | "onsite";
export type EmploymentType = "full-time" | "part-time" | "contract" | "internship";

export interface JobCompanyInfo {
  name: string;
  logoUrl: string | null;
  industry: string;
  website: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyInfo: JobCompanyInfo;
  
  // Locations & Remote
  location: string; // e.g. "San Francisco, CA"
  remoteType: RemoteType;
  
  // Compensation
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string; // ISO 4217 code, e.g. "USD"
  
  // Requirements & Details
  experienceLevel: "entry" | "mid" | "senior" | "lead";
  skillsRequired: string[]; // e.g. ["TypeScript", "Next.js"]
  benefits: string[]; // e.g. ["Health Insurance", "401k"]
  description: string;
  responsibilities: string[];
  requirements: string[];
  
  // Audits & Stats
  postedDate: string; // ISO timestamp
  expiryDate: string | null; // ISO timestamp
  source: "wellfound" | "ycombinator" | "greenhouse" | "manual";
  sourceJobId: string; // ID assigned by external provider
  externalApplyUrl: string;
  
  // Dynamic Score metrics
  trustScore: number; // 0-100 (rating job quality/spam check)
  freshnessScore: number; // 0-100
  matchScore?: number; // 0-100 (AI calculation, optional)
  
  // Interaction Flags
  isSaved: boolean;
  isApplied: boolean;
  viewedAt: string | null; // ISO timestamp
}
```

---

## 3. Company Entity Model (TypeScript Specification)

```typescript
export type FundingStage = "seed" | "series-a" | "series-b" | "series-c" | "ipo" | "bootstrapped";

export interface CompanySocials {
  linkedin?: string;
  github?: string;
  twitter?: string;
}

export interface Company {
  id: string;
  name: string;
  logoUrl: string | null;
  website: string;
  industry: string;
  fundingStage: FundingStage;
  companySize: "1-10" | "11-50" | "51-200" | "201-500" | "500+";
  headquarters: string;
  techStack: string[];
  cultureDescription: string;
  benefitsList: string[];
  isActivelyHiring: boolean;
  socialLinks: CompanySocials;
  openPositionsCount: number;
  createdAt: string;
  updatedAt: string;
}
```

---

## 4. Best Practices
- **Nullable Values**: Fields like `salaryMin` and `salaryMax` must be nullable, as some listings omit compensation details.
- **Immutable Fields**: `id`, `source`, and `sourceJobId` are immutable once ingested.
