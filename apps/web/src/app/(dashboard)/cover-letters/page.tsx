"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useCoverLetterStore } from "@/features/cover-letters/store/cover-letter.store";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";
import type {
  CoverLetterTemplate,
  CoverLetterTone,
  CoverLetterDraft,
} from "@/features/cover-letters/types/cover-letter.types";
import {
  Sparkles,
  History,
  Download,
  Copy,
  Printer,
  Save,
  Trash2,
  RefreshCw,
  Eye,
  Edit3,
  AlertTriangle,
  XCircle,
  FileText,
  Bookmark,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock Jobs for Generation Selector
const MOCK_JOBS = [
  {
    id: "job_001",
    company: "Stripe",
    title: "Senior Frontend Engineer",
    location: "Remote",
    description:
      "Design fast UI platform components and optimize dashboard latency. Experience with React, Next.js, and CSS is required.",
  },
  {
    id: "job_002",
    company: "Vercel",
    title: "Lead Software Architect",
    location: "San Francisco, CA",
    description:
      "Build Next.js framework platforms and manage micro frontend build orchestration processes.",
  },
  {
    id: "job_003",
    company: "Linear",
    title: "Full Stack Engineer",
    location: "Remote",
    description:
      "Develop clean user interfaces and scale node backend APIs. Tech stack: TypeScript, React, Node.js.",
  },
  {
    id: "job_004",
    company: "Apple",
    title: "iOS Developer Internship",
    location: "Cupertino, CA",
    description:
      "Learn Swift, SwiftUI, and build modern application layouts with high focus on user experience.",
  },
];

// Cover Letter Templates list
const TEMPLATE_PRESETS = [
  {
    id: "professional" as CoverLetterTemplate,
    name: "Software Engineer",
    desc: "For traditional high-quality systems roles.",
    badge: "Recommended",
  },
  {
    id: "startup" as CoverLetterTemplate,
    name: "Backend Developer",
    desc: "High growth, fast delivery startup tech layout.",
    badge: "Early Stage",
  },
  {
    id: "enterprise" as CoverLetterTemplate,
    name: "Full Stack Developer",
    desc: "Compliance, scalable infrastructure block layout.",
    badge: "Strict Compliance",
  },
  {
    id: "modern" as CoverLetterTemplate,
    name: "Internship Layout",
    desc: "Highlights speed, projects, and academic traits.",
    badge: "Student",
  },
  {
    id: "minimal" as CoverLetterTemplate,
    name: "General Purpose",
    desc: "A clean, direct summary statement alignment.",
    badge: "Direct Form",
  },
];

// Local skeletons
function GenerationSkeleton() {
  return (
    <div
      className="space-y-4 w-full text-left"
      aria-label="Simulating AI text generation"
    >
      <div className="flex items-center gap-3">
        <Skeleton className="h-6 w-6 rounded-full animate-spin" />
        <Skeleton className="h-4.5 w-48" />
      </div>
      <div className="space-y-2 border-2 border-border p-4 bg-surface rounded-sm">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="space-y-1.5 pt-3">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-11/12" />
        </div>
      </div>
    </div>
  );
}

function PreviewSkeleton() {
  return (
    <div className="border-2 border-border p-5 bg-surface rounded-sm space-y-3 w-full text-left">
      <div className="flex justify-between items-center pb-2 border-b border-border/10">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-16" />
      </div>
      <div className="space-y-2 pt-2">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-3 w-full" />
        ))}
      </div>
    </div>
  );
}

