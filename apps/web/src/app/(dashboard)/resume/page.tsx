"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useShallow } from "zustand/react/shallow";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ResumeUploader } from "@/features/resume/components/resume-uploader";
import { RenameDialog } from "@/features/resume/components/rename-dialog";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import {
  FileText,
  Eye,
  Download,
  Pencil,
  Trash2,
  Sparkles,
  History,
  Calendar,
  HardDrive,
  ShieldCheck,
} from "lucide-react";
import { formatDate, cn } from "@/lib/utils";
import type { UploadedResume } from "@/features/resume/types/resume.types";

export default function ResumeManagementPage() {
  const {
    uploadedResumes,
    uploadResume,
    deleteUploadedResume,
    renameUploadedResume,
    setDefaultUploadedResume,
  } = useResumeStore(
    useShallow((state) => ({
      uploadedResumes: state.uploadedResumes,
      uploadResume: state.uploadResume,
      deleteUploadedResume: state.deleteUploadedResume,
      renameUploadedResume: state.renameUploadedResume,
      setDefaultUploadedResume: state.setDefaultUploadedResume,
    })),
  );

  const { confirm, ConfirmationDialog } = useConfirm();
  const [selectedResumeId, setSelectedResumeId] = useState<string | null>(
    uploadedResumes.find((r) => r.isDefault)?.id ||
      uploadedResumes[0]?.id ||
      null,
  );

  const [renameTarget, setRenameTarget] = useState<UploadedResume | null>(null);

  const selectedResume =
    uploadedResumes.find((r) => r.id === selectedResumeId) ||
    uploadedResumes[0];

  const existingNames = uploadedResumes.map((r) => r.fileName);

  const handleDelete = async (id: string, name: string) => {
    const isConfirmed = await confirm({
      title: "Delete Resume",
      description: `Are you sure you want to delete "${name}"? This will permanently remove all version history.`,
      isDestructive: true,
      confirmLabel: "Delete File",
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting resume record...");
      try {
        await deleteUploadedResume(id);
        toast.success("Resume deleted successfully!", { id: toastId });
        if (selectedResumeId === id) {
          setSelectedResumeId(
            uploadedResumes.find((r) => r.id !== id)?.id || null,
          );
        }
      } catch {
        toast.error("Failed to delete resume.", { id: toastId });
      }
    }
  };

  const handleSetDefault = async (id: string, name: string) => {
    const toastId = toast.loading("Updating primary resume...");
    try {
      await setDefaultUploadedResume(id);
      toast.success(`"${name}" set as your primary resume!`, { id: toastId });
    } catch {
      toast.error("Failed to update default resume.", { id: toastId });
    }
  };

  const handleDownload = (name: string) => {
    toast.info(`Mock Download: Initiated transfer for ${name}`);
  };

  const handleRenameSubmit = async (newName: string) => {
    if (!renameTarget) return;
    const toastId = toast.loading("Renaming resume file...");
    try {
      await renameUploadedResume(renameTarget.id, newName);
      toast.success("Resume renamed successfully!", { id: toastId });
      setRenameTarget(null);
    } catch {
      toast.error("Failed to rename resume.", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Heading
            level="h2"
            className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2"
          >
            <FileText className="h-6 w-6 text-primary shrink-0" />
            Resume Management
          </Heading>
          <Text className="text-foreground-secondary text-xs">
            Upload, update versions, and preview your ATS-optimized resumes.
          </Text>
        </div>
        <div className="flex-shrink-0">
          <Link href="/resume/optimize" passHref>
            <BrutalButton className="h-10 px-4 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 rounded-sm bg-primary text-white hover:bg-primary/95 brutal-shadow-xs hover:brutal-shadow">
              <Sparkles className="h-4 w-4" /> AI Optimizer Studio
            </BrutalButton>
          </Link>
        </div>
      </div>

      {/* Dashboard Stats Cards */}
      {selectedResume && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
          <div className="space-y-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-primary" /> Primary Resume
            </p>
            <p
              className="font-mono text-xs font-black text-foreground truncate"
              title={selectedResume.fileName}
            >
              {selectedResume.fileName}
            </p>
          </div>

          <div className="space-y-1 border-t-2 md:border-t-0 md:border-l-2 border-border/10 pt-2.5 md:pt-0 md:pl-4">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-success" /> Resume Status
            </p>
            <p className="text-xs font-black text-foreground truncate uppercase">
              {selectedResume.status}
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-warning" /> Mock ATS Score
            </p>
            <p className="font-mono text-sm font-black text-foreground">
              {selectedResume.atsScore}% Score
            </p>
          </div>

          <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2.5 lg:pt-0 lg:pl-4 md:col-span-2 lg:col-span-1">
            <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
              <HardDrive className="h-3.5 w-3.5 text-primary" /> Size & Version
            </p>
            <p className="text-xs font-semibold text-foreground truncate">
              {selectedResume.fileSize} • v{selectedResume.version}
            </p>
          </div>
        </div>
      )}

      {/* Main Content Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Upload & Resume List */}
        <div className="lg:col-span-2 space-y-6 min-w-0">
          {/* Direct File Uploader */}
          <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow">
            <ResumeUploader
              onUpload={uploadResume}
              existingNames={existingNames}
            />
          </BrutalCard>

          {/* Uploaded Resumes List */}
          <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow">
            <div className="space-y-4">
              <Heading
                level="h4"
                className="text-sm font-black uppercase tracking-wider flex items-center gap-2"
              >
                <FileText className="h-5 w-5 text-primary" />
                Uploaded Documents
              </Heading>

              {uploadedResumes.length === 0 ? (
                <div className="py-8 text-center space-y-2 border-2 border-dashed border-border/20 rounded-sm">
                  <Text className="text-foreground-secondary text-xs">
                    No uploaded resumes found. Drag a file above to add one.
                  </Text>
                </div>
              ) : (
                <div className="space-y-3">
                  {uploadedResumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={cn(
                        "border-2 p-4 rounded-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer transition-all",
                        selectedResumeId === resume.id
                          ? "border-primary bg-primary/5 brutal-shadow-xs"
                          : "border-border bg-surface-secondary/20 hover:border-foreground",
                      )}
                    >
                      <div className="space-y-1 text-xs min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-foreground truncate uppercase select-none">
                            {resume.fileName}
                          </span>
                          {resume.isDefault && (
                            <span className="px-1.5 py-0.2 border border-border bg-success text-white text-[8px] font-black uppercase tracking-wider brutal-shadow-xs select-none shrink-0">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-foreground-secondary font-semibold font-mono text-[10px]">
                          v{resume.version} • {resume.fileSize} • Uploaded{" "}
                          {formatDate(resume.uploadedAt)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                        <BrutalButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSetDefault(resume.id, resume.fileName);
                          }}
                          disabled={resume.isDefault}
                          variant="secondary"
                          className="h-7 px-2 text-[9px] font-bold uppercase tracking-wider"
                          aria-label={`Set ${resume.fileName} as default`}
                        >
                          Default
                        </BrutalButton>
                        <BrutalButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setRenameTarget(resume);
                          }}
                          variant="secondary"
                          className="h-7 w-7 p-0 flex items-center justify-center"
                          aria-label={`Rename ${resume.fileName}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </BrutalButton>
                        <BrutalButton
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(resume.id, resume.fileName);
                          }}
                          variant="secondary"
                          className="h-7 w-7 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
                          aria-label={`Delete ${resume.fileName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </BrutalButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>
        </div>

        {/* Right column: Preview Panel & History */}
        <div className="lg:col-span-1 space-y-6 min-w-0">
          {selectedResume ? (
            <div className="space-y-6">
              {/* Preview Details Card */}
              <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow">
                <div className="space-y-5">
                  <div className="flex items-center justify-between border-b-2 border-border/10 pb-2.5">
                    <Heading
                      level="h4"
                      className="text-sm font-black uppercase tracking-wider flex items-center gap-2"
                    >
                      <Eye className="h-4.5 w-4.5 text-primary" />
                      Mock Preview
                    </Heading>
                    <Link
                      href={`/resume/preview?id=${selectedResume.id}`}
                      passHref
                    >
                      <BrutalButton className="h-7 px-2.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1">
                        <Eye className="h-3 w-3" /> Full Preview
                      </BrutalButton>
                    </Link>
                  </div>

                  <div className="space-y-3 text-xs border-2 border-border p-4 bg-surface-secondary/40 brutal-shadow-xs">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase font-bold text-foreground-secondary">
                        Document Title
                      </p>
                      <p className="font-extrabold text-foreground truncate uppercase">
                        {selectedResume.fileName}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/10">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-foreground-secondary">
                          ATS Rank
                        </p>
                        <p className="font-black text-warning font-mono">
                          {selectedResume.atsScore}% Rating
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-foreground-secondary">
                          Version
                        </p>
                        <p className="font-mono font-bold text-foreground">
                          v{selectedResume.version}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-1 border-t border-border/10">
                      <div>
                        <p className="text-[10px] uppercase font-bold text-foreground-secondary">
                          File Size
                        </p>
                        <p className="font-mono text-foreground font-semibold">
                          {selectedResume.fileSize}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-foreground-secondary">
                          Status
                        </p>
                        <p className="font-bold text-success uppercase text-[10px]">
                          {selectedResume.status}
                        </p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-border/10">
                      <BrutalButton
                        onClick={() => handleDownload(selectedResume.fileName)}
                        className="w-full h-8 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                      >
                        <Download className="h-3.5 w-3.5" /> Download File
                      </BrutalButton>
                    </div>
                  </div>
                </div>
              </BrutalCard>

              {/* Version History List Card */}
              <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow">
                <div className="space-y-4">
                  <Heading
                    level="h4"
                    className="text-sm font-black uppercase tracking-wider flex items-center gap-2"
                  >
                    <History className="h-4.5 w-4.5 text-primary" />
                    Version History
                  </Heading>

                  <div className="relative pl-4 border-l-2 border-border ml-2 space-y-4 py-1">
                    {selectedResume.versionHistory.map((historyItem) => (
                      <div key={historyItem.version} className="relative">
                        <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-border bg-foreground" />
                        <div className="text-xs space-y-0.5">
                          <p className="font-bold text-foreground">
                            Version {historyItem.version}
                          </p>
                          <p className="text-foreground-secondary truncate font-medium uppercase text-[10px]">
                            {historyItem.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-[9px] text-foreground-muted font-mono pt-0.5">
                            <span className="flex items-center gap-0.5">
                              <Calendar className="h-2.5 w-2.5" />
                              {formatDate(historyItem.uploadedAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-0.5">
                              <HardDrive className="h-2.5 w-2.5" />
                              {historyItem.fileSize}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </BrutalCard>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center py-12 text-center text-xs text-foreground-secondary">
              Select a resume to view statistics and history.
            </div>
          )}
        </div>
      </div>

      {/* Rename Modal Dialog */}
      <RenameDialog
        isOpen={renameTarget !== null}
        onClose={() => setRenameTarget(null)}
        originalName={renameTarget?.fileName || ""}
        existingNames={existingNames}
        onRename={handleRenameSubmit}
      />

      <ConfirmationDialog />
    </div>
  );
}
