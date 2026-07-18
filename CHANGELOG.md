# Changelog

All notable changes to the AI Career Agent platform will be documented in this file.

## [0.19.0] - 2026-07-18
### Added
- **CI/CD Pipeline**: Configured a complete production-grade GitHub Actions workflow (`.github/workflows/ci.yml`) triggering on pushes/PRs to `main` and `dev`. Operates cache optimizations, workspace installs, formatting checks filtered on changed files, lint, type-check compiler runs, and production build checks.

## [0.18.0] - 2026-07-16
### Added
- **Onboarding Scope Restriction**: Moved onboarding components and store triggers out of global providers (`app-providers.tsx`) into authenticated dashboard layouts (`src/app/(dashboard)/layout.tsx`), preventing leaks on public and error pages.
- **Lighthouse Production SEO**: Built dynamic sitemap paths (`sitemap.ts`) and crawler instructions (`robots.ts`) in App Router, configured meta tags (OpenGraph, Twitter card properties), and fixed missing image `alt` metadata.
- **Bundle Size Optimization**: Integrated `next/dynamic` chunk splitting for heavy sub-pages (e.g. `ResumeBuilderLayout` inside edit route, `CalendarView` & `ApplicationDetailDialog` inside applications, and global `CommandPalette`), reducing critical initial-load JS sizes by up to 106 kB.

## [0.17.0] - 2026-07-16
### Added
- **Premium Branded Loading System**: Designed `BrandLoader` featuring a center pulsing logo, glowing backdrop, and 8 orbiting upright career icons using Framer Motion.
- **Unified Variations**: Created `LoadingScreen`, `LoadingOverlay`, `PageLoader`, and `InlineLoader` subcomponents to fit varied loading contexts.
- **Reduced Motion Support**: Integrated automatic checks for system motion preferences using Framer Motion's `useReducedMotion()`.
- **Global Integration**: Replaced Lucide `Loader2` and generic CSS border spinners in forms, profile sub-pages, error boundaries, auth guards, and dashboards.
- **Route-level Loaders**: Added App Router `loading.tsx` loaders for dashboard, jobs, resumes, cover-letters, applications, and settings routes.

## [0.16.0] - 2026-07-16
### Added
- **First-Time Onboarding & Tour**: Created welcome dialog flow (`WelcomeModal`) and step-by-step guided product tour (`TourOverlay`) targeting core modules (Dashboard, Jobs, Resumes, Cover Letters, Applications, Search).
- **Lightweight SVG Tour Engine**: Custom viewport calculations using SVG overlay masking paths to highlight items on all layouts.
- **Getting Started Progress Checklist**: Added progress card tracking profile completion, resumes, bookmarks, alerts, etc., dynamically. Celebrates completion with a custom confetti animation.
- **Contextual Product Tips**: Added inline product tip card elements displaying one-time help alerts upon saving or parsing entities.
- **Help Center Resources**: Inserted Help menu dropdown within the Header, including shortcuts dialog and support mock options.

## [0.15.0] - 2026-07-15
### Added
- **Production-Ready Error Pages**: Created unified, accessible, and theme-compliant error pages for 404 (`not-found.tsx`), route errors (`error.tsx`), and root fatal crashes (`global-error.tsx`).
- **Offline Event Handling**: Created the `OfflineState` component with check connection actions and sonner toast alerts.
- **Network Failure System**: Created the `NetworkError` component for failed API queries with retry state handlers.
- **Unified Empty States**: Created predefined Empty State components wrapping the Brutalist `EmptyState` for Jobs, Saved Jobs, Applications, Resumes, Cover Letters, Notifications, and Search Results.
- **Animated Error Banner**: Created `ErrorBanner` inline component supporting info, warning, error, and success variants with framer-motion dismiss transitions.

## [0.14.0] - 2026-07-14
### Added
- **Global Feedback System**: Standardized success and error messaging using `sonner`, ensuring consistent global state management for non-blocking feedback.
- **Command Palette**: Integrated global search and command navigation (`Cmd+K` / `Ctrl+K`) across all dashboard modules and sub-views.
- **Destructive Action Safety**: Integrated `ConfirmDialog` via Radix UI and Framer Motion across all modules (Profile, Resumes, Cover Letters, Settings) replacing all legacy `window.confirm()` calls with a programmatic, accessible, and theme-compliant `useConfirm` hook.
- **Form Accessibility**: Unified inline validation attributes (`role="alert"`, `aria-invalid`) across base input, textarea, and select components.

