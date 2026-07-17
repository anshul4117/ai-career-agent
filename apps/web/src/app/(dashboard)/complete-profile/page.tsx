"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Check, X, ArrowRight, ArrowLeft } from "lucide-react";
import { PageLoader } from "@/components/ui/brand-loader";

export default function CompleteProfileChecklist() {
  const {
    profile,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    socialLinks,
    preferences,
    isLoading,
    loadProfile,
  } = useProfileStore();

  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading || !profile) {
    return <PageLoader label="Loading profile checklist..." />;
  }

  const audit = calculateProfileCompletion(
    profile,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    socialLinks,
    preferences
  );

  const isComplete = audit.percentage === 100;

  // Map checklist items to display order and custom icons/styling
  const checklistItems = audit.checklist;

  return (
    <div className="space-y-6 w-full max-w-3xl min-w-0 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/profile"
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile Overview
        </Link>
        <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          Profile Onboarding Checklist
        </Heading>
        <Text className="text-foreground-secondary text-xs">
          Complete all sections to achieve a 100% profile strength. Fully completed profiles are 5x more likely to match recruiters search queries.
        </Text>
      </div>

      {/* Profile Completion Indicator */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow flex flex-col md:flex-row gap-6 items-center">
        <div className="relative shrink-0 flex items-center justify-center animate-pulse-subtle" aria-label={`Profile ${audit.percentage}% complete`}>
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-secondary)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-success)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 - (audit.percentage / 100) * 2 * Math.PI * 40}
              strokeLinecap="square"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute text-2xl font-black text-foreground">{audit.percentage}%</span>
        </div>

        <div className="flex-1 space-y-2 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
            <Heading level="h3" className="text-lg font-black uppercase">
              Onboarding Progress
            </Heading>
            <span className={`px-2 py-0.5 border-2 border-border text-[9px] font-black uppercase rounded-sm brutal-shadow-sm ${
              isComplete ? "bg-success text-white" : "bg-warning text-foreground"
            }`}>
              {isComplete ? "Profile Completed" : "In Progress"}
            </span>
          </div>
          <Text className="text-foreground-secondary text-xs">
            {isComplete
              ? "Congratulations! Your profile is 100% complete and fully optimized for recruiter searches."
              : `You are only ${100 - audit.percentage}% away from completing your onboarding profile.`}
          </Text>
        </div>
      </BrutalCard>

      {/* Completion Dashboard Card */}
      {isComplete ? (
        <BrutalCard className="bg-success-secondary border-[3px] border-success-secondary p-8 text-center space-y-4 brutal-shadow animate-bounce-short">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full border-4 border-foreground bg-success text-white brutal-shadow-sm mb-2">
            <Check className="h-8 w-8 stroke-[3]" />
          </div>
          <div className="space-y-1">
            <Heading level="h3" className="text-xl font-black uppercase text-foreground">
              Profile Complete!
            </Heading>
            <Text className="text-foreground-secondary text-sm max-w-md mx-auto">
              {"Your credentials, work history, and settings have been locked in. You're ready to get matched by the AI Career Copilot."}
            </Text>
          </div>
          <div className="pt-2">
            <BrutalButton
              onClick={() => router.push("/dashboard")}
              className="h-11 px-8 uppercase font-bold text-xs tracking-wider"
            >
              Continue to Dashboard
              <ArrowRight className="h-4 w-4 ml-2 inline" />
            </BrutalButton>
          </div>
        </BrutalCard>
      ) : (
        <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
          <div className="space-y-4">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight pb-2 border-b-2 border-border/10">
              Profile Checklist
            </Heading>

            <div className="divide-y-2 divide-border/5">
              {checklistItems.map((item) => {
                const completed = item.completed;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex gap-3 items-start">
                      <div className={`mt-0.5 shrink-0 flex items-center justify-center h-5 w-5 border-2 border-border rounded-sm brutal-shadow-sm ${
                        completed ? "bg-success text-white" : "bg-error text-white"
                      }`}>
                        {completed ? <Check className="h-3 w-3 stroke-[3]" /> : <X className="h-3 w-3 stroke-[3]" />}
                      </div>
                      <div className="space-y-0.5">
                        <span className={`text-xs font-black uppercase tracking-wider ${
                          completed ? "text-success line-through" : "text-foreground"
                        }`}>
                          {item.label}
                        </span>
                        <Text className="text-foreground-secondary text-[11px] leading-snug">
                          {item.suggestion}
                        </Text>
                      </div>
                    </div>

                    <div className="shrink-0 self-end sm:self-center">
                      {completed ? (
                        <span className="text-[10px] font-black uppercase tracking-wider text-success/80 border-2 border-success/30 px-3 py-1 rounded-sm bg-success/5 select-none">
                          Completed (+{item.weight}%)
                        </span>
                      ) : (
                        <BrutalButton
                          onClick={() => router.push(`/profile/edit?from=onboarding#${item.id}`)}
                          className="h-8 px-4 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                        >
                          Complete Now
                          <ArrowRight className="h-3 w-3" />
                        </BrutalButton>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </BrutalCard>
      )}
    </div>
  );
}
