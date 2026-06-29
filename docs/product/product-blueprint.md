# AI Career Agent — Master Product Blueprint (Single Source of Truth)

---

## 1. Product Overview

### 1.1 Product Name
**AI Career Agent** (also referred to as **ACA** or **The Career Operating System**).

### 1.2 Vision
To empower technology professionals and job seekers to navigate their careers with maximum leverage, replacing tedious manual job hunting, resume editing, and pipeline tracking with an AI-driven, high-fidelity agent that coordinates their entire career pipeline.

### 1.3 Mission
To deliver a zero-spam, quality-first career operating system that curates verified active opportunities, provides instant ATS-friendly resume tailoring, generates highly contextualized cover letters, and organizes applications from discovery to offer, saving candidates hundreds of hours of manual labor.

### 1.4 Problem Statement
Traditional job search is broken:
- **Job Board Spam**: Job boards are saturated with ghost listings, duplicate ads, expired roles, and recruiters collecting resumes without hiring intent.
- **Manual Adaptation Overhead**: ATS (Applicant Tracking Systems) require candidates to manually optimize keywords in their resumes for every job description.
- **Fragmented Workflows**: Candidates use scattered spreadsheets, email folders, and multiple dashboard logins to track their application pipelines.
- **Generic AI Output**: Basic AI tools yield boilerplate cover letters and generic advice because they lack deep candidate profile context or specific job description details.

### 1.5 Target Users
- **Technology Professionals**: Software engineers, product managers, UI/UX designers, data scientists, QA leads, devops engineers.
- **Students & New Graduates**: Entry-level candidates looking for verified internships and junior positions without getting lost in generic boards.
- **Active Job Seekers**: Candidates actively applying to multiple positions daily and requiring structured pipeline optimization.

### 1.6 User Personas

#### Persona A: Aarav Sharma (Software Engineer)
- **Background**: 3 years of experience in JavaScript/TypeScript, React, Node.js.
- **Frustration**: Spends 10 hours a week customizing resumes and writing cover letters for 30 jobs. Receives mostly automated rejections or ghosting from old listings.
- **Goal**: Find 5-10 high-match, verified-active roles per week and generate customized, high-quality application materials with one click.

#### Persona B: Neha Patel (CS Student)
- **Background**: Final-year B.Tech student, seeking front-end engineering internships.
- **Frustration**: Lacks industry experience; doesn't know what skills are missing from her projects compared to actual internship requirements.
- **Goal**: Understand skill gaps, optimize her resume with project details, and track applications on an interactive pipeline board.

### 1.7 Business Goals
- **Conversion Metric**: Achieve a 15% conversion rate from registered user to active pipeline tracker user.
- **User Retention**: Increase weekly active usage by offering automatic daily job matching.
- **Data Curation**: Build the most trusted, spam-free database of tech opportunities in target regions.

### 1.8 Technical Goals
- **Low Latency**: Maintain page transitions under 100ms and render initial dashboard loads under 200ms.
- **Responsive Layout**: Adhere to modern brutalist UI design principles that look consistent across desktop, tablet, and mobile screens.
- **AI Performance**: Deliver ATS matching scores and optimizer suggestions in under 3 seconds.

---

## 2. Product Architecture

### 2.1 High-Level Architecture Map

```
                  ┌──────────────────────────────────────────────┐
                  │                 Landing Page                 │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │            Authentication / Registration     │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │             Onboarding (Profile)             │
                  └──────────────────────┬───────────────────────┘
                                         │
                                         ▼
     ┌───────────────────────────────────┴───────────────────────────────────┐
     ▼                                   ▼                                   ▼
┌──────────────┐                  ┌──────────────┐                  ┌──────────────┐
│  Resume Hub  │                  │   Jobs Hub   │                  │ Applications │
└──────┬───────┘                  └──────┬───────┘                  └──────┬───────┘
       │                                 │                                 │
       └────────────────►   [ AI Service Layer ]   ◄───────────────────────┘
                            - ATS Parser / Matcher
                            - Resume Tailoring Engine
                            - Cover Letter Generator
```