## [0.13.0] - 2026-07-13
### Added
- **Performance Optimization**: Achieved a highly optimized production-ready frontend using Next.js `dynamic` imports for heavy components below the fold, resulting in dramatically improved LCP and TTI.
- **Granular React Rendering**: Migrated Zustand hooks across all Dashboard pages to use `useShallow` for strict slice subscriptions, eliminating re-renders on the global store level. Added `React.memo` wrappers to mapped lists for smooth scaleability up to thousands of items without dropping frames.
- **Client-Side Filtering Scaling**: Wrapped expensive client-side arrays (`notifications.filter`, `jobAlerts.filter`, etc.) into `useMemo` hooks, saving massive main-thread blocking times.
- **Image Payload Optimization**: Replaced legacy static `<img>` rendering across profile and feed views with `next/image` pipelines.

## [0.12.0] - 2026-07-12
### Added
- **Premium Animation System:** Introduced Framer Motion for buttery-smooth page transitions, list layout reordering, and entrance/exit animations.
- **Micro-interactions:** Enhanced base buttons with a tactile press scale, updated Radix UI primitives (Dropdowns, Dialogs, Tooltips) with GPU-accelerated enter animations.
- **Accessibility:** Global animations respect system `prefers-reduced-motion` settings.

## [2.4.2] - 2026-07-12
 
### Added
- **Dark Mode Support**: Implemented a comprehensive, premium Dark Mode matching the styling of GitHub and Linear while preserving the core Brutalist design system.
- **Theme Hydration Provider**: Added `theme-provider.tsx` linking `useSettingsStore` to toggle the `.dark` class seamlessly on the HTML element.
 
### Changed
- **Component Color Overrides**: Replaced 30+ instances of hardcoded light-mode background classes (`bg-slate-50`, `bg-blue-100`) with responsive `dark:` variants across Dashboard, Resumes, Applications, and Cover Letter modules.
- **Premium Shadow Contrast**: Refined brutalist shadow and border utilities to maintain strict visual hierarchy without muddying deep background colors (`#0d1117`).
 
## [2.4.1] - 2026-07-10
### Fixed
- **Loading Flow Overhaul**: Removed the generic App Router `loading.tsx` from the `(dashboard)` group directory. Handled all loading states within the page components, ensuring single-UI loading transitions using page-specific high-fidelity skeletons and avoiding double loading screens on route transitions.

## [2.4.0] - 2026-07-10

### Added
- **Reusable Skeleton System**: Introduced `skeleton-loaders.tsx` providing structural loading skeletons (`DashboardSkeleton`, `JobsSkeleton`, `CompaniesSkeleton`, `ApplicationsSkeleton`, `ResumeSkeleton`, `SettingsSkeleton`, and `NotificationsSkeleton`).
- **Standardized Empty States**: Created `empty-state.tsx` supporting customizable icons, descriptions, and primary/secondary CTA actions. Integrated it across Jobs, Saved Jobs, Applications, Companies, Resumes, Settings (Connected Accounts), and Notifications views.
- **Mobile Spacing & Padding Audit**: Tuned responsive layout wrappers, padding spacing, and touch targets to handle small viewports down to 320px elegantly.

## [2.3.0] - 2026-07-10

### Added
- **Settings & Preferences Service**: Created `settings.service.ts` managing user settings loading, saving to localStorage, factory resets, and JSON-based export/import configuration utilities.
- **Settings Zustand Store**: Created `settings.store.ts` store managing active tabs, staging unsaved changes drafts, tracking modification comparisons, and computing real-time Profile Completion scores.
- **Centralized Settings Dashboard**: Overhauled `/settings` layout into a responsive dashboard. Added a desktop sidebar menu, mobile scrollable tab bars, quick action resets, active session tables, CCPA/GDPR compliance data download utilities, and a sticky save-changes bar.

