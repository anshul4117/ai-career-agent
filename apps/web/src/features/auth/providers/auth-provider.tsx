"use client";

import React, { useEffect } from "react";
import { useAuth } from "../hooks/use-auth";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { restoreSession } = useAuth();

  useEffect(() => {
    // Session restoration on client mount
    restoreSession();
  }, []);

  return <>{children}</>;
}
