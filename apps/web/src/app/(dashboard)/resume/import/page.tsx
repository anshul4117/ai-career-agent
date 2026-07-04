"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useParserStore } from "@/features/resume/store/resume-parser.store";
import { resumeParserService } from "@/features/resume/services/resume-parser.service";
import { FileUploader } from "@/features/resume/components/parser/file-uploader";
import { ParseProgress } from "@/features/resume/components/parser/parse-progress";
import { ReviewPanel } from "@/features/resume/components/parser/review-panel";
import { Heading } from "@/components/ui/typography";
import { ArrowLeft, Sparkles } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";

export default function ResumeImportPage() {
  const { processingState, uploadedFile, resetParserStore } = useParserStore();

  // Reset store on mount / unmount to avoid stale file states
  useEffect(() => {
    resetParserStore();
    return () => {
      resetParserStore();
    };
  }, [resetParserStore]);

  const handleStartParsing = async (rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst") => {
    if (!uploadedFile) return;
    await resumeParserService.parseResumeWorkflow(uploadedFile, rolePreset);
  };

  return (
    <div className="space-y-6 w-full min-w-0 pb-16">
      
      {/* Header / Breadcrumb navigation */}
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
            <Heading level="h2" className="text-xl md:text-2xl font-black uppercase tracking-tight">
              AI Resume Parser
            </Heading>
          </div>
          <p className="text-foreground-secondary text-[10px]">
            Extract structured details from PDF/DOCX resumes to Candidate Profile and builder forms.
          </p>
        </div>
      </div>

      {/* Main Workflow Switcher Card */}
      <BrutalCard className="p-6 bg-surface border-[3px] border-border brutal-shadow">
        
        {/* State: IDLE or ERROR */}
        {(processingState === "idle" || processingState === "error") && (
          <div className="space-y-4">
            <div className="max-w-xl mx-auto text-center space-y-2 mb-4">
              <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                Upload Resume Document
              </Heading>
              <p className="text-[10px] text-foreground-secondary leading-relaxed">
                Provide your existing resume. The parser will extract job experiences, education listings, skills tags, and profile metadata automatically.
              </p>
            </div>
            <FileUploader onStartParsing={handleStartParsing} />
          </div>
        )}

        {/* State: PROCESSING PIPELINE */}
        {(processingState === "uploading" || processingState === "extracting" || processingState === "parsing") && (
          <div className="space-y-4 py-8">
            <div className="max-w-xl mx-auto text-center space-y-2 mb-4">
              <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                Analyzing Document Structure
              </Heading>
              <p className="text-[10px] text-foreground-secondary leading-relaxed animate-pulse">
                Please wait. Extracting nodes, mapping entities, and calculating confidence indexes...
              </p>
            </div>
            <ParseProgress />
          </div>
        )}

        {/* State: REVIEW PANEL */}
        {processingState === "completed" && (
          <div className="space-y-4">
            <div className="border-b-2 border-border/10 pb-3 mb-4">
              <Heading level="h3" className="text-base font-black uppercase tracking-wider text-foreground">
                Review Extracted Details
              </Heading>
              <p className="text-[10px] text-foreground-secondary leading-relaxed pt-0.5">
                Verify each section before saving. Highlighted items indicate low confidence where OCR/AI parsing requires careful verification.
              </p>
            </div>
            <ReviewPanel />
          </div>
        )}

      </BrutalCard>

    </div>
  );
}
