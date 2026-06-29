"use client";

import { usePathname } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { AuthGuard, GuestGuard } from "@/features/auth";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isOnboarding = pathname === "/complete-profile";

  return (
    <AuthLayout>
      {isOnboarding ? (
        <AuthGuard>{children}</AuthGuard>
      ) : (
        <GuestGuard>{children}</GuestGuard>
      )}
    </AuthLayout>
  );
}
