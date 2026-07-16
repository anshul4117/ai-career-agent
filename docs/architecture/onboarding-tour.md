# Onboarding & Product Tour Architecture

This document details the architectural layout, components, and state logic of the onboarding sequence, guided product tour, and getting started checklist on the AI Career Agent platform.

---

## 1. Onboarding State Management

Onboarding configuration is handled globally using Zustand with local storage persistence to verify if it is a user's first visit.

### Zustand Store (`src/features/onboarding/store/onboarding.store.ts`)
- **Key State Variables**:
  - `hasCompletedOnboarding`: Prevents the welcome modal from reopening.
  - `isWelcomeOpen`: Triggers the initial greeting layout.
  - `isTourActive`: Orchestrates the guided tour backdrop and highlight cut-outs.
  - `currentStep`: Tracks active tour highlights.
  - `completedTasks`: Retains checklist tasks completed by the candidate.
  - `tipsShown`: History of shown contextual product tips.
  - `enableProductTips`: Toggle status for contextual tips.
- **Initialization**: Mounted globally in `AppProviders` to automatically activate the onboarding modal on the user's first visit.

---

## 2. Component Design & Engine Flow

### Welcome Dialog (`WelcomeModal`)
- **Location**: `src/features/onboarding/components/welcome-modal.tsx`
- **Logic**: Greets the candidate and outlines core features of the platform. Features buttons to start the tour, skip it, or dismiss onboarding permanently.

### Guided Tour Overlay (`TourOverlay`)
- **Location**: `src/features/onboarding/components/tour-overlay.tsx`
- **Overlay Highlight Cut-out**: Uses full-screen SVG masking (`<mask id="tour-cutout">`) with white/black rectangles to create a dark translucent backdrop while carving out a sharp cut-out directly over the target DOM element.
- **Adaptive Positioning**: Listens for window `resize` and `scroll` events to dynamically recalculate bounding client rects. Automatically pushes tooltips to center viewport coordinates if target elements are absent.
- **Mobile Adaptability**: Automatically signals the UI layout store (`useUiStore.setSidebarOpen(true)`) if a tour step targets mobile navigation items that are currently hidden.

### Getting Started Checklist (`Checklist`)
- **Location**: `src/features/onboarding/components/checklist.tsx`
- **Features**: Checks task completion dynamically by querying respective stores (resumes, bookmarks, alerts, etc.) and updates task checklist states accordingly.
- **Celebration Trigger**: Fires a custom confetti particle animation and toast notification upon reaching 100% completion.

### Contextual Product Tips (`ProductTips`)
- **Location**: `src/features/onboarding/components/product-tips.tsx`
- **Triggers**: Placed inside respective feature routes (e.g. `/resume`, `/saved-jobs`, `/cover-letters`). Appears once and saves the dismissed state.

---

## 3. Keyboard & Accessibility Support
- **Focus Trapping**: Radix UI Dialog primitives trap keyboard tab controls during modal interactions.
- **VoiceOver & Screen Readers**: Uses explicit `role="status"` and `aria-live="polite"` tags to report tooltips and toast achievements safely without interrupting active workflow.
- **Shortcuts**: Accessible keyboard list view is rendered inside the Help dropdown menu.
- **Motion Controls**: Entrance scale-ins and backdrop fades honor local `prefers-reduced-motion` layout specifications.
