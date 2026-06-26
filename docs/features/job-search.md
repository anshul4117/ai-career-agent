# Job Search Feature

## Status

Planned

## Roadmap Phase

Phase 5

---

## Objective

Provide high-quality, relevant, and trustworthy job opportunities.

**Core principle:** Quality over quantity.

---

## Supported Sources (V1)

- Wellfound
- YC Jobs
- Internshala
- Company Career Pages

---

## User Stories

- As a user, I want to search jobs.
- As a user, I want to filter jobs.
- As a user, I want to see only relevant opportunities.
- As a user, I want to avoid spam jobs.
- As a user, I want to save jobs.

---

## Pages

| Route | Purpose |
| ----- | ------- |
| `/jobs` | Job listing with filters |
| `/jobs/[id]` | Job detail view |

---

## Filters

- Job Title
- Company
- Location
- Remote
- Employment Type
- Experience Level

---

## Job Card Fields

- Job Title
- Company Name
- Location
- Employment Type
- Posted Date
- Match Score
- Quality Score

---

## Job Detail Page

- Full Description
- Required Skills
- Preferred Skills
- Company Information
- Apply Link
- Match Score
- Quality Score

---

## APIs

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| GET | `/jobs` | List jobs with filters and pagination |
| GET | `/jobs/:id` | Get job details |
| GET | `/jobs/search` | Search jobs by keyword |
| POST | `/applications/save` | Save job for later (see Application Tracker) |

---

## Database Tables

- `companies`
- `job_sources`
- `jobs`
- `job_quality_scores`
- `job_matches`

---

## Quality Rules

Every job must be scored using:

### Freshness Score

How recently the job was posted.

### Trust Score

How trustworthy the company is.

### Relevance Score

How closely it matches the user profile.

### Quality Score

Final ranking score.

> See also: [Job Quality Engine](job-quality-engine.md)

---

## Acceptance Criteria

- Jobs load successfully
- Filters work
- Job details page works
- Quality scores display
- Duplicate jobs are removed
- Saved jobs feature works

---

## Future Scope

- LinkedIn Integration
- Naukri Integration
- Indeed Integration
- Recruiter Discovery
- Referral Discovery
- Auto Apply
