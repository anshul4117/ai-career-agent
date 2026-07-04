"use client";

import React, { useState } from "react";
import { useParserStore } from "../../store/resume-parser.store";
import { useProfileStore } from "../../../profile/store/profile.store";
import { resumeParserService } from "../../services/resume-parser.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Check, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export function ReviewPanel() {
  const router = useRouter();
  const profileStore = useProfileStore();
  const { reviewState, confidenceScores, updateReviewAction, updateReviewValue, resetParserStore } = useParserStore();
  
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"personal" | "experience" | "education" | "skills" | "projects" | "meta">("personal");

  if (!reviewState || !confidenceScores) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await resumeParserService.saveAndSync(reviewState);
      alert("Successfully synchronized parsed details with your Candidate Profile and created a new Resume Workspace Draft layout!");
      resetParserStore();
      router.push("/resume");
    } catch (err) {
      alert("Failed to synchronize resume data: " + (err as Error).message);
    } finally {
      setIsSaving(false);
    }
  };

  // Confidence rating formatter
  const renderConfidenceBadge = (score: number) => {
    const isLow = score < 85;
    return (
      <span className={cn(
        "inline-flex items-center gap-1 border px-2 py-0.5 text-[9px] font-black uppercase rounded-sm brutal-shadow-xs select-none",
        isLow 
          ? "bg-amber-100 border-amber-400 text-amber-600" 
          : "bg-emerald-100 border-emerald-400 text-emerald-600"
      )}>
        {isLow ? <AlertTriangle className="h-3 w-3" /> : <Check className="h-3 w-3" />}
        Confidence: {score}% {isLow ? "(Verify)" : "(High)"}
      </span>
    );
  };

  const existingProfile = profileStore.profile;

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full select-none pb-20">
      
      {/* Tab Select Left Column (Responsive) */}
      <div className="w-full lg:w-60 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-border pb-3 lg:pb-0 lg:pr-4 select-none">
        {(["personal", "experience", "education", "skills", "projects", "meta"] as const).map((tab) => {
          const isActive = activeTab === tab;
          let score = 95;
          if (tab === "personal") score = confidenceScores.personal;
          if (tab === "experience") score = confidenceScores.experience;
          if (tab === "education") score = confidenceScores.education;
          if (tab === "skills") score = confidenceScores.skills;
          if (tab === "projects") score = confidenceScores.projects;
          if (tab === "meta") score = Math.min(confidenceScores.certifications, confidenceScores.languages);
          
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider border-2 rounded-sm transition-all whitespace-nowrap flex items-center justify-between gap-3 min-w-[120px] lg:min-w-0",
                isActive 
                  ? "bg-primary text-white border-foreground brutal-shadow-xs translate-x-[-1px] translate-y-[-1px]" 
                  : "bg-surface text-foreground border-border hover:bg-surface-secondary"
              )}
            >
              <span>{tab}</span>
              {score < 85 && (
                <ShieldAlert className="h-4 w-4 text-amber-500 fill-amber-100 shrink-0" />
              )}
            </button>
          );
        })}

        {/* Global Save Trigger */}
        <BrutalButton
          onClick={handleSave}
          disabled={isSaving}
          className="mt-auto hidden lg:flex h-11 w-full text-xs font-black uppercase brutal-shadow"
        >
          {isSaving ? "Syncing..." : "Confirm & Sync Data"}
        </BrutalButton>
      </div>

      {/* Main Review Sheet Area */}
      <div className="flex-1 space-y-6">
        
        {/* PERSONAL DETAIL TAB */}
        {activeTab === "personal" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Personal Details & Summary
                </Heading>
                <p className="text-[9px] text-foreground-secondary pt-0.5">
                  Extracted contact parameters compared against onboarding values.
                </p>
              </div>
              {renderConfidenceBadge(confidenceScores.personal)}
            </div>

            {/* Select Action */}
            <div className="flex gap-2">
              {(["accept", "ignore", "edit"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => {
                    updateReviewAction("personal", act);
                    updateReviewAction("summary", act);
                  }}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.personal.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                  )}
                >
                  {act} Extracted
                </button>
              ))}
            </div>

            {/* Displaying Values side-by-side */}
            {reviewState.personal.action === "edit" ? (
              <div className="space-y-4 pt-2 border-t border-border/10">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">First Name</label>
                    <input
                      type="text"
                      value={reviewState.personal.value.firstName}
                      onChange={(e) => updateReviewValue("personal", { ...reviewState.personal.value, firstName: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">Last Name</label>
                    <input
                      type="text"
                      value={reviewState.personal.value.lastName}
                      onChange={(e) => updateReviewValue("personal", { ...reviewState.personal.value, lastName: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">Headline</label>
                    <input
                      type="text"
                      value={reviewState.personal.value.headline}
                      onChange={(e) => updateReviewValue("personal", { ...reviewState.personal.value, headline: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">Email</label>
                    <input
                      type="text"
                      value={reviewState.personal.value.email}
                      onChange={(e) => updateReviewValue("personal", { ...reviewState.personal.value, email: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">Phone</label>
                    <input
                      type="text"
                      value={reviewState.personal.value.phone}
                      onChange={(e) => updateReviewValue("personal", { ...reviewState.personal.value, phone: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">Professional Summary</label>
                    <textarea
                      rows={4}
                      value={reviewState.summary.value.summary}
                      onChange={(e) => updateReviewValue("summary", { summary: e.target.value })}
                      className="w-full border-2 border-border bg-surface text-xs font-semibold p-2 rounded-sm"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Existing Profile */}
                <div className="p-3 border-2 border-border/10 bg-surface-secondary/5 rounded-sm">
                  <h4 className="text-[9px] font-black uppercase tracking-wider text-foreground-muted mb-2">
                    Existing Profile Data
                  </h4>
                  <div className="space-y-1.5 text-[10px] font-semibold text-foreground">
                    <p><span className="font-bold">Name:</span> {existingProfile?.personal?.firstName || "Not Set"} {existingProfile?.personal?.lastName || ""}</p>
                    <p><span className="font-bold">Headline:</span> {existingProfile?.career?.headline || "Not Set"}</p>
                    <p><span className="font-bold">Email:</span> {existingProfile?.contact?.email || "Not Set"}</p>
                    <p><span className="font-bold">Summary:</span> {existingProfile?.career?.summary || "Not Set"}</p>
                  </div>
                </div>

                {/* Right Extracted Value */}
                <div className={cn(
                  "p-3 border-2 rounded-sm",
                  reviewState.personal.action === "accept" ? "border-emerald-300 bg-emerald-50/10" : "border-border/15 opacity-60 bg-slate-50/10"
                )}>
                  <h4 className="text-[9px] font-black uppercase tracking-wider text-foreground-muted mb-2">
                    Extracted Resume Data
                  </h4>
                  <div className="space-y-1.5 text-[10px] font-semibold text-foreground">
                    <p><span className="font-bold">Name:</span> {reviewState.personal.value.firstName} {reviewState.personal.value.lastName}</p>
                    <p><span className="font-bold">Headline:</span> {reviewState.personal.value.headline}</p>
                    <p><span className="font-bold">Email:</span> {reviewState.personal.value.email}</p>
                    <p><span className="font-bold">Summary:</span> {reviewState.summary.value.summary}</p>
                  </div>
                </div>
              </div>
            )}
          </BrutalCard>
        )}

        {/* LIST TABLES COMMON VIEWS (Experience, Education, Skills, Projects) */}
        {activeTab === "experience" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Experience History ({reviewState.experience.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.experience)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("experience", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.experience.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                  )}
                >
                  {act === "accept" ? "Append Extracted Items" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.experience.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.experience.value.map((exp, idx) => (
                  <div key={exp.id || idx} className="border border-border/20 p-3 bg-slate-50/30 rounded-sm">
                    <div className="flex justify-between font-bold text-[10px] text-foreground">
                      <span className="uppercase font-black">{exp.jobTitle} — {exp.companyName}</span>
                      <span className="font-mono text-[9px]">{exp.startDate} to {exp.currentPosition ? "Present" : exp.endDate}</span>
                    </div>
                    {exp.location && <p className="text-[9px] italic text-foreground-muted">{exp.location}</p>}
                    <p className="text-[10px] leading-relaxed pt-1">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* EDUCATION */}
        {activeTab === "education" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Education Details ({reviewState.education.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.education)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("education", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.education.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                  )}
                >
                  {act === "accept" ? "Append Extracted Items" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.education.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.education.value.map((edu, idx) => (
                  <div key={edu.id || idx} className="border border-border/20 p-3 bg-slate-50/30 rounded-sm text-[10px] text-foreground">
                    <div className="flex justify-between font-bold">
                      <span>{edu.degree} in {edu.fieldOfStudy}</span>
                      <span className="font-mono text-[9px]">{edu.startDate} – {edu.endDate}</span>
                    </div>
                    <p className="pt-0.5">{edu.institution} {edu.cgpa && `• Grade: ${edu.cgpa}`}</p>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* SKILLS */}
        {activeTab === "skills" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Skills Profile ({reviewState.skills.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.skills)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("skills", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.skills.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                  )}
                >
                  {act === "accept" ? "Append Extracted Skills" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.skills.action === "accept" && (
              <div className="flex flex-wrap gap-2 pt-2">
                {reviewState.skills.value.map((s, idx) => (
                  <span 
                    key={s.id || idx} 
                    className="border border-border/20 px-2.5 py-1 bg-surface-secondary/20 rounded-sm text-[10px] font-bold text-foreground"
                  >
                    {s.name} ({s.level})
                  </span>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* PROJECTS */}
        {activeTab === "projects" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Key Projects ({reviewState.projects.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.projects)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("projects", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.projects.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                  )}
                >
                  {act === "accept" ? "Append Extracted Items" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.projects.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.projects.value.map((proj, idx) => (
                  <div key={proj.id || idx} className="border border-border/20 p-3 bg-slate-50/30 rounded-sm text-[10px] space-y-1">
                    <div className="font-bold text-primary">{proj.title} ({proj.role})</div>
                    <p className="leading-relaxed">{proj.description}</p>
                    {proj.techStack && proj.techStack.length > 0 && (
                      <p className="text-[9px] font-semibold text-foreground-muted">Stack: {proj.techStack.join(", ")}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* METADATA CERTIFICATIONS & LANGUAGES */}
        {activeTab === "meta" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading level="h3" className="text-sm font-black uppercase tracking-wider text-foreground">
                  Certifications, Languages & Socials
                </Heading>
              </div>
              {renderConfidenceBadge(Math.min(confidenceScores.certifications, confidenceScores.languages))}
            </div>

            {/* Certifications Block */}
            <div className="space-y-2 border-t border-border/10 pt-3">
              <h4 className="text-[10px] font-black uppercase text-foreground-secondary">Certifications</h4>
              <div className="flex gap-2">
                {(["accept", "ignore"] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => updateReviewAction("certifications", act)}
                    className={cn(
                      "px-2.5 py-1 border border-border text-[8px] font-black uppercase rounded-sm",
                      reviewState.certifications.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                    )}
                  >
                    {act}
                  </button>
                ))}
              </div>
              {reviewState.certifications.action === "accept" && (
                <div className="space-y-1.5 pl-2 text-[10px]">
                  {reviewState.certifications.value.map((c) => (
                    <p key={c.id}>• <span className="font-bold">{c.name}</span> ({c.issuingOrganization})</p>
                  ))}
                </div>
              )}
            </div>

            {/* Languages Block */}
            <div className="space-y-2 border-t border-border/10 pt-3">
              <h4 className="text-[10px] font-black uppercase text-foreground-secondary">Languages</h4>
              <div className="flex gap-2">
                {(["accept", "ignore"] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => updateReviewAction("languages", act)}
                    className={cn(
                      "px-2.5 py-1 border border-border text-[8px] font-black uppercase rounded-sm",
                      reviewState.languages.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                    )}
                  >
                    {act}
                  </button>
                ))}
              </div>
              {reviewState.languages.action === "accept" && (
                <div className="space-y-1.5 pl-2 text-[10px]">
                  {reviewState.languages.value.map((l) => (
                    <p key={l.id}>• {l.language} ({l.nativeLanguage ? "Native" : l.speakingLevel})</p>
                  ))}
                </div>
              )}
            </div>

            {/* Social Links Block */}
            <div className="space-y-2 border-t border-border/10 pt-3">
              <h4 className="text-[10px] font-black uppercase text-foreground-secondary">Social Networks Links</h4>
              <div className="flex gap-2">
                {(["accept", "ignore"] as const).map((act) => (
                  <button
                    key={act}
                    onClick={() => updateReviewAction("socialLinks", act)}
                    className={cn(
                      "px-2.5 py-1 border border-border text-[8px] font-black uppercase rounded-sm",
                      reviewState.socialLinks.action === act ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary border-border"
                    )}
                  >
                    {act}
                  </button>
                ))}
              </div>
              {reviewState.socialLinks.action === "accept" && (
                <div className="space-y-1.5 pl-2 text-[10px] font-mono">
                  {reviewState.socialLinks.value.map((s) => (
                    <p key={s.id}>• {s.platform}: {s.url}</p>
                  ))}
                </div>
              )}
            </div>

          </BrutalCard>
        )}

        {/* Global Save Trigger for mobile stacking */}
        <BrutalButton
          onClick={handleSave}
          disabled={isSaving}
          className="w-full lg:hidden h-11 text-xs font-black uppercase brutal-shadow"
        >
          {isSaving ? "Syncing..." : "Confirm & Sync Data"}
        </BrutalButton>

      </div>

    </div>
  );
}
