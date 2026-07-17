"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useOnboardingStore } from "../store/onboarding.store";
import dynamic from "next/dynamic";

const WelcomeModal = dynamic(
  () => import("./welcome-modal").then((m) => m.WelcomeModal),
  { ssr: false }
);

const TourOverlay = dynamic(
  () => import("./tour-overlay").then((m) => m.TourOverlay),
  { ssr: false }
);

export function DashboardOnboarding() {
  const { isAuthenticated } = useAuth();
  const { isTourActive, hasCompletedOnboarding, setIsWelcomeOpen } = useOnboardingStore();

  useEffect(() => {
    if (isAuthenticated && !hasCompletedOnboarding) {
      setIsWelcomeOpen(true);
    }
  }, [isAuthenticated, hasCompletedOnboarding, setIsWelcomeOpen]);

  if (!isAuthenticated) return null;

  return (
    <>
      {!hasCompletedOnboarding && <WelcomeModal />}
      {isTourActive && <TourOverlay />}
    </>
  );
}

export default DashboardOnboarding;
