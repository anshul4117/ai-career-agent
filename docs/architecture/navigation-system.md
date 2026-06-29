# Navigation System Specification

This document details the navigation structures, layout controls, visibility rules, and styling patterns for the AI Career Agent platform.

---

## 1. Landing Navigation (Public)

The landing header serves guest visitors and contains marketing triggers.

*   **Logo Link**: Navigates to `/` (Landing Page).
*   **Navigation Links**:
    *   `Features` -> Links to `#features` on landing page.
    *   `How It Works` -> Links to `#how-it-works` on landing page.
    *   `Pricing` -> Links to `/pricing` page.
    *   `FAQ` -> Links to `#faq` on landing page.
*   **CTA Actions**:
    *   `Sign In` (BrutalButton variant="secondary") -> Links to `/login`.
    *   `Get Started` (BrutalButton variant="default") -> Links to `/register`.

---

## 2. Dashboard Sidebar (Private Workspace)

The sidebar is the primary dashboard guide. It collapses on larger screens to preserve workspace width and hides on mobile viewports.

*   **Dashboard**: `/dashboard` (Hub summary metrics, matching feed overview).
*   **Profile**: `/profile` (Manage experience, skills, education).
*   **Resume**: `/resume` (Manage uploaded files, builder tool).
*   **Jobs**: `/jobs` (Discover matches, filter vacancies).
*   **Saved Jobs**: `/saved-jobs` (Review bookmarked positions).
*   **Applications**: `/applications` (Interactive pipeline boards).
*   **Cover Letters**: `/cover-letters` (Generate templates using AI).
*   **Settings**: `/settings` (Manage password, emails, themes).

---

## 3. Header Navigation

Located at the top of the dashboard workspace layout:
*   **Sidebar Collapse Button**: Minimizes sidebar width from 240px to 72px.
*   **Global Search Field**: Dynamic input that updates matching queries across tabs.
*   **Notifications Bell**: Hover trigger displaying active alerts and matches.
*   **User Menu Button**: Renders a dropdown containing links to Profile, Settings, and the Logout function.

---

## 4. Footer Navigation

*   **Marketing Columns**: Link to public pages (`/about`, `/pricing`, `/faq`, `/contact`).
*   **Resources**: Links to technical pages like Github repositories.
*   **Legal Section**: Explicit routes pointing to Privacy Policy (`/privacy`) and Terms of Service (`/terms`).

---

## 5. Mobile Navigation

On mobile screens (< 768px), the sidebar collapses completely. A bottom tab bar or hamburger toggle provides immediate access:
*   **Mobile Bottom Bar**: Renders quick-action icons for Dashboard, Jobs, Resumes, and Settings.
*   **Hamburger Toggle**: Found in the header; slides open a temporary sidebar overlay for accessory pages.

---

## 6. Active Route Highlighting

Links are styled based on matching route pathnames:
*   **Matching Rules**:
    *   If pathname exactly matches `item.href` (or starts with it for nested routes, e.g. `/jobs/123` matches `/jobs`).
*   **Brutalist Visual Indicators**:
    *   Active links receive a solid outline, a background color (e.g. `bg-surface-secondary`), and a bold text weight.
    *   Example logic:
        ```typescript
        const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
        ```

---

## 7. Navigation Visibility & Permission Rules

*   **Guest Access**: Only public and guest-only links are visible.
*   **Authenticated Access**: Guest-only authentication routes are hidden from menus.
*   **Profile Incomplete**: If `profileCompleted === false`, all dashboard sidebar navigation items are visually locked or disabled, forcing the user to complete `/complete-profile` before entering the wider dashboard workspace.

---

## 8. Breadcrumb Strategy

For nested sub-pages (e.g. `/resume/new` or `/jobs/[id]`), a breadcrumb bar appears above the main title:
*   Format: `Workspace > Resumes > New`
*   All intermediate terms are clickable links.

---

## 9. Future Navigation Expansion

When adding new modules (e.g., Interview Prep or Career Roadmap), items will be appended into the `mainNavigation` array config file (`src/config/navigation.ts`). They will automatically render in the sidebar and bottom mobile navigation bars based on matching roles.
