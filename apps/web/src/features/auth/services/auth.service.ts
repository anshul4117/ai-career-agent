import type { AuthUser } from "../types/auth.types";
import { useAuthStore } from "../store/auth.store";

export const authService = {
  async login(email: string, password: string): Promise<AuthUser> {
    // TODO: Connect with Clerk sign-in backend APIs in Sprint 7
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: AuthUser = {
          id: "usr_mock123",
          email,
          firstName: "Demo",
          lastName: "User",
          name: "Demo User",
          profileImage: "",
          createdAt: new Date().toISOString(),
        };
        useAuthStore.getState().login(mockUser);
        resolve(mockUser);
      }, 800);
    });
  },

  async register(email: string, password: string): Promise<AuthUser> {
    // TODO: Connect with Clerk sign-up backend APIs in Sprint 7
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: AuthUser = {
          id: "usr_mock123",
          email,
          firstName: "Demo",
          lastName: "User",
          name: "Demo User",
          profileImage: "",
          createdAt: new Date().toISOString(),
        };
        useAuthStore.getState().login(mockUser);
        resolve(mockUser);
      }, 800);
    });
  },

  async forgotPassword(email: string): Promise<void> {
    // TODO: Call Clerk password recovery / reset code email trigger in Sprint 7
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  async resetPassword(password: string, token: string): Promise<void> {
    // TODO: Call Clerk password reset verification with token in Sprint 7
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  async verifyEmail(code: string): Promise<void> {
    // TODO: Call Clerk email verification APIs with OTP code in Sprint 7
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 800);
    });
  },

  async logout(): Promise<void> {
    // TODO: Terminate Clerk session in Sprint 7
    useAuthStore.getState().logout();
    return Promise.resolve();
  },
};
export type AuthService = typeof authService;
