/**
 * Live authentication service — replaces the previous localStorage mock.
 *
 * All token management is handled by the NestJS backend via HttpOnly cookies.
 * The frontend never reads or stores raw JWTs.
 */

import { apiClient, ApiError } from "@/lib/api-client";
import type { AuthUser } from "../types/auth.types";

interface AuthResponse {
  user: AuthUser;
}

export function normalizeAuthUser(
  raw:
    | AuthUser
    | (Record<string, unknown> & { id: string; email: string })
    | null
    | undefined,
): AuthUser {
  if (!raw) return raw as unknown as AuthUser;
  const fullName = (raw.fullName as string) || (raw.name as string) || "";
  const parts = fullName.trim().split(/\s+/);
  const firstName = (raw.firstName as string) || parts[0] || "";
  const lastName =
    (raw.lastName as string) ||
    (parts.length > 1 ? parts.slice(1).join(" ") : "");
  const name =
    (raw.name as string) ||
    fullName ||
    `${firstName} ${lastName}`.trim() ||
    raw.email ||
    "Candidate";
  const profileImage =
    (raw.profileImage as string) ||
    ((raw as Record<string, unknown>).profilePhotoUrl as string) ||
    null;
  const verified = Boolean(
    raw.verified ??
    ((raw as Record<string, unknown>).emailVerified as boolean) ??
    false,
  );

  return {
    ...raw,
    id: raw.id,
    email: raw.email,
    fullName: fullName || name,
    name,
    firstName,
    lastName,
    profileImage,
    verified,
    profileCompleted: Boolean(raw.profileCompleted),
  };
}

// ── Cookie helpers (public cookies only — HttpOnly ones are invisible to JS) ──

function setPublicSessionCookies(profileCompleted = false) {
  if (typeof document === "undefined") return;
  const maxAge = 7 * 24 * 60 * 60; // 7 days, mirrors refresh-token session lifetime
  document.cookie = `aca-session=active;path=/;max-age=${maxAge};SameSite=Lax`;
  document.cookie = `aca-profile-completed=${profileCompleted ? "true" : "false"};path=/;max-age=${maxAge};SameSite=Lax`;
}

function clearPublicSessionCookies() {
  if (typeof document === "undefined") return;
  document.cookie = "aca-session=;path=/;max-age=0;SameSite=Lax";
  document.cookie = "aca-profile-completed=;path=/;max-age=0;SameSite=Lax";
}

// ── Auth service ──────────────────────────────────────────────────────────────

export const authService = {
  /** Log in with email + password */
  async login(email: string, password: string): Promise<AuthUser> {
    const data = await apiClient.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    const user = normalizeAuthUser(data.user);
    setPublicSessionCookies(!!user.profileCompleted);
    return user;
  },

  /** Google OAuth — not yet wired to a real provider; kept as stub */
  async loginWithGoogle(): Promise<AuthUser> {
    throw new ApiError(501, "Google login is not yet available.");
  },

  /** Register with email + password */
  async register(
    email: string,
    password: string,
    fullName?: string,
  ): Promise<AuthUser> {
    const data = await apiClient.post<AuthResponse>("/auth/register", {
      email,
      password,
      fullName: fullName?.trim() || email.split("@")[0],
    });
    const user = normalizeAuthUser(data.user);
    setPublicSessionCookies(!!user.profileCompleted);
    return user;
  },

  /** Google OAuth registration — stub */
  async registerWithGoogle(): Promise<AuthUser> {
    throw new ApiError(501, "Google registration is not yet available.");
  },

  /** Log out — backend clears HttpOnly cookies */
  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // best-effort
    }
    clearPublicSessionCookies();
  },

  /**
   * Verify email — the backend doesn't have a verification endpoint yet,
   * so we keep the mock behaviour and log the intent.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async verifyEmail(_code: string): Promise<AuthUser> {
    // TODO: wire to POST /auth/verify-email when the endpoint is implemented
    // For now simulate and mark the current session as verified
    const current = await this.getMe();
    if (!current) throw new Error("No active session found.");
    setPublicSessionCookies(!!current.profileCompleted);
    return current;
  },

  /** Forgot password — stub until backend endpoint exists */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async forgotPassword(_email: string): Promise<void> {
    // TODO: POST /auth/forgot-password
    await new Promise((r) => setTimeout(r, 800));
  },

  /** Reset password — stub until backend endpoint exists */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async resetPassword(_password: string, _token: string): Promise<void> {
    // TODO: POST /auth/reset-password
    await new Promise((r) => setTimeout(r, 800));
  },

  /** Update profile data on the server */
  async completeProfile(data: {
    firstName: string;
    lastName: string;
    headline: string;
    preferredRole: string;
    preferredLocation: string;
  }): Promise<AuthUser> {
    try {
      await apiClient.put("/profile/me", {
        personal: {
          firstName: data.firstName,
          lastName: data.lastName,
        },
        career: {
          headline: data.headline,
          preferredRole: data.preferredRole,
          preferredLocation: data.preferredLocation,
        },
        preferences: {
          preferredRole: data.preferredRole,
          preferredLocation: data.preferredLocation,
        },
      });
    } catch (err) {
      console.warn("Failed to persist completeProfile to /profile/me:", err);
    }

    setPublicSessionCookies(true);
    const refreshed = await this.getMe();
    if (!refreshed) {
      throw new Error("No active session found.");
    }
    return refreshed;
  },

  /** Fetch the currently authenticated user from the server */
  async getMe(): Promise<AuthUser | null> {
    // If running in browser and no public session cookie exists, user is a guest;
    // avoid sending a request that is guaranteed to return 401.
    if (
      typeof document !== "undefined" &&
      !document.cookie.includes("aca-session=")
    ) {
      return null;
    }

    try {
      const data = await apiClient.get<AuthResponse>("/auth/me");
      const user = normalizeAuthUser(data.user);
      setPublicSessionCookies(!!user.profileCompleted);
      return user;
    } catch {
      clearPublicSessionCookies();
      return null;
    }
  },

  /** Restore session by hitting /auth/me (replaces localStorage read) */
  getCurrentUser(): null {
    // Intentionally returns null — callers must use getMe() for server-side truth.
    return null;
  },

  /** @deprecated use getMe() */
  isAuthenticated(): boolean {
    return false;
  },
};

export type AuthService = typeof authService;
