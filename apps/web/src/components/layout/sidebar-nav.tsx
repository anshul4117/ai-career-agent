"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { LogOut, Settings, User } from "lucide-react";
import { NavLink } from "@/components/layout/nav-link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mainNavigation } from "@/config/navigation";
import { mockUser } from "@/features/auth/mock/user";
import { cn } from "@/lib/utils";
import { useAuth } from "@/features/auth";
import { useProfileStore } from "@/features/profile";

interface SidebarNavProps {
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function SidebarNav({ collapsed = false, onNavigate }: SidebarNavProps) {
  const { user, isAuthenticated, logout } = useAuth();

  const activeUser =
    isAuthenticated && user
      ? {
          name:
            user.name ||
            `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
            user.email ||
            "",
          email: user.email,
        }
      : mockUser;

  const userName = activeUser.name || activeUser.email || "User";

  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const profile = useProfileStore((state) => state.profile);
  const loadProfile = useProfileStore((state) => state.loadProfile);

  useEffect(() => {
    if (!useProfileStore.getState().profile) {
      loadProfile().catch(() => {});
    }
  }, [loadProfile]);

  const avatarUrl =
    profile?.avatar?.url ||
    user?.profileImage ||
    (user as { avatarUrl?: string })?.avatarUrl ||
    null;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-3"
        aria-label="Dashboard"
      >
        {mainNavigation.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div className="border-t-[3px] border-border p-3">
        <UserProfile
          collapsed={collapsed}
          name={userName}
          email={activeUser.email}
          initials={initials}
          avatarUrl={avatarUrl}
          signOut={logout}
        />
      </div>
    </div>
  );
}

function UserProfile({
  collapsed,
  name,
  email,
  initials,
  avatarUrl,
  signOut,
}: {
  collapsed: boolean;
  name: string;
  email: string;
  initials: string;
  avatarUrl?: string | null;
  signOut: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex w-full items-center gap-3 rounded-md p-2 text-left transition-colors hover:bg-surface-secondary",
            collapsed && "justify-center",
          )}
          aria-label="User menu"
        >
          <Avatar className="h-9 w-9 border-2 border-border brutal-shadow-xs shrink-0">
            {avatarUrl && (
              <AvatarImage
                src={avatarUrl}
                alt={name}
                className="object-cover"
              />
            )}
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">{name}</p>
              <p className="truncate text-xs text-foreground-muted">{email}</p>
            </div>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={collapsed ? "center" : "end"}
        side="top"
        className="w-56"
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile">
            <User className="mr-2 h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="mr-2 h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <button
            type="button"
            className="flex w-full items-center"
            onClick={() => signOut()}
          >
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
