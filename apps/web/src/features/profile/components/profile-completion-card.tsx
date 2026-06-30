"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
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
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Circular Progress */}
        <div className="flex items-center justify-center shrink-0" aria-label={`Profile ${completion.percentage}% complete`}>
          <svg width="100" height="100" viewBox="0 0 100 100" className="transform -rotate-90">
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
          <span className="absolute text-xl font-black text-foreground">{completion.percentage}%</span>
        </div>

        {/* Section List */}
        <div className="flex-1 min-w-0 space-y-3">
          <div className="space-y-1">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight">
              Profile Completion
            </Heading>
            <Text className="text-foreground-secondary text-xs">
              {completedCount} of {totalCount} sections completed
            </Text>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {completion.sections.map((section) => (
              <div key={section.id} className="flex items-center gap-1.5 text-xs">
                {section.completed ? (
                  <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" aria-hidden="true" />
                ) : (
                  <Circle className="h-3.5 w-3.5 text-foreground-muted shrink-0" aria-hidden="true" />
                )}
                <span className={section.completed ? "text-foreground-secondary" : "text-foreground-muted"}>
                  {section.label}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2">
            <BrutalButton asChild variant="secondary" className="h-9 px-4 uppercase font-bold text-[10px] tracking-wider">
              <Link href="/profile/review">
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
