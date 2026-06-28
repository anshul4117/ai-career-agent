"use client";

import { useAuthContext } from "../providers/auth-provider";
import { useRouter } from "next/navigation";

export function useAuth() {
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    registerWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail,
  } = useAuthContext();

  const handleLogout = async () => {
    await logout();
    // Redirect to login page immediately after clearing session
    router.replace("/login");
  };

  return {
    user,
    isLoaded: !isLoading,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout: handleLogout,
    loginWithGoogle,
    registerWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };
}

export type UseAuthReturn = ReturnType<typeof useAuth>;
