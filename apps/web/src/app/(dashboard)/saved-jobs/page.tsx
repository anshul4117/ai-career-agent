"use client";

import React, { useEffect, useState, useTransition } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { motion, AnimatePresence } from "framer-motion";
import { SavedJobCard } from "@/features/jobs/components/saved-job-card";
import { useBookmarkStore } from "@/features/jobs/store/bookmark.store";
import { useShallow } from "zustand/react/shallow";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalCard } from "@/components/ui/brutal-card";
import { SavedJobSkeleton } from "@/components/ui/skeleton-loaders";
import { Button } from "@/components/ui/button";
import {
  Search,
  Clock,
  Bookmark,
  Archive,
  X,
  FileText,
  Tag,
} from "lucide-react";
import { ProductTips } from "@/features/onboarding/components/product-tips";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SavedJobsPage() {
  const router = useRouter();
  const {
    savedJobs,
    recentlyViewed,
    fetchSavedJobs,
    toggleSaveJob,
    loadRecentlyViewed,
    loading,
    toggleArchiveJob,
    updateNotesAndLabels,
  } = useBookmarkStore(
    useShallow((state) => ({
      savedJobs: state.savedJobs,
      recentlyViewed: state.recentlyViewed,
      fetchSavedJobs: state.fetchSavedJobs,
      toggleSaveJob: state.toggleSaveJob,
      loadRecentlyViewed: state.loadRecentlyViewed,
      loading: state.loading,
      toggleArchiveJob: state.toggleArchiveJob,
      updateNotesAndLabels: state.updateNotesAndLabels,
    })),
  );
  const [, startTransition] = useTransition();

  // Search, Sort and Archive filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<
    "recent" | "company" | "title" | "posted"
  >("recent");
  const [showArchived, setShowArchived] = useState(false);

  // Edit Notes & Labels dialog state
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState("");
  const [labelsInput, setLabelsInput] = useState("");

  useEffect(() => {
    fetchSavedJobs();
    loadRecentlyViewed();
  }, [fetchSavedJobs, loadRecentlyViewed]);

  // Client-side filtering & sorting
  const processedSavedJobs = React.useMemo(() => {
    let result = [...savedJobs];

    // Filter by archive state
    result = result.filter((job) =>
      showArchived ? job.isArchived : !job.isArchived,
    );

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (job) =>
          job.title.toLowerCase().includes(q) ||
          job.companyInfo.name.toLowerCase().includes(q) ||
          job.skillsRequired.some((s) => s.toLowerCase().includes(q)) ||
          (job.notes && job.notes.toLowerCase().includes(q)) ||
          (job.labels && job.labels.some((l) => l.toLowerCase().includes(q))),
      );
    }

    // Sorting options
    if (sortOption === "recent") {
      result.sort(
        (a, b) =>
          new Date(b.savedAt || b.postedDate).getTime() -
          new Date(a.savedAt || a.postedDate).getTime(),
      );
    } else if (sortOption === "company") {
      result.sort((a, b) =>
        a.companyInfo.name.localeCompare(b.companyInfo.name),
      );
    } else if (sortOption === "title") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === "posted") {
      result.sort(
        (a, b) =>
          new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
      );
    }

    return result;
  }, [savedJobs, searchQuery, sortOption, showArchived]);

  const handleUnsave = (
    job: import("@/features/jobs/types/jobs.types").Job,
  ) => {
    startTransition(async () => {
      await toggleSaveJob(job);
      toast.success("Job removed from saved list");
    });
  };

  const handleArchiveToggle = async (
    jobId: string,
    isCurrentlyArchived: boolean,
  ) => {
    await toggleArchiveJob(jobId);
    toast.success(
      isCurrentlyArchived
        ? "Job restored from archive"
        : "Job archived successfully!",
    );
  };

  const openEditDialog = (
    job: import("@/features/jobs/types/jobs.types").Job,
  ) => {
    setEditingJobId(job.id);
    setNotesInput(job.notes || "");
    setLabelsInput(job.labels ? job.labels.join(", ") : "");
  };

  const saveNotesAndLabels = async () => {
    if (!editingJobId) return;
    const parsedLabels = labelsInput
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    await updateNotesAndLabels(editingJobId, notesInput, parsedLabels);
    setEditingJobId(null);
    toast.success("Saved notes and labels!");
  };

  return (
    <div className="space-y-6 pb-12 text-left select-none relative max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <PageHeader
        title="Saved Jobs"
        description="Review, search, and manage the opportunities you've bookmarked."
      />

      <ProductTips tipId="first-job-saved" />

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
            onClick: () => router.push("/jobs"),
          }}
        />
      ) : (
        <div className="space-y-6">
          {/* Search, Sort & Archive Toggle Toolbar */}
          <div className="grid gap-3 md:flex justify-between items-center bg-surface p-3.5 border-2 border-border rounded-sm">
            <div className="flex-1 relative max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
              <Input
                placeholder="Search within saved listings..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-9 text-xs font-bold border-2 border-border"
              />
            </div>

            <div className="flex items-center gap-3 shrink-0 flex-wrap">
              <Button
                onClick={() => setShowArchived(!showArchived)}
                className={cn(
                  "h-9 px-3.5 text-[9px] font-black uppercase border-2 border-border brutal-shadow-xs flex items-center gap-1.5",
                  showArchived
                    ? "bg-accent text-foreground brutal-shadow"
                    : "bg-surface text-foreground",
                )}
              >
                <Archive className="h-3.5 w-3.5" />
                {showArchived ? "View Active Saved" : "View Archived"}
              </Button>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-foreground-muted">
                  Sort:
                </span>
                <BrutalSelect
                  value={sortOption}
                  onChange={(e) =>
                    setSortOption(
                      e.target.value as
                        "recent" | "company" | "title" | "posted",
                    )
                  }
                  options={[
                    { label: "Recently Saved", value: "recent" },
                    { label: "Company", value: "company" },
                    { label: "Job Title", value: "title" },
                    { label: "Date Posted", value: "posted" },
                  ]}
                  className="h-9 text-[9px] font-black uppercase border-2 border-border w-40"
                />
              </div>
            </div>
          </div>

          {/* Results Grid */}
          {processedSavedJobs.length === 0 ? (
            <BrutalCard className="p-8 border-2 border-border text-center rounded-sm bg-surface-secondary/5">
              <p className="text-[10px] font-bold text-foreground-muted uppercase tracking-wider">
                {showArchived
                  ? "No archived listings found."
                  : "No active saved listings found. Try adjusting query or check the archive."}
              </p>
            </BrutalCard>
          ) : (
            <motion.div
              layout
              className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {processedSavedJobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{
                      duration: 0.2,
                      type: "spring",
                      bounce: 0,
                      opacity: { duration: 0.15 },
                    }}
                  >
                    <SavedJobCard
                      job={job}
                      onClick={() => router.push(`/jobs/${job.id}`)}
                      onUnsave={async (e) => {
                        e.stopPropagation();
                        handleUnsave(job);
                      }}
                      onArchiveToggle={(e) => {
                        e.stopPropagation();
                        handleArchiveToggle(job.id, !!job.isArchived);
                      }}
                      onEditNotesAndLabels={(e) => {
                        e.stopPropagation();
                        openEditDialog(job);
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
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-surface border-2 border-border p-3 rounded-sm text-left hover:-translate-y-0.5 hover:brutal-shadow brutal-shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                  onClick={() => router.push(`/jobs/${recJob.id}`)}
                >
                  <div>
                    <h4 className="text-[10px] font-black uppercase truncate text-foreground leading-tight">
                      {recJob.title}
                    </h4>
                    <p className="text-[8px] font-bold uppercase text-primary tracking-wider truncate mt-0.5">
                      {recJob.companyInfo.name}
                    </p>
                    <p className="text-[8px] font-bold text-foreground-muted mt-1 leading-normal line-clamp-2">
                      {recJob.description}
                    </p>
                  </div>
                  <div className="border-t border-border/10 mt-2.5 pt-1.5 flex items-center justify-between text-[7px] font-black uppercase tracking-widest text-foreground-muted">
                    <span>{recJob.location}</span>
                    <span className="text-primary font-extrabold">
                      {recJob.remoteType}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      )}

      {/* Edit Notes & Labels Modal Overlay */}
      {editingJobId !== null && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface border-[3px] border-border brutal-shadow p-5 rounded-none space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-primary" /> Notes & Labels
                Workspace
              </h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingJobId(null)}
                className="h-8 w-8 border-2 border-border hover:bg-surface-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Note Textarea Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black uppercase tracking-wider text-foreground-secondary flex items-center gap-1">
                Candidate Notes
              </label>
              <textarea
                placeholder="Write any personal notes (e.g. interview dates, recruiter info)..."
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                className="w-full h-24 p-2.5 text-xs font-bold border-2 border-border rounded-none bg-surface text-foreground focus:ring-0 focus:outline-none placeholder-foreground-muted/50"
              />
            </div>

            {/* Labels Input */}
            <div className="space-y-1.5 text-left">
              <label className="text-[9px] font-black uppercase tracking-wider text-foreground-secondary flex items-center gap-1">
                <Tag className="h-3 w-3 inline text-primary" /> Categorization
                Labels
              </label>
              <Input
                placeholder="Enter labels separated by commas (e.g. Applied, High Salary, Follow-up)"
                value={labelsInput}
                onChange={(e) => setLabelsInput(e.target.value)}
                className="h-9 text-xs font-bold border-2 border-border rounded-none"
              />
              <p className="text-[7.5px] font-semibold text-foreground-muted uppercase tracking-tight">
                Separating multiple labels using comma.
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-2 justify-end pt-2 border-t border-border/10">
              <Button
                onClick={saveNotesAndLabels}
                className="h-9 px-4 text-xs font-black uppercase bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow"
              >
                Save Changes
              </Button>
              <Button
                onClick={() => setEditingJobId(null)}
                variant="ghost"
                className="h-9 px-3 text-xs font-black uppercase border border-border/20 hover:bg-surface-secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
