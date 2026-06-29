# AI Career Agent — Master Development Plan (Engineering Playbook)

---

## 1. Introduction

### 1.1 Purpose
This document establishes the official engineering playbook and technical implementation plan for the **AI Career Agent (ACA)**. It outlines our architectural guidelines, version controls, environment settings, testing suites, code review definitions, and milestone schedules to guide active development from Sprint 0 through MVP release.

### 1.2 Document References
- [Product Blueprint](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/product/product-blueprint.md)
- [User Flow Document](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/product/user-flow.md)
- [Routing Architecture](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/architecture/routing-architecture.md)
- [Security Specification](file:///Users/anshul/Projects/Ai%20Agent/AI%20Career%20Agent/docs/architecture/security.md)

---

## 2. Engineering Principles

### 2.1 Code Quality & Architecture Standards
- **Feature-First Architecture**: Group code by feature boundaries rather than file types. Place forms, hooks, schemas, types, and services inside their corresponding `/features/auth/` or `/features/jobs/` directory.
- **Clean Architecture & SOLID**: Enforce strict separation of UI components, hooks (orchestration), services (API callers), and state stores.
- **KISS & DRY**: Minimize custom component libraries in favor of accessible primitives. Ensure that business logic is never duplicated between client guards and server middleware.
- **Type Safety**: Maintain zero use of `any` types. Enforce strict type checking in all modules.

---

## 3. Technology Stack

### 3.1 Stack Summary & Rationale

| Layer | Technology | Selection Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js App Router (TypeScript) | Optimized loading times, built-in routing, and Edge-computed middleware. |
| **State Management** | Zustand | Light footprint, pure stores, and reactive hooks. |
| **Styling** | Vanilla CSS / CSS Modules | Highly flexible layouts, keeping build sizes minimal. |
| **Backend API** | NestJS | Scalable modular structures, dependency injection, and reliable database layers. |
| **Database** | PostgreSQL | Robust relational data tracking for profiles, users, and resumes. |
| **ORM** | Prisma | Automated database migrations and reliable Type-safe queries. |
| **Mock Authentication** | Zustand + LocalStorage | Used for development verification cycles before API integration. |
| **Production Auth** | JWT Session / OAuth | Secure authentication tokens, session cookies, and login options. |

---

## 4. Git Workflow

```
   [ main ]
      ▲
      │ (Release Tags)
   [ develop ]
      ▲
      ├─── [ feature/sprint1-onboarding ]
      └─── [ bugfix/session-restore ]
```

### 4.1 Branching Strategy
- **`main`**: Production release targets only. Direct commits are forbidden.
- **`develop`**: Master integration branch. Feature PRs target develop.
- **`feature/*`**: Feature development branches (e.g. `feature/sprint2-resume-uploader`).
- **`bugfix/*`**: Bug fixes (e.g. `bugfix/redirect-hydrations`).

### 4.2 Commit Conventions
- Commit messages must follow the Conventional Commits format:
  - `feat(auth): add email verification component`
  - `fix(middleware): resolve infinite redirect loop on dashboard`
  - `docs(blueprint): update page inventory tables`

### 4.3 Pull Request Process
- Enforce at least one senior peer approval.
- PRs must compile successfully and pass all unit/type-check tests.

---

## 5. Environment Strategy

### 5.1 Environments Matrix
- **Development**: Local environment with active hot-reload services.
- **Testing**: Automated environment executing integration pipelines.
- **Staging**: Replicates production database settings and deployment environments.
- **Production**: Production site with active user traffic.

### 5.2 Key Config Variables
- `DATABASE_URL` - Prisma connection string.
- `JWT_SECRET` - Session signing keys.
- `NEXT_PUBLIC_API_URL` - Main server host address.

---

## 6. Sprint Planning (Phase 1 Execution)

### Sprint 0 — Foundation & Authentication Refactor
*   **Goal**: Setup clean monorepo folder architecture, refactor and purify Zustand store, useAuth hooks, and guard redirect pipelines. (Completed).
*   **Deliverables**: Purified Zustand auth stores, useAuth controllers, simplified route guards, and mock authentication services.
*   **Acceptance Criteria**: Single-session redirects, zero console errors, compile-ready builds.

### Sprint 1 — Onboarding & Profile Manager
*   **Goal**: Create complete onboarding forms and Profile configuration managers.
*   **Deliverables**: `/complete-profile` form wizard, `/profile` detail managers, and profile schema validations.
*   **Dependencies**: Sprint 0.
*   **Risks**: Input data serialization delays.

### Sprint 2 — Resume Uploader & Parser
*   **Goal**: Build PDF resume upload handlers and parse text properties.
*   **Deliverables**: File drag-and-drop widgets, PDF render panels, and mock parse status endpoints.
*   **Dependencies**: Sprint 1.

### Sprint 3 — Jobs Workspace & Matching score
*   **Goal**: Develop matching list feeds and detail pages showing match score analysis.
*   **Deliverables**: Job search filters, matched score dials, and skill gap tables.
*   **Dependencies**: Sprint 2.

### Sprint 4 — Kanban Tracking Board
*   **Goal**: Create drag-and-drop Kanban board tracker.
*   **Deliverables**: Kanban columns, job cards, application status update forms, and notes fields.
*   **Dependencies**: Sprint 3.

### Sprint 5 — AI Cover Letters & Optimizers
*   **Goal**: Build AI cover letter generators and resume tailoring suggestions.
*   **Deliverables**: Cover letter templates, LLM prompt connectors, and tailoring recommendations.
*   **Dependencies**: Sprint 4.

---

## 7. Module Implementation Order

1.  **Landing & Authentication**: Setup the gateway, secure routes, and establish active user sessions.
2.  **Profile & Onboarding**: Capture candidate details (skills, locations, histories) to seed all downstream AI integrations.
3.  **Resume Manager**: Enable resume uploads to supply the core data parsed for matching.
4.  **Job Hub & Matching**: Leverage parsed resumes and profile configurations to deliver relevance-scored listings.
5.  **Applications Kanban**: Capture matched jobs and organize them on the pipeline board.
6.  **AI Services**: Refine applications with ATS optimization suggestions and cover letter generators.

---

## 8. Backend Roadmap (NestJS Targets)

- **Auth Module**: Handles registration schemas, password bcrypt hashing, token generation, and verification code timers.
- **Profile Module**: Handles candidate detail schemas, work experience tables, and skills lists.
- **Resume Module**: Coordinates PDF storage on Amazon S3 and coordinates resume parsing workers.
- **AI Matcher Module**: Integrates with LLM providers (e.g. OpenAI/Claude) to match resumes against job descriptions, calculate scores, and identify skill gaps.

---

## 9. Frontend Roadmap (Next.js App Router)

- **Layout Templates**:
  - `(auth)`: Isolated clean background with central Brutalist card containers.
  - `(dashboard)`: Sidebar layouts, header components, and responsive tab configurations.
- **Common Components**:
  - Brutal Inputs, Buttons, badged cards, alerts, and custom loaders.

---

## 10. API Route Registry

- **`/api/v1/auth/login`**: Authenticates user and returns active cookies.
- **`/api/v1/profile`**: Coordinates candidate detail payloads.
- **`/api/v1/resumes/upload`**: Uploads PDF files and triggers parsing workers.
- **`/api/v1/jobs`**: Queries matched job boards based on target profiles.
- **`/api/v1/applications`**: Retrieves and updates application stages on the Kanban tracker.

---

## 11. Database Migration Plan

1.  **Migration 001_initial**: Setup `User`, `Session`, and `Profile` tables.
2.  **Migration 002_resumes**: Create `Resume` and `ParsedContent` models.
3.  **Migration 003_jobs**: Setup static index registries and `SavedJobs` pivot tables.
4.  **Migration 004_applications**: Deploy `Application` tracking entries.

---

## 12. AI Integration Roadmap

- **Phase 1 (Parsing)**: Regex and structured JSON parsers to map contact details, experiences, and skills.
- **Phase 2 (Scoring)**: Vector-embedding matches between job requirements and resume descriptions.
- **Phase 3 (Optimization)**: LLM agents recommending specific bullet changes and ATS keyword additions.

---

## 13. Testing Strategy

- **Unit Tests**: Enforce Jest testing for useAuth, stores, validations, and helper utilities.
- **Integration Tests**: Verify authentication redirects, onboarding workflows, and page transitions using Playwright/Cypress.
- **Accessibility Tests**: Weekly audits verifying keyboard focus rings and ARIA roles using axe-core.

---

## 14. Code Review Checklist

- **Strict Architecture**: Ensure components contain zero business logic. Forms must submit inputs directly to hooks.
- **TypeScript Compliance**: Verify zero use of `any` types and correct TS interfaces.
- **Accessibility Checks**: Verify inputs contain descriptive labels and interactive elements support keyboard controls.
- **Clean Code**: Remove unused imports, console logs, and duplicate styling utilities.

---

## 15. Definition of Ready (DoR)

Before starting work, a ticket must meet:
1.  **Requirements**: Clearly defined product requirements.
2.  **Designs**: Completed UI specifications.
3.  **APIs**: Pre-defined endpoint contract models.
4.  **Dependencies**: Clear path to resolve blocking tasks.

---

## 16. Definition of Done (DoD)

A task is complete only when:
1.  **Build**: Passes compiling and type-checking checks.
2.  **Tests**: Unit and integration test suites run successfully.
3.  **Responsive**: UI looks correct across all screen sizes.
4.  **Review**: Passes code review.
5.  **Docs**: Project documentation is updated.

---

## 17. Release Process

### 17.1 Milestone Pipeline
- **Alpha Build**: Deploy mock components to staging to verify layout flows.
- **Beta Build**: Integrate real databases and mock APIs to run user tests.
- **MVP Production Release**: Deploy full integration paths to active instances.
- **Rollback Plan**: Auto-revert target instances if server health checks report issues post-deployment.

---

## 18. Risk Register

- **LLM Rate Limits**: High API load times or rate limits during parser calls.
  - *Mitigation*: Cache resume parse results locally and queue processing calls.
- **Infinite Redirect Loops**: Inconsistent auth states causing endless redirects between guards.
  - *Mitigation*: centralize redirect actions inside the `useAuth` hook and keep stores hydrated.

---

## 19. Performance Goals

- **Core Web Vitals**:
  - TTFB (Time to First Byte): < 150ms.
  - CLS (Cumulative Layout Shift): < 0.05.
  - LCP (Largest Contentful Paint): < 1.2s.
- **Optimizations**: Lazy-load detail panels and compress image/logo assets.

---

## 20. Security Checklist

- **Encryption**: Enforce secure, HTTP-only session cookies.
- **Rate Limiting**: Enforce limit of 10 login attempts per IP block.
- **Validation**: Enforce Zod validators on all user inputs.

---

## 21. Monitoring & Logging

- **Observability**: Track front-end client issues (e.g. Sentry) and backend server performance (e.g. Prometheus).
- **Audit Trails**: Log database changes and user login attempts.

---

## 22. Documentation Policy

- **Updates**: Update routing records and plans when layout paths change.
- **PRs**: Documentation updates must accompany code changes.

---

## 23. Milestones Timeline

- **Milestone 1 (Foundations)**: Setup Monorepo, Purified Store, Guards, and Routing. (Completed).
- **Milestone 2 (Onboarding)**: Deliver Profile Managers and onboarding setups.
- **Milestone 3 (Resumes & Matcher)**: Deploy parser wrappers and job details feeds.
- **Milestone 4 (MVP Launch)**: Deliver drag-and-drop Kanban boards and production deployments.

---

## 24. Future Enhancements

- **Auto-Apply Engines**: Automate applications on target portals using browser automation.
- **Interview Simulators**: Setup conversational AI mock interviews.

---

## 25. Appendix

### 25.1 Glossary
- **Clean Architecture**: Structural guideline that isolates core business logic from UI frameworks and delivery mechanisms.
- **DoD**: Definition of Done. Acceptance criteria defining feature completion.
- **DoR**: Definition of Ready. Acceptance criteria defining task readiness.
- **SaaS**: Software as a Service.
