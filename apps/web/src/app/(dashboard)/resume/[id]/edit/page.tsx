"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { MOCK_TEMPLATES } from "@/features/resume/services/resume.service";
import { ArrowLeft, Save, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditResumePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  // Stores
  const { currentResume, isLoading, loadResume, updateResume } = useResumeStore();

  // Local Form States
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [templateId, setTemplateId] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [status, setStatus] = useState<"active" | "archived">("active");

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      const res = await loadResume(id);
      if (res) {
        setTitle(res.title);
        setDescription(res.description);
        setTemplateId(res.templateId);
        setIsDefault(res.isDefault);
        setStatus(res.status);
      }
    };
    fetchResume();
  }, [id, loadResume]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Please specify a title for this resume draft.");
      return;
    }

    setIsSubmitting(true);
    try {
      await updateResume(id, {
        title: title.trim(),
        description: description.trim(),
        templateId,
        isDefault,
        status,
      });
      setIsSubmitting(false);
      // Redirect back to preview page
      router.push(`/resume/${id}`);
    } catch (err) {
      setError((err as Error).message || "Failed to update resume.");
      setIsSubmitting(false);
    }
  };

  if (isLoading && !title) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  if (!currentResume) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Heading level="h2" className="text-xl font-bold uppercase">Resume Not Found</Heading>
        <p className="text-xs text-foreground-secondary mt-2">The requested draft could not be loaded.</p>
        <BrutalButton asChild className="h-10 px-5 uppercase font-bold text-xs mt-4">
          <Link href="/resume">Back to Workspace</Link>
        </BrutalButton>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href={`/resume/${id}`}
          className="p-2.5 border-3 border-border bg-surface brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow transition-all"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="space-y-1">
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Edit Resume Settings
          </Heading>
          <p className="text-foreground-secondary text-xs">
            Modify layout preferences and status parameters for this resume variant.
          </p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-error text-white font-extrabold uppercase text-xs border-3 border-border brutal-shadow">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        <BrutalCard className="bg-surface border-3 border-border p-6 space-y-6 brutal-shadow">
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
              placeholder="E.g., Senior Full Stack Dev, Systems Architect 2026"
              className="w-full border-3 border-border bg-surface p-3.5 text-sm brutal-shadow-sm focus:outline-primary font-bold"
              disabled={isSubmitting}
              required
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label htmlFor="resume-desc" className="font-bold text-xs uppercase text-foreground-secondary">
              Description / Variant Details
            </label>
            <textarea
              id="resume-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what jobs this resume variant is optimized for."
              className="w-full border-3 border-border bg-surface p-3.5 text-sm brutal-shadow-sm focus:outline-primary min-h-[100px] resize-y"
              disabled={isSubmitting}
            />
          </div>

          {/* Status Selection */}
          <div className="space-y-2">
            <label htmlFor="resume-status" className="font-bold text-xs uppercase text-foreground-secondary">
              Draft Status
            </label>
            <select
              id="resume-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as "active" | "archived")}
              className="w-full border-3 border-border bg-surface p-3 text-sm brutal-shadow-sm focus:outline-primary font-bold uppercase text-xs tracking-wider"
              disabled={isSubmitting || isDefault} // Default resume cannot be archived
            >
              <option value="active">Active Draft</option>
              <option value="archived">Archived Draft</option>
            </select>
            {isDefault && (
              <p className="text-[10px] text-foreground-muted font-bold">
                * Primary resumes cannot be archived. Unset default status first.
              </p>
            )}
          </div>

          {/* Primary Resume Toggle */}
          <div className="flex items-center gap-3 p-3.5 bg-surface-secondary/20 border-2 border-border rounded-sm">
            <input
              id="resume-default"
              type="checkbox"
              checked={isDefault}
              onChange={(e) => setIsDefault(e.target.checked)}
              disabled={isSubmitting || status === "archived"} // Archived resumes cannot be default
              className="h-4 w-4 accent-primary border-border cursor-pointer shrink-0 disabled:cursor-not-allowed"
            />
            <label htmlFor="resume-default" className="text-xs font-black uppercase text-foreground cursor-pointer select-none disabled:cursor-not-allowed">
              Set as Primary Resume (Default)
            </label>
          </div>

          {/* Template Selection */}
          <div className="space-y-3 pt-4 border-t border-border/10">
            <label className="font-bold text-xs uppercase text-foreground-secondary flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Switch Layout Template
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MOCK_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  type="button"
                  onClick={() => setTemplateId(tmpl.id)}
                  className={cn(
                    "p-4 border-3 border-border text-left brutal-shadow-sm flex items-center justify-between transition-all hover:bg-surface-secondary",
                    templateId === tmpl.id ? "bg-[#FFFCEB]" : "bg-surface"
                  )}
                  disabled={isSubmitting}
                >
                  <div className="flex gap-2.5 items-center w-full min-w-0">
                    <span className={cn("h-4 w-10 border border-border rounded-sm shrink-0", tmpl.previewColor)} />
                    <div className="min-w-0">
                      <p className="font-black text-[11px] uppercase tracking-wider truncate">{tmpl.name}</p>
                      <p className="text-[9px] text-foreground-muted truncate">{tmpl.category}</p>
                    </div>
                  </div>
                  {templateId === tmpl.id && (
                    <Check className="h-4 w-4 text-primary stroke-[3px] shrink-0 ml-2" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </BrutalCard>

        <BrutalButton
          type="submit"
          disabled={isSubmitting}
          className="w-full h-12 uppercase font-bold text-xs tracking-wider flex items-center justify-center gap-2"
        >
          <Save className="h-4.5 w-4.5" />
          {isSubmitting ? "Saving Changes..." : "Save Settings & Return"}
        </BrutalButton>
      </form>
    </div>
  );
}
