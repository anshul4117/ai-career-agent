# AI Career Agent — Database Design

## Overview

The database is designed to support:

- User Authentication
- Candidate Profiles
- Resume Management
- Job Discovery
- Job Matching
- Cover Letter Generation
- Application Tracking

| Concern | Technology |
| ------- | ---------- |
| Database Engine | PostgreSQL |
| ORM | Prisma |

---

## Design Principles

1. Normalize important data.
2. Avoid unnecessary duplication.
3. Keep relationships explicit.
4. Support future scaling.
5. Prefer relational modeling over JSON storage.

---

## Core Entities

```
User
  ↓
Profile
  ↓
Resume
  ↓
Job Match
  ↓
Application
```

---

## User Table

**Purpose:** Stores authentication and account information.

**Table:** `users`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `email` | Unique user email |
| `password_hash` | Hashed password (nullable for OAuth) |
| `provider` | Auth provider enum |
| `is_verified` | Email verification status |
| `created_at` | Record creation timestamp |
| `updated_at` | Record update timestamp |

**Relationships:**

- 1 User → 1 Profile
- 1 User → Many Resumes
- 1 User → Many Applications
- 1 User → Many Cover Letters

---

## Profile Table

**Purpose:** Stores career-related information.

**Table:** `profiles`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `user_id` | Foreign key → `users.id` |
| `first_name` | Candidate first name |
| `last_name` | Candidate last name |
| `phone` | Contact phone number |
| `location` | Current or preferred location |
| `headline` | Professional headline |
| `summary` | Career summary |
| `preferred_role` | Target job role |
| `preferred_location` | Target location |
| `employment_type` | Preferred employment type |
| `years_of_experience` | Total years of experience |
| `created_at` | Record creation timestamp |
| `updated_at` | Record update timestamp |

**Relationships:**

- 1 Profile → Many Skills
- 1 Profile → Many Educations
- 1 Profile → Many Experiences
- 1 Profile → Many Projects

---

## Skills Table

**Purpose:** Store candidate skills.

**Table:** `skills`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `profile_id` | Foreign key → `profiles.id` |
| `name` | Skill name |
| `level` | Proficiency level |

**Examples:** Node.js, React, Redis, MongoDB, AWS

---

## Education Table

**Purpose:** Store educational background.

**Table:** `educations`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `profile_id` | Foreign key → `profiles.id` |
| `institution` | School or university name |
| `degree` | Degree earned |
| `field_of_study` | Major or specialization |
| `start_date` | Enrollment start date |
| `end_date` | Graduation or end date |
| `cgpa` | Grade point average |

---

## Experience Table

**Purpose:** Store work experience.

**Table:** `experiences`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `profile_id` | Foreign key → `profiles.id` |
| `company_name` | Employer name |
| `role` | Job title |
| `description` | Role description |
| `start_date` | Employment start date |
| `end_date` | Employment end date |
| `currently_working` | Whether currently employed here |

---

## Projects Table

**Purpose:** Store candidate projects.

**Table:** `projects`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `profile_id` | Foreign key → `profiles.id` |
| `title` | Project title |
| `description` | Project description |
| `github_url` | Source code URL |
| `live_url` | Live demo URL |
| `technologies` | Tech stack used |

---

## Resume Table

**Purpose:** Store uploaded resumes.

**Table:** `resumes`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `user_id` | Foreign key → `users.id` |
| `file_name` | Original file name |
| `file_url` | Storage URL |
| `storage_provider` | Storage backend (e.g. S3) |
| `parsed` | Whether resume has been parsed |
| `created_at` | Upload timestamp |

**Relationships:**

- 1 Resume → Many Resume Versions

---

## Resume Versions Table

**Purpose:** Store optimized resume versions.

**Table:** `resume_versions`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `resume_id` | Foreign key → `resumes.id` |
| `version_name` | Human-readable version label |
| `file_url` | Storage URL |
| `generated_by_ai` | Whether AI generated this version |
| `created_at` | Creation timestamp |

**Examples:** Original Resume, Backend Resume, Full Stack Resume, ATS Optimized Resume

---

## Company Table

**Purpose:** Store company information.

**Table:** `companies`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `name` | Company name |
| `website` | Company website URL |
| `industry` | Industry sector |
| `location` | Headquarters or primary location |
| `company_size` | Employee count range |
| `description` | Company description |
| `trust_score` | Credibility score from quality engine |
| `created_at` | Record creation timestamp |

**Relationships:**

- 1 Company → Many Jobs

---

## Job Source Table

**Purpose:** Track where jobs came from.

**Table:** `job_sources`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `name` | Source name |
| `base_url` | Source base URL |

**Examples:** Wellfound, YC Jobs, Internshala, Company Career Page

---

## Jobs Table

**Purpose:** Store job listings.

**Table:** `jobs`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `company_id` | Foreign key → `companies.id` |
| `job_source_id` | Foreign key → `job_sources.id` |
| `title` | Job title |
| `description` | Full job description |
| `location` | Job location |
| `employment_type` | Employment type enum |
| `salary_min` | Minimum salary |
| `salary_max` | Maximum salary |
| `experience_required` | Required experience level |
| `remote_allowed` | Whether remote work is allowed |
| `job_url` | Original listing URL |
| `posted_at` | Date job was posted |
| `created_at` | Record creation timestamp |
| `status` | Job status enum |

