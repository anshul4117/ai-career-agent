"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";

import { ErrorMessage } from "@/features/auth/components/error-message";
import { ArrowLeft, Sparkles, Check, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

type TemplateType = "brutalist-bold" | "modern-clean" | "classic-tech";

export default function NewResumePage() {
  const router = useRouter();

  // States
  const [resumeName, setResumeName] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("brutalist-bold");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resumeName.trim()) {
      setError("Please specify a descriptive name for this resume draft.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Redirect to builder page
      router.push("/resume/builder");
    }, 800);
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/resume" className="p-2 border-[3px] border-border bg-surface brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow transition-all active:translate-x-0 active:translate-y-0 active:shadow-none">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <PageHeader
          title="Create Resume"
          description="Setup a new AI-optimized resume draft to target job matching feeds."
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-5 brutal-shadow">
          <ErrorMessage message={error} onClose={() => setError(null)} />

          {/* Name Field */}
          <div className="space-y-2">
            <label htmlFor="resume-name" className="font-bold text-xs uppercase text-foreground-secondary flex items-center gap-1">
              Resume Name
              <span className="text-error">*</span>
            </label>
            <input
              id="resume-name"
              type="text"
              value={resumeName}
              onChange={(e) => setResumeName(e.target.value)}
              placeholder="E.g., Frontend Specialist Resume, Backend Engineer 2026"
              className="w-full border-[3px] border-border bg-surface p-3 text-sm brutal-shadow-sm focus:outline-primary disabled:bg-surface-secondary"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Template Selection */}
          <div className="space-y-3">
            <label className="font-bold text-xs uppercase text-foreground-secondary flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary" />
              Select Template Layout
            </label>
            
            <div className="grid gap-3">
              {[
                {
                  id: "brutalist-bold",
                  name: "Brutalist Bold",
                  desc: "High contrast layout featuring thick borders, bold headings, and solid dropshadow elements.",
                },
                {
                  id: "modern-clean",
                  name: "Modern Clean",
                  desc: "Elegant and balanced spacing with subtle accent lines, optimal for designers or product leads.",
                },
                {
                  id: "classic-tech",
                  name: "Classic Tech",
                  desc: "Traditional single-column layout optimized for ATS parsers and engineering applications.",
                },
              ].map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setSelectedTemplate(tmpl.id as TemplateType)}
                  className={cn(
                    "p-4 border-[3px] border-border text-left brutal-shadow-sm flex items-center justify-between transition-all active:translate-x-0 active:translate-y-0 active:shadow-none hover:bg-surface-secondary",
                    selectedTemplate === tmpl.id 
                      ? "bg-foreground text-surface border-foreground" 
                      : "bg-surface text-foreground"
                  )}
                  disabled={isSubmitting}
                >
                  <div className="flex gap-3 items-start">
                    <div className={cn(
                      "p-1.5 border-2 border-border brutal-shadow-sm rounded-sm shrink-0",
                      selectedTemplate === tmpl.id ? "bg-surface text-foreground" : "bg-surface-secondary"
                    )}>
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-bold text-sm">{tmpl.name}</p>
                      <p className={cn("text-xs mt-0.5 leading-relaxed", selectedTemplate === tmpl.id ? "text-surface-secondary" : "text-foreground-muted")}>
                        {tmpl.desc}
                      </p>
                    </div>
                  </div>
                  {selectedTemplate === tmpl.id && (
                    <Check className="h-5 w-5 text-primary stroke-[3px] shrink-0 ml-3" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </BrutalCard>

        <BrutalButton
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 uppercase font-bold text-sm tracking-wide flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Initiating Builder..." : "Create Draft & Open Builder"}
        </BrutalButton>
      </form>
    </div>
  );
}
