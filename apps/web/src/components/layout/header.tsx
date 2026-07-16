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
  DropdownMenuSeparator 
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
    <header className="sticky top-0 z-30 flex h-[var(--spacing-header)] items-center gap-3 border-b-[3px] border-border bg-surface px-4 md:px-6 lg:px-8">
      <Logo href="/dashboard" className="lg:hidden" />

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
          id="header-search-bar"
          type="search"
          placeholder="Search jobs... (Cmd+K)"
          className="pl-10"
          value={globalQuery}
          onClick={() => setIsOpen(true)}
          onChange={(e) => {
            setGlobalQuery(e.target.value);
            setIsOpen(true);
          }}
          aria-label="Search jobs and companies"
        />
      </div>

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        <Button variant="ghost" size="icon" aria-label="Notifications" asChild>
          <Link href="/dashboard/notifications">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Link>
        </Button>

        {/* Help Menu Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Help & Resources">
              <HelpCircle className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 text-xs font-semibold select-none">
            <DropdownMenuLabel>Help & Resources</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {
              useOnboardingStore.getState().resetTour();
              toast.success("Guided product tour restarted!");
            }}>
              Restart Tour
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowShortcuts(true)}>
              Keyboard Shortcuts
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => toast.info("Mock Link: Redirecting to documentation wiki...")}>
              Documentation
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.info("Mock Action: Loading developer support ticket desk...")}>
              Contact Support
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

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
                        <span className="text-foreground-secondary">Global Search</span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">⌘ K / Ctrl K</kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">Close Modals / Exit Search</span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">ESC</kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">Navigate Dropdowns / Lists</span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">↑ / ↓</kbd>
                      </div>
                      <div className="flex items-center justify-between py-1 border-b border-border/5">
                        <span className="text-foreground-secondary">Select Active Item</span>
                        <kbd className="bg-surface-secondary border border-border/20 rounded-sm px-1.5 py-0.5 text-[9px] font-bold font-mono">Enter</kbd>
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
