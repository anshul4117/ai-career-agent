"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Bell, PanelLeft, Search, HelpCircle, X } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/shared/logo";
import { mockUser } from "@/features/auth/mock/user";
import { useAuth } from "@/features/auth";
import { useUiStore } from "@/store";
import { useSearchStore } from "@/features/search/store/search.store";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding.store";
import { toast } from "sonner";
import * as Dialog from "@radix-ui/react-dialog";
import { BrutalCard } from "@/components/ui/brutal-card";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const [showShortcuts, setShowShortcuts] = useState(false);
  const { toggleSidebarCollapsed } = useUiStore();
  const { globalQuery, setGlobalQuery, setIsOpen } = useSearchStore();
  const { user, isAuthenticated } = useAuth();
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

  return (
    <header className="sticky top-0 z-30 flex h-[var(--spacing-header)] items-center justify-between gap-3 sm:gap-4 border-b-[3px] border-border bg-surface px-4 sm:px-6 lg:px-8 transition-all">
      {/* Mobile Branding Logo */}
      <Logo href="/dashboard" className="lg:hidden shrink-0" />

      {/* Desktop Sidebar Toggle Button */}
      <Button
        variant="ghost"
        size="icon"
        className="hidden lg:inline-flex shrink-0 border border-transparent hover:border-border/30 hover:bg-surface-secondary transition-colors"
        onClick={toggleSidebarCollapsed}
        aria-label="Toggle sidebar collapse"
      >
        <PanelLeft className="h-5 w-5" />
      </Button>

      {/* Search Input Container */}
      <div className="relative hidden min-w-0 flex-1 md:block md:max-w-md lg:max-w-lg">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted"
          aria-hidden="true"
        />
        <Input
          id="header-search-bar"
          type="search"
          placeholder="Search jobs... (Cmd+K)"
          className="pl-10 h-10 border-2 border-border/80 bg-background hover:bg-surface-secondary/50 focus:bg-surface transition-colors font-medium text-sm text-foreground placeholder:text-foreground-muted/70 rounded-md"
          value={globalQuery}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setGlobalQuery(e.target.value);
            setIsOpen(true);
          }}
          aria-label="Search jobs and companies"
        />
      </div>

      {/* Mobile Search Button (< md) */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden shrink-0 border border-transparent hover:border-border/30 hover:bg-surface-secondary transition-colors"
        onClick={() => setIsOpen(true)}
        aria-label="Open search"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Right Actions & User Profile */}
      <div className="ml-auto flex items-center gap-1.5 sm:gap-2 lg:gap-3">
        {/* Notifications Icon Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 shrink-0 border border-transparent hover:border-border/30 hover:bg-surface-secondary transition-colors"
          aria-label="Notifications"
          asChild
        >
          <Link href="/dashboard/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>

        {/* Help Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 shrink-0 border border-transparent hover:border-border/30 hover:bg-surface-secondary transition-colors"
              aria-label="Help & Resources"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 text-xs font-semibold select-none"
          >
            <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                useOnboardingStore.getState().resetTour();
                toast.success("Guided product tour restarted!");
              }}
            >
              Restart Tour
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShortcuts(true)}>
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() =>
                toast.info("Mock Link: Redirecting to documentation wiki...")
              }
            >
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                toast.info(
                  "Mock Action: Loading developer support ticket desk...",
                )
              }
            >
              Contact Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Section */}
        <Link
          href="/settings"
          className="flex items-center gap-2.5 rounded-md px-2 py-1 sm:px-2.5 sm:py-1.5 transition-colors hover:bg-surface-secondary border border-transparent hover:border-border/30 shrink-0"
          aria-label="Go to settings"
        >
          <Avatar className="h-9 w-9 border-2 border-border brutal-shadow-sm shrink-0">
            <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="hidden flex-col lg:flex min-w-0 max-w-[130px]">
            <span className="truncate text-sm font-bold text-foreground leading-tight">
              {userName}
            </span>
            <span className="truncate text-[10px] font-semibold text-foreground-muted uppercase tracking-wider leading-none mt-0.5">
              Account
            </span>
          </div>
        </Link>
      </div>

      {/* Keyboard Shortcuts Dialog Modal */}
      <Dialog.Root open={showShortcuts} onOpenChange={setShowShortcuts}>
        <AnimatePresence>
          {showShortcuts && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  initial={{ opacity: 0, scale: 0.98, y: -20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98, y: -20 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className="fixed left-1/2 top-[20%] z-50 w-full max-w-sm -translate-x-1/2 focus:outline-none px-4 sm:px-0"
                >
                  <BrutalCard className="border-[3px] border-black dark:border-border bg-surface p-6 brutal-shadow-lg rounded-sm flex flex-col space-y-4 select-none text-xs font-semibold">
                    <div className="flex items-center justify-between border-b-2 border-border/10 pb-2">
                      <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                        Keyboard Shortcuts
                      </h3>
                      <Dialog.Close asChild>
                        <button
                          className="text-foreground-muted hover:text-foreground transition-colors p-1"
                          aria-label="Close shortcuts modal"
                        >
                          <X className="h-4 w-4 stroke-[2.5px]" />
                        </button>
                      </Dialog.Close>
                    </div>

                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">
                          Global Search
                        </span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">
                          ⌘ K / Ctrl K
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">
                          Close Modals / Exit Search
                        </span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">
                          ESC
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">
                          Navigate Dropdowns / Lists
                        </span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">
                          ↑ / ↓
                        </kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">
                          Select Active Item
                        </span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">
                          Enter
                        </kbd>
                      </div>
                    </div>
                  </BrutalCard>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </header>
  );
}
