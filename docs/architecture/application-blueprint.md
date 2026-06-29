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
* Applications
* Saved Jobs
* Cover Letters
* Settings

Future

* Notifications
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
| Profile                | /profile          |
| Resume                 | /resume           |
| Resume Builder         | /resume/new       |
| Resume Preview         | /resume/:id       |
| Jobs                   | /jobs             |
| Job Details            | /jobs/:id         |
| Saved Jobs             | /saved-jobs       |
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
* Applications
* Cover Letters
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

Create Resume

↓

Edit Resume

↓

Preview

↓

Download PDF

↓

AI Improve (Future)

---

# 13. Job Workflow

Dashboard

↓

Jobs

↓

Search Jobs

↓

Job Details

↓

Save Job

↓

Apply

↓

Track Application

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

* Resume
* Profile
* Jobs
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
