"use client";

import React from "react";
import type { Job } from "../types/jobs.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bookmark,
  MapPin,
  DollarSign,
  Archive,
  Pencil,
  Tag,
  MessageSquare,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface SavedJobCardProps {
  job: Job;
  onUnsave: (e: React.MouseEvent) => void;
  onClick: () => void;
  onArchiveToggle?: (e: React.MouseEvent) => void;
  onEditNotesAndLabels?: (e: React.MouseEvent) => void;
}

export const SavedJobCard = React.memo(function SavedJobCard({
  job,
  onUnsave,
  onClick,
  onArchiveToggle,
  onEditNotesAndLabels,
}: SavedJobCardProps) {
  const formatSalary = (
    min: number | null,
    max: number | null,
    curr: string,
  ) => {
    if (min === null && max === null) return "Salary Undisclosed";
    const minK = min ? `${Math.round(min / 1000)}k` : "0";
    const maxK = max ? `${Math.round(max / 1000)}k` : "Any";
    return `${minK} - ${maxK} ${curr.toUpperCase()}`;
  };

  const getRelativeSavedDate = (dateStr?: string) => {
    if (!dateStr) return "Saved recently";
    const diffTime = Math.abs(Date.now() - new Date(dateStr).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays <= 1) return "Saved today";
    if (diffDays === 2) return "Saved yesterday";
    return `Saved ${diffDays} days ago`;
  };

  const companyInitials = job.companyInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const getQualityBadge = () => {
    const score = Math.round(job.freshnessScore * 0.4 + job.trustScore * 0.6);
    if (job.trustScore >= 85) {
      return {
        label: "Verified",
        className:
          "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30 border",
      };
    }
    if (job.freshnessScore >= 80) {
      return {
        label: "Fresh",
        className:
          "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30 border",
      };
    }
    if (score >= 70) {
      return {
        label: "Trusted",
        className:
          "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30 border",
      };
    }
    return {
      label: "Good",
      className:
        "bg-gray-50 dark:bg-surface-secondary text-gray-700 dark:text-foreground-secondary border-gray-300 border",
    };
  };

  const quality = getQualityBadge();

  return (
    <BrutalCard
      onClick={onClick}
      className={cn(
        "cursor-pointer border-[3px] border-border brutal-shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:brutal-shadow active:scale-[0.98] bg-surface rounded-sm p-3.5 relative flex flex-col justify-between gap-3 text-left",
        job.isArchived && "opacity-75 bg-surface-secondary/40",
      )}
    >
      <div>
        {/* Header (Logo, Title & Action Triggers) */}
        <div className="flex items-start gap-2.5">
          <div className="relative h-9 w-9 overflow-hidden border-2 border-border bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center font-black uppercase text-[10px] rounded-sm shrink-0 brutal-shadow-xs">
            {job.companyInfo.logoUrl ? (
              <Image
                src={job.companyInfo.logoUrl}
                alt={`${job.companyInfo.name} logo`}
                fill
                sizes="36px"
                className="object-contain rounded-sm"
              />
            ) : (
              companyInitials
            )}
          </div>

          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="text-xs font-black uppercase text-foreground leading-tight tracking-tight truncate">
              {job.title}{" "}
              {job.isArchived && (
                <span className="text-[8px] font-black uppercase tracking-wider text-error bg-red-100 dark:bg-red-500/20 px-1 py-0.5 rounded-sm border border-red-300 ml-1">
                  Archived
                </span>
              )}
            </h3>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider truncate">
              {job.companyInfo.name}
            </p>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {onEditNotesAndLabels && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onEditNotesAndLabels}
                className="h-7 w-7 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary rounded-sm"
                aria-label="Edit notes and labels"
                title="Notes & Labels"
              >
                <Pencil className="h-3.5 w-3.5 stroke-[2.5px] text-foreground" />
              </Button>
            )}

            {onArchiveToggle && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onArchiveToggle}
                className={cn(
                  "h-7 w-7 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary rounded-sm",
                  job.isArchived
                    ? "bg-accent text-foreground brutal-shadow"
                    : "bg-surface text-foreground",
                )}
                aria-label={job.isArchived ? "Restore job" : "Archive job"}
                title={job.isArchived ? "Restore from Archive" : "Archive Job"}
              >
                <Archive className="h-3.5 w-3.5 stroke-[2.5px]" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onUnsave}
              className="h-7 w-7 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary shrink-0 rounded-sm"
              aria-label="Remove saved job"
              title="Unsave Job"
            >
              <Bookmark className="h-3.5 w-3.5 stroke-[2.5px] fill-primary text-primary" />
            </Button>
          </div>
        </div>

        {/* Match Score & Relative Date */}
        <div className="flex flex-wrap items-center gap-1 mt-2.5">
          <Badge className="text-[7.5px] font-black uppercase tracking-wider bg-primary text-white border-2 border-border px-1 py-0.5">
            {job.trustScore}% Match
          </Badge>
          <Badge
            className={cn(
              "text-[7.5px] font-black uppercase tracking-wider shadow-none font-extrabold px-1 py-0.5 rounded-sm",
              quality.className,
            )}
          >
            {quality.label}
          </Badge>
          <span className="text-[8px] font-bold text-foreground-muted bg-surface-secondary px-1.5 py-0.5 border border-border/10 rounded-sm">
            {getRelativeSavedDate(job.savedAt)}
          </span>
        </div>

        {/* Labels tag section */}
        {job.labels && job.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {job.labels.map((label) => (
              <Badge
                key={label}
                className="text-[7px] font-extrabold uppercase bg-accent text-foreground border border-border px-1 py-0.2 rounded-sm shadow-none"
              >
                <Tag className="h-2 w-2 mr-0.5 inline stroke-[2.5px]" /> {label}
              </Badge>
            ))}
          </div>
        )}

        {/* Description Snippet */}
        <p className="text-[9px] font-semibold text-foreground-muted line-clamp-2 mt-2 leading-relaxed">
          {job.description}
        </p>

        {/* Notes content */}
        {job.notes && (
          <div className="mt-2.5 bg-yellow-50 dark:bg-yellow-950/20 border-l-2 border-yellow-400 p-2 text-[8.5px] font-bold text-yellow-800 dark:text-yellow-400 rounded-sm select-none flex items-start gap-1">
            <MessageSquare className="h-3 w-3 shrink-0 text-yellow-500" />
            <p className="italic leading-normal">&quot;{job.notes}&quot;</p>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[7.5px] font-black uppercase tracking-wider text-foreground-muted mt-1">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>
            {job.location} ({job.remoteType})
          </span>
        </div>
      </div>
    </BrutalCard>
  );
});