export default function CoverLettersPage() {
  const { resumes, loadResumes } = useResumeStore();
  const {
    drafts,
    activeDraft,
    loading,
    loadDrafts,
    setActiveDraft,
    deleteDraft,
    generateLetter,
    regenerateSection,
    updateDraft,
    exportPDF,
    exportDOCX,
    copyLetter,
    createVersion,
    restoreVersion,
  } = useCoverLetterStore();

  const { ConfirmationDialog } = useConfirm();

  // State configurations
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [selectedJobId, setSelectedJobId] = useState("");
  const [template, setTemplate] = useState<CoverLetterTemplate>("professional");
  const [tone, setTone] = useState<CoverLetterTone>("professional");

  // Custom states
  const [activeTab, setActiveTab] = useState<
    "edit" | "preview" | "compare" | "history"
  >("edit");
  const [demoState, setDemoState] = useState<
    | "standard"
    | "empty"
    | "error_gen"
    | "error_net"
    | "error_resume"
    | "error_job"
  >("standard");

  // Section fields state
  const [greeting, setGreeting] = useState("Dear Hiring Committee,");
  const [introduction, setIntroduction] = useState(
    "I am writing to express my strong interest in the open position...",
  );
  const [whyInterested, setWhyInterested] = useState(
    "Your company values engineering quality and speed...",
  );
  const [experience, setExperience] = useState(
    "In my previous roles, I optimized React loads by 35%...",
  );
  const [skills, setSkills] = useState(
    "I bring expertise in React, TypeScript, Next.js, and Zustand...",
  );
  const [projects, setProjects] = useState(
    "I engineered the AI Career dashboard from scratch...",
  );
  const [closing, setClosing] = useState("Sincerely,\nAnshul Kumar");

  // Load drafts on mount
  useEffect(() => {
    loadDrafts();
    loadResumes();
  }, [loadDrafts, loadResumes]);

  // Set default Resume and Job
  useEffect(() => {
    if (resumes.length > 0 && !selectedResumeId) {
      const primaryResume = resumes.find((r) => r.isDefault) || resumes[0];
      setSelectedResumeId(primaryResume.id);
    }
    if (!selectedJobId) {
      setSelectedJobId(MOCK_JOBS[0].id);
    }
  }, [resumes, selectedResumeId, selectedJobId]);

  // Sync editor fields when active draft changes
  useEffect(() => {
    if (activeDraft) {
      const parts = activeDraft.content.split("\n\n");
      // Fallback decomposition
      setGreeting(parts[0] || "Dear Hiring Manager,");
      setIntroduction(parts[1] || "I am writing to apply...");
      setWhyInterested(parts[2] || "I am deeply aligned with your goals...");
      setExperience(
        parts[3] || "Over the last years, I led frontend projects...",
      );
      setSkills(parts[4] || "I am proficient in React and typescript...");
      setProjects(parts[5] || "I designed customizable layout dashboards...");
      setClosing(parts[6] || "Sincerely,\nAnshul Kumar");
    }
  }, [activeDraft]);

  // Combined letter content getter
  const combinedContent = useMemo(() => {
    return `${greeting}\n\n${introduction}\n\n${whyInterested}\n\n${experience}\n\n${skills}\n\n${projects}\n\n${closing}`;
  }, [
    greeting,
    introduction,
    whyInterested,
    experience,
    skills,
    projects,
    closing,
  ]);

  // Handle generation click
  const handleGenerate = async () => {
    if (!selectedResumeId && demoState === "standard") {
      toast.error("Please select a resume file first.");
      return;
    }
    if (!selectedJobId && demoState === "standard") {
      toast.error("Please select a target job position first.");
      return;
    }

    const job = MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];
    const resume = resumes.find((r) => r.id === selectedResumeId) || null;

    await generateLetter(
      `${job.company} ${job.title} AI Cover Letter`,
      job.title,
      job.company,
      job.description,
      template,
      tone,
      resume,
    );
    setActiveTab("edit");
  };

  // Section regeneration click handler
  const handleRegenerateSec = async (key: string) => {
    const job = MOCK_JOBS.find((j) => j.id === selectedJobId) || MOCK_JOBS[0];
    const text = await regenerateSection(key, tone, job.title, job.company);

    if (key === "introduction") setIntroduction(text);
    if (key === "experience") setExperience(text);
    if (key === "skills") setSkills(text);
    if (key === "closing") setClosing(text);
  };

  // Save drafts
  const handleSaveDraft = async () => {
    if (!activeDraft) return;
    await updateDraft(activeDraft.id, { content: combinedContent });
    toast.success("Draft saved successfully!");
  };

  // Copy to clipboard
  const handleCopy = async () => {
    if (!activeDraft) return;
    await copyLetter(activeDraft.id);
  };

  // Export handlers
  const handleExportPDF = async () => {
    if (!activeDraft) return;
    await exportPDF(activeDraft.id);
  };

  const handleExportDOCX = async () => {
    if (!activeDraft) return;
    await exportDOCX(activeDraft.id);
  };

  const handlePrint = () => {
    window.print();
  };

  // Tone swap regenerator
  const handleToneRegenerate = async (newTone: CoverLetterTone) => {
    setTone(newTone);
    if (!activeDraft) return;
    const resume = resumes.find((r) => r.id === selectedResumeId) || null;

    await generateLetter(
      activeDraft.title,
      activeDraft.jobTitle,
      activeDraft.company,
      activeDraft.jobDescription || "",
      activeDraft.template,
      newTone,
      resume,
    );
  };

  return (
    <div className="space-y-6 pb-12 select-none relative max-w-[1200px] mx-auto w-full text-left">
      <ConfirmationDialog />

      {/* Header bar and state simulator */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Heading
            level="h2"
            className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2"
          >
            <Sparkles className="h-7 w-7 text-primary shrink-0 animate-pulse" />
            AI Cover Letter Studio
          </Heading>
          <Text className="text-foreground-secondary text-xs">
            Draft, refine, and optimize job-specific cover letters tailored
            automatically using your resume variants.
          </Text>
        </div>

        {/* State simulator toolbar */}
        <div className="flex flex-wrap items-center gap-2 border-2 border-border p-2 bg-surface-secondary/45 rounded-sm">
          <span className="text-[7.5px] font-black uppercase tracking-wider text-foreground-muted block px-1">
            Simulator:
          </span>
          {[
            "standard",
            "empty",
            "error_gen",
            "error_net",
            "error_resume",
            "error_job",
          ].map((st) => (
            <button
              key={st}
              onClick={() => {
                setDemoState(
                  st as
                    | "standard"
                    | "empty"
                    | "error_gen"
                    | "error_net"
                    | "error_resume"
                    | "error_job",
                );
                if (st === "empty") {
                  setActiveDraft(null);
                }
              }}
              className={cn(
                "h-6 px-1.5 text-[7px] font-black uppercase tracking-wider border transition-all rounded-sm",
                demoState === st
                  ? "bg-primary text-white border-border brutal-shadow-xs"
                  : "bg-surface text-foreground hover:bg-surface-secondary border-border/20",
              )}
            >
              {st.replace("error_", "ERR: ").replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* ERROR STATES DEMO */}
      {demoState.startsWith("error_") && (
        <div className="grid gap-4">
          {demoState === "error_gen" && (
            <EmptyState
              icon={XCircle}
              title="AI Generation Failed"
              description="Our LLM orchestration engine failed to tailors paragraph blocks against this job post description. Please retry again."
              primaryAction={{
                label: "Retry Letter Generation",
                onClick: handleGenerate,
              }}
            />
          )}
          {demoState === "error_net" && (
            <EmptyState
              icon={XCircle}
              title="Network Request Timeout"
              description="A temporary cloud network delay prevented completing the secure handshake. Check connection configurations."
              primaryAction={{
                label: "Retry Handshake",
                onClick: handleGenerate,
              }}
            />
          )}
          {demoState === "error_resume" && (
            <EmptyState
              icon={AlertTriangle}
              title="Invalid Resume Data Structure"
              description="Your selected resume lacks key profile experience fields required to build a highly targeted cover letter. Check resume metadata."
              primaryAction={{
                label: "Edit Resume Profile",
                onClick: () => (window.location.href = "/resume"),
              }}
            />
          )}
          {demoState === "error_job" && (
            <EmptyState
              icon={AlertTriangle}
              title="Invalid Job Post Meta"
              description="The selected job card details do not contain a valid description, position title, or hiring team identifier."
              primaryAction={{
                label: "View Tracker Stages",
                onClick: () => (window.location.href = "/applications"),
              }}
            />
          )}
        </div>
      )}

      {/* EMPTY STATES DEMO */}
      {demoState === "empty" && (
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              icon={FileText}
              title="No Resume Selected"
              description="Choose a candidate resume format before running the AI copywriter. We extract achievements from selected vectors."
              primaryAction={{
                label: "Upload Resume Variant",
                onClick: () => (window.location.href = "/resume"),
              }}
            />
            <EmptyState
              icon={Bookmark}
              title="No Job Position Selected"
              description="To personalize intro paragraph statements, you need to select a job listing card or import description notes."
              primaryAction={{
                label: "Select Tracked Job",
                onClick: () => (window.location.href = "/applications"),
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmptyState
              icon={Trash2}
              title="No Saved Drafts"
              description="You have no current cover letters saved inside local storage drafts registry."
            />
            <EmptyState
              icon={Sparkles}
              title="No Generated Letters"
              description="Select parameters on the left builder console to generate high-conversion tailored letters."
            />
          </div>
        </div>
      )}

      {/* STANDARD INTEGRATED WORKSPACE */}
      {demoState === "standard" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT CONSOLE: Generation criteria settings & drafts registry */}
          <div className="lg:col-span-4 space-y-6">
            {/* Generation Parameters */}
            <BrutalCard className="p-5 border-[3px] border-border bg-surface brutal-shadow space-y-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground border-b-2 border-border/10 pb-2.5 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-primary" /> Setup
                Parameters
              </h3>

              {/* Resume Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="resume-variant-select"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Select Profile Resume
                </label>
                <BrutalSelect
                  id="resume-variant-select"
                  value={selectedResumeId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedResumeId(e.target.value)
                  }
                  options={resumes.map((r) => ({
                    label: r.title || "Primary Resume",
                    value: r.id,
                  }))}
                  className="h-9 text-xs font-bold w-full uppercase"
                />
              </div>

              {/* Target Job Selector */}
              <div className="space-y-1.5">
                <label
                  htmlFor="job-selector"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Select Target Job Position
                </label>
                <BrutalSelect
                  id="job-selector"
                  value={selectedJobId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setSelectedJobId(e.target.value)
                  }
                  options={MOCK_JOBS.map((j) => ({
                    label: `${j.company} - ${j.title}`,
                    value: j.id,
                  }))}
                  className="h-9 text-xs font-bold w-full uppercase"
                />
              </div>

              {/* Template Style Preset */}
              <div className="space-y-1.5">
                <label
                  htmlFor="template-preset"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Cover Template Type
                </label>
                <BrutalSelect
                  id="template-preset"
                  value={template}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTemplate(e.target.value as CoverLetterTemplate)
                  }
                  options={TEMPLATE_PRESETS.map((t) => ({
                    label: t.name,
                    value: t.id,
                  }))}
                  className="h-9 text-xs font-bold w-full uppercase"
                />
              </div>

              {/* Tone Selection */}
              <div className="space-y-1.5">
                <label
                  htmlFor="writing-tone"
                  className="text-[8.5px] font-black uppercase text-foreground-secondary block"
                >
                  Writing Tone Pitch
                </label>
                <BrutalSelect
                  id="writing-tone"
                  value={tone}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setTone(e.target.value as CoverLetterTone)
                  }
                  options={[
                    { label: "Standard Professional", value: "professional" },
                    { label: "Formal Corporate", value: "formal" },
                    { label: "Friendly Collaborative", value: "friendly" },
                    { label: "Confident Leader", value: "confident" },
                    { label: "Enthusiastic Advocate", value: "enthusiastic" },
                  ]}
                  className="h-9 text-xs font-bold w-full uppercase"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={loading}
                className="w-full h-10 text-xs font-black uppercase tracking-wider bg-primary text-white border-2 border-border brutal-shadow-xs hover:brutal-shadow flex items-center justify-center gap-2 rounded-sm"
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 fill-white" />
                )}
                {activeDraft
                  ? "Regenerate Full Letter"
                  : "Generate Cover Letter"}
              </Button>
            </BrutalCard>

            {/* Dashboard summary widgets */}
            <div className="grid grid-cols-2 gap-4">
              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[85px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Generated letters
                </span>
                <span className="text-xl font-black font-mono">
                  {drafts.length} total
                </span>
                <span className="text-[7px] text-foreground-secondary font-mono">
                  Last generated today
                </span>
              </BrutalCard>

              <BrutalCard className="p-4 border-2 border-border bg-surface brutal-shadow-xs flex flex-col justify-between min-h-[85px]">
                <span className="text-[7.5px] font-black text-foreground-muted uppercase block">
                  Drafts status
                </span>
                <span className="text-xl font-black font-mono">Active</span>
                <Badge className="text-[6.5px] font-bold bg-green-50 text-green-700 border border-green-300 w-max px-1.5 py-0 rounded-sm shadow-none">
                  Synced
                </Badge>
              </BrutalCard>
            </div>

            {/* Existing drafts list */}
            <BrutalCard className="p-5 border-2 border-border bg-surface brutal-shadow-sm space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center justify-between">
                <span>Recent draft Logs</span>
                <Badge className="bg-surface border border-border text-[7px]">
                  {drafts.length} Logs
                </Badge>
              </h4>

              <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                {drafts.map((d) => (
                  <div
                    key={d.id}
                    onClick={() => setActiveDraft(d)}
                    className={cn(
                      "p-3 border-2 rounded-sm text-xs font-bold text-foreground-secondary flex justify-between items-center cursor-pointer hover:border-foreground transition-all",
                      activeDraft?.id === d.id
                        ? "border-primary bg-primary/5"
                        : "border-border bg-slate-50/20",
                    )}
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-extrabold text-foreground truncate uppercase text-[10.5px]">
                        {d.company}
                      </p>
                      <p className="text-foreground-muted text-[9.5px]">
                        {d.jobTitle}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteDraft(d.id);
                        loadDrafts();
                      }}
                      className="text-error hover:text-rose-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                {drafts.length === 0 && (
                  <p className="text-[8.5px] text-foreground-muted italic uppercase text-center py-4">
                    No drafts saved.
                  </p>
                )}
              </div>
            </BrutalCard>
          </div>

          {/* RIGHT SIDE: Rich Cover Letter Editor & live output preview */}
          <div className="lg:col-span-8 space-y-6">
            {loading ? (
              <div className="space-y-6">
                <GenerationSkeleton />
                <PreviewSkeleton />
              </div>
            ) : !activeDraft ? (
              <EmptyState
                icon={Sparkles}
                title="AI Copywriter Awaiting Input"
                description="Select profile resume data and a target job card on the left panel, then hit Generate to invoke LLM copywriting."
                primaryAction={{
                  label: "Load Seed Demo Draft",
                  onClick: () => {
                    const sampleDraft: CoverLetterDraft = {
                      id: "cl_demo",
                      title: "Stripe UI Engineer Cover",
                      jobTitle: "Senior Frontend Engineer",
                      company: "Stripe",
                      template: "professional",
                      tone: "professional",
                      content: `Dear Hiring Committee,\n\nI am thrilled to express my strong interest in the Senior Frontend Engineer position at Stripe. Having spent five years optimizing performance dashboards, I am excited to help elevate your developer portals.\n\nAt my previous role, I engineered high-speed widgets, reducing loading lag by 35% across core customer routes. I prioritize semantic accessibility and clean state layout frameworks.\n\nMy skill set aligns with React, TypeScript, Next.js, and modern styling architectures.\n\nI built custom canvas workflows, illustrating my capability to design complex visual components.\n\nThank you for considering my application. I look forward to working together.\n\nSincerely,\nAnshul Kumar`,
                      createdAt: new Date().toISOString(),
                      updatedAt: new Date().toISOString(),
                      versions: [],
                    };
                    setActiveDraft(sampleDraft);
                  },
                }}
              />
            ) : (
              <div className="space-y-6">
                {/* 1. Cover letter dashboard overview metadata */}
                <BrutalCard className="p-4 border-[3px] border-border bg-surface brutal-shadow flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[7.5px] font-black text-primary uppercase tracking-widest block">
                      Active workspace letter
                    </span>
                    <h3 className="text-sm font-black uppercase text-foreground leading-tight">
                      {activeDraft.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[9px] font-bold text-foreground-secondary pt-0.5">
                      <span>Company: {activeDraft.company}</span>
                      <span>•</span>
                      <span>Role: {activeDraft.jobTitle}</span>
                      <span>•</span>
                      <span>
                        Tone:{" "}
                        <span className="text-primary font-black uppercase">
                          {tone}
                        </span>
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 shrink-0">
                    <BrutalSelect
                      value={tone}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleToneRegenerate(e.target.value as CoverLetterTone)
                      }
                      options={[
                        { label: "Professional", value: "professional" },
                        { label: "Formal", value: "formal" },
                        { label: "Friendly", value: "friendly" },
                        { label: "Confident", value: "confident" },
                        { label: "Enthusiastic", value: "enthusiastic" },
                      ]}
                      className="h-8.5 text-[9.5px] font-black uppercase w-[120px] border-2 border-border"
                    />
                    <Button
                      onClick={handleSaveDraft}
                      className="h-8.5 text-[9px] font-black uppercase bg-surface text-foreground border-2 border-border hover:bg-surface-secondary rounded-sm brutal-shadow-xs"
                    >
                      <Save className="h-3.5 w-3.5 mr-1 text-primary" /> Save
                      Draft
                    </Button>
                  </div>
                </BrutalCard>

                {/* Main tabs */}
                <div className="flex border-b-2 border-border overflow-x-auto gap-1 bg-surface-secondary/20 p-1 rounded-sm select-none">
                  {[
                    { id: "edit", label: "Structured Editor", icon: Edit3 },
                    { id: "preview", label: "Print preview", icon: Eye },
                    { id: "compare", label: "AI Diff check", icon: Sparkles },
                    { id: "history", label: "Versions history", icon: History },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(
                          tab.id as "edit" | "preview" | "compare" | "history",
                        )
                      }
                      className={cn(
                        "px-3.5 py-1.5 text-[8.5px] font-black uppercase tracking-wider flex items-center gap-1 border border-transparent rounded-sm shrink-0",
                        activeTab === tab.id
                          ? "bg-surface border-border border-2 text-foreground brutal-shadow-xs"
                          : "text-foreground-secondary hover:text-foreground",
                      )}
                    >
                      <tab.icon className="h-3.5 w-3.5" /> {tab.label}
                    </button>
                  ))}
                </div>

                {/* TAB 1: STRUCTURED EDITOR */}
                {activeTab === "edit" && (
                  <div className="grid gap-6">
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                      <div className="border-b border-border/10 pb-2 flex justify-between items-center">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                          Multi-Section Editor Workspace
                        </h4>
                        <span className="text-[7.5px] font-mono text-foreground-muted">
                          Save changes regularly to drafts.
                        </span>
                      </div>

                      <div className="space-y-4">
                        {/* Greeting */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="edit-greeting"
                              className="text-[8px] font-black uppercase text-foreground-muted"
                            >
                              Greeting Header
                            </label>
                          </div>
                          <Input
                            id="edit-greeting"
                            value={greeting}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => setGreeting(e.target.value)}
                            className="h-8.5 text-xs font-bold border border-border"
                          />
                        </div>

                        {/* Introduction */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="edit-intro"
                              className="text-[8px] font-black uppercase text-foreground-muted"
                            >
                              Introduction Paragraph
                            </label>
                            <button
                              onClick={() =>
                                handleRegenerateSec("introduction")
                              }
                              className="text-[7.5px] font-black text-primary hover:underline uppercase flex items-center gap-0.5"
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> Regenerate
                              Intro Only
                            </button>
                          </div>
                          <textarea
                            id="edit-intro"
                            value={introduction}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setIntroduction(e.target.value)}
                            rows={3}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>

                        {/* Why I'm Interested */}
                        <div className="space-y-1">
                          <label
                            htmlFor="edit-why"
                            className="text-[8px] font-black uppercase text-foreground-muted"
                          >
                            Why I&apos;m Interested Statement
                          </label>
                          <textarea
                            id="edit-why"
                            value={whyInterested}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setWhyInterested(e.target.value)}
                            rows={3}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>

                        {/* Experience */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="edit-exp"
                              className="text-[8px] font-black uppercase text-foreground-muted"
                            >
                              Experience Details
                            </label>
                            <button
                              onClick={() => handleRegenerateSec("experience")}
                              className="text-[7.5px] font-black text-primary hover:underline uppercase flex items-center gap-0.5"
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> Regenerate
                              Experience Only
                            </button>
                          </div>
                          <textarea
                            id="edit-exp"
                            value={experience}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setExperience(e.target.value)}
                            rows={3}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>

                        {/* Skills */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="edit-skills"
                              className="text-[8px] font-black uppercase text-foreground-muted"
                            >
                              Skills Integration
                            </label>
                            <button
                              onClick={() => handleRegenerateSec("skills")}
                              className="text-[7.5px] font-black text-primary hover:underline uppercase flex items-center gap-0.5"
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> Regenerate
                              Skills Only
                            </button>
                          </div>
                          <textarea
                            id="edit-skills"
                            value={skills}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setSkills(e.target.value)}
                            rows={2}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>

                        {/* Projects */}
                        <div className="space-y-1">
                          <label
                            htmlFor="edit-projects"
                            className="text-[8px] font-black uppercase text-foreground-muted"
                          >
                            Project Achievements
                          </label>
                          <textarea
                            id="edit-projects"
                            value={projects}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setProjects(e.target.value)}
                            rows={2}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>

                        {/* Closing */}
                        <div className="space-y-1">
                          <div className="flex justify-between items-center">
                            <label
                              htmlFor="edit-closing"
                              className="text-[8px] font-black uppercase text-foreground-muted"
                            >
                              Closing Statement
                            </label>
                            <button
                              onClick={() => handleRegenerateSec("closing")}
                              className="text-[7.5px] font-black text-primary hover:underline uppercase flex items-center gap-0.5"
                            >
                              <RefreshCw className="h-2.5 w-2.5" /> Regenerate
                              Closing Only
                            </button>
                          </div>
                          <textarea
                            id="edit-closing"
                            value={closing}
                            onChange={(
                              e: React.ChangeEvent<HTMLTextAreaElement>,
                            ) => setClosing(e.target.value)}
                            rows={3}
                            className="w-full text-xs font-bold p-2.5 border border-border rounded-sm bg-surface-secondary/10 leading-relaxed"
                          />
                        </div>
                      </div>
                    </BrutalCard>

                    {/* AI Suggestions Card */}
                    <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-3">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                        <Sparkles className="h-4.5 w-4.5 text-warning animate-pulse" />{" "}
                        AI suggestions Audit recommendations
                      </h4>
                      <ul className="space-y-2 text-[10px] font-bold text-foreground-secondary leading-normal">
                        <li className="flex items-start gap-1.5 text-warning">
                          <span className="font-extrabold">
                            ⚠ Better intro:
                          </span>{" "}
                          Try starting with direct metrics instead of generic
                          expressions.
                        </li>
                        <li className="flex items-start gap-1.5 text-warning">
                          <span className="font-extrabold">
                            ⚠ Stronger achievements:
                          </span>{" "}
                          Quantify how your React layout widgets affected load
                          parameters.
                        </li>
                        <li className="flex items-start gap-1.5 text-green-600">
                          <span className="font-extrabold">✓ ATS wording:</span>{" "}
                          Letter contains high match frequency for Next.js,
                          Zustand, and TypeScript tags.
                        </li>
                      </ul>
                    </BrutalCard>
                  </div>
                )}

                {/* TAB 2: LIVE PRINT PREVIEW */}
                {activeTab === "preview" && (
                  <div className="grid gap-6">
                    <div className="flex flex-wrap items-center gap-2 border-2 border-border p-3.5 bg-surface-secondary/20 rounded-sm">
                      <span className="text-[9px] font-black uppercase text-foreground-secondary">
                        Export letter files:
                      </span>
                      <Button
                        onClick={handleCopy}
                        className="h-8 text-[8.5px] font-black uppercase border border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm flex items-center gap-1"
                      >
                        <Copy className="h-3.5 w-3.5 text-primary" /> Copy text
                      </Button>
                      <Button
                        onClick={handleExportPDF}
                        className="h-8 text-[8.5px] font-black uppercase border border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5 text-primary" />{" "}
                        Download PDF
                      </Button>
                      <Button
                        onClick={handleExportDOCX}
                        className="h-8 text-[8.5px] font-black uppercase border border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm flex items-center gap-1"
                      >
                        <Download className="h-3.5 w-3.5 text-primary" />{" "}
                        Download DOCX
                      </Button>
                      <Button
                        onClick={handlePrint}
                        className="h-8 text-[8.5px] font-black uppercase border border-border bg-surface text-foreground hover:bg-surface-secondary rounded-sm flex items-center gap-1"
                      >
                        <Printer className="h-3.5 w-3.5 text-primary" /> Print
                        Layout
                      </Button>
                    </div>

                    {/* Printable cover letter card */}
                    <BrutalCard className="p-8 border-[3px] border-border bg-surface brutal-shadow font-serif text-[11px] leading-relaxed text-foreground space-y-4 max-w-[800px] mx-auto select-text">
                      <div className="whitespace-pre-line">
                        {combinedContent}
                      </div>
                    </BrutalCard>
                  </div>
                )}

                {/* TAB 3: BEFORE VS AFTER COMPARISON */}
                {activeTab === "compare" && (
                  <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b border-border/10 pb-2">
                      AI Optimization comparison Diff
                    </h4>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1.5">
                        <span className="text-[8px] font-black text-rose-700 uppercase block">
                          Current Draft Text
                        </span>
                        <div className="p-4 border-2 border-border bg-slate-50/20 dark:bg-surface-secondary/20 rounded-sm text-[10px] font-bold text-foreground-secondary leading-relaxed italic whitespace-pre-line">
                          {greeting}
                          {"\n\n"}
                          {introduction}
                          {"\n\n"}
                          {whyInterested}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <span className="text-[8px] font-black text-green-700 uppercase block">
                          AI Improved Copy suggestion
                        </span>
                        <div className="p-4 border-2 border-green-300 dark:border-green-500/30 bg-green-50/5 rounded-sm text-[10px] font-bold text-foreground leading-relaxed whitespace-pre-line">
                          {greeting}
                          {"\n\n"}
                          <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                            I am thrilled to express my interest in the role.
                          </mark>{" "}
                          Having recently optimized React rendering loads by 35%
                          to drive faster page speeds, I am highly prepared to
                          accelerate dashboard delivery times at Stripe.
                          {"\n\n"}
                          <mark className="bg-yellow-100 dark:bg-yellow-500/20 px-0.5">
                            Stripe has pioneered fast developer experiences,
                          </mark>{" "}
                          and I am excited to support your core product
                          workflows.
                        </div>
                      </div>
                    </div>
                  </BrutalCard>
                )}

                {/* TAB 4: VERSION HISTORY LOG */}
                {activeTab === "history" && (
                  <BrutalCard className="p-5 border-2 border-border bg-surface rounded-sm space-y-4">
                    <div className="flex justify-between items-center border-b border-border/10 pb-2">
                      <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                        Saved templates versions logs
                      </h4>
                      <button
                        onClick={() => {
                          createVersion(activeDraft.template, tone);
                          toast.success("Current version persisted to logs.");
                        }}
                        className="text-[8.5px] font-black uppercase text-primary hover:underline"
                      >
                        + Save Current Layout
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-[9.5px] font-bold uppercase tracking-wider text-foreground-secondary">
                        <thead className="bg-surface-secondary/40 text-[8.5px] border-b border-border">
                          <tr>
                            <th className="p-2">Date & Time</th>
                            <th className="p-2">Tone</th>
                            <th className="p-2">Template Style</th>
                            <th className="p-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {activeDraft.versions &&
                          activeDraft.versions.length > 0 ? (
                            activeDraft.versions.map((ver) => (
                              <tr
                                key={ver.id}
                                className="border-b border-border/5 hover:bg-slate-50/40"
                              >
                                <td className="p-2 font-mono text-[8.5px] text-foreground-muted">
                                  {ver.createdAt
                                    .replace("T", " ")
                                    .substring(0, 16)}
                                </td>
                                <td className="p-2 uppercase text-primary">
                                  {ver.tone}
                                </td>
                                <td className="p-2">{ver.template}</td>
                                <td className="p-2 text-right">
                                  <Button
                                    size="sm"
                                    onClick={() => {
                                      restoreVersion(ver.id);
                                      toast.success(
                                        "Version restored successfully!",
                                      );
                                    }}
                                    className="h-6 text-[8px] font-black uppercase border border-border px-2 py-0 rounded-sm"
                                  >
                                    Restore
                                  </Button>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td
                                colSpan={4}
                                className="p-4 text-center text-foreground-muted italic uppercase text-[8px]"
                              >
                                No alternative version checkpoints generated for
                                this draft yet.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </BrutalCard>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
