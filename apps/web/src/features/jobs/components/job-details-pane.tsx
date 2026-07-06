"use client";

import React, { useEffect, useState } from "react";
import type { Job, Company } from "../types/jobs.types";
import { useJobsStore } from "../store/jobs.store";
import { useBookmarkStore } from "../store/bookmark.store";
import { jobService } from "../services/job.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Bookmark, 
  ExternalLink, 
  Share2, 
  MapPin, 
  Clock, 
  TrendingUp,
  Globe,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

interface JobDetailsPaneProps {
  job: Job;
  onToast: (msg: string) => void;
}

export function JobDetailsPane({ job, onToast }: JobDetailsPaneProps) {
  const { selectJob } = useJobsStore();
  const { toggleSaveJob, addRecentlyViewed, recentlyViewed } = useBookmarkStore();
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);

  useEffect(() => {
    // Add to recently viewed on details load
    addRecentlyViewed(job);
  }, [job, addRecentlyViewed]);

  useEffect(() => {
    // Fetch similar jobs and company details
    const loadDetails = async () => {
      const [similar, company] = await Promise.all([
        jobService.getSimilarJobs(job.id),
        jobService.getCompanyById(job.companyId)
      ]);
      setSimilarJobs(similar);
      setCompanyDetails(company);
    };
    loadDetails();
  }, [job.id, job.companyId]);

  const formatSalary = (min: number | null, max: number | null, curr: string) => {
    if (min === null && max === null) return "Undisclosed";
    const minK = min ? `${Math.round(min / 1000)}k` : "0";
    const maxK = max ? `${Math.round(max / 1000)}k` : "Any";
    return `$${minK} - $${maxK} ${curr.toUpperCase()}`;
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.origin + `/jobs/${job.id}`);
      onToast("Shareable job link copied to clipboard!");
    }
  };

  const handleApply = () => {
    onToast(`Redirecting to ${job.companyInfo.name} application site...`);
    setTimeout(() => {
      window.open(job.externalApplyUrl, "_blank");
    }, 1000);
  };

  return (
    <div className="space-y-6 text-left pb-24 md:pb-16 select-none">
      
      {/* 1. Header Card */}
      <BrutalCard className="border-[3px] border-border bg-surface p-6 brutal-shadow rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[9px] font-black uppercase bg-primary text-white border-2 border-border px-2 py-0.5 rounded-sm brutal-shadow-xs">
              Match Score: {job.trustScore}%
            </span>
            <span className="text-[8px] font-black uppercase text-foreground-muted tracking-widest">
              Source: {job.source}
            </span>
          </div>
          <h1 className="text-xl font-black uppercase tracking-tight text-foreground leading-tight">
            {job.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-bold text-foreground-secondary">
            <span className="flex items-center gap-1">
              <Building2 className="h-4 w-4" /> {job.companyInfo.name}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-4 w-4" /> {job.location} ({job.remoteType})
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap gap-2.5 w-full md:w-auto">
          <Button
            variant="ghost"
            onClick={() => {
              toggleSaveJob(job);
              onToast(job.isSaved ? "Removed from Saved Jobs" : "Saved to Saved Jobs!");
            }}
            className="flex-1 md:flex-none h-10 px-4 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center gap-1.5 font-black uppercase text-xs rounded-sm"
          >
            <Bookmark className={cn("h-4 w-4 stroke-[2.5px]", job.isSaved && "fill-primary text-primary")} />
            {job.isSaved ? "Saved" : "Save Job"}
          </Button>

          <Button
            variant="ghost"
            onClick={handleShare}
            className="h-10 w-10 shrink-0 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center rounded-sm"
            aria-label="Share listing"
          >
            <Share2 className="h-4 w-4 stroke-[2.5px]" />
          </Button>

          <BrutalButton
            onClick={handleApply}
            className="flex-[2] md:flex-none h-10 px-6 text-xs font-black uppercase tracking-wide brutal-shadow-xs flex items-center justify-center gap-1.5"
          >
            Apply Now <ExternalLink className="h-4 w-4 stroke-[2.5px]" />
          </BrutalButton>
        </div>
      </BrutalCard>

      {/* 2. Metadata Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-3 border-2 border-border brutal-shadow-xs bg-surface rounded-sm">
          <p className="text-[8px] font-black uppercase text-foreground-muted">Compensation</p>
          <p className="text-xs font-black text-foreground mt-1 truncate">
            {formatSalary(job.salaryMin, job.salaryMax, job.currency)}
          </p>
        </div>
        <div className="p-3 border-2 border-border brutal-shadow-xs bg-surface rounded-sm">
          <p className="text-[8px] font-black uppercase text-foreground-muted">Experience</p>
          <p className="text-xs font-black text-foreground mt-1 capitalize">{job.experienceLevel}</p>
        </div>
        <div className="p-3 border-2 border-border brutal-shadow-xs bg-surface rounded-sm">
          <p className="text-[8px] font-black uppercase text-foreground-muted">Employment</p>
          <p className="text-xs font-black text-foreground mt-1 capitalize">{job.employmentType.replace("-", " ")}</p>
        </div>
        <div className="p-3 border-2 border-border brutal-shadow-xs bg-surface rounded-sm">
          <p className="text-[8px] font-black uppercase text-foreground-muted">Location Mode</p>
          <p className="text-xs font-black text-foreground mt-1 capitalize">{job.remoteType}</p>
        </div>
      </div>

      {/* 3. Main Details */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Left Column: Job Description & Responsibilities */}
        <div className="md:col-span-2 space-y-6">
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
              Description
            </h3>
            <p className="text-xs font-semibold text-foreground-secondary leading-relaxed max-w-3xl">
              {job.description}
            </p>
          </BrutalCard>

          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
              Key Responsibilities
            </h3>
            <ul className="space-y-2 max-w-3xl">
              {job.responsibilities.map((resp, i) => (
                <li key={i} className="flex gap-2 text-xs font-semibold text-foreground-secondary leading-relaxed">
                  <span className="text-primary font-black shrink-0">•</span>
                  <span>{resp}</span>
                </li>
              ))}
            </ul>
          </BrutalCard>

          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
              Key Requirements
            </h3>
            <ul className="space-y-2 max-w-3xl">
              {job.requirements.map((req, i) => (
                <li key={i} className="flex gap-2 text-xs font-semibold text-foreground-secondary leading-relaxed">
                  <span className="text-primary font-black shrink-0">•</span>
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </BrutalCard>

          {/* About Company (Moved here) */}
          {companyDetails && (
            <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                About Company
              </h3>
              
              <div className="space-y-2 text-xs font-semibold text-foreground-secondary leading-relaxed">
                <p className="text-[10px] font-black text-foreground uppercase">{companyDetails.name}</p>
                <p className="max-w-3xl">{companyDetails.cultureDescription}</p>
              </div>

              <div className="border-t border-border/10 pt-3 space-y-2 text-[10px] font-bold text-foreground-muted uppercase max-w-xl">
                <div className="flex justify-between gap-4">
                  <span>Industry:</span>
                  <span className="text-foreground">{companyDetails.industry}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Size:</span>
                  <span className="text-foreground">{companyDetails.companySize} employees</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Funding:</span>
                  <span className="text-foreground">{companyDetails.fundingStage}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span>Headquarters:</span>
                  <span className="text-foreground">{companyDetails.headquarters}</span>
                </div>
              </div>

              <Button
                variant="ghost"
                onClick={() => window.open(companyDetails.website, "_blank")}
                className="w-full sm:w-auto h-9 px-4 border border-border/30 hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center justify-center gap-1"
              >
                <Globe className="h-3.5 w-3.5" /> Visit Website
              </Button>
            </BrutalCard>
          )}

          {/* Compensations & Benefits (Moved here) */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
              Compensations & Benefits
            </h3>
            <div className="flex flex-wrap gap-1.5 max-w-3xl">
              {job.benefits.map((ben) => (
                <Badge key={ben} className="text-[9px] font-bold bg-surface-secondary border border-border/40 text-foreground-secondary px-2 py-0.5">
                  {ben}
                </Badge>
              ))}
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Skills Only */}
        <div className="space-y-6">
          
          {/* Skills Required */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
              Skills Required
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {job.skillsRequired.map((skill) => (
                <Badge key={skill} className="text-[9px] font-black uppercase tracking-wider bg-surface border-2 border-border text-foreground px-2 py-0.5">
                  {skill}
                </Badge>
              ))}
            </div>
          </BrutalCard>
        </div>
      </div>

      {/* 4. Similar Jobs Section */}
      {similarJobs.length > 0 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" /> Similar Opportunities
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {similarJobs.map((simJob) => (
              <BrutalCard
                key={simJob.id}
                onClick={() => selectJob(simJob.id)}
                className="cursor-pointer border-2 border-border bg-surface hover:-translate-y-0.5 transition-all p-3.5 brutal-shadow-xs hover:brutal-shadow-sm rounded-sm"
              >
                <h4 className="text-xs font-black uppercase truncate text-foreground leading-tight">{simJob.title}</h4>
                <p className="text-[9px] font-bold text-primary uppercase mt-1">{simJob.companyInfo.name}</p>
                <div className="flex justify-between items-center text-[8px] font-black text-foreground-muted mt-2 uppercase">
                  <span>{simJob.location}</span>
                  <span>{simJob.remoteType}</span>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      )}

      {/* 5. Recently Viewed Jobs Section */}
      {recentlyViewed.length > 1 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> Recently Viewed
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {recentlyViewed
              .filter((j) => j.id !== job.id)
              .slice(0, 5)
              .map((recJob) => (
                <Button
                  key={recJob.id}
                  variant="ghost"
                  onClick={() => selectJob(recJob.id)}
                  className="h-8 px-3 border border-border/25 rounded-sm hover:bg-surface-secondary text-[9px] font-bold text-foreground-secondary uppercase flex items-center gap-1"
                >
                  {recJob.title} <span className="text-primary font-black">@</span> {recJob.companyInfo.name}
                </Button>
              ))}
          </div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t-[3px] border-border p-3 flex gap-2.5 brutal-shadow-reverse">
        <Button
          variant="ghost"
          onClick={() => {
            toggleSaveJob(job);
            onToast(job.isSaved ? "Removed from Saved Jobs" : "Saved to Saved Jobs!");
          }}
          className="h-11 w-11 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center rounded-sm shrink-0"
          aria-label="Save job"
        >
          <Bookmark className={cn("h-5 w-5 stroke-[2.5px]", job.isSaved && "fill-primary text-primary")} />
        </Button>

        <Button
          onClick={handleApply}
          className="flex-1 h-11 text-xs font-black uppercase tracking-wide border-[3px] border-border brutal-shadow-xs bg-primary text-primary-foreground hover:bg-primary/95 flex items-center justify-center gap-1.5 rounded-sm"
        >
          Apply Now <ExternalLink className="h-4 w-4 stroke-[2.5px]" />
        </Button>
      </div>

    </div>
  );
}
