"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading } from "@/components/ui/typography";
import {
  Pencil,
  Code2,
  Briefcase,
  FileText,
  LayoutDashboard,
  Zap,
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Edit Profile", href: "/profile/edit", icon: Pencil },
  { label: "Manage Skills", href: "/profile/skills", icon: Code2 },
  { label: "Add Experience", href: "/profile/experience", icon: Briefcase },
  { label: "Preview Profile", href: "/profile/preview", icon: FileText },
  { label: "View Applications", href: "/applications", icon: LayoutDashboard },
];

export function QuickActionsCard() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" aria-hidden="true" />
          Quick Actions
        </Heading>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_ACTIONS.map((action) => {
            const Icon = action.icon;
            return (
              <BrutalButton
                key={action.href}
                asChild
                variant="secondary"
                className="h-10 justify-start gap-2 px-4 uppercase font-bold text-[10px] tracking-wider w-full"
              >
                <Link href={action.href}>
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {action.label}
                </Link>
              </BrutalButton>
            );
          })}
        </div>
      </div>
    </BrutalCard>
  );
}