---

## 3. Product Modules

### 3.1 Landing Module
- **Purpose**: First landing point for guest traffic, showcasing features and value propositions.
- **Responsibilities**: Displays curated features list, testimonials, FAQ dropdowns, and links to registration.
- **Dependencies**: None.
- **Pages**: `/` (Landing Page).
- **Components**: `LandingNavbar`, `HeroSection`, `FeaturesSection`, `HowItWorksSection`, `TestimonialsSection`, `FaqSection`, `LandingFooter`.

### 3.2 Authentication Module
- **Purpose**: Authenticate candidate users and preserve active sessions.
- **Responsibilities**: Validates email/password credentials, email verification codes, password resets, and session cookie synchronization.
- **Dependencies**: Zustand, LocalStorage, Cookies.
- **Pages**: `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password`.
- **Components**: `LoginForm`, `RegisterForm`, `VerifyEmailForm`, `ForgotPasswordForm`, `ResetPasswordForm`, `AuthCard`, `AuthHeader`, `AuthFooter`, `AuthLayout`.

### 3.3 Dashboard Module
- **Purpose**: Main hub summary for returning candidates.
- **Responsibilities**: Renders matching score statistics, recent matched jobs, resume parsing alerts, and tracking pipeline summaries.
- **Dependencies**: Profile, Resume, Jobs, Applications modules.
- **Pages**: `/dashboard`.
- **Components**: `DashboardLayout`, `StatsCard`, `MatchedJobsFeed`, `QuickActionsPanel`, `PipelineSummaryChart`.

### 3.4 Profile Module
- **Purpose**: Single source of truth for candidate details.
- **Responsibilities**: Manages candidate contact details, skills, employment histories, education lists, and target locations.
- **Dependencies**: None.
- **Pages**: `/profile`, `/complete-profile`.
- **Components**: `CompleteProfileForm`, `ProfileForm`, `SkillsInput`, `WorkHistoryList`, `EducationHistoryList`.

### 3.5 Resume Module
- **Purpose**: Upload, manage, and draft resumes.
- **Responsibilities**: Handles PDF file uploads, parsed schema views, and list operations for candidate resumes.
- **Dependencies**: Profile Module.
- **Pages**: `/resume`, `/resume/[id]`.
- **Components**: `ResumeList`, `ResumeCard`, `PdfViewer`, `ParsingStatusBadge`.

### 3.6 Resume Builder Module
- **Purpose**: Create and edit resumes inside an interactive editor.
- **Responsibilities**: Form-based resume building, template styling controls, section ordering, and PDF generation.
- **Dependencies**: Resume Module.
- **Pages**: `/resume/new`.
- **Components**: `ResumeFormSteps`, `BrutalPreviewPanel`, `SectionSorter`, `PdfExporter`.

### 3.7 Jobs Module
- **Purpose**: Job discovery and details view.
- **Responsibilities**: Filters jobs by role, location, and employment type, displaying matching statistics and skill gaps.
- **Dependencies**: Resume Module (for Match Score computations).
- **Pages**: `/jobs`, `/jobs/[id]`.
- **Components**: `JobList`, `JobCard`, `JobDetailsPanel`, `MatchScoreWidget`, `SkillGapList`.

### 3.8 Saved Jobs Module
- **Purpose**: Bookmark jobs for future actions.
- **Responsibilities**: Stores selected job IDs and renders bookmarked listings.
- **Dependencies**: Jobs Module.
- **Pages**: `/saved-jobs`.
- **Components**: `SavedJobList`, `JobCard`.

### 3.9 Applications Module (Pipeline Tracker)
- **Purpose**: Track active application cycles.
- **Responsibilities**: Displays drag-and-drop kanban boards covering pipeline stages (Saved, Applied, Interviewing, Offer, Rejected).
- **Dependencies**: Jobs Module.
- **Pages**: `/applications`.
- **Components**: `KanbanBoard`, `KanbanColumn`, `ApplicationCard`, `StatusUpdater`, `ActivityLog`.

