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
    setPublicSessionCookies(!!data.user.profileCompleted);
    return data.user;
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
      fullName: fullName ?? "",
    });
    // After register we land on verify-email; don't set session cookie yet
    return data.user;
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
    // TODO: PATCH /api/v1/users/me when the endpoint is ready
    // For now update local session optimistically
    const current = await this.getMe();
    if (!current) throw new Error("No active session found.");
    const updated: AuthUser = {
      ...current,
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim(),
      profileCompleted: true,
    };
    setPublicSessionCookies(true);
    return updated;
  },

  /** Fetch the currently authenticated user from the server */
  async getMe(): Promise<AuthUser | null> {
    try {
      const data = await apiClient.get<AuthResponse>("/auth/me");
      setPublicSessionCookies(!!data.user.profileCompleted);
      return data.user;
    } catch {
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
