# Authentication Architecture Documentation

This document describes the design, flow, and future migration plan of the Authentication module in the AI Career Agent application.

---

## Current Architecture

The authentication layer follows a strict separation of concerns, ensuring UI components and layouts are decoupled from the underlying authentication provider.

```
+------------------+
|   UI Components  | (Header, SidebarNav, Login/Register Forms)
+--------+---------+
         |
         | uses
         v
+--------+---------+
|    useAuth()     | (React Hook - Exposes standard APIs only)
+--------+---------+
         |
         | consumes
         v
+--------+---------+
|   AuthProvider   | (React Context - Manages client-side session states)
+--------+---------+
         |
         | delegates to
         v
+--------+---------+
|   authService    | (Data service layer - localStorage DB + aca-session Cookie)
+------------------+
```

### Why Mock Auth?

We utilize a professional Mock Authentication Engine during local development to:
1. **postpone Clerk APIs** and avoid brittle dependency updates during layout/UI development.
2. **Offline-friendly and performant**: No external network requests are required to authenticate, resolving test slowness and login hanging states.
3. **Reproducibility**: Easily seed different states (incomplete profiles, unverified users) in local storage for manual QA.

---

## Folder Structure

All authentication-related files are encapsulated inside `src/features/auth/`:

- **`components/`**: Isolated forms and fields (e.g. `LoginForm`, `RegisterForm`, `CompleteProfileForm`).
- **`hooks/`**: Custom `useAuth()` hook exposing standard operations.
- **`providers/`**: Custom React context `AuthProvider`.
- **`services/`**: Mock authentication service `authService`.
- **`types/`**: Common types (`AuthUser`, `AuthSessionState`).
- **`schemas/`**: Zod validation schemas for forms.

---

## Authentication Flow

### Registration Flow
1. Guest visits `/register` and fills the registration form.
2. Form calls `register(email, password)`. The user is added to `localStorage` under `aca-users` with `verified: false` and `profileCompleted: false`.
3. User is redirected to `/verify-email`.
4. Entering any code >= 4 chars satisfies `verifyEmail(code)`. User is marked as `verified: true`, marked as logged‑in (`aca-current-user` is set, `aca-session` cookie is created), and redirected to `/complete-profile`.

### Profile Onboarding Flow
1. From `/complete-profile`, the user submits the form or clicks **Skip for Now**.
2. Both actions call `authService.completeProfile()` which updates the user's `profileCompleted` state to `true` and saves it.
3. User is redirected to `/dashboard`.

### Session Restoration
1. When the page refreshes, `AuthProvider` calls `authService.getCurrentUser()` in a client-side `useEffect`.
2. This reads the active user from `localStorage` (`aca-current-user`) and updates the state.
3. Hydration matches are prevented by defaulting `isLoading` to `true` on the server and initial mount.

---

## Future Clerk Migration Plan

When we are ready to transition to Clerk, the UI components do not need to change. Only the authentication engine implementation needs to be swapped:

### Step 1: Install Clerk dependency
Add `"@clerk/nextjs"` back to `package.json` dependencies and run `npm install`.

### Step 2: Swap the AuthProvider
Update `src/features/auth/providers/auth-provider.tsx` to mount Clerk's `<ClerkProvider>` and remove the custom React context.

### Step 3: Update the useAuth hook
Update `src/features/auth/hooks/use-auth.ts` to call Clerk hooks directly:
```typescript
import { useAuth as useClerkAuth, useUser, useSignIn, useSignUp } from "@clerk/nextjs";

export function useAuth() {
  const { isLoaded, userId, signOut } = useClerkAuth();
  const { user: clerkUser } = useUser();
  // ... translate clerkUser to AuthUser interface
  // ... map signIn/signUp methods to login/register
}
```

### Step 4: Re-enable Clerk middleware
Update `src/middleware.ts` to call Clerk's `clerkMiddleware()` and matchers.
