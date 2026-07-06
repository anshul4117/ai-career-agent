"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useJobsStore } from "@/features/jobs/store/jobs.store";
import { PageHeader } from "@/components/shared/page-header";
import { JobsFilter } from "@/features/jobs/components/jobs-filter";
import { JobCard } from "@/features/jobs/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Skeleton } from "@/components/ui/skeleton";
import { BrutalCard } from "@/components/ui/brutal-card";
import { 
  Search, 
  SlidersHorizontal, 
  LayoutGrid, 
  LayoutList, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  X,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function JobsPage() {
  const router = useRouter();
  const {
    jobs,
    totalCount,
    selectedJob,
    loading,
    page,
    limit,
    sorting,
    filters,
    fetchJobs,
    selectJob,
    updateFilters,
    setSorting,
    setPage,
    toggleSaveJob
  } = useJobsStore();

  // Search input state
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(filters.location);
  
  // Layout toggles
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleJobClick = (jobId: string) => {
    selectJob(jobId);
    router.push(`/jobs/${jobId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ 
      keyword: keywordInput,
      location: locationInput 
    });
  };

  const totalPages = Math.ceil(totalCount / limit);

  return (
    <div className="space-y-6 pb-12 text-left select-none relative">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white border-2 border-border p-3 text-[10px] font-black uppercase tracking-wider brutal-shadow flex items-center gap-1.5" role="alert">
          <Check className="h-4 w-4 stroke-[3px]" /> {toastMsg}
        </div>
      )}

      {/* Header */}
      <PageHeader
        title="Job Discovery"
        description="Find and filter quality-ranked career opportunities matching your profile."
      />

      {/* Search Bar Row */}
      <form onSubmit={handleSearchSubmit} className="grid gap-3 sm:flex items-center w-full">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
          <Input
            placeholder="Search roles, skills, or titles..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="pl-9 h-11 text-xs font-bold border-2 border-border"
          />
        </div>
        
        <div className="flex-1 relative">
          <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
          <Input
            placeholder="City, country or remote..."
            value={locationInput}
            onChange={(e) => setLocationInput(e.target.value)}
            className="pl-9 h-11 text-xs font-bold border-2 border-border"
          />
        </div>

        <div className="flex gap-2">
          <Button 
            type="submit" 
            className="h-11 px-6 text-xs font-black uppercase tracking-wider brutal-shadow-xs border-2 border-border"
          >
            Search
          </Button>

          <Button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden h-11 w-11 shrink-0 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="h-4 w-4 stroke-[2.5px]" />
          </Button>
        </div>
      </form>

      {/* Centered responsive layout container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start max-w-[1200px] mx-auto w-full min-w-0">
        
        {/* A. Left Filter Sidebar (Desktop Only) */}
        <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0 border-[3px] border-border brutal-shadow bg-surface p-5 rounded-sm sticky top-24">
          <JobsFilter />
        </aside>

        {/* B. Middle Job List Pane */}
        <div className="flex-1 space-y-4 min-w-0">
          
          {/* List Toolbar Controls */}
          <div className="flex justify-between items-center bg-surface p-3 border-2 border-border rounded-sm">
            <span className="text-[10px] font-black uppercase text-foreground-secondary">
              {loading ? "Searching..." : `${totalCount} Positions found`}
            </span>

            <div className="flex items-center gap-3">
              <BrutalSelect
                value={sorting}
                onChange={(e) => setSorting(e.target.value as "recent" | "match" | "salary_desc" | "salary_asc")}
                options={[
                  { label: "Most Recent", value: "recent" },
                  { label: "Match Score", value: "match" },
                  { label: "Salary: High to Low", value: "salary_desc" },
                  { label: "Salary: Low to High", value: "salary_asc" }
                ]}
                className="h-8 text-[9px] font-black uppercase tracking-wider border-2 border-border"
              />

              <div className="hidden sm:flex border-2 border-border rounded-sm overflow-hidden shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 p-0 rounded-none border-r border-border",
                    viewMode === "list" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary"
                  )}
                  aria-label="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-8 w-8 p-0 rounded-none",
                    viewMode === "grid" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Jobs Listing */}
          {loading ? (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="p-4 border-2 border-border bg-surface space-y-3 rounded-sm">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-16" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <BrutalCard className="p-8 border-[3px] border-border brutal-shadow bg-surface text-center space-y-4 rounded-sm">
              <div className="inline-flex p-3 bg-amber-100 border-2 border-border text-amber-600 rounded-sm">
                <AlertCircle className="h-8 w-8 stroke-[2.5px]" />
              </div>
              <h3 className="text-xs font-black uppercase tracking-widest text-foreground">No matches found</h3>
              <p className="text-[10px] text-foreground-muted leading-relaxed font-semibold max-w-xs mx-auto">
                Try widening your location parameters, salary limits, or adjusting keyword queries.
              </p>
              <Button onClick={() => setKeywordInput("")} variant="secondary" className="h-9 px-4 text-[10px] font-black uppercase border-2 border-border brutal-shadow-xs">
                Clear Filters
              </Button>
            </BrutalCard>
          ) : (
            <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1")}>
              {jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJob?.id === job.id}
                  onClick={() => handleJobClick(job.id)}
                  onSave={(e) => {
                    e.stopPropagation();
                    toggleSaveJob(job.id);
                    triggerToast(job.isSaved ? "Job removed from saved list" : "Job added to saved list!");
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2 border-t border-border/10">
              <Button
                variant="ghost"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-[10px] font-black uppercase text-foreground-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile Drawer Filter Dialog Bottom Sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:hidden">
          <div className="w-full max-h-[80vh] overflow-y-auto bg-surface border-t-[4px] border-border p-5 brutal-shadow space-y-4 animate-slide-up rounded-t-lg">
            <div className="flex justify-between items-center border-b border-border/10 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Filter Categories</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFilterOpen(false)}
                className="h-8 w-8 border-2 border-border hover:bg-surface-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="pb-8">
              <JobsFilter />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

// Inline fallback icon components to satisfy imports without errors
function MapPinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
