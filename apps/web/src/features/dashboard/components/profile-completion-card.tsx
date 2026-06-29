"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { User, CheckCircle2, AlertCircle } from "lucide-react";

export function ProfileCompletionCard() {
  const profileScore = 72;

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 flex flex-col justify-between space-y-6 brutal-shadow">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Heading level="h4" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Profile Readiness
            </Heading>
            <Text className="text-foreground-secondary text-xs">
              Matches require comprehensive profiles.
            </Text>
          </div>
          <span className="px-2 py-1 border-2 border-border text-xs font-black uppercase bg-primary text-white brutal-shadow-sm">
            {profileScore}% Ready
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full border-[3px] border-border bg-surface-secondary overflow-hidden rounded-sm p-[2px]">
            <div 
              className="h-full bg-primary border-r-2 border-border" 
              style={{ width: `${profileScore}%` }}
            />
          </div>
        </div>

        {/* Sections Audit */}
        <div className="space-y-2 pt-2 border-t-2 border-border/10 pt-4">
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Finished: Basic Info, Headline, Target Role</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <AlertCircle className="h-4 w-4 text-warning shrink-0" />
            <span>Missing: Skill tags verification, Social Links</span>
          </div>
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
