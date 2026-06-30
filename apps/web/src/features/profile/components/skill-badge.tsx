"use client";

import React from "react";
import { cn } from "@/lib/utils";
import type { SkillLevel } from "../types/skill.types";

interface SkillBadgeProps {
  level: SkillLevel;
  className?: string;
}

const levelColors: Record<SkillLevel, string> = {
  beginner: "bg-surface-secondary text-foreground-secondary border-border/40",
  intermediate: "bg-info/10 text-info border-info/40",
  advanced: "bg-accent/10 text-accent border-accent/40",
  expert: "bg-success/10 text-success border-success/40",
};

const levelLabels: Record<SkillLevel, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export function SkillBadge({ level, className }: SkillBadgeProps) {
  return (
    <span
      className={cn(
        "text-[10px] font-black uppercase border-2 px-2 py-0.5 rounded-sm brutal-shadow-sm select-none shrink-0",
        levelColors[level],
        className
      )}
    >
      {levelLabels[level]}
    </span>
  );
}
