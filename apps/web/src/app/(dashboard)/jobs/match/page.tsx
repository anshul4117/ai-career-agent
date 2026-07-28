"use client";

import React, { useEffect, useState } from "react";
import { useMatchStore } from "@/features/jobs/store/match.store";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { mockJobs } from "@/features/jobs/mock/jobs-data";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Database,
  BarChart,
  ChevronDown,
  ChevronUp,
  Trash2,
  RefreshCw,
  BookOpen,
  Eye,
  Info,
  ArrowRightLeft,
  History as HistoryIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function AIJobMatchingPage() {
  const router = useRouter();
  const {
    history,
    activeAnalysis,
    loadingAnalysis,
    analyzeMatch,
    getMatchHistory,
    refreshAnalysis,
    deleteAnalysis,
  } = useMatchStore();

  const { uploadedResumes } = useResumeStore();

  // Dropdown selections
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Expandable state variables
  const [expandedSkillIdx, setExpandedSkillIdx] = useState<number | null>(null);

  // History filter configurations
  const [searchCompany, setSearchCompany] = useState("");
  const [scoreFilter, setScoreFilter] = useState<
    "all" | "high" | "medium" | "low"
  >("all");
  const [versionFilter, setVersionFilter] = useState("all");

  // Demo status controls
  const [demoState, setDemoState] = useState<
    | "all"
    | "empty_resume"
    | "empty_job"
    | "empty_history"
    | "error_net"
    | "error_description"
  >("all");

  // Load history on mount
  useEffect(() => {
    getMatchHistory();
  }, [getMatchHistory]);

  // Set initial selections from stores
  useEffect(() => {
    if (uploadedResumes.length > 0 && !selectedResumeId) {
      setSelectedResumeId(uploadedResumes[0].id);
    }
    if (mockJobs.length > 0 && !selectedJobId) {
      setSelectedJobId(mockJobs[0].id);
    }
  }, [uploadedResumes, selectedResumeId, selectedJobId]);

  // Handle Match scoring analysis triggers
  const handleAnalyze = async () => {
    if (!selectedResumeId) {
      setDemoState("empty_resume");
      return;
    }
    if (!selectedJobId) {
      setDemoState("empty_job");
      return;
    }
    await analyzeMatch(selectedResumeId, selectedJobId);
  };

  // Filtered Match History
  const filteredHistory = React.useMemo(() => {
    if (demoState === "empty_history") return [];

    return history.filter((item) => {
      const matchCompany =
        item.companyName.toLowerCase().includes(searchCompany.toLowerCase()) ||
        item.jobTitle.toLowerCase().includes(searchCompany.toLowerCase());

      const matchScore =
        scoreFilter === "all" ||
        (scoreFilter === "high" && item.matchScore >= 85) ||
        (scoreFilter === "medium" &&
          item.matchScore >= 60 &&
          item.matchScore < 85) ||
        (scoreFilter === "low" && item.matchScore < 60);

      const matchVersion =
        versionFilter === "all" || item.resumeVersion === versionFilter;

      return matchCompany && matchScore && matchVersion;
    });
  }, [history, searchCompany, scoreFilter, versionFilter, demoState]);

  // Extract versions for filter dropdown
  const uniqueVersions = React.useMemo(() => {
    const versions = new Set(history.map((h) => h.resumeVersion));
    return Array.from(versions);
  }, [history]);

  // Compute overall widgets stats
  const stats = React.useMemo(() => {
    if (history.length === 0)
      return { avg: 0, highest: 0, count: 0, improvements: 0 };
    const avg = Math.round(
      history.reduce((acc, h) => acc + h.matchScore, 0) / history.length,
    );
    const highest = Math.max(...history.map((h) => h.matchScore));
    return {
      avg,
      highest,
      count: history.length,
      improvements: history.reduce(
        (acc, h) => acc + h.resumeImprovements.length,
        0,
      ),
    };
  }, [history]);

  // Circular Progress Circle helper
  const renderCircularProgress = (
    score: number,
    size = 64,
    strokeWidth = 4,
  ) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (score / 100) * circumference;

    return (
      <div
        className="relative flex items-center justify-center"
        style={{ width: size, height: size }}
      >
        <svg
          className="absolute transform -rotate-90"
          style={{ width: size, height: size }}
        >
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className="stroke-slate-100 dark:stroke-surface-hover fill-none"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            className={cn(
              "fill-none transition-all duration-500",
              score >= 90
                ? "stroke-green-500"
                : score >= 75
                  ? "stroke-blue-500"
                  : score >= 50
                    ? "stroke-amber-500"
                    : "stroke-red-500",
            )}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
          />
        </svg>
        <span className="font-mono text-[10px] font-black text-foreground">
          {score}%
        </span>
      </div>
    );
  };

  // Reusable progress bar
  const renderProgressBar = (score: number, label: string) => {
    return (
      <div className="space-y-1 text-left w-full">
        <div className="flex justify-between items-center text-[9px] font-black uppercase">
          <span>{label}</span>
          <span>{score}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 dark:bg-surface-hover border border-border/20 rounded-sm overflow-hidden relative">
          <div
            className={cn(
              "h-full transition-all duration-300",
              score >= 85
                ? "bg-green-500"
                : score >= 70
                  ? "bg-blue-500"
                  : score >= 50
                    ? "bg-amber-500"
                    : "bg-red-500",
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 pb-12 select-none text-left max-w-[1200px] mx-auto w-full">
      {/* Back to discovery */}
      <div>
        <BrutalButton
          onClick={() => router.push("/jobs")}
          className="h-9 px-3.5 text-[9px] font-black uppercase border-2 border-border rounded-sm flex items-center gap-1.5"
        >
          <ArrowLeft className="h-4 w-4 stroke-[3px]" /> Back to discovery
        </BrutalButton>
      </div>

      <PageHeader
        title="AI Job Matching Optimizer"
        description="Scan your resume against any job description to evaluate ATS compatibility, key gaps, and AI resume changes."
      />

      {/* Demo Selector Panel */}
      <div className="flex flex-wrap items-center gap-2 bg-surface-secondary/40 p-3 border-2 border-border rounded-sm">
        <span className="text-[8px] font-black uppercase text-foreground-muted flex items-center gap-0.5">
          <Info className="h-3 w-3" /> State Selector:
        </span>
        <button
          onClick={() => setDemoState("all")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "all"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Active Suite
        </button>
        <button
          onClick={() => setDemoState("empty_resume")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "empty_resume"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          No Resume Selected
        </button>
        <button
          onClick={() => setDemoState("empty_job")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "empty_job"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          No Job Selected
        </button>
        <button
          onClick={() => setDemoState("empty_history")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "empty_history"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          No History
        </button>
        <button
          onClick={() => setDemoState("error_net")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "error_net"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Simulate Network Error
        </button>
        <button
          onClick={() => setDemoState("error_description")}
          className={cn(
            "px-2 py-1 text-[8px] font-black uppercase border border-border transition-colors",
            demoState === "error_description"
              ? "bg-primary text-white"
              : "bg-surface hover:bg-surface-secondary",
          )}
        >
          Unsupported Job Description
        </button>
      </div>

      {/* Render Skeletons / Loading State */}
      {loadingAnalysis && (
        <div className="space-y-6">
          <BrutalCard className="h-28 animate-pulse bg-surface-secondary/40 border-2 border-border" />
          <div className="grid gap-6 md:grid-cols-3">
            <BrutalCard className="h-64 animate-pulse bg-surface-secondary/40 border-2 border-border md:col-span-2" />
            <BrutalCard className="h-64 animate-pulse bg-surface-secondary/40 border-2 border-border" />
          </div>
        </div>
      )}

      {/* Main Matching Error States */}
      {!loadingAnalysis && demoState === "error_net" && (
        <BrutalCard className="p-6 border-2 border-red-300 bg-red-50 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase text-red-700">
              AI Calculations Failed
            </h3>
            <p className="text-[10px] text-red-700 leading-relaxed font-semibold">
              Calculations could not complete because a remote network API
              timeout error occurred. Please verify your connection status and
              try again.
            </p>
          </div>
          <Button
            onClick={() => setDemoState("all")}
            className="h-8.5 text-[9px] font-black uppercase border-2 border-border brutal-shadow-xs bg-red-700 text-white hover:bg-red-800 rounded-sm"
          >
            Retry Match Analysis
          </Button>
        </BrutalCard>
      )}

      {!loadingAnalysis && demoState === "error_description" && (
        <BrutalCard className="p-6 border-2 border-red-300 bg-red-50 text-center max-w-md mx-auto space-y-4">
          <AlertTriangle className="h-10 w-10 text-red-600 mx-auto animate-bounce" />
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase text-red-700">
              Unsupported Job Structure
            </h3>
            <p className="text-[10px] text-red-700 leading-relaxed font-semibold">
              The targeted job description contains inadequate wording layers or
              lacks explicit skills specifications required by the scoring
              algorithm.
            </p>
          </div>
          <Button
            onClick={() => setDemoState("all")}
            className="h-8.5 text-[9px] font-black uppercase border-2 border-border brutal-shadow-xs bg-red-700 text-white hover:bg-red-800 rounded-sm"
          >
            Load Mock Description
          </Button>
        </BrutalCard>
      )}

      {/* Select Resume & Job Dropdown Card */}
      {!loadingAnalysis &&
        demoState !== "error_net" &&
        demoState !== "error_description" && (
          <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Launch
              AI Match Scanner
            </h3>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 items-end">
              {/* 1. Resume Select */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[9px] font-black uppercase text-foreground-secondary">
                  Select Target Resume
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => {
                    setSelectedResumeId(e.target.value);
                    if (demoState === "empty_resume") setDemoState("all");
                  }}
                  className="border-2 border-border bg-surface p-2 text-[10px] font-black uppercase rounded-sm brutal-shadow-xs h-10 w-full cursor-pointer focus:ring-0 focus:outline-none"
                >
                  <option value="">-- No resume selected --</option>
                  {uploadedResumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.fileName} (v{r.version}.0)
                    </option>
                  ))}
                </select>
              </div>

              {/* 2. Job Select */}
              <div className="space-y-1.5 lg:col-span-2">
                <label className="text-[9px] font-black uppercase text-foreground-secondary">
                  Select Target Job Opportunity
                </label>
                <select
                  value={selectedJobId}
                  onChange={(e) => {
                    setSelectedJobId(e.target.value);
                    if (demoState === "empty_job") setDemoState("all");
                  }}
                  className="border-2 border-border bg-surface p-2 text-[10px] font-black uppercase rounded-sm brutal-shadow-xs h-10 w-full cursor-pointer focus:ring-0 focus:outline-none"
                >
                  <option value="">-- No job selected --</option>
                  {mockJobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.title} at {j.companyInfo.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 3. Run Button */}
              <Button
                onClick={handleAnalyze}
                className="h-10 text-[10px] font-black uppercase border-2 border-border brutal-shadow-xs bg-primary text-white hover:bg-primary/90 w-full"
              >
                Analyze Fit Score
              </Button>
            </div>
          </BrutalCard>
        )}

      {/* Main Analysis Output Panel */}
      {!loadingAnalysis &&
        demoState !== "error_net" &&
        demoState !== "error_description" && (
          <>
            {/* Active Analysis Details */}
            {activeAnalysis ? (
              <div className="grid gap-6 lg:grid-cols-3 items-start">
                {/* Left Column: Scores & breakdown */}
                <div className="space-y-6 lg:col-span-2">
                  {/* 1. Overall Score Panel */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                      {renderCircularProgress(activeAnalysis.matchScore, 72, 6)}
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black uppercase text-foreground">
                            Overall Job Fit Match
                          </h3>
                          <Badge
                            className={cn(
                              "text-[8px] font-black uppercase border px-1.5 py-0.2 rounded-sm shadow-none",
                              activeAnalysis.status === "Excellent" &&
                                "bg-green-100 text-green-700 border-green-300",
                              activeAnalysis.status === "Good" &&
                                "bg-blue-100 text-blue-700 border-blue-300",
                              activeAnalysis.status === "Average" &&
                                "bg-amber-100 text-amber-700 border-amber-300",
                              activeAnalysis.status === "Poor" &&
                                "bg-red-100 text-red-700 border-red-300",
                            )}
                          >
                            {activeAnalysis.status}
                          </Badge>
                        </div>
                        <p className="text-[9px] text-foreground-secondary leading-relaxed pt-0.5 normal-case font-semibold">
                          Scanning <strong>{activeAnalysis.resumeName}</strong>{" "}
                          against <strong>{activeAnalysis.jobTitle}</strong>{" "}
                          listing.
                        </p>
                        <p className="text-[8px] text-foreground-muted font-mono pt-1">
                          Last Analysed:{" "}
                          {new Date(activeAnalysis.date).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 w-full md:w-auto shrink-0">
                      <Button
                        onClick={() => refreshAnalysis(activeAnalysis.id)}
                        variant="ghost"
                        className="h-8.5 border border-border/20 bg-surface hover:bg-surface-secondary text-[9px] font-black uppercase flex items-center justify-center gap-1 flex-1 md:flex-initial"
                      >
                        <RefreshCw className="h-3.5 w-3.5" /> Re-Scan
                      </Button>
                      <Button
                        onClick={() => deleteAnalysis(activeAnalysis.id)}
                        variant="ghost"
                        className="h-8.5 border border-border/20 bg-surface hover:bg-red-50 text-red-700 hover:text-red-700 text-[9px] font-black uppercase flex items-center justify-center gap-1 flex-1 md:flex-initial"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Delete
                      </Button>
                    </div>
                  </BrutalCard>

                  {/* 2. Parameters breakdown progress bars */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <BarChart className="h-4 w-4 text-primary" /> ATS
                      Compatibility Parameters
                    </h4>

                    <div className="grid gap-4 sm:grid-cols-2">
                      {renderProgressBar(
                        activeAnalysis.atsCompatibility,
                        "ATS Compatibility Rating",
                      )}
                      {renderProgressBar(
                        activeAnalysis.skillsScore,
                        "Core Skills Matching",
                      )}
                      {renderProgressBar(
                        activeAnalysis.experienceScore,
                        "Professional Experience Fit",
                      )}
                      {renderProgressBar(
                        activeAnalysis.educationScore,
                        "Education Alignment",
                      )}
                      {renderProgressBar(
                        activeAnalysis.certificationsScore,
                        "Credentialing Index",
                      )}
                      {renderProgressBar(
                        activeAnalysis.projectsScore,
                        "Portfolio Projects Score",
                      )}
                      {renderProgressBar(
                        activeAnalysis.atsKeywordsScore,
                        "Important Keyword Density",
                      )}
                    </div>
                  </BrutalCard>

                  {/* 3. Gap Analysis comparison */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <ArrowRightLeft className="h-4 w-4 text-primary" />{" "}
                      Requirement Gap Analysis
                    </h4>
                    <div className="border border-border rounded-sm overflow-hidden text-xs">
                      <div className="grid grid-cols-3 bg-surface-secondary p-2.5 font-black uppercase text-[8.5px] border-b border-border">
                        <div>Requirement Target</div>
                        <div>Job Profile Demand</div>
                        <div>Current Resume Listing</div>
                      </div>
                      <div className="divide-y divide-border font-semibold text-[9px] text-foreground-secondary normal-case leading-relaxed">
                        {activeAnalysis.gapAnalysis.map((gap, i) => (
                          <div
                            key={i}
                            className="grid grid-cols-3 p-2.5 items-center"
                          >
                            <span className="font-bold text-foreground uppercase text-[8px]">
                              {gap.label}
                            </span>
                            <span>{gap.requirement}</span>
                            <div className="flex items-center gap-1.5">
                              <span
                                className={cn(
                                  "h-2 w-2 rounded-full",
                                  gap.status === "matched" && "bg-green-500",
                                  gap.status === "partially" && "bg-amber-500",
                                  gap.status === "missing" && "bg-red-500",
                                )}
                              />
                              <span>{gap.resumeValue}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </BrutalCard>

                  {/* 4. Missing Skills & Priority expander */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <AlertTriangle className="h-4 w-4 text-primary" /> Key
                      Missing Skills Analysis
                    </h4>

                    <div className="space-y-2.5">
                      {/* Technical Skills */}
                      <div className="space-y-1.5">
                        <p className="text-[8px] font-black uppercase text-foreground-muted tracking-wider">
                          Missing Tech Skills
                        </p>
                        <div className="grid gap-2">
                          {activeAnalysis.missingTechSkills.map(
                            (skill, idx) => (
                              <div
                                key={idx}
                                className="border border-border p-2.5 bg-surface-secondary/20 rounded-sm"
                              >
                                <div
                                  onClick={() =>
                                    setExpandedSkillIdx(
                                      expandedSkillIdx === idx ? null : idx,
                                    )
                                  }
                                  className="flex justify-between items-center cursor-pointer select-none"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black uppercase text-foreground">
                                      {skill.name}
                                    </span>
                                    <Badge
                                      className={cn(
                                        "text-[7px] font-black uppercase border shadow-none px-1.5 py-0.2 rounded-sm",
                                        skill.priority === "High"
                                          ? "bg-red-50 border-red-300 text-red-700"
                                          : skill.priority === "Medium"
                                            ? "bg-amber-50 border-amber-300 text-amber-700"
                                            : "bg-blue-50 border-blue-300 text-blue-700",
                                      )}
                                    >
                                      {skill.priority} Priority
                                    </Badge>
                                  </div>
                                  {expandedSkillIdx === idx ? (
                                    <ChevronUp className="h-4 w-4 text-foreground-muted" />
                                  ) : (
                                    <ChevronDown className="h-4 w-4 text-foreground-muted" />
                                  )}
                                </div>
                                {expandedSkillIdx === idx && (
                                  <p className="text-[9px] text-foreground-secondary leading-relaxed pt-1.5 border-t border-border/10 mt-1.5 normal-case font-semibold">
                                    {skill.desc}
                                  </p>
                                )}
                              </div>
                            ),
                          )}
                        </div>
                      </div>

                      {/* Soft Skills */}
                      <div className="space-y-1.5 pt-2.5 border-t border-border/10">
                        <p className="text-[8px] font-black uppercase text-foreground-muted tracking-wider">
                          Missing Soft Skills
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeAnalysis.missingSoftSkills.map((s, i) => (
                            <div
                              key={i}
                              className="border border-border p-2 bg-surface text-[9px] font-bold uppercase text-foreground-secondary"
                            >
                              {s.name}{" "}
                              <span className="text-[7.5px] font-semibold text-foreground-muted">
                                ({s.priority})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </BrutalCard>

                  {/* 5. Keyword Density Analysis */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <Database className="h-4 w-4 text-primary" /> ATS Keyword
                      Optimization density
                    </h4>

                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-foreground-secondary">
                        <span>Keyword Density:</span>
                        <Badge className="bg-surface-secondary border border-border/20 text-foreground text-[8px] font-mono shadow-none px-1.5 py-0.2 rounded-sm">
                          {activeAnalysis.keywordDensity}%
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-[7.5px] font-black uppercase text-green-600 tracking-wider">
                            Found ATS Keywords (
                            {activeAnalysis.foundKeywords.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {activeAnalysis.foundKeywords.map((k) => (
                              <Badge
                                key={k}
                                className="bg-green-50 text-green-700 border border-green-300 text-[8px] font-black uppercase px-2 py-0.5 shadow-none rounded-sm"
                              >
                                {k}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="pt-2">
                          <p className="text-[7.5px] font-black uppercase text-red-600 tracking-wider">
                            Missing ATS Keywords (
                            {activeAnalysis.missingKeywords.length})
                          </p>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {activeAnalysis.missingKeywords.map((k) => (
                              <Badge
                                key={k}
                                className="bg-red-50 text-red-700 border border-red-300 text-[8px] font-black uppercase px-2 py-0.5 shadow-none rounded-sm"
                              >
                                {k}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </BrutalCard>
                </div>

                {/* Right Column: AI Recommendations, Strengths, Weaknesses, Courses */}
                <div className="space-y-6 text-left">
                  {/* 1. Strengths & Weaknesses */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <CheckCircle className="h-4 w-4 text-primary" /> Profile
                      Strengths & Weaknesses
                    </h4>

                    <div className="space-y-4">
                      {/* Strengths */}
                      <div className="space-y-1.5">
                        <p className="text-[8px] font-black uppercase text-green-600 tracking-wider">
                          Strengths ({activeAnalysis.strengths.length})
                        </p>
                        <ul className="space-y-1.5 text-[8.5px] font-semibold text-foreground-secondary leading-snug normal-case">
                          {activeAnalysis.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-green-600 text-[10px] leading-none shrink-0">
                                ✓
                              </span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Weaknesses */}
                      <div className="space-y-1.5 border-t border-border/10 pt-3">
                        <p className="text-[8px] font-black uppercase text-red-600 tracking-wider">
                          Weaknesses ({activeAnalysis.weaknesses.length})
                        </p>
                        <ul className="space-y-1.5 text-[8.5px] font-semibold text-foreground-secondary leading-snug normal-case">
                          {activeAnalysis.weaknesses.map((w, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <span className="text-red-600 text-[10px] leading-none shrink-0">
                                ✗
                              </span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </BrutalCard>

                  {/* 2. Actionable AI Recommendations */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <Sparkles className="h-4 w-4 text-primary" /> Actionable
                      Recommendations
                    </h4>

                    <div className="space-y-3.5 text-[8.5px] font-semibold text-foreground-secondary leading-snug normal-case">
                      {activeAnalysis.resumeImprovements.length > 0 && (
                        <div>
                          <span className="text-[8px] font-black uppercase text-foreground-muted block">
                            Resume Structure Improvement
                          </span>
                          <p className="mt-0.5">
                            {activeAnalysis.resumeImprovements[0]}
                          </p>
                        </div>
                      )}

                      {activeAnalysis.suggestedProjects.length > 0 && (
                        <div>
                          <span className="text-[8px] font-black uppercase text-foreground-muted block">
                            Suggested Practice Projects
                          </span>
                          <p className="mt-0.5">
                            {activeAnalysis.suggestedProjects[0]}
                          </p>
                        </div>
                      )}

                      {activeAnalysis.suggestedCertifications.length > 0 && (
                        <div>
                          <span className="text-[8px] font-black uppercase text-foreground-muted block">
                            Suggested Professional Certifications
                          </span>
                          <p className="mt-0.5">
                            {activeAnalysis.suggestedCertifications[0]}
                          </p>
                        </div>
                      )}

                      {activeAnalysis.resumeKeywordSuggestions.length > 0 && (
                        <div>
                          <span className="text-[8px] font-black uppercase text-foreground-muted block">
                            Important Keywords to Add
                          </span>
                          <p className="mt-0.5 italic font-bold">
                            Try including:{" "}
                            {activeAnalysis.resumeKeywordSuggestions.join(", ")}
                          </p>
                        </div>
                      )}
                    </div>
                  </BrutalCard>

                  {/* 3. Learning Recommendations */}
                  <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5 border-b border-border/10 pb-2">
                      <BookOpen className="h-4 w-4 text-primary" /> Learning &
                      Course Advice
                    </h4>

                    <div className="space-y-3 text-[8.5px] font-semibold text-foreground-secondary leading-snug normal-case">
                      <p className="text-[8px] font-black uppercase text-foreground-muted tracking-wider">
                        Recommended Tutorials
                      </p>
                      <ul className="space-y-1.5">
                        {activeAnalysis.courses.map((course, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span className="text-primary text-[10px] leading-none shrink-0">
                              •
                            </span>
                            <span>{course}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </BrutalCard>
                </div>
              </div>
            ) : (
              /* Empty State: No analysis yet */
              <EmptyState
                icon={Sparkles}
                title="No match analysis loaded yet"
                description="Choose a resume version and target job opportunity above, and click Fit Score to calculate ATS alignment."
              />
            )}

            {/* Widgets stats summary cards */}
            {history.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
                  <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
                    Average Match Score
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-xl font-black text-primary">
                      {stats.avg}%
                    </span>
                    <span className="text-[8px] font-bold text-foreground-muted uppercase">
                      overall
                    </span>
                  </div>
                </BrutalCard>

                <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
                  <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
                    Highest Match Scored
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-xl font-black text-foreground">
                      {stats.highest}%
                    </span>
                    <span className="text-[8px] font-bold text-green-600 uppercase">
                      max
                    </span>
                  </div>
                </BrutalCard>

                <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
                  <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
                    Jobs Analyzed
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-xl font-black text-foreground">
                      {stats.count}
                    </span>
                    <span className="text-[8px] font-bold text-foreground-muted uppercase">
                      scanned
                    </span>
                  </div>
                </BrutalCard>

                <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
                  <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
                    Total Recommendations
                  </p>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="font-mono text-xl font-black text-foreground">
                      +{stats.improvements}
                    </span>
                    <span className="text-[8px] font-bold text-primary uppercase">
                      tips
                    </span>
                  </div>
                </BrutalCard>
              </div>
            )}

            {/* History Feed & Search Filters Section */}
            <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow text-left space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <HistoryIcon className="h-4 w-4 text-primary" /> AI Match Scans
                History log
              </h3>

              {/* Filter controls */}
              <div className="grid gap-3 sm:grid-cols-3 text-[9px] font-bold uppercase text-foreground-secondary">
                <div className="space-y-1">
                  <label>Filter by Employer / Role</label>
                  <input
                    type="text"
                    placeholder="e.g. TechCorp..."
                    value={searchCompany}
                    onChange={(e) => setSearchCompany(e.target.value)}
                    className="border-2 border-border bg-surface p-2 text-[10px] font-mono rounded-sm h-9 w-full outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label>Filter by Match Score</label>
                  <select
                    value={scoreFilter}
                    onChange={(e) =>
                      setScoreFilter(
                        e.target.value as "all" | "high" | "medium" | "low",
                      )
                    }
                    className="border-2 border-border bg-surface p-2 text-[10px] font-black uppercase rounded-sm h-9 w-full cursor-pointer outline-none"
                  >
                    <option value="all">All Match Scores</option>
                    <option value="high">Excellent (&gt;= 85%)</option>
                    <option value="medium">Good (60% - 84%)</option>
                    <option value="low">Poor (&lt; 60%)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label>Filter by Resume Version</label>
                  <select
                    value={versionFilter}
                    onChange={(e) => setVersionFilter(e.target.value)}
                    className="border-2 border-border bg-surface p-2 text-[10px] font-black uppercase rounded-sm h-9 w-full cursor-pointer outline-none"
                  >
                    <option value="all">All Resume Versions</option>
                    {uniqueVersions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* History Feed List */}
              {filteredHistory.length === 0 ? (
                <div className="border border-dashed border-border/30 p-6 text-center text-foreground-muted text-[10px] font-semibold">
                  No past matching records match the current filters.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {filteredHistory.map((item) => (
                    <div
                      key={item.id}
                      className="border-2 border-border p-4 space-y-3 bg-surface text-left"
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h4 className="text-[10px] font-black uppercase text-foreground truncate">
                            {item.jobTitle}
                          </h4>
                          <span className="text-[8px] font-bold text-foreground-muted block mt-0.5">
                            {item.companyName}
                          </span>
                        </div>
                        {renderCircularProgress(item.matchScore, 44, 3.5)}
                      </div>

                      <div className="border-t border-border/10 pt-2 flex flex-col gap-1 text-[8px] font-semibold text-foreground-secondary normal-case leading-snug">
                        <p>
                          📄 Resume:{" "}
                          <strong>
                            {item.resumeName} ({item.resumeVersion})
                          </strong>
                        </p>
                        <p>
                          📅 Scanned:{" "}
                          <strong>
                            {new Date(item.date).toLocaleDateString()}
                          </strong>
                        </p>
                      </div>

                      <div className="border-t border-border/10 pt-2 flex items-center justify-between text-[7px] font-black uppercase tracking-wider">
                        <Badge
                          className={cn(
                            "text-[7px] font-black uppercase border shadow-none px-1.5 py-0.2 rounded-sm",
                            item.status === "Excellent" &&
                              "bg-green-100 text-green-700 border-green-300",
                            item.status === "Good" &&
                              "bg-blue-100 text-blue-700 border-blue-300",
                            item.status === "Average" &&
                              "bg-amber-100 text-amber-700 border-amber-300",
                            item.status === "Poor" &&
                              "bg-red-100 text-red-700 border-red-300",
                          )}
                        >
                          {item.status}
                        </Badge>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() =>
                              useMatchStore.setState({ activeAnalysis: item })
                            }
                            className="hover:text-primary transition-colors text-[7.5px] font-black flex items-center gap-0.5"
                          >
                            <Eye className="h-3 w-3" /> View
                          </button>
                          <button
                            onClick={() => deleteAnalysis(item.id)}
                            className="text-red-700 hover:text-red-900 transition-colors text-[7.5px] font-black flex items-center gap-0.5"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </BrutalCard>
          </>
        )}
    </div>
  );
}
