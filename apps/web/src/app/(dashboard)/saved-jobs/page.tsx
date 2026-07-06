"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { JobCard } from "@/features/jobs/components/job-card";
import { useBookmarkStore } from "@/features/jobs/store/bookmark.store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalCard } from "@/components/ui/brutal-card";
import { 
  Search, 
  Check, 
  Clock, 
  ArrowRight
} from "lucide-react";

export default function SavedJobsPage() {
  const router = useRouter();
  const { savedJobs, recentlyViewed, fetchSavedJobs, toggleSaveJob, loadRecentlyViewed } = useBookmarkStore();
  
  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"recent" | "match" | "salary">("recent");
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    fetchSavedJobs();
    loadRecentlyViewed();
  }, [fetchSavedJobs, loadRecentlyViewed]);

  // Client-side filtering & sorting
  let processedSavedJobs = [...savedJobs];

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    processedSavedJobs = processedSavedJobs.filter(
      (job) => job.title.toLowerCase().includes(q) || 
               job.companyInfo.name.toLowerCase().includes(q) ||
               job.skillsRequired.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (sortOption === "recent") {
    processedSavedJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  } else if (sortOption === "match") {
    processedSavedJobs.sort((a, b) => b.trustScore - a.trustScore);
  } else if (sortOption === "salary") {
    processedSavedJobs.sort((a, b) => (b.salaryMax || 0) - (a.salaryMax || 0));
  }

  return (
    <div className="space-y-6 pb-12 text-left select-none relative">
      
      {/* Toast Alert Banner */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white border-2 border-border p-3 text-[10px] font-black uppercase tracking-wider brutal-shadow flex items-center gap-1.5" role="alert">
          <Check className="h-4 w-4 stroke-[3px]" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Saved Jobs"
        description="Review, search, and manage the opportunities you've bookmarked."
      />

      {savedJobs.length === 0 ? (
        <EmptyState
          title="No saved jobs"
          description="Browse the listings feed page to save interesting jobs."
          actionLabel="Browse Jobs Feed"
          actionHref="/jobs"
        />
      ) : (
        <div className="space-y-6">
          
          {/* Search and Sort Toolbar */}
          <div className="grid gap-3 sm:flex justify-between items-center bg-surface p-3 border-2 border-border rounded-sm">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
              <Input
                placeholder="Search within saved listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs font-bold border-2 border-border"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[10px] font-black uppercase text-foreground-muted">Sort:</span>
              <BrutalSelect
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as "recent" | "match" | "salary")}
                options={[
                  { label: "Date Saved", value: "recent" },
                  { label: "Match Score", value: "match" },
                  { label: "Salary Limit", value: "salary" }
                ]}
                className="h-9 text-[9px] font-black uppercase border-2 border-border w-40"
              />
            </div>
          </div>

          {/* Results Grid */}
          {processedSavedJobs.length === 0 ? (
            <BrutalCard className="p-8 border-2 border-border text-center rounded-sm bg-surface-secondary/5">
              <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                No matching saved jobs found. Try adjusting query keyword.
              </p>
            </BrutalCard>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              {processedSavedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={false}
                  onClick={() => router.push(`/jobs/${job.id}`)}
                  onSave={async (e) => {
                    e.stopPropagation();
                    await toggleSaveJob(job);
                    triggerToast("Job removed from saved list");
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recently Viewed jobs panel */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> Recently Viewed Jobs
          </h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {recentlyViewed.slice(0, 3).map((recJob) => (
              <BrutalCard
                key={recJob.id}
                onClick={() => router.push(`/jobs/${recJob.id}`)}
                className="cursor-pointer border-2 border-border bg-surface p-3.5 brutal-shadow-xs hover:brutal-shadow-sm rounded-sm"
              >
                <h4 className="text-xs font-black uppercase truncate text-foreground leading-tight">{recJob.title}</h4>
                <p className="text-[9px] font-bold text-primary uppercase mt-1">{recJob.companyInfo.name}</p>
                <div className="flex justify-between items-center text-[8px] font-black text-foreground-muted mt-2 uppercase">
                  <span>{recJob.location}</span>
                  <span className="text-primary font-black flex items-center gap-0.5">
                    View <ArrowRight className="h-2.5 w-2.5" />
                  </span>
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
