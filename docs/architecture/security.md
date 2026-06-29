# Security Best Practices

This document outlines the security specifications, data protections, and engineering standards for the AI Career Agent platform.

---

## 1. Authentication Strategy

*   **Mock Phase**: Authenticated status is tracked using the `aca-session` cookie and synced with user records stored in `localStorage`.
*   **Production Phase**: We will transition to Clerk's OpenID Connect (OIDC) JWT tokens. Client requests will carry these JWTs in header parameters, verifying signatures at the server API layer.

---

## 2. Session Management

*   **Cookie Attributes**:
    *   `SameSite=Lax` to protect against CSRF attacks during navigation transitions.
    *   `Secure` enabled in production, forcing transmissions over HTTPS only.
*   **Storage Guidelines**:
    *   Client state (like names or onboarding status) can be stored in `localStorage` for UI rendering.
    *   Authentication tokens or session secrets must NOT be written to accessible local storage.

---

## 3. Input Validation and Sanitization

*   **Data Validation**: Every form submission is validated using Zod schemas on both the client (for UX) and the server (for security).
*   **XSS Mitigation**:
    *   Next.js React renders inputs as safe text strings by default, preventing inline script execution.
    *   Any custom rendering of rich text or external markup (e.g. parsed resume sections) must use HTML sanitizers (like `dompurify` or `isomorphic-dompurify`).

---

## 4. Cross-Site Request Forgery (CSRF)

*   **Mitigation**:
    *   Next.js API route handlers use token validation or custom CORS rules to ensure they only accept requests from verified client origins.
    *   Session cookies utilize strict path scopes (`path=/`) and expiration boundaries.

---

## 5. Secrets and Environment Variables

*   **Naming Conventions**:
    *   Public keys (safe to bundle in the client code) must be prefixed with `NEXT_PUBLIC_` (e.g., `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`).
    *   Private keys (database credentials, API keys) must NOT have this prefix, ensuring they remain hidden on the server.
*   **Storage**: Secrets are stored in `.env.local` files, which are excluded from Git repository tracking (`.gitignore`).

---

## 6. Future Production Security Checklist

Before launching to production, the team must verify:
- [ ] Set `NODE_ENV=production` in the deployment environment.
- [ ] Enforce SSL/TLS with HTTP Strict Transport Security (HSTS) headers.
- [ ] Configure Content Security Policy (CSP) headers to restrict unauthorized script execution origins.
- [ ] Audit dependencies for known vulnerabilities (`npm audit`).
- [ ] Enable rate-limiting on API endpoints.
