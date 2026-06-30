"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  User,
  Mail,
  Code2,
  GraduationCap,
  Briefcase,
  FolderOpen,
  Award,
  MessageSquare,
  Share2,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertTriangle,
  Pencil,
  ArrowUpRight,
} from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "@/features/profile/data/experience.mock";
import { LANGUAGE_LEVEL_LABELS } from "@/features/profile/data/languages.mock";
import { SOCIAL_PLATFORM_LABELS } from "@/features/profile/data/social-links.mock";

export default function ReviewPage() {
  const {
    profile,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    socialLinks,
    preferences,
    isLoading,
    loadProfile,
  } = useProfileStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  const audit = calculateProfileCompletion(
    profile,
    skills,
    education,
    experience,
    projects,
    certifications,
    languages,
    socialLinks,
    preferences
  );

  // Score categorization (Part 8)
  let scoreCategory: "Excellent" | "Good" | "Needs Attention" = "Needs Attention";
  let categoryColor = "bg-error text-white";
  if (audit.percentage >= 85) {
    scoreCategory = "Excellent";
    categoryColor = "bg-success text-white border-success";
  } else if (audit.percentage >= 60) {
    scoreCategory = "Good";
    categoryColor = "bg-warning text-foreground border-warning";
  }

  const jumpToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 w-full max-w-4xl min-w-0 pb-12">
      {/* Back button and Page Header */}
      <div className="space-y-1">
        <Link
          href="/profile"
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          Profile Summary & Review
        </Heading>
        <Text className="text-foreground-secondary text-xs">
          Review all profile parameters and completeness scores before indexing on search matches.
        </Text>
      </div>

      {/* Completion Dashboard Card */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow flex flex-col md:flex-row gap-6 items-center">
        <div className="relative shrink-0 flex items-center justify-center" aria-label={`Profile ${audit.percentage}% complete`}>
          <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
            <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-secondary)" strokeWidth="8" />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth="8"
              strokeDasharray={2 * Math.PI * 40}
              strokeDashoffset={2 * Math.PI * 40 - (audit.percentage / 100) * 2 * Math.PI * 40}
              strokeLinecap="square"
              className="transition-all duration-700"
            />
          </svg>
          <span className="absolute text-2xl font-black text-foreground">{audit.percentage}%</span>
        </div>

        <div className="flex-1 space-y-3 text-center md:text-left min-w-0">
          <div className="flex flex-col md:flex-row items-center gap-3">
            <Heading level="h3" className="text-lg font-black uppercase">
              Profile Readiness
            </Heading>
            <span className={`px-2.5 py-0.5 border-2 border-border text-[10px] font-black uppercase rounded-sm brutal-shadow-sm ${categoryColor}`}>
              {scoreCategory}
            </span>
          </div>

          <Text className="text-foreground-secondary text-xs">
            Complete all sections to maximize your search matches matching index.
          </Text>

          {audit.missingSections.length > 0 && (
            <div className="bg-warning/10 border-2 border-warning p-4 rounded-sm text-left space-y-1.5 brutal-shadow-sm max-h-[160px] overflow-y-auto">
              <span className="text-[10px] font-black uppercase text-warning flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" />
                Missing Sections ({audit.missingSections.length})
              </span>
              <ul className="space-y-1">
                {audit.checklist.filter(c => !c.completed).map((sec) => (
                  <li key={sec.id} className="text-xs text-foreground-secondary flex items-start justify-between gap-4">
                    <span className="text-warning mt-0.5">• <strong>{sec.label}:</strong> {sec.suggestion}</span>
                    <Link href={sec.actionUrl} className="text-[9px] font-black uppercase text-primary shrink-0 hover:underline flex items-center gap-0.5">
                      Complete Now <ArrowUpRight className="h-2.5 w-2.5" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </BrutalCard>

      {/* Jump to Section Shortcuts */}
      <div className="flex flex-wrap gap-2 py-2 border-y-2 border-border/10">
        <span className="text-[10px] font-black uppercase text-foreground-muted self-center mr-1">Jump to:</span>
        <BrutalButton onClick={() => jumpToSection("personal-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Personal</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("contact-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Contact</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("skills-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Skills</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("experience-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Experience</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("education-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Education</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("projects-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Projects</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("certifications-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Certifications</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("languages-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Languages</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("social-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Social</BrutalButton>
        <BrutalButton onClick={() => jumpToSection("preferences-section")} variant="secondary" className="h-7 px-2.5 text-[9px] font-bold uppercase">Preferences</BrutalButton>
      </div>

      {/* Review Sections */}
      <div className="space-y-6">
        {/* 1. Personal & Contact */}
        <div className="grid gap-6 md:grid-cols-2">
          <BrutalCard id="personal-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-border/10 pb-2">
              <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Personal Info
              </Heading>
              <Link href="/profile/edit" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
                <Pencil className="h-3 w-3" /> Edit
              </Link>
            </div>
            <div className="text-xs space-y-1.5">
              <p><strong>First Name:</strong> {profile.personal.firstName}</p>
              <p><strong>Last Name:</strong> {profile.personal.lastName}</p>
              <p><strong>Nationality:</strong> {profile.personal.nationality || "—"}</p>
            </div>
          </BrutalCard>

          <BrutalCard id="contact-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-border/10 pb-2">
              <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Contact Details
              </Heading>
              <Link href="/profile/edit" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
                <Pencil className="h-3 w-3" /> Edit
              </Link>
            </div>
            <div className="text-xs space-y-1.5">
              <p><strong>Email:</strong> {profile.contact.email}</p>
              <p><strong>Phone:</strong> {profile.contact.phone}</p>
              <p><strong>Location:</strong> {profile.contact.city}, {profile.contact.country}</p>
            </div>
          </BrutalCard>
        </div>

        {/* 2. Skills */}
        <BrutalCard id="skills-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Skills & Expertise
            </Heading>
            <Link href="/profile/skills" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {skills.length === 0 ? (
            <p className="text-xs text-foreground-muted">No skills configured.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {skills.map((s) => (
                <span
                  key={s.id}
                  className="px-2 py-1 border border-border bg-surface-secondary text-[10px] font-extrabold uppercase rounded-sm"
                >
                  {s.name} ({s.yearsOfExperience}y exp)
                </span>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 3. Experience */}
        <BrutalCard id="experience-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-primary" />
              Work History
            </Heading>
            <Link href="/profile/experience" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {experience.length === 0 ? (
            <p className="text-xs text-foreground-muted">No work history configured.</p>
          ) : (
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="border-l-2 border-border pl-4 space-y-1 text-xs">
                  <h5 className="font-extrabold uppercase text-foreground">{exp.jobTitle}</h5>
                  <p className="text-foreground-secondary font-semibold">
                    {exp.companyName} • {exp.location} ({WORK_MODE_LABELS[exp.workMode]})
                  </p>
                  <p className="text-foreground-muted font-mono">
                    {exp.startDate} – {exp.currentPosition ? "Present" : exp.endDate}
                  </p>
                  <p className="text-foreground-secondary leading-relaxed pt-1">{exp.description}</p>
                </div>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 4. Education */}
        <BrutalCard id="education-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-primary" />
              Education History
            </Heading>
            <Link href="/profile/education" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {education.length === 0 ? (
            <p className="text-xs text-foreground-muted">No education history configured.</p>
          ) : (
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-border pl-4 space-y-0.5 text-xs">
                  <h5 className="font-extrabold uppercase text-foreground">{edu.degree}</h5>
                  <p className="text-foreground-secondary font-semibold">
                    {edu.fieldOfStudy} • {edu.institution}
                  </p>
                  <p className="text-foreground-muted font-mono">
                    {edu.startDate} – {edu.currentStudy ? "Present" : edu.endDate} • Grade: {edu.cgpa}
                  </p>
                </div>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 5. Projects */}
        <BrutalCard id="projects-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <FolderOpen className="h-4 w-4 text-primary" />
              Project Portfolio
            </Heading>
            <Link href="/profile/projects" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {projects.length === 0 ? (
            <p className="text-xs text-foreground-muted">No projects configured.</p>
          ) : (
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id} className="border-l-2 border-border pl-4 space-y-1 text-xs">
                  <h5 className="font-extrabold uppercase text-foreground">{proj.title}</h5>
                  <p className="text-foreground-secondary font-semibold">
                    Role: {proj.role} • Team size: {proj.teamSize}
                  </p>
                  <p className="text-foreground-secondary leading-relaxed">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 6. Certifications */}
        <BrutalCard id="certifications-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              Certifications
            </Heading>
            <Link href="/profile/certifications" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {certifications.length === 0 ? (
            <p className="text-xs text-foreground-muted">No certifications configured.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {certifications.map((c) => (
                <div key={c.id} className="border border-border/10 bg-surface-secondary p-3 text-xs">
                  <h5 className="font-extrabold uppercase">{c.name}</h5>
                  <p className="text-foreground-secondary">{c.issuingOrganization}</p>
                  <p className="text-foreground-muted font-mono text-[10px]">
                    Issued: {c.issueDate}
                  </p>
                </div>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 7. Languages */}
        <BrutalCard id="languages-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              Languages
            </Heading>
            <Link href="/profile/languages" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {languages.length === 0 ? (
            <p className="text-xs text-foreground-muted">No languages configured.</p>
          ) : (
            <div className="flex flex-wrap gap-3">
              {languages.map((l) => (
                <span
                  key={l.id}
                  className="px-2 py-1 border border-border bg-surface-secondary text-[10px] font-extrabold uppercase rounded-sm"
                >
                  {l.language} ({l.nativeLanguage ? "Native" : LANGUAGE_LEVEL_LABELS[l.speakingLevel]})
                </span>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 8. Social Links */}
        <BrutalCard id="social-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Share2 className="h-4 w-4 text-primary" />
              Social Profiles
            </Heading>
            <Link href="/profile/social-links" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {socialLinks.length === 0 ? (
            <p className="text-xs text-foreground-muted">No social links configured.</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-3">
              {socialLinks.map((s) => (
                <a
                  key={s.id}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border border-border/10 bg-surface-secondary p-2.5 text-xs text-center uppercase font-black hover:bg-surface-secondary/80 text-foreground-secondary"
                >
                  {SOCIAL_PLATFORM_LABELS[s.platform] || s.platform}
                </a>
              ))}
            </div>
          )}
        </BrutalCard>

        {/* 9. Career Preferences */}
        <BrutalCard id="preferences-section" className="bg-surface border-2 border-border p-5 brutal-shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-border/10 pb-2">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight flex items-center gap-2">
              <Settings className="h-4 w-4 text-primary" />
              Career Preferences
            </Heading>
            <Link href="/profile/preferences" className="text-[10px] font-black uppercase text-primary hover:underline flex items-center gap-0.5">
              <Pencil className="h-3 w-3" /> Edit
            </Link>
          </div>
          {!preferences ? (
            <p className="text-xs text-foreground-muted">No preferences configured.</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <p><strong>Preferred Role:</strong> {preferences.preferredRole}</p>
              <p><strong>Job Type:</strong> {EMPLOYMENT_TYPE_LABELS[preferences.employmentType] || preferences.employmentType}</p>
              <p><strong>Location:</strong> {preferences.preferredLocation} ({WORK_MODE_LABELS[preferences.workMode]})</p>
              <p><strong>Expected Salary:</strong> {preferences.currency} {preferences.expectedSalary}</p>
              <p><strong>Notice Period:</strong> {preferences.noticePeriod}</p>
              <p><strong>Target Industry:</strong> {preferences.preferredIndustry}</p>
              <p><strong>Shift preference:</strong> {preferences.preferredShift}</p>
              <p><strong>Relocation:</strong> {preferences.relocationWillingness ? "Yes" : "No"}</p>
            </div>
          )}
        </BrutalCard>
      </div>

      {/* Submission Control Panel */}
      <div className="bg-surface-secondary border-3 border-border p-5 rounded-md text-center space-y-4 brutal-shadow">
        <div className="space-y-1">
          <Heading level="h3" className="text-lg font-black uppercase">
            Candidate Profile Complete
          </Heading>
          <Text className="text-foreground-secondary text-xs">
            Submit profile to enable job application matcher diagnostics and live resume building.
          </Text>
        </div>

        <BrutalButton
          onClick={() => {
            alert("Profile successfully submitted for index mapping!");
          }}
          className="h-11 px-8 uppercase font-bold text-xs tracking-wider"
        >
          <CheckCircle className="h-4 w-4 mr-2 inline" />
          Submit Profile
        </BrutalButton>
      </div>
    </div>
  );
}
