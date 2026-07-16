# Production-Ready Error Pages & Boundaries Architecture

This document outlines the architectural setup and components of the error boundary, offline, network failure, and empty states system on the AI Career Agent platform.

---

## 1. Next.js Routing Boundaries

The platform uses three key Next.js App Router files to capture and recover from runtime exceptions:

### `app/not-found.tsx` (404 Page)
- **Role**: Displays whenever a route is not found or a directory is requested that doesn't exist.
- **Design**: Styled with the signature Brutalist card outline (`border-[3px] border-black`), heavy shadow, custom `Map` illustration with `AlertTriangle` absolute overlays, and a large "404" heading.
- **Actions**:
  - Primary: Back to Dashboard (`/dashboard`)
  - Secondary: Browse Jobs (`/jobs`)
  - Tertiary: Go Home (`/`)
  - Popular destinations checklist: Resume Builder, Applications Tracker, Cover Letters Studio.

### `app/error.tsx` (Route-Level Error Boundary)
- **Role**: Automatically wraps all routing segments below the root folder, trapping layout/state rendering runtime crashes.
- **UI Components**:
  - Large warning illustration (`ShieldAlert`).
  - Retry button: Triggers loading spinner and calls Next's built-in `reset()` handler.
  - Collapsible raw error stack trace details panel using `<details>` and custom toggle logic.
  - Interactive reporting: Mock action that dispatches a Sonner toast notifying developers.

### `app/global-error.tsx` (Fatal Catch-All Boundary)
- **Role**: Captures crashes in the absolute root layout.
- **Structure**: Replaces layout entirely; hence it specifies its own `<html>` and `<body>` HTML wrapper tags.
- **Visuals**: Dark-themed brand styling using high contrast brutalist cards.
- **Actions**: Attempts state recovery (`reset()`) or invokes a hard reload (`window.location.reload()`).

---

## 2. Reusable Inline & State Components

To handle errors contextually inside modules and components (instead of crashing full routes), we provide a suite of reusable UI primitives:

### `ErrorBanner` (`src/components/ui/error-banner.tsx`)
- **Use Case**: Inline alerts within forms, lists, or headers.
- **Variants**: `info`, `warning`, `error`, `success`.
- **Transitions**: Uses Framer Motion to handle entrance, exit, and click dismiss transitions safely.
- **Accessibility**: Includes `role="alert"` and `aria-live="polite"` defaults.

### `OfflineState` (`src/components/error/offline-state.tsx`)
- **Use Case**: Renders whenever the system goes offline (`window.navigator.onLine === false`).
- **Features**: Connection check checker. Verifies actual browser connection and toasts status using `sonner`.

### `NetworkError` (`src/components/error/network-error.tsx`)
- **Use Case**: API request query failures.
- **Actions**: Retries API calls with custom callbacks, loading indicators, and toasts.

---

## 3. Specialized Empty Recovery States

We created standardized, zero-data components inside `src/components/error/empty-states.tsx` wrapping the existing Brutalist `EmptyState` component. These include:
- `NoJobsFound`: Handles empty job indexes or search filters.
- `NoSavedJobs`: Prompt for saved job vacancies.
- `NoApplications`: Pipeline tracking board zero state.
- `NoCoverLetters`: Wizard draft history zero state.
- `NoResume`: Resume builder uploads and variations list.
- `NoNotifications`: Notification alerts tray placeholder.
- `NoSearchResults`: Command palette search matches failure.

---

## 4. Accessibility Parameters (WCAG AA Compliance)
- **VoiceOver & Screen Readers**: All states include proper ARIA landmarks: `role="alert"` or `role="dialog"`, combined with `aria-live="assertive"` for critical failures and `aria-live="polite"` for non-blocking alerts.
- **Keyboard Traps**: Action buttons and interactive details toggles are fully focusable using native keyboard navigation (`Tab`, `Space`, `Enter`).
- **Reduced Motion**: Motion transitions are wrapped in Framer Motion configurations that naturally honor `prefers-reduced-motion` settings.
