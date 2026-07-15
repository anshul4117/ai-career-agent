# Global Search & Command Palette Architecture

## Overview
The AI Career Agent features a robust, accessible, and highly performant Global Search & Command Palette, inspired by Linear and Raycast. It allows users to quickly navigate, search across multiple domains, and execute quick actions from anywhere in the application.

## Triggering
Users can invoke the command palette via a global keyboard listener that captures:
- **Mac:** `⌘ + K`
- **Windows/Linux:** `Ctrl + K`

## Architecture

### 1. Data Aggregation (`useGlobalSearch`)
The Command Palette aggregates data dynamically from multiple existing Zustand stores across the application:
- **Jobs:** Maps `title` and `companyInfo.name`.
- **Companies:** Maps `name` and `industry`.
- **Resumes:** Maps `title` and `createdAt`.
- **Applications:** Maps `jobTitle` and `company`.
- **Cover Letters:** Maps `targetRole` and `targetCompany`.

The hook categorizes the results into segments like `Jobs`, `Companies`, `Resume`, etc.

### 2. Quick Actions
Static actions are injected into the search results, enabling instant navigation (e.g., "Go to Settings") and quick context creation (e.g., "Create Job Alert", "Upload Resume").

### 3. State Management (`useSearchStore`)
- **Open/Close State:** Managed via Zustand, allowing any component to programmatically toggle the palette.
- **Recent Searches (`ai-career-agent-search-history`):** A sub-store synced to `localStorage`. The last 10 clicked search results are persisted and displayed when the search query is empty.

### 4. Component Structure
- **`CommandPalette`:** The core modal wrapping a Radix UI Dialog. Uses Framer Motion for entrance/exit animations.
- **`CommandInput`:** Auto-focused input field handling typing and keyboard event bubbling.
- **`CommandList`:** Groups results by category and maps them out. Handles the "Empty State".
- **`CommandItem`:** An individual search result block. Memoized using `React.memo` to prevent unnecessary re-renders when navigating via keyboard arrows.

## Accessibility
The entire implementation utilizes Radix UI primitives ensuring:
- Full `ARIA` compliance (`role="dialog"`, `role="option"`, `aria-selected`).
- Focus trapping inside the modal.
- Native `ESC` key handling to close the dialog.

## Performance Profile
- `useMemo` heavily caches the filtered result sets and grouped chunks.
- Debounced filtering executes instantly on the client side since domain lists (Resumes, Applications) are already fetched by the respective feature stores.
