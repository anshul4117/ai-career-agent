# Folder Structure Specification

This document details the directory tree layout, feature-first modularization principles, and import guidelines for the AI Career Agent workspace.

---

## 1. Monorepo Organization

The project uses a monorepo workspace design to separate packages and deployment applications:

```
AI Career Agent/
├── apps/               <-- Deployable Next.js applications
│   └── web/            <-- Next.js web application
├── packages/           <-- Shared configurations, typings, and libraries
├── docs/               <-- Markdown design blueprints and specification files
├── public/             <-- Public assets, icons, and logo SVGs
└── .github/            <-- CI/CD workflows and action configurations
```

---

## 2. Web Application Structure (`apps/web/src/`)

All source code for the Next.js web application lives inside `apps/web/src/`, organized by role:

*   **`app/`**: Next.js App Router folders, layouts, routing templates, and middleware configurations.
*   **`components/`**: Shared UI primitives (buttons, inputs) and layouts (headers, sidebars).
*   **`features/`**: Feature modules containing isolated business logic.
*   **`hooks/`**: Shared custom React hooks (e.g. `useMediaQuery`).
*   **`providers/`**: Global Context providers (e.g. `AppProviders` wrapping theme context).
*   **`store/`**: Global Zustand stores (e.g. `ui.store.ts`).
*   **`lib/`**: Configurations and client initializers (e.g. custom axios utilities).
*   **`types/`**: Common typescript interfaces.
*   **`utils/`**: Helper functions (e.g. date formatting utilities).

---

## 3. Feature Module Conventions

Each domain module inside `src/features/` is isolated and self-contained. Features must follow a consistent internal organization:

```
features/my-feature/
├── components/   <-- UI components specific to this feature
├── hooks/        <-- Custom React hooks specific to this feature
├── services/     <-- API callers, data connectors, and mock service adapters
├── schemas/      <-- Zod validation schemas for forms
├── types/        <-- Feature-specific TypeScript types
├── constants/    <-- Feature-specific constants and static content
├── utils/        <-- Helper functions specific to this feature
├── store/        <-- Zustand stores specific to this feature
└── index.ts      <-- Barrel export file exposing public APIs
```

### Purpose of Key Files
*   **`index.ts`**: The public interface of the feature. All outer components must import from this index file rather than reaching deep into the feature subfolder.
*   **`services/`**: Abstracts backend connection logic, making it easy to swap mock implementations for actual API calls in the future.

---

## 4. Why We Use This Architecture

*   **Isolation**: Modifying a feature is self-contained within its folder, reducing the risk of side effects in other parts of the codebase.
*   **Clean Boundaries**: Enforcing exports through `index.ts` prevents spaghetti imports, keeping the codebase easy to maintain.
*   **Scalability**: New modules can be added quickly by cloning the standard folder template.