### 3.10 AI Services Module
- **Purpose**: AI features integration wrapper.
- **Responsibilities**: Connects profiles and resumes to generate tailored bullet points, ATS match diagnostics, and cover letters.
- **Dependencies**: Profile, Resume, Jobs modules.
- **Pages**: `/cover-letters`.
- **Components**: `CoverLetterEditor`, `AtsDiagnosticsCard`, `OptimizationSuggestionsPanel`.

### 3.11 Settings Module
- **Purpose**: Manage account preferences.
- **Responsibilities**: Updates password configurations, notification scopes, email accounts, and dark/light themes.
- **Dependencies**: Authentication Module.
- **Pages**: `/settings`.
- **Components**: `AccountSettingsForm`, `NotificationPreferences`, `PasswordChangeCard`.

---

## 4. Complete Page Inventory

| Module | Page | Route | Public / Protected | Current Status | Priority |
| :--- | :--- | :--- | :--- | :--- | :--- |
| Landing | Landing | `/` | Public | Completed | High |
| Public | About Us | `/about` | Public | Completed | Medium |
| Public | Contact Support | `/contact` | Public | Completed | Medium |
| Public | Pricing | `/pricing` | Public | Completed | High |
| Public | FAQ | `/faq` | Public | Completed | Low |
| Public | Privacy Policy | `/privacy` | Public | Completed | Low |
| Public | Terms of Service | `/terms` | Public | Completed | Low |
| Auth | Sign In | `/login` | Guest Only | Completed | High |
| Auth | Sign Up | `/register` | Guest Only | Completed | High |
| Auth | Verify Email | `/verify-email` | Guest Only | Completed | High |
| Auth | Forgot Password | `/forgot-password` | Guest Only | Completed | High |
| Auth | Reset Password | `/reset-password` | Guest Only | Completed | High |
| Profile | Onboarding | `/complete-profile` | Protected | Completed | High |
| Dashboard | Workspace | `/dashboard` | Protected | Completed | High |
| Profile | Profile Manager | `/profile` | Protected | Completed | High |
| Resume | Resume List | `/resume` | Protected | Completed | High |
| Resume | Resume Builder | `/resume/new` | Protected | Completed | High |
| Resume | Resume Preview | `/resume/[id]` | Protected | Completed | High |
| Jobs | Job Discovery | `/jobs` | Protected | Completed | High |
| Jobs | Job Detail | `/jobs/[id]` | Protected | Completed | High |
| Saved Jobs | Bookmarks | `/saved-jobs` | Protected | Completed | Medium |
| Applications | Pipeline Board | `/applications` | Protected | Completed | High |
| AI | AI Cover Letters | `/cover-letters` | Protected | Completed | Medium |
| Settings | Account Settings | `/settings` | Protected | Completed | Low |

---

## 5. Route Inventory

### 5.1 Public Route Paths
- `/` - Marketing Hero landing page.
- `/about` - About the platform.
- `/pricing` - Pricing tables.
- `/contact` - Help form.
- `/faq` - FAQs.
- `/privacy` - Data policy.
- `/terms` - Terms.

### 5.2 Guest-Only Path Matchers
- `/login` - Authenticate via email/password.
- `/register` - Create a candidate account.
- `/forgot-password` - Request reset code.
- `/reset-password` - Submit new password with reset token query.
  - Query parameters: `?token=[reset_token_string]`
- `/verify-email` - Enter 6-digit confirmation code.

### 5.3 Protected Paths (Requires Active Cookie Session)
- `/dashboard` - Overview, metrics, and application shortcuts.
- `/complete-profile` - User onboarding form.
- `/profile` - Extended candidate resume and professional parameters.
- `/resume` - List of parsed resume files.
- `/resume/new` - Interactive builder wizard.
- `/resume/[id]` - PDF previews, parsing logs, and tailoring details.
- `/jobs` - List matching job cards and filter inputs.
- `/jobs/[id]` - Details page matching the specific job, displaying skill gaps.
- `/saved-jobs` - Bookmarked opportunities.
- `/applications` - Kanban board pipeline interface.
- `/cover-letters` - AI cover letter creator workspace.
- `/settings` - Password and notifications controls.

