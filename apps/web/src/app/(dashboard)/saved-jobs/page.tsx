"use client";
 
import React, { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { motion, AnimatePresence } from "framer-motion";
import { SavedJobCard } from "@/features/jobs/components/saved-job-card";
import { useBookmarkStore } from "@/features/jobs/store/bookmark.store";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SavedJobSkeleton } from "@/components/ui/skeleton-loaders";
import { 
  Search, 
  Check, 
  Clock, 
  ArrowRight,
  Bookmark
} from "lucide-react";
 
export default function SavedJobsPage() {
  const router = useRouter();
  const { savedJobs, recentlyViewed, fetchSavedJobs, toggleSaveJob, loadRecentlyViewed, loading } = useBookmarkStore();
  const [, startTransition] = useTransition();
  
  // Search and Sort states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<"recent" | "company" | "title" | "posted">("recent");
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
 
  // Sorting options
  if (sortOption === "recent") {
    processedSavedJobs.sort((a, b) => new Date(b.savedAt || b.postedDate).getTime() - new Date(a.savedAt || a.postedDate).getTime());
  } else if (sortOption === "company") {
    processedSavedJobs.sort((a, b) => a.companyInfo.name.localeCompare(b.companyInfo.name));
  } else if (sortOption === "title") {
    processedSavedJobs.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortOption === "posted") {
    processedSavedJobs.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
  }
 
  const handleUnsave = (job: import("@/features/jobs/types/jobs.types").Job) => {
    // Optimistic UI updates
    startTransition(async () => {
      await toggleSaveJob(job);
      triggerToast("Job removed from saved list");
    });
  };
 
  return (
    <div className="space-y-6 pb-12 text-left select-none relative max-w-[1200px] mx-auto w-full">
      
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
 
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SavedJobSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No saved jobs"
          description="Browse the listings feed page to save interesting jobs."
          primaryAction={{
            label: "Browse Jobs Feed",
            onClick: () => router.push("/jobs")
          }}
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
                onChange={(e) => setSortOption(e.target.value as "recent" | "company" | "title" | "posted")}
                options={[
                  { label: "Recently Saved", value: "recent" },
                  { label: "Company", value: "company" },
                  { label: "Job Title", value: "title" },
                  { label: "Date Posted", value: "posted" }
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
            <motion.div layout className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {processedSavedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2, type: "spring", bounce: 0, opacity: { duration: 0.15 } }}
                  >
                    <SavedJobCard
                      job={job}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      onUnsave={async (e) => {
                        e.stopPropagation();
                        handleUnsave(job);
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}
 
      {/* Recently Viewed jobs panel */}
      {recentlyViewed.length > 0 && (
        <div className="space-y-3.5 border-t border-border/10 pt-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Clock className="h-4 w-4 text-primary" /> Recently Viewed Jobs
          </h3>
          <motion.div layout className="grid gap-3 sm:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {recentlyViewed.slice(0, 3).map((recJob) => (
                <motion.div
                  key={recJob.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <BrutalCard
                    onClick={() => router.push(`/jobs/${recJob.id}`)}
                    className="cursor-pointer border-2 border-border bg-surface p-3.5 brutal-shadow-xs hover:brutal-shadow-sm transition-all duration-200 active:scale-[0.98] rounded-sm h-full"
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
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}
 
    </div>
  );
}
