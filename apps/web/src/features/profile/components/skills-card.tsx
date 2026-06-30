"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Code2, ArrowRight, Star, Plus } from "lucide-react";
import { SkillBadge } from "./skill-badge";
import type { Skill } from "../types/skill.types";

interface SkillsCardProps {
  skills: Skill[];
  onAddClick: () => void;
}

export function SkillsCard({ skills, onAddClick }: SkillsCardProps) {
  // Show featured skills first, or fallback to the top 6 skills
  const previewSkills = skills.filter((s) => s.featured).concat(skills.filter((s) => !s.featured)).slice(0, 6);

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Skills & Expertise
          </Heading>

          <div className="flex items-center gap-2">
            <BrutalButton
              onClick={onAddClick}
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
              aria-label="Add new skill"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New
            </BrutalButton>
            <BrutalButton
              asChild
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <Link href="/profile/skills" aria-label="View all skills">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </BrutalButton>
          </div>
        </div>

        {/* List Preview */}
        {skills.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No skills added yet. Add skills to compute matches.
            </Text>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {previewSkills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center gap-1.5 border-2 border-border bg-surface-secondary px-2.5 py-1.5 brutal-shadow-sm transition-transform duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px]"
              >
                {skill.featured && (
                  <Star className="h-3.5 w-3.5 fill-warning text-warning shrink-0" aria-hidden="true" />
                )}
                <span className="font-extrabold text-xs text-foreground uppercase tracking-tight">
                  {skill.name}
                </span>
                <span className="text-[10px] font-black uppercase text-foreground-muted select-none">
                  ({skill.yearsOfExperience}y)
                </span>
                <SkillBadge level={skill.level} className="border border-border/10 shadow-none text-[8px] px-1 py-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
