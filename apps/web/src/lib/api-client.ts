/**
 * Lightweight API client for the NestJS backend.
 * Automatically attaches cookies on every request (credentials: "include").
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api/v1";

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

let activeRefreshPromise: Promise<boolean> | null = null;

async function executeSilentRefresh(): Promise<boolean> {
  // If running in browser and no session indicator cookie exists, avoid sending 401 refresh request
  if (
    typeof document !== "undefined" &&
    !document.cookie.includes("aca-session=")
  ) {
    return false;
  }

  if (activeRefreshPromise) {
    return activeRefreshPromise;
  }

  activeRefreshPromise = (async () => {
    try {
      const refreshRes = await fetch(`${API_BASE}/auth/refresh`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}),
      });
      return refreshRes.ok;
    } catch {
      return false;
    } finally {
      activeRefreshPromise = null;
    }
  })();

  return activeRefreshPromise;
}

async function request<T>(
  path: string,
  init: RequestInit = {},
  isRetry = false,
): Promise<T> {
  const url = `${API_BASE}${path}`;

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
      const refreshed = await executeSilentRefresh();
      if (refreshed) {
        return request<T>(path, init, true);
      }
    }

    let data: unknown;
    try {
      data = await res.json();
    } catch {
      data = null;
    }
    const rawMessage = (data as { message?: string | string[] })?.message;
    const message =
      (Array.isArray(rawMessage) ? rawMessage.join(", ") : rawMessage) ??
      res.statusText ??
      "Request failed";
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
