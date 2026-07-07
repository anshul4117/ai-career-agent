# AI Career Agent — Application Blueprint

**Version:** v0.1.0
**Status:** Draft
**Owner:** Anshul Kumar
**Project:** AI Career Agent

---

# 1. Project Overview

## Vision

AI Career Agent is an AI-powered career operating system that helps job seekers manage their complete career journey from profile creation to landing their dream job.

Unlike traditional job portals, AI Career Agent provides intelligent assistance throughout the hiring process.

---

## Mission

Help users:

* Build professional resumes
* Discover relevant jobs
* Track applications
* Generate AI-powered cover letters
* Improve resumes using AI
* Organize their job search
* Manage their career from one platform

---

# 2. Target Users

Primary Users

* Students
* Freshers
* Software Engineers
* Designers
* Product Managers
* Experienced Professionals
* Career Switchers

Future Users

* Recruiters
* Companies
* Hiring Managers
* Admin Team

---

# 3. User Roles

## Guest

Can:

* Visit landing page
* View features
* Read pricing
* Login
* Register
* Read FAQs
* Contact us

Cannot:

* Access dashboard
* Create resume
* Apply jobs

---

## User

Can:

* Manage profile
* Build resume
* Save jobs
* Track applications
* Generate cover letters
* Use AI features
* Manage settings

---

## Admin (Future)

Can:

* Manage users
* Manage jobs
* View analytics
* Moderate reports
* Configure AI settings

---

# 4. Application Modules

Current

* Landing
* Authentication
* Dashboard
* Profile
* Resume
* Jobs
* Saved Jobs
* Job Alerts
* Applications
* Cover Letters
* Notifications
* Settings

Future

* AI Chat
* Career Roadmap
* Interview Preparation
* Recruiter Portal
* Admin Panel
* Analytics

---

# 5. Page Inventory

## Public Pages

| Page               | Route            |
| ------------------ | ---------------- |
| Landing            | /                |
| Login              | /login           |
| Register           | /register        |
| Forgot Password    | /forgot-password |
| Reset Password     | /reset-password  |
| Verify Email       | /verify-email    |
| About              | /about           |
| Pricing            | /pricing         |
| Contact            | /contact         |
| FAQ                | /faq             |
| Privacy Policy     | /privacy         |
| Terms & Conditions | /terms           |
| 404                | /404             |

---

## Protected Pages

| Page                   | Route             |
| ---------------------- | ----------------- |
| Dashboard              | /dashboard        |
| Complete Profile       | /complete-profile |
| Profile Overview       | /profile          |
| Edit Profile           | /profile/edit     |
| Resume Workspace       | /resume           |
| Create Wizard           | /resume/new       |
| Resume Preview          | /resume/:id       |
| Edit Settings           | /resume/:id/edit  |
| Jobs                   | /jobs             |
| Job Details            | /jobs/:id         |
| Saved Jobs             | /saved-jobs       |
| Job Alerts             | /job-alerts       |
| Applications           | /applications     |
| Cover Letters          | /cover-letters    |
| Settings               | /settings         |
| Notifications (Future) | /notifications    |

---

# 6. Route Categories

## Public Routes

Accessible without login.

Examples:

/

/about

/pricing

/contact

/faq

/privacy

/terms

---

## Guest Routes

Only accessible when NOT authenticated.

Examples:

/login

/register

/forgot-password

/reset-password

/verify-email

Rule:

If authenticated

↓

Redirect to Dashboard

---

## Protected Routes

Require authentication.

Examples:

/dashboard

/profile

/resume

/jobs

/applications

/settings

Rule:

If guest

↓

Redirect to Login

---

# 7. Application Workflow

## New User

Landing

↓

Register

↓

Verify Email

↓

Complete Profile

↓

Dashboard

↓

Resume

↓

Job Search

↓

Apply

↓

Track Application

---

## Returning User

Landing

↓

Login

↓

Dashboard

---

## Logout

Dashboard

↓

Logout

↓

Landing

---

# 8. Navigation Structure

Landing Navigation

* Logo
* Features
* Pricing
* FAQ
* Login
* Get Started

Dashboard Sidebar

* Dashboard
* Profile
* Resume
* Jobs
* Saved Jobs
* Job Alerts
* Applications
* Cover Letters
* Notifications
* Settings

