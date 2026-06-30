"use client";

import React from "react";
import { Briefcase, Calendar, MapPin, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import type { Experience } from "../types/experience.types";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "../data/experience.mock";

interface ExperienceItemProps {
  exp: Experience;
  onEdit: (exp: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceItem({ exp, onEdit, onDelete }: ExperienceItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  const startFormatted = formatDate(exp.startDate);
  const endFormatted = exp.currentPosition ? "Present" : formatDate(exp.endDate);

  return (
    <div className="flex items-start justify-between border-2 border-border bg-surface p-5 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow">
      <div className="flex items-start gap-4 min-w-0">
        <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0 mt-0.5">
          <Briefcase className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight truncate">
              {exp.jobTitle}
            </Heading>
            <span className="px-2 py-0.5 border border-border bg-surface-secondary text-[9px] font-black uppercase text-foreground brutal-shadow-sm">
              {EMPLOYMENT_TYPE_LABELS[exp.employmentType] || exp.employmentType}
            </span>
          </div>
          
          <p className="font-bold text-sm text-foreground-secondary truncate">
            {exp.companyName}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-muted font-mono pt-1">
            <span className="flex items-center gap-1 font-bold">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              {startFormatted} – {endFormatted}
            </span>
            <span className="flex items-center gap-1 font-bold">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {exp.location} ({WORK_MODE_LABELS[exp.workMode] || exp.workMode})
            </span>
          </div>

          <Text className="text-foreground-secondary text-xs leading-relaxed pt-2 border-t border-border/10 mt-2">
            {exp.description}
          </Text>

          {exp.technologiesUsed && exp.technologiesUsed.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-2">
              {exp.technologiesUsed.map((tech) => (
                <span
                  key={tech}
                  className="px-2 py-0.5 border border-border/20 bg-surface-secondary text-[9px] font-extrabold uppercase rounded-sm text-foreground-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(exp)}
          aria-label={`Edit experience at ${exp.companyName}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(exp.id)}
          aria-label={`Delete experience at ${exp.companyName}`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
