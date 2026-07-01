"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ArrowRight } from "lucide-react";
import type { ProfileCompletion } from "../types/profile.types";

interface ProfileCompletionCardProps {
  completion: ProfileCompletion;
}

export function ProfileCompletionCard({ completion }: ProfileCompletionCardProps) {
  const completedCount = completion.sections.filter((s) => s.completed).length;
  const totalCount = completion.sections.length;
  const circumference = 2 * Math.PI * 40;
  const offset = circumference - (completion.percentage / 100) * circumference;

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-5 brutal-shadow w-full min-w-0">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Header */}
        <Heading level="h4" className="text-xs font-black uppercase tracking-wider text-foreground-muted self-start">
          Profile Strength
        </Heading>

        {/* Circular Progress */}
        <div className="relative flex items-center justify-center h-24 w-24 shrink-0" aria-label={`Profile ${completion.percentage}% complete`}>
          <svg width="90" height="90" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-secondary)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="square"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute text-lg font-black text-foreground">{completion.percentage}%</span>
        </div>

        <div className="space-y-3 w-full">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase text-success bg-success/15 border border-success px-2 py-0.5 rounded-sm inline-block">
              {completion.percentage === 100 ? "Fully Complete" : "In Progress"}
            </span>
            <Text className="text-foreground-secondary text-xs font-semibold">
              {completedCount} of {totalCount} sections completed
            </Text>
          </div>

          {/* Labeled Section Status Badges */}
          <div className="grid grid-cols-2 gap-1.5 pt-1 text-left w-full">
            {completion.sections.map((section) => (
              <div
                key={section.id}
                className={`flex items-center gap-1 px-2 py-1 border border-border text-[8px] font-black uppercase rounded-sm tracking-wider ${
                  section.completed
                    ? "bg-success/10 text-success border-success/30"
                    : "bg-error/10 text-error border-error/30"
                }`}
              >
                <span className="shrink-0 font-extrabold text-[9px]">
                  {section.completed ? "✔" : "✖"}
                </span>
                <span className="truncate">{section.label}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-border/10 w-full">
            <BrutalButton asChild variant="secondary" className="h-9 w-full uppercase font-bold text-[10px] tracking-wider">
              <Link href="/profile/edit">
                Complete Your Profile
                <ArrowRight className="h-3.5 w-3.5 ml-1.5" />
              </Link>
            </BrutalButton>
          </div>
        </div>
      </div>
    </BrutalCard>
  );
}
