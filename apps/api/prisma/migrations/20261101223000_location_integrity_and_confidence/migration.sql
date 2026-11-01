-- CreateEnum LocationSource
DO $$ BEGIN
    CREATE TYPE "LocationSource" AS ENUM ('SOURCE', 'PARSED_TEXT', 'QUERY_HINT', 'UNKNOWN');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateEnum LocationConfidence
DO $$ BEGIN
    CREATE TYPE "LocationConfidence" AS ENUM ('HIGH', 'MEDIUM', 'LOW');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- AlterTable
ALTER TABLE "jobs" 
ADD COLUMN IF NOT EXISTS "rawLocation" TEXT,
ADD COLUMN IF NOT EXISTS "city" TEXT,
ADD COLUMN IF NOT EXISTS "state" TEXT,
ADD COLUMN IF NOT EXISTS "queriedCity" TEXT,
ADD COLUMN IF NOT EXISTS "locationSource" "LocationSource" DEFAULT 'UNKNOWN',
ADD COLUMN IF NOT EXISTS "locationConfidence" "LocationConfidence" DEFAULT 'LOW';

-- CreateIndexes
CREATE INDEX IF NOT EXISTS "jobs_city_idx" ON "jobs"("city");
CREATE INDEX IF NOT EXISTS "jobs_locationConfidence_idx" ON "jobs"("locationConfidence");
CREATE INDEX IF NOT EXISTS "jobs_locationSource_idx" ON "jobs"("locationSource");
