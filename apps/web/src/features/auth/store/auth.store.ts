// Auth store using Zustand with login/logout state
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types/auth.types";

/** Authentication state managed by Zustand (demo only). */
interface AuthState {
  /** Whether a user is considered authenticated (demo flag). */
  isAuthenticated: boolean;
  /** Log in a user (demo – accepts a user object). */
  login: (user: AuthUser) => void;
  /** Log out the current user. */
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      login: (user) => set({ isAuthenticated: true }),
      logout: () => set({ isAuthenticated: false }),
    }),
    {
      name: "aca-auth",
      // No persisted state needed for demo.
      partialize: () => ({}),
    },
  ),
);

/** Optional helper to reset auth store (currently clears demo flag). */
export function resetAuthStore() {
  useAuthStore.setState({ isAuthenticated: false });
}

export type { AuthState };
