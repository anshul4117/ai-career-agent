"use client";

import React from "react";
import { Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkillBadge } from "./skill-badge";
import type { Skill } from "../types/skill.types";

interface SkillItemProps {
  skill: Skill;
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
}

export function SkillItem({ skill, onEdit, onDelete }: SkillItemProps) {
  return (
    <div className="flex items-center justify-between border-2 border-border bg-surface p-4 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow">
      <div className="flex items-center gap-3 min-w-0">
        <div className="space-y-1.5 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
              {skill.name}
            </span>
            {skill.featured && (
              <Star className="h-4 w-4 fill-warning text-warning shrink-0" aria-label="Featured skill" />
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-foreground-secondary">
            <span className="font-medium text-[10px] uppercase bg-surface-secondary px-2 py-0.5 rounded-sm border border-border/20">
              {skill.category}
            </span>
            <span>•</span>
            <span className="font-mono text-[10px] font-bold">
              {skill.yearsOfExperience} yrs exp
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-4 shrink-0">
        <SkillBadge level={skill.level} />
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(skill)}
          aria-label={`Edit ${skill.name}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(skill.id)}
          aria-label={`Delete ${skill.name}`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
