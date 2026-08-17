"use client";

import React, { useEffect } from "react";
import { useAuth } from "@/features/auth";
import { useOnboardingStore } from "../store/onboarding.store";
import dynamic from "next/dynamic";

const WelcomeModal = dynamic(
  () => import("./welcome-modal").then((m) => m.WelcomeModal),
  { ssr: false },
);

const TourOverlay = dynamic(
  () => import("./tour-overlay").then((m) => m.TourOverlay),
  { ssr: false },
);

export function DashboardOnboarding() {
  const { isAuthenticated, user } = useAuth();
  const {
    isTourActive,
    hasCompletedTour,
    setIsWelcomeOpen,
    setHasCompletedTour,
  } = useOnboardingStore();

  useEffect(() => {
    if (isAuthenticated && user?.profileCompleted) {
      if (!hasCompletedTour) {
        setHasCompletedTour(true);
      }
      return;
    }

    if (isAuthenticated && !hasCompletedTour) {
      setIsWelcomeOpen(true);
    }
  }, [
    isAuthenticated,
    user,
    hasCompletedTour,
    setIsWelcomeOpen,
    setHasCompletedTour,
  ]);

  if (!isAuthenticated) return null;

  return (
    <>
      {!hasCompletedTour && <WelcomeModal />}
      {isTourActive && <TourOverlay />}
    </>
  );
}

export default DashboardOnboarding;
