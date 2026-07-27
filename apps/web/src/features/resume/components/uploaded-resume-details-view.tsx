"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { useShallow } from "zustand/react/shallow";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { RenameDialog } from "@/features/resume/components/rename-dialog";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  Pencil,
  Trash2,
  Copy,
  Star,
  Calendar,
  HardDrive,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  History,
  RefreshCw,
  LayoutList,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UploadedResumeDetailsViewProps {
  id: string;
}

export function UploadedResumeDetailsView({
  id,
}: UploadedResumeDetailsViewProps) {
  const router = useRouter();
  const { confirm, ConfirmationDialog } = useConfirm();

  // Stores
  const {
    uploadedResumes,
    isLoading,
    deleteUploadedResume,
    renameUploadedResume,
    setDefaultUploadedResume,
    duplicateResume,
    downloadResume,
  } = useResumeStore(
    useShallow((state) => ({
      uploadedResumes: state.uploadedResumes,
      isLoading: state.isLoading,
      deleteUploadedResume: state.deleteUploadedResume,
      renameUploadedResume: state.renameUploadedResume,
      setDefaultUploadedResume: state.setDefaultUploadedResume,
      duplicateResume: state.duplicateResume,
      downloadResume: state.downloadResume,
    })),
  );

  const { profile, skills, education, experience, projects, certifications } =
    useProfileStore();

  const [isRenameOpen, setIsRenameOpen] = useState(false);

  const resume = useMemo(() => {
    return uploadedResumes.find((r) => r.id === id);
  }, [uploadedResumes, id]);

  if (isLoading || !resume) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin text-primary" />
        <Heading
          level="h4"
          className="text-sm font-black uppercase text-foreground-secondary"
        >
          Loading resume details...
        </Heading>
      </div>
    );
  }

  const existingNames = uploadedResumes.map((r) => r.fileName);
  const fileExtension =
    resume.fileName.split(".").pop()?.toUpperCase() || "PDF";

  // Mock ATS sub-scores based on overall score
  const atsScores = {
    overall: resume.atsScore,
    formatting: Math.min(100, Math.floor(resume.atsScore * 1.05)),
    keywords: Math.min(100, Math.floor(resume.atsScore * 0.95)),
    readability: Math.min(100, Math.floor(resume.atsScore * 1.08)),
    sectionsPresent: Math.min(100, Math.floor(resume.atsScore * 1.02)),
  };

  const handleSetDefault = async () => {
    const toastId = toast.loading("Setting default resume...");
    try {
      await setDefaultUploadedResume(resume.id);
      toast.success(`"${resume.fileName}" is now your primary resume!`, {
        id: toastId,
      });
    } catch {
      toast.error("Failed to update primary resume.", { id: toastId });
    }
  };

  const handleDownload = async () => {
    const toastId = toast.loading("Preparing download...");
    try {
      await downloadResume(resume.id);
      toast.success(
        `Mock Download: "${resume.fileName}" downloaded successfully!`,
        { id: toastId },
      );
    } catch {
      toast.error("Failed to download resume.", { id: toastId });
    }
  };

  const handleRenameSubmit = async (newName: string) => {
    const toastId = toast.loading("Renaming file...");
    try {
      await renameUploadedResume(resume.id, newName);
      toast.success("Resume renamed successfully!", { id: toastId });
      setIsRenameOpen(false);
    } catch {
      toast.error("Failed to rename resume.", { id: toastId });
    }
  };

  const handleDuplicate = async () => {
    const toastId = toast.loading("Duplicating resume...");
    try {
      const copy = await duplicateResume(resume.id);
      toast.success(`Resume duplicated successfully!`, { id: toastId });
      // Redirect to newly duplicated resume page
      router.push(`/resume/${copy.id}`);
    } catch {
      toast.error("Failed to duplicate resume.", { id: toastId });
    }
  };

  const handleDelete = async () => {
    const isConfirmed = await confirm({
      title: "Delete Uploaded Resume",
      description: `Are you sure you want to delete "${resume.fileName}"? This action cannot be undone and will delete all version history.`,
      isDestructive: true,
      confirmLabel: "Delete",
    });

    if (isConfirmed) {
      const toastId = toast.loading("Deleting resume...");
      try {
        await deleteUploadedResume(resume.id);
        toast.success("Resume deleted successfully!", { id: toastId });
        router.push("/resume");
      } catch {
        toast.error("Failed to delete resume.", { id: toastId });
      }
    }
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Back button and Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/resume"
            className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Resume Workspace
          </Link>
          <div className="flex items-center gap-3 flex-wrap">
            <Heading
              level="h2"
              className="text-2xl md:text-3xl font-black uppercase tracking-tight truncate max-w-[400px]"
            >
              {resume.fileName}
            </Heading>
            {resume.isDefault && (
              <span className="px-2 py-0.5 bg-success text-white border-2 border-border text-[9px] font-black uppercase tracking-wider brutal-shadow-xs select-none">
                Primary Resume
              </span>
            )}
          </div>
        </div>

        {/* Action Triggers Grid */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <BrutalButton
            onClick={handleSetDefault}
            disabled={resume.isDefault}
            variant="secondary"
            className="h-8 px-2.5 text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
          >
            <Star
              className={`h-3 w-3 ${resume.isDefault ? "fill-warning text-warning" : ""}`}
            />{" "}
            Set Default
          </BrutalButton>
          <BrutalButton
            onClick={() => setIsRenameOpen(true)}
            variant="secondary"
            className="h-8 w-8 p-0 flex items-center justify-center"
            aria-label="Rename document"
          >
            <Pencil className="h-3.5 w-3.5" />
          </BrutalButton>
          <BrutalButton
            onClick={handleDuplicate}
            variant="secondary"
            className="h-8 w-8 p-0 flex items-center justify-center"
            aria-label="Duplicate document"
          >
            <Copy className="h-3.5 w-3.5" />
          </BrutalButton>
          <BrutalButton
            onClick={handleDownload}
            className="h-8 px-2.5 text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
          >
            <Download className="h-3 w-3" /> Download
          </BrutalButton>
          <BrutalButton
            onClick={handleDelete}
            variant="secondary"
            className="h-8 w-8 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
            aria-label="Delete document"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </BrutalButton>
        </div>
      </div>

      {/* Stats Widgets Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
        <div className="space-y-1">
          <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
            <FileText className="h-3.5 w-3.5 text-primary" /> Document Name
          </p>
          <p
            className="font-mono text-xs font-black text-foreground truncate"
            title={resume.fileName}
          >
            {resume.fileName}
          </p>
        </div>

        <div className="space-y-1 border-l-2 border-border/10 pl-4">
          <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Status
          </p>
          <p className="text-xs font-black text-success truncate uppercase">
            {resume.status}
          </p>
        </div>

        <div className="space-y-1 border-l-2 border-border/10 pl-4 col-span-2 lg:col-span-1">
          <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-warning" /> Extracted ATS
            Score
          </p>
          <p className="font-mono text-sm font-black text-foreground">
            {resume.atsScore}% rating
          </p>
        </div>

        <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2 lg:pt-0 lg:pl-4">
          <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5 text-primary" /> Upload Date
          </p>
          <p className="text-xs font-semibold text-foreground truncate">
            {formatDate(resume.uploadedAt)}
          </p>
        </div>

        <div className="space-y-1 border-t-2 lg:border-t-0 lg:border-l-2 border-border/10 pt-2 lg:pt-0 lg:pl-4">
          <p className="text-[10px] uppercase font-bold text-foreground-secondary tracking-tight flex items-center gap-1.5">
            <HardDrive className="h-3.5 w-3.5 text-primary" /> Size & Version
          </p>
          <p className="text-xs font-semibold text-foreground truncate">
            {resume.fileSize} • v{resume.version} ({fileExtension})
          </p>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: ATS Score Breakdown & Version History */}
        <div className="lg:col-span-1 space-y-6">
          {/* ATS Summary Analysis */}
          <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow space-y-5">
            <Heading
              level="h4"
              className="text-sm font-black uppercase tracking-wider flex items-center gap-2"
            >
              <Sparkles className="h-4.5 w-4.5 text-warning" />
              ATS Review Analytics
            </Heading>

            <div className="space-y-4">
              {/* Overall Score */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="uppercase text-foreground-secondary">
                    Overall Compatibility
                  </span>
                  <span className="text-foreground">{atsScores.overall}%</span>
                </div>
                <div className="w-full bg-surface-secondary border border-border h-3 rounded-sm overflow-hidden p-0.5">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${atsScores.overall}%` }}
                  />
                </div>
              </div>

              {/* Formatting */}
              <div className="space-y-1 pt-1 border-t border-border/5">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="uppercase text-foreground-secondary">
                    Structure & Formatting
                  </span>
                  <span className="text-foreground">
                    {atsScores.formatting}%
                  </span>
                </div>
                <div className="w-full bg-surface-secondary border border-border h-2.5 rounded-sm overflow-hidden p-0.5">
                  <div
                    className="bg-success h-full transition-all duration-500"
                    style={{ width: `${atsScores.formatting}%` }}
                  />
                </div>
              </div>

              {/* Keywords */}
              <div className="space-y-1 pt-1 border-t border-border/5">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="uppercase text-foreground-secondary">
                    Keyword Matching
                  </span>
                  <span className="text-foreground">{atsScores.keywords}%</span>
                </div>
                <div className="w-full bg-surface-secondary border border-border h-2.5 rounded-sm overflow-hidden p-0.5">
                  <div
                    className="bg-warning h-full transition-all duration-500"
                    style={{ width: `${atsScores.keywords}%` }}
                  />
                </div>
              </div>

              {/* Readability */}
              <div className="space-y-1 pt-1 border-t border-border/5">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="uppercase text-foreground-secondary">
                    Content Readability
                  </span>
                  <span className="text-foreground">
                    {atsScores.readability}%
                  </span>
                </div>
                <div className="w-full bg-surface-secondary border border-border h-2.5 rounded-sm overflow-hidden p-0.5">
                  <div
                    className="bg-primary h-full transition-all duration-500"
                    style={{ width: `${atsScores.readability}%` }}
                  />
                </div>
              </div>

              {/* Sections Present */}
              <div className="space-y-1 pt-1 border-t border-border/5">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="uppercase text-foreground-secondary">
                    Section Completeness
                  </span>
                  <span className="text-foreground">
                    {atsScores.sectionsPresent}%
                  </span>
                </div>
                <div className="w-full bg-surface-secondary border border-border h-2.5 rounded-sm overflow-hidden p-0.5">
                  <div
                    className="bg-success h-full transition-all duration-500"
                    style={{ width: `${atsScores.sectionsPresent}%` }}
                  />
                </div>
              </div>
            </div>
          </BrutalCard>

          {/* Timeline Version History */}
          <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow space-y-4">
            <Heading
              level="h4"
              className="text-sm font-black uppercase tracking-wider flex items-center gap-2"
            >
              <History className="h-4.5 w-4.5 text-primary" />
              Document Versions
            </Heading>

            <div className="relative pl-4 border-l-2 border-border ml-2 space-y-4 py-1">
              {resume.versionHistory.map((item) => (
                <div key={item.version} className="relative">
                  <div className="absolute -left-[21px] top-1.5 h-2 w-2 rounded-full border border-border bg-foreground" />
                  <div className="text-xs space-y-0.5">
                    <p className="font-bold text-foreground">
                      Version {item.version}{" "}
                      {item.version === resume.version && "(Active)"}
                    </p>
                    <p className="text-foreground-secondary truncate font-medium uppercase text-[10px]">
                      {item.fileName}
                    </p>
                    <div className="flex items-center gap-2 text-[9px] text-foreground-muted font-mono pt-0.5">
                      <span className="flex items-center gap-0.5">
                        <Calendar className="h-2.5 w-2.5" />
                        {formatDate(item.uploadedAt)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <HardDrive className="h-2.5 w-2.5" />
                        {item.fileSize}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BrutalCard>
        </div>

        {/* Right Column: Deep Brutalist Resume Preview Paper Sheet */}
        <div className="lg:col-span-2">
          <BrutalCard className="bg-surface border-[3px] border-border p-8 brutal-shadow h-full min-h-[500px]">
            <div className="space-y-6 max-w-2xl mx-auto select-none">
              {/* Header Title with Link to Edit */}
              <div className="flex items-center justify-between border-b-2 border-border/10 pb-2">
                <Heading
                  level="h4"
                  className="text-xs font-black uppercase tracking-widest text-foreground-secondary flex items-center gap-1.5"
                >
                  <LayoutList className="h-4 w-4" /> Extracted Profile Details
                </Heading>
                <Link href="/profile/edit" passHref>
                  <BrutalButton
                    variant="secondary"
                    className="h-7 px-3 text-[9px] font-black uppercase tracking-wider flex items-center gap-1"
                  >
                    Update Profile Data
                  </BrutalButton>
                </Link>
              </div>

              {/* 1. Personal Information Section */}
              <div className="border-b-4 border-border pb-4 space-y-2 text-center pt-2">
                <Heading
                  level="h3"
                  className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground"
                >
                  {profile?.personal?.firstName
                    ? `${profile.personal.firstName} ${profile.personal.lastName || ""}`
                    : "Anshul Kumar"}
                </Heading>
                <p className="font-extrabold text-xs uppercase text-primary">
                  {profile?.career?.headline ||
                    "Senior Staff Frontend Engineer"}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-foreground-secondary pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />{" "}
                    {profile?.contact?.email || "anshul@example.com"}
                  </span>
                  {profile?.contact?.phone && (
                    <span className="flex items-center gap-1">
                      <Phone className="h-3 w-3" /> {profile.contact.phone}
                    </span>
                  )}
                  {profile?.contact?.city && (
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {profile.contact.city},{" "}
                      {profile.contact.country || ""}
                    </span>
                  )}
                </div>
              </div>

              {/* 2. Summary Section */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Executive Summary
                </h4>
                <Text className="text-xs text-foreground-secondary leading-relaxed">
                  {profile?.career?.summary ||
                    "Innovative Lead Frontend Developer and Staff Engineer with 8+ years of expertise in crafting responsive, accessible, and high-performance Web applications. Specialist in brutalist design systems, Next.js architecture, state management, and semantic SEO frameworks."}
                </Text>
              </div>

              {/* 3. Skills Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Extracted Skillchips
                </h4>
                {skills && skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((skill) => (
                      <span
                        key={skill.id}
                        className="px-2 py-0.5 border border-border bg-surface-secondary text-[9px] font-extrabold uppercase rounded-sm text-foreground-secondary"
                      >
                        {skill.name}{" "}
                        {skill.yearsOfExperience
                          ? `(${skill.yearsOfExperience} yrs)`
                          : ""}
                      </span>
                    ))}
                  </div>
                ) : (
                  <Text className="text-xs text-foreground-muted font-mono">
                    No parsed skills records found.
                  </Text>
                )}
              </div>

              {/* 4. Experience Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Professional Experience
                </h4>
                {experience && experience.length > 0 ? (
                  <div className="space-y-3.5">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className="font-black text-foreground uppercase">
                            {exp.jobTitle}
                          </span>
                          <span className="font-mono text-[9px] text-foreground-muted font-bold">
                            {exp.startDate} –{" "}
                            {exp.currentPosition ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <p className="font-bold text-[9px] text-foreground-secondary uppercase">
                          {exp.companyName}
                        </p>
                        <p className="text-xs text-foreground-secondary leading-relaxed pt-0.5">
                          {exp.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-xs text-foreground-muted font-mono">
                    No work experience records extracted.
                  </Text>
                )}
              </div>

              {/* 5. Education Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Academic Education
                </h4>
                {education && education.length > 0 ? (
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className="font-black text-foreground uppercase">
                            {edu.degree}{" "}
                            {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ""}
                          </span>
                          <span className="font-mono text-[9px] text-foreground-muted font-bold">
                            {edu.startDate} –{" "}
                            {edu.currentStudy ? "Present" : edu.endDate}
                          </span>
                        </div>
                        <p className="font-bold text-[9px] text-foreground-secondary uppercase">
                          {edu.institution}
                        </p>
                        {edu.cgpa && (
                          <p className="text-[9px] font-mono text-foreground-muted">
                            Result Score: {edu.cgpa}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-xs text-foreground-muted font-mono">
                    No academic history records extracted.
                  </Text>
                )}
              </div>

              {/* 6. Projects Section */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Featured Projects
                </h4>
                {projects && projects.length > 0 ? (
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-0.5">
                        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                          <span className="font-black text-foreground uppercase">
                            {proj.title}
                          </span>
                          <span className="font-mono text-[9px] text-foreground-muted font-bold">
                            {proj.startDate} –{" "}
                            {proj.currentlyWorking ? "Present" : proj.endDate}
                          </span>
                        </div>
                        <p className="font-bold text-[9px] text-foreground-secondary uppercase">
                          {proj.role}
                        </p>
                        <p className="text-xs text-foreground-secondary leading-relaxed pt-0.5">
                          {proj.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text className="text-xs text-foreground-muted font-mono">
                    No side projects records extracted.
                  </Text>
                )}
              </div>

              {/* 7. Certifications Section */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Certifications
                </h4>
                {certifications && certifications.length > 0 ? (
                  <ul className="list-disc pl-4 text-xs text-foreground-secondary space-y-1">
                    {certifications.map((cert) => (
                      <li key={cert.id}>
                        <span className="font-bold text-foreground uppercase">
                          {cert.name}
                        </span>{" "}
                        — Issued by{" "}
                        <span className="font-semibold text-foreground-secondary">
                          {cert.issuingOrganization}
                        </span>{" "}
                        ({cert.issueDate})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Text className="text-xs text-foreground-muted font-mono">
                    No certifications records found.
                  </Text>
                )}
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>

      {/* Rename dialog */}
      <RenameDialog
        isOpen={isRenameOpen}
        onClose={() => setIsRenameOpen(false)}
        originalName={resume.fileName}
        existingNames={existingNames}
        onRename={handleRenameSubmit}
      />

      <ConfirmationDialog />
    </div>
  );
}
