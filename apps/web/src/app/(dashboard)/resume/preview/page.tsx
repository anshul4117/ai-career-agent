"use client";

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useShallow } from "zustand/react/shallow";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  ArrowLeft,
  FileText,
  Sparkles,
  Download,
  CheckCircle,
  Calendar,
  HardDrive,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function ResumePreviewPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const { uploadedResumes, setDefaultUploadedResume } = useResumeStore(
    useShallow((state) => ({
      uploadedResumes: state.uploadedResumes,
      setDefaultUploadedResume: state.setDefaultUploadedResume,
    })),
  );

  const resume =
    uploadedResumes.find((r) => r.id === id) ||
    uploadedResumes.find((r) => r.isDefault) ||
    uploadedResumes[0];

  if (!resume) {
    return (
      <div className="h-[400px] flex flex-col items-center justify-center space-y-4">
        <Heading
          level="h3"
          className="text-lg font-black uppercase text-foreground"
        >
          Resume Document Not Found
        </Heading>
        <BrutalButton asChild>
          <Link href="/resume">Back to Resume Manager</Link>
        </BrutalButton>
      </div>
    );
  }

  const handleSetDefault = async () => {
    const toastId = toast.loading("Updating primary resume...");
    try {
      await setDefaultUploadedResume(resume.id);
      toast.success(`"${resume.fileName}" set as your primary resume!`, {
        id: toastId,
      });
    } catch {
      toast.error("Failed to update default resume.", { id: toastId });
    }
  };

  const handleDownload = () => {
    toast.info(`Mock Download: Initiated transfer for ${resume.fileName}`);
  };

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Back button and Page Header */}
      <div className="space-y-1">
        <Link
          href="/resume"
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Resume Manager
        </Link>
        <Heading
          level="h2"
          className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2"
        >
          <FileText className="h-6 w-6 text-primary shrink-0" />
          Document Preview & Analysis
        </Heading>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Metadata and Document Statistics */}
        <div className="lg:col-span-1 space-y-6">
          <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow space-y-5">
            <Heading
              level="h4"
              className="text-sm font-black uppercase tracking-wider border-b-2 border-border/10 pb-2"
            >
              Document Analysis
            </Heading>

            <div className="space-y-4 text-xs">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-border bg-surface-secondary/40 brutal-shadow-xs text-center space-y-1">
                <Sparkles className="h-8 w-8 text-warning mb-1" />
                <p className="text-[10px] font-black uppercase text-foreground-secondary">
                  Extracted ATS Rank
                </p>
                <p className="font-mono text-3xl font-black text-foreground">
                  {resume.atsScore}%
                </p>
                <p className="text-[9px] text-foreground-muted font-bold pt-1 uppercase">
                  Good ATS compatibility
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                  <span className="font-semibold text-foreground-secondary flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5" /> File Name
                  </span>
                  <span
                    className="font-black text-foreground truncate max-w-[150px] uppercase"
                    title={resume.fileName}
                  >
                    {resume.fileName}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                  <span className="font-semibold text-foreground-secondary flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" /> Uploaded Date
                  </span>
                  <span className="font-mono text-foreground font-bold">
                    {formatDate(resume.uploadedAt)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                  <span className="font-semibold text-foreground-secondary flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" /> Document Version
                  </span>
                  <span className="font-mono text-foreground font-bold">
                    Version {resume.version}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                  <span className="font-semibold text-foreground-secondary flex items-center gap-1.5">
                    <HardDrive className="h-3.5 w-3.5" /> Document Size
                  </span>
                  <span className="font-mono text-foreground font-bold">
                    {resume.fileSize}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-border/10 pb-1.5">
                  <span className="font-semibold text-foreground-secondary flex items-center gap-1.5">
                    <ShieldCheck className="h-3.5 w-3.5" /> Document Status
                  </span>
                  <span className="font-extrabold text-success uppercase text-[10px] flex items-center gap-0.5">
                    <CheckCircle className="h-3 w-3 fill-current" />
                    {resume.status}
                  </span>
                </div>
              </div>

              <div className="pt-4 space-y-2 border-t border-border/10">
                <BrutalButton
                  onClick={handleDownload}
                  className="w-full h-9 text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Download className="h-3.5 w-3.5" /> Download File
                </BrutalButton>
                <BrutalButton
                  onClick={handleSetDefault}
                  disabled={resume.isDefault}
                  variant="secondary"
                  className="w-full h-9 text-[10px] font-black uppercase tracking-wider flex items-center justify-center"
                >
                  Set as Default Resume
                </BrutalButton>
              </div>
            </div>
          </BrutalCard>
        </div>

        {/* Right Side: Mock Preview of parsed details */}
        <div className="lg:col-span-2">
          <BrutalCard className="bg-surface border-[3px] border-border p-8 brutal-shadow h-full min-h-[500px]">
            <div className="space-y-6 max-w-2xl mx-auto">
              {/* Mock Resume Top Header */}
              <div className="border-b-4 border-border pb-4 space-y-2 text-center">
                <Heading
                  level="h3"
                  className="text-xl md:text-2xl font-black uppercase tracking-tight text-foreground"
                >
                  Anshul Kumar
                </Heading>
                <p className="font-extrabold text-xs uppercase text-primary">
                  Senior Staff Frontend Engineer
                </p>
                <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono text-foreground-secondary pt-1">
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" /> anshul@example.com
                  </span>
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" /> +91 98765 43210
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Bengaluru, India
                  </span>
                </div>
              </div>

              {/* Mock Resume Executive Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Executive Summary
                </h4>
                <Text className="text-xs text-foreground-secondary leading-relaxed">
                  Innovative Staff Engineer with 8+ years of expertise in
                  crafting responsive, accessible, and high-performance Web
                  applications. Specialist in brutalist design systems, Next.js
                  architecture, state management, and semantic SEO frameworks.
                </Text>
              </div>

              {/* Mock Resume Experience timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Work Experience
                </h4>

                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-black text-foreground uppercase">
                        Senior Frontend Lead
                      </span>
                      <span className="font-mono text-[10px] text-foreground-muted font-bold">
                        2024 – Present
                      </span>
                    </div>
                    <p className="font-bold text-[10px] text-foreground-secondary uppercase">
                      Google / Tech Corp
                    </p>
                    <ul className="list-disc pl-4 text-xs text-foreground-secondary space-y-0.5 leading-relaxed">
                      <li>
                        Designed modular micro-frontends reducing bundle loads
                        by 35%
                      </li>
                      <li>
                        Helped implement a highly reusable dark-mode system
                        following WCAG a11y guidelines
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                      <span className="font-black text-foreground uppercase">
                        Frontend Developer
                      </span>
                      <span className="font-mono text-[10px] text-foreground-muted font-bold">
                        2022 – 2024
                      </span>
                    </div>
                    <p className="font-bold text-[10px] text-foreground-secondary uppercase">
                      Creative Labs Inc.
                    </p>
                    <ul className="list-disc pl-4 text-xs text-foreground-secondary space-y-0.5 leading-relaxed">
                      <li>
                        Built custom CMS layouts with robust SEO schema tagging
                        structures
                      </li>
                      <li>
                        Refactored legacy state architectures resulting in a 40%
                        reduction in code complexity
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Mock Resume Education */}
              <div className="space-y-3">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Education & Qualifications
                </h4>

                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs flex-wrap gap-2">
                    <span className="font-black text-foreground uppercase">
                      Bachelor of Technology in Computer Science
                    </span>
                    <span className="font-mono text-[10px] text-foreground-muted font-bold">
                      2018 – 2022
                    </span>
                  </div>
                  <p className="font-bold text-[10px] text-foreground-secondary uppercase">
                    ABC Institute of Technology
                  </p>
                  <p className="text-[10px] font-mono text-foreground-muted">
                    Grade: 8.5 / 10 CGPA
                  </p>
                </div>
              </div>

              {/* Mock Resume Skills */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-widest text-primary border-b-2 border-border pb-0.5">
                  Core Technologies
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {[
                    "React",
                    "Next.js",
                    "TypeScript",
                    "Tailwind CSS",
                    "Zustand",
                    "Redux",
                    "Zod",
                    "Webpack",
                    "Vite",
                    "Node.js",
                    "Docker",
                  ].map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 border border-border bg-surface-secondary text-[9px] font-extrabold uppercase rounded-sm text-foreground-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
