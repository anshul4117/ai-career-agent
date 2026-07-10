"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { EmptyState } from "@/components/ui/empty-state";
import { ResumeSkeleton } from "@/components/ui/skeleton-loaders";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { MOCK_TEMPLATES } from "@/features/resume/services/resume.service";
import { 
  Plus, Eye, Pencil, Copy, Trash2, Archive, 
  RotateCcw, Sparkles, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function ResumePage() {
  const router = useRouter();
  const {
    resumes,
    isLoading,
    loadResumes,
    deleteResume,
    duplicateResume,
    archiveResume,
    restoreResume,
  } = useResumeStore();

  const [toast, setToast] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadResumes();
  }, [loadResumes]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDuplicate = async (id: string, title: string) => {
    try {
      await duplicateResume(id);
      showToastMsg(`Duplicated "${title}"!`);
    } catch {
      showToastMsg("Failed to duplicate resume.");
    }
  };

  const handleArchive = async (id: string, title: string) => {
    try {
      await archiveResume(id);
      showToastMsg(`Archived "${title}"!`);
    } catch {
      showToastMsg("Failed to archive resume.");
    }
  };

  const handleRestore = async (id: string, title: string) => {
    try {
      await restoreResume(id);
      showToastMsg(`Restored "${title}"!`);
    } catch {
      showToastMsg("Failed to restore resume.");
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    try {
      await deleteResume(id);
      showToastMsg(`Deleted "${title}"!`);
    } catch {
      showToastMsg("Failed to delete resume.");
    }
  };

  const activeResumes = resumes.filter((r) => r.status === "active");
  const archivedResumes = resumes.filter((r) => r.status === "archived");

  if (isLoading && resumes.length === 0) {
    return (
      <div className="space-y-8 w-full min-w-0 pb-16">
        <div className="space-y-1">
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Resume Workspace
          </Heading>
          <p className="text-foreground-secondary text-xs">
            Manage your multiple resume layouts, customize formats, and track ATS scores.
          </p>
        </div>
        <ResumeSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8 w-full min-w-0 pb-16">
      {/* Toast popup */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-success border-2 border-border p-3 text-white font-extrabold uppercase text-xs brutal-shadow" role="alert">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Resume Workspace
          </Heading>
          <p className="text-foreground-secondary text-xs">
            Manage your multiple resume layouts, customize formats, and track ATS scores.
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 shrink-0 self-start">
          <BrutalButton asChild variant="secondary" className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Link href="/resume/import">
              <Sparkles className="h-4 w-4 text-primary" />
              Import Resume
            </Link>
          </BrutalButton>
          <BrutalButton asChild className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Link href="/resume/new">
              <Plus className="h-4 w-4" />
              Create Resume
            </Link>
          </BrutalButton>
        </div>
      </div>

      {/* Active Resumes Section */}
      {activeResumes.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No Resumes Configured"
          description="You don't have any active resume layouts yet. Create a layout from scratch or upload your existing resume to parse details."
          primaryAction={{
            label: "Create New Layout",
            onClick: () => router.push("/resume/new")
          }}
          secondaryAction={{
            label: "Import Existing Resume",
            onClick: () => router.push("/resume/import")
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeResumes.map((resume) => {
            const template = MOCK_TEMPLATES.find((t) => t.id === resume.templateId) || MOCK_TEMPLATES[0];
            return (
              <BrutalCard
                key={resume.id}
                className="bg-surface border-[3px] border-border p-5 brutal-shadow flex flex-col justify-between h-full min-h-[220px]"
              >
                <div className="space-y-4">
                  {/* Status row: Default tag & score */}
                  <div className="flex items-center justify-between gap-2">
                    {resume.isDefault ? (
                      <span className="px-2 py-0.5 bg-success text-white border-2 border-border text-[8px] font-black uppercase tracking-wider brutal-shadow-sm">
                        Primary Resume
                      </span>
                    ) : (
                      <span className="text-[8px] font-black uppercase text-foreground-muted bg-surface-secondary border border-border/30 px-1.5 py-0.5 rounded-sm">
                        Draft Layout
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <Sparkles className="h-3 w-3 text-primary shrink-0" />
                      <span className="text-[10px] font-black text-foreground">
                        Mock ATS: <strong>{resume.atsScore}%</strong>
                      </span>
                    </div>
                  </div>

                  {/* Header metadata */}
                  <div className="space-y-1">
                    <Heading level="h4" className="text-sm font-black uppercase tracking-wider truncate text-foreground">
                      {resume.title}
                    </Heading>
                    <p className="text-[10px] font-semibold text-foreground-secondary flex items-center gap-1.5">
                      Template: <span className="uppercase font-black text-primary">{template.name}</span>
                    </p>
                    <p className="text-[10px] text-foreground-muted font-mono leading-relaxed pt-1 line-clamp-2">
                      {resume.description || "No layout description specified."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-4 mt-4 border-t border-border/10">
                  <div className="text-[9px] text-foreground-muted font-mono">
                    Last Updated: {formatDate(resume.updatedAt)}
                  </div>
                  
                  {/* Action buttons */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <BrutalButton asChild variant="secondary" className="h-7 p-0 text-[8px] font-black uppercase flex items-center justify-center gap-1">
                      <Link href={`/resume/${resume.id}`}>
                        <Eye className="h-3 w-3 shrink-0" /> View
                      </Link>
                    </BrutalButton>
                    <BrutalButton asChild variant="secondary" className="h-7 p-0 text-[8px] font-black uppercase flex items-center justify-center gap-1">
                      <Link href={`/resume/${resume.id}/edit`}>
                        <Pencil className="h-3 w-3 shrink-0" /> Edit
                      </Link>
                    </BrutalButton>
                    <BrutalButton
                      onClick={() => handleDuplicate(resume.id, resume.title)}
                      variant="secondary"
                      className="h-7 p-0 text-[8px] font-black uppercase flex items-center justify-center gap-1"
                    >
                      <Copy className="h-3 w-3 shrink-0" /> Copy
                    </BrutalButton>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5">
                    <BrutalButton
                      onClick={() => handleArchive(resume.id, resume.title)}
                      variant="secondary"
                      className="h-7 p-0 text-[8px] font-black uppercase flex items-center justify-center gap-1 text-foreground-muted"
                    >
                      <Archive className="h-3 w-3 shrink-0" /> Archive
                    </BrutalButton>
                    <BrutalButton
                      onClick={() => handleDelete(resume.id, resume.title)}
                      variant="secondary"
                      className="h-7 p-0 text-[8px] font-black uppercase flex items-center justify-center gap-1 text-error border-error/20 hover:border-error"
                    >
                      <Trash2 className="h-3 w-3 shrink-0" /> Delete
                    </BrutalButton>
                  </div>
                </div>
              </BrutalCard>
            );
          })}
        </div>
      )}

      {/* Collapsible Archived Resumes Section */}
      {archivedResumes.length > 0 && (
        <div className="pt-8 border-t-2 border-border/10">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-foreground-muted hover:text-foreground transition-colors"
          >
            {showArchived ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            Archived Draft Layouts ({archivedResumes.length})
          </button>

          {showArchived && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
              {archivedResumes.map((resume) => {
                const template = MOCK_TEMPLATES.find((t) => t.id === resume.templateId) || MOCK_TEMPLATES[0];
                return (
                  <BrutalCard
                    key={resume.id}
                    className="bg-surface border-[3px] border-dashed border-border p-5 brutal-shadow-sm opacity-75 flex flex-col justify-between h-full min-h-[180px]"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="px-1.5 py-0.5 bg-surface-secondary text-foreground-muted text-[8px] font-bold uppercase tracking-wider border border-border/30 rounded-sm">
                          Archived
                        </span>
                        <span className="text-[9px] font-mono text-foreground-muted">
                          Mock ATS: {resume.atsScore}%
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-xs uppercase text-foreground-muted truncate line-through">
                          {resume.title}
                        </h4>
                        <p className="text-[9px] text-foreground-muted">Template: {template.name}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 mt-4 border-t border-border/10">
                      <BrutalButton
                        onClick={() => handleRestore(resume.id, resume.title)}
                        variant="secondary"
                        className="flex-1 h-7 text-[8px] font-black uppercase flex items-center justify-center gap-1"
                      >
                        <RotateCcw className="h-3 w-3 shrink-0" /> Restore
                      </BrutalButton>
                      <BrutalButton
                        onClick={() => handleDelete(resume.id, resume.title)}
                        variant="secondary"
                        className="flex-1 h-7 text-[8px] font-black uppercase flex items-center justify-center gap-1 text-error border-error/20 hover:border-error"
                      >
                        <Trash2 className="h-3 w-3 shrink-0" /> Delete
                      </BrutalButton>
                    </div>
                  </BrutalCard>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