---

## 6. Navigation Structure

### 6.1 Guest Layout Navigation (Landing Page & Auth Pages)
- **Top Navigation Bar (`LandingNavbar`)**:
  - Left: Logo SVG.
  - Center: Features (`#features`), How It Works (`#how-it-works`), Pricing (`/pricing`), FAQ (`#faq`), GitHub repo link.
  - Right: Sign In button, Get Started button.
- **Footer Section (`LandingFooter`)**:
  - Links columns: Features, Pricing, About, GitHub, Contact, Privacy, Terms.

### 6.2 Workspace Layout Navigation (Protected Pages)
- **Responsive Sidebar (`SidebarNav`)**:
  - Top: Logo Icon.
  - Middle: Navigation items (Dashboard, Profile, Resume, Jobs, Saved Jobs, Applications, Cover Letters).
  - Bottom: Settings, Logout button.
- **Top Header (`Header`)**:
  - Left: Sidebar Collapse trigger, active page Breadcrumb (`Dashboard > Resume > New`).
  - Right: Global Search, Notification bell dropdown, User Avatar dropdown (Profile, Settings, Sign Out).
- **Mobile Navigation Bar (`MobileNav`)**:
  - Bottom persistent tab bar for screens < 768px: Dashboard, Jobs, Resumes, Settings.

---

## 7. Feature Inventory

### 7.1 Landing Page (`/`)
- **HeroSection**: Catchy headline, match stats, and "Get Started Now" CTA button.
- **Waitlist Form**: Email field, "Join Waitlist" submit button, success alert.
- **FAQ Accordion**: 4 interactive questions with expanding answer cards.

### 7.2 Onboarding Form (`/complete-profile`)
- **Inputs**: First Name, Last Name, Professional Headline, Preferred Role, Preferred Location.
- **Photo Upload Widget**: Avatar placeholder with file selector simulation.
- **Actions**: "Continue" (submit), "Skip for Now" (runs fallback defaults).

### 7.3 Jobs Discovery Workspace (`/jobs`)
- **Filters Sidebar**: Search input, Location input, Employment Type dropdown.
- **List Panel**: Vertical scroll of job cards showing Match Score percentage, Company name, Date posted, and tags.
- **Details Panel**: Displays title, JD body, Match Score match badge, Quality Score, and CTA "View" / "Save" actions.

### 7.4 Pipeline Tracker (`/applications`)
- **Kanban Board**: 5 columns (Saved, Applied, Interviewing, Offer, Rejected).
- **Cards**: Company, job title, matched score, and drag actions to update state.
- **Actions**: "Add Application" button to open quick job link input form.

---

## 8. Authentication Matrix

| Page Path | Guest (Anonymous) | Authenticated (Incomplete Profile) | Authenticated (Complete Profile) | Admin |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Allow | Allow | Allow | Allow |
| `/login` | Allow | Redirect `/complete-profile` | Redirect `/dashboard` | Redirect `/admin` |
| `/register` | Allow | Redirect `/complete-profile` | Redirect `/dashboard` | Redirect `/admin` |
| `/complete-profile` | Redirect `/login` | Allow | Allow (Profile editing) | Allow |
| `/dashboard` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |
| `/profile` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |
| `/resume` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |
| `/jobs` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |
| `/applications` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |
| `/settings` | Redirect `/login` | Redirect `/complete-profile` | Allow | Allow |

---

## 9. Module Dependencies

```
┌──────────────┐        ┌──────────────┐
│ Profile Form │ ──────►│  Resume Hub  │
└──────────────┘        └──────┬───────┘
                               │
                               ▼
┌──────────────┐        ┌──────────────┐
│   Jobs Hub   │ ◄──────│  AI Matcher  │
└──────┬───────┘        └──────────────┘
       │
       ▼
┌──────────────┐
│ Applications │
└──────────────┘
```

- **Resume Module** depends on **Profile Module** (uses candidate contact details to seed PDF generation).
- **AI Matching Module** depends on **Resume Module** and **Jobs Module** (cross-references candidate skills against job description requirements).
- **Applications Tracker Module** depends on **Jobs Module** (adds jobs to kanban board).

