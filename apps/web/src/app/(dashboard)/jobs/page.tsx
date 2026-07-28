"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useJobsStore } from "@/features/jobs/store/jobs.store";
import { useShallow } from "zustand/react/shallow";
import { motion, AnimatePresence } from "framer-motion";
import { PageHeader } from "@/components/shared/page-header";
import { JobsFilter } from "@/features/jobs/components/jobs-filter";
import { JobCard } from "@/features/jobs/components/job-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { EmptyState } from "@/components/ui/empty-state";
import { Heading } from "@/components/ui/typography";
import { JobsSkeleton } from "@/components/ui/skeleton-loaders";
import { toast } from "sonner";
import {
  Search,
  SlidersHorizontal,
  LayoutGrid,
  LayoutList,
  ChevronLeft,
  ChevronRight,
  X,
  Bookmark,
  History,
  TrendingUp,
  Save,
  Sparkles,
  ArrowRightLeft,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { mockJobs } from "@/features/jobs/mock/jobs-data";

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
    toggleSaveJob,
    recentSearches,
    savedSearches,
    popularSearches,
    addRecentSearch,
    saveSearch,
    removeSavedSearch,
    comparedJobIds,
    compareJobs,
    resetFilters,
  } = useJobsStore(
    useShallow((state) => ({
      jobs: state.jobs,
      totalCount: state.totalCount,
      selectedJob: state.selectedJob,
      loading: state.loading,
      page: state.page,
      limit: state.limit,
      sorting: state.sorting,
      filters: state.filters,
      fetchJobs: state.fetchJobs,
      selectJob: state.selectJob,
      updateFilters: state.updateFilters,
      setSorting: state.setSorting,
      setPage: state.setPage,
      toggleSaveJob: state.toggleSaveJob,
      recentSearches: state.recentSearches,
      savedSearches: state.savedSearches,
      popularSearches: state.popularSearches,
      addRecentSearch: state.addRecentSearch,
      saveSearch: state.saveSearch,
      removeSavedSearch: state.removeSavedSearch,
      comparedJobIds: state.comparedJobIds || [],
      compareJobs: state.compareJobs,
      resetFilters: state.resetFilters,
    })),
  );

  // Search input state
  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [locationInput, setLocationInput] = useState(filters.location);

  // Layout toggles
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isComparingOpen, setIsComparingOpen] = useState(false);

  // Save Search popup state
  const [isSaveSearchOpen, setIsSaveSearchOpen] = useState(false);
  const [searchNameInput, setSearchNameInput] = useState("");

  // Load initial jobs
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  // Sync local keyword/location inputs if filters state is restored/changed
  useEffect(() => {
    setKeywordInput(filters.keyword);
    setLocationInput(filters.location);
  }, [filters.keyword, filters.location]);

  // Scroll Restoration Logic
  useEffect(() => {
    if (!loading && jobs.length > 0) {
      const savedScroll = sessionStorage.getItem("jobs_scroll_position");
      if (savedScroll) {
        const scrollY = parseInt(savedScroll, 10);
        setTimeout(() => {
          window.scrollTo({ top: scrollY, behavior: "instant" });
          sessionStorage.removeItem("jobs_scroll_position");
        }, 150);
      }
    }
  }, [loading, jobs]);

  const handleJobClick = (jobId: string) => {
    sessionStorage.setItem("jobs_scroll_position", window.scrollY.toString());
    selectJob(jobId);
    router.push(`/jobs/${jobId}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      keyword: keywordInput,
      location: locationInput,
    });
    if (keywordInput.trim()) {
      addRecentSearch(keywordInput);
    }
  };

  const handlePillClick = (query: string) => {
    setKeywordInput(query);
    updateFilters({ keyword: query });
    addRecentSearch(query);
  };

  const handleLoadSavedSearch = (saved: (typeof savedSearches)[number]) => {
    updateFilters(saved.filters);
    toast.success(`Loaded search: "${saved.name}"`);
  };

  const handleSaveSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = searchNameInput.trim();
    if (name) {
      saveSearch(name);
      setSearchNameInput("");
      setIsSaveSearchOpen(false);
      toast.success("Search filters saved!");
    }
  };

  const handleRemoveFilter = (
    key: keyof typeof filters,
    value?: string | number,
  ) => {
    if (
      key === "experienceLevel" ||
      key === "remoteType" ||
      key === "employmentType"
    ) {
      const current = filters[key] as string[];
      updateFilters({ [key]: current.filter((x) => x !== value) });
    } else if (key === "skills") {
      const current = filters[key] as string[];
      updateFilters({ [key]: current.filter((s) => s !== value) });
    } else if (key === "salaryMin") {
      updateFilters({ salaryMin: null });
    } else if (key === "matchScoreMin") {
      updateFilters({ matchScoreMin: null });
    } else if (key === "matchFilter") {
      updateFilters({ matchFilter: "all" });
    } else if (key === "datePosted") {
      updateFilters({ datePosted: "any" });
    } else if (key === "easyApply") {
      updateFilters({ easyApply: false });
    } else {
      updateFilters({ [key]: "" });
    }
  };

  // Check if any filter is active
  const hasActiveFilters =
    filters.keyword ||
    filters.location ||
    filters.company ||
    filters.industry ||
    filters.experienceLevel.length > 0 ||
    filters.remoteType.length > 0 ||
    filters.employmentType.length > 0 ||
    filters.salaryMin !== null ||
    filters.skills.length > 0 ||
    filters.datePosted !== "any" ||
    filters.easyApply ||
    filters.matchScoreMin !== null ||
    (filters.matchFilter && filters.matchFilter !== "all");

  const totalPages = Math.ceil(totalCount / limit);

  // Get compared jobs details
  const comparedJobs = useMemo(() => {
    return mockJobs.filter((j) => comparedJobIds.includes(j.id));
  }, [comparedJobIds]);

  return (
    <div className="space-y-5 pb-24 text-left select-none relative max-w-[1200px] mx-auto w-full">
      {/* Header */}
      <PageHeader
        title="Job Discovery"
        description="Find and filter quality-ranked career opportunities matching your profile."
      />

      {/* Stats Widgets Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-2 border-border p-4 bg-surface-secondary/40 brutal-shadow-sm">
        <div className="space-y-1">
          <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
            Total Active Jobs
          </p>
          <p className="font-mono text-base font-black text-foreground">
            {mockJobs.length}
          </p>
        </div>
        <div className="space-y-1 border-l-2 border-border/10 pl-4">
          <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
            New Openings Today
          </p>
          <p className="font-mono text-base font-black text-primary">
            12 opportunities
          </p>
        </div>
        <div className="space-y-1 border-l-2 border-border/10 pl-4">
          <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
            Remote-First Jobs
          </p>
          <p className="font-mono text-base font-black text-foreground">
            {mockJobs.filter((j) => j.remoteType === "remote").length} roles
          </p>
        </div>
        <div className="space-y-1 border-l-2 border-border/10 pl-4">
          <p className="text-[9px] uppercase font-bold text-foreground-secondary tracking-tight">
            Your Saved Jobs
          </p>
          <p className="font-mono text-base font-black text-foreground">
            {jobs.filter((j) => j.isSaved).length} bookmarked
          </p>
        </div>
      </div>

      {/* Search Bar Row */}
      <div className="space-y-3">
        <form
          onSubmit={handleSearchSubmit}
          className="grid gap-3 sm:flex items-center w-full"
        >
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
            <Input
              placeholder="Search roles, skills, or titles..."
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              className="pl-9 h-10 text-xs font-bold border-2 border-border"
            />
          </div>

          <div className="flex-1 relative">
            <MapPinIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
            <Input
              placeholder="City, country or remote..."
              value={locationInput}
              onChange={(e) => setLocationInput(e.target.value)}
              className="pl-9 h-10 text-xs font-bold border-2 border-border"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="submit"
              className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs border-2 border-border bg-primary text-white hover:brutal-shadow"
            >
              Search
            </Button>

            <Button
              type="button"
              onClick={() => setIsSaveSearchOpen(true)}
              className="h-10 w-10 shrink-0 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center rounded-sm"
              aria-label="Save current search criteria"
              title="Save search"
            >
              <Save className="h-4 w-4 stroke-[2.5px]" />
            </Button>

            <Button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden h-10 w-10 shrink-0 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center rounded-sm"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-4 w-4 stroke-[2.5px]" />
            </Button>
          </div>
        </form>

        {/* Inline Save Search Dialog Box */}
        {isSaveSearchOpen && (
          <form
            onSubmit={handleSaveSearchSubmit}
            className="flex gap-2 bg-surface p-2.5 border-2 border-border rounded-sm max-w-md"
          >
            <Input
              required
              placeholder="Name this search configuration..."
              value={searchNameInput}
              onChange={(e) => setSearchNameInput(e.target.value)}
              className="h-8 text-xs font-bold border border-border flex-1"
            />
            <Button
              type="submit"
              size="sm"
              className="h-8 text-[10px] font-black uppercase bg-accent text-foreground border border-border"
            >
              Save
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setIsSaveSearchOpen(false)}
              className="h-8 text-[10px] font-black uppercase border border-border/20"
            >
              Cancel
            </Button>
          </form>
        )}

        {/* Search History & Pill suggestions */}
        <div className="flex flex-col gap-2 bg-surface-secondary/5 border border-border/20 p-2.5 rounded-sm text-[9px] font-bold uppercase tracking-wider text-foreground-muted">
          {/* Popular searches */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="flex items-center gap-0.5 text-primary shrink-0">
              <TrendingUp className="h-3 w-3" /> Popular:
            </span>
            {popularSearches.map((term) => (
              <button
                key={term}
                onClick={() => handlePillClick(term)}
                className="bg-surface border border-border/30 hover:border-primary px-2 py-0.5 rounded-sm text-foreground transition-colors"
              >
                {term}
              </button>
            ))}
          </div>

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap border-t border-border/10 pt-1.5">
              <span className="flex items-center gap-0.5 shrink-0">
                <History className="h-3 w-3" /> Recent:
              </span>
              {recentSearches.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePillClick(term)}
                  className="bg-surface border border-border/30 hover:border-primary px-2 py-0.5 rounded-sm text-foreground transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          )}

          {/* Saved Searches */}
          {savedSearches.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap border-t border-border/10 pt-1.5">
              <span className="flex items-center gap-0.5 shrink-0">
                <Bookmark className="h-3 w-3 text-primary fill-primary" /> Saved
                Searches:
              </span>
              {savedSearches.map((saved) => (
                <div
                  key={saved.id}
                  className="inline-flex items-center bg-surface border border-border/30 rounded-sm"
                >
                  <button
                    onClick={() => handleLoadSavedSearch(saved)}
                    className="px-2 py-0.5 hover:text-primary transition-colors font-black uppercase text-[8px]"
                  >
                    {saved.name}
                  </button>
                  <button
                    onClick={() => removeSavedSearch(saved.id)}
                    className="border-l border-border/30 px-1.5 py-0.5 text-error hover:bg-error/5"
                    title="Delete saved search"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Centered responsive layout container */}
      <div className="flex flex-col lg:flex-row gap-6 items-start w-full min-w-0">
        {/* A. Left Filter Sidebar (Desktop Only) */}
        <aside className="hidden lg:block w-[260px] xl:w-[280px] shrink-0 border-[3px] border-border brutal-shadow bg-surface p-5 rounded-sm sticky top-24 max-h-[80vh] overflow-y-auto">
          <JobsFilter />
        </aside>

        {/* B. Middle Job List Pane */}
        <div className="flex-1 space-y-4 min-w-0">
          {/* List Toolbar Controls */}
          <div className="flex justify-between items-center bg-surface p-3 border-2 border-border rounded-sm">
            <span className="text-[10px] font-black uppercase text-foreground-secondary">
              {loading ? "Searching..." : `${totalCount} Positions found`}
            </span>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => {
                  if (sorting === "match") {
                    setSorting("recent");
                  } else {
                    setSorting("match");
                  }
                }}
                className={cn(
                  "h-8.5 px-2.5 text-[9px] font-black uppercase border-2 border-border rounded-sm brutal-shadow-xs flex items-center gap-1 shrink-0 transition-all",
                  sorting === "match"
                    ? "bg-accent text-foreground brutal-shadow"
                    : "bg-surface hover:bg-surface-secondary",
                )}
                title="Sort by highest match then quality"
              >
                <Sparkles className="h-3 w-3 text-primary animate-pulse" />{" "}
                Recommended
              </Button>

              <BrutalSelect
                value={sorting}
                onChange={(e) =>
                  setSorting(
                    e.target.value as
                      "recent" | "match" | "salary_desc" | "salary_asc",
                  )
                }
                options={[
                  { label: "Most Recent", value: "recent" },
                  { label: "AI Recommendation", value: "match" },
                  { label: "Salary: High to Low", value: "salary_desc" },
                  { label: "Salary: Low to High", value: "salary_asc" },
                ]}
                className="h-8.5 text-[9px] font-black uppercase tracking-wider border-2 border-border"
              />

              <div className="hidden sm:flex border-2 border-border rounded-sm overflow-hidden shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 p-0 rounded-none border-r border-border",
                    viewMode === "list"
                      ? "bg-primary text-white"
                      : "bg-surface hover:bg-surface-secondary",
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
                    viewMode === "grid"
                      ? "bg-primary text-white"
                      : "bg-surface hover:bg-surface-secondary",
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-1.5 p-2 bg-surface border-2 border-border/80 rounded-sm">
              <span className="text-[8px] font-black uppercase text-foreground-muted pr-1">
                Active:
              </span>

              {filters.keyword && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  &quot;{filters.keyword}&quot;
                  <button
                    onClick={() => handleRemoveFilter("keyword")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {filters.location && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  Location: {filters.location}
                  <button
                    onClick={() => handleRemoveFilter("location")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {filters.company && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  Company: {filters.company}
                  <button
                    onClick={() => handleRemoveFilter("company")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {filters.industry && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  Industry: {filters.industry}
                  <button
                    onClick={() => handleRemoveFilter("industry")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {filters.experienceLevel.map((exp) => (
                <span
                  key={exp}
                  className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary"
                >
                  {exp}
                  <button
                    onClick={() => handleRemoveFilter("experienceLevel", exp)}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {filters.remoteType.map((remote) => (
                <span
                  key={remote}
                  className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary"
                >
                  {remote}
                  <button
                    onClick={() => handleRemoveFilter("remoteType", remote)}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {filters.employmentType.map((emp) => (
                <span
                  key={emp}
                  className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary"
                >
                  {emp.replace("-", " ")}
                  <button
                    onClick={() => handleRemoveFilter("employmentType", emp)}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {filters.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary"
                >
                  Skill: {skill}
                  <button
                    onClick={() => handleRemoveFilter("skills", skill)}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              ))}
              {filters.salaryMin && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  &gt; ${filters.salaryMin / 1000}k
                  <button
                    onClick={() => handleRemoveFilter("salaryMin")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}
              {filters.easyApply && (
                <span className="inline-flex items-center gap-1 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm text-[8px] font-bold uppercase text-foreground-secondary">
                  Easy Apply
                  <button
                    onClick={() => handleRemoveFilter("easyApply")}
                    className="text-error hover:scale-110"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </span>
              )}

              <button
                onClick={resetFilters}
                className="text-[8px] font-black uppercase text-error hover:underline pl-2 border-l border-border/20"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Main List Rendering */}
          {loading ? (
            <JobsSkeleton />
          ) : jobs.length === 0 ? (
            <EmptyState
              icon={Briefcase}
              title="No Jobs Matching Filters"
              description="We couldn't find any job openings matching your active search tags. Try clearing filters or expanding location range."
              primaryAction={{
                label: "Clear Search Filters",
                onClick: () => {
                  resetFilters();
                  setKeywordInput("");
                  setLocationInput("");
                },
              }}
            />
          ) : (
            <motion.div
              layout
              className={cn(
                "grid gap-4",
                viewMode === "grid"
                  ? "sm:grid-cols-2 xl:grid-cols-3"
                  : "grid-cols-1",
              )}
            >
              <AnimatePresence mode="popLayout">
                {jobs.map((job) => (
                  <motion.div
                    key={job.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <JobCard
                      job={job}
                      isSelected={selectedJob?.id === job.id}
                      onClick={() => handleJobClick(job.id)}
                      onSave={(e) => {
                        e.stopPropagation();
                        toggleSaveJob(job.id);
                        toast.success(
                          job.isSaved
                            ? "Job removed from saved list"
                            : "Job added to saved list!",
                        );
                      }}
                      isCompared={comparedJobIds.includes(job.id)}
                      onCompareToggle={(e) => {
                        e.stopPropagation();
                        const isCompared = comparedJobIds.includes(job.id);
                        if (isCompared) {
                          compareJobs(
                            comparedJobIds.filter((id) => id !== job.id),
                          );
                          toast.success("Removed from comparison list");
                        } else {
                          if (comparedJobIds.length >= 3) {
                            toast.warning(
                              "You can compare up to 3 jobs at a time!",
                            );
                          } else {
                            compareJobs([...comparedJobIds, job.id]);
                            toast.success("Added to comparison list!");
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
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
                <ChevronLeft className="h-4 w-4" /> Previous
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

      {/* C. Mobile/Tablet Floating Filter Trigger FAB */}
      <div className="fixed bottom-6 right-6 z-40 lg:hidden">
        <Button
          onClick={() => setMobileFilterOpen(true)}
          className="h-10 px-4 border-2 border-border bg-accent text-foreground brutal-shadow hover:brutal-shadow-hover rounded-full font-black uppercase text-xs flex items-center gap-1.5"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[3px]" />
          Filters
        </Button>
      </div>

      {/* D. Responsive Drawer Filter Slide-over Panel (Right Aligned Drawer) */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm lg:hidden">
          <div className="flex-1" onClick={() => setMobileFilterOpen(false)} />
          <div className="w-[300px] sm:w-[360px] h-full overflow-y-auto bg-surface border-l-[3px] border-border p-5 brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b border-border pb-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1">
                <SlidersHorizontal className="h-3.5 w-3.5" /> Filters
              </h3>
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

      {/* Floating Job Comparison Bar */}
      {comparedJobIds.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-primary border-[3px] border-foreground p-3.5 brutal-shadow text-white flex items-center justify-between gap-6 max-w-lg w-[calc(100%-2rem)]">
          <div className="flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-accent stroke-[3px]" />
            <div className="text-left leading-tight">
              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                Compare Workspace
              </p>
              <p className="text-[9px] font-bold text-accent-foreground uppercase">
                {comparedJobIds.length} of 3 positions selected
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsComparingOpen(true)}
              className="h-8 px-3 text-[9px] font-black uppercase tracking-wider bg-accent text-foreground border-2 border-foreground brutal-shadow-xs"
            >
              Compare Now
            </Button>
            <Button
              onClick={() => compareJobs([])}
              variant="ghost"
              className="h-8 px-2 text-[9px] font-black uppercase text-white border border-white/20 hover:bg-white/10"
            >
              Clear
            </Button>
          </div>
        </div>
      )}

      {/* Job Comparison Detail overlay drawer */}
      {isComparingOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-4xl bg-surface border-[4px] border-border brutal-shadow p-6 rounded-none flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b-4 border-border pb-3 mb-4">
              <div className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-primary stroke-[3px]" />
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider"
                >
                  AI Job Comparison Matrix
                </Heading>
              </div>
              <Button
                variant="ghost"
                onClick={() => setIsComparingOpen(false)}
                className="h-8 w-8 border-2 border-border hover:bg-surface-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Comparison Side-by-side Table */}
            <div className="flex-1 overflow-x-auto select-none">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-border">
                    <th className="p-3 text-left font-black uppercase text-[9px] text-foreground-secondary bg-surface-secondary/40 w-1/4">
                      Metric Parameter
                    </th>
                    {comparedJobs.map((job) => (
                      <th
                        key={job.id}
                        className="p-3 text-left font-black uppercase text-[10px] text-foreground border-l border-border/20 w-1/4"
                      >
                        <div className="space-y-0.5">
                          <p className="font-extrabold truncate text-primary">
                            {job.title}
                          </p>
                          <p className="text-[9px] text-foreground-muted">
                            {job.companyInfo.name}
                          </p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Row 1: Salary */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20">
                      Salary Offering
                    </td>
                    {comparedJobs.map((job) => {
                      const minK = job.salaryMin
                        ? `$${Math.round(job.salaryMin / 1000)}k`
                        : "0";
                      const maxK = job.salaryMax
                        ? `$${Math.round(job.salaryMax / 1000)}k`
                        : "Any";
                      const salaryStr =
                        job.salaryMin === null
                          ? "Salary Undisclosed"
                          : `${minK} - ${maxK} ${job.currency.toUpperCase()}`;
                      return (
                        <td
                          key={job.id}
                          className="p-3 font-mono font-bold text-foreground border-l border-border/20"
                        >
                          {salaryStr}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row 2: Location & Mode */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20">
                      Work Mode & location
                    </td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 font-semibold text-foreground border-l border-border/20 uppercase text-[10px]"
                      >
                        <span className="font-black text-primary">
                          {job.remoteType}
                        </span>{" "}
                        • {job.location}
                      </td>
                    ))}
                  </tr>

                  {/* Row 3: Experience Required */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20">
                      Experience Level
                    </td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 font-semibold text-foreground border-l border-border/20 uppercase text-[10px]"
                      >
                        {job.experienceLevel} Level Required
                      </td>
                    ))}
                  </tr>

                  {/* Row 4: Skills Required */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20 font-black">
                      Target Skills
                    </td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 border-l border-border/20"
                      >
                        <div className="flex flex-wrap gap-1">
                          {job.skillsRequired.map((s) => (
                            <span
                              key={s}
                              className="px-1.5 py-0.5 border border-border bg-surface-secondary text-[8px] font-bold uppercase rounded-sm"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* Row 5: Benefits */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20">
                      Benefits packages
                    </td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 border-l border-border/20"
                      >
                        <ul className="list-disc pl-4 text-[9px] font-semibold text-foreground-secondary space-y-0.5">
                          {job.benefits.slice(0, 3).map((b) => (
                            <li key={b}>{b}</li>
                          ))}
                        </ul>
                      </td>
                    ))}
                  </tr>

                  {/* Row 6: Match Score */}
                  <tr className="border-b border-border/10">
                    <td className="p-3 font-extrabold text-[9px] uppercase text-foreground-secondary bg-surface-secondary/20">
                      Profile Compatibility
                    </td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 border-l border-border/20 font-black font-mono text-[10px] text-foreground"
                      >
                        {job.trustScore}% Trust Score
                      </td>
                    ))}
                  </tr>

                  {/* Row 7: Action */}
                  <tr>
                    <td className="p-3 bg-surface-secondary/20"></td>
                    {comparedJobs.map((job) => (
                      <td
                        key={job.id}
                        className="p-3 border-l border-border/20"
                      >
                        <Button
                          onClick={() => {
                            setIsComparingOpen(false);
                            handleJobClick(job.id);
                          }}
                          className="w-full h-8 text-[9px] font-black uppercase border-2 border-border brutal-shadow-xs"
                        >
                          View Open Position
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
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
