"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import type { AuthUser } from "../types/auth.types";
import { authService } from "../services/auth.service";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  registerWithGoogle: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string, token: string) => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sync state on load
  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const authUser = await authService.login(email, password);
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      const authUser = await authService.loginWithGoogle();
      setUser(authUser);
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authService.register(email, password);
    } finally {
      setIsLoading(false);
    }
  };

  const registerWithGoogle = async () => {
    setIsLoading(true);
    try {
      const authUser = await authService.registerWithGoogle();
      setUser(authUser);
      if (typeof window !== "undefined") {
        window.location.href = "/dashboard";
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyEmail = async (code: string) => {
    setIsLoading(true);
    try {
      const authUser = await authService.verifyEmail(code);
      setUser(authUser);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (password: string, token: string) => {
    setIsLoading(true);
    try {
      await authService.resetPassword(password, token);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    loginWithGoogle,
    registerWithGoogle,
    forgotPassword,
    resetPassword,
    verifyEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
