"use client";

import React, { useMemo } from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { Code2, Star, Clock, Folder, Sparkles } from "lucide-react";
import { SkillBadge } from "./skill-badge";
import type { Skill } from "../types/skill.types";

interface SkillsCardProps {
  skills: Skill[];
}

export function SkillsCard({ skills }: SkillsCardProps) {
  // 1. Group skills by category
  const groupedSkills = useMemo(() => {
    return skills.reduce(
      (acc, skill) => {
        const cat = skill.category;
        if (!acc[cat]) {
          acc[cat] = [];
        }
        acc[cat].push(skill);
        return acc;
      },
      {} as Record<string, Skill[]>,
    );
  }, [skills]);

  // 2. Extract Top (Featured) Skills
  const featuredSkills = useMemo(() => {
    return skills.filter((s) => s.featured);
  }, [skills]);

  // 3. Extract recently added (simulate via sort by id or timestamp)
  const recentlyAddedSkills = useMemo(() => {
    return [...skills]
      .sort(
        (a, b) =>
          new Date(b.createdAt || "").getTime() -
          new Date(a.createdAt || "").getTime(),
      )
      .slice(0, 3);
  }, [skills]);

  const totalCategories = Object.keys(groupedSkills).length;

  if (skills.length === 0) {
    return (
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        <div className="space-y-4">
          <Heading
            level="h4"
            className="text-base font-black uppercase tracking-tight flex items-center gap-2"
          >
            <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Skills & Expertise
          </Heading>
          <div className="py-8 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No skills added yet. Add skills in the workspace to display stats.
            </Text>
          </div>
        </div>
      </BrutalCard>
    );
  }

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-6">
        {/* Header */}
        <Heading
          level="h4"
          className="text-base font-black uppercase tracking-tight flex items-center gap-2"
        >
          <Code2 className="h-5 w-5 text-primary" aria-hidden="true" />
          Skills & Expertise
        </Heading>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-2.5 border-2 border-border p-3 bg-surface-secondary brutal-shadow-sm">
          <div className="text-center space-y-0.5">
            <p className="font-mono text-lg font-black text-primary leading-none">
              {skills.length}
            </p>
            <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
              Total Skills
            </p>
          </div>
          <div className="text-center space-y-0.5 border-x-2 border-border/20">
            <p className="font-mono text-lg font-black text-primary leading-none">
              {totalCategories}
            </p>
            <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
              Categories
            </p>
          </div>
          <div className="text-center space-y-0.5">
            <p className="font-mono text-lg font-black text-primary leading-none">
              {featuredSkills.length}
            </p>
            <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
              Featured
            </p>
          </div>
        </div>

        {/* Skills Grouped by Category */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted flex items-center gap-1.5 border-b-2 border-border/10 pb-1">
            <Folder className="h-3.5 w-3.5" />
            Skills by Category
          </p>

          <div className="space-y-3.5">
            {Object.entries(groupedSkills).map(([category, catSkills]) => (
              <div key={category} className="space-y-1.5">
                <h5 className="font-black text-xs uppercase tracking-wider text-foreground">
                  {category}
                </h5>
                <div className="flex flex-wrap gap-2">
                  {catSkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center gap-1.5 border border-border bg-surface px-2 py-1 brutal-shadow-sm transition-transform duration-100 hover:translate-x-[-1px] hover:translate-y-[-1px]"
                    >
                      {skill.featured && (
                        <Star
                          className="h-3 w-3 fill-warning text-warning shrink-0"
                          aria-hidden="true"
                        />
                      )}
                      <span className="font-extrabold text-xs text-foreground uppercase tracking-tight">
                        {skill.name}
                      </span>
                      <span className="text-[9px] font-bold text-foreground-secondary select-none font-mono">
                        ({skill.yearsOfExperience}y)
                      </span>
                      <SkillBadge
                        level={skill.level}
                        className="border border-border/10 shadow-none text-[8px] px-1 py-0"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top/Featured Skills Panel */}
        {featuredSkills.length > 0 && (
          <div className="space-y-2.5 pt-2 border-t-2 border-border/10">
            <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-warning" />
              Featured/Top Skills
            </p>
            <div className="flex flex-wrap gap-2">
              {featuredSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="font-mono text-[10px] font-bold text-primary bg-surface-secondary border-2 border-primary/20 px-2 py-0.5 rounded-sm flex items-center gap-1"
                >
                  <Star className="h-3 w-3 fill-warning text-warning shrink-0" />
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recently Added Skills Panel */}
        {recentlyAddedSkills.length > 0 && (
          <div className="space-y-2 pt-2 border-t-2 border-border/10">
            <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-primary" />
              Recently Added
            </p>
            <div className="flex flex-wrap gap-2">
              {recentlyAddedSkills.map((skill) => (
                <span
                  key={skill.id}
                  className="font-extrabold text-[10px] uppercase text-foreground bg-surface-secondary border border-border/20 px-2 py-0.5 rounded-sm"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
