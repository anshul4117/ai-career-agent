-- CreateEnum CompanyType
DO $$ BEGIN
    CREATE TYPE "CompanyType" AS ENUM ('MNC', 'INDIAN_LARGE', 'STARTUP', 'SME', 'AGENCY', 'GOVT', 'UNKNOWN_REVIEW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum AtsType
DO $$ BEGIN
    CREATE TYPE "AtsType" AS ENUM ('NONE', 'GREENHOUSE', 'LEVER', 'ASHBY', 'SMARTRECRUITERS', 'WORKABLE', 'RECRUITEE');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable companies
ALTER TABLE "companies"
ADD COLUMN IF NOT EXISTS "domain" TEXT,
ADD COLUMN IF NOT EXISTS "careerUrl" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "state" TEXT,
ADD COLUMN IF NOT EXISTS "sizeBand" TEXT,
ADD COLUMN IF NOT EXISTS "companyType" "CompanyType" NOT NULL DEFAULT 'UNKNOWN_REVIEW',
ADD COLUMN IF NOT EXISTS "atsType" "AtsType" NOT NULL DEFAULT 'NONE',
ADD COLUMN IF NOT EXISTS "atsSlug" TEXT,
ADD COLUMN IF NOT EXISTS "verified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "lastCheckedAt" TIMESTAMP(3);

-- Indexes for companies
CREATE INDEX IF NOT EXISTS "companies_companyType_idx" ON "companies"("companyType");
CREATE INDEX IF NOT EXISTS "companies_atsType_idx" ON "companies"("atsType");
CREATE INDEX IF NOT EXISTS "companies_domain_idx" ON "companies"("domain");