---

## 10. Database Mapping (Data Architecture)

```
┌─────────────────────────────────┐
│              User               │
├─────────────────────────────────┤
│ id (PK)                         │
│ email (string)                  │
│ passwordHash (string)           │
│ profileCompleted (boolean)      │
│ verified (boolean)              │
└────────────────┬────────────────┘
                 │ 1
                 │
                 │ 1
┌────────────────▼────────────────┐
│             Profile             │
├─────────────────────────────────┤
│ id (PK)                         │
│ userId (FK)                     │
│ firstName (string)              │
│ lastName (string)               │
│ headline (string)               │
│ preferredRole (string)          │
│ preferredLocation (string)      │
│ skills (string[])               │
└────────────────┬────────────────┘
                 │ 1
                 │
                 │ *
┌────────────────▼────────────────┐
│             Resume              │
├─────────────────────────────────┤
│ id (PK)                         │
│ userId (FK)                     │
│ title (string)                  │
│ fileUrl (string)                │
│ uploadedAt (datetime)           │
│ parsingStatus (enum)            │
└─────────────────────────────────┘
```

- **Relationships**:
  - `User (1) ── (1) Profile`
  - `User (1) ── (*) Resume`
  - `User (1) ── (*) Application`
  - `Job (1) ── (*) Application`

---

## 11. API Endpoint Specification (Target Conventions)

### 11.1 Auth Route Group
- `POST /api/v1/auth/register` - Create a new user.
- `POST /api/v1/auth/login` - Authenticate credentials and return session token.
- `POST /api/v1/auth/logout` - Invalidate active session.
- `POST /api/v1/auth/verify` - Confirm email verification code.

### 11.2 Users & Profile Route Group
- `GET /api/v1/profile` - Retrieve candidate profile details.
- `PUT /api/v1/profile` - Update candidate profile details.

### 11.3 Resumes Route Group
- `POST /api/v1/resumes/upload` - Upload PDF resume file.
- `GET /api/v1/resumes` - Retrieve list of user resumes.
- `GET /api/v1/resumes/:id` - Get specific resume parsing status and details.
- `DELETE /api/v1/resumes/:id` - Delete a resume.

### 11.4 Jobs Route Group
- `GET /api/v1/jobs` - Query matched job boards.
- `GET /api/v1/jobs/:id` - Retrieve full job description and skill gaps.

### 11.5 Applications Route Group
- `GET /api/v1/applications` - Get user kanban board cards.
- `POST /api/v1/applications` - Add a job to the pipeline board.
- `PATCH /api/v1/applications/:id` - Update application column stage.

---

## 12. AI Features Specification

### 12.1 Resume Parsing
- Extracts text from uploaded PDFs, maps content structures (Skills, Experience, Education), and populates Candidate Profile inputs automatically.

### 12.2 ATS Match Score
- Matches candidate resume skills against job requirements. Returns an overall score (0-100%) and a breakdown of matching vs missing skills.

### 12.3 Resume Optimizer (Tailoring)
- Analyzes a target job description and suggests specific wording adjustments or bullet point updates to highlight relevant experience and improve ATS matching.

### 12.4 AI Cover Letter Generator
- Generates a customized cover letter based on the candidate's profile and the target job description.

---

## 13. User Roles & Permissions

- **Guest (Anonymous)**:
  - Browse landing and marketing pages.
  - Access registration and login forms.
- **Candidate (Completed Profile)**:
  - Full access to Dashboard, Profile, Resumes, Jobs, Applications, and AI Cover Letter generators.
  - Perform profile edits, resume creation, and job tracking.
- **Admin**:
  - Access back-office moderation boards.
  - Manage user accounts, view application diagnostics, and update static job listings.

---

## 14. MVP Scope Definition

