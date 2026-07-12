"use client";

import React from "react";
import { useParserStore } from "../../store/resume-parser.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Loader2, FileText, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

export function ParseProgress() {
  const { uploadedFile, processingState, progress } = useParserStore();

  const stages = [
    { id: "uploading", label: "File Uploading & Reader", desc: "Checking file signature and reading raw document stream" },
    { id: "extracting", label: "Text Elements Extraction", desc: "Extracting content blocks and raw text patterns" },
    { id: "parsing", label: "AI Structuring & Confidence Engine", desc: "Modeling personal info, listings, and matching entities" }
  ];

  // Helper to map visual status
  const getStageStatus = (stageId: string) => {
    const states = ["uploading", "extracting", "parsing", "completed"];
    const currentIdx = states.indexOf(processingState);
    const stageIdx = states.indexOf(stageId);

    if (processingState === "error") return "error";
    if (currentIdx > stageIdx) return "completed";
    if (currentIdx === stageIdx) return "active";
    return "pending";
  };

  return (
    <div className="max-w-xl mx-auto space-y-6 select-none">
      
      {/* File Info */}
      {uploadedFile && (
        <BrutalCard className="p-4 bg-surface border-2 border-border brutal-shadow-xs flex items-center gap-3">
          <div className="p-2 border border-border bg-surface-secondary/40 rounded-sm">
            <FileText className="h-5 w-5 text-foreground-secondary" />
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="text-[10px] font-black uppercase text-foreground-secondary truncate">
              Target Source File
            </h4>
            <p className="text-xs font-mono text-foreground truncate">
              {uploadedFile.name}
            </p>
            <p className="text-[9px] text-foreground-muted font-mono">
              {(uploadedFile.size / 1024).toFixed(1)} KB
            </p>
          </div>
        </BrutalCard>
      )}

      {/* Progress Bar */}
      <BrutalCard className="p-5 bg-surface border-2 border-border brutal-shadow-sm space-y-3">
        <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-foreground">
          <span>Processing Pipeline</span>
          <span>{progress}%</span>
        </div>

        {/* Outer track */}
        <div className="w-full h-6 border-3 border-border bg-slate-100 dark:bg-surface-hover rounded-none relative overflow-hidden">
          {/* Inner neon fill */}
          <div 
            className="h-full bg-primary border-r-2 border-border transition-all duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </BrutalCard>

      {/* Stage indicators */}
      <div className="space-y-3">
        {stages.map((stage) => {
          const status = getStageStatus(stage.id);
          return (
            <div 
              key={stage.id}
              className={cn(
                "border-2 border-border p-3 rounded-sm transition-colors",
                status === "active" ? "bg-surface brutal-shadow-xs border-primary" : "bg-surface-secondary/20 opacity-70"
              )}
            >
              <div className="flex items-start gap-3">
                {/* Icon marker */}
                <div className="pt-0.5 shrink-0">
                  {status === "completed" && <CheckCircle2 className="h-4.5 w-4.5 text-success fill-success/10" />}
                  {status === "active" && <Loader2 className="h-4.5 w-4.5 text-primary animate-spin" />}
                  {status === "pending" && <Circle className="h-4.5 w-4.5 text-foreground-muted" />}
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className={cn(
                    "text-[10px] font-black uppercase tracking-wider",
                    status === "active" ? "text-primary" : "text-foreground"
                  )}>
                    {stage.label}
                  </h4>
                  <p className="text-[10px] text-foreground-secondary pt-0.5 leading-relaxed font-semibold">
                    {stage.desc}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
