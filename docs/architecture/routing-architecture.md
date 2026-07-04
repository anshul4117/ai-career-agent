# Routing Architecture Specification

This document details the routing design patterns, access classifications, layout organization, and security guard policies for the AI Career Agent platform.

---

## 1. Route Categories

All URLs are categorized into three access-control groups:

*   **Public Routes**: Open to anyone without authentication. Contains marketing, information, pricing, support pages, and policies.
*   **Guest-Only Routes**: Restricted to unauthenticated users. If a user with an active session attempts to access these pages, they are redirected automatically to the protected workspace.
*   **Protected Routes**: Require active authentication. If a guest attempts to visit these paths, they are intercepted and redirected to the `/login` page.

---

## 2. Master Route Table

The tables below map the complete routing structure for Next.js App Router:

### Public Group
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | Landing Page | Primary marketing page highlighting features & CTA. |
| `/about` | About Us | Vision, mission, and company overview. |
| `/pricing` | Pricing | Subscription plans and product pricing tiers. |
| `/contact` | Contact Support | Help request form for candidates. |
| `/faq` | FAQ Page | Answers to frequently asked questions. |
| `/privacy` | Privacy Policy | Legal disclosures regarding data storage & resumes. |
| `/terms` | Terms of Service | Candidate terms of service agreements. |
| `/404` | Not Found | Custom styled fallback for non-existent paths. |

### Guest-Only Group
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/login` | Sign In | Email/password & Google credentials sign-in. |
| `/register` | Sign Up | Account creation form. |
| `/forgot-password` | Password Recovery | Password reset code trigger request. |
| `/reset-password` | Reset password | Submission of new password with token. |
| `/verify-email` | Email Verification | Verification code submission form. |

### Protected Group
| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/dashboard` | Dashboard Hub | Main workspace showing match scores and job feeds. |
| `/complete-profile` | Profile Onboarding | Mandatory profile step for first-time signups. |
| `/profile` | Profile Overview | LinkedIn-style CV profile dashboard with completion and missing sections. |
| `/profile/edit` | Profile Editor | Single editing workspace for all 10 candidate profile forms. |
| `/resume` | Resume Workspace | Dashboard list showing ATS scores, default badges, duplicate, archive, and delete operations. |
| `/resume/new` | Create Wizard | Multi-step setup wizard selecting templates (6 layouts) and draft metadata. |
| `/resume/:id` | Resume Preview | Print-ready CV visualizer mapping active candidate profile details to selected templates. |
| `/resume/:id/edit` | Edit Settings | Form to update draft name, descriptions, layout formats, active/archived status, and default statuses. |
| `/jobs` | Job Search | Browse matched job cards and adjust preferences. |
| `/jobs/:id` | Job Detail View | Review full JD metrics, required skills, and matching details. |
| `/saved-jobs` | Bookmarks List | Jobs bookmarked by the candidate. |
| `/applications` | Pipeline Tracker | Drag‑and‑drop board tracking progress from Apply to Offer. |
| `/cover-letters` | AI Cover Letters | Edit, preview, and generate cover letters using AI. |
| `/settings` | Settings Manager | Update account email, change passwords, and preferences. |

---

## 3. Middleware Strategy

Next.js Edge middleware acts as the primary boundary wall for request matching. It intercepts HTTP requests before they render pages, utilizing a lightweight session token verification.

```
Incoming Request (HTTP / URL)
           │
           ▼
┌───────────────────────────────────────┐
│        Next.js Edge Middleware        │
└──────────┬─────────────────┬──────────┘
           │                 │
     No Session Cookie  Session Cookie Found
           │                 │
           ▼                 ▼
┌──────────────────┐   ┌──────────────────┐
│   Protected?     │   │   Guest-Only?    │
└────┬────────┬────┘   └────┬────────┬────┘
     │        │             │        │
    Yes       No           Yes       No
     │        │             │        │
     ▼        ▼             ▼        ▼
Redirect   Forward to    Redirect   Forward to
/login     Page Router   /dashboard Page Router
```

### Cookie-based Verification
We check for the presence of the `aca-session` cookie directly inside the middleware:
```typescript
const session = req.cookies.get("aca-session");
const isAuthenticated = !!session;
```

---

## 4. Route Guards

To ensure bulletproof safety, client-side route guards act as secondary safety gates. They wrap page elements to prevent flashing of unauthorized layouts or data before redirects resolve.

*   **`GuestGuard`**: Wraps guest pages like `/login` or `/register`. If the client-side authentication context resolves to `isAuthenticated: true`, the guard immediately triggers `router.replace("/dashboard")`.
*   **`AuthGuard`**: Wraps protected pages. If `isAuthenticated: false` after resolving, it triggers `router.replace("/login")`. If `user.profileCompleted === false`, it redirects to `/complete-profile`.

---

## 5. Nested Layouts

Next.js route groups (`(auth)` and `(dashboard)`) organize nested templates:

*   **Guest Layout (`src/app/(auth)/layout.tsx`)**: Wraps auth screens in a clean, centered `AuthLayout` containing brutalist visual elements, accessibility skip links, and card wrappers.
*   **Workspace Layout (`src/app/(dashboard)/layout.tsx`)**: Wraps application pages with the persistent responsive sidebar (`Sidebar`), top navigation header (`Header`), and floating mobile tab bar (`MobileNav`).

---

## 6. Dynamic Routes

Dynamic sub-routes use brackets to fetch parameter IDs:
*   `/jobs/[id]` retrieves job details from mock databases or backend APIs via `params.id`.
*   `/resume/[id]` displays the corresponding resume PDF builder workspace.

---

## 7. Route Naming Conventions

*   **Folder Names**: Always lowercase, hyphen-separated for multi-word paths (e.g. `/saved-jobs`, `/cover-letters`).
*   **Parameters**: Always lowercase singular nouns enclosed in square brackets (e.g. `[id]`, `[token]`).

---

## 8. Loading and Streaming Strategy

To prevent visual layout shifts (CLS), we utilize Next.js `loading.tsx` pages at layout junctions:
*   **Streaming**: Important metadata is resolved server-side while heavier visual panels are streamed in using React Suspense wrappers and Brutalist-themed pulse layout skeletons (`Skeleton`).

---

## 9. Error and Fallback Routes

*   **Custom 404 (`src/app/not-found.tsx`)**: Renders a dedicated page when a route does not exist.
*   **Global Error Boundaries (`src/app/error.tsx`)**: Wraps page trees to gracefully catch runtime errors and prompt the user to retry without crashing the layout.

---

## 10. Future API Route Conventions

When transitioning to a full backend, Next.js Route Handlers (`route.ts`) will follow REST conventions:
*   Namespace: All backend actions must live under `/api/v1/`.
*   Naming: Plural nouns (e.g., `/api/v1/jobs`, `/api/v1/resumes`).
*   Auth: Handled via bearer tokens or authenticated session cookie validation.