**Relationships:**

- 1 Job → Many Job Matches
- 1 Job → Many Applications

---

## Job Quality Score Table

**Purpose:** Store quality engine scores.

**Table:** `job_quality_scores`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `job_id` | Foreign key → `jobs.id` |
| `freshness_score` | Recency score |
| `trust_score` | Company credibility score |
| `relevance_score` | Candidate alignment score |
| `quality_score` | Final composite score |
| `last_calculated_at` | Last recalculation timestamp |

---

## Job Match Table

**Purpose:** Store AI-generated matching results.

**Table:** `job_matches`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `job_id` | Foreign key → `jobs.id` |
| `user_id` | Foreign key → `users.id` |
| `match_percentage` | Overall match score (0–100) |
| `matching_skills` | Skills that align with the job |
| `missing_skills` | Skills the candidate lacks |
| `strengths` | Candidate strength areas |
| `improvements` | Suggested improvements |
| `generated_at` | When the match was computed |

---

## Cover Letters Table

**Purpose:** Store generated cover letters.

**Table:** `cover_letters`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `user_id` | Foreign key → `users.id` |
| `job_id` | Foreign key → `jobs.id` |
| `content` | Cover letter body |
| `generated_by_ai` | Whether AI generated this letter |
| `created_at` | Creation timestamp |

---

## Applications Table

**Purpose:** Track job applications.

**Table:** `applications`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `user_id` | Foreign key → `users.id` |
| `job_id` | Foreign key → `jobs.id` |
| `resume_version_id` | Foreign key → `resume_versions.id` |
| `cover_letter_id` | Foreign key → `cover_letters.id` |
| `status` | Application status enum |
| `applied_at` | Date application was submitted |
| `notes` | User notes |
| `updated_at` | Last status update timestamp |

---

## Notifications Table

**Purpose:** Store user notifications.

**Table:** `notifications`

| Field | Description |
| ----- | ----------- |
| `id` | Primary key |
| `user_id` | Foreign key → `users.id` |
| `title` | Notification title |
| `message` | Notification body |
| `read` | Whether user has read it |
| `created_at` | Creation timestamp |

---

## Enums

### Auth Provider

| Value | Description |
| ----- | ----------- |
| `EMAIL` | Email/password authentication |
| `GOOGLE` | Google OAuth |
| `GITHUB` | GitHub OAuth |

### Employment Type

| Value | Description |
| ----- | ----------- |
| `FULL_TIME` | Full-time employment |
| `PART_TIME` | Part-time employment |
| `INTERNSHIP` | Internship |
| `CONTRACT` | Contract work |
| `REMOTE` | Fully remote |
| `HYBRID` | Hybrid on-site/remote |

### Application Status

| Value | Description |
| ----- | ----------- |
| `SAVED` | Saved for later |
| `APPLIED` | Application submitted |
| `INTERVIEW_SCHEDULED` | Interview booked |
| `INTERVIEW_COMPLETED` | Interview done |
| `REJECTED` | Application rejected |
| `OFFER_RECEIVED` | Offer extended |
| `ACCEPTED` | Offer accepted |
| `WITHDRAWN` | Candidate withdrew |

### Job Status

| Value | Description |
| ----- | ----------- |
| `ACTIVE` | Currently open |
| `EXPIRED` | Listing expired |
| `ARCHIVED` | Manually archived |

---

## Indexing Strategy

| Table | Indexed Column |
| ----- | -------------- |
| `users` | `email` |
| `profiles` | `user_id` |
| `skills` | `profile_id` |
| `jobs` | `company_id` |
| `jobs` | `posted_at` |
| `applications` | `user_id` |
| `applications` | `job_id` |
| `job_matches` | `user_id` |
| `job_matches` | `job_id` |

---

## Future Tables (Not V1)

These tables should **not** be implemented in Version 1.

| Table | Purpose |
| ----- | ------- |
| `future_referrals` | Referral tracking |
| `future_interviews` | Interview scheduling and prep |
| `future_salary_insights` | Compensation intelligence |
| `future_auto_apply_logs` | Automated application logs |
| `future_career_roadmaps` | Career path planning |
| `future_ai_memory` | Persistent AI context |

---

## Database Relationships Summary

```
User
  → Profile
  → Resumes
  → Cover Letters
  → Applications

Profile
  → Skills
  → Education
  → Experience
  → Projects

Company
  → Jobs

Jobs
  → Quality Scores
  → Job Matches
  → Applications

Applications
  → Resume Version
  → Cover Letter
```

---

## Version 1 Database Scope

**Implement:**

- Users
- Profiles
- Skills
- Education
- Experience
- Projects
- Resumes
- Resume Versions
- Companies
- Job Sources
- Jobs
- Job Quality Scores
- Job Matches
- Cover Letters
- Applications

**Ignore** all future tables until Version 2.
