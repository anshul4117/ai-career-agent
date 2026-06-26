"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/types";

interface NavLinkProps {
  item: NavItem;
  collapsed?: boolean;
  onNavigate?: () => void;
}

export function isNavItemActive(pathname: string, href: string): boolean {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function NavLink({ item, collapsed = false, onNavigate }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = isNavItemActive(pathname, item.href);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      title={collapsed ? item.title : undefined}
      className={cn(
        "group flex h-12 items-center gap-3 rounded-md text-sm font-semibold transition-colors",
        collapsed ? "justify-center px-0" : "px-4",
        isActive
          ? "bg-foreground text-surface brutal-shadow"
          : "text-foreground hover:bg-surface-secondary",
      )}
      aria-current={isActive ? "page" : undefined}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      {!collapsed && (
        <>
          <span className="truncate">{item.title}</span>
          {item.badge && (
            <span className="ml-auto rounded-md bg-accent px-2 py-0.5 text-xs text-white">
              {item.badge}
            </span>
          )}
        </>
      )}
      {collapsed && <span className="sr-only">{item.title}</span>}
    </Link>
  );
}
