"use client";

import React, { useState, useEffect } from "react";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useResumeOptimizerStore } from "@/features/resume/store/resume-optimizer.store";
import type { SectionScore } from "@/features/resume/types/optimizer.types";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import {
  FileText,
  Sparkles,
  History,
  Download,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Layers,
  Flame,
  Search,
  BookOpen,
  TrendingUp,
  FileCheck,
  CheckSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Sub-component: Skeleton Loader
function OptimizerSkeletons() {
  return (
    <div
      className="space-y-6 w-full text-left"
      aria-label="Loading Optimization Analytics"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[...Array(3)].map((_, i) => (
          <BrutalCard
            key={i}
            className="p-5 border-2 border-border bg-surface rounded-sm space-y-3"
          >
            <div className="h-4 w-1/3 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
            <div className="h-7 w-2/3 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
            <div className="h-3.5 w-full bg-slate-100 dark:bg-surface-secondary/40 rounded-sm animate-pulse" />
          </BrutalCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <BrutalCard className="p-6 border-2 border-border bg-surface rounded-sm space-y-4">
            <div className="h-5 w-1/4 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-slate-100 dark:bg-surface-secondary/40 rounded-sm animate-pulse" />
              <div className="h-3 w-5/6 bg-slate-100 dark:bg-surface-secondary/40 rounded-sm animate-pulse" />
              <div className="h-3 w-4/5 bg-slate-100 dark:bg-surface-secondary/40 rounded-sm animate-pulse" />
            </div>
          </BrutalCard>

          <BrutalCard className="p-6 border-2 border-border bg-surface rounded-sm space-y-4">
            <div className="h-5 w-1/4 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-50 dark:bg-surface-secondary/20 rounded-sm animate-pulse" />
              <div className="h-20 bg-slate-50 dark:bg-surface-secondary/20 rounded-sm animate-pulse" />
            </div>
          </BrutalCard>
        </div>

        <BrutalCard className="p-6 border-2 border-border bg-surface rounded-sm space-y-4">
          <div className="h-5 w-1/3 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="flex justify-between items-center py-2 border-b border-border/5"
              >
                <div className="h-4.5 w-24 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
                <div className="h-4.5 w-12 bg-slate-200 dark:bg-surface-hover rounded-sm animate-pulse" />
              </div>
            ))}
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}

export default function ResumeOptimizationPage() {
  const { uploadedResumes } = useResumeStore();
  const {
    analysis,
    loading,
    jobDescription,
    setJobDescription,
    history,
    clearHistory,
    exportResume,
    analyzeResume,
    optimizeResume,
    rewriteSection,
    saveOptimizedVersion,
  } = useResumeOptimizerStore();

  const { ConfirmationDialog } = useConfirm();

  // Selected state options
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [activeMenuTab, setActiveMenuTab] = useState<
    "dashboard" | "sections" | "keywords" | "rewrites" | "comparison"
  >("dashboard");

  // Local state toggles to demonstrate Empty, Error, and Loading States easily
  const [demoState, setDemoState] = useState<
    "standard" | "empty" | "error_api" | "error_unsupported" | "error_network"
  >("standard");

  // Save tailored version state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [newVersionName, setNewVersionName] = useState("");

  // AI Bullet optimization state
  const [optimizedBullet, setOptimizedBullet] = useState<string>("");
  const [bulletTarget, setBulletTarget] = useState<string>("summary");

  useEffect(() => {
    if (uploadedResumes.length > 0 && !selectedResumeId) {
      const defaultDoc =
        uploadedResumes.find((r) => r.isDefault) || uploadedResumes[0];
      setSelectedResumeId(defaultDoc.id);
    }
  }, [uploadedResumes, selectedResumeId]);

  // Handle run audit
  const handleRunAudit = async () => {
    if (!selectedResumeId) {
      toast.error("Please select a resume file first.");
      return;
    }
    if (!jobDescription.trim()) {
      toast.error("Please insert a target job description to match against.");
      return;
    }
    await analyzeResume(selectedResumeId, jobDescription);
  };

  // Handle AI tailor optimize
  const handleAITailor = async () => {
    if (!selectedResumeId) return;
    await optimizeResume(selectedResumeId, jobDescription);
  };

  // Handle rewrite bullet
  const handleRewriteBullet = async () => {
    const text = await rewriteSection(
      selectedResumeId,
      bulletTarget,
      jobDescription,
    );
    setOptimizedBullet(text);
  };

  // Handle save version submit
  const handleSaveVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim()) return;
    await saveOptimizedVersion(newVersionName.trim());
    setNewVersionName("");
    setIsSaveModalOpen(false);
  };

  // Copy Suggestion clipboard handler
  const handleCopyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  // Export handler
  const handleExport = async (format: "pdf" | "docx") => {
    await exportResume(format);
  };

  const selectedResume =
    uploadedResumes.find((r) => r.id === selectedResumeId) ||
    uploadedResumes[0];

  // Grade helper
  const getScoreGrade = (score: number) => {
    if (score >= 90)
      return {
        label: "Excellent Alignment",
        color: "text-green-600 dark:text-green-400",
        grade: "A",
      };
    if (score >= 75)
      return {
        label: "Good Tailoring",
        color: "text-blue-600 dark:text-blue-400",
        grade: "B",
      };
    if (score >= 50)
      return {
        label: "Average Alignment",
        color: "text-amber-600 dark:text-amber-400",
        grade: "C",
      };
    return {
      label: "Needs Intensive Optimization",
      color: "text-rose-600 dark:text-rose-400 animate-pulse",
      grade: "F",
    };
  };

  const currentGrade = getScoreGrade(
    analysis?.atsScore || selectedResume?.atsScore || 75,
  );

  return (
    <div className="space-y-6 w-full text-left pb-16">
      {/* Header section with state debug tools */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Heading
            level="h2"
            className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2"
          >
            <Sparkles className="h-6.5 w-6.5 text-primary shrink-0 animate-pulse" />
            AI Resume Optimizer
          </Heading>
          <Text className="text-foreground-secondary text-xs">
            Scan your resume against any job description, locate critical
            keywords gaps, and generate AI tailored adjustments.
          </Text>
        </div>

        {/* State simulator toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-2 border-border p-2 bg-surface-secondary/45 rounded-sm">
          <span className="text-[7.5px] font-black uppercase tracking-wider text-foreground-muted block px-1">
            Simulator:
          </span>
          {[
            "standard",
            "empty",
            "error_api",
            "error_unsupported",
            "error_network",
          ].map((st) => (
            <button
              key={st}
              onClick={() =>
                setDemoState(
                  st as
                    | "standard"
                    | "empty"
                    | "error_api"
                    | "error_unsupported"
                    | "error_network",
                )
              }
              className={cn(
                "h-6 px-1.5 text-[7px] font-black uppercase tracking-wider border transition-all rounded-sm",
                demoState === st
                  ? "bg-primary text-white border-border brutal-shadow-xs"
                  : "bg-surface text-foreground hover:bg-surface-secondary border-border/20",
              )}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATES DEMO */}
      {demoState.startsWith("error_") && (
        <div className="grid gap-4">
          {demoState === "error_api" && (
            <EmptyState
              icon={XCircle}
              title="AI Analysis Failed"
              description="The optimization algorithm encountered an internal parsing failure compiling suggestion nodes. Please refresh and try again."
              primaryAction={{
                label: "Retry Analysis Run",
                onClick: handleRunAudit,
              }}
            />
          )}
          {demoState === "error_unsupported" && (
            <EmptyState
              icon={AlertTriangle}
              title="Resume File Format Not Supported"
              description="Only standard vector PDF, DOC, and DOCX document structures can be processed by our resume intelligence model."
              primaryAction={{
                label: "Back to Management",
                onClick: () => (window.location.href = "/resume"),
              }}
            />
          )}
          {demoState === "error_network" && (
            <EmptyState
              icon={XCircle}
              title="API Server Connection Timeout"
              description="A network latency timeout occurred while uploading payload to our cloud intelligence services. Verify internet configurations."
              primaryAction={{
                label: "Re-run Connection Check",
                onClick: handleRunAudit,
              }}
            />
          )}
        </div>
      )}

      {/* EMPTY STATES DEMO */}
      {demoState === "empty" && (
        <div className="grid gap-6">
          <EmptyState
            icon={FileText}
            title="No Resume Selected for Optimization"
            description="You must choose a primary resume file or upload a document to begin parsing suggestions against job listings."
            primaryAction={{
              label: "Upload Resume Document",
              onClick: () => (window.location.href = "/resume"),
            }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              icon={History}
              title="No Optimization History Log"
              description="You haven't tailoring-optimized any resumes yet. Once you run an audit, version iterations will catalog here."
            />
            <EmptyState
              icon={Sparkles}
              title="No Rewrite Suggestions"
              description="Provide a target job description description on the left column to compile missing skill set rewrite bullets."
            />
          </div>
        </div>
      )}

      {/* STANDARD WORKSPACE */}
      {demoState === "standard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT PANEL: Job Description input & selected resume summary */}
          <div className="lg:col-span-4 space-y-6">
            <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow space-y-4">
              <div className="flex justify-between items-center border-b-2 border-border/10 pb-2.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                  <FileText className="h-4 w-4 text-primary" /> Target Alignment
                  Setup
                </h3>
              </div>

              {/* Resume File Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="resume-select"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Select Resume Variant
                </label>
                <BrutalSelect
                  id="resume-select"
                  value={selectedResumeId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedResumeId(e.target.value)
                  }
                  options={uploadedResumes.map((r) => ({
                    label: `${r.fileName} (v${r.version})`,
                    value: r.id,
                  }))}
                  className="h-9 text-xs font-bold w-full uppercase"
                />
              </div>

              {/* Job Description Text Area */}
              <div className="space-y-1.5">
                <label
                  htmlFor="jd-input"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Target Job Description description
                </label>
                <textarea
                  id="jd-input"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste the full job post details here (including qualifications and tech stacks) to identify missing keywords..."
                  rows={8}
                  className="w-full text-xs font-bold font-mono p-3 border-2 border-border bg-surface-secondary/20 rounded-sm focus:outline-none focus:ring-1 focus:ring-primary leading-normal"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border/10">
                <Button
                  onClick={handleRunAudit}
                  disabled={loading}
                  className="w-full h-10 text-xs font-black uppercase tracking-wider bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow flex items-center justify-center gap-2 rounded-sm"
                >
                  {loading ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    "Run Alignment Audit"
                  )}
                </Button>
                <Button
                  onClick={handleAITailor}
                  disabled={loading || !analysis}
                  className="w-full h-10 text-xs font-black uppercase tracking-wider bg-surface text-foreground border-2 border-border brutal-shadow-xs hover:brutal-shadow flex items-center justify-center gap-2 rounded-sm"
                >
                  <Sparkles className="h-4 w-4 text-warning fill-warning" />{" "}
                  Auto-Tailor Resume (AI)
                </Button>
              </div>
            </BrutalCard>

            {/* Dashboard widgets metrics */}
            <div className="grid grid-cols-2 gap-4">
              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[92px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Average ATS Rank
                </span>
                <span className="text-xl font-black font-mono">81%</span>
                <Badge className="text-[6.5px] font-bold bg-green-50 text-green-700 border border-green-300 w-max px-1 rounded-sm shadow-none">
                  +3% gain
                </Badge>
              </BrutalCard>

              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[92px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Ready Score Index
                </span>
                <span className="text-xl font-black font-mono text-primary">
                  A- Grade
                </span>
                <Badge className="text-[6.5px] font-bold bg-blue-50 text-blue-700 border border-blue-300 w-max px-1 rounded-sm shadow-none">
                  High Match
                </Badge>
              </BrutalCard>

              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[92px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Best Doc score
                </span>
                <span className="text-xl font-black font-mono">88%</span>
                <span className="text-[7px] font-mono text-foreground-secondary">
                  v2 Frontend Special
                </span>
              </BrutalCard>

              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[92px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Tailors Saved
                </span>
                <span className="text-xl font-black font-mono">14 Runs</span>
                <span className="text-[7px] font-mono text-foreground-secondary">
                  Across 3 variants
                </span>
              </BrutalCard>
            </div>
          </div>

          {/* RIGHT PANEL: Optimization results workspace */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <OptimizerSkeletons />
            ) : !analysis ? (
              <EmptyState
                icon={Search}
                title="Input Job Description Details to Audit"
                description="We require targeted job listings descriptions to extract missing skills. Select a primary resume and run the alignment check."
                primaryAction={{
                  label: "Run Demo Check",
                  onClick: async () => {
                    setJobDescription(
                      "Senior Frontend Engineer with 5+ years of React, Next.js, and GraphQL experience. Must handle styling via Tailwind CSS.",
                    );
                    await analyzeResume(
                      selectedResumeId || "res_001",
                      "Senior Frontend Engineer with React, Next.js, and GraphQL",
                    );
                  },
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* 1. Resume version overview card */}
                <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black text-primary uppercase tracking-widest block">
                      Variant Assessment Workspace
                    </span>
                    <h3 className="text-sm font-black uppercase text-foreground leading-tight truncate">
                      {selectedResume?.fileName || "anshul-resume.pdf"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-foreground-secondary pt-0.5">
                      <span>Version: v{selectedResume?.version || "2.0"}</span>
                      <span>•</span>
                      <span>Last Audited: Just Now</span>
                      <span>•</span>
                      <span className={cn("font-black", currentGrade.color)}>
                        {currentGrade.label}
                      </span>
                    </div>
                  </div>

                  {/* Circular Score representation */}
                  <div className="flex items-center gap-3">
                    <div className="relative h-14 w-14 border-2 border-border rounded-full flex items-center justify-center bg-surface-secondary font-mono text-base font-black text-foreground shrink-0">
                      {analysis.atsScore}%
                    </div>
                    <div>
                      <span className="text-[8px] font-black text-foreground-muted uppercase block">
                        ATS compatibility
                      </span>
                      <span className="text-[10px] font-black text-primary uppercase">
                        Grade {currentGrade.grade} Rank
                      </span>
                    </div>
                  </div>
                </BrutalCard>

                {/* Navigation inside optimizer */}
                <div className="flex border-b-2 border-border overflow-x-auto gap-1 bg-surface-secondary/20 p-1 rounded-sm select-none">
                  {[
                    {
                      id: "dashboard",
                      label: "ATS Score Analysis",
                      icon: TrendingUp,
                    },
                    { id: "sections", label: "Section Audit", icon: Layers },
                    { id: "keywords", label: "Keywords Studio", icon: Search },
                    { id: "rewrites", label: "AI Rewriter", icon: Sparkles },
                    {
                      id: "comparison",
                      label: "Compare Preview",
                      icon: History,
                    },
                  ].map((menu) => (
                    <button
                      key={menu.id}
                      onClick={() =>
                        setActiveMenuTab(
                          menu.id as
                            | "dashboard"
                            | "sections"
                            | "keywords"
                            | "rewrites"
                            | "comparison",
                        )
                      }
                      className={cn(
                        "px-3.5 py-1.5 text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1 border border-transparent rounded-sm shrink-0",
                        activeMenuTab === menu.id
                          ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      <menu.icon className="h-3.5 w-3.5" /> {menu.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: ATS SCORE ANALYSIS */}
                {activeMenuTab === "dashboard" && (
                  <div className="grid gap-6">
                    {/* circular scores & metrics grid */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2">
                        ATS Category Breakdown
                      </h4>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3.5">
                          {/* Progress bar keywords */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                              <span>Keywords Density Alignment</span>
                              <span>{analysis.keywordScore}%</span>
                            </div>
                            <div
                              className="h-2 w-full bg-slate-100 dark:bg-surface-hover border border-border rounded-sm overflow-hidden"
                              role="progressbar"
                              aria-valuenow={analysis.keywordScore}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label="Keywords Score progress"
                            >
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${analysis.keywordScore}%` }}
                              />
                            </div>
                          </div>

                          {/* Progress bar completeness */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                              <span>Completeness Rank</span>
                              <span>{analysis.completenessScore}%</span>
                            </div>
                            <div
                              className="h-2 w-full bg-slate-100 dark:bg-surface-hover border border-border rounded-sm overflow-hidden"
                              role="progressbar"
                              aria-valuenow={analysis.completenessScore}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label="Completeness Score progress"
                            >
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${analysis.completenessScore}%`,
                                }}
                              />
                            </div>
                          </div>

                          {/* Progress bar readability */}
                          <div className="space-y-1">
                            <div className="flex justify-between items-center text-[9px] font-black uppercase">
                              <span>Readability index</span>
                              <span>{analysis.readabilityScore}%</span>
                            </div>
                            <div
                              className="h-2 w-full bg-slate-100 dark:bg-surface-hover border border-border rounded-sm overflow-hidden"
                              role="progressbar"
                              aria-valuenow={analysis.readabilityScore}
                              aria-valuemin={0}
                              aria-valuemax={100}
                              aria-label="Readability Score progress"
                            >
                              <div
                                className="h-full bg-primary"
                                style={{
                                  width: `${analysis.readabilityScore}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        {/* Secondary breakdown stats */}
                        <div className="space-y-3.5 border-t-2 md:border-t-0 md:border-l-2 border-border/10 pt-3 md:pt-0 md:pl-4">
                          <div className="grid grid-cols-2 gap-3 text-[9px] font-black uppercase text-foreground-secondary">
                            <div className="p-2 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm">
                              <span>Formatting compliance</span>
                              <span className="block text-sm font-black text-foreground mt-0.5">
                                90%
                              </span>
                            </div>
                            <div className="p-2 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm">
                              <span>Work Experience Score</span>
                              <span className="block text-sm font-black text-foreground mt-0.5">
                                {analysis.sections.experience.score}%
                              </span>
                            </div>
                            <div className="p-2 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm">
                              <span>Academic Rank</span>
                              <span className="block text-sm font-black text-foreground mt-0.5">
                                {analysis.sections.education.score}%
                              </span>
                            </div>
                            <div className="p-2 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm">
                              <span>Skills alignment</span>
                              <span className="block text-sm font-black text-foreground mt-0.5">
                                {analysis.sections.skills.score}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </BrutalCard>

                    {/* Resume structure review */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1">
                          <CheckSquare className="h-4 w-4 text-green-600" />{" "}
                          Structure Audit
                        </h4>
                        <ul className="space-y-2 text-[10.5px] font-bold text-foreground-secondary leading-snug">
                          <li className="flex gap-2 items-start">
                            <span className="text-green-600 font-extrabold">
                              ✓
                            </span>{" "}
                            Correct sections order
                          </li>
                          <li className="flex gap-2 items-start">
                            <span className="text-green-600 font-extrabold">
                              ✓
                            </span>{" "}
                            Contact information included
                          </li>
                          <li className="flex gap-2 items-start">
                            <span className="text-green-600 font-extrabold">
                              ✓
                            </span>{" "}
                            Section heading compliance verified
                          </li>
                          <li className="flex gap-2 items-start">
                            <span className="text-green-600 font-extrabold">
                              ✓
                            </span>{" "}
                            White-space margins are compliant
                          </li>
                        </ul>
                      </BrutalCard>

                      <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1">
                          <AlertTriangle className="h-4 w-4 text-warning" />{" "}
                          Structure Caveats
                        </h4>
                        <ul className="space-y-2 text-[10.5px] font-bold text-foreground-secondary leading-snug">
                          {analysis.sections.experience.missingInfo.map(
                            (info, i) => (
                              <li
                                key={i}
                                className="flex gap-2 items-start text-warning"
                              >
                                <span className="font-extrabold">⚠</span> {info}
                              </li>
                            ),
                          )}
                          {analysis.sections.summary.missingInfo.map(
                            (info, i) => (
                              <li
                                key={i}
                                className="flex gap-2 items-start text-warning"
                              >
                                <span className="font-extrabold">⚠</span> {info}
                              </li>
                            ),
                          )}
                          {analysis.sections.experience.missingInfo.length ===
                            0 && (
                            <li className="text-[9.5px] text-foreground-muted italic">
                              All layout structures are parser friendly!
                            </li>
                          )}
                        </ul>
                      </BrutalCard>
                    </div>

                    {/* Export Actions toolbar */}
                    <div className="flex flex-wrap items-center gap-3 border-2 border-border p-4 bg-surface-secondary/20 rounded-sm">
                      <span className="text-[9px] font-black uppercase text-foreground-secondary">
                        Export optimized variant:
                      </span>
                      <Button
                        onClick={() => handleExport("pdf")}
                        className="h-8.5 text-[9px] font-black uppercase border-2 border-border bg-primary text-white hover:bg-primary/90 rounded-sm brutal-shadow-xs hover:brutal-shadow flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" /> PDF Optimized
                      </Button>
                      <Button
                        onClick={() => handleExport("docx")}
                        className="h-8.5 text-[9px] font-black uppercase border-2 border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm brutal-shadow-xs hover:brutal-shadow flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5" /> DOCX Optimized
                      </Button>
                      <Button
                        onClick={() => setIsSaveModalOpen(true)}
                        className="h-8.5 text-[9px] font-black uppercase border-2 border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm brutal-shadow-xs hover:brutal-shadow flex items-center gap-1 ml-auto"
                      >
                        <FileCheck className="h-3.5 w-3.5 text-primary" /> Save
                        Version
                      </Button>
                    </div>
                  </div>
                )}

                {/* TAB 2: SECTION AUDIT & GRAMMAR */}
                {activeMenuTab === "sections" && (
                  <div className="grid gap-6">
                    {/* Section Scores list */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        Section Completeness Suggestions
                      </h4>

                      <div className="grid gap-3.5">
                        {Object.entries(analysis.sections).map(
                          ([key, value]) => {
                            const val = value as SectionScore;
                            return (
                              <div
                                key={key}
                                className="p-3 border-2 border-border bg-surface-secondary/15 rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs leading-normal"
                              >
                                <div>
                                  <span className="text-[9px] font-black text-primary uppercase block">
                                    {key} Analysis
                                  </span>
                                  <p className="text-[10.5px] font-bold text-foreground-secondary">
                                    {val.suggestions[0] ||
                                      "Section conforms to standard formatting guidelines."}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                  <Badge className="text-[7.5px] font-bold bg-surface border border-border text-foreground px-1.5 shadow-none rounded-none">
                                    {val.status.toUpperCase()}
                                  </Badge>
                                  <span className="font-mono font-black text-foreground">
                                    {val.score}%
                                  </span>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </BrutalCard>

                    {/* Grammar and Writing Style analysis */}
                    <div className="grid gap-6 md:grid-cols-2">
                      <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                          <BookOpen className="h-4 w-4 text-primary" /> Grammar
                          & Readability
                        </h4>

                        <div className="space-y-3 text-[10.5px] font-bold text-foreground-secondary">
                          <div className="flex justify-between border-b border-border/10 pb-1.5">
                            <span>Grammar / Spelling Warnings</span>
                            <span className="font-mono text-foreground font-black">
                              {analysis.readability.grammarWarningsCount}{" "}
                              Warning(s)
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-border/10 pb-1.5">
                            <span>Passive Voice Sentences</span>
                            <span className="font-mono text-foreground font-black">
                              {analysis.readability.passiveVoiceCount} Detected
                            </span>
                          </div>
                          <div className="flex justify-between border-b border-border/10 pb-1.5">
                            <span>Average Sentence Length</span>
                            <span className="font-mono text-foreground font-black">
                              {analysis.readability.sentenceLength} words
                            </span>
                          </div>
                          <div className="flex justify-between pb-1">
                            <span>Evaluated Writing Tone</span>
                            <span className="font-mono text-primary font-black uppercase">
                              {analysis.readability.tone}
                            </span>
                          </div>
                        </div>
                      </BrutalCard>

                      <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                          <Flame className="h-4 w-4 text-warning" /> Action Verb
                          Recommendations
                        </h4>
                        <div className="space-y-1.5">
                          <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                            Replaces weak verbs (&apos;helped&apos;,
                            &apos;worked&apos;, &apos;managed&apos;)
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {[
                              "Developed",
                              "Implemented",
                              "Designed",
                              "Optimized",
                              "Automated",
                              "Built",
                            ].map((verb) => (
                              <Badge
                                key={verb}
                                onClick={() => handleCopyText(verb)}
                                className="text-[7.5px] font-bold bg-orange-50 text-orange-700 border border-orange-300 shadow-none px-1.5 py-0.5 rounded-sm cursor-pointer hover:bg-orange-100 transition-colors"
                              >
                                {verb} +
                              </Badge>
                            ))}
                          </div>
                          <p className="text-[8px] font-bold text-foreground-muted normal-case mt-1.5">
                            Click a verb above to copy. Use metrics-driven
                            action verbs to stand out.
                          </p>
                        </div>
                      </BrutalCard>
                    </div>
                  </div>
                )}

                {/* TAB 3: KEYWORDS STUDIO */}
                {activeMenuTab === "keywords" && (
                  <div className="grid gap-6">
                    {/* Keyword Match details */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                      <div className="flex justify-between items-center border-b border-border/10 pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                          ATS Target Keywords Analysis
                        </h4>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {/* Matching Keywords */}
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-green-700 uppercase block">
                            Found Keywords ({analysis.keywords.matching.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywords.matching.map((kw) => (
                              <Badge
                                key={kw}
                                className="text-[7.5px] font-bold bg-green-50 text-green-700 border border-green-300 shadow-none px-1.5 py-0.5 rounded-sm"
                              >
                                ✓ {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Missing Keywords */}
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-rose-700 uppercase block">
                            Missing ATS Keywords (
                            {analysis.keywords.missing.length})
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {analysis.keywords.missing.map((kw) => (
                              <Badge
                                key={kw}
                                onClick={() => handleCopyText(kw)}
                                className="text-[7.5px] font-bold bg-rose-50 text-rose-700 border border-rose-300 shadow-none px-1.5 py-0.5 rounded-sm cursor-pointer hover:bg-rose-100 transition-colors"
                              >
                                + {kw}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Keyword Density List */}
                      <div className="space-y-2 border-t border-border/10 pt-4">
                        <span className="text-[8px] font-black text-foreground-muted uppercase block">
                          Keyword Density Distribution
                        </span>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono text-foreground-secondary font-bold">
                          {analysis.keywords.density.map((item) => (
                            <div
                              key={item.keyword}
                              className="p-2 border border-border/40 rounded-sm bg-slate-50/50 dark:bg-surface-secondary/50 flex justify-between"
                            >
                              <span className="truncate">{item.keyword}</span>
                              <span className="text-primary shrink-0">
                                {item.count}x
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </BrutalCard>

                    {/* Priority Skill Gap Analysis */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        Skills Gaps priority Levels
                      </h4>
                      <div className="grid gap-3.5 sm:grid-cols-3">
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-rose-600 uppercase block">
                            High Priority
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.skillGap.priority.slice(0, 2).map((s) => (
                              <Badge
                                key={s}
                                className="text-[7px] font-bold bg-rose-50 text-rose-700 border border-rose-200 shadow-none px-1"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-amber-600 uppercase block">
                            Industry Recommended
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.skillGap.recommended
                              .slice(0, 3)
                              .map((s) => (
                                <Badge
                                  key={s}
                                  className="text-[7px] font-bold bg-amber-50 text-amber-700 border border-amber-200 shadow-none px-1"
                                >
                                  {s}
                                </Badge>
                              ))}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-blue-600 uppercase block">
                            Job-Specific Required
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {analysis.skillGap.missing.slice(0, 3).map((s) => (
                              <Badge
                                key={s}
                                className="text-[7px] font-bold bg-blue-50 text-blue-700 border border-blue-200 shadow-none px-1"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </BrutalCard>
                  </div>
                )}

                {/* TAB 4: AI REWRITER & CHECKLIST */}
                {activeMenuTab === "rewrites" && (
                  <div className="grid gap-6">
                    {/* Checklist */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        ATS Optimization Checklist
                      </h4>
                      <div className="grid gap-3 sm:grid-cols-3 text-[10px] font-bold text-foreground-secondary leading-snug">
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-green-600 uppercase block">
                            Completed (✅)
                          </span>
                          <p className="flex gap-1.5">
                            <span className="text-green-600">✓</span> Contact
                            Info Formatted
                          </p>
                          <p className="flex gap-1.5">
                            <span className="text-green-600">✓</span> Sections
                            Ordered Properly
                          </p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-amber-600 uppercase block">
                            Recommended (⚠)
                          </span>
                          {analysis.suggestions.medium.map((item, i) => (
                            <p key={i} className="flex gap-1.5 text-amber-600">
                              <span className="font-extrabold">⚠</span> {item}
                            </p>
                          ))}
                        </div>
                        <div className="space-y-2">
                          <span className="text-[7.5px] font-black text-rose-600 uppercase block">
                            Missing (❌)
                          </span>
                          {analysis.suggestions.high.map((item, i) => (
                            <p key={i} className="flex gap-1.5 text-rose-600">
                              <span className="font-extrabold">✗</span> {item}
                            </p>
                          ))}
                          {analysis.suggestions.high.length === 0 && (
                            <p className="text-[8.5px] text-foreground-muted italic">
                              No high-priority issues remaining!
                            </p>
                          )}
                        </div>
                      </div>
                    </BrutalCard>

                    {/* Interactive Bullet Rewriter */}
                    <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow space-y-4">
                      <div className="border-b border-border/10 pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                          <Sparkles className="h-4 w-4 text-primary animate-pulse" />{" "}
                          AI rewrite Studio Workspace
                        </h4>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1.5">
                          <label
                            htmlFor="rewrite-select"
                            className="text-[7.5px] font-black uppercase text-foreground-muted block"
                          >
                            Select Section item to Rewrite
                          </label>
                          <BrutalSelect
                            id="rewrite-select"
                            value={bulletTarget}
                            onChange={(
                              e: React.ChangeEvent<HTMLSelectElement>,
                            ) => setBulletTarget(e.target.value)}
                            options={[
                              {
                                label: "Professional Summary statement",
                                value: "summary",
                              },
                              {
                                label: "Work Experience bullet points",
                                value: "experience",
                              },
                              {
                                label: "Projects description details",
                                value: "projects",
                              },
                              { label: "Skills Tag grouping", value: "skills" },
                            ]}
                            className="h-8 text-[10px] font-black uppercase w-full"
                          />
                        </div>
                        <div className="flex items-end justify-end">
                          <Button
                            onClick={handleRewriteBullet}
                            className="h-9 px-4 text-[9.5px] font-black uppercase border-2 border-border bg-primary text-white hover:bg-primary/90 brutal-shadow-xs hover:brutal-shadow"
                          >
                            Generate AI Optimization rewrite
                          </Button>
                        </div>
                      </div>

                      {/* Before vs After Rewrite Display */}
                      <div className="grid gap-4 md:grid-cols-2 pt-2 border-t border-border/10">
                        <div className="space-y-1">
                          <span className="text-[7.5px] font-black text-rose-600 uppercase block">
                            Current Version
                          </span>
                          <div className="p-3 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm text-xs font-bold text-foreground-secondary italic leading-relaxed">
                            {bulletTarget === "summary"
                              ? analysis.summaryOpt.original
                              : "Managed some components for a website project. Worked to fix bugs."}
                          </div>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[7.5px] font-black text-green-600 uppercase block">
                            Optimized Version
                          </span>
                          <div className="p-3 border-2 border-green-300 dark:border-green-500/30 bg-green-50/5 dark:bg-green-500/5 rounded-sm text-xs font-bold text-foreground leading-relaxed">
                            {optimizedBullet ? (
                              optimizedBullet
                            ) : (
                              <span className="text-[9.5px] font-medium text-foreground-muted italic">
                                Click Generate above to evaluate tailored
                                rewrites.
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </BrutalCard>
                  </div>
                )}

                {/* TAB 5: COMPARE PREVIEW & HISTORY LOG */}
                {activeMenuTab === "comparison" && (
                  <div className="grid gap-6">
                    {/* Before vs After comparison Split preview */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2">
                        Before vs After Comparison
                      </h4>

                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-foreground-muted uppercase block">
                            Original Document layout
                          </span>
                          <div className="p-4 border-2 border-border bg-slate-50/20 dark:bg-surface-secondary/20 rounded-sm space-y-3 font-mono text-[9px] text-foreground-secondary leading-normal">
                            <p className="font-bold border-b border-border/10 pb-1">
                              ANSHUL KUMAR
                            </p>
                            <p className="italic">
                              Experienced frontend developer. Helped build
                              dynamic client web interfaces.
                            </p>
                            <p className="font-bold pt-1.5">EXPERIENCE:</p>
                            <p>• Helped manage team building custom widgets.</p>
                            <p>• Worked to optimize page load speeds.</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[8px] font-black text-primary uppercase block">
                            Optimized Document layout
                          </span>
                          <div className="p-4 border-2 border-primary bg-primary/5 rounded-sm space-y-3 font-mono text-[9px] text-foreground leading-normal">
                            <p className="font-black border-b-2 border-primary pb-1">
                              ANSHUL KUMAR{" "}
                              <span className="text-[7.5px] text-primary">
                                (Verified Info)
                              </span>
                            </p>
                            <p className="font-semibold text-foreground">
                              <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                                Engineered
                              </mark>{" "}
                              robust React interfaces with{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                                8+ years expertise
                              </mark>
                              .
                            </p>
                            <p className="font-black pt-1.5">EXPERIENCE:</p>
                            <p>
                              •{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                                Architected
                              </mark>{" "}
                              custom frontend micro-widgets.
                            </p>
                            <p>
                              •{" "}
                              <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                                Optimized latency by 35%
                              </mark>{" "}
                              across routes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </BrutalCard>

                    {/* Version History Table log */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                      <div className="flex justify-between items-center border-b border-border/10 pb-2">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                          Optimization run logs History
                        </h4>
                        <button
                          onClick={clearHistory}
                          className="text-[7.5px] font-black uppercase text-error hover:text-error/85 focus:outline-none"
                        >
                          Clear History Log
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[9.5px] font-bold uppercase tracking-wider text-foreground-secondary">
                          <thead className="bg-surface-secondary/40 text-[8.5px] border-b border-border">
                            <tr>
                              <th className="p-2">Date & Time</th>
                              <th className="p-2">Target Title</th>
                              <th className="p-2">Version Name</th>
                              <th className="p-2 text-right">ATS Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            {history.length > 0 ? (
                              history.map((h) => (
                                <tr
                                  key={h.id}
                                  className="border-b border-border/5 hover:bg-slate-50/40"
                                >
                                  <td className="p-2 font-mono text-[8.5px] text-foreground-muted">
                                    {h.date}
                                  </td>
                                  <td className="p-2 normal-case max-w-[150px] truncate">
                                    {h.jobTitle}
                                  </td>
                                  <td className="p-2 truncate max-w-[100px]">
                                    {h.version}
                                  </td>
                                  <td className="p-2 text-right font-black text-primary font-mono">
                                    {h.atsScore}%
                                  </td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td
                                  colSpan={4}
                                  className="p-4 text-center text-foreground-muted italic uppercase text-[8px]"
                                >
                                  No previous versions saved.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </BrutalCard>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save version modal dialog */}
      <AnimatePresence>
        {isSaveModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsSaveModalOpen(false)}
              className="absolute inset-0 bg-foreground/50 backdrop-blur-xs"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-sm bg-surface border-[3px] border-border brutal-shadow rounded-sm p-6 space-y-4 z-10 text-left"
            >
              <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground">
                  Save Tailored Version
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSaveModalOpen(false)}
                  className="h-7 w-7 border border-border/30 hover:bg-surface-secondary rounded-sm"
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </div>

              <form onSubmit={handleSaveVersionSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="version-name"
                    className="text-[8.5px] font-black uppercase text-foreground-muted block"
                  >
                    Version Name
                  </label>
                  <Input
                    id="version-name"
                    required
                    placeholder="e.g. Stripe Lead Tailor"
                    value={newVersionName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewVersionName(e.target.value)
                    }
                    className="h-9 text-xs font-bold border border-border bg-surface"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    className="flex-1 h-9 text-xs font-black uppercase tracking-wider bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow rounded-sm"
                  >
                    Save Variant
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setIsSaveModalOpen(false)}
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

      <ConfirmationDialog />
    </div>
  );
}
