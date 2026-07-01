"use client";

import { useAuthStore } from "@/features/auth/store/auth.store";
import { mockUser } from "@/features/auth/mock/user";

export { useAuthStore };

/** Demo helper — seeds mock user for UI development */
export function useDemoAuth() {
  const { setUser, isAuthenticated } = useAuthStore();
  return {
    isAuthenticated,
    enableDemo: () => setUser(mockUser),
  };
}
export type { AuthState } from "@/features/auth/store/auth.store";
