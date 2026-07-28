"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParserStore } from "@/features/resume/store/resume-parser.store";
import { FileUploader } from "@/features/resume/components/parser/file-uploader";
import { ParseProgress } from "@/features/resume/components/parser/parse-progress";
import { ReviewPanel } from "@/features/resume/components/parser/review-panel";
import { ParserErrorView } from "@/features/resume/components/parser/parser-states";
import { Heading } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Sparkles,
  FileText,
  AlertTriangle,
  History,
  Database,
} from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ParseHistoryItem {
  id: string;
  uploadDate: string;
  resumeName: string;
  parseDuration: string;
  successRate: number;
  version: string;
  status: "success" | "failed";
  errors?: string[];
}

const mockHistoryData: ParseHistoryItem[] = [
  {
    id: "hist-1",
    uploadDate: "2026-07-27",
    resumeName: "Anshul_Resume_2026.pdf",
    parseDuration: "3.2s",
    successRate: 95,
    version: "v2.1",
    status: "success",
  },
  {
    id: "hist-2",
    uploadDate: "2026-07-25",
    resumeName: "Anshul_Backend_CV.pdf",
    parseDuration: "4.1s",
    successRate: 88,
    version: "v1.8",
    status: "success",
  },
  {
    id: "hist-3",
    uploadDate: "2026-07-10",
    resumeName: "Old_Resume_Draft.docx",
    parseDuration: "2.8s",
    successRate: 45,
    version: "v1.0",
    status: "failed",
    errors: [
      "OCR Failure on Page 3",
      "Unsupported layout format",
      "Low confidence tags",
    ],
  },
];

