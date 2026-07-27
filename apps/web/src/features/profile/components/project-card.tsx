"use client";

import React from "react";
import {
  FolderOpen,
  Github,
  ExternalLink,
  Pencil,
  Trash2,
  Users,
  User,
  Star,
  Calendar,
} from "lucide-react";
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
    if (!dateString) return "Present";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  const calculateDuration = (
    start: string,
    end: string | null,
    current: boolean,
  ) => {
    const startDate = new Date(start);
    const endDate = current ? new Date() : new Date(end || "");
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30));
    const years = Math.floor(diffMonths / 12);
    const months = diffMonths % 12;

    let result = "";
    if (years > 0) result += `${years} yr${years > 1 ? "s" : ""} `;
    if (months > 0) result += `${months} mo${months > 1 ? "s" : ""}`;
    return result.trim() || "1 mo";
  };

  const durationFormatted = calculateDuration(
    project.startDate,
    project.endDate,
    project.currentlyWorking || false,
  );

  return (
    <div className="flex flex-col justify-between border-2 border-border bg-surface p-5 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow h-full w-full min-w-0">
      <div className="space-y-4">
        {/* Project Image Placeholder */}
        <div className="h-32 w-full border-2 border-border bg-primary/5 flex flex-col items-center justify-center brutal-shadow-sm rounded-sm select-none text-foreground-muted font-mono font-black text-xs relative overflow-hidden">
          <FolderOpen className="h-8 w-8 text-primary/30 mb-1" />
          <span>[ IMAGE PLACEHOLDER ]</span>
          <span className="absolute top-2 left-2 px-1.5 py-0.5 border border-border bg-surface-secondary text-[8px] uppercase font-bold text-foreground">
            {project.category || "Other"}
          </span>
          {project.featured && (
            <span className="absolute top-2 right-2 px-1.5 py-0.5 border border-border bg-warning text-black text-[8px] font-black uppercase brutal-shadow-sm flex items-center gap-0.5">
              <Star className="h-2.5 w-2.5 fill-current" />
              Featured
            </span>
          )}
        </div>

        {/* Header Title & Actions */}
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Heading
              level="h4"
              className="text-base font-black uppercase tracking-tight truncate"
            >
              {project.title}
            </Heading>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onToggleFeatured(project.id)}
              aria-label={
                project.featured ? "Unfeature project" : "Feature project"
              }
              className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
            >
              <Star
                className={`h-4 w-4 ${
                  project.featured
                    ? "fill-warning text-warning"
                    : "text-foreground-muted"
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
          {project.teamSize && (
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-primary shrink-0" />
              Team of {project.teamSize}
            </span>
          )}
          <span className="flex items-center gap-1 font-mono text-[10px] text-foreground-muted">
            <Calendar className="h-3.5 w-3.5 shrink-0" />
            {formatDate(project.startDate)} –{" "}
            {project.currentlyWorking ? "Present" : formatDate(project.endDate)}{" "}
            ({durationFormatted})
          </span>
        </div>

        {/* Description */}
        <div className="space-y-1">
          {project.shortDescription && (
            <p className="font-bold text-xs text-foreground uppercase tracking-tight">
              {project.shortDescription}
            </p>
          )}
          <Text className="text-foreground-secondary text-xs leading-relaxed">
            {project.description}
          </Text>
        </div>

        {/* Tech Stack Badges */}
        {project.techStack && project.techStack.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.techStack.map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 border border-border bg-surface-secondary text-[9px] font-extrabold uppercase rounded-sm text-foreground-secondary"
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