Before launching Version 1, the product must include:
1.  **Authentication**: Email verification, secure sign-in, and Edge-enforced routing middleware.
2.  **Profile Onboarding**: Completed onboarding workflow for new users.
3.  **Resume Manager**: PDF file uploads and structured parsing visualizations.
4.  **Job Feed**: Interactive list of verified active jobs with matching badges.
5.  **Applications Board**: Drag-and-drop Kanban tracker with 5 core columns.

---

## 15. Post MVP Roadmap

Features planned for future releases:
- **Auto-Apply Agent**: Automate forms submissions for 90%+ match roles using browser automation.
- **Referral Finder**: Integrate LinkedIn APIs to highlight alumni or connections at hiring companies.
- **Interview Simulator**: Conversational AI chatbot for mock technical and behavioral interviews.
- **Salary Intelligence**: Analyze job postings to predict salary ranges for specific locations and experience levels.

---

## 16. Non-Functional Requirements

### 16.1 Performance
- **Server Response Time**: Under 50ms for Edge middleware routing evaluations.
- **Page Load Time**: FCP (First Contentful Paint) under 1 second.
- **Hydration**: Zero hydration mismatches by ensuring client-state mounts run inside `useEffect`.

### 16.2 Accessibility (a11y)
- **WCAG 2.1 AA**: Enforce minimum contrast ratios (4.5:1), ARIA labels on forms, keyboard navigability across dialogs, and screen-reader support.

### 16.3 Security
- **Data Protection**: Store passwords using bcrypt hashing. Encrypt cookies using secure HTTP-only parameters.
- **Input Validation**: Sanitize all text fields using Zod to block SQL injections and cross-site scripting (XSS).

---

## 17. Technical & Engineering Standards

### 17.1 Coding Conventions
- **Language**: TypeScript (strict mode enabled).
- **Components**: Functional React components with descriptive TSX typing.
- **CSS**: Tailwind CSS or Vanilla CSS for layout blocks.

### 17.2 Branch & Git Workflows
- **Main Branch**: Production-ready. Direct commits are prohibited.
- **Feature Branches**: Named `feature/[sprint_number]-[brief_description]` (e.g. `feature/sprint1-profile-editor`).
- **PR Rules**: Must pass type-checking and build tests before merge.

---

## 18. Product Development Roadmap

- **Phase 1 (Foundations)**: Setup repository and project structure. Refactor and stabilize routing, guards, and mock authentication services. (Completed).
- **Phase 2 (Profile & Onboarding)**: Implement Candidate Profile Manager, resume parsers, and onboarding forms. (Up Next - Sprint 1).
- **Phase 3 (Resume Hub & Builder)**: Develop interactive resume editors and PDF exporters.
- **Phase 4 (Job Matching & Feeds)**: Integrate search filters and job detail cards.
- **Phase 5 (Pipeline Board)**: Develop the drag-and-drop Kanban application tracker.
- **Phase 6 (AI Tailoring Hub)**: Integrate ATS optimization suggestions and cover letter generators.
- **Phase 7 (Beta Launch)**: Deploy to staging environment for user testing and feedback.
- **Phase 8 (Production Launch)**: Scale infrastructure and launch the MVP product.

---

## 19. Open Questions & Future Decisions
- **Database Choice**: Deciding between PostgreSQL (structured relations for profiles) and MongoDB (flexible structures for resumes and parsing outputs).
- **AI API Integrations**: Selecting between OpenAI API, Anthropic Claude, or local Llama models for ATS parsing and resume tailoring.
- **Job Aggregation**: Determining the optimal strategy for indexing active job descriptions and filtering out expired roles.

---

## 20. Appendix

### 20.1 Glossary
- **ATS**: Applicant Tracking System. Software used by employers to parse and filter job applications.
- **Brutalist UI**: Design style characterized by bold borders, solid shadows, vibrant colors, and high contrast.
- **JWT**: JSON Web Token. Standard format for securely transmitting information between parties.
- **Onboarding**: The initial setup process new users must complete to personalize their experience.

### 20.2 Related Documents
- [Application Blueprint](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/architecture/application-blueprint.md)
- [Routing Architecture](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/architecture/routing-architecture.md)
- [Folder Structure Specification](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/architecture/folder-structure.md)
