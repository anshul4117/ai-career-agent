"use client";

import React from "react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(
  () => import("@/features/search").then((m) => m.CommandPalette),
  { ssr: false }
);

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
      <CommandPalette />
    </ThemeProvider>
  );
}
