"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { FolderOpen, ArrowRight, Star, Plus } from "lucide-react";
import type { Project } from "../types/project.types";

interface ProjectsCardProps {
  projects: Project[];
  onAddClick: () => void;
}

export function ProjectsCard({ projects, onAddClick }: ProjectsCardProps) {
  // Sort and preview top 2 projects
  const previewProjects = [...projects]
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1;
      if (!a.featured && b.featured) return 1;
      return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    })
    .slice(0, 2);

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            Projects & Portfolio
          </Heading>

          <div className="flex items-center gap-2">
            <BrutalButton
              onClick={onAddClick}
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
              aria-label="Add new project"
            >
              <Plus className="h-3.5 w-3.5" />
              Add New
            </BrutalButton>
            <BrutalButton
              asChild
              variant="secondary"
              className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            >
              <Link href="/profile/projects" aria-label="View all projects">
                View All
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </BrutalButton>
          </div>
        </div>

        {/* List Preview */}
        {projects.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No projects added yet. Showcase your work.
            </Text>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {previewProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between gap-4 border-b-2 border-border/10 pb-3 last:border-none last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {project.featured && (
                      <Star className="h-3.5 w-3.5 fill-warning text-warning shrink-0" aria-hidden="true" />
                    )}
                    <p className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
                      {project.title}
                    </p>
                  </div>
                  <p className="text-xs text-foreground-secondary truncate font-medium">
                    {project.role} • Team of {project.teamSize}
                  </p>
                </div>
                <span className="font-mono text-[9px] font-black uppercase text-foreground-muted bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm shrink-0">
                  {project.techStack.slice(0, 2).join(", ")}
                  {project.techStack.length > 2 && "..."}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
