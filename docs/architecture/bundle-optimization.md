# Bundle Size & Performance Optimization Guide

This document outlines the strategies, techniques, and results of the bundle size and dynamic loading optimizations implemented in the AI Career Agent platform.

---

## 1. Code Splitting & Dynamic Imports

To keep the initial load times fast (LCP under 1.2s) and minimize the JavaScript sent to the browser on entry routes, heavy interactive widgets and layouts are loaded dynamically using Next.js `next/dynamic`.

### Dynamic Targets

We split the components that are either nested inside toggled views, detailed dialog overlays, or hidden behind keyboard shortcuts:

| Component | Target File | Loader State | Impact |
| :--- | :--- | :--- | :--- |
| `CommandPalette` | `src/providers/app-providers.tsx` | `ssr: false` | Strips Radix dialogues and search index dependencies from all page initial loads. |
| `ResumeBuilderLayout` | `src/app/(dashboard)/resume/[id]/edit/page.tsx` | `<ResumeBuilderSkeleton />` | Decreases edit route package sizes from `52.4 kB` to `10.5 kB`. |
| `CalendarView` | `src/app/(dashboard)/applications/page.tsx` | `<CalendarSkeleton />` | Lazy-loads calendar layout grids only when users select Calendar view. |
| `ApplicationDetailDialog` | `src/app/(dashboard)/applications/page.tsx` | `ssr: false` | Defers Radix forms and application detail elements until a card is clicked. |
| `WelcomeModal` | `src/features/onboarding/components/dashboard-onboarding.tsx` | `ssr: false` | Lazy-loads welcome dialogue structures only when onboarding is actively running. |
| `TourOverlay` | `src/features/onboarding/components/dashboard-onboarding.tsx` | `ssr: false` | Defers SVG highlighting overlay engines until the product tour starts. |

---

## 2. Performance Comparison & Metrics

Following dynamic optimizations, compile outputs demonstrate substantial reductions in route chunks and total First Load sizes:

### Bundle Audit Comparison

| Page Route | Size (Before) | Size (After) | Change (%) | First Load JS (Before) | First Load JS (After) | JS Saved |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `/resume/[id]/edit` | `52.4 kB` | `10.5 kB` | **-80.0%** | `236 kB` | `130 kB` | **-106 kB** |
| `/applications` | `24.6 kB` | `21.3 kB` | **-13.4%** | `191 kB` | `177 kB` | **-14 kB** |

---

## 3. Best Practices for Developers

1. **Avoid Statically Importing Modals**:
   Always import large modal forms or overlay panels dynamically if they are closed by default.
2. **Dynamic Route Components**:
   If a route contains a layout with heavy sub-panels (like builder workspaces or complex charts), render the route shell statically and dynamically load the layout wrapper on the client side with a skeleton placeholder.
3. **PWA SVG Assets**:
   Leverage scalable SVG icons instead of rasterized PNGs in metadata manifests to keep load footprints minimal and prevent Broken Image 404 logs.
