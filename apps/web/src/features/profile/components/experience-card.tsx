"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Briefcase, ArrowRight, Plus } from "lucide-react";
import type { Experience } from "../types/experience.types";

interface ExperienceCardProps {
  experience: Experience[];
  onAddClick: () => void;
}

export function ExperienceCard({ experience, onAddClick }: ExperienceCardProps) {
  // Sort and preview top 2 experience entries
  const previewExp = [...experience]
    .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime())
    .slice(0, 2);

  const getYear = (dateString: string | null) => {
    if (!dateString) return "Present";
    return new Date(dateString).getFullYear().toString();
  };

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
            Work Experience
          </Heading>

          <div className="flex items-center gap-2">
            <BrutalButton
              onClick={onAddClick}
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
              aria-label="Add new experience"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New
            </BrutalButton>
            <BrutalButton
              asChild
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <Link href="/profile/experience" aria-label="View all experience entries">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </BrutalButton>
          </div>
        </div>

        {/* List Preview */}
        {experience.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No professional experience added yet. Add experience details.
            </Text>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {previewExp.map((exp) => (
              <div
                key={exp.id}
                className="flex items-start justify-between gap-4 border-b-2 border-border/10 pb-3 last:border-none last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
                    {exp.jobTitle}
                  </p>
                  <p className="text-xs text-foreground-secondary truncate font-medium">
                    {exp.companyName} • {exp.location}
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold text-primary shrink-0 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm">
                  {getYear(exp.startDate)} – {exp.currentPosition ? "Present" : getYear(exp.endDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
