"use client";

import React from "react";
import type { Job } from "../types/jobs.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Calendar, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProfileStore } from "@/features/profile";
import { matchEngineService } from "../services/match-engine.service";

interface JobCardProps {
  job: Job;
  isSelected: boolean;
  onClick: () => void;
  onSave: (e: React.MouseEvent) => void;
}

export function JobCard({ job, isSelected, onClick, onSave }: JobCardProps) {
  const profileState = useProfileStore();

  const formatSalary = (min: number | null, max: number | null, curr: string) => {
    if (min === null && max === null) return "Salary Undisclosed";
    const minK = min ? `${Math.round(min / 1000)}k` : "0";
    const maxK = max ? `${Math.round(max / 1000)}k` : "Any";
    return `${minK} - ${maxK} ${curr.toUpperCase()}`;
  };

  const getRelativeDate = (dateStr: string) => {
    const diffTime = Math.abs(Date.now() - new Date(dateStr).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return "Today";
    if (diffDays === 2) return "Yesterday";
    return `${diffDays} days ago`;
  };

  const getQualityBadge = () => {
    const score = Math.round((job.freshnessScore * 0.4) + (job.trustScore * 0.6));
    if (job.trustScore >= 85) {
      return { label: "Verified", className: "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30 border" };
    }
    if (job.freshnessScore >= 80) {
      return { label: "Fresh", className: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 border" };
    }
    if (score >= 70) {
      return { label: "Trusted", className: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 border" };
    }
    return { label: "Good", className: "bg-gray-50 dark:bg-surface-secondary text-gray-700 dark:text-foreground-secondary border-gray-300 border" };
  };

  const getMatchBadge = () => {
    if (!profileState.profile) return null;
    const qualityScore = Math.round((job.freshnessScore * 0.4) + (job.trustScore * 0.6));
    const yearsOfExp = profileState.profile.career?.yearsOfExperience || 0;
    const report = matchEngineService.calculateOverallMatch(
      profileState.skills,
      profileState.education,
      profileState.preferences,
      yearsOfExp,
      job,
      qualityScore
    );

    let colorClass = "bg-red-50 text-red-700 border-red-300 border";
    if (report.overallScore >= 90) colorClass = "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30 border";
    else if (report.overallScore >= 80) colorClass = "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 border";
    else if (report.overallScore >= 70) colorClass = "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 border";
    else if (report.overallScore >= 50) colorClass = "bg-gray-50 dark:bg-surface-secondary text-gray-700 dark:text-foreground-secondary border-gray-300 border";

    return {
      score: report.overallScore,
      label: report.overallLabel,
      className: colorClass
    };
  };
 
  const quality = getQualityBadge();
  const match = getMatchBadge();
 
  return (
    <BrutalCard
      onClick={onClick}
      className={cn(
        "cursor-pointer border-[3px] border-border brutal-shadow-xs transition-all hover:-translate-y-0.5 hover:brutal-shadow bg-surface rounded-sm p-3 relative flex flex-col justify-between gap-2.5 text-left",
        isSelected && "bg-amber-50 dark:bg-amber-500/10/50 border-primary brutal-shadow"
      )}
    >
      <div>
        {/* Header (Title & Save Trigger) */}
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-0.5">
            <h3 className="text-xs font-black uppercase text-foreground leading-tight tracking-tight">
              {job.title}
            </h3>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider">
              {job.companyInfo.name}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onSave}
            className="h-7 w-7 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary shrink-0 rounded-sm"
            aria-label={job.isSaved ? "Unsave job" : "Save job"}
          >
            <Bookmark
              className={cn(
                "h-3.5 w-3.5 stroke-[2.5px]",
                job.isSaved ? "fill-primary text-primary" : "text-foreground"
              )}
            />
          </Button>
        </div>
 
        {/* Badges row */}
        <div className="flex flex-wrap gap-1 mt-1.5">
          {match && (
            <Badge className={cn("text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-none font-extrabold", match.className)}>
              {match.score}% {match.label}
            </Badge>
          )}
          <Badge className={cn("text-[7.5px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-sm shadow-none font-extrabold", quality.className)}>
            {quality.label}
          </Badge>
          <Badge className="text-[7.5px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-1 py-0.5">
            {job.remoteType}
          </Badge>
          <Badge className="text-[7.5px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-1 py-0.5">
            {job.experienceLevel}
          </Badge>
          <Badge className="text-[7.5px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-1 py-0.5">
            {job.employmentType.replace("-", " ")}
          </Badge>
        </div>
 
        {/* Description Snippet */}
        <p className="text-[9px] font-semibold text-foreground-muted line-clamp-2 mt-2 leading-relaxed">
          {job.description}
        </p>
 
        {/* Technical tags */}
        <div className="flex flex-wrap gap-1 mt-2">
          {job.skillsRequired.slice(0, 4).map((skill) => (
            <span
              key={skill}
              className="text-[7.5px] font-bold bg-surface-secondary border border-border/40 text-foreground px-1 py-0.5 rounded-sm"
            >
              {skill}
            </span>
          ))}
          {job.skillsRequired.length > 4 && (
            <span className="text-[7.5px] font-bold text-foreground-muted px-1 py-0.5">
              +{job.skillsRequired.length - 4} more
            </span>
          )}
        </div>
      </div>
 
      {/* Footer Info */}
      <div className="border-t border-border/10 pt-2 mt-1.5 flex items-center justify-between text-[7.5px] font-black uppercase tracking-wider text-foreground-muted">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
        </div>
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>{getRelativeDate(job.postedDate)}</span>
        </div>
      </div>
    </BrutalCard>
  );
}
