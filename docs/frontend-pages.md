# AI Career Agent — Frontend Pages

## Overview

This document defines all frontend pages for Version 1 (MVP).

**Design system:**

- Modern Brutalism
- Solarized Light theme
- Space Grotesk headings
- Inter body font

All authenticated pages must use:

- Dashboard layout
- Sidebar
- Header

> See also: [Design System](design-system.md)

---

## Public Pages

### Landing Page

| Property | Value |
| -------- | ----- |
| Route | `/` |
| Purpose | Introduce product and convert visitors into users |

#### Hero

**Headline:** Find High-Quality Jobs. Not Spam.

**Subheadline:** AI-powered job discovery built for serious candidates.

**Actions:**

- Get Started
- Watch Demo

#### Social Proof

Display:

- Total Jobs
- Total Users
- Companies

#### Features

Cards:

- AI Job Discovery
- Resume Optimization
- Cover Letter Generation
- Job Matching
- Application Tracking

#### How It Works

1. Create Profile
2. Upload Resume
3. Find Jobs
4. Apply Faster

#### FAQ

Common questions.

#### Footer

Links:

- About
- Contact
- Privacy Policy
- Terms

---

## Authentication Pages

### Login

| Property | Value |
| -------- | ----- |
| Route | `/login` |

**Fields:** Email · Password

**Actions:** Login · Forgot Password

**Link:** Register

---

### Register

| Property | Value |
| -------- | ----- |
| Route | `/register` |

**Fields:** Name · Email · Password

**Actions:** Create Account

**Link:** Login

---

### Forgot Password

| Property | Value |
| -------- | ----- |
| Route | `/forgot-password` |

**Fields:** Email

**Action:** Send Reset Link

---

## Authenticated Pages

All authenticated pages use **Dashboard Layout**.

---

### Dashboard

| Property | Value |
| -------- | ----- |
| Route | `/dashboard` |
| Purpose | User overview |

**Widgets:**

| Widget | Content |
| ------ | ------- |
| Profile Completion | Progress % |
| Resume Status | Uploaded / Not Uploaded |
| Job Matches | Recommended jobs |
| Applications | Total applications |
| Recent Activity | Latest user actions |

---

### Profile

| Property | Value |
| -------- | ----- |
| Route | `/profile` |
| Purpose | Manage user profile |

**Sections:**

#### Personal Information

- Name
- Email
- Phone
- Location

#### Career Preferences

- Preferred Role
- Preferred Location
- Employment Type

#### Skills

Add / Edit / Delete

#### Education

Add / Edit / Delete

#### Experience

Add / Edit / Delete

#### Projects

Add / Edit / Delete

---

### Resume

| Property | Value |
| -------- | ----- |
| Route | `/resume` |
| Purpose | Manage resumes |

**Sections:**

#### Upload Resume

Drag & drop

#### Resume List

Uploaded resumes

#### Resume Actions

- View
- Download
- Delete

#### Parsing Status

- Pending
- Processing
- Completed

---

### Jobs

| Property | Value |
| -------- | ----- |
| Route | `/jobs` |
| Purpose | Browse jobs |

**Layout:** Three-column

| Column | Content |
| ------ | ------- |
| Left | Filters |
| Center | Job list |
| Right | Job preview |

#### Filters

- Search
- Location
- Remote
- Experience
- Employment Type

#### Job Card

**Display:**

- Job Title
- Company
- Location
- Match Score
- Quality Score

**Actions:** View · Save

---

### Job Details

| Property | Value |
| -------- | ----- |
| Route | `/jobs/[id]` |
| Purpose | View complete job details |

**Sections:**

- Job Information
- Company Information
- Required Skills
- Match Score
- Quality Score
- Apply Button
- Save Button

---

### Saved Jobs

| Property | Value |
| -------- | ----- |
| Route | `/saved-jobs` |
| Purpose | Display saved jobs |

**Actions:** Remove · View

---

### Applications

| Property | Value |
| -------- | ----- |
| Route | `/applications` |
| Purpose | Track applications |

#### Status Types

- Saved
- Applied
- Interview
- Rejected
- Offer

#### Application Table

| Column |
| ------ |
| Job |
| Company |
| Applied Date |
| Status |

---

### Cover Letters

| Property | Value |
| -------- | ----- |
| Route | `/cover-letters` |
| Purpose | Generate and manage cover letters |

#### Generator Form

**Fields:** Job Title · Company · Job Description

**Action:** Generate

#### Generated Letter

**Preview**

**Actions:** Copy · Download · Save

---

### Settings

| Property | Value |
| -------- | ----- |
| Route | `/settings` |
| Purpose | Manage account settings |

#### Account

- Name
- Email

#### Password

Change password

#### Notifications

Email notifications

#### Preferences

Theme · Language

---

## Error Pages

### 404

| Property | Value |
| -------- | ----- |
| Route | `/not-found` |
| Message | Page Not Found |
| Action | Go Home |

### 500

| Property | Value |
| -------- | ----- |
| Route | `/error` |
| Message | Something Went Wrong |
| Action | Try Again |

---

## Loading Pages

Every page must include:

- Skeleton loader
- Error state
- Empty state

Never show blank screens.

---

## Sidebar Navigation

```
Dashboard
Profile
Resume
Jobs
Saved Jobs
Applications
Cover Letters
Settings
```

---

## Header

**Contains:** Search · Notifications · User Menu

| Property | Value |
| -------- | ----- |
| Height | 72px |

Uses design system rules.

---

## Mobile Requirements

All pages must support:

- Mobile
- Tablet
- Desktop

Mobile-first development.

**Breakpoints:** 320px+ · 768px+ · 1024px+ · 1440px+

---

## MVP Pages

**Must build first:**

1. Landing Page
2. Login
3. Register
4. Dashboard
5. Profile
6. Resume
7. Jobs
8. Job Details
9. Applications

Everything else comes after MVP pages.
