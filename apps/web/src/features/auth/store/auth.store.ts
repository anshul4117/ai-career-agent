import { create } from "zustand";
import type { AuthUser } from "../types/auth.types";

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start loading to check session on mount

  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setIsLoading: (isLoading) => set({ isLoading }),
  reset: () => set({ user: null, isAuthenticated: false, isLoading: false }),
}));

export function resetAuthStore() {
  useAuthStore.getState().reset();
}
