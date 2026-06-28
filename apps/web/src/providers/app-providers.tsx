"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