export default function ResumeImportPage() {
  const {
    processingState,
    uploadedFile,
    resetParserStore,
    startParsing,
    retryParsing,
    error,
    setUploadedFile,
  } = useParserStore();

  const [activePreset, setActivePreset] = useState<
    "engineer" | "frontend" | "backend" | "fullstack" | "analyst"
  >("engineer");

  // Demo interactive states to simulate Empty States / Errors
  const [demoState, setDemoState] = useState<
    "all" | "empty_uploads" | "empty_history" | "parsing_errors"
  >("all");

  // Reset store on mount / unmount to avoid stale file states
  useEffect(() => {
    resetParserStore();
    return () => {
      resetParserStore();
    };
  }, [resetParserStore]);

  const handleStartParsing = async (
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst",
  ) => {
    if (!uploadedFile) {
      toast.error("Please select a resume file first.");
      return;
    }
    setActivePreset(rolePreset);
    const toastId = toast.loading("Analyzing structure...");
    try {
      await startParsing(uploadedFile, rolePreset);
      toast.success("AI Resume Structuring complete!", { id: toastId });
    } catch {
      toast.error("Failed to parse resume.", { id: toastId });
    }
  };

  const handleRetry = async () => {
    const toastId = toast.loading("Re-initiating parsing...");
    try {
      await retryParsing(activePreset);
      toast.success("AI Resume Structuring complete!", { id: toastId });
    } catch {
      toast.error("Failed to parse resume.", { id: toastId });
    }
  };

  const handleCancel = () => {
    resetParserStore();
  };

  const getErrorType = (msg: string | null) => {
    if (!msg) return "generic";
    const lower = msg.toLowerCase();
    if (lower.includes("timeout") || lower.includes("long")) return "timeout";
    if (lower.includes("format") || lower.includes("unsupported"))
      return "unsupported";
    if (lower.includes("corrupt") || lower.includes("read")) return "corrupted";
    if (lower.includes("network") || lower.includes("connection"))
      return "network";
    return "generic";
  };

  // Compute Stats based on demo state
  const totalParsed = demoState === "empty_history" ? 0 : 3;
  const avgConfidence = demoState === "empty_history" ? 0 : 89;
  const newSkills = demoState === "empty_history" ? 0 : 14;
  const completionIncrease = demoState === "empty_history" ? 0 : 35;

  return (
    <div className="space-y-6 w-full min-w-0 pb-16 select-none text-left">
      {/* Header / Breadcrumb navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            className="h-10 w-10 flex items-center justify-center border-[3px] border-border bg-surface brutal-shadow-xs hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all active:translate-x-0 active:translate-y-0 shrink-0"
            aria-label="Back to resumes workspace"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary shrink-0 animate-pulse" />
              <Heading
                level="h2"
                className="text-xl md:text-2xl font-black uppercase tracking-tight"
              >
                AI Resume Parser Center
              </Heading>
            </div>
            <p className="text-foreground-secondary text-[10px]">
              Extract structured details from PDF/DOCX resumes to Candidate
              Profile and builder forms.
            </p>
          </div>
        </div>

        {/* Demo State Control Selector */}
        {processingState === "waiting" && (
          <div className="flex items-center gap-1.5 bg-surface-secondary/40 border-2 border-border p-2 rounded-sm text-[8px] font-black uppercase">
            <span>Demo:</span>
            <button
              onClick={() => {
                setDemoState("all");
                setUploadedFile(null);
              }}
              className={cn(
                "px-1.5 py-0.5 border border-border rounded-sm transition-colors",
                demoState === "all"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-surface-secondary",
              )}
            >
              All Data
            </button>
            <button
              onClick={() => {
                setDemoState("empty_uploads");
                setUploadedFile(null);
              }}
              className={cn(
                "px-1.5 py-0.5 border border-border rounded-sm transition-colors",
                demoState === "empty_uploads"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-surface-secondary",
              )}
            >
              No Upload
            </button>
            <button
              onClick={() => {
                setDemoState("empty_history");
                setUploadedFile(null);
              }}
              className={cn(
                "px-1.5 py-0.5 border border-border rounded-sm transition-colors",
                demoState === "empty_history"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-surface-secondary",
              )}
            >
              No History
            </button>
            <button
              onClick={() => {
                setDemoState("parsing_errors");
                setUploadedFile(null);
              }}
              className={cn(
                "px-1.5 py-0.5 border border-border rounded-sm transition-colors",
                demoState === "parsing_errors"
                  ? "bg-primary text-white"
                  : "bg-surface hover:bg-surface-secondary",
              )}
            >
              Parse Errors
            </button>
          </div>
        )}
      </div>

      {/* Main Dashboard Stats Row */}
      {processingState === "waiting" && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
            <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
              Total Parsed Resumes
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-black text-foreground">
                {totalParsed}
              </span>
              <span className="text-[8px] font-bold text-foreground-muted uppercase">
                files
              </span>
            </div>
          </BrutalCard>

          <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
            <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
              Average Confidence
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-black text-primary">
                {avgConfidence}%
              </span>
              <span className="text-[8px] font-bold text-green-600 uppercase">
                High
              </span>
            </div>
          </BrutalCard>

          <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
            <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
              New Skills Discovered
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-black text-foreground">
                +{newSkills}
              </span>
              <span className="text-[8px] font-bold text-foreground-muted uppercase">
                tags
              </span>
            </div>
          </BrutalCard>

          <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs text-left">
            <p className="text-[8px] font-black uppercase tracking-wider text-foreground-secondary">
              Completion Boost
            </p>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-mono text-2xl font-black text-foreground">
                +{completionIncrease}%
              </span>
              <span className="text-[8px] font-bold text-primary uppercase">
                profile
              </span>
            </div>
          </BrutalCard>
        </div>
      )}

      {/* Main Workflow Switcher Card */}
      <BrutalCard className="p-6 bg-surface border-[3px] border-border brutal-shadow">
        {/* State: WAITING (Uploader & Config Panel) */}
        {processingState === "waiting" && (
          <div className="grid gap-6 lg:grid-cols-3 items-start">
            {/* Left/Middle Columns: Upload dropzone and Selected Resume Card */}
            <div className="lg:col-span-2 space-y-6">
              {/* Parsing Errors Widget (if demoState is parsing_errors) */}
              {demoState === "parsing_errors" && (
                <BrutalCard className="p-4 border-2 border-red-300 bg-red-50 text-left space-y-2">
                  <div className="flex items-center gap-1.5 text-red-700 text-xs font-black uppercase">
                    <AlertTriangle className="h-4 w-4" /> Parsing Warning
                    Indicators
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[9px] font-semibold text-red-700 leading-snug">
                    <div className="flex items-start gap-1">
                      <span>•</span>
                      <span>
                        <strong>OCR Text Failure:</strong> Text layer extraction
                        failed on page 3. Verify PDF copy.
                      </span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span>•</span>
                      <span>
                        <strong>Unsupported Document:</strong> Old RichText
                        layout structure might result in entity loss.
                      </span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span>•</span>
                      <span>
                        <strong>Missing Core Sections:</strong> No explicit
                        &apos;Projects&apos; or &apos;Languages&apos; blocks
                        found.
                      </span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span>•</span>
                      <span>
                        <strong>Low Confidence Warning:</strong> Experience node
                        matching returned score below 60%.
                      </span>
                    </div>
                  </div>
                </BrutalCard>
              )}

              {/* Upload Drozone Area */}
              <div className="space-y-4">
                <div className="text-center space-y-2">
                  <Heading
                    level="h3"
                    className="text-sm font-black uppercase tracking-wider text-foreground"
                  >
                    Upload Resume Document
                  </Heading>
                  <p className="text-[10px] text-foreground-secondary leading-relaxed max-w-xl mx-auto">
                    Provide your existing resume in PDF or DOCX format. The
                    parser will extract job experiences, education listings,
                    skills tags, and profile metadata automatically.
                  </p>
                </div>
                <FileUploader onStartParsing={handleStartParsing} />
              </div>

              {/* Selected / Uploaded File Status */}
              {demoState !== "empty_uploads" && uploadedFile ? (
                <BrutalCard className="p-4 border-2 border-border bg-surface-secondary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 border border-border bg-surface rounded-sm">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-left">
                      <h4 className="text-[10px] font-black uppercase text-foreground-secondary">
                        Currently Selected
                      </h4>
                      <p className="text-xs font-mono font-black text-foreground">
                        {uploadedFile.name}
                      </p>
                      <p className="text-[8px] font-semibold text-foreground-muted uppercase">
                        {(uploadedFile.size / 1024).toFixed(1)} KB • PDF
                        Document
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
                    <Button
                      onClick={() => handleStartParsing(activePreset)}
                      className="h-8 text-[9px] font-black uppercase border-2 border-border brutal-shadow-xs bg-primary text-white hover:bg-primary/90 flex-1 sm:flex-initial"
                    >
                      Parse File
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setUploadedFile(null)}
                      className="h-8 text-[9px] font-black uppercase border-2 border-border bg-surface hover:bg-surface-secondary flex-1 sm:flex-initial"
                    >
                      Remove
                    </Button>
                  </div>
                </BrutalCard>
              ) : (
                <BrutalCard className="p-5 border-2 border-dashed border-border/30 bg-surface-secondary/5 text-center text-foreground-muted text-[10px] font-semibold">
                  No resume selected for current parsing session. Upload a file
                  above.
                </BrutalCard>
              )}
            </div>

            {/* Right Column: Parsing Stats & History Feed */}
            <div className="space-y-6 text-left border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-6 lg:pt-0 lg:pl-6">
              {/* Parsing Statistics */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground flex items-center gap-1">
                  <Database className="h-4 w-4 text-primary" /> Parsing
                  Statistics
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[9px] font-bold uppercase text-foreground-secondary">
                  <div className="border border-border p-2 bg-surface">
                    <span className="block text-[8px] text-foreground-muted">
                      Success Parses
                    </span>
                    <span className="font-mono text-xs font-black text-foreground">
                      {demoState === "empty_history" ? 0 : 2}
                    </span>
                  </div>
                  <div className="border border-border p-2 bg-surface">
                    <span className="block text-[8px] text-foreground-muted">
                      Failed Parses
                    </span>
                    <span className="font-mono text-xs font-black text-foreground">
                      {demoState === "empty_history" ? 0 : 1}
                    </span>
                  </div>
                  <div className="border border-border p-2 bg-surface">
                    <span className="block text-[8px] text-foreground-muted">
                      Success Rate
                    </span>
                    <span className="font-mono text-xs font-black text-primary">
                      {demoState === "empty_history" ? "0%" : "66%"}
                    </span>
                  </div>
                  <div className="border border-border p-2 bg-surface">
                    <span className="block text-[8px] text-foreground-muted">
                      Last parsed date
                    </span>
                    <span className="font-mono text-xs font-black text-foreground">
                      {demoState === "empty_history"
                        ? "Never"
                        : "July 27, 2026"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Parsing History */}
              <div className="space-y-3 border-t border-border/10 pt-4">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-foreground flex items-center gap-1">
                  <History className="h-4 w-4 text-primary" /> Latest parsing
                  history
                </h4>

                {demoState === "empty_history" ? (
                  <div className="border border-dashed border-border/30 p-5 text-center text-foreground-muted text-[9px] font-semibold">
                    No parse history records found.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {mockHistoryData.map((item) => (
                      <div
                        key={item.id}
                        className="border-2 border-border p-3 space-y-2 bg-surface text-left"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0 flex-1">
                            <h5 className="text-[9px] font-black uppercase text-foreground truncate">
                              {item.resumeName}
                            </h5>
                            <span className="text-[8px] font-semibold text-foreground-secondary block mt-0.5">
                              {item.uploadDate}
                            </span>
                          </div>
                          <Badge
                            className={cn(
                              "text-[7px] font-black uppercase border shadow-none px-1.5 py-0.2 rounded-sm shrink-0",
                              item.status === "success"
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-red-100 text-red-700 border-red-300",
                            )}
                          >
                            {item.status === "success" ? "Success" : "Failed"}
                          </Badge>
                        </div>

                        {item.errors && item.errors.length > 0 && (
                          <div className="bg-red-50 p-2 border border-red-300 rounded-sm space-y-1">
                            {item.errors.map((e, idx) => (
                              <span
                                key={idx}
                                className="block text-[7.5px] font-bold text-red-700 leading-none"
                              >
                                ⚠️ {e}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="border-t border-border/10 pt-1.5 flex items-center justify-between text-[7.5px] font-bold uppercase text-foreground-muted">
                          <span>Duration: {item.parseDuration}</span>
                          <span>Version: {item.version}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* State: PARSING (Pipeline Stepper animation) */}
        {processingState === "parsing" && (
          <div className="space-y-4 py-8">
            <div className="max-w-xl mx-auto text-center space-y-2 mb-4">
              <Heading
                level="h3"
                className="text-sm font-black uppercase tracking-wider text-foreground"
              >
                Analyzing Document Structure
              </Heading>
              <p className="text-[10px] text-foreground-secondary leading-relaxed animate-pulse">
                Please wait. Extracting nodes, mapping entities, and calculating
                confidence indexes...
              </p>
            </div>
            <ParseProgress />
          </div>
        )}

        {/* State: FAILED (Interactive Error component) */}
        {processingState === "failed" && (
          <ParserErrorView
            errorType={getErrorType(error)}
            message={error || undefined}
            onRetry={handleRetry}
            onCancel={handleCancel}
          />
        )}

        {/* State: COMPLETED (Review & Syncer panel) */}
        {processingState === "completed" && (
          <div className="space-y-4">
            <div className="border-b-2 border-border/10 pb-3 mb-4">
              <Heading
                level="h3"
                className="text-base font-black uppercase tracking-wider text-foreground"
              >
                Review Extracted Details
              </Heading>
              <p className="text-[10px] text-foreground-secondary leading-relaxed pt-0.5">
                Verify each section before saving. Highlighted items indicate
                low confidence where OCR/AI parsing requires careful
                verification.
              </p>
            </div>
            <ReviewPanel />
          </div>
        )}
      </BrutalCard>
    </div>
  );
}