## [2.2.0] - 2026-07-09

### Added
- **AI Cover Letter Generator Service**: Created `cover-letter.service.ts` generating contextual statements mapped to Professional, Startup, Enterprise, Modern, and Minimal layouts using resume details and target tone selectors.
- **Cover Letter Zustand Store**: Created `cover-letter.store.ts` store managing draft states, version snapshots history, active layout selections, and text editor Undo/Redo stack arrays.
- **Cover Letter Studio Workspace & Dashboard**: Built a responsive, multi-view Dashboard (listing drafts, favorite presets, and quick-starts) and a dense side-by-side Generator Wizard Workspace (bundling layout forms, rich text inputs, undo/redo buttons, and formal printable preview letters).

## [2.1.0] - 2026-07-09

### Added
- **AI Resume Optimizer Service**: Created `resume-optimizer.service.ts` evaluating completeness, keyword match ratios, suggested gaps, and experience bullet upgrades.
- **Resume Optimizer Zustand Store**: Created `resume-optimizer.store.ts` store coordinating target JD parameters, active studio tabs, history logs, variant versions, and export download mock states.
- **Embedded Optimize Panel & Studio Workspace**: Built collapsible `ResumeOptimizePanel` sidebar and full-featured `OptimizationStudio` center-screen dashboard (with side-by-side Diffs, Bullet Enhancers, Readability Diagnostics, and Audit logs).

## [2.0.0] - 2026-07-09

### Added
- **Application Tracker Core Types**: Structured `JobApplication` and `TimelineEvent` schemas in `application.types.ts`.
- **Application Services Layer**: Created CRUD provider `application.service.ts`, chronological history event formatter `timeline.service.ts`, conversion rate calculator `analytics.service.ts`, and stage alert notifier `notification.service.ts`.
- **Application Zustand Store**: Integrated `application.store.ts` store with localStorage persistence cache supporting optimistic status moves, schedule dates coordinate edits, and contact logs updates.
- **Unified Application Board Page**: Created multi-tab view page displaying Pipeline Boards, Stats & Charts dashboards, Table Lists, and Calendars.
- **Drag-and-Drop Kanban Board**: Designed board columns (Saved, Applied, Screening, Assessment, Interview, Offer, Accepted, Rejected) with drag overlays and accessibility arrows.
- **Funnel & Distribution Analytics**: Designed responsive CSS/SVG monthly bar/area line graphs, conversion ratios progress bars, and upcoming interview card lists.
- **Monthly Scheduler Calendar**: Designed month-view calendar with navigation triggers plotting interview slots.
- **Contact & notes Drawer Inspector**: Designed details drawer sidebar to configure recruiter contacts details, schedules, notes, and timeline logs.

## [1.9.0] - 2026-07-07

### Added
- **AI Match Engine Service**: Created `match-engine.service.ts` evaluating skills overlap, experience decay, educational alignment, location preferences, salary budget fit, and job quality indexes.
- **Match Zustand Store**: Created `match.store.ts` caching computed matching metrics with simulated loading latency states and error handling.
- **Personalized Match Badges**: Displays real-time match percentages and labels (Excellent Match, Great Match, Good Match, Fair Match, Low Match) on every `JobCard`.
- **Match Breakdown widget**: Added Match Breakdown details block to `JobDetailsPane` displaying progress bars for skills, experience, education, locations, salaries, and overall ratings.
- **Why This Job & Skills Gap**: Integrated fit explanation lists and side-by-side skills analysis (Matched, Missing, Additional Skills).
- **Upskilling Roadmap Builder**: Generates learning recommendations dynamically from missing skills.
- **AI Match Filters**: Integrated search filters supporting 1-click match score thresholds (90%+, 80%+, 70%+, High Match, Missing <= 2 Skills, High Match + Quality).
- **Recommended For You Sorting**: Sorting option sorting listings by highest match score, then highest quality.

## [1.8.0] - 2026-07-07

