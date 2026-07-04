"use client";

import React, { useEffect, use } from "react";
import { useBuilderStore } from "@/features/resume/store/builder.store";
import { ResumeBuilderLayout } from "@/features/resume/components/builder/builder-layout";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EditResumePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { currentResume, isLoading, error, loadResume, resetStore, undo, redo } = useBuilderStore();

  useEffect(() => {
    loadResume(id);
    return () => {
      resetStore();
    };
  }, [id, loadResume, resetStore]);

  // Bind global keyboard listeners for Undo / Redo (Sprint 3.3)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCmdOrCtrl = e.metaKey || e.ctrlKey;
      if (!isCmdOrCtrl) return;

      const key = e.key.toLowerCase();
      if (key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if (key === "y") {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [undo, redo]);

  if (isLoading && !currentResume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
        <span className="text-xs font-black uppercase text-foreground-secondary tracking-widest animate-pulse">
          Bootstrapping Builder Workspace...
        </span>
      </div>
    );
  }

  if (error || (!currentResume && !isLoading)) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-5">
        <div className="inline-block p-4 border-3 border-border bg-error text-white font-extrabold text-xs uppercase brutal-shadow">
          ⚠ Workspace Load Failed
        </div>
        <div className="space-y-1.5">
          <Heading level="h2" className="text-xl font-black uppercase">Resume Draft Not Found</Heading>
          <p className="text-xs text-foreground-secondary leading-relaxed">
            The workspace was unable to load parameters for resume draft ID: <code className="font-mono bg-surface-secondary px-1 border border-border/20">{id}</code>.
          </p>
        </div>
        <BrutalButton asChild className="h-11 px-5 uppercase font-bold text-xs">
          <Link href="/resume">Back to Resume Workspace</Link>
        </BrutalButton>
      </div>
    );
  }

  return <ResumeBuilderLayout />;
}
