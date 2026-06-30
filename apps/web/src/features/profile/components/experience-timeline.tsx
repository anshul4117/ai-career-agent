"use client";

import React from "react";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Briefcase, Plus } from "lucide-react";
import { ExperienceItem } from "./experience-item";
import type { Experience } from "../types/experience.types";

interface ExperienceTimelineProps {
  experience: Experience[];
  onEdit: (exp: Experience) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export function ExperienceTimeline({
  experience,
  onEdit,
  onDelete,
  onAddClick,
}: ExperienceTimelineProps) {
  if (experience.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
        <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <Briefcase className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight">
            No Experience Added Yet
          </Heading>
          <Text className="text-foreground-secondary text-xs leading-relaxed">
            Add your professional work history, internships, and contract roles to complete your candidate profile.
          </Text>
        </div>
        <BrutalButton
          onClick={onAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Your First Professional Experience
        </BrutalButton>
      </div>
    );
  }

  // Sort experience by start date descending
  const sortedExp = [...experience].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="relative pl-6 border-l-[3px] border-border space-y-6 ml-3 py-2">
      {sortedExp.map((exp) => (
        <div key={exp.id} className="relative">
          {/* Timeline node node indicator */}
          <div className="absolute -left-[37px] top-1.5 h-6 w-6 rounded-full border-2 border-border bg-surface flex items-center justify-center brutal-shadow-sm select-none">
            <Briefcase className="h-3 w-3 text-foreground" />
          </div>
          <ExperienceItem
            exp={exp}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
