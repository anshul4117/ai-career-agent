"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { Code2, Briefcase, FolderOpen, GraduationCap, BarChart3 } from "lucide-react";
import type { ProfileStats } from "../types/profile.types";

interface QuickStatsCardProps {
  stats: ProfileStats;
}

const STAT_ITEMS = [
  { key: "skillsCount" as const, label: "Skills", icon: Code2 },
  { key: "experienceCount" as const, label: "Experience", icon: Briefcase },
  { key: "projectsCount" as const, label: "Projects", icon: FolderOpen },
  { key: "educationCount" as const, label: "Education", icon: GraduationCap },
];

export function QuickStatsCard({ stats }: QuickStatsCardProps) {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
          Quick Statistics
        </Heading>

        <div className="grid grid-cols-2 gap-4">
          {STAT_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.key}
                className="border-2 border-border bg-surface-secondary p-4 space-y-1 brutal-shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
                  <span className="text-[10px] uppercase font-bold text-foreground-muted tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-2xl font-black text-foreground">{stats[item.key]}</p>
              </div>
            );
          })}
        </div>
      </div>
    </BrutalCard>
  );
}