Header

* Search
* Notifications
* User Menu

---

# 9. Authentication Rules

Guest

Cannot access:

* Dashboard
* Profile
* Resume
* Jobs
* Settings

Authenticated User

Cannot access:

* Login
* Register

After Login

↓

Dashboard

After Register

↓

Complete Profile

---

# 10. Authorization Matrix

| Page          | Guest | User |
| ------------- | ----- | ---- |
| Landing       | ✅     | ✅    |
| Login         | ✅     | ❌    |
| Register      | ✅     | ❌    |
| Dashboard     | ❌     | ✅    |
| Profile       | ❌     | ✅    |
| Resume        | ❌     | ✅    |
| Jobs          | ❌     | ✅    |
| Applications  | ❌     | ✅    |
| Saved Jobs    | ❌     | ✅    |
| Job Alerts    | ❌     | ✅    |
| Cover Letters | ❌     | ✅    |
| Settings      | ❌     | ✅    |

---

# 11. Profile Completion Flow

Register

↓

Email Verification

↓

Complete Profile

Fields

* Name
* Headline
* Location
* Experience
* Skills
* Education
* Profile Photo

↓

Dashboard

---

# 12. Resume Workflow

Dashboard

↓

Resume

↓

Create Resume / Choose Template

↓

Advanced Drag & Drop Editor (Sprint 3.3)
* Reorder sections & listings via DnD-kit
* Toggle visibility per section
* Local Undo / Redo history state machine
* Create custom listing sections

↓

Templates & Theme Customization (Sprint 3.6)
* Switch templates instantly (6 built-in presets)
* Injected CSS variables engine (colors, font typography spacing, column layout split)
* Live Preview updates instantly without page reload

↓

Export & Print Engine (Sprint 3.7)
* Client-side PDF print layout engine
* Injected physical print stylesheet config overrides (paper A4/Letter size, orientation)
* Dynamic page break dashed line guides overlay on preview
* Grayscale format toggle on preview
* Export history logging persistence

↓

Live Preview (Instant render across 6 templates)

↓

Download PDF / Export (Future)

---

# 13. Job Discovery & Workflow Spec

## Ingestion & Navigation
Dashboard -> Jobs Workspace -> Search Query -> Filters -> Details Pane -> Save Collection / AI Match -> Apply -> Applications Tracker

## Route Mapping Matrix
1. **`/jobs`** (Protected): Main discovery search. Entry: Dashboard Sidebar. Exit: Job Detail view. Auth: Required. Navigation: Sidebar. Future Deps: jobs.store.ts.
2. **`/jobs/[id]`** (Protected): Dynamic detail page. Entry: Card Click. Exit: Apply Redirect. Auth: Required. Deps: recommendation.store.ts.
3. **`/companies`** (Protected): Corporate directory. Entry: Job Detail link. Exit: Company Detail. Auth: Required. Deps: company.store.ts.
4. **`/companies/[id]`** (Protected): Dynamic corporate profile. Entry: Link Click. Exit: Active job card click. Auth: Required.
5. **`/saved-jobs`** (Protected): Bookmark collections. Entry: Sidebar. Exit: Jobs detail. Auth: Required. Deps: bookmark.store.ts.
6. **`/search`** (Protected): Redirect handler syncing query parameters. Entry: Global search. Exit: `/jobs` with queries. Auth: Required.
7. **`/recommendations`** (Protected): Candidate profile match feed. Entry: Dashboard link. Exit: Detail card. Auth: Required.
8. **`/job-alerts`** (Protected): Email notification toggles. Entry: Settings pane. Exit: Dashboard. Auth: Required.
9. **`/application/new`** (Protected): Form initializing applying logs. Entry: Apply click. Exit: Tracker list. Auth: Required.
10. **`/application/[id]`** (Protected): Tracker detail log view. Entry: Application lists. Exit: Edit logs. Auth: Required.

## Zustand Stores Design
- **`jobs.store.ts`**: Holds ingested listings arrays, pagination metrics, active selection index, and retrieval status loaders.
- **`search.store.ts`**: Manages queries inputs, recent search list cache (limit 10), and url query state builders.
- **`company.store.ts`**: Manages profile lookups, hiring indices, and related job list caches.
- **`bookmark.store.ts`**: Manages optimistic saves caches, collections arrays, and background synchronization queues.
- **`recommendation.store.ts`**: Handles profile matching scores, weight matrices, and local text embedding results.

