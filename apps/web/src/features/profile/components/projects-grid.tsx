"use client";

import React from "react";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { FolderOpen, Plus } from "lucide-react";
import { ProjectCard } from "./project-card";
import type { Project } from "../types/project.types";

interface ProjectsGridProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
  onAddClick: () => void;
}

export function ProjectsGrid({
  projects,
  onEdit,
  onDelete,
  onToggleFeatured,
  onAddClick,
}: ProjectsGridProps) {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
        <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <FolderOpen className="h-6 w-6" aria-hidden="true" />
        </div>
        <div className="space-y-1.5 max-w-sm">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight">
            No Projects Added Yet
          </Heading>
          <Text className="text-foreground-secondary text-xs leading-relaxed">
            Showcase your best side projects, open-source work, and academic applications to potential matches.
          </Text>
        </div>
        <BrutalButton
          onClick={onAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
        >
          <Plus className="h-4 w-4" />
          Add Your First Project
        </BrutalButton>
      </div>
    );
  }

  // Sort: featured first, then by date descending
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full min-w-0">
      {sortedProjects.map((project) => (
        <div key={project.id} className="w-full min-w-0">
          <ProjectCard
            project={project}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleFeatured={onToggleFeatured}
          />
        </div>
      ))}
    </div>
  );
}
