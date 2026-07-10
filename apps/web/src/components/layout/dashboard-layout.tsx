"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const sidebarCollapsed = useUiStore((state) => state.sidebarCollapsed);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-200",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-[var(--spacing-sidebar)]",
        )}
      >
        <Header />
        <main className="flex-1 w-full min-w-0 overflow-x-hidden px-3.5 py-4.5 pb-20 sm:px-5 sm:py-6 sm:pb-24 md:px-6 md:py-8 md:pb-24 lg:px-8 lg:py-8 lg:pb-8">{children}</main>
      </div>

      <MobileNav />
    </div>
  );
}
