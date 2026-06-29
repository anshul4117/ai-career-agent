# Authorization and Permission Matrix

This document defines user access boundaries, roles, restricted endpoints, and permissions for the AI Career Agent platform.

---

## 1. User Roles

The platform defines four clear user classifications:

1.  **Guest (Anonymous)**: Unauthenticated visitor browsing public details.
2.  **User (Candidate)**: Authenticated job seeker managing resumes, profile parameters, and job tracking.
3.  **Recruiter (Future)**: Authenticated partner posting job descriptions and searching candidate matching lists.
4.  **Admin (Future)**: Internal administrator managing roles, system parameters, and system moderation.

---

## 2. Access Permission Matrix

The grid below outlines resource availability by role:

| Resource | Guest | User | Recruiter | Admin |
| :--- | :--- | :--- | :--- | :--- |
| Public pages (`/`, `/about`) | Read | Read | Read | Read |
| Auth screens (`/login`, `/register`) | Write | Block | Block | Block |
| Onboarding (`/complete-profile`) | Block | Write | Block | Write |
| Dashboard Workspace (`/dashboard`) | Block | Read | Read | Read |
| Candidate Profile (`/profile`) | Block | Write | Read (Public only) | Write |
| Resume Editor & Files (`/resume`) | Block | Write | Block | Read |
| Job Feeds & Match Analysis (`/jobs`) | Block | Read | Write (Own jobs) | Write |
| Saved Jobs (`/saved-jobs`) | Block | Write | Block | Read |
| Pipeline Tracker (`/applications`) | Block | Write | Block | Read |
| AI Cover Letter Generator (`/cover-letters`) | Block | Write | Block | Read |
| Global Settings Page (`/settings`) | Block | Write | Write | Write |
| User Account Moderation | Block | Block | Block | Write |

---

## 3. Protected Resources and Route Access Rules

Access control is enforced at two levels:

### Server-side Route Protection
*   Enforced in `middleware.ts`.
*   Unauthenticated requests trying to access protected paths are immediately redirected back to `/login` with HTTP 307.
*   Authenticating automatically validates session cookies.

### API Endpoint Protection
*   If a request reaches an API route handler without a valid session, the server yields an HTTP `401 Unauthorized` or `403 Forbidden` response.

---

## 4. UI Visibility Rules

*   **Conditional Rendering**: Buttons for restricted actions are hidden or disabled based on role.
*   **Locked States**: Features like matching metrics and resume creation show a lock icon to Guest users, prompting them to create an account.
*   **Profile Completions**: Authenticated candidates who haven't filled out their profile info are restricted from accessing dashboard menus (a full-page overlay locks workspace navigation).

---

## 5. Future Role-Based Access Control (RBAC) Strategy

When migrating from mock session keys to a database-backed solution:
1.  **Role Property**: The `AuthUser` data type will hold a `role: "guest" | "user" | "recruiter" | "admin"` field.
2.  **Permissions Middleware**: Custom API route utility wrappers will check claims (e.g. `hasPermission(req, "jobs:write")`) before running server actions.
3.  **Admin Panels**: Dedicated `/admin` route trees will verify administrative tokens.
