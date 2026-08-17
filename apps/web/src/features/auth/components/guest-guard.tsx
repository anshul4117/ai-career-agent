"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../hooks/use-auth";
import { LoadingScreen } from "@/components/ui/brand-loader";

interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user && !user.profileCompleted) {
        router.replace("/complete-profile");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading || isAuthenticated) {
    return <LoadingScreen label="Verifying access session..." />;
  }

  return <>{children}</>;
}
export default GuestGuard;