## Service Layer Operations
- **`job.service.ts`**: Implements endpoints parsing Wellfound APIs, YC RSS, and Greenhouse JSON endpoints.
- **`company.service.ts`**: Feeds corporate logos, headquarters, and tech stacks.
- **`search.service.ts`**: Orchestrates local indices indexing and Elasticsearch/Algolia queries.
- **`bookmark.service.ts`**: Syncs collection updates with database stores.
- **`recommendation.service.ts`**: Executes skill alignments and years-of-experience comparisons.

## Responsive Strategy
- **Desktop (>= 1024px)**: Renders side-by-side split screen. Left column: filters sidebar and job listings grid. Right column: dynamic sticky details pane.
- **Tablet (768px - 1023px)**: Left column list of job cards, selecting a card opens detail page in a modal overlay drawer.
- **Mobile (< 768px)**: Stacked single column list view. Selecting a card navigates to `/jobs/[id]` or slides up full-screen overlay sheet.

---

# 14. Cover Letter Workflow

Select Job

↓

Generate AI Cover Letter

↓

Edit

↓

Save

↓

Export

---

# 15. Application Workflow

Applied Job

↓

Application Created

↓

Status Updates

Applied

↓

Interview

↓

Offer

↓

Rejected

↓

Archived

---

# 16. State Management Strategy

Global State

* Theme
* Sidebar
* Search
* Notifications
* Session (temporary until production auth)

Feature State

* Resume (Zustand useBuilderStore with debounced Auto-Save & local Undo/Redo state machine)
* Theme Customization (Zustand useThemeStore syncing styling selections, colors, fonts, spacing, layout presets to localStorage)
* Export & Print Engine (Zustand useExportStore tracking print scales, margins, page breaks, format downloads, and export logs logs)
* Profile
* Jobs
* Job Quality Engine (Zustand useQualityStore tracking computed audits, freshness ratings, and duplicates detection)
* Applications

Form State

* React Hook Form

Server State (Future)

* TanStack Query

---

# 17. Design Principles

Modern Brutalism

* 3px Borders
* Hard Shadows
* Solarized Theme
* Large Typography
* Flat UI
* Responsive
* Accessible

---

# 18. Folder Structure

docs/

apps/

packages/

public/

.github/

---

# 19. Development Workflow

Requirement

↓

Documentation

↓

Architecture

↓

Feature Branch

↓

Implementation

↓

Testing

↓

Lint

↓

Type Check

↓

Build

↓

Pull Request

↓

Merge

↓

Delete Branch

---

# 20. Git Workflow

main

↓

feature branch

↓

Commit

↓

Push

↓

Pull Request

↓

Review

↓

Merge

↓

Delete Branch

---

# 21. Quality Gates

Every feature must pass:

* npm run lint
* npm run type-check
* npm run build
* Responsive Testing
* Accessibility Review
* Manual QA
* Documentation Update

---

# 22. Future Roadmap

Version 0.2

* Stable Authentication
* Profile Module

Version 0.3

* Resume Builder

Version 0.4

* Jobs Module

Version 0.5

* AI Resume Assistant

Version 0.6

* AI Cover Letter Generator

Version 0.7

* Application Tracker

Version 0.8

* Notifications

Version 0.9

* Recruiter Portal

Version 1.0

* Production Launch

---

# 23. Engineering Principles

* Feature-first architecture
* Type-safe code
* Reusable components
* Consistent naming
* Documentation-first development
* Atomic commits
* Clean Git history
* Mobile-first responsive design
* Accessibility by default
* Scalable architecture

---

# 24. Definition of Done

A feature is considered complete only if:

* Requirements implemented
* UI completed
* Responsive
* Accessible
* Lint passes
* Type-check passes
* Build passes
* Documentation updated
* Tested manually
* Merged into main

---

# 25. Project Philosophy

> Build a career platform that feels like a personal AI career coach, not just another job portal.

Every feature should help users get hired faster while maintaining a clean, scalable, and maintainable engineering architecture.
