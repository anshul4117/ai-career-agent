"use client";

import React from "react";
import { GraduationCap, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import type { Education } from "../types/education.types";

interface EducationItemProps {
  edu: Education;
  onEdit: (edu: Education) => void;
  onDelete: (id: string) => void;
}

export function EducationItem({ edu, onEdit, onDelete }: EducationItemProps) {
  // Format date helper: "Aug 2020" or "Present"
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const startFormatted = formatDate(edu.startDate);
  const endFormatted = edu.currentStudy ? "Present" : formatDate(edu.endDate);

  return (
    <div className="flex items-start justify-between border-2 border-border bg-surface p-5 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow">
      <div className="flex items-start gap-4 min-w-0">
        <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0 mt-0.5">
          <GraduationCap className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5 min-w-0">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight truncate">
            {edu.degree}
          </Heading>
          <p className="font-bold text-sm text-foreground-secondary truncate">
            {edu.fieldOfStudy}
          </p>
          <p className="font-semibold text-xs text-foreground-secondary flex items-center gap-1">
            {edu.institution}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted font-mono pt-1">
            <span className="flex items-center gap-1 font-bold">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {startFormatted} – {endFormatted}
            </span>
            <span className="flex items-center gap-1 font-bold">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {edu.location}
            </span>
            <span className="px-2 py-0.5 border border-border bg-surface-secondary text-[10px] font-black uppercase text-foreground brutal-shadow-sm">
              Grade: {edu.cgpa}
            </span>
          </div>

          {edu.description && (
            <Text className="text-foreground-secondary text-xs leading-relaxed pt-2 border-t border-border/10 mt-2">
              {edu.description}
            </Text>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(edu)}
          aria-label={`Edit education at ${edu.institution}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(edu.id)}
          aria-label={`Delete education at ${edu.institution}`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
