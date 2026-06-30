"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { User, CheckCircle2, AlertCircle } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";

export function ProfileCompletionCard() {
  const { profile, loadProfile } = useProfileStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const percentage = profile?.completion?.percentage ?? 0;
  const completedSections = profile?.completion?.sections.filter((s) => s.completed) ?? [];
  const missingSections = profile?.completion?.sections.filter((s) => !s.completed) ?? [];

  const finishedText = completedSections.length > 0
    ? `Finished: ${completedSections.slice(0, 3).map((s) => s.label).join(", ")}${completedSections.length > 3 ? "..." : ""}`
    : "No sections completed yet";

  const missingText = missingSections.length > 0
    ? `Missing: ${missingSections.slice(0, 2).map((s) => s.label).join(", ")}${missingSections.length > 2 ? "..." : ""}`
    : "All sections completed!";

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 flex flex-col justify-between space-y-6 brutal-shadow h-full w-full min-w-0">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Heading level="h4" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
              Profile Readiness
            </Heading>
            <Text className="text-foreground-secondary text-xs">
              Matches require comprehensive profiles.
            </Text>
          </div>
          <span className="px-2 py-1 border-2 border-border text-xs font-black uppercase bg-primary text-white brutal-shadow-sm shrink-0">
            {percentage}% Ready
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full border-[3px] border-border bg-surface-secondary overflow-hidden rounded-sm p-[2px]">
            <div 
              className="h-full bg-primary border-r-2 border-border transition-all duration-500" 
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {/* Sections Audit */}
        <div className="space-y-2 pt-2 border-t-2 border-border/10 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" aria-hidden="true" />
            <span className="truncate">{finishedText}</span>
          </div>
          {missingSections.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
              <AlertCircle className="h-4 w-4 text-warning shrink-0" aria-hidden="true" />
              <span className="truncate">{missingText}</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <BrutalButton asChild variant="secondary" className="w-full h-11 uppercase font-bold text-xs tracking-wider">
          <Link href="/profile">Complete Profile</Link>
        </BrutalButton>
      </div>
    </BrutalCard>
  );
}
