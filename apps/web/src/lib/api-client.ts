/**
 * Lightweight API client for the NestJS backend.
 * Automatically attaches cookies on every request (credentials: "include").
 */

/**
 * Resolves the deployment base URL for server-side fetches.
 * Uses Vercel system variables (VERCEL_PROJECT_PRODUCTION_URL, VERCEL_URL)
 * or explicit INTERNAL_API_URL / NEXT_PUBLIC_APP_URL.
 * Never uses localhost in production.
 */
function getServerDeploymentBase(): string {
  // 1. Prefer internal Vercel service binding for server-to-server API calls if configured
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL.replace(/\/+$/, "");
  }

  // 2. In Vercel Preview deployments:
  // Must check VERCEL_URL before VERCEL_PROJECT_PRODUCTION_URL so Preview SSR calls
  // hit the Preview deployment's API and never accidentally call Production.
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 3. In Vercel Production deployments:
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }

  // 4. Any other Vercel deployment (fallback to deployment URL):
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 5. Explicit non-localhost NEXT_PUBLIC_APP_URL:
  if (
    process.env.NEXT_PUBLIC_APP_URL &&
    !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
  ) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "");
  }

  // 6. Local development fallback:
  if (process.env.NODE_ENV !== "production") {
    return "http://localhost:4000";
  }

  // 7. Production safety fallback (never localhost in production):
  return "https://ai-career-agent-web.vercel.app";
}

/**
 * Resolves the API base URL:
 * - In the browser: ALWAYS returns "/api/v1" (relative path, ensuring same-origin cookies and routing).
 * - On the server: returns deployment-aware absolute URL (e.g. https://.../api/v1).
 * - In local dev server: returns http://localhost:4000/api/v1.
 * - Never returns localhost in production.
 */
export function getApiBaseUrl(): string {
  // 1. Browser context: always use relative path for same-origin requests
  if (typeof window !== "undefined") {
    return "/api/v1";
  }

  // 2. Server-side context: deployment-aware resolution
  const serverBase = getServerDeploymentBase();
  return `${serverBase}/api/v1`;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const apiBase = getApiBaseUrl();
  const url = `${apiBase}${path}`;

  const res = await fetch(url, {
    ...init,
    credentials: "include", // always send/receive cookies
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init.headers ?? {}),
    },
  });

  if (!res.ok) {
    // If unauthorized and not already retrying, attempt silent refresh via HttpOnly refresh cookie
    if (
      res.status === 401 &&
      !isRetry &&
      !path.startsWith("/auth/login") &&
      !path.startsWith("/auth/register") &&
      !path.startsWith("/auth/refresh") &&
      !path.startsWith("/auth/logout")
    ) {
      try {
        const refreshRes = await fetch(`${apiBase}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({}),
        });
        if (refreshRes.ok) {
          return request<T>(path, init, true);
        }
      } catch {
        // Fall through to standard error handling
      }
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    const rawMessage = (data as { message?: string | string[] })?.message;
    const message = Array.isArray(rawMessage)
      ? rawMessage.join(", ")
      : (rawMessage ?? res.statusText ?? "Request failed");
    throw new ApiError(res.status, message, data);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),

  post: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  put: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "PUT",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  patch: <T>(path: string, body?: unknown, init?: RequestInit) =>
    request<T>(path, {
      ...init,
      method: "PATCH",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),

  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};
