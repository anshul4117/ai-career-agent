"use client";

import { usePathname } from "next/navigation";
import { AuthLayout } from "@/features/auth/components/auth-layout";
import { GuestGuard } from "@/features/auth";

export default function AuthGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isGuestOnly =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password";

  return (
    <AuthLayout>
      {isGuestOnly ? <GuestGuard>{children}</GuestGuard> : children}
    </AuthLayout>
  );
}
