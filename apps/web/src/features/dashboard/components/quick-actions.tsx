"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { 
  User, 
  FilePlus, 
  Briefcase, 
  LayoutDashboard, 
  Sparkles, 
  Mail 
} from "lucide-react";

interface ActionItem {
  title: string;
  desc: string;
  href: string;
  btnLabel: string;
  icon: React.ComponentType<any>;
}

const QUICK_ACTIONS: ActionItem[] = [
  {
    title: "Complete Profile",
    desc: "Update your target role, coordinates, and skills settings.",
    href: "/profile",
    btnLabel: "Go to Profile",
    icon: User,
  },
  {
    title: "Create Resume",
    desc: "Build a parsed and targeted resume draft in seconds.",
    href: "/resume/new",
    btnLabel: "Create Draft",
    icon: FilePlus,
  },
  {
    title: "Browse Jobs",
    desc: "Review high-match opportunities indexed from verified portals.",
    href: "/jobs",
    btnLabel: "Find Jobs",
    icon: Briefcase,
  },
  {
    title: "Track Applications",
    desc: "Drag-and-drop job cards to monitor interviews and offers.",
    href: "/applications",
    btnLabel: "View Tracker",
    icon: LayoutDashboard,
  },
  {
    title: "AI Resume Review",
    desc: "Run parsing analysis checks and calculate ATS score alignments.",
    href: "/resume",
    btnLabel: "Optimize Resume",
    icon: Sparkles,
  },
  {
    title: "Generate Cover Letter",
    desc: "Draft custom cover letters tailored to targeted descriptions.",
    href: "/cover-letters",
    btnLabel: "Create Letter",
    icon: Mail,
  },
];

export function QuickActions() {
  return (
    <div className="space-y-4 w-full min-w-0">
      <Heading level="h3" className="text-xl font-black uppercase tracking-tight">
        Quick Shortcuts
      </Heading>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {QUICK_ACTIONS.map((action, index) => {
          const Icon = action.icon;
          return (
            <BrutalCard
              key={index}
              className="bg-surface border-[3px] border-border p-5 flex flex-col justify-between space-y-4 brutal-shadow transition-transform duration-150 hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover"
            >
              <div className="space-y-2">
                <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <Heading level="h4" className="text-base font-bold uppercase tracking-tight">
                  {action.title}
                </Heading>
                <Text className="text-foreground-secondary text-xs leading-relaxed">
                  {action.desc}
                </Text>
              </div>

              <div className="pt-2">
                <BrutalButton asChild variant="secondary" className="w-full h-10 uppercase font-bold text-xs tracking-wider">
                  <Link href={action.href}>{action.btnLabel}</Link>
                </BrutalButton>
              </div>
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
}
