-- Create or replace trigger function enforcing cross-resume version ownership
CREATE OR REPLACE FUNCTION check_resume_version_ownership()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW."resumeVersionId" IS NOT NULL AND NEW."resumeId" IS NOT NULL THEN
    IF NOT EXISTS (
      SELECT 1 FROM "resume_versions"
      WHERE "id" = NEW."resumeVersionId" AND "resumeId" = NEW."resumeId"
    ) THEN
      RAISE EXCEPTION 'Foreign key integrity violation: resumeVersionId % does not belong to resumeId %', NEW."resumeVersionId", NEW."resumeId";
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to resume_parse_results
DROP TRIGGER IF EXISTS trg_check_parse_result_version_ownership ON "resume_parse_results";
CREATE TRIGGER trg_check_parse_result_version_ownership
BEFORE INSERT OR UPDATE OF "resumeId", "resumeVersionId" ON "resume_parse_results"
FOR EACH ROW EXECUTE FUNCTION check_resume_version_ownership();

-- Apply trigger to resume_analyses
DROP TRIGGER IF EXISTS trg_check_analysis_version_ownership ON "resume_analyses";
CREATE TRIGGER trg_check_analysis_version_ownership
BEFORE INSERT OR UPDATE OF "resumeId", "resumeVersionId" ON "resume_analyses"
FOR EACH ROW EXECUTE FUNCTION check_resume_version_ownership();

-- Apply trigger to job_applications
DROP TRIGGER IF EXISTS trg_check_job_application_version_ownership ON "job_applications";
CREATE TRIGGER trg_check_job_application_version_ownership
BEFORE INSERT OR UPDATE OF "resumeId", "resumeVersionId" ON "job_applications"
FOR EACH ROW EXECUTE FUNCTION check_resume_version_ownership();
