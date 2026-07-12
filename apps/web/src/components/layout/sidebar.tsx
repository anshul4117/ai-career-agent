"use client";

import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const {
    sidebarOpen,
    sidebarCollapsed,
    setSidebarOpen,
    toggleSidebarCollapsed,
  } = useUiStore();

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            type="button"
            className="fixed inset-0 z-40 bg-foreground/30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close navigation menu"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-full flex-col border-r-[3px] border-border bg-surface transition-all duration-200",
          sidebarCollapsed ? "w-[72px]" : "w-[var(--spacing-sidebar)]",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0",
          className,
        )}
        aria-label="Main navigation"
      >
        <SidebarHeader
          collapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
        />

        <SidebarNav collapsed={sidebarCollapsed} onNavigate={() => setSidebarOpen(false)} />

        <SidebarCollapseToggle
          collapsed={sidebarCollapsed}
          onToggle={toggleSidebarCollapsed}
        />
      </aside>
    </>
  );
}

function SidebarHeader({
  collapsed,
  onClose,
}: {
  collapsed: boolean;
  onClose: () => void;
}) {
  return (
    <div
      className={cn(
        "flex h-[var(--spacing-header)] shrink-0 items-center border-b-[3px] border-border",
        collapsed ? "justify-center px-2" : "justify-between px-4",
      )}
    >
      {!collapsed ? (
        <Logo />
      ) : (
        <Logo iconOnly />
      )}

      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onClose}
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
}

function SidebarCollapseToggle({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="hidden border-t-[3px] border-border p-3 lg:block">
      <Button
        variant="ghost"
        size={collapsed ? "icon" : "default"}
        className={cn("w-full", !collapsed && "justify-start")}
        onClick={onToggle}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? (
          <ChevronRight className="h-5 w-5" />
        ) : (
          <>
            <ChevronLeft className="h-5 w-5" />
            <span>Collapse</span>
          </>
        )}
      </Button>
    </div>
  );
}
