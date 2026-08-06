-- CreateEnum
CREATE TYPE "CompanySize" AS ENUM ('SIZE_1_10', 'SIZE_11_50', 'SIZE_51_200', 'SIZE_201_1000', 'SIZE_1001_5000', 'SIZE_5000_PLUS');

-- CreateEnum
CREATE TYPE "SalaryPeriod" AS ENUM ('YEARLY', 'MONTHLY', 'HOURLY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "JobSourcePlatform" AS ENUM ('COMPANY', 'WELLFOUND', 'YC', 'INTERNSHALA', 'NAUKRI', 'LINKEDIN');

-- CreateEnum
CREATE TYPE "ApplicationStatusSource" AS ENUM ('EMAIL', 'LINKEDIN', 'WELLFOUND', 'COMPANY', 'MANUAL');

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companySlug" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "careerPageUrl" TEXT,
    "logoUrl" TEXT,
    "industry" TEXT,
    "headquarters" TEXT,
    "companySize" "CompanySize",
    "isHiring" BOOLEAN NOT NULL DEFAULT true,
    "lastJobSeenAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "jobSlug" TEXT NOT NULL,
    "location" TEXT,
    "workMode" "WorkMode",
    "employmentType" "EmploymentType",
    "experienceMinYears" INTEGER,
    "experienceMaxYears" INTEGER,
    "salaryMin" INTEGER,
    "salaryMax" INTEGER,
    "currency" TEXT,
    "salaryPeriod" "SalaryPeriod",
    "description" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "postedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_sources" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "source" "JobSourcePlatform" NOT NULL,
    "sourceJobId" TEXT,
    "sourceJobUrl" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastVerifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "resumeId" TEXT NOT NULL,
    "jobSourceId" TEXT NOT NULL,
    "currentStatus" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "application_status_history" (
    "id" TEXT NOT NULL,
    "jobApplicationId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusSource" "ApplicationStatusSource",
    "message" TEXT,
    "statusAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "application_status_history_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "companies_name_key" ON "companies"("name");

-- CreateIndex
CREATE UNIQUE INDEX "companies_companySlug_key" ON "companies"("companySlug");

-- CreateIndex
CREATE UNIQUE INDEX "jobs_jobSlug_key" ON "jobs"("jobSlug");

-- CreateIndex
CREATE UNIQUE INDEX "job_sources_jobId_source_key" ON "job_sources"("jobId", "source");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_userId_jobSourceId_key" ON "job_applications"("userId", "jobSourceId");

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_sources" ADD CONSTRAINT "job_sources_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_resumeId_fkey" FOREIGN KEY ("resumeId") REFERENCES "resumes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobSourceId_fkey" FOREIGN KEY ("jobSourceId") REFERENCES "job_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "application_status_history" ADD CONSTRAINT "application_status_history_jobApplicationId_fkey" FOREIGN KEY ("jobApplicationId") REFERENCES "job_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
