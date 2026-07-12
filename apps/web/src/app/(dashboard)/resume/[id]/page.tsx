"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { ResumePreviewSkeleton } from "@/components/ui/skeleton-loaders";
import { Skeleton } from "@/components/ui/skeleton";
import { MOCK_TEMPLATES } from "@/features/resume/services/resume.service";
import { 
  ArrowLeft, Printer, Share2, Copy, Pencil 
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function ResumePreviewPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();

  // Stores
  const { currentResume, isLoading, loadResume, duplicateResume } = useResumeStore();
  const { 
    profile, loadProfile, skills, education, experience, projects, certifications, languages 
  } = useProfileStore();

  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    loadResume(id);
    loadProfile();
  }, [id, loadResume, loadProfile]);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleDuplicate = async () => {
    if (!currentResume) return;
    try {
      const copy = await duplicateResume(currentResume.id);
      showToastMsg(`Duplicated to "${copy.title}"!`);
      setTimeout(() => router.push(`/resume/${copy.id}`), 1000);
    } catch {
      showToastMsg("Failed to duplicate resume.");
    }
  };

  const handleShare = () => {
    if (typeof window === "undefined") return;
    navigator.clipboard.writeText(window.location.href);
    showToastMsg("Link copied to clipboard! (Mock share)");
  };

  const handlePrint = () => {
    if (typeof window === "undefined") return;
    window.print();
  };

  if (isLoading || !currentResume || !profile) {
    return (
      <div className="space-y-6 pb-16 w-full min-w-0">
        <div className="flex justify-between items-center border-b-3 border-border pb-5">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10" />
            <div className="space-y-1">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
          </div>
        </div>
        <ResumePreviewSkeleton />
      </div>
    );
  }

  const template = MOCK_TEMPLATES.find((t) => t.id === currentResume.templateId) || MOCK_TEMPLATES[0];

  return (
    <div className="space-y-6 pb-16 w-full min-w-0">
      {/* Print CSS Injection */}
      <style jsx global>{`
        @media print {
          /* Hide sidebar, top navigation, page headers and toolbars */
          header, aside, .no-print, nav, footer, button, a {
            display: none !important;
          }
          main {
            padding: 0 !important;
            margin: 0 !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .printable-resume-container {
            border: none !important;
            box-shadow: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
        }
      `}</style>

      {/* Toast Alert */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 bg-success border-2 border-border p-3 text-white font-extrabold uppercase text-xs brutal-shadow" role="alert">
          {toast}
        </div>
      )}

      {/* Page Toolbar (Hidden on print) */}
      <div className="no-print flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-3 border-border pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/resume"
            className="p-2 border-[3px] border-border bg-surface brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow transition-all"
            aria-label="Back to resumes dashboard"
          >
            <ArrowLeft className="h-4.5 w-4.5" />
          </Link>
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Heading level="h2" className="text-xl font-black uppercase tracking-tight truncate max-w-[250px] md:max-w-md">
                {currentResume.title}
              </Heading>
              {currentResume.isDefault && (
                <span className="px-1.5 py-0.2 bg-success text-white border border-border text-[8px] font-black uppercase">
                  Primary
                </span>
              )}
            </div>
            <p className="text-[10px] text-foreground-secondary uppercase font-extrabold">
              Format: <span className="text-primary">{template.name}</span> • ATS Ready: <span className="text-success">{currentResume.atsScore}%</span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 shrink-0">
          <BrutalButton onClick={handlePrint} variant="secondary" className="h-9 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Printer className="h-4 w-4" />
            Print / PDF
          </BrutalButton>
          <BrutalButton onClick={handleShare} variant="secondary" className="h-9 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Share2 className="h-4 w-4" />
            Share
          </BrutalButton>
          <BrutalButton onClick={handleDuplicate} variant="secondary" className="h-9 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Copy className="h-4 w-4" />
            Duplicate
          </BrutalButton>
          <BrutalButton asChild className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Link href={`/resume/${currentResume.id}/edit`}>
              <Pencil className="h-4 w-4" />
              Edit Settings
            </Link>
          </BrutalButton>
        </div>
      </div>

      {/* Resume Canvas printable wrapper */}
      <div className="flex justify-center w-full min-w-0">
        <BrutalCard className="printable-resume-container bg-white text-black border-3 border-foreground brutal-shadow w-full max-w-4xl p-8 sm:p-12 min-h-[1050px] overflow-hidden">
          {/* RENDER TEMPLATES */}
          
          {/* 1. CLASSIC TEMPLATE */}
          {currentResume.templateId === "classic" && (
            <div className="font-serif space-y-6 text-sm text-gray-800">
              {/* Centered Classic Header */}
              <div className="text-center space-y-2 border-b-2 border-black pb-4">
                <h1 className="text-3xl font-bold tracking-tight text-black uppercase">
                  {profile.personal.firstName} {profile.personal.lastName}
                </h1>
                <p className="italic text-xs font-semibold text-gray-600 dark:text-foreground-muted tracking-wide">
                  {profile.career.headline}
                </p>
                <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600 dark:text-foreground-muted">
                  <span>{profile.contact.phone}</span>
                  <span>•</span>
                  <span>{profile.contact.email}</span>
                  <span>•</span>
                  <span>{profile.contact.city}, {profile.contact.country}</span>
                </div>
              </div>

              {/* Summary */}
              {profile.career.summary && (
                <div className="space-y-1.5">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-300 pb-0.5">Professional Summary</h3>
                  <p className="leading-relaxed text-xs">{profile.career.summary}</p>
                </div>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-300 pb-0.5">Experience History</h3>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between font-bold text-xs text-black">
                          <span>{exp.jobTitle} — {exp.companyName}</span>
                          <span className="font-normal text-gray-600 dark:text-foreground-muted font-mono text-[10px]">
                            {exp.startDate} to {exp.currentPosition ? "Present" : exp.endDate}
                          </span>
                        </div>
                        <p className="text-[11px] italic text-gray-600 dark:text-foreground-muted">{exp.location}</p>
                        {exp.description && <p className="leading-relaxed text-xs text-gray-700 dark:text-foreground-secondary">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-300 pb-0.5">Education</h3>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <div className="flex justify-between font-bold text-black">
                          <span>{edu.degree} in {edu.fieldOfStudy}</span>
                          <span className="font-normal text-gray-600 dark:text-foreground-muted font-mono text-[10px]">
                            {edu.startDate} – {edu.currentStudy ? "Present" : edu.endDate}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-foreground-secondary">{edu.institution} • Grade: {edu.cgpa}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-300 pb-0.5">Portfolio & Projects</h3>
                  <div className="space-y-2">
                    {projects.map((proj) => (
                      <div key={proj.id} className="text-xs space-y-0.5">
                        <div className="font-bold text-black">{proj.title} ({proj.role})</div>
                        <p className="text-gray-700 dark:text-foreground-secondary leading-relaxed">{proj.description}</p>
                        {proj.techStack.length > 0 && (
                          <p className="text-[11px] text-gray-600 dark:text-foreground-muted font-semibold">Tech stack: {proj.techStack.join(", ")}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-bold text-xs uppercase tracking-widest text-black border-b border-gray-300 pb-0.5">Skills</h3>
                  <p className="text-xs leading-relaxed text-gray-700 dark:text-foreground-secondary">
                    {skills.map((s) => `${s.name} (${s.yearsOfExperience} yrs)`).join(", ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 2. MODERN TEMPLATE */}
          {currentResume.templateId === "modern" && (
            <div className="font-sans space-y-6 text-xs text-slate-700 dark:text-foreground-secondary">
              {/* Modern Split Header */}
              <div className="flex justify-between items-start gap-4 border-b-2 border-primary pb-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                    {profile.personal.firstName} {profile.personal.lastName}
                  </h1>
                  <p className="text-sm font-bold text-primary tracking-wide">
                    {profile.career.headline}
                  </p>
                </div>
                <div className="text-right space-y-0.5 font-mono text-[10px] text-slate-500">
                  <p>{profile.contact.phone}</p>
                  <p>{profile.contact.email}</p>
                  <p>{profile.contact.city}, {profile.contact.country}</p>
                </div>
              </div>

              {/* Layout split: 1/3 sidebar on left, 2/3 main on right */}
              <div className="grid grid-cols-3 gap-6 items-start">
                
                {/* Left side */}
                <div className="col-span-1 space-y-5 border-r border-slate-200 dark:border-border pr-5">
                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs border-b border-slate-200 dark:border-border pb-1">Expertise</h3>
                      <div className="flex flex-wrap gap-1">
                        {skills.map((s) => (
                          <span key={s.id} className="px-2 py-0.5 bg-slate-100 dark:bg-surface-hover text-slate-700 dark:text-foreground-secondary font-bold rounded-sm text-[9px] uppercase border border-slate-200 dark:border-border">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Languages */}
                  {languages.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs border-b border-slate-200 dark:border-border pb-1">Languages</h3>
                      <ul className="space-y-1">
                        {languages.map((l) => (
                          <li key={l.id} className="font-semibold text-slate-700 dark:text-foreground-secondary">
                            {l.language} ({l.nativeLanguage ? "Native" : l.speakingLevel})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Certifications */}
                  {certifications.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs border-b border-slate-200 dark:border-border pb-1">Certifications</h3>
                      <ul className="space-y-2 text-[10px]">
                        {certifications.map((c) => (
                          <li key={c.id} className="space-y-0.5">
                            <p className="font-bold text-slate-800 uppercase">{c.name}</p>
                            <p className="text-slate-500">{c.issuingOrganization}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Right side */}
                <div className="col-span-2 space-y-5">
                  {/* Summary */}
                  {profile.career.summary && (
                    <p className="leading-relaxed text-slate-600 dark:text-foreground-muted italic">{profile.career.summary}</p>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs border-b border-slate-200 dark:border-border pb-1">Professional Experience</h3>
                      <div className="space-y-3">
                        {experience.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between items-center font-bold text-slate-800">
                              <span>{exp.jobTitle}</span>
                              <span className="font-mono text-[10px] text-slate-500 font-normal">{exp.startDate} - {exp.currentPosition ? "Present" : exp.endDate}</span>
                            </div>
                            <p className="text-[10px] text-primary font-bold">{exp.companyName} • {exp.location}</p>
                            {exp.description && <p className="leading-relaxed text-slate-600 dark:text-foreground-muted">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold uppercase tracking-wider text-slate-900 text-xs border-b border-slate-200 dark:border-border pb-1">Education</h3>
                      <div className="space-y-2">
                        {education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5">
                            <div className="flex justify-between items-center font-bold text-slate-800">
                              <span>{edu.degree}</span>
                              <span className="font-mono text-[10px] text-slate-500 font-normal">{edu.startDate} – {edu.endDate}</span>
                            </div>
                            <p className="text-slate-600 dark:text-foreground-muted">{edu.institution} • GPA: {edu.cgpa}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 3. MINIMAL TEMPLATE */}
          {currentResume.templateId === "minimal" && (
            <div className="font-sans space-y-5 text-xs text-slate-600 dark:text-foreground-muted leading-relaxed max-w-3xl mx-auto">
              {/* Minimal Header */}
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <h1 className="text-2xl font-bold text-slate-900">
                  {profile.personal.firstName} {profile.personal.lastName}
                </h1>
                <p className="text-xs text-slate-500 font-semibold">{profile.career.headline}</p>
                <div className="flex gap-3 text-[10px] text-slate-400 font-mono pt-1">
                  <span>{profile.contact.email}</span>
                  <span>|</span>
                  <span>{profile.contact.phone}</span>
                  <span>|</span>
                  <span>{profile.contact.city}, {profile.contact.country}</span>
                </div>
              </div>

              {/* Summary */}
              {profile.career.summary && <p className="text-slate-500">{profile.career.summary}</p>}

              {/* Experience */}
              {experience.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-widest">Experience</h3>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between font-bold text-slate-800 text-[11px]">
                          <span>{exp.jobTitle} at {exp.companyName}</span>
                          <span className="font-normal font-mono text-[9px] text-slate-400">{exp.startDate} - {exp.currentPosition ? "Present" : exp.endDate}</span>
                        </div>
                        {exp.description && <p className="text-slate-500">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-widest">Education</h3>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-800">{edu.degree} in {edu.fieldOfStudy}</p>
                          <p className="text-slate-500">{edu.institution} • Grade: {edu.cgpa}</p>
                        </div>
                        <span className="font-mono text-[9px] text-slate-400">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-[10px] uppercase tracking-widest">Skills</h3>
                  <p className="text-slate-500 text-[11px]">
                    {skills.map((s) => s.name).join(" • ")}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 4. PROFESSIONAL TEMPLATE */}
          {currentResume.templateId === "professional" && (
            <div className="font-sans space-y-6 text-xs text-slate-700 dark:text-foreground-secondary">
              {/* Professional Dark Header Band */}
              <div className="bg-[#1e293b] text-white p-6 -mx-8 sm:-mx-12 -mt-8 sm:-mt-12 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-wider uppercase text-white">
                    {profile.personal.firstName} {profile.personal.lastName}
                  </h1>
                  <p className="text-xs text-slate-300 font-semibold tracking-wider uppercase">
                    {profile.career.headline}
                  </p>
                </div>
                <div className="text-[10px] font-mono text-slate-300 space-y-0.5">
                  <p>Email: {profile.contact.email}</p>
                  <p>Phone: {profile.contact.phone}</p>
                  <p>Loc: {profile.contact.city}, {profile.contact.country}</p>
                </div>
              </div>

              {/* Double Column Layout */}
              <div className="grid grid-cols-3 gap-6">
                
                {/* Left Column (2/3 width for Experience, Projects) */}
                <div className="col-span-2 space-y-5">
                  {/* Summary */}
                  {profile.career.summary && (
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-xs border-b-2 border-slate-300 dark:border-border-secondary pb-1 uppercase tracking-wider">Executive Statement</h3>
                      <p className="leading-relaxed">{profile.career.summary}</p>
                    </div>
                  )}

                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900 text-xs border-b-2 border-slate-300 dark:border-border-secondary pb-1 uppercase tracking-wider">Professional History</h3>
                      <div className="space-y-3">
                        {experience.map((exp) => (
                          <div key={exp.id} className="space-y-1">
                            <div className="flex justify-between font-bold text-slate-800">
                              <span>{exp.jobTitle}</span>
                              <span className="font-mono text-[9px] text-slate-500 font-normal">{exp.startDate} - {exp.currentPosition ? "Present" : exp.endDate}</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-bold">{exp.companyName} • {exp.location}</p>
                            {exp.description && <p className="leading-relaxed text-slate-600 dark:text-foreground-muted">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-bold text-slate-900 text-xs border-b-2 border-slate-300 dark:border-border-secondary pb-1 uppercase tracking-wider">Key Projects</h3>
                      <div className="space-y-2">
                        {projects.map((proj) => (
                          <div key={proj.id} className="space-y-1">
                            <p className="font-bold text-slate-800">{proj.title} — {proj.role}</p>
                            <p className="text-slate-600 dark:text-foreground-muted">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Column (1/3 width for Education, Skills) */}
                <div className="col-span-1 space-y-5">
                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-xs border-b-2 border-slate-300 dark:border-border-secondary pb-1 uppercase tracking-wider">Core Skills</h3>
                      <ul className="space-y-1 text-slate-600 dark:text-foreground-muted">
                        {skills.map((s) => (
                          <li key={s.id} className="flex justify-between font-semibold">
                            <span>{s.name}</span>
                            <span className="font-mono text-[9px] text-slate-400">({s.yearsOfExperience}y)</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-bold text-slate-900 text-xs border-b-2 border-slate-300 dark:border-border-secondary pb-1 uppercase tracking-wider">Education</h3>
                      <div className="space-y-2 text-slate-600 dark:text-foreground-muted">
                        {education.map((edu) => (
                          <div key={edu.id} className="space-y-0.5">
                            <p className="font-bold text-slate-800">{edu.degree}</p>
                            <p className="text-[10px] text-slate-500 leading-tight">{edu.institution}</p>
                            <p className="font-mono text-[9px] text-slate-400">{edu.startDate} – {edu.endDate}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* 5. DEVELOPER TEMPLATE */}
          {currentResume.templateId === "developer" && (
            <div className="font-mono space-y-6 text-xs text-[#0f172a] leading-relaxed">
              {/* Code block header look */}
              <div className="border-3 border-foreground p-5 bg-slate-50 dark:bg-surface-secondary space-y-3 rounded-sm brutal-shadow-sm">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground-secondary border-b border-border pb-2">
                  <span className="h-3 w-3 bg-[#ff5f56] rounded-full border border-black/20" />
                  <span className="h-3 w-3 bg-[#ffbd2e] rounded-full border border-black/20" />
                  <span className="h-3 w-3 bg-[#27c93f] rounded-full border border-black/20" />
                  <span className="font-mono text-[10px] ml-2 text-foreground-muted">~/candidate-profile.json</span>
                </div>
                <div className="space-y-1">
                  <h1 className="text-2xl font-black uppercase text-foreground">
                    {profile.personal.firstName} {profile.personal.lastName}
                  </h1>
                  <p className="text-xs text-primary font-black uppercase">{`const role = "${profile.career.headline}";`}</p>
                  <div className="text-[10px] text-slate-500 font-mono space-y-0.5 pt-1">
                    <p>{`contact: { email: "${profile.contact.email}", phone: "${profile.contact.phone}" }`}</p>
                    <p>{`location: "${profile.contact.city}, ${profile.contact.country}"`}</p>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-black text-xs uppercase tracking-wider text-[#0f172a] border-b-2 border-foreground pb-0.5">{`# Core Tech Stack`}</h3>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {skills.map((s) => (
                      <span key={s.id} className="px-2 py-1 border border-foreground bg-slate-100 dark:bg-surface-hover text-[10px] font-bold uppercase rounded-sm">
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Experience */}
              {experience.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-black text-xs uppercase tracking-wider text-[#0f172a] border-b-2 border-foreground pb-0.5">{`# Work Experience`}</h3>
                  <div className="space-y-3">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{`[${exp.jobTitle}] @ ${exp.companyName}`}</span>
                          <span className="font-mono text-[10px] text-slate-400 font-normal">{exp.startDate} - {exp.currentPosition ? "Present" : exp.endDate}</span>
                        </div>
                        {exp.description && <p className="text-slate-600 dark:text-foreground-muted">{exp.description}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {education.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-black text-xs uppercase tracking-wider text-[#0f172a] border-b-2 border-foreground pb-0.5">{`# Education`}</h3>
                  <div className="space-y-2">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{edu.degree} in {edu.fieldOfStudy}</span>
                          <span className="font-mono text-[9px] text-slate-400 font-normal">{edu.startDate} – {edu.endDate}</span>
                        </div>
                        <p className="text-slate-500">{edu.institution} • GPA: {edu.cgpa}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 6. CREATIVE TEMPLATE */}
          {currentResume.templateId === "creative" && (
            <div className="font-sans space-y-6 text-xs text-foreground leading-relaxed">
              {/* Creative Brutalist header */}
              <div className="border-3 border-foreground bg-[#ffde4d] p-6 brutal-shadow-sm rounded-sm space-y-2 text-center md:text-left flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h1 className="text-3xl font-black uppercase tracking-wider text-black">
                    {profile.personal.firstName} {profile.personal.lastName}
                  </h1>
                  <div className="inline-block px-2.5 py-0.5 border-2 border-black bg-white text-[10px] font-black uppercase brutal-shadow-xs">
                    {profile.career.headline}
                  </div>
                </div>
                <div className="text-xs font-black uppercase font-mono bg-white border-2 border-black p-3 rounded-sm brutal-shadow-xs space-y-0.5">
                  <p>{profile.contact.phone}</p>
                  <p>{profile.contact.email}</p>
                  <p>{profile.contact.city}, {profile.contact.country}</p>
                </div>
              </div>

              {/* Summary */}
              {profile.career.summary && (
                <div className="border-3 border-foreground p-4 bg-white rounded-sm brutal-shadow-sm space-y-1.5">
                  <Heading level="h4" className="text-xs font-black uppercase tracking-wider text-black">
                    About Me
                  </Heading>
                  <p className="font-semibold text-foreground-secondary">{profile.career.summary}</p>
                </div>
              )}

              {/* Grid: Left Feed, Right Sidebar */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                
                {/* Left Feed */}
                <div className="md:col-span-2 space-y-6">
                  {/* Experience */}
                  {experience.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-black text-sm uppercase tracking-wider text-black border-b-3 border-foreground pb-1">Experience</h3>
                      <div className="space-y-4">
                        {experience.map((exp) => (
                          <div key={exp.id} className="border-2 border-foreground p-4 rounded-sm bg-white brutal-shadow-sm space-y-1">
                            <div className="flex justify-between font-black uppercase text-xs text-black">
                              <span>{exp.jobTitle}</span>
                              <span className="font-mono text-[9px] opacity-60">{exp.startDate} - {exp.currentPosition ? "Present" : exp.endDate}</span>
                            </div>
                            <p className="text-[10px] font-extrabold uppercase text-primary">{exp.companyName} • {exp.location}</p>
                            {exp.description && <p className="text-foreground-secondary leading-relaxed pt-1">{exp.description}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Projects */}
                  {projects.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-black text-sm uppercase tracking-wider text-black border-b-3 border-foreground pb-1">Key Projects</h3>
                      <div className="space-y-3">
                        {projects.map((proj) => (
                          <div key={proj.id} className="border-2 border-foreground p-4 rounded-sm bg-white brutal-shadow-sm space-y-1">
                            <h5 className="font-black uppercase text-xs">{proj.title} ({proj.role})</h5>
                            <p className="text-foreground-secondary leading-relaxed">{proj.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Right Sidebar */}
                <div className="md:col-span-1 space-y-6">
                  {/* Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-black text-sm uppercase tracking-wider text-black border-b-3 border-foreground pb-1">Tech Stack</h3>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {skills.map((s) => (
                          <span key={s.id} className="px-2 py-1 border-2 border-foreground bg-[#ffde4d]/20 text-[9px] font-black uppercase rounded-sm">
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Education */}
                  {education.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="font-black text-sm uppercase tracking-wider text-black border-b-3 border-foreground pb-1">Education</h3>
                      <div className="space-y-3">
                        {education.map((edu) => (
                          <div key={edu.id} className="border-2 border-foreground p-3 rounded-sm bg-white brutal-shadow-sm space-y-1">
                            <p className="font-black uppercase text-[10px] text-black">{edu.degree}</p>
                            <p className="text-foreground-secondary leading-none">{edu.institution}</p>
                            <p className="font-mono text-[9px] opacity-60 pt-0.5">{edu.startDate} – {edu.endDate}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </BrutalCard>
      </div>
    </div>
  );
}
