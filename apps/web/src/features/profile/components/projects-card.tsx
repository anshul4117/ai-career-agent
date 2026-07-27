"use client";

import React, { useMemo } from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import {
  FolderOpen,
  Star,
  Code,
  Github,
  ExternalLink,
  Activity,
} from "lucide-react";
import type { Project } from "../types/project.types";

interface ProjectsCardProps {
  projects: Project[];
}

export function ProjectsCard({ projects }: ProjectsCardProps) {
  // Sort and preview top 3 projects
  const previewProjects = useMemo(() => {
    return [...projects]
      .sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (
          new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
        );
      })
      .slice(0, 3);
  }, [projects]);

  // Statistics Calculations
  const stats = useMemo(() => {
    const total = projects.length;
    const featured = projects.filter((p) => p.featured).length;
    const techCount = new Set(projects.flatMap((p) => p.techStack)).size;
    const githubCount = projects.filter(
      (p) => p.githubUrl && p.githubUrl !== "",
    ).length;
    const liveCount = projects.filter(
      (p) => p.liveDemoUrl && p.liveDemoUrl !== "",
    ).length;

    const latestProj = [...projects].sort(
      (a, b) =>
        new Date(b.startDate).getTime() - new Date(a.startDate).getTime(),
    )[0];
    const latestLabel = latestProj
      ? `${latestProj.title} (${latestProj.category || "Web"})`
      : "None";

    return {
      total,
      featured,
      techCount,
      githubCount,
      liveCount,
      latestLabel,
    };
  }, [projects]);

  if (projects.length === 0) {
    return (
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        <div className="space-y-4">
          <Heading
            level="h4"
            className="text-base font-black uppercase tracking-tight flex items-center gap-2"
          >
            <FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" />
            Projects & Portfolio
          </Heading>
          <div className="py-8 text-center space-y-2">
            <p className="text-foreground-secondary text-xs">
              No projects added yet. Showcase your work in the workspace.
            </p>
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
          <FolderOpen className="h-5 w-5 text-primary" aria-hidden="true" />
          Projects & Portfolio
        </Heading>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <FolderOpen className="h-3.5 w-3.5 text-primary" /> Total
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.total}
            </p>
          </div>

          <div className="space-y-1 border-l-2 border-border/10 pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Star className="h-3.5 w-3.5 text-warning" /> Featured
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.featured}
            </p>
          </div>

          <div className="space-y-1 border-l-2 border-border/10 pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Code className="h-3.5 w-3.5 text-primary" /> Techs
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.techCount}
            </p>
          </div>

          <div className="space-y-1 border-l-2 border-border/10 pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Github className="h-3.5 w-3.5 text-primary" /> GitHub
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.githubCount}
            </p>
          </div>

          <div className="space-y-1 border-l-2 border-border/10 pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 text-primary" /> Live
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {stats.liveCount}
            </p>
          </div>

          <div className="space-y-1 border-l-2 border-border/10 pl-4 col-span-2 md:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5 text-primary" /> Latest
            </p>
            <p
              className="text-xs font-black text-foreground truncate uppercase"
              title={stats.latestLabel}
            >
              {stats.latestLabel}
            </p>
          </div>
        </div>

        {/* Preview List */}
        <div className="space-y-4">
          <p className="text-[10px] uppercase font-black tracking-widest text-foreground-muted border-b-2 border-border/10 pb-1">
            Featured Projects Preview
          </p>

          <div className="space-y-3 pt-1">
            {previewProjects.map((project) => (
              <div
                key={project.id}
                className="flex items-start justify-between gap-4 border-b-2 border-border/10 pb-3 last:border-none last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {project.featured && (
                      <Star
                        className="h-3.5 w-3.5 fill-warning text-warning shrink-0"
                        aria-hidden="true"
                      />
                    )}
                    <p className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
                      {project.title}
                    </p>
                    <span className="px-1.5 py-0.2 border border-border bg-surface-secondary text-[8px] uppercase font-bold text-foreground shrink-0 select-none">
                      {project.category || "Web"}
                    </span>
                  </div>
                  <p className="text-xs text-foreground-secondary truncate font-medium">
                    {project.role}{" "}
                    {project.teamSize ? `• Team of ${project.teamSize}` : ""}
                  </p>
                </div>
                <span className="font-mono text-[9px] font-black uppercase text-foreground-muted bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm shrink-0">
                  {project.techStack.slice(0, 2).join(", ")}
                  {project.techStack.length > 2 && "..."}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </BrutalCard>
  );
}
