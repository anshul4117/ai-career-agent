# AI Career Agent — Development Roadmap & Requirements

For the complete multi-phase roadmap, see [docs/roadmap.md](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/roadmap.md).

## Phase 2 / Phase 3 Resume Architecture Requirements

The following requirements and invariants are strictly required for the upcoming Resume Management & Parsing milestone:

### 1. Atomic Resume Version 1 Creation

- Initial resume upload or creation must atomically create both the parent `Resume` (with `currentVersion: 1`) and the initial `ResumeVersion` (`versionNumber: 1`, `title: resume.title`, `fileUrl: resume.fileUrl`, `contentSnapshot: initialData`) inside a single `prisma.$transaction`.
- A `Resume` record must never exist without an accompanying version 1 snapshot in `resume_versions`.

### 2. ResumeVersion Ownership Validation

- Every service write path accepting `resumeVersionId` must explicitly validate:
  1. `resumeVersion.resumeId === targetResume.id`
  2. `targetResume.userId === requestingUserId`
- Enforced at the database level by PostgreSQL trigger `check_resume_version_ownership()` on `resume_parse_results`, `resume_analyses`, and `job_applications`.

### 3. Resume Parsing & ATS Analysis Ownership Validation

- All `ResumeParseResult` and `ResumeAnalysis` write paths must validate that `targetResume.userId === requestingUserId`.
- When referencing a `resumeVersionId`, the service must verify that the version belongs to `resumeId`.

### 4. Resume File Lifecycle and Deletion

- **Upload Validation**: Strict MIME type checking (PDF, DOCX), maximum file size (5MB), and antivirus scanning.
- **Post-Commit Cleanup**: Physical files in cloud storage (S3 / Cloudflare R2) must only be deleted _after_ the database transaction commits (outbox / background cleanup pattern).
- **Application Preservation**: Preserve version-locked immutable storage keys (`immutableFileKey`) on submitted `job_applications` when parent resumes are modified or deleted, while clearing them during user account anonymization.
