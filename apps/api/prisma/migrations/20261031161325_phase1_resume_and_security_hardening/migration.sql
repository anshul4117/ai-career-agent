/*
  Warnings:

  - You are about to drop the column `currentStatus` on the `job_applications` table. All the data in the column will be lost.
  - Changed the type of `status` on the `application_status_history` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `jobId` to the `job_applications` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResumeStatus" AS ENUM ('ACTIVE', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ParsingStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('APPLIED', 'SCREENING', 'ASSESSMENT', 'INTERVIEW', 'OFFER', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');

-- AlterEnum
ALTER TYPE "ApplicationStatusSource" ADD VALUE 'SYSTEM';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "JobSourcePlatform" ADD VALUE 'DIRECT';
ALTER TYPE "JobSourcePlatform" ADD VALUE 'OTHER';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OAuthProvider" ADD VALUE 'GITHUB';
ALTER TYPE "OAuthProvider" ADD VALUE 'LINKEDIN';

-- DropForeignKey
ALTER TABLE "application_status_history" DROP CONSTRAINT "application_status_history_jobApplicationId_fkey";

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_jobSourceId_fkey";

-- DropForeignKey
ALTER TABLE "job_applications" DROP CONSTRAINT "job_applications_resumeId_fkey";

-- DropForeignKey
ALTER TABLE "job_sources" DROP CONSTRAINT "job_sources_jobId_fkey";

-- DropForeignKey
ALTER TABLE "oauth_accounts" DROP CONSTRAINT "oauth_accounts_userId_fkey";

-- DropForeignKey
ALTER TABLE "resumes" DROP CONSTRAINT "resumes_userId_fkey";

-- DropIndex
DROP INDEX "job_applications_userId_jobSourceId_key";

-- AlterTable
ALTER TABLE "application_status_history" DROP COLUMN "status",
ADD COLUMN     "status" "ApplicationStatus" NOT NULL,
ALTER COLUMN "statusSource" SET DEFAULT 'MANUAL',
ALTER COLUMN "statusAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "job_applications" DROP COLUMN "currentStatus",
ADD COLUMN     "immutableFileKey" TEXT,
ADD COLUMN     "jobId" TEXT NOT NULL,
ADD COLUMN     "resumeSnapshot" JSONB,
ADD COLUMN     "resumeVersionId" TEXT,
ADD COLUMN     "status" "ApplicationStatus" NOT NULL DEFAULT 'APPLIED',
ALTER COLUMN "resumeId" DROP NOT NULL,
ALTER COLUMN "jobSourceId" DROP NOT NULL,
ALTER COLUMN "appliedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "resumes" ADD COLUMN     "currentVersion" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "customSections" JSONB,
ADD COLUMN     "status" "ResumeStatus" NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "templateId" TEXT DEFAULT 'default',
ADD COLUMN     "themeConfig" JSONB;

-- CreateTable
CREATE TABLE "refresh_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "familyId" TEXT NOT NULL,
    "isRevoked" BOOLEAN NOT NULL DEFAULT false,
    "replacedByTokenHash" TEXT,
    "userAgent" TEXT,
    "ipAddress" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_versions" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "fileUrl" TEXT,
    "contentSnapshot" JSONB NOT NULL,
    "themeSnapshot" JSONB,
    "changeSummary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_parse_results" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "resumeVersionId" TEXT,
    "status" "ParsingStatus" NOT NULL DEFAULT 'PENDING',
    "retryCount" INTEGER NOT NULL DEFAULT 0,
    "maxRetries" INTEGER NOT NULL DEFAULT 3,
    "errorMessage" TEXT,
    "errorCode" TEXT,
    "rawText" TEXT,
    "extractedData" JSONB,
    "confidenceScores" JSONB,
    "parserEngine" TEXT,
    "parserModel" TEXT,
    "modelVersion" TEXT,
    "promptVersion" TEXT,
    "processingDurationMs" INTEGER,
    "isUserReviewed" BOOLEAN NOT NULL DEFAULT false,
    "reviewedAt" TIMESTAMP(3),
    "reviewedByUserId" TEXT,
    "reviewActions" JSONB,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resume_parse_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resume_analyses" (
    "id" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "resumeVersionId" TEXT,
    "targetJobId" TEXT,
    "targetJobTitle" TEXT,
    "overallAtsScore" DOUBLE PRECISION NOT NULL,
    "qualityScore" DOUBLE PRECISION,
    "completenessScore" DOUBLE PRECISION,
    "keywordScore" DOUBLE PRECISION,
    "readabilityScore" DOUBLE PRECISION,
    "sectionScores" JSONB,
    "matchingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "missingKeywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "keywordDensity" JSONB,
    "suggestions" JSONB,
    "bulletImprovements" JSONB,
    "summaryOptimization" JSONB,
    "analyzerModel" TEXT,
    "analyzerVersion" TEXT,
    "promptVersion" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resume_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_tokenHash_key" ON "refresh_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_idx" ON "refresh_tokens"("userId");

-- CreateIndex
CREATE INDEX "refresh_tokens_familyId_idx" ON "refresh_tokens"("familyId");

-- CreateIndex
CREATE INDEX "refresh_tokens_expiresAt_idx" ON "refresh_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "resume_versions_resumeId_idx" ON "resume_versions"("resumeId");

-- CreateIndex
CREATE UNIQUE INDEX "resume_versions_resumeId_versionNumber_key" ON "resume_versions"("resumeId", "versionNumber");

-- CreateIndex
CREATE INDEX "resume_parse_results_resumeId_idx" ON "resume_parse_results"("resumeId");

-- CreateIndex
CREATE INDEX "resume_parse_results_resumeVersionId_idx" ON "resume_parse_results"("resumeVersionId");

-- CreateIndex
CREATE INDEX "resume_parse_results_status_idx" ON "resume_parse_results"("status");

-- CreateIndex
CREATE INDEX "resume_parse_results_reviewedByUserId_idx" ON "resume_parse_results"("reviewedByUserId");

-- CreateIndex
CREATE INDEX "resume_analyses_resumeId_idx" ON "resume_analyses"("resumeId");

-- CreateIndex
CREATE INDEX "resume_analyses_resumeVersionId_idx" ON "resume_analyses"("resumeVersionId");

-- CreateIndex
CREATE INDEX "resume_analyses_targetJobId_idx" ON "resume_analyses"("targetJobId");

-- CreateIndex
CREATE INDEX "application_status_history_jobApplicationId_idx" ON "application_status_history"("jobApplicationId");

-- CreateIndex
CREATE INDEX "application_status_history_statusAt_idx" ON "application_status_history"("statusAt");

-- CreateIndex
CREATE INDEX "certifications_userId_idx" ON "certifications"("userId");

-- CreateIndex
CREATE INDEX "education_userId_idx" ON "education"("userId");

-- CreateIndex
CREATE INDEX "experience_userId_idx" ON "experience"("userId");

-- CreateIndex
CREATE INDEX "job_applications_userId_idx" ON "job_applications"("userId");

-- CreateIndex
CREATE INDEX "job_applications_jobId_idx" ON "job_applications"("jobId");

-- CreateIndex
CREATE INDEX "job_applications_resumeId_idx" ON "job_applications"("resumeId");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE INDEX "job_sources_jobId_idx" ON "job_sources"("jobId");

-- CreateIndex
CREATE INDEX "jobs_companyId_idx" ON "jobs"("companyId");

-- CreateIndex
CREATE INDEX "languages_userId_idx" ON "languages"("userId");

-- CreateIndex
CREATE INDEX "oauth_accounts_userId_idx" ON "oauth_accounts"("userId");

-- CreateIndex
CREATE INDEX "projects_userId_idx" ON "projects"("userId");

-- CreateIndex
CREATE INDEX "resumes_userId_idx" ON "resumes"("userId");

-- CreateIndex
CREATE INDEX "resumes_status_idx" ON "resumes"("status");

-- CreateIndex
CREATE INDEX "social_links_userId_idx" ON "social_links"("userId");

-- CreateIndex
CREATE INDEX "user_skills_skillId_idx" ON "user_skills"("skillId");

-- AddForeignKey
ALTER TABLE "oauth_accounts" ADD CONSTRAINT "oauth_accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_versions" ADD CONSTRAINT "resume_versions_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_parse_results" ADD CONSTRAINT "resume_parse_results_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_parse_results" ADD CONSTRAINT "resume_parse_results_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "resume_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_parse_results" ADD CONSTRAINT "resume_parse_results_reviewedByUserId_fkey" FOREIGN KEY ("reviewedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "resume_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resume_analyses" ADD CONSTRAINT "resume_analyses_targetJobId_fkey" FOREIGN KEY ("targetJobId") REFERENCES "jobs"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_sources" ADD CONSTRAINT "job_sources_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobSourceId_fkey" FOREIGN KEY ("jobSourceId") REFERENCES "job_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resumeVersionId_fkey" FOREIGN KEY ("resumeVersionId") REFERENCES "resume_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "job_applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed System Archive User for anonymized account deletions if not exists
INSERT INTO "users" ("id", "email", "fullName", "emailVerified", "createdAt", "updatedAt")
VALUES ('00000000-0000-0000-0000-000000000000', 'archive-deleted-account@system.internal', 'Anonymized Candidate', false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Enforce exactly one default resume per user
CREATE UNIQUE INDEX "resumes_user_id_is_default_unique" 
ON "resumes" ("userId") 
WHERE "isDefault" = true;
