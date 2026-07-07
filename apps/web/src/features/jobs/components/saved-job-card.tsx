"use client";
 
import React from "react";
import type { Job } from "../types/jobs.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, MapPin, DollarSign } from "lucide-react";
 
interface SavedJobCardProps {
  job: Job;
  onUnsave: (e: React.MouseEvent) => void;
  onClick: () => void;
}
 
export function SavedJobCard({ job, onUnsave, onClick }: SavedJobCardProps) {
  const formatSalary = (min: number | null, max: number | null, curr: string) => {
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
 
  // Generate initials for company logo fallback
  const companyInitials = job.companyInfo.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
 
  return (
    <BrutalCard
      onClick={onClick}
      className="cursor-pointer border-[3px] border-border brutal-shadow-xs transition-all hover:-translate-y-0.5 hover:brutal-shadow bg-surface rounded-sm p-3 relative flex flex-col justify-between gap-3 text-left"
    >
      <div>
        {/* Header (Logo, Title & Unsave Button) */}
        <div className="flex items-start gap-2.5">
          {/* Logo / Initials */}
          <div className="h-9 w-9 border-2 border-border bg-amber-100 flex items-center justify-center font-black uppercase text-[10px] rounded-sm shrink-0 brutal-shadow-xs">
            {job.companyInfo.logoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={job.companyInfo.logoUrl}
                alt={`${job.companyInfo.name} logo`}
                className="h-full w-full object-contain rounded-sm"
              />
            ) : (
              companyInitials
            )}
          </div>
 
          <div className="space-y-0.5 min-w-0 flex-1">
            <h3 className="text-xs font-black uppercase text-foreground leading-tight tracking-tight truncate">
              {job.title}
            </h3>
            <p className="text-[9px] font-bold text-primary uppercase tracking-wider truncate">
              {job.companyInfo.name}
            </p>
          </div>
 
          <Button
            variant="ghost"
            size="icon"
            onClick={onUnsave}
            className="h-7 w-7 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary shrink-0 rounded-sm"
            aria-label="Remove saved job"
          >
            <Bookmark className="h-3.5 w-3.5 stroke-[2.5px] fill-primary text-primary" />
          </Button>
        </div>
 
        {/* Match Score & Relative Date */}
        <div className="flex items-center gap-1.5 mt-2">
          <Badge className="text-[7.5px] font-black uppercase tracking-wider bg-primary text-white border-2 border-border px-1 py-0.5">
            {job.trustScore}% Match
          </Badge>
          <span className="text-[8px] font-bold text-foreground-muted bg-surface-secondary px-1.5 py-0.5 border border-border/10 rounded-sm">
            {getRelativeSavedDate(job.savedAt)}
          </span>
        </div>
 
        {/* Description Snippet */}
        <p className="text-[9px] font-semibold text-foreground-muted line-clamp-2 mt-2 leading-relaxed">
          {job.description}
        </p>
      </div>
 
      {/* Footer Info */}
      <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[7.5px] font-black uppercase tracking-wider text-foreground-muted">
        <div className="flex items-center gap-1">
          <DollarSign className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>{formatSalary(job.salaryMin, job.salaryMax, job.currency)}</span>
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-3 w-3 text-foreground stroke-[2.5px]" />
          <span>{job.location} ({job.remoteType})</span>
        </div>
      </div>
    </BrutalCard>
  );
}
