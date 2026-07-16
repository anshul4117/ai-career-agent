"use client";

import React, { useEffect } from "react";
import type { ReactNode } from "react";
import { AuthProvider } from "@/features/auth";
import { ThemeProvider } from "./theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { CommandPalette } from "@/features/search";
import { WelcomeModal } from "@/features/onboarding/components/welcome-modal";
import { TourOverlay } from "@/features/onboarding/components/tour-overlay";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding.store";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  useEffect(() => {
    const store = useOnboardingStore.getState();
    if (!store.hasCompletedOnboarding) {
      store.setIsWelcomeOpen(true);
    }
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
      <Toaster />
      <CommandPalette />
      <WelcomeModal />
      <TourOverlay />
    </ThemeProvider>
  );
}
