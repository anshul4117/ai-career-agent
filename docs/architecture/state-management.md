# State Management Strategy

This document outlines the state architecture, library divisions, persistence policies, and coding conventions for the AI Career Agent platform.

---

## 1. State Categories

We divide application state into four distinct layers:

### Global State (Client-wide)
*   **Purpose**: Shared UI and cross-cutting configurations (themes, sidebars, active query parameters).
*   **Tool**: Zustand.

### Feature State (Domain-isolated)
*   **Purpose**: State tied to specific feature sub-modules (active resume draft, matching filter selections).
*   **Tool**: Zustand or React Context (where state lives strictly inside a sub-tree).

### Form State (Transient)
*   **Purpose**: Validation, input changes, dirtiness, and submit handlers.
*   **Tool**: React Hook Form (bound to Zod schemas).

### Server State (Cached data - Future)
*   **Purpose**: Cached data retrieved from API routes, supporting query deduping, background updates, and loading flags.
*   **Tool**: TanStack Query (React Query).

---

## 2. Zustand Store Architecture

We use Zustand for global state. Stores are split into focused slices to prevent unnecessary re-renders:

*   **`useUiStore`**: Manages responsive sidebars, search parameters, and view options.
*   **`useAuthStore`**: Manages temporary session information and onboarding profiles (mock stage).

### Implementation Guidelines
*   **Select Slices**: Always import specific variables or actions rather than the entire state to isolate re-renders:
    ```typescript
    const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);
    ```
*   **Actions Isolation**: Keep actions separate or wrap them in simple callback functions to keep component code clean.

---

## 3. State Persistence Strategy

*   **Zustand Persist Middleware**: Utilized to save client preferences (like `sidebarCollapsed` or session keys) into `localStorage` across page reloads.
*   **Hydration Reconciliation**: To prevent Next.js hydration mismatches:
    *   Stores are configured with a `partialize` filter to limit keys persisted to local storage.
    *   Client components check mount state (`useEffect`) before displaying UI keys bound to stored states.

---

## 4. Form State & Validation Strategy

*   **React Hook Form**: Handles inputs without triggering component re-renders on every keystroke.
*   **Zod Integration**: Forms use Zod schemas (`src/features/auth/schemas/auth.schema.ts`) to validate forms before calling the API.
*   **Schema Schema Example**:
    ```typescript
    import { z } from "zod";
    export const loginSchema = z.object({
      email: z.string().email("Enter a valid email address."),
      password: z.string().min(8, "Password must be at least 8 characters."),
    });
    ```

---

## 5. Future TanStack Query Integration

For database-backed modules, we will introduce TanStack Query:
*   **Queries**: Fetching jobs or resume files will be handled via `useQuery`.
*   **Mutations**: Form submissions (like updating profile details or saving resumes) will use `useMutation`, triggering cache invalidation via `queryClient.invalidateQueries`.
*   **Caching Strategy**: Default stale-time of 2 minutes to reduce duplicate network requests.

---

## 6. Folder Organization & Conventions

*   **Global Stores**: Placed inside `src/store/` (e.g. `ui.store.ts`, `auth.store.ts`).
*   **Feature Stores**: Placed inside the feature's subfolder under `store/` (e.g. `src/features/auth/store/auth.store.ts`).
*   **Naming Conventions**:
    *   Store files: `[name].store.ts` (always lowercase).
    *   Hook name: `use[Name]Store` (camelCase, e.g. `useUiStore`).
    *   Persisted keys prefix: `aca-[name]` (e.g., `aca-ui`).
