"use client";

import Link from "next/link";
import { Bell, Menu, PanelLeft, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { mockUser } from "@/features/auth/mock/user";
import { useAuth } from "@/features/auth";
import { useUiStore } from "@/store";

export function Header() {
  const { toggleSidebar, toggleSidebarCollapsed, searchQuery, setSearchQuery } =
    useUiStore();
  const { user, isAuthenticated } = useAuth();
  const activeUser = isAuthenticated && user ? {
    name: user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "",
    email: user.email,
  } : mockUser;
  const userName = activeUser.name || activeUser.email || "User";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-[var(--spacing-header)] items-center gap-3 border-b-[3px] border-border bg-surface px-4 lg:gap-4 lg:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleSidebar}
        aria-label="Open sidebar menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex"
        onClick={toggleSidebarCollapsed}
        aria-label="Toggle sidebar collapse"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-lg">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder="Search jobs, companies..."
          className="pl-10"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search jobs and companies"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Search">
          <Search className="h-5 w-5" />
        </Button>

        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        <Link
          href="/settings"
          className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-surface-secondary"
          aria-label="Go to settings"
        >
          <Avatar className="h-9 w-9">
            <AvatarFallback className="text-xs">{initials}</AvatarFallback>
          </Avatar>
          <span className="hidden max-w-[120px] truncate text-sm font-semibold lg:inline">
            {userName}
          </span>
        </Link>
      </div>
    </header>
  );
}
