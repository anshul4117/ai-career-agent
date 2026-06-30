"use client";

import React from "react";
import { FolderOpen, Github, ExternalLink, Pencil, Trash2, Users, User, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading, Text } from "@/components/ui/typography";
import type { Project } from "../types/project.types";

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
  onDelete: (id: string) => void;
  onToggleFeatured: (id: string) => void;
}

export function ProjectCard({
  project,
  onEdit,
  onDelete,
  onToggleFeatured,
}: ProjectCardProps) {
  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Ongoing";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="flex flex-col justify-between border-2 border-border bg-surface p-5 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow h-full w-full min-w-0">
      <div className="space-y-4">
        {/* Header Title & Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-2 min-w-0">
            <div className="h-8 w-8 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
              <FolderOpen className="h-4 w-4" />
            </div>
            <Heading level="h4" className="text-base font-black uppercase tracking-tight truncate">
              {project.title}
            </Heading>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFeatured(project.id)}
              aria-label={project.featured ? "Unfeature project" : "Feature project"}
              className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
            >
              <Star
                className={`h-4 w-4 ${
                  project.featured ? "fill-warning text-warning" : "text-foreground-muted"
                }`}
              />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(project)}
              aria-label={`Edit ${project.title}`}
              className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(project.id)}
              aria-label={`Delete ${project.title}`}
              className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Roles & Team */}
        <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-secondary font-medium">
          <span className="flex items-center gap-1">
            <User className="h-3.5 w-3.5 text-primary shrink-0" />
            {project.role}
          </span>
          <span className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5 text-primary shrink-0" />
            Team of {project.teamSize}
          </span>
          <span className="text-foreground-muted font-mono">
            {formatDate(project.startDate)} – {formatDate(project.endDate)}
          </span>
        </div>

        {/* Description */}
        <Text className="text-foreground-secondary text-xs leading-relaxed">
          {project.description}
        </Text>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech) => (
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

      {/* Links */}
      {(project.githubUrl || project.liveDemoUrl) && (
        <div className="flex items-center gap-3 pt-4 border-t border-border/10 mt-4">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-black uppercase text-foreground-secondary hover:text-primary transition-colors"
            >
              <Github className="h-3.5 w-3.5" />
              Source Code
            </a>
          )}
          {project.liveDemoUrl && (
            <a
              href={project.liveDemoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-black uppercase text-foreground-secondary hover:text-primary transition-colors ml-auto"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Live Demo
            </a>
          )}
        </div>
      )}
    </div>
  );
}
