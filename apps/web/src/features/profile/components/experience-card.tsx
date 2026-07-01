"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { Briefcase } from "lucide-react";
import type { Experience } from "../types/experience.types";

interface ExperienceCardProps {
  experience: Experience[];
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
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
                  {getYear(exp.startDate)} – {getYear(exp.endDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