### Added
- **Job Quality Engine Core**: Created `quality-engine.service.ts` evaluating duplicate scores, freshness scores, trust scores, and unified overall quality ratings.
- **Deduplication Audit**: Duplicate detector evaluating overlap across titles, companies, locations, employment types, salaries, and external posting IDs.
- **Freshness & Trust Computations**: Freshness category decay mapping and 8-factor trust signal verification checklists.
- **Quality Zustand Store**: Created `quality.store.ts` caching computed quality ratings and supporting mock loading states, error states, and force recalculation runs.
- **Interactive UI Details Card**: Quality Assessment sidebar block inside `JobDetailsPane` displaying rating bars, status badges, details tooltips, trust checklists, and recalculate triggers.
- **Uncluttered Listing Quality Badges**: Embedded colored quality labels (Verified, Fresh, Trusted, Good) into the main listing Job Cards and Saved Job Cards.

## [1.7.0] - 2026-07-07

### Added
- **Decoupled Alerts & Notifications Architecture**: Separated Job Alerts (rule configuration engine) from the Notification Center feed.
- **Job Alerts Upgrades**: Added "Duplicate Alert" handler, active/paused status badges, and last/next scheduled scan time metadata to rules cards.
- **Unified Notification Center**: Pre-seeded inbox notifications spanning Job Alerts, Application Updates, Resume Parsing, Resume Tailoring, AI Matches, and Cover Letter generations.
- **Notification Inbox Filtering**: Added filtering by read/unread statuses and Category tabs, plus view contextual buttons routing to matched detail locations.
- **Alert Scanner Simulation**: Connected the `createAlert` Zustand flow to trigger a mock matching engine cycle that posts new matches to the notifications feed after 3 seconds.

## [1.6.0] - 2026-07-07

### Added
- **Saved Jobs Dashboard**: Complete saved jobs tracker showing matching rating score, salary limit, locations, relative save date, and custom sorting options (Recently Saved, Company, Job Title, Date Posted) with optimistic unsaving logic.
- **Job Alerts Scanning**: LocalStorage CRUD scheduler supporting daily/weekly/instant alerts matching keywords, remote, salary thresholds, and experience criteria, with toggle switches.
- **Advanced Search & Filtering**: Instant collapsible filter criteria including skills tag additions, match score slider, easy apply toggles, and date posted age.
- **Search Query History**: Memory of recent searches, saved filters naming, and popular terms pills.
- **Responsive Drawer & FAB**: Sticky desktop filter sidebar collapsing to a slide-over panel on mobile/tablet screens triggered by a floating action button.
- **Scroll Restoration**: Persist search filters and vertical scroll coordinates in sessionStorage to restore states on backward navigation.

## [1.5.0] - 2026-06-30

### Added
- **Edit Profile Page**: Route `/profile/edit` hosting independent personal, contact, career, and preferences inline edit cards with save/cancel controls.
- **Complete Profile Onboarding Wizard**: Route `/complete-profile` featuring an 8-step wizard navigation, mandatory vs optional step filters, progress indicators, and draft-saving capabilities.
- **Avatar Management**: Crop support ready component supporting image type/size validation and remove actions.
- **Searchable Languages Options**: 15+ standard language selects and native toggle controls.
- **Preferred Currency Select**: Added expected salary currency selection and rendering configurations.
- **Dirty Forms confirmation checks**: Browser beforeunload and navigation confirmation alerts preventing loss of unsaved form edits.
- **Score Rating Category tags**: "Excellent", "Good", and "Needs Attention" categorization tags on Profile Review page.
- **Review jump-scroll shortcuts**: Anchor links allowing immediate navigation to specific candidate profile review rows.

## [1.4.0] - 2026-06-29

### Added
- **Certifications Module**: Full CRUD operations, credential verification redirect links, and card previews.
- **Languages Module**: Proficiencies tracking for speaking, writing, and reading.
- **Social Links Module**: Dynamic platform selectors, link validation, and copy-to-clipboard buttons.
- **Career Preferences Module**: Notice period, preferred shifts, company size, and visa sponsorship settings.
- **Profile Review Page**: Route `/profile/review` displaying full checklist parameters and missing properties audits.
- **Profile Completion Engine**: Dynamic calculator tracking completion levels across 10 sub-sections.
