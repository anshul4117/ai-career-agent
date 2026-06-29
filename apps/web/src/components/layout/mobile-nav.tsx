"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  LayoutDashboard,
  User,
  Menu,
} from "lucide-react";
import { isNavItemActive } from "@/components/layout/nav-link";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/store";

const mobileNavItems = [
  { title: "Home", href: "/dashboard", icon: LayoutDashboard },
  { title: "Jobs", href: "/jobs", icon: Briefcase },
  { title: "Apps", href: "/applications", icon: FileText },
  { title: "Profile", href: "/profile", icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();
  const { setSidebarOpen } = useUiStore();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t-[3px] border-border bg-surface lg:hidden"
      aria-label="Mobile navigation"
    >
      <ul className="grid grid-cols-5" role="list">
        {mobileNavItems.map((item) => {
          const isActive = isNavItemActive(pathname, item.href);
          const Icon = item.icon;
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-wide transition-colors",
                  isActive ? "bg-foreground text-surface" : "text-foreground-secondary",
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.title}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="flex w-full flex-col items-center gap-1 px-2 py-3 text-[10px] font-semibold uppercase tracking-wide text-foreground-secondary transition-colors hover:bg-surface-secondary"
            aria-label="Open full menu"
          >
            <Menu className="h-5 w-5" aria-hidden="true" />
            <span>Menu</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
