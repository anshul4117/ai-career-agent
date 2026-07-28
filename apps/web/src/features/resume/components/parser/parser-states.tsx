"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  AlertOctagon,
  HelpCircle,
  FileX,
  RefreshCw,
  WifiOff,
  FileWarning,
  Clock,
} from "lucide-react";

// ----------------------------------------------------
// 1. LOADING STATE SKELETONS
// ----------------------------------------------------

interface SkeletonProps {
  type: "cards" | "list" | "progress" | "review";
}

export function ParserSkeleton({ type }: SkeletonProps) {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <BrutalCard
            key={i}
            className="p-5 border-[3px] border-border bg-surface brutal-shadow-sm space-y-3"
          >
            <div className="h-4 w-1/3 bg-foreground/10 rounded-sm" />
            <div className="space-y-2">
              <div className="h-3 w-full bg-foreground/5 rounded-sm" />
              <div className="h-3 w-5/6 bg-foreground/5 rounded-sm" />
            </div>
          </BrutalCard>
        ))}
      </div>
    );
  }

  if (type === "list") {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="border-2 border-border p-3 rounded-sm flex items-center justify-between"
          >
            <div className="flex items-center gap-3 w-2/3">
              <div className="h-8 w-8 bg-foreground/10 rounded-sm" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3 w-1/3 bg-foreground/10 rounded-sm" />
                <div className="h-2.5 w-1/2 bg-foreground/5 rounded-sm" />
              </div>
            </div>
            <div className="h-6 w-16 bg-foreground/10 rounded-sm" />
          </div>
        ))}
      </div>
    );
  }

  if (type === "progress") {
    return (
      <div className="max-w-xl mx-auto space-y-6 animate-pulse">
        <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex items-center gap-3">
          <div className="h-9 w-9 bg-foreground/10 rounded-sm" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3 w-1/4 bg-foreground/10 rounded-sm" />
            <div className="h-2.5 w-1/2 bg-foreground/5 rounded-sm" />
          </div>
        </BrutalCard>
        <BrutalCard className="p-5 border-2 border-border bg-surface brutal-shadow-sm space-y-3">
          <div className="h-3 w-20 bg-foreground/10 rounded-sm" />
          <div className="w-full h-6 border-2 border-border bg-foreground/5" />
        </BrutalCard>
      </div>
    );
  }

  // Type: REVIEW (Left-Right layout skeleton)
  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full animate-pulse pb-12">
      <div className="w-full lg:w-60 flex flex-row lg:flex-col gap-2 border-b-2 lg:border-b-0 lg:border-r-2 border-border pb-3 lg:pb-0 lg:pr-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-8 w-24 lg:w-full bg-foreground/10 rounded-sm"
          />
        ))}
      </div>
      <div className="flex-1 space-y-5">
        <BrutalCard className="p-6 border-[3px] border-border bg-surface brutal-shadow-sm space-y-4">
          <div className="h-4 w-1/4 bg-foreground/10 rounded-sm" />
          <div className="space-y-2">
            <div className="h-3 w-full bg-foreground/5 rounded-sm" />
            <div className="h-3 w-5/6 bg-foreground/5 rounded-sm" />
            <div className="h-3 w-4/5 bg-foreground/5 rounded-sm" />
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 2. ERROR STATE VIEW
// ----------------------------------------------------

interface ErrorProps {
  errorType: "timeout" | "unsupported" | "corrupted" | "network" | "generic";
  message?: string;
  onRetry: () => void;
  onCancel: () => void;
}

export function ParserErrorView({
  errorType,
  message,
  onRetry,
  onCancel,
}: ErrorProps) {
  const config = {
    timeout: {
      icon: Clock,
      title: "Parsing Operation Timeout",
      desc:
        message ||
        "The extraction pipeline took too long to return structured nodes. Please try again with a cleaner document format.",
    },
    unsupported: {
      icon: FileWarning,
      title: "Unsupported File Format",
      desc:
        message ||
        "We currently only support PDF and DOCX files. Please re-save or export your resume into one of these formats.",
    },
    corrupted: {
      icon: FileX,
      title: "Corrupted Resume File",
      desc:
        message ||
        "The parser could not read the raw byte stream of this file. It might be corrupted or password-protected.",
    },
    network: {
      icon: WifiOff,
      title: "Network Failure",
      desc:
        message ||
        "Connection lost during document parsing upload. Check your internet connection and try again.",
    },
    generic: {
      icon: AlertOctagon,
      title: "Structuring Failed",
      desc:
        message ||
        "An unexpected error occurred in our AI confidence analysis engine. If this repeats, please contact support.",
    },
  }[errorType] || {
    icon: AlertOctagon,
    title: "Structuring Failed",
    desc: message || "An unexpected error occurred during parsing.",
  };

  const IconComponent = config.icon;

  return (
    <div className="max-w-xl mx-auto py-12 px-4 text-center select-none space-y-6">
      <div className="inline-flex p-4 border-[3px] border-border bg-error/15 text-error rounded-sm brutal-shadow-xs">
        <IconComponent className="h-10 w-10" />
      </div>

      <div className="space-y-2">
        <Heading
          level="h3"
          className="text-base font-black uppercase tracking-wider text-error"
        >
          {config.title}
        </Heading>
        <p className="text-xs text-foreground-secondary leading-relaxed max-w-md mx-auto">
          {config.desc}
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <BrutalButton
          onClick={onRetry}
          className="h-10 px-5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5"
        >
          <RefreshCw className="h-3.5 w-3.5" /> Retry Parsing
        </BrutalButton>
        <BrutalButton
          onClick={onCancel}
          variant="secondary"
          className="h-10 px-5 text-[10px] font-black uppercase tracking-wider"
        >
          Cancel & Exit
        </BrutalButton>
      </div>
    </div>
  );
}

// ----------------------------------------------------
// 3. EMPTY STATE VIEW
// ----------------------------------------------------

interface EmptyProps {
  type: "no-resume" | "failed" | "no-data";
  onUploadClick?: () => void;
}

export function ParserEmptyState({ type, onUploadClick }: EmptyProps) {
  const content = {
    "no-resume": {
      title: "No Document Uploaded",
      desc: "Upload a PDF or DOCX resume to start the AI confidence parser. We will automatically structure and populate candidate info.",
      btnText: "Select Resume File",
    },
    failed: {
      title: "No Extracted Sections",
      desc: "Parsing failed or was cancelled. Please upload a clear text-based resume document and restart the extraction workflow.",
      btnText: "Restart Workflow",
    },
    "no-data": {
      title: "No parsed data reviewable",
      desc: "Wait for the parser progress stepper to complete. Parsed data will show up here for interactive diff checking.",
      btnText: "Back to Dashboard",
    },
  }[type];

  return (
    <div className="max-w-md mx-auto py-16 px-4 text-center select-none space-y-5">
      <div className="inline-flex p-4 border-2 border-border bg-surface-secondary/40 text-foreground-secondary rounded-sm">
        <HelpCircle className="h-8 w-8" />
      </div>

      <div className="space-y-1.5">
        <Heading
          level="h3"
          className="text-xs font-black uppercase tracking-wider text-foreground"
        >
          {content.title}
        </Heading>
        <p className="text-[10px] text-foreground-secondary leading-relaxed max-w-sm mx-auto">
          {content.desc}
        </p>
      </div>

      {onUploadClick && (
        <BrutalButton
          onClick={onUploadClick}
          className="h-9 px-4 text-[10px] font-black uppercase tracking-wider mx-auto"
        >
          {content.btnText}
        </BrutalButton>
      )}
    </div>
  );
}
