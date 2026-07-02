"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { MOCK_TEMPLATES } from "@/features/resume/services/resume.service";
import { ArrowLeft, ArrowRight, Check, Sparkles, FileText, Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewResumePage() {
  const router = useRouter();
  const createResume = useResumeStore((state) => state.createResume);

  // Steps state: 1 = Template, 2 = Details, 3 = Confirmation
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("modern");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeTemplate = MOCK_TEMPLATES.find((t) => t.id === selectedTemplate) || MOCK_TEMPLATES[0];

  const handleNextStep = () => {
    setError(null);
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      if (!title.trim()) {
        setError("Please enter a descriptive name for your resume.");
        return;
      }
      setStep(3);
    }
  };

  const handlePrevStep = () => {
    setError(null);
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSave = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const newResume = await createResume({
        title: title.trim(),
        description: description.trim(),
        templateId: selectedTemplate,
        status: "active",
        isDefault,
      });
      setIsSubmitting(false);
      // Navigate to the newly created resume preview page
      router.push(`/resume/${newResume.id}`);
    } catch (err) {
      setError((err as Error).message || "Failed to create resume.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/resume"
          className="p-2.5 border-3 border-border bg-surface brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow transition-all active:translate-x-0 active:translate-y-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="space-y-1">
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Create Resume
          </Heading>
          <p className="text-foreground-secondary text-xs">
            Build a layout-optimized draft using your candidate profile details.
          </p>
        </div>
      </div>

      {/* Step Progress Indicators */}
      <div className="grid grid-cols-3 gap-2 w-full text-center">
        {[
          { num: 1, label: "Template" },
          { num: 2, label: "Details" },
          { num: 3, label: "Confirm" }
        ].map((item) => (
          <div
            key={item.num}
            className={cn(
              "py-2 border-2 border-border text-[10px] font-black uppercase tracking-wider transition-colors",
              step === item.num
                ? "bg-primary text-white brutal-shadow-sm"
                : step > item.num
                ? "bg-surface-secondary text-foreground-secondary line-through"
                : "bg-surface text-foreground-muted"
            )}
          >
            {item.num}. {item.label}
          </div>
        ))}
      </div>

      {error && (
        <div className="p-4 bg-error text-white font-extrabold uppercase text-xs border-3 border-border brutal-shadow">
          ⚠ {error}
        </div>
      )}

      {/* Step 1: Choose Template */}
      {step === 1 && (
        <div className="space-y-4">
          <Heading level="h4" className="text-xs font-black uppercase text-foreground-secondary flex items-center gap-1.5">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            Step 1: Select Template Layout
          </Heading>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {MOCK_TEMPLATES.map((tmpl) => (
              <button
                key={tmpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tmpl.id)}
                className={cn(
                  "p-5 border-3 border-border text-left brutal-shadow-sm flex flex-col justify-between transition-all hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow",
                  selectedTemplate === tmpl.id ? "bg-[#FFFCEB]" : "bg-surface"
                )}
              >
                <div className="space-y-4 w-full">
                  {/* Miniature template header mock color box */}
                  <div className={cn("h-16 w-full border-2 border-border rounded-sm brutal-shadow-sm flex items-center justify-center font-mono text-[9px] uppercase tracking-wider font-extrabold", tmpl.previewColor)}>
                    <span className={cn("px-2 py-0.5 border border-border bg-surface text-foreground shadow-sm")}>
                      {tmpl.name}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="px-1.5 py-0.5 border border-border bg-surface text-[8px] font-black uppercase">
                      {tmpl.category}
                    </span>
                    <h5 className="font-black text-sm uppercase text-foreground pt-1">{tmpl.name}</h5>
                    <p className="text-xs text-foreground-muted leading-relaxed">
                      {tmpl.description}
                    </p>
                  </div>
                </div>
                {selectedTemplate === tmpl.id && (
                  <div className="mt-4 self-end flex items-center gap-1 text-[9px] font-black uppercase text-primary">
                    <Check className="h-4 w-4 stroke-[3px]" /> Selected
                  </div>
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-end">
            <BrutalButton
              onClick={handleNextStep}
              className="h-11 px-5 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5"
            >
              Choose Template
              <ArrowRight className="h-4 w-4" />
            </BrutalButton>
          </div>
        </div>
      )}

      {/* Step 2: Resume Details */}
      {step === 2 && (
        <div className="space-y-6">
          <Heading level="h4" className="text-xs font-black uppercase text-foreground-secondary flex items-center gap-1.5">
            <FileText className="h-4.5 w-4.5 text-primary" />
            Step 2: Define Resume Metadata
          </Heading>

          <BrutalCard className="bg-surface border-3 border-border p-6 space-y-5 brutal-shadow">
            {/* Title Field */}
            <div className="space-y-2">
              <label htmlFor="resume-title" className="font-bold text-xs uppercase text-foreground-secondary flex items-center gap-1">
                Resume Title
                <span className="text-error">*</span>
              </label>
              <input
                id="resume-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g., Senior Full Stack Dev (Q1 2026), Product Lead Resume"
                className="w-full border-3 border-border bg-surface p-3.5 text-sm brutal-shadow-sm focus:outline-primary font-bold"
                required
              />
            </div>

            {/* Description Field */}
            <div className="space-y-2">
              <label htmlFor="resume-desc" className="font-bold text-xs uppercase text-foreground-secondary">
                Description / Target Target
              </label>
              <textarea
                id="resume-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="E.g., Tailored specifically for senior engineering, staff backend, or system architecture jobs."
                className="w-full border-3 border-border bg-surface p-3.5 text-sm brutal-shadow-sm focus:outline-primary min-h-[100px] resize-y"
              />
            </div>

            {/* Primary Toggle */}
            <div className="flex items-center gap-3 p-3 bg-surface-secondary/20 border-2 border-border rounded-sm">
              <input
                id="resume-default"
                type="checkbox"
                checked={isDefault}
                onChange={(e) => setIsDefault(e.target.checked)}
                className="h-4 w-4 accent-primary border-border cursor-pointer shrink-0"
              />
              <label htmlFor="resume-default" className="text-xs font-black uppercase text-foreground cursor-pointer select-none">
                Set as Primary Resume (Default)
              </label>
            </div>
          </BrutalCard>

          <div className="pt-4 flex justify-between gap-4">
            <BrutalButton
              onClick={handlePrevStep}
              variant="secondary"
              className="h-11 px-5 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </BrutalButton>
            <BrutalButton
              onClick={handleNextStep}
              className="h-11 px-5 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5"
            >
              Continue
              <ArrowRight className="h-4 w-4" />
            </BrutalButton>
          </div>
        </div>
      )}

      {/* Step 3: Confirmation */}
      {step === 3 && (
        <div className="space-y-6">
          <Heading level="h4" className="text-xs font-black uppercase text-foreground-secondary flex items-center gap-1.5">
            <Bookmark className="h-4.5 w-4.5 text-primary" />
            Step 3: Confirm Resume Draft Setup
          </Heading>

          <BrutalCard className="bg-surface border-3 border-border p-6 space-y-6 brutal-shadow">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight border-b-2 border-border pb-3">
              Summary
            </Heading>
            
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold uppercase text-foreground-secondary text-xs col-span-1">Title:</span>
                <span className="font-bold text-foreground col-span-2">{title}</span>
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold uppercase text-foreground-secondary text-xs col-span-1">Description:</span>
                <span className="text-foreground-secondary col-span-2">{description || "—"}</span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold uppercase text-foreground-secondary text-xs col-span-1">Template:</span>
                <span className="col-span-2 inline-flex items-center gap-2">
                  <span className={cn("h-4 w-12 border border-border rounded-sm", activeTemplate.previewColor)} />
                  <strong className="uppercase text-xs">{activeTemplate.name}</strong>
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <span className="font-extrabold uppercase text-foreground-secondary text-xs col-span-1">Primary status:</span>
                <span className="col-span-2">
                  {isDefault ? (
                    <span className="px-2 py-0.5 bg-success text-white border-2 border-border text-[9px] font-black uppercase brutal-shadow-sm">
                      Default Resume
                    </span>
                  ) : (
                    <span className="text-foreground-muted text-xs">Standard variant</span>
                  )}
                </span>
              </div>
            </div>
          </BrutalCard>

          <div className="pt-4 flex justify-between gap-4">
            <BrutalButton
              onClick={handlePrevStep}
              variant="secondary"
              className="h-11 px-5 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5"
              disabled={isSubmitting}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </BrutalButton>
            <BrutalButton
              onClick={handleSave}
              disabled={isSubmitting}
              className="h-11 px-6 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5"
            >
              {isSubmitting ? "Generating Draft..." : "Create & View Resume"}
              <Check className="h-4 w-4 stroke-[3px]" />
            </BrutalButton>
          </div>
        </div>
      )}
    </div>
  );
}
