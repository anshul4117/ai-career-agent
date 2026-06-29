# Error Handling Strategy

This document defines standard practices, UI components, and recovery flows for handling errors on the AI Career Agent platform.

---

## 1. Error Categories

The application classifies runtime exceptions into five primary areas:

### 1. Input Validation Errors
*   **Cause**: Invalid form data submitted by users.
*   **Behavior**: Handled immediately on the client side via Zod schemas. Invalid inputs display inline red border states and error text beneath the fields.

### 2. Authentication Failures
*   **Cause**: Invalid credentials or expired sessions.
*   **Behavior**: Display a styled Brutalist card container (`ErrorMessage`) above the login form. Expired cookies automatically clear client stores and redirect users to `/login`.

### 3. Authorization Restrictions (403 Forbidden)
*   **Cause**: Users attempting to access admin features or other private materials.
*   **Behavior**: Redirect to a fallback page informing the user of the lack of permissions.

### 4. Route Not Found (404)
*   **Cause**: Accessing non-existent paths.
*   **Behavior**: Caught by Next.js `not-found.tsx`, rendering a Brutalist-styled 404 fallback page.

### 5. Server Failures (500)
*   **Cause**: API crashes or unexpected database issues.
*   **Behavior**: Caught by layout `error.tsx` boundaries. Users see a friendly error screen with a "Retry" button.

---

## 2. API Failures & Offline Mode

*   **Offline Mode**: A global event listener monitors connection status:
    ```typescript
    window.addEventListener("offline", () => {
      // Notify user they are currently offline
    });
    ```
*   **API Failures**: Network errors are caught inside mock services or API clients, transforming confusing HTTP responses into clear user messages (e.g. "We are having trouble connecting. Please check your internet connection.").

---

## 3. Retry Strategy

*   **Form Retries**: If a submit fails, form inputs remain populated, allowing the user to make changes and submit again without losing their progress.
*   **Layout Recovery**: Next.js error boundaries provide a `reset()` callback that attempts to re-render the segment:
    ```typescript
    export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
      return (
        <div className="space-y-4">
          <p>Something went wrong.</p>
          <button onClick={() => reset()}>Try Again</button>
        </div>
      );
    }
    ```

---

## 4. Toast Notifications & Messaging

*   **Feedback Pattern**: Success notifications (e.g. "Profile Saved Successfully") and minor warnings are displayed as toast alerts.
*   **Writing Style**: Error notifications should avoid technical jargon:
    *   *Bad*: "Error 500: Database connection pool exhausted."
    *   *Good*: "We're experiencing temporary server issues. Please try again in a few moments."

---

## 5. Logging Strategy

*   **Development**: Logs are written to the console using a structured pattern: `[Feature] Action -> Status`.
*   **Production (Future)**: Client exceptions will be sent to logging services (like Sentry) using level tags (`error`, `warning`, `info`) to capture stack traces.
