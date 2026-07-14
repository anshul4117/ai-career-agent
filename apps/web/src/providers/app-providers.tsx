"use client";

import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
    </ThemeProvider>
  );
}
