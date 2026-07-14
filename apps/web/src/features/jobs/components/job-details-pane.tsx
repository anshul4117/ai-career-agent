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
import { useQualityStore } from "../store/quality.store";
import { useMatchStore } from "../store/match.store";
import { toast } from "sonner";
import { useProfileStore } from "@/features/profile";
import { 
  Bookmark, 
  ExternalLink, 
  Share2, 
  MapPin, 
  Clock, 
  TrendingUp,
  Globe,
  Building2,
  HelpCircle,
  RefreshCw
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

interface JobDetailsPaneProps {
  job: Job;
}

export function JobDetailsPane({ job }: JobDetailsPaneProps) {
  const { selectJob } = useJobsStore();
  const { toggleSaveJob, addRecentlyViewed, recentlyViewed } = useBookmarkStore();
  const [similarJobs, setSimilarJobs] = useState<Job[]>([]);
  const [companyDetails, setCompanyDetails] = useState<Company | null>(null);
 
  const { reports, loading: qualityLoading, errors: qualityErrors, calculateJobQuality } = useQualityStore();
  const { matches, loading: matchLoading, errors: matchErrors, calculateMatch } = useMatchStore();
  const profileState = useProfileStore();
 
  useEffect(() => {
    const loadQuality = async () => {
      const allJobs = await jobService.getAllJobs();
      await calculateJobQuality(job, allJobs);
    };
    loadQuality();
  }, [job, calculateJobQuality]);
 
  const report = reports[job.id];
  const isQloading = !!qualityLoading[job.id];
  const qError = qualityErrors[job.id];
 
  useEffect(() => {
    const loadMatchData = async () => {
      if (!report || !profileState.profile) return;
      await calculateMatch(job, {
        skills: profileState.skills,
        education: profileState.education,
        preferences: profileState.preferences,
        profile: profileState.profile
      }, report.overallScore);
    };
    loadMatchData();
  }, [
    job,
    report,
    profileState.profile,
    profileState.skills,
    profileState.education,
    profileState.preferences,
    calculateMatch
  ]);
 
  const handleRecalculate = async () => {
    const allJobs = await jobService.getAllJobs();
    await calculateJobQuality(job, allJobs, true);
    
    const latestQualityReport = useQualityStore.getState().reports[job.id];
    const latestQualityScore = latestQualityReport ? latestQualityReport.overallScore : 80;
 
    if (profileState.profile) {
      await calculateMatch(job, {
        skills: profileState.skills,
        education: profileState.education,
        preferences: profileState.preferences,
        profile: profileState.profile
      }, latestQualityScore, true);
    }
    toast.success("AI match and quality metrics refreshed!");
  };

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
      toast.success("Shareable job link copied to clipboard!");
    }
  };

  const handleApply = () => {
    toast.info(`Redirecting to ${job.companyInfo.name} application site...`);
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
              toast.success(job.isSaved ? "Removed from Saved Jobs" : "Saved to Saved Jobs!");
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
 
          {/* AI Match Insights */}
          {matchLoading[job.id] ? (
            <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-4">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                Evaluating AI Match Analytics...
              </h3>
              <div className="space-y-3">
                <div className="h-6 bg-slate-200 animate-pulse rounded-sm w-3/4" />
                <div className="h-4 bg-slate-200 animate-pulse rounded-sm w-1/2" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-10 bg-slate-200 animate-pulse rounded-sm w-full" />
                  <div className="h-10 bg-slate-200 animate-pulse rounded-sm w-full animate-none" />
                </div>
              </div>
            </BrutalCard>
          ) : matchErrors[job.id] ? (
            <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm text-center py-6">
              <p className="text-xs font-bold text-error uppercase mb-2">Match analysis could not be retrieved.</p>
              <Button 
                onClick={handleRecalculate}
                className="h-8 text-[9px] font-black uppercase border border-border/20 rounded-sm hover:bg-surface-secondary"
              >
                Re-Run Match Audit
              </Button>
            </BrutalCard>
          ) : matches[job.id] ? (() => {
            const matchReport = matches[job.id];
            return (
              <div className="space-y-6">
                {/* 1. Match Breakdown Progress Indicators */}
                <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-4 flex justify-between items-center">
                    <span>AI Match Score Breakdown</span>
                    <span className={cn(
                      "font-black text-[9px] uppercase border px-1.5 py-0.5 rounded-sm shadow-none",
                      matchReport.overallScore >= 90 && "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30",
                      matchReport.overallScore >= 80 && "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30",
                      matchReport.overallScore >= 70 && "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
                      matchReport.overallScore >= 50 && "bg-gray-50 dark:bg-surface-secondary text-gray-700 dark:text-foreground-secondary border-gray-300",
                      matchReport.overallScore < 50 && "bg-red-50 text-red-700 border-red-300"
                    )}>
                      {matchReport.overallScore}% {matchReport.overallLabel}
                    </span>
                  </h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2">
                    {/* Skills Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Skills Overlap</span>
                        <span>{matchReport.skills.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.skills.score} aria-valuemin={0} aria-valuemax={100} aria-label="Skills Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.skills.score}%` }} />
                      </div>
                    </div>
 
                    {/* Experience Level Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Experience Level</span>
                        <span>{matchReport.experience.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.experience.score} aria-valuemin={0} aria-valuemax={100} aria-label="Experience Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.experience.score}%` }} />
                      </div>
                    </div>
 
                    {/* Location Match Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Location Preferences</span>
                        <span>{matchReport.location.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.location.score} aria-valuemin={0} aria-valuemax={100} aria-label="Location Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.location.score}%` }} />
                      </div>
                    </div>
 
                    {/* Salary Targets Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Compensation Range</span>
                        <span>{matchReport.salary.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.salary.score} aria-valuemin={0} aria-valuemax={100} aria-label="Salary Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.salary.score}%` }} />
                      </div>
                    </div>
 
                    {/* Education Matching Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Education Align</span>
                        <span>{matchReport.education.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.education.score} aria-valuemin={0} aria-valuemax={100} aria-label="Education Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.education.score}%` }} />
                      </div>
                    </div>
 
                    {/* Job Quality Score Progress */}
                    <div className="space-y-1">
                      <div className="flex justify-between items-center text-[9px] font-bold uppercase">
                        <span>Listing Trust & Quality</span>
                        <span>{matchReport.quality.score}%</span>
                      </div>
                      <div className="h-2.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/25 rounded-sm overflow-hidden" role="progressbar" aria-valuenow={matchReport.quality.score} aria-valuemin={0} aria-valuemax={100} aria-label="Job Quality Match Progress">
                        <div className="h-full bg-primary" style={{ width: `${matchReport.quality.score}%` }} />
                      </div>
                    </div>
                  </div>
                </BrutalCard>
 
                {/* 2. Fit Reasons and Skills Analysis Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Why This Job Card */}
                  <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
                      Why This Job?
                    </h3>
                    <ul className="space-y-2 text-xs font-semibold leading-relaxed">
                      {matchReport.reasons.map((reason, idx) => (
                        <li key={idx} className="flex gap-2 items-start leading-tight">
                          <span className={cn("shrink-0 font-extrabold text-[9px] leading-none", reason.met ? "text-green-600 dark:text-green-400" : "text-red-500")}>
                            {reason.met ? "✓" : "✗"}
                          </span>
                          <span className={reason.met ? "text-foreground-secondary" : "text-foreground-muted"}>
                            {reason.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </BrutalCard>
 
                  {/* Skill Gap Analysis Card */}
                  <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-3.5">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-1">
                      Skills Gap Analysis
                    </h3>
                    
                    {/* Matched Skills */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-foreground-muted uppercase block">Matched Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {matchReport.skills.matched.length > 0 ? matchReport.skills.matched.map((s) => (
                          <Badge key={s} className="text-[7.5px] font-bold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-500/30 shadow-none px-1.5 py-0.5 rounded-sm">
                            {s}
                          </Badge>
                        )) : <span className="text-[8px] font-bold text-foreground-muted italic">No matching skills found.</span>}
                      </div>
                    </div>
 
                    {/* Missing Skills */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-foreground-muted uppercase block">Missing Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {matchReport.skills.missing.length > 0 ? matchReport.skills.missing.map((s) => (
                          <Badge key={s} className="text-[7.5px] font-bold bg-red-50 text-red-700 border border-red-300 shadow-none px-1.5 py-0.5 rounded-sm">
                            {s}
                          </Badge>
                        )) : <span className="text-[8px] font-bold text-foreground-muted italic">None! You possess all required skills.</span>}
                      </div>
                    </div>
 
                    {/* Additional Skills */}
                    <div className="space-y-1">
                      <span className="text-[8px] font-black text-foreground-muted uppercase block">Additional Preferred Skills</span>
                      <div className="flex flex-wrap gap-1">
                        {matchReport.skills.additional.slice(0, 6).map((s) => (
                          <Badge key={s} className="text-[7.5px] font-bold bg-surface border border-border/20 text-foreground-secondary shadow-none px-1.5 py-0.5 rounded-sm">
                            {s}
                          </Badge>
                        ))}
                        {matchReport.skills.additional.length > 6 && (
                          <span className="text-[8px] font-bold text-foreground-muted">+{matchReport.skills.additional.length - 6} more</span>
                        )}
                      </div>
                    </div>
                  </BrutalCard>
                </div>
 
                {/* 3. Learning Recommendations */}
                {matchReport.recommendations.length > 0 && (
                  <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3">
                      Recommended Upskilling Roadmap
                    </h3>
                    <div className="grid gap-3.5 sm:grid-cols-2">
                      {matchReport.recommendations.map((rec, idx) => (
                        <div key={idx} className="p-3 border border-border/20 rounded-sm bg-surface-secondary/20 flex gap-2.5 items-start">
                          <div className="h-5 w-5 bg-primary border border-border rounded-sm flex items-center justify-center text-white text-[9px] font-black shrink-0">
                            {idx + 1}
                          </div>
                          <div className="space-y-0.5 leading-snug">
                            <span className="text-[8px] font-black text-primary uppercase block">Topic Recommendation</span>
                            <span className="text-[10px] font-semibold text-foreground-secondary">{rec}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </BrutalCard>
                )}
              </div>
            );
          })() : null}
 
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

        {/* Right Column: Quality Assessment & Skills */}
        <div className="space-y-6">
          
          {/* Quality Card */}
          <BrutalCard className="border-2 border-border bg-surface p-5 rounded-sm space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                Job Quality Score
              </h3>
              {/* Tooltip Wrapper */}
              <div className="relative group inline-block">
                <button
                  type="button"
                  className="p-1 hover:bg-surface-secondary rounded-sm transition-all focus:outline-none"
                  aria-label="How is this score calculated?"
                >
                  <HelpCircle className="h-3.5 w-3.5 text-foreground-muted stroke-[2.5px]" />
                </button>
                <div className="absolute right-0 top-full mt-1.5 w-56 bg-foreground text-surface p-3 text-[8.5px] leading-relaxed brutal-shadow border-2 border-border hidden group-hover:block group-focus-within:block z-30 font-bold uppercase rounded-sm">
                  <p className="border-b border-border/20 pb-1 mb-1 text-accent">Scoring Engine Metrics</p>
                  <ul className="space-y-1 normal-case font-semibold text-slate-200">
                    <li className="flex items-start gap-1"><span className="text-accent font-black">•</span><span><strong>Freshness (40%)</strong>: Age of posting. Expired past 30 days.</span></li>
                    <li className="flex items-start gap-1"><span className="text-accent font-black">•</span><span><strong>Trust (60%)</strong>: Evaluates site links, logo presence, descriptions, and recruiters.</span></li>
                    <li className="flex items-start gap-1"><span className="text-accent font-black">•</span><span><strong>Duplicates Penalty</strong>: Deduplication filters cap overall score to Poor.</span></li>
                  </ul>
                </div>
              </div>
            </div>
 
            {isQloading ? (
              <div className="space-y-3 py-1">
                <div className="h-6 bg-slate-200 animate-pulse rounded-sm w-3/4" />
                <div className="h-3 bg-slate-200 animate-pulse rounded-sm w-full" />
                <div className="h-10 bg-slate-200 animate-pulse rounded-sm w-full animate-none" />
              </div>
            ) : qError ? (
              <div className="space-y-2.5 py-1 text-center">
                <p className="text-[9px] font-bold text-error uppercase">{qError}</p>
                <Button 
                  onClick={handleRecalculate}
                  className="h-8 text-[9px] font-black uppercase border border-border/20 rounded-sm w-full hover:bg-surface-secondary"
                >
                  Retry Audit
                </Button>
              </div>
            ) : report ? (
              <div className="space-y-4">
                {/* Overall Score Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span>Overall rating</span>
                    <span className={cn(
                      "font-black text-xs px-1.5 py-0.5 border border-border rounded-sm brutal-shadow-xs",
                      report.overallLabel === "Excellent" && "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
                      report.overallLabel === "Very Good" && "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400",
                      report.overallLabel === "Good" && "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
                      report.overallLabel === "Average" && "bg-gray-100 text-gray-700 dark:text-foreground-secondary",
                      report.overallLabel === "Poor" && "bg-red-100 text-red-700"
                    )}>
                      {report.overallLabel} ({report.overallScore}%)
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 dark:bg-surface-hover border border-border/40 rounded-sm overflow-hidden relative">
                    <div 
                      className={cn(
                        "h-full transition-all duration-500",
                        report.overallScore >= 80 ? "bg-green-500" :
                        report.overallScore >= 60 ? "bg-blue-500" :
                        report.overallScore >= 40 ? "bg-amber-500" : "bg-red-500"
                      )}
                      style={{ width: `${report.overallScore}%` }}
                    />
                  </div>
                </div>
 
                {/* Score breakdown metrics */}
                <div className="space-y-2 border-t border-border/10 pt-3 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary">
                  <div className="flex justify-between items-center">
                    <span>Freshness:</span>
                    <Badge className="text-[7.5px] font-black bg-surface-secondary border border-border/20 text-foreground px-1 py-0.5 rounded-sm">
                      {report.freshnessLabel} ({report.freshnessCategory})
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Trust Factor:</span>
                    <Badge className="text-[7.5px] font-black bg-surface-secondary border border-border/20 text-foreground px-1 py-0.5 rounded-sm">
                      {report.trustLabel} ({report.trustScore}%)
                    </Badge>
                  </div>
                </div>
 
                {/* Duplicate Status */}
                <div className="border-t border-border/10 pt-3 flex flex-col gap-1 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary">
                  <div className="flex justify-between items-center">
                    <span>Duplicate Checks:</span>
                    <Badge className={cn(
                      "text-[7.5px] font-black border px-1 py-0.5 rounded-sm shadow-none",
                      report.duplicateStatus === "Unique" && "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30",
                      report.duplicateStatus === "Possible Duplicate" && "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
                      report.duplicateStatus === "Duplicate" && "bg-red-50 text-red-700 border-red-300"
                    )}>
                      {report.duplicateStatus}
                    </Badge>
                  </div>
                  <span className="text-[8px] font-semibold text-foreground-muted normal-case leading-snug">
                    {report.duplicateReason}
                  </span>
                </div>
 
                {/* Verified Trust checklist */}
                <details className="text-[9px] font-black uppercase text-foreground-secondary border-t border-border/10 pt-3 cursor-pointer group">
                  <summary className="list-none flex justify-between items-center font-black select-none outline-none">
                    <span>Trust Signals Breakdown</span>
                    <span className="text-primary group-open:rotate-180 transition-transform">▼</span>
                  </summary>
                  <ul className="space-y-1.5 mt-3 text-[8px] font-semibold normal-case">
                    {report.trustFactors.map((factor) => (
                      <li key={factor.name} className="flex items-start gap-1.5 leading-tight">
                        <span className={cn("shrink-0 font-extrabold text-[9px] leading-none", factor.met ? "text-green-600 dark:text-green-400" : "text-slate-400")}>
                          {factor.met ? "✓" : "✗"}
                        </span>
                        <div className="flex flex-col text-[8.5px]">
                          <span className={cn("font-bold uppercase text-[7.5px]", factor.met ? "text-foreground" : "text-foreground-muted")}>{factor.name}</span>
                          <span className="text-foreground-muted leading-tight mt-0.5">{factor.met ? factor.description : `${factor.name} was not found on this listing.`}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </details>
 
                <Button
                  variant="ghost"
                  onClick={handleRecalculate}
                  className="w-full h-8 border border-border/20 hover:bg-surface-secondary text-[9px] font-black uppercase flex items-center justify-center gap-1.5 rounded-sm transition-all mt-2.5"
                >
                  <RefreshCw className="h-3 w-3 animate-none" /> Recalculate Quality
                </Button>
              </div>
            ) : (
              <div className="text-center py-2">
                <Button 
                  onClick={handleRecalculate}
                  className="h-8 text-[9px] font-black uppercase border border-border/20 rounded-sm w-full hover:bg-surface-secondary"
                >
                  Run Quality Check
                </Button>
              </div>
            )}
          </BrutalCard>
 
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
          <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 sm:grid-cols-3">
            {similarJobs.map((simJob) => (
              <motion.div variants={item} key={simJob.id} className="h-full">
                <BrutalCard
                  onClick={() => selectJob(simJob.id)}
                  className="cursor-pointer border-2 border-border bg-surface hover:-translate-y-0.5 transition-all p-3.5 brutal-shadow-xs hover:brutal-shadow-sm rounded-sm h-full flex flex-col"
                >
                  <h4 className="text-xs font-black uppercase truncate text-foreground leading-tight">{simJob.title}</h4>
                  <p className="text-[9px] font-bold text-primary uppercase mt-1">{simJob.companyInfo.name}</p>
                  <div className="flex justify-between items-center text-[8px] font-black text-foreground-muted mt-auto pt-2 uppercase">
                    <span>{simJob.location}</span>
                    <span>{simJob.remoteType}</span>
                  </div>
                </BrutalCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      )}

      {/* 5. Recently Viewed Jobs Section */}
      {recentlyViewed.length > 1 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> Recently Viewed
          </h3>
          <motion.div variants={container} initial="hidden" animate="show" className="flex flex-wrap gap-2.5">
            {recentlyViewed
              .filter((j) => j.id !== job.id)
              .slice(0, 5)
              .map((recJob) => (
                <motion.div variants={item} key={recJob.id}>
                  <Button
                    variant="ghost"
                    onClick={() => selectJob(recJob.id)}
                    className="h-8 px-3 border border-border/25 rounded-sm hover:bg-surface-secondary text-[9px] font-bold text-foreground-secondary uppercase flex items-center gap-1"
                  >
                    {recJob.title} <span className="text-primary font-black">@</span> {recJob.companyInfo.name}
                  </Button>
                </motion.div>
              ))}
          </motion.div>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t-[3px] border-border p-3 flex gap-2.5 brutal-shadow-reverse">
        <Button
          variant="ghost"
          onClick={() => {
            toggleSaveJob(job);
            toast.success(job.isSaved ? "Removed from Saved Jobs" : "Saved to Saved Jobs!");
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
