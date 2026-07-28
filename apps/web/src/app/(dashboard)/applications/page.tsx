"use client";

import React, { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ApplicationsSkeleton,
  CalendarSkeleton,
} from "@/components/ui/skeleton-loaders";
import { useApplicationStore } from "@/features/applications/store/application.store";
import { ApplicationsDashboard } from "@/features/applications/components/applications-dashboard";
import { KanbanBoard } from "@/features/applications/components/kanban-board";
import { motion, AnimatePresence } from "framer-motion";
import type { ApplicationStatus } from "@/types";
import dynamic from "next/dynamic";
import {
  Check,
  Search,
  SlidersHorizontal,
  Plus,
  LayoutList,
  Kanban,
  CalendarDays,
  BarChart4,
  RotateCcw,
  X,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CalendarView = dynamic(
  () =>
    import("@/features/applications/components/calendar-view").then(
      (m) => m.CalendarView,
    ),
  { ssr: false, loading: () => <CalendarSkeleton /> },
);

const ApplicationDetailDialog = dynamic(
  () =>
    import("@/features/applications/components/application-detail-dialog").then(
      (m) => m.ApplicationDetailDialog,
    ),
  { ssr: false },
);

const viewVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const tableContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const tableRow = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

// Local skeleton loader component for Table view
function TableSkeleton() {
  return (
    <div className="overflow-x-auto border-2 border-border brutal-shadow rounded-sm bg-surface p-5 space-y-4 w-full text-left">
      <div className="flex justify-between items-center pb-2.5 border-b-2 border-border">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-24" />
      </div>
      {[...Array(5)].map((_, i) => (
        <div
          key={i}
          className="flex gap-4 items-center justify-between py-3.5 border-b border-border/10"
        >
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4.5 w-1/3" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-7 w-24 rounded-sm" />
        </div>
      ))}
    </div>
  );
}

export default function ApplicationsPage() {
  const {
    applications,
    loading,
    search,
    filters,
    selectedAppId,
    setSelectedAppId,
    fetchApplications,
    addApplication,
    updateApplication,
    deleteApplication,
    updateStatus,
    setSearch,
    updateFilters,
    resetFilters,
  } = useApplicationStore();

  // Tab layout state
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "kanban" | "list" | "calendar"
  >("kanban");
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);

  // Toast notifications state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Quick creation drawer state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCompany, setNewCompany] = useState("");
  const [newStatus, setNewStatus] = useState<ApplicationStatus>("SAVED");
  const [newSource, setNewSource] = useState("LinkedIn");

  // Local state variables for new filters requested (Job Source, Date, Match Score)
  const [filterSource, setFilterSource] = useState("");
  const [filterDateRange, setFilterDateRange] = useState("all");
  const [filterMinMatchScore, setFilterMinMatchScore] = useState<number | null>(
    null,
  );

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const handleUpdateStatus = async (id: string, status: ApplicationStatus) => {
    const alertMsg = await updateStatus(id, status);
    if (alertMsg) {
      setToastMsg(alertMsg);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  const handleCreateApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newCompany.trim()) return;

    await addApplication({
      jobTitle: newTitle.trim(),
      company: newCompany.trim(),
      status: newStatus,
      appliedAt: new Date().toISOString(),
      source: newSource,
      matchScore: Math.round(75 + Math.random() * 20), // mock match rating
      jobQuality: Math.round(70 + Math.random() * 25), // mock trust rating
      recruiterName: "",
      recruiterEmail: "",
      phone: "",
      salaryNotes: "",
      salaryDiscussion: "",
      interviewNotes: "",
      followUpNotes: "",
      personalNotes: "",
      interviewDate: "",
      interviewTime: "",
      interviewType: "N/A",
      interviewRound: "N/A",
      interviewStatus: "N/A",
      interviewerName: "",
      meetingLink: "",
      offerDeadline: "",
      isRemote: false,
      location: "",
      salaryRange: "",
    });

    setNewTitle("");
    setNewCompany("");
    setIsAddOpen(false);
    setToastMsg("Application created successfully!");
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleOpenAddDialog = (status: ApplicationStatus) => {
    setNewStatus(status);
    setIsAddOpen(true);
  };

  // Local reset helper to clear extra filter states
  const handleResetAllFilters = () => {
    resetFilters();
    setFilterSource("");
    setFilterDateRange("all");
    setFilterMinMatchScore(null);
  };

  // Filtering workflow (includes new filters for Job Source, Date, Match Score)
  const filteredApps = React.useMemo(() => {
    return applications.filter((app) => {
      // 1. Search by Company, Job Title only
      if (search) {
        const query = search.toLowerCase();
        const matchesSearch =
          app.jobTitle.toLowerCase().includes(query) ||
          app.company.toLowerCase().includes(query);
        if (!matchesSearch) return false;
      }

      // 2. Status
      if (filters.status !== "all" && app.status !== filters.status)
        return false;

      // 3. Company
      if (
        filters.company &&
        !app.company.toLowerCase().includes(filters.company.toLowerCase())
      )
        return false;

      // 4. Location
      if (
        filters.location &&
        app.location &&
        !app.location.toLowerCase().includes(filters.location.toLowerCase())
      )
        return false;

      // 5. Job Source Filter
      if (
        filterSource &&
        !app.source.toLowerCase().includes(filterSource.toLowerCase())
      )
        return false;

      // 6. Match Score Filter
      if (filterMinMatchScore !== null && app.matchScore < filterMinMatchScore)
        return false;

      // 7. Date Filter (Applied date range)
      if (filterDateRange !== "all") {
        const appDate = new Date(app.appliedAt);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const timeDiff = today.getTime() - appDate.getTime();
        const diffDays = timeDiff / (1000 * 3600 * 24);

        if (filterDateRange === "today" && diffDays >= 1) return false;
        if (filterDateRange === "week" && diffDays > 7) return false;
        if (filterDateRange === "older" && diffDays <= 7) return false;
      }

      // 8. Work mode (Remote/Onsite)
      if (filters.isRemote !== "all") {
        const wantsRemote = filters.isRemote === "remote";
        if (app.isRemote !== wantsRemote) return false;
      }

      // 9. Min salary
      if (filters.salaryMin !== null && app.salaryRange) {
        const val = parseInt(app.salaryRange, 10);
        if (!isNaN(val) && val < filters.salaryMin) return false;
      }

      return true;
    });
  }, [
    applications,
    search,
    filters,
    filterSource,
    filterDateRange,
    filterMinMatchScore,
  ]);

  const selectedApp = React.useMemo(() => {
    return applications.find((app) => app.id === selectedAppId) || null;
  }, [applications, selectedAppId]);

  const hasActiveFilters =
    search ||
    filters.status !== "all" ||
    filters.company ||
    filters.location ||
    filters.isRemote !== "all" ||
    filters.salaryMin !== null ||
    filterSource ||
    filterDateRange !== "all" ||
    filterMinMatchScore !== null;

  // Determine which empty state to display
  const isEmptyStateActive = filteredApps.length === 0;

  return (
    <div className="space-y-5 pb-12 text-left select-none relative max-w-[1200px] mx-auto w-full">
      {/* Toast Alert */}
      {toastMsg && (
        <div
          className="fixed bottom-4 right-4 z-50 bg-primary text-white border-2 border-border p-3 text-[10px] font-black uppercase tracking-wider brutal-shadow flex items-center gap-1.5"
          role="alert"
        >
          <Check className="h-4 w-4 stroke-[3px]" /> {toastMsg}
        </div>
      )}

      {/* Page Title Header */}
      <PageHeader
        title="Application Tracker"
        description="Monitor, manage, and coordinate your complete job application pipeline stages."
      />

      {/* Top Search & Filter Bar */}
      <div className="space-y-3.5 bg-surface border-2 border-border p-4 rounded-sm">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
            <Input
              placeholder="Search by company name or job title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-10 text-xs font-bold border-2 border-border"
            />
          </div>

          <div className="flex gap-2">
            <BrutalSelect
              value={filters.status}
              onChange={(e) => updateFilters({ status: e.target.value })}
              options={[
                { label: "All Stages", value: "all" },
                { label: "Saved Opportunity", value: "SAVED" },
                { label: "Applied", value: "APPLIED" },
                { label: "Screening", value: "SCREENING" },
                { label: "Assessment", value: "ASSESSMENT" },
                { label: "Interview", value: "INTERVIEW" },
                { label: "Offer", value: "OFFER" },
                { label: "Accepted (Hired)", value: "ACCEPTED" },
                { label: "Rejected", value: "REJECTED" },
                { label: "Withdrawn", value: "WITHDRAWN" },
              ]}
              className="h-10 text-xs font-bold w-[140px] border-2 border-border"
            />

            <Button
              onClick={() => setIsFilterPanelOpen(!isFilterPanelOpen)}
              className={cn(
                "h-10 px-3 text-xs font-black uppercase tracking-wider border-2 border-border brutal-shadow-xs hover:brutal-shadow flex items-center justify-center gap-1.5 rounded-sm shrink-0",
                isFilterPanelOpen ? "bg-surface-secondary" : "bg-surface",
              )}
            >
              <SlidersHorizontal className="h-4 w-4 stroke-[2.5px]" /> Filters
            </Button>

            <Button
              onClick={() => setIsAddOpen(true)}
              className="h-10 px-4 text-xs font-black uppercase tracking-wider bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow flex items-center gap-1.5 rounded-sm shrink-0"
            >
              <Plus className="h-4 w-4 stroke-[3px]" /> Quick Add
            </Button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        {isFilterPanelOpen && (
          <div className="grid gap-3.5 sm:grid-cols-5 border-t border-border/10 pt-3.5">
            <div className="space-y-1">
              <label className="text-[8px] font-black text-foreground-muted uppercase block">
                Location Mode
              </label>
              <BrutalSelect
                value={filters.isRemote}
                onChange={(e) => updateFilters({ isRemote: e.target.value })}
                options={[
                  { label: "All Locations", value: "all" },
                  { label: "Remote Only", value: "remote" },
                  { label: "Onsite/Hybrid Only", value: "onsite" },
                ]}
                className="h-8 text-[10px] font-bold border border-border/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-foreground-muted uppercase block">
                Job Source
              </label>
              <Input
                placeholder="e.g. LinkedIn"
                value={filterSource}
                onChange={(e) => setFilterSource(e.target.value)}
                className="h-8 text-xs font-bold border border-border/30 bg-surface"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-foreground-muted uppercase block">
                Date Applied
              </label>
              <BrutalSelect
                value={filterDateRange}
                onChange={(e) => setFilterDateRange(e.target.value)}
                options={[
                  { label: "Anytime", value: "all" },
                  { label: "Applied Today", value: "today" },
                  { label: "This Week", value: "week" },
                  { label: "Older than 7 Days", value: "older" },
                ]}
                className="h-8 text-[10px] font-bold border border-border/30"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-foreground-muted uppercase block">
                Min Match Score (%)
              </label>
              <Input
                type="number"
                placeholder="e.g. 80"
                value={filterMinMatchScore === null ? "" : filterMinMatchScore}
                onChange={(e) =>
                  setFilterMinMatchScore(
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                className="h-8 text-xs font-bold border border-border/30 bg-surface"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-black text-foreground-muted uppercase block">
                Company Name
              </label>
              <Input
                placeholder="e.g. Stripe"
                value={filters.company}
                onChange={(e) => updateFilters({ company: e.target.value })}
                className="h-8 text-xs font-bold border border-border/30 bg-surface"
              />
            </div>
          </div>
        )}

        {/* Active Filters row */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 border-t border-border/10 pt-3 text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
            <span className="text-foreground-muted flex items-center gap-0.5">
              <SlidersHorizontal className="h-2.5 w-2.5" /> Active Filters:
            </span>
            {search && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Search: {search}
              </Badge>
            )}
            {filters.status !== "all" && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Stage: {filters.status}
              </Badge>
            )}
            {filters.company && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Company: {filters.company}
              </Badge>
            )}
            {filterSource && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Source: {filterSource}
              </Badge>
            )}
            {filterDateRange !== "all" && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Date: {filterDateRange}
              </Badge>
            )}
            {filterMinMatchScore !== null && (
              <Badge className="bg-surface-secondary border border-border shadow-none rounded-sm px-1.5 py-0.5">
                Min Score: {filterMinMatchScore}%
              </Badge>
            )}

            <Button
              variant="ghost"
              onClick={handleResetAllFilters}
              className="h-6 px-1.5 text-[7.5px] font-black uppercase text-error hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-error/25 ml-auto rounded-sm flex items-center gap-0.5"
            >
              <RotateCcw className="h-2.5 w-2.5" /> Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Tabs Toolbar Navigator */}
      <div className="flex border-b-2 border-border overflow-x-auto select-none gap-1 bg-surface-secondary/10 p-1.5 border border-border/20 rounded-sm">
        <button
          onClick={() => setActiveTab("kanban")}
          className={cn(
            "px-4 py-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-transparent rounded-sm transition-all shrink-0",
            activeTab === "kanban"
              ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary",
          )}
        >
          <Kanban className="h-3.5 w-3.5" /> Pipeline Board
        </button>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={cn(
            "px-4 py-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-transparent rounded-sm transition-all shrink-0",
            activeTab === "dashboard"
              ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary",
          )}
        >
          <BarChart4 className="h-3.5 w-3.5" /> Stats & Charts
        </button>

        <button
          onClick={() => setActiveTab("list")}
          className={cn(
            "px-4 py-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-transparent rounded-sm transition-all shrink-0",
            activeTab === "list"
              ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary",
          )}
        >
          <LayoutList className="h-3.5 w-3.5" /> Table List
        </button>

        <button
          onClick={() => setActiveTab("calendar")}
          className={cn(
            "px-4 py-2 text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 border border-transparent rounded-sm transition-all shrink-0",
            activeTab === "calendar"
              ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
              : "text-foreground-muted hover:text-foreground hover:bg-surface-secondary",
          )}
        >
          <CalendarDays className="h-3.5 w-3.5" /> Calendar View
        </button>
      </div>

      {/* 4. Dynamic Render Views */}
      {loading ? (
        activeTab === "calendar" ? (
          <CalendarSkeleton />
        ) : activeTab === "list" ? (
          <TableSkeleton />
        ) : (
          <ApplicationsSkeleton />
        )
      ) : isEmptyStateActive ? (
        <div className="w-full">
          {/* Fulfill Empty States Requirements */}
          {applications.length === 0 ? (
            <EmptyState
              icon={LayoutList}
              title="No applications tracked yet"
              description="Start logging your job applications to manage interviews, offers, and follow-ups in one clean workspace."
              primaryAction={{
                label: "Add Application Entry",
                onClick: () => setIsAddOpen(true),
              }}
            />
          ) : filters.status === "SAVED" &&
            applications.filter((a) => a.status === "SAVED").length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No Saved Jobs Found"
              description="Bookmark roles from the job search tab or add them manually to begin planning your career tracker applications."
              primaryAction={{
                label: "Reset Stage Filter",
                onClick: () => updateFilters({ status: "all" }),
              }}
            />
          ) : (
            <EmptyState
              icon={Search}
              title="No Search Results"
              description="We couldn't find any job applications matching your query or filters. Try adjusting your search query."
              primaryAction={{
                label: "Reset Filters",
                onClick: handleResetAllFilters,
              }}
            />
          )}
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={viewVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            {activeTab === "kanban" && (
              <KanbanBoard
                applications={filteredApps}
                onOpenDetails={setSelectedAppId}
                onUpdateStatus={handleUpdateStatus}
                onAddApplication={handleOpenAddDialog}
              />
            )}

            {activeTab === "dashboard" && (
              <ApplicationsDashboard
                applications={filteredApps}
                onOpenDetails={setSelectedAppId}
              />
            )}

            {activeTab === "calendar" && (
              <CalendarView
                applications={filteredApps}
                onOpenDetails={setSelectedAppId}
              />
            )}

            {activeTab === "list" && (
              <div className="overflow-x-auto border-2 border-border brutal-shadow rounded-sm bg-surface">
                <table className="w-full min-w-[900px] text-left text-xs font-semibold">
                  <thead className="bg-surface-secondary/35 border-b-2 border-border text-[9px] font-black uppercase tracking-wider text-foreground-secondary">
                    <tr>
                      <th className="px-4 py-3">Company</th>
                      <th className="px-4 py-3">Job Title</th>
                      <th className="px-4 py-3">Location</th>
                      <th className="px-4 py-3 text-center">Match Score</th>
                      <th className="px-4 py-3">Resume Used</th>
                      <th className="px-4 py-3">Application Date</th>
                      <th className="px-4 py-3">Current Status</th>
                      <th className="px-4 py-3">Source</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <motion.tbody
                    variants={tableContainer}
                    initial="hidden"
                    animate="show"
                  >
                    {filteredApps.map((app) => (
                      <motion.tr
                        variants={tableRow}
                        key={app.id}
                        onClick={() => setSelectedAppId(app.id)}
                        className="border-b border-border/20 hover:bg-surface-secondary/20 transition-colors cursor-pointer"
                      >
                        <td className="px-4 py-3.5 font-bold uppercase text-foreground shrink-0">
                          {app.company}
                        </td>
                        <td className="px-4 py-3.5 text-foreground-secondary font-black uppercase">
                          {app.jobTitle}
                        </td>
                        <td className="px-4 py-3.5 text-foreground-muted normal-case">
                          {app.location || "Remote"}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-primary">
                          {app.matchScore}%
                        </td>
                        <td
                          className="px-4 py-3.5 text-foreground-muted truncate max-w-[120px]"
                          title={app.resumeUsed || "None"}
                        >
                          {app.resumeUsed || "None"}
                        </td>
                        <td className="px-4 py-3.5 text-foreground-muted">
                          {app.appliedAt.split("T")[0]}
                        </td>
                        <td className="px-4 py-3.5">
                          <Badge
                            className={cn(
                              "text-[7px] font-black uppercase px-1.5 py-0.5 rounded-sm border shadow-none",
                              app.status === "SAVED" &&
                                "bg-slate-50 dark:bg-surface-secondary text-slate-700 dark:text-foreground-secondary border-slate-300 dark:border-border-secondary",
                              app.status === "APPLIED" &&
                                "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-500/30",
                              app.status === "SCREENING" &&
                                "bg-indigo-50 text-indigo-700 border-indigo-300",
                              app.status === "ASSESSMENT" &&
                                "bg-purple-50 text-purple-700 dark:text-purple-400 border-purple-300",
                              app.status === "INTERVIEW" &&
                                "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-300 dark:border-amber-500/30",
                              app.status === "OFFER" &&
                                "bg-emerald-50 text-emerald-700 border-emerald-300",
                              app.status === "ACCEPTED" &&
                                "bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-300 dark:border-green-500/30",
                              app.status === "REJECTED" &&
                                "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-300 dark:border-rose-500/30",
                              app.status === "WITHDRAWN" &&
                                "bg-slate-100 dark:bg-surface-hover text-slate-500 border-slate-300 dark:border-border-secondary",
                            )}
                          >
                            {app.status === "ACCEPTED"
                              ? "Hired"
                              : app.status.replace(/_/g, " ")}
                          </Badge>
                        </td>
                        <td className="px-4 py-3.5 text-foreground-muted">
                          {app.source}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedAppId(app.id);
                            }}
                            className="h-7 text-[8.5px] font-black uppercase border border-border/20 hover:bg-surface-secondary px-2 rounded-sm"
                          >
                            Open Details
                          </Button>
                        </td>
                      </motion.tr>
                    ))}
                  </motion.tbody>
                </table>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      )}

      {/* 5. Application Details Editor Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <ApplicationDetailDialog
            application={selectedApp}
            onClose={() => setSelectedAppId(null)}
            onUpdate={updateApplication}
            onUpdateStatus={handleUpdateStatus}
            onDelete={deleteApplication}
          />
        )}
      </AnimatePresence>

      {/* 6. Quick Creation Modal Dialog */}
      <AnimatePresence>
        {isAddOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsAddOpen(false)}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-md bg-surface border-[3px] border-border brutal-shadow rounded-sm p-6 space-y-4 z-10 text-left"
            >
              <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Add New Application
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAddOpen(false)}
                  className="h-7 w-7 border border-border/30 hover:bg-surface-secondary rounded-sm"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleCreateApplication} className="space-y-3.5">
                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-foreground-muted block">
                    Job Role Title
                  </label>
                  <Input
                    required
                    placeholder="e.g. Backend Developer"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="h-9 text-xs font-bold border border-border/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[8px] font-black uppercase text-foreground-muted block">
                    Company Name
                  </label>
                  <Input
                    required
                    placeholder="e.g. Stripe"
                    value={newCompany}
                    onChange={(e) => setNewCompany(e.target.value)}
                    className="h-9 text-xs font-bold border border-border/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-foreground-muted block">
                      Initial Stage
                    </label>
                    <BrutalSelect
                      value={newStatus}
                      onChange={(e) =>
                        setNewStatus(e.target.value as ApplicationStatus)
                      }
                      options={[
                        { label: "Saved Opportunity", value: "SAVED" },
                        { label: "Applied", value: "APPLIED" },
                        { label: "Screening", value: "SCREENING" },
                        { label: "Assessment", value: "ASSESSMENT" },
                        { label: "Interview", value: "INTERVIEW" },
                      ]}
                      className="h-9 text-[10px] font-black uppercase border border-border/50"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] font-black uppercase text-foreground-muted block">
                      Source Channel
                    </label>
                    <Input
                      placeholder="e.g. LinkedIn"
                      value={newSource}
                      onChange={(e) => setNewSource(e.target.value)}
                      className="h-9 text-xs font-bold border border-border/50"
                    />
                  </div>
                </div>

                <div className="border-t border-border/10 pt-4 flex gap-3">
                  <Button
                    type="submit"
                    className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow rounded-sm"
                  >
                    Create Entry
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsAddOpen(false)}
                    className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-surface border-2 border-border brutal-shadow-xs hover:brutal-shadow rounded-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
