-- CreateEnum UrlValidationState
DO $$ BEGIN
    CREATE TYPE "UrlValidationState" AS ENUM ('VERIFIED', 'REDIRECTED', 'UNVERIFIED', 'TEMPORARILY_UNAVAILABLE', 'EXPIRED', 'INVALID');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum VerificationConfidence
DO $$ BEGIN
    CREATE TYPE "VerificationConfidence" AS ENUM ('COMPANY_PORTAL_MATCHED', 'APPLICATION_LINK_VERIFIED', 'SOURCE_CONFIRMED', 'FRESHNESS_CONFIRMED', 'UNVERIFIED');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable jobs
ALTER TABLE "jobs"
ADD COLUMN IF NOT EXISTS "applyUrl" TEXT,
ADD COLUMN IF NOT EXISTS "skillsRequired" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "responsibilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "requirements" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "benefits" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN IF NOT EXISTS "qualityScore" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN IF NOT EXISTS "qualityBreakdown" JSONB,
ADD COLUMN IF NOT EXISTS "spamScore" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS "isSpam" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "isAnomaly" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "anomalyReasons" JSONB,
ADD COLUMN IF NOT EXISTS "fingerprint" TEXT,
ADD COLUMN IF NOT EXISTS "duplicateOfJobId" TEXT,
ADD COLUMN IF NOT EXISTS "validationState" "UrlValidationState" DEFAULT 'UNVERIFIED',
ADD COLUMN IF NOT EXISTS "verificationConfidence" "VerificationConfidence" DEFAULT 'UNVERIFIED',
ADD COLUMN IF NOT EXISTS "validatedApplyUrl" TEXT,
ADD COLUMN IF NOT EXISTS "urlLastCheckedAt" TIMESTAMP(3),
ADD COLUMN IF NOT EXISTS "isIndiaJob" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "isIndiaEligible" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN IF NOT EXISTS "indiaEligibilityReason" TEXT,
ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;

-- CreateTable collection_logs
CREATE TABLE IF NOT EXISTS "collection_logs" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "totalIngested" INTEGER NOT NULL DEFAULT 0,
    "approvedCount" INTEGER NOT NULL DEFAULT 0,
    "duplicateCount" INTEGER NOT NULL DEFAULT 0,
    "spamCount" INTEGER NOT NULL DEFAULT 0,
    "anomalyCount" INTEGER NOT NULL DEFAULT 0,
    "durationMs" INTEGER DEFAULT 0,
    "newCount" INTEGER DEFAULT 0,
    "updatedCount" INTEGER DEFAULT 0,
    "rejectedCount" INTEGER DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'SUCCESS',
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "collection_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable saved_jobs
CREATE TABLE IF NOT EXISTS "saved_jobs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- Indexes for jobs
CREATE INDEX IF NOT EXISTS "jobs_qualityScore_idx" ON "jobs"("qualityScore");
CREATE INDEX IF NOT EXISTS "jobs_isSpam_idx" ON "jobs"("isSpam");
CREATE INDEX IF NOT EXISTS "jobs_fingerprint_idx" ON "jobs"("fingerprint");
CREATE INDEX IF NOT EXISTS "jobs_isIndiaJob_idx" ON "jobs"("isIndiaJob");
CREATE INDEX IF NOT EXISTS "jobs_validationState_idx" ON "jobs"("validationState");
CREATE INDEX IF NOT EXISTS "jobs_lastSeenAt_idx" ON "jobs"("lastSeenAt");

-- Indexes for collection_logs
CREATE INDEX IF NOT EXISTS "collection_logs_source_idx" ON "collection_logs"("source");
CREATE INDEX IF NOT EXISTS "collection_logs_createdAt_idx" ON "collection_logs"("createdAt");

-- Indexes & Unique Constraints for saved_jobs
CREATE UNIQUE INDEX IF NOT EXISTS "saved_jobs_userId_jobId_key" ON "saved_jobs"("userId", "jobId");
CREATE INDEX IF NOT EXISTS "saved_jobs_userId_idx" ON "saved_jobs"("userId");
CREATE INDEX IF NOT EXISTS "saved_jobs_jobId_idx" ON "saved_jobs"("jobId");

-- Foreign Keys for saved_jobs
DO $$ BEGIN
    ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
