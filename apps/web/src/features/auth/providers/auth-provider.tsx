"use client";

import * as React from "react";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  // TODO: Wrap with ClerkProvider and synchronize auth states in Sprint 7
  return <>{children}</>;
}
