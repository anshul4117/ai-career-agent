"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Sparkles, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { MOCK_TEMPLATES } from "@/features/resume/services/resume.service";
import { cn } from "@/lib/utils";

export function ResumeProgressCard() {
  const { resumes, loadResumes } = useResumeStore();

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const defaultResume = resumes.find((r) => r.isDefault && r.status === "active") || resumes.find((r) => r.status === "active");
  const template = defaultResume ? MOCK_TEMPLATES.find((t) => t.id === defaultResume.templateId) : null;

  const score = defaultResume ? defaultResume.atsScore : 0;
  const templateName = template ? template.name : "None";

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 flex flex-col justify-between space-y-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <Heading level="h4" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Resume Scorecard
            </Heading>
            <Text className="text-foreground-secondary text-xs">
              Review ATS matching and structural audit.
            </Text>
          </div>
          <span className="px-2 py-1 border-2 border-border text-xs font-black uppercase bg-success text-white brutal-shadow-sm">
            {defaultResume ? "100%" : "0%"} Ready
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full border-[3px] border-border bg-surface-secondary overflow-hidden rounded-sm p-[2px]">
            <div 
              className="h-full bg-primary border-r-2 border-border transition-all duration-500" 
              style={{ width: `${defaultResume ? 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 border-t-2 border-border/10 pt-4">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-foreground-muted">ATS Alignment</p>
            <p className={cn("text-lg font-black flex items-center gap-1", defaultResume ? "text-success" : "text-foreground-muted")}>
              <Sparkles className="h-4 w-4" />
              {defaultResume ? `${score}% Score` : "—"}
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-foreground-muted">Template</p>
            <p className="text-sm font-bold uppercase">{templateName}</p>
          </div>
        </div>

        {/* Completed & Missing Sections */}
        <div className="space-y-2 pt-2">
          {defaultResume ? (
            <>
              <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
                <span className="truncate">Active layout: {defaultResume.title}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-foreground-muted font-mono text-[9px]">
                <span>Created on {new Date(defaultResume.createdAt).toLocaleDateString()}</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-foreground-muted">
              <AlertCircle className="h-4 w-4 text-warning shrink-0" />
              <span>Create a resume draft to start tracking score.</span>
            </div>
          )}
        </div>
      </div>

      <div className="pt-2">
        <BrutalButton asChild variant="secondary" className="w-full h-11 uppercase font-bold text-xs tracking-wider">
          <Link href={defaultResume ? `/resume/${defaultResume.id}` : "/resume/new"}>
            {defaultResume ? "View & Print Resume" : "Create Resume"}
          </Link>
        </BrutalButton>
      </div>
    </BrutalCard>
  );
}
