# AI Career Agent

A production-grade, open-source friendly Career Operating System that empowers job seekers to discover high-quality verified opportunities, adapt their profiles, and manage their applications using intelligent AI pipelines.

---

## Badges

[![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?style=flat-square&logo=nextdotjs)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-5.0-orange?style=flat-square)](https://zustand-demo.pmnd.rs/)
[![OpenAI](https://img.shields.io/badge/AI-OpenAI%20API-412991?style=flat-square&logo=openai)](https://openai.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?style=flat-square&logo=postgresql)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io/)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen?style=flat-square)](#verification)
[![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)](LICENSE)

---

## 1. Project Introduction

Finding a job in the modern tech ecosystem is an asymmetric struggle. Job seekers face ghost listings, automated applicant tracking system (ATS) filters, and the cognitive overhead of manually adapting resumes for every application. 

**AI Career Agent** was built to level the playing field. It is a full-featured Career Operating System designed specifically for software engineers, product designers, and tech professionals. 

### Why This Project Exists
We believe career management should be unified and proactive. Instead of jumping between disconnected job boards, resume editors, cover letter generators, and spreadsheet trackers, AI Career Agent brings the entire lifecycle into a single high-leverage workspace. By utilizing localized vector matching and automated LLM evaluation, it filters out low-trust listings and helps candidates submit optimized applications.

---

## 2. Features

- **Authentication**: Secure registration, login, and profile recovery powered by session-guarded auth flows.
- **Candidate Profile**: A unified dashboard containing contact credentials, work experience logs, education milestones, certified credentials, and language profiles.
- **Resume Management**: A comprehensive resume builder supporting real-time preview, version control, undo/redo states, and dynamic design theme templates.
- **Resume Parsing**: Seamless extraction of structured work history, skills, and contact schemas from uploaded PDF resumes.
- **AI Job Matching**: Localized scoring system that evaluates candidates' suitability for verified, fresh job listings based on skill vectors.
- **Cover Letter Generator**: Dynamic cover letter engine that writes tailored, tone-adjusted pitches matching the target job description.
- **Resume Optimization**: Advanced ATS optimization studio providing keyword gaps analysis and bullet-point rewrite suggestions.
- **Applications Tracker**: A visual Kanban board and calendar to manage application status (Saved, Applied, Interviewing, Offered, Rejected) and schedule interviews.
- **Settings & Preferences**: Interactive settings panel to toggle theme styling, manage onboarding states, and reset helper tips.
- **Global Search**: An accessible, keyboard-friendly command palette (`⌘+K` / `Ctrl+K`) that searches job histories and caches recent searches.
- **Notifications**: Central notification system tracking application status updates and interview alerts.
- **Dashboard**: A comprehensive home feed featuring a getting-started setup checklist, metric charts, and application analytics.
- **AI Features**: Interactive evaluation loops, automated skills matching, and LLM-assisted copy writing.
- **Responsive Design**: Fluid brutalist layout adjustments optimized for mobile, tablet, and widescreen displays.

---

## 3. Screenshots

The following placeholders represent the current user interface views. Click to expand:

### Landing Page
![Landing Page UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=AI+Career+Agent+-+Landing+Page)

### Dashboard
![Dashboard Workspace UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Candidate+Dashboard+Checklist)

### Jobs Feed
![Jobs Feed UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Verified+Jobs+Matching+Feed)

### Resume Builder
![Resume Builder UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Brutalist+Resume+Workspace+Editor)

### Resume Parser
![Resume Parser UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Intelligent+PDF+Resume+Parser)

### Cover Letters Studio
![Cover Letters UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Tailored+Cover+Letter+Workspace)

### Applications Tracker
![Applications Tracker UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Application+Kanban+and+Calendar)

### Settings
![Settings Interface UI Placeholder](https://placehold.co/1200x630/fdf8f6/000000?text=Settings+and+Appearance+Controls)

---

## 4. Tech Stack

- **Frontend**: Next.js 15 (App Router, Server Components) + React 19 + TypeScript
- **Backend**: NestJS (Modular API architecture, Dependency Injection)
- **Database**: PostgreSQL (Prisma ORM integration)
- **AI Engine**: OpenAI API (GPT models for parser extraction and adaptation writing)
- **State Management**: Zustand (Persisted stores, undo/redo history middleware)
- **Authentication**: Guarded Session middleware (AuthGuard hooks)
- **Styling**: Vanilla CSS (Brutalist Design System tokens, dynamic theme root variables)
- **Animation**: Framer Motion (Orbits, staggered lists, slide sheets)
- **Deployment**: Docker + Docker Compose + Vercel
- **Developer Tools**: ESLint + TypeScript + Prettier + Madge + Depcheck

---

## 5. Architecture

```mermaid
graph TD
  User[Browser Client]
  
  subgraph Apps [Monorepo Apps]
    Web[apps/web: Next.js App]
    API[apps/api: NestJS API]
  end

  subgraph Packages [Shared Workspaces]
    Types[packages/types: Shared Interfaces]
    Shared[packages/shared: Shared Helpers]
    Config[packages/config: Shared ESLint/TS configs]
  end

  subgraph Infra [Infrastructure Services]
    Postgres[(PostgreSQL DB)]
    OpenAI[OpenAI LLM Engine]
  end

  User -->|HTTPS / WSS| Web
  Web -->|JSON API| API
  API -->|Prisma Query| Postgres
  API -->|REST| OpenAI
  Web -.->|Type Ref| Types
  API -.->|Type Ref| Types
  Web -.->|Helper Ref| Shared
  API -.->|Helper Ref| Shared
```

### Why This Architecture Was Chosen
This project leverages an npm-workspaces monorepo structure. This architecture provides several key advantages:
1. **Shared Type Schema**: Contract interfaces in `packages/types` compile directly for both frontend forms and backend validation controllers, preventing schema misalignment.
2. **Unified Configuration**: ESLint rules, TypeScript compile configs, and formatting directives are shared, ensuring style consistency across the entire codebase.
3. **Workspace Isolation**: Dependencies for the web client and API backend are decoupled in separate folders to prevent dependency bloating.

---

## 6. Folder Structure

```
ai-career-agent/
├── apps/
│   ├── web/                     # Next.js 15 Web Application
│   │   ├── public/              # Static public assets, PWA manifests
│   │   ├── src/                 # Next.js Source directory
│   │   │   ├── app/             # Next.js App Router (Layouts and Pages)
│   │   │   ├── components/      # Global shared UI elements (Buttons, Cards)
│   │   │   ├── config/          # Site config constants
│   │   │   ├── features/        # Feature modules (Auth, Jobs, Resume, Onboarding)
│   │   │   ├── hooks/           # Reusable React hooks
│   │   │   ├── lib/             # Custom utility functions (cn)
│   │   │   ├── providers/       # Providers context wrappers (Theme, Auth)
│   │   │   ├── services/        # Fetch API adapters
│   │   │   ├── store/           # Global Zustand store definitions
│   │   │   └── types/           # App-specific type interfaces
│   │   └── package.json
│   └── api/                     # NestJS API Backend (Modular architecture)
├── packages/
│   ├── shared/                  # Common JavaScript/TypeScript helpers
│   ├── types/                   # Unified model interfaces and schemas
│   └── config/                  # Shared tooling configurations (ESLint, TS)
├── docs/                        # Complete technical and design specs
├── infra/                       # Infrastructure orchestration configs (Docker)
├── package.json                 # Monorepo workspaces definition
└── package-lock.json
```

---

## 7. Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/anshul4117/ai-career-agent.git
cd ai-career-agent
```

### 2. Install dependencies
Install workspaces dependencies from the root directory:
```bash
npm install
```

### 3. Environment Setup
Create a `.env.local` file inside the web application directory:
```bash
cp apps/web/.env.local.example apps/web/.env.local
```
Add your respective API URLs, authentication keys, and service secrets inside `apps/web/.env.local`.

### 4. Database Orchestration
Spin up the local PostgreSQL database using Docker Compose:
```bash
docker compose -f infra/docker/docker-compose.yml up -d
```
Generate the Prisma schema mapping:
```bash
npx prisma generate
```

### 5. Running the Application
To run the Next.js web application locally:
```bash
npm run dev
```
To check TypeScript compiler and linting:
```bash
npm run type-check
npm run lint
```
To run a production-ready optimization build:
```bash
npm run build
```

---

## 8. Environment Variables

The web client expects the following local environment keys:

| Variable Key | Expected Content | Required / Optional | Target Purpose |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | `http://localhost:4000/api` | Required | Target backend API location. |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | Required | Host origin location (fallback redirects). |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` | Optional | Client token authentication key. |
| `CLERK_SECRET_KEY` | `sk_test_...` | Optional | Secure authentication middleware verification. |

---

## 9. Available Scripts

The following workspaces scripts can be executed from the root monorepo directory:

- **`npm run dev`**: Starts the Next.js web application dev server locally.
- **`npm run build`**: Compiles an optimized, static, and code-split production build.
- **`npm run lint`**: Inspects all workspaces for stylistic and quality violations.
- **`npm run type-check`**: Invokes the TypeScript compiler (`tsc`) to verify type safety.

---

## 10. Project Documentation

Refer to the primary technical guidelines and specifications in the `/docs` directory:

- **Product & Scope**:
  - [Product Requirements Document (PRD)](docs/prd.md)
  - [Feature Release Roadmap](docs/roadmap.md)
- **Technical & Architecture**:
  - [Monorepo Architecture Blueprints](docs/architecture.md)
  - [Database Schema & Data Model Specification](docs/database.md)
  - [API Endpoint Contracts Specification](docs/api-spec.md)
- **Style & Branding**:
  - [Brutalist Design Tokens System](docs/design-system.md)
  - [Branding Assets & Logo Guidelines](docs/branding.md)
  - [Frontend Route & Pages Mapping](docs/frontend-pages.md)
- **Developer Guidelines**:
  - [Coding Standards & TypeScript Quality Rules](docs/coding-standards.md)
  - [Active Project Tasks Checklist](docs/tasks.md)
  - [Release Changelog History](CHANGELOG.md)

---

## 11. Production Features

- **Dark Mode Support**: Dynamic visual theme switcher utilizing CSS properties and dark mode media queries.
- **Error Boundaries**: Client-side boundaries (`app/error.tsx`) to catch component failures and fatal layout crashes (`app/global-error.tsx`).
- **Skeleton Loader Engine**: Reusable loaders (`ResumeBuilderSkeleton`, `CalendarSkeleton`) to prevent content jumps.
- **Interactive Checklist**: Dynamic setup checklist celebrating completion with Confetti.
- **Accessibility (a11y)**: Focus trapping, keyboard navigation, descriptive ARIA tags, and color contrast ratios exceeding WCAG AA.
- **Performance Optimization**: Dynamic client-side lazy loading (`next/dynamic`) and route splitting.
- **Security & Headers**: Next.js HTTP security headers (Clickjacking shields, MIME-sniffing protection).
- **SEO & PWA Ready**: Dynamic sitemap and robots XML mapping, viewport support, and standalone web manifests.

---

## 12. Performance & Optimizations

- **Dynamic Imports**: Defers loading of heavy UI elements (e.g. `CommandPalette`, `ResumeBuilderLayout`, `CalendarView`) until requested.
- **React.memo**: Memoized card items (e.g. `SavedJobCard`) to prevent unnecessary list re-renders.
- **Zustand Optimization**: Isolated state selectors to minimize hook trigger frequencies.
- **Code Splitting**: Route-level Next.js code splitting to minimize initial JS payload.

---

## 13. Security Features

- **Anti-Clickjacking**: Implemented `X-Frame-Options: DENY` via Next.js response headers.
- **Reverse Tabnabbing Shields**: Explicitly appended `rel="noopener noreferrer"` parameters to all external links.
- **Zero Raw HTML Injection**: Evaluated DOM parsing models to block XSS strings.
- **Input Validation**: Schema-level validation (Zod) on all client form fields.

---

## 14. Project Roadmap

- [x] **Phase 16**: Brutalist Error Boundaries, Offline notifier, and recovery paths.
- [x] **Phase 17**: Persisted first-time onboarding tours, setup checklists, and help panels.
- [x] **Phase 18**: Premium animated loaders orbiting upright icons.
- [x] **Phase 19**: Code-split dynamic bundles and size optimizations.
- [x] **Phase 20**: Security headers and dependency health audits.
- [/] **Phase 21**: API contract specifications and mock database schemas.
- [ ] **Phase 22**: Core Postgres relational schema migrations and NestJS route controllers.

---

## 15. Contributing

Contributions are welcome! Please follow these guidelines:
1. Form a clear feature branch: `git checkout -b feature/your-feature-name`.
2. Ensure your changes compile cleanly without type checks or linting errors: `npm run type-check && npm run lint`.
3. Submit a pull request detailing the changes made and link the relevant task issue.

---

## 16. License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 17. Author

- **Anshul**
- **GitHub**: [@anshul4117](https://github.com/anshul4117)
- **LinkedIn**: [Anshul's Profile](https://www.linkedin.com/in/anshul-ab7135245/)
- **Portfolio**: [Anshul's Portfolio](https://anshul4117-portfolio.vercel.app/)
