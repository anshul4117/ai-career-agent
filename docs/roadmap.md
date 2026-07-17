# AI Career Agent — Development Roadmap

## Overview

This roadmap defines the implementation order of the AI Career Agent platform.

**Goals:**

- Build a stable foundation first.
- Deliver value early.
- Avoid feature creep.
- Focus on quality over quantity.
- Launch a usable MVP quickly.

---

## Development Principles

1. Foundation before AI.
2. Backend before frontend.
3. Core features before automation.
4. Quality before complexity.
5. Ship MVP before advanced features.

---

## Phase 0 — Project Foundation

**Goal:** Prepare a professional development environment.

**Status:** Completed

**Tasks:**

- Repository Setup
- Monorepo Structure
- Documentation Setup
- Cursor Rules
- Initial Architecture
- Initial Database Design

**Deliverables:**

- Folder Structure
- PRD
- Architecture Document
- Database Document
- Roadmap

---



---

## Phase 1 — Authentication & User Management

**Goal:** Allow users to securely create accounts and access the platform.

**Priority:** Critical

**Backend:**

- User Module
- Auth Module
- JWT Authentication
- Refresh Tokens
- Google OAuth

**Frontend:**

- Login Page
- Register Page
- Forgot Password
- Email Verification

**Database:**

- Users Table

**Deliverables:**

Users can:

- Register
- Login
- Logout
- Access Dashboard

**Success Criteria:** User authentication works securely.

---

## Phase 2 — Candidate Profile System

**Goal:** Build a complete candidate profile.

**Priority:** Critical

**Backend:**

- Profile Module
- Skills Module
- Education Module
- Experience Module
- Projects Module

**Frontend:**

- Profile Creation Wizard
- Profile Dashboard
- Profile Editing

**Database:**

- Profiles
- Skills
- Educations
- Experiences
- Projects

**Deliverables:**

Users can:

- Create Profiles
- Add Skills
- Add Experience
- Add Projects

**Success Criteria:** Complete candidate profile available.

---

## Phase 3 — Resume Management

**Goal:** Allow users to upload and manage resumes.

**Priority:** Critical

**Backend:**

- Resume Module
- File Upload
- Resume Storage

**Frontend:**

- Resume Upload
- Resume Management

**Infrastructure:**

- AWS S3

**Database:**

- Resumes
- Resume Versions

**Deliverables:**

Users can:

- Upload Resume
- View Resume
- Download Resume

**Success Criteria:** Resume storage fully functional.

---

## Phase 4 — AI Resume Parsing

**Goal:** Convert resumes into structured profiles.

**Priority:** High

**Backend:**

- Resume Parser Agent
- OpenAI Integration

**AI Tasks — Extract:**

- Skills
- Experience
- Education
- Projects

**Frontend:**

- Resume Parsing Results
- Review & Edit Interface

**Deliverables:** Automatic profile creation.

**Success Criteria:** Accurate extraction from uploaded resumes.

---

## Phase 5 — Job Discovery Engine

**Goal:** Collect jobs from trusted sources.

**Priority:** Critical

**Backend:**

- Job Module
- Company Module
- Job Source Module

**Integrations:**

- Wellfound
- YC Jobs
- Internshala
- Company Career Pages

**Frontend:**

- Job Listing Page
- Job Detail Page

**Database:**

- Companies
- Job Sources
- Jobs

**Deliverables:** Centralized job database.

**Success Criteria:** Fresh jobs available daily.

---

## Phase 6 — Job Quality Engine

**Goal:** Remove spam and prioritize quality jobs.

**Status:** Completed

**Priority:** Critical

**Backend:**

- Freshness Scoring
- Trust Scoring
- Deduplication

**Quality Signals:**

- Freshness
- Trust
- Activity

**Database:**

- Job Quality Scores

**Deliverables:** Quality-ranked jobs.

**Success Criteria:** Spam and duplicates minimized.

---

## Phase 7 — AI Job Matching

**Goal:** Match users to jobs.

**Status:** Completed

**Priority:** Critical

**Backend:**

- Match Agent
- Match Engine

**AI Features:**

- Match Percentage
- Skill Gap Analysis
- Recommendations

**Frontend:**

- Match Breakdown
- Missing Skills

**Database:**

- Job Matches

**Deliverables:** Personalized recommendations.

**Success Criteria:** Accurate matching.

---

## Phase 8 — Application Tracker
 
**Goal:** Manage application lifecycle.
 
**Status:** Completed (including Sprint 8.2 Advanced tracker features)
 
**Priority:** High

**Backend:**

- Application Module

**Frontend:**

- Application Dashboard

**Statuses:**

- Saved
- Applied
- Interview
- Rejected
- Offer

**Database:**

- Applications

**Deliverables:** Application tracking.

**Success Criteria:** Users can track all applications.

---

## Phase 9 — AI Resume Optimization
 
**Goal:** Improve resume quality.
 
**Status:**
- Sprint 9.1 ✅ Complete (Core optimization calculations)
- Sprint 9.2 ✅ Complete (Advanced optimization studio)
 
**Priority:** High

**Backend:**

- Resume Optimizer Agent

**AI Features:**

- ATS Optimization
- Keyword Improvements

**Frontend:**

- Optimization Dashboard

**Deliverables:** Optimized resume versions.

**Success Criteria:** Resume improvement suggestions generated.

---

## Phase 10 — AI Cover Letter Generator
 
