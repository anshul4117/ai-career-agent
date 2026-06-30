"use client";

import React from "react";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Code2, Plus } from "lucide-react";
import { SkillItem } from "./skill-item";
import type { Skill } from "../types/skill.types";

interface SkillsListProps {
  skills: Skill[];
  onEdit: (skill: Skill) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
}

export function SkillsList({ skills, onEdit, onDelete, onAddClick }: SkillsListProps) {
  if (skills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
        <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <Code2 className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight">
            No Skills Added Yet
          </Heading>
          <Text className="text-foreground-secondary text-xs leading-relaxed">
            Specify technical or professional skill tags to calculate matching scores and ATS diagnostics.
          </Text>
        </div>
        <BrutalButton
          onClick={onAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Your First Skill
        </BrutalButton>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {skills.map((skill) => (
        <SkillItem
          key={skill.id}
          skill={skill}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
