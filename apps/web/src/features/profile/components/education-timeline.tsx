"use client";

import React from "react";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { GraduationCap, Plus } from "lucide-react";
import { EducationItem } from "./education-item";
import type { Education } from "../types/education.types";

interface EducationTimelineProps {
  education: Education[];
  onEdit: (edu: Education) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export function EducationTimeline({
  education,
  onEdit,
  onDelete,
  onAddClick,
}: EducationTimelineProps) {
  if (education.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
        <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <GraduationCap className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight">
            No Education Added Yet
          </Heading>
          <Text className="text-foreground-secondary text-xs leading-relaxed">
            Record academic qualifications and degrees to build a professional career timeline.
          </Text>
        </div>
        <BrutalButton
          onClick={onAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Education History
        </BrutalButton>
      </div>
    );
  }

  // Sort education by start date descending
  const sortedEdu = [...education].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  return (
    <div className="relative pl-6 border-l-[3px] border-border space-y-6 ml-3 py-2">
      {sortedEdu.map((edu) => (
        <div key={edu.id} className="relative">
          {/* Timeline node node indicator */}
          <div className="absolute -left-[37px] top-1.5 h-6 w-6 rounded-full border-2 border-border bg-surface flex items-center justify-center brutal-shadow-sm select-none">
            <GraduationCap className="h-3 w-3 text-foreground" />
          </div>
          <EducationItem
            edu={edu}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