**Goal:** Generate personalized cover letters.
 
**Status:** ✅ Complete (Sprint 10)
 
**Priority:** Medium

**Backend:**

- Cover Letter Agent

**Frontend:**

- Cover Letter Generator

**Database:**

- Cover Letters

**Deliverables:** One-click cover letter creation.

**Success Criteria:** Relevant cover letters generated.
 
---
 
## Phase 11 — Settings & UX Polish
 
**Goal:** Manage account credentials, themes, job query alerts, AI writing preferences, and mobile layout quality checks.
 
**Status:**
- Sprint 11.1 ✅ Settings & Preferences Complete
- Sprint 11.2 ✅ UI/UX Mobile Polish & Skeleton Loading System Complete
- Sprint 11.3 ✅ Dark Mode Standardization Complete
 
**Priority:** Medium
 
**Frontend:**
- Settings sidebar and panels
- Completion indicators widget
- Reusable Skeleton loaders & EmptyState components
- Mobile layout optimizations
 
**Deliverables:** Centralized settings dashboard, high-fidelity responsive skeletons, and standardized empty states.
 
---

## MVP Release

The MVP includes:

- Authentication
- Candidate Profiles
- Resume Upload
- Resume Parsing
- Job Discovery
- Job Quality Engine
- Job Matching
- Application Tracking
- Resume Optimization
- Cover Letter Generation

**Launch Goal:** Provide high-quality job discovery with AI assistance.

---

## Version 2

**After MVP Validation**

**Features:**

- Notifications
- Daily Job Alerts
- Saved Searches
- AI Career Insights
- Enhanced Matching

Do **not** build before MVP launch.

---

## Version 3

**Advanced Career Agent**

**Features:**

- Auto Apply
- Browser Automation
- Recruiter Discovery
- Referral Engine
- Career Roadmaps
- Salary Intelligence

Only build after product-market validation.

---

## Version 4

**AI Career Operating System**

**Features:**

- Career Coaching
- Interview Preparation
- AI Memory
- Learning Recommendations
- Long-Term Career Planning

---

## Current Development Focus

**Current Active Phase:** Phase 19 — Lighthouse & Bundle Size Optimization

- [x] Global Layout & Navigation Shell
- [x] Global Toast & Feedback System
- [x] Global Search & Command Palette (Cmd+K / Ctrl+K)
- [x] Dark Mode Support (System/Manual)
- [x] Error Pages & Boundaries System
- [x] Onboarding & Product Tour System
- [x] Premium Branded Loading System
- [x] Lighthouse & Bundle Size Optimization

## Phase 16 — Production-Ready Error Boundaries & Offline Support

**Goal:** Establish premium brutalist error handling, offline triggers, network error catchers, and structured recovery states.

**Status:** Completed

**Tasks:**
- [x] Redesign 404 Not Found Page (`app/not-found.tsx`)
- [x] Implement client-side Route Error Boundary (`app/error.tsx`)
- [x] Implement fatal root layout Error Boundary (`app/global-error.tsx`)
- [x] Create reusable OfflineState notifier component
- [x] Create reusable API NetworkError component
- [x] Create standardized empty state variants wrapping the brutalist `EmptyState`
- [x] Design inline animated ErrorBanner component

## Phase 17 — First-Time Onboarding & Tour System

**Goal:** Implement first-time welcome flows, guided product tours, progressive setup checklists, and helper contextual tips.

**Status:** Completed

**Tasks:**
- [x] Create Onboarding Zustand Store (`onboarding.store.ts`)
- [x] Create welcome highlights overlay (`WelcomeModal`)
- [x] Create relative highlight cutout tour renderer (`TourOverlay`)
- [x] Design dynamic progress task setup list (`Checklist`)
- [x] Create single-alert contextual tip elements (`ProductTips`)
- [x] Add Help dropdown menu trigger in header
- [x] Connect restart and tips toggles in settings panel

## Phase 18 — Premium Branded Loading System

**Goal:** Replace generic spinners with high-end, Framer Motion animated career-orbiting loaders, overlays, and page transition loading sheets.

**Status:** Completed

**Tasks:**
- [x] Create core orbit calculation component (`BrandLoader`)
- [x] Export unified variations (`LoadingScreen`, `LoadingOverlay`, `PageLoader`, `InlineLoader`)
- [x] Integrate reduced motion standard checking (`useReducedMotion()`)
- [x] Globally replace Lucide `Loader2` and raw spinners in components/routes
- [x] Create route-level Next.js loading layers (`loading.tsx`)

## Phase 19 — Lighthouse & Bundle Size Optimization

**Goal:** Conduct complete Lighthouse reviews, optimize crawlability metadata, and apply code splitting to decrease first load sizes.

**Status:** Completed

**Tasks:**
- [x] Setup dynamic App Router sitemap and robots directives (`sitemap.ts`, `robots.ts`)
- [x] Complete OpenGraph, Twitter card, and canonical meta configurations
- [x] Implement dynamic imports to split heavy layout components (`ResumeBuilderLayout`, `CalendarView`, `ApplicationDetailDialog`)
- [x] Setup lazy loaded client portal for global command palette

**Next Task:** Design API contracts and database schema implementation.

---

## Definition of Done

A feature is considered complete only when:

- Backend implemented
- Frontend implemented
- Database integrated
- Validation added
- Error handling added
- Documentation updated
- Tested successfully

Feature status should then be marked as completed in `tasks.md`.
