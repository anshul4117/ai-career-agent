# AI Career Agent — Project Progress Tracker

**Current Working Branch**: `feat/phase1-database-foundation`  
**Current Milestone**: Phase 1 Database & Security Hardening (Completed & Remediated)  
**Next Milestone**: Phase 2 / Phase 3 Resume Management & ATS Optimization

---

## Milestone Status Overview

| Phase       | Milestone                           | Status     | Key Deliverables / Changes                                                                                                                                               |
| ----------- | ----------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Phase 0** | Workspace & Monorepo Foundation     | **DONE**   | Turborepo, NestJS backend, Next.js 15 frontend, Prisma ORM, shared tooling                                                                                               |
| **Phase 1** | Auth, Profile & Security Foundation | **DONE**   | Refresh token rotation, replay detection, stateless JWT migration, `Profile` persistence, `DELETE /users/me` account anonymization, PostgreSQL resume ownership triggers |
| **Phase 2** | Candidate Profile System            | **DONE**   | Complete candidate profile CRUD, master skill upserts, multi-section persistence                                                                                         |
| **Phase 3** | Resume Management & Versioning      | **QUEUED** | Resume upload, atomic Version 1 creation, immutable content snapshots, version comparison                                                                                |
| **Phase 4** | AI Resume Parsing & ATS Scoring     | **QUEUED** | Gemini vision/PDF parsing pipeline, section confidence scoring, keyword matching                                                                                         |
| **Phase 5** | Job Discovery Engine                | **QUEUED** | Job scraping, normalization, deduplication, search index                                                                                                                 |

---

## Detailed Phase 1 Audit & Remediation Log

### 1. JWT Migration Cutoff & Security

- **Fix**: Removed static fallback date. Implemented `getStatelessMigrationCutoff()` which dynamically derives the cutoff from `DEPLOYMENT_TIMESTAMP` (+7 days) or validated UTC `STATELESS_MIGRATION_CUTOFF`. Fails safely in production if unconfigured.
- **Verification**: Verified via unit tests in `auth.service.spec.ts`.

### 2. Legacy JWT Concurrency & Replay Safety

- **Fix**: Wrapped `migrateStatelessJwt` in `try/catch` catching Prisma `P2002` (unique constraint on `tokenHash`). Concurrent legacy token migrations now gracefully return HTTP 401 Unauthorized without creating multiple token families or emitting unhandled HTTP 500 errors.
- **Verification**: Concurrency collision test added and passing in `auth.service.spec.ts`.

### 3. Cross-Resume Version Integrity

- **Fix**: Created and deployed migration `20261101104000_phase1_resume_integrity_triggers` adding PostgreSQL trigger `check_resume_version_ownership()` on `resume_parse_results`, `resume_analyses`, and `job_applications`.
- **Enforcement**: Any write referencing `resumeVersionId` where `resumeVersion.resumeId !== row.resumeId` is aborted at the database engine level (`P0001`).

### 4. Complete Account Anonymization & PII Scrubbing

- **Fix**: Updated `UsersService.anonymizeAndDeleteAccount` to:
  - Preserve hiring compliance records by re-assigning `job_applications.userId` to System Archive User `00000000-0000-0000-0000-000000000000`.
  - Scrub `candidateName`, `candidateEmail`, `candidatePhone`, and `originalFileName` in `resumeSnapshot`.
  - Nullify `immutableFileKey` on archived job applications.
  - Sanitize `application_status_history.message` to prevent recruiter/candidate PII retention.
  - Cascade user deletion across personal tables (`profiles`, `resumes`, `resume_versions`, `tokens`).
  - Collect all cloud storage references and dispatch background storage cleanup only _after_ the DB transaction commits.
- **Endpoint**: Exposed authenticated `DELETE /users/me` in `users.controller.ts` with re-authentication password check and `"DELETE MY ACCOUNT"` confirmation phrase check.

---

## Verification Summary

- **Backend Tests**: 48 passed, 0 failed (`apps/api` via Jest)
- **Backend Type-Check**: 0 errors (`apps/api` via `tsc --noEmit`)
- **Backend Build**: Successful (`apps/api` via `nest build`)
- **Frontend Type-Check**: 0 errors (`apps/web` via `tsc --noEmit`)
- **Frontend Lint**: 0 errors, 0 warnings (`apps/web` via ESLint)
- **Frontend Build**: 46/46 static and dynamic routes compiled successfully (`apps/web` via `next build`)
- **Database Status**: 6 migrations applied, schema up to date on Neon PostgreSQL
