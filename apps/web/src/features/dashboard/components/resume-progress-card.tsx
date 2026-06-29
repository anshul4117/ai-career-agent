"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { Sparkles, FileText, CheckCircle2, AlertCircle } from "lucide-react";

export function ResumeProgressCard() {
  const completionPercentage = 85;
  
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
            {completionPercentage}% Complete
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="h-4 w-full border-[3px] border-border bg-surface-secondary overflow-hidden rounded-sm p-[2px]">
            <div 
              className="h-full bg-primary border-r-2 border-border" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 border-t-2 border-border/10 pt-4">
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-foreground-muted">ATS Alignment</p>
            <p className="text-lg font-black text-success flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              88% Score
            </p>
          </div>
          <div className="space-y-0.5">
            <p className="text-[10px] uppercase font-bold text-foreground-muted">Template</p>
            <p className="text-sm font-bold uppercase">Brutalist Bold</p>
          </div>
        </div>

        {/* Completed & Missing Sections */}
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <CheckCircle2 className="h-4 w-4 text-success shrink-0" />
            <span>Completed Sections: Contact, Experience, Skills, Education</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-foreground-secondary">
            <AlertCircle className="h-4 w-4 text-warning shrink-0" />
            <span>Missing: Certifications, Languages references</span>
          </div>
        </div>
      </div>

      <div className="pt-2">
        <BrutalButton asChild variant="secondary" className="w-full h-11 uppercase font-bold text-xs tracking-wider">
          <Link href="/resume/builder">Optimize Resume</Link>
        </BrutalButton>
      </div>
    </BrutalCard>
  );
}
