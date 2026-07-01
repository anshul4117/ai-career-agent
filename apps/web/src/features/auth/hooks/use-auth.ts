"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth.store";
import { authService } from "../services/auth.service";

export function useAuth() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, setUser, setIsLoading, reset } = useAuthStore();

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authUser = await authService.login(email, password);
      setUser(authUser);
      if (authUser.profileCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/complete-profile");
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setIsLoading]);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = await authService.loginWithGoogle();
      setUser(authUser);
      if (authUser.profileCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/complete-profile");
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setIsLoading]);

  const register = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.register(email, password);
      router.replace("/verify-email");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setIsLoading]);

  const registerWithGoogle = useCallback(async () => {
    setIsLoading(true);
    try {
      const authUser = await authService.registerWithGoogle();
      setUser(authUser);
      if (authUser.profileCompleted) {
        router.replace("/dashboard");
      } else {
        router.replace("/complete-profile");
      }
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setIsLoading]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      reset();
      router.replace("/login");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, reset, setIsLoading]);

  const verifyEmail = useCallback(async (code: string) => {
    setIsLoading(true);
    try {
      const authUser = await authService.verifyEmail(code);
      setUser(authUser);
      // Wait 1.5 seconds to let the UI show the success state
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.replace("/complete-profile");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setIsLoading]);

  const completeProfile = useCallback(async (data: {
    firstName: string;
    lastName: string;
    headline: string;
    preferredRole: string;
    preferredLocation: string;
  }) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.completeProfile(data);
      setUser(updatedUser);
      router.replace("/dashboard");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setIsLoading]);

  const forgotPassword = useCallback(async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      router.replace("/reset-password");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setIsLoading]);

  const resetPassword = useCallback(async (password: string, token: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(password, token);
      router.replace("/login");
    } catch (err) {
      setIsLoading(false);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [router, setIsLoading]);

  const restoreSession = useCallback(() => {
    try {
      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      if (!currentUser) {
        if (typeof document !== "undefined") {
          document.cookie = "aca-session=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=0;SameSite=Lax";
        }
      }
    } catch {
      setUser(null);
      if (typeof document !== "undefined") {
        document.cookie = "aca-session=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=0;SameSite=Lax";
      }
    } finally {
      setIsLoading(false);
    }
  }, [setUser, setIsLoading]);

  return {
    user,
    isAuthenticated,
    isLoading,
    isLoaded: !isLoading,
    login,
    loginWithGoogle,
    register,
    registerWithGoogle,
    logout,
    verifyEmail,
    completeProfile,
    forgotPassword,
    resetPassword,
    restoreSession,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
export default useAuth;
