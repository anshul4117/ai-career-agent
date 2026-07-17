"use client";

import React, { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ErrorMessage } from "@/features/auth/components/error-message";
import { jobService } from "@/features/jobs/services/job.service";
import type { Job } from "@/features/jobs/types/jobs.types";
import { mockResumes } from "@/features/resume/mock/resumes";
import { FileText, Briefcase, Sparkles, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { PageLoader, InlineLoader } from "@/components/ui/brand-loader";

interface ApplyJobPageProps {
  params: Promise<{ id: string }>;
}

export default function ApplyJobPage({ params }: ApplyJobPageProps) {
  const router = useRouter();
  const { id } = use(params);
  const [job, setJob] = useState<Job | null>(null);
  const [loadingJob, setLoadingJob] = useState(true);

  // States
  const [selectedResumeId, setSelectedResumeId] = useState<string>("");
  const [coverLetterOption, setCoverLetterOption] = useState<"ai-generated" | "none">("ai-generated");
  const [coverLetterText, setCoverLetterText] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const fetched = await jobService.getJobById(id);
        setJob(fetched);
      } catch {
        setJob(null);
      } finally {
        setLoadingJob(false);
      }
    };
    loadJob();
  }, [id]);

  // Pre-generate cover letter based on selected resume and job details
  const handleResumeSelect = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    const resume = mockResumes.find((r) => r.id === resumeId);
    if (resume && job) {
      setCoverLetterText(
        `Dear Hiring Team at ${job.companyInfo.name},\n\nI am writing to express my strong interest in the ${job.title} position at your company. With my background in technology and experience working with files like ${resume.fileName}, I am confident in my ability to contribute effectively from day one.\n\nYour job description highlights requirements in ${job.skillsRequired.join(", ")}, which align perfectly with my technical toolkit. I look forward to discussing how my experience can support your goals.\n\nSincerely,\nCandidate User`
      );
    }
  };

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedResumeId) {
      setError("Please select a resume to submit with your application.");
      return;
    }

    if (coverLetterOption === "ai-generated" && !coverLetterText.trim()) {
      setError("Please write or generate your cover letter text.");
      return;
    }

    setIsSubmitting(true);
    // Simulate submission delay
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 1200);
  };

  if (loadingJob) {
    return <PageLoader label="Loading application workspace..." />;
  }

  if (!job) {
    return (
      <div className="p-6 text-center max-w-lg mx-auto space-y-4">
        <Heading level="h2" className="text-3xl font-bold uppercase">Job Not Found</Heading>
        <Text className="text-foreground-secondary">The job listing you are trying to apply for does not exist or has expired.</Text>
        <BrutalButton asChild variant="secondary" className="w-full">
          <Link href="/jobs">Back to Jobs Feed</Link>
        </BrutalButton>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none text-left">
      <PageHeader
        title="Apply for Role"
        description={`Submit application details for ${job.title} at ${job.companyInfo.name}`}
      />

      <div className="grid gap-6 md:grid-cols-3">
        {/* Left 2 Columns: Application Form */}
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleApply} className="space-y-6" noValidate>
            <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-4 brutal-shadow">
              <Heading level="h3" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                1. Select Resume
              </Heading>
              
              <ErrorMessage message={error} onClose={() => setError(null)} />

              <div className="grid gap-3">
                {mockResumes.map((resume) => (
                  <button
                    key={resume.id}
                    type="button"
                    onClick={() => handleResumeSelect(resume.id)}
                    className={cn(
                      "p-4 border-[3px] border-border text-left brutal-shadow-sm flex items-center justify-between transition-all active:translate-x-0 active:translate-y-0 active:shadow-none hover:bg-surface-secondary",
                      selectedResumeId === resume.id 
                        ? "bg-foreground text-surface border-foreground" 
                        : "bg-surface text-foreground"
                    )}
                  >
                    <div>
                      <p className="font-bold text-sm">{resume.fileName}</p>
                      <p className={cn("text-xs mt-0.5", selectedResumeId === resume.id ? "text-surface-secondary" : "text-foreground-muted")}>
                        Uploaded: {resume.uploadedAt} • {resume.fileSize}
                      </p>
                    </div>
                    {selectedResumeId === resume.id && (
                      <Check className="h-5 w-5 text-primary stroke-[3px]" />
                    )}
                  </button>
                ))}
              </div>
            </BrutalCard>

            <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-4 brutal-shadow">
              <Heading level="h3" className="text-xl font-bold uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                2. AI Cover Letter
              </Heading>

              <div className="flex gap-4 border-b-2 border-border pb-3">
                <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer">
                  <input
                    type="radio"
                    name="coverLetterOption"
                    checked={coverLetterOption === "ai-generated"}
                    onChange={() => setCoverLetterOption("ai-generated")}
                    className="accent-primary"
                  />
                  AI-Generated Letter
                </label>
                <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer">
                  <input
                    type="radio"
                    name="coverLetterOption"
                    checked={coverLetterOption === "none"}
                    onChange={() => setCoverLetterOption("none")}
                    className="accent-primary"
                  />
                  Skip Cover Letter
                </label>
              </div>

              {coverLetterOption === "ai-generated" && (
                <div className="space-y-2">
                  <label htmlFor="cover-letter-text" className="font-bold text-xs uppercase text-foreground-secondary">
                    Letter Text (Editable)
                  </label>
                  <textarea
                    id="cover-letter-text"
                    value={coverLetterText}
                    onChange={(e) => setCoverLetterText(e.target.value)}
                    disabled={!selectedResumeId}
                    placeholder={selectedResumeId ? "Write your cover letter..." : "Please select a resume first to auto-generate the cover letter."}
                    rows={8}
                    className="w-full border-[3px] border-border bg-surface p-3 text-sm brutal-shadow-sm focus:outline-primary disabled:bg-surface-secondary"
                  />
                </div>
              )}
            </BrutalCard>

            <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-4 brutal-shadow">
              <Heading level="h3" className="text-xl font-bold uppercase tracking-tight">
                3. Application Notes
              </Heading>
              <div className="space-y-2">
                <label htmlFor="app-notes" className="font-bold text-xs uppercase text-foreground-secondary">
                  Private Notes (For your tracker)
                </label>
                <textarea
                  id="app-notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g., Referred by John Doe, hiring manager name, follow-up timeline..."
                  rows={3}
                  className="w-full border-[3px] border-border bg-surface p-3 text-sm brutal-shadow-sm focus:outline-primary"
                />
              </div>
            </BrutalCard>

            <div className="flex gap-4">
              <BrutalButton
                type="submit"
                disabled={isSubmitting}
                className="flex-1 h-12 uppercase font-bold text-sm tracking-wide flex items-center justify-center gap-2"
              >
                {isSubmitting && <InlineLoader />}
                Submit Application
              </BrutalButton>
              
              <BrutalButton
                type="button"
                onClick={() => router.back()}
                variant="secondary"
                className="px-6 h-12 uppercase font-bold text-sm tracking-wide"
              >
                Cancel
              </BrutalButton>
            </div>
          </form>
        </div>

        {/* Right 1 Column: Job Info Sidebar */}
        <div className="space-y-6">
          <BrutalCard className="bg-surface-secondary border-[3px] border-border p-6 space-y-4 brutal-shadow">
            <Heading level="h4" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              Role Summary
            </Heading>
            
            <div className="border-t-2 border-border/10 pt-3 space-y-3">
              <div>
                <p className="text-xs text-foreground-muted uppercase font-bold">Position</p>
                <p className="font-bold text-base">{job.title}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase font-bold">Company</p>
                <p className="font-bold">{job.companyInfo.name}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase font-bold">Location</p>
                <p className="font-bold">{job.location}</p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase font-bold">Type</p>
                <p className="font-bold text-[10px] uppercase bg-surface border-2 border-border px-2 py-0.5 inline-block brutal-shadow-sm">
                  {job.employmentType.replace("-", " ")}
                </p>
              </div>
              <div>
                <p className="text-xs text-foreground-muted uppercase font-bold">Match Score</p>
                <span className="text-xl font-black text-success">{job.trustScore}% Match</span>
              </div>
            </div>
          </BrutalCard>
        </div>
      </div>

      {/* Success Modal Dialogue */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/45 backdrop-blur-sm animate-fade-in">
          <BrutalCard className="bg-surface border-[3px] border-border p-6 max-w-md w-full text-center space-y-6 brutal-shadow-hover">
            <div className="mx-auto h-12 w-12 rounded-full border-[3px] border-border bg-success flex items-center justify-center brutal-shadow-sm">
              <Check className="h-6 w-6 text-white stroke-[3px]" />
            </div>
            
            <Heading level="h2" className="text-2xl font-black uppercase tracking-tight">
              Applied Successfully!
            </Heading>
            
            <Text className="text-foreground-secondary leading-relaxed text-sm">
              Your application packet has been registered. The opportunity was automatically added to your <strong>Applications Tracker</strong> under the <strong>Applied</strong> column.
            </Text>

            <div className="flex flex-col gap-2 pt-2">
              <BrutalButton asChild className="w-full h-11 uppercase font-bold text-xs tracking-wider">
                <Link href="/applications">View Application Tracker</Link>
              </BrutalButton>
              <BrutalButton asChild variant="secondary" className="w-full h-11 uppercase font-bold text-xs tracking-wider">
                <Link href="/jobs">Back to Jobs Feed</Link>
              </BrutalButton>
            </div>
          </BrutalCard>
        </div>
      )}
    </div>
  );
}
