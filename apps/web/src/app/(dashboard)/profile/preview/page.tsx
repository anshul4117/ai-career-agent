"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { PageLoader } from "@/components/ui/brand-loader";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ProfileAvatar } from "@/features/profile/components/profile-avatar";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";
import { 
  ArrowLeft, Mail, Phone, MapPin, Download, Send, 
  Briefcase, Star, GraduationCap, Code2, Award, 
  MessageSquare, Settings, ExternalLink, FolderOpen
} from "lucide-react";

import { SOCIAL_PLATFORM_LABELS } from "@/features/profile/data/social-links.mock";
import { LANGUAGE_LEVEL_LABELS } from "@/features/profile/data/languages.mock";
import { WORK_MODE_LABELS, EMPLOYMENT_TYPE_LABELS } from "@/features/profile/data/experience.mock";
import { AVAILABILITY_LABELS } from "@/features/profile/data/profile.mock";

export default function ProfilePreviewPage() {
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
    return <PageLoader label="Generating profile preview sheet..." />;
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

  const fullName = `${profile.personal.firstName} ${profile.personal.lastName}`;
  const availabilityInfo = AVAILABILITY_LABELS[profile.availability];

  return (
    <div className="space-y-6 w-full min-w-0 pb-16">
      
      {/* Top Banner Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-surface border-3 border-border p-4 brutal-shadow">
        <Link
          href="/profile"
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Overview
        </Link>
        <div className="flex gap-2">
          <BrutalButton
            onClick={() => window.print()}
            variant="secondary"
            className="h-9 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export PDF
          </BrutalButton>
          <BrutalButton
            onClick={() => window.location.href = `mailto:${profile.contact.email}`}
            className="h-9 px-4 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Send className="h-3.5 w-3.5" />
            Contact Candidate
          </BrutalButton>
        </div>
      </div>

      {/* Recruiter Header Profile Summary */}
      <BrutalCard className="bg-surface border-3 border-border p-6 md:p-8 brutal-shadow flex flex-col md:flex-row gap-6 items-center md:items-start text-center md:text-left">
        <ProfileAvatar url={profile.avatar.url} initials={profile.avatar.initials} size="lg" className="shrink-0" />
        
        <div className="flex-1 space-y-4 min-w-0">
          <div className="space-y-1.5">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                {fullName}
              </Heading>
              <span className={`px-2 py-0.5 border-2 border-border font-black uppercase text-[10px] brutal-shadow-sm ${
                availabilityInfo.color === "success" ? "bg-success text-white" : "bg-warning text-white"
              }`}>
                {availabilityInfo.label}
              </span>
            </div>
            <Text className="text-foreground-secondary text-sm font-semibold leading-normal">
              {profile.career.headline}
            </Text>
          </div>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-foreground-secondary font-medium">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {profile.contact.city}, {profile.contact.country}
            </span>
            <span className="flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {profile.contact.email}
            </span>
            <span className="flex items-center gap-1">
              <Phone className="h-3.5 w-3.5" />
              {profile.contact.phone}
            </span>
          </div>

          {/* Social connections */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
              {socialLinks.map((soc) => (
                <a
                  key={soc.id}
                  href={soc.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 border-2 border-border bg-surface-secondary text-[9px] font-black uppercase rounded-sm hover:bg-surface-secondary/80 flex items-center gap-1"
                >
                  {SOCIAL_PLATFORM_LABELS[soc.platform] || soc.platform}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Profile Audit Stats (Visible to recruiters) */}
        <div className="shrink-0 border-2 border-border p-4 bg-surface-secondary/20 text-center space-y-1 brutal-shadow-sm w-40">
          <p className="text-[10px] font-black uppercase text-foreground-muted">Profile Strength</p>
          <p className="text-3xl font-black text-foreground">{audit.percentage}%</p>
          <span className="text-[9px] font-black uppercase bg-success text-white px-2 py-0.5 border border-border inline-block rounded-sm">
            Verified Match
          </span>
        </div>
      </BrutalCard>

      {/* Main Multi-Column View Grid */}
      <div className="grid gap-6 lg:grid-cols-3 w-full min-w-0">
        
        {/* Left Side: Professional History (2/3 Column) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Career Summary */}
          {profile.career.summary && (
            <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
              <div className="space-y-3">
                <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Professional Summary
                </Heading>
                <Text className="text-foreground-secondary text-sm leading-relaxed">
                  {profile.career.summary}
                </Text>
              </div>
            </BrutalCard>
          )}

          {/* Work Experience */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-5">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <Briefcase className="h-5 w-5 text-primary" />
                Professional Experience
              </Heading>

              {experience.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No work history provided.</p>
              ) : (
                <div className="relative border-l-2 border-border pl-6 ml-2 space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative space-y-1.5 text-xs">
                      {/* Timeline dot */}
                      <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-border bg-surface shrink-0" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="font-extrabold uppercase text-sm text-foreground">{exp.jobTitle}</h4>
                        <span className="font-mono text-[10px] font-black uppercase text-foreground-secondary bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm self-start sm:self-center">
                          {exp.startDate} – {exp.currentPosition ? "Present" : exp.endDate}
                        </span>
                      </div>
                      <p className="text-foreground-secondary font-semibold">
                        {exp.companyName} • {exp.location} ({WORK_MODE_LABELS[exp.workMode]})
                      </p>
                      {exp.description && (
                        <p className="text-foreground-secondary leading-relaxed pt-1 text-[11px]">{exp.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Education */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-5">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <GraduationCap className="h-5 w-5 text-primary" />
                Education History
              </Heading>

              {education.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No education records provided.</p>
              ) : (
                <div className="relative border-l-2 border-border pl-6 ml-2 space-y-6">
                  {education.map((edu) => (
                    <div key={edu.id} className="relative space-y-1.5 text-xs">
                      <span className="absolute -left-[31px] top-1.5 h-3 w-3 rounded-full border-2 border-border bg-surface shrink-0" />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <h4 className="font-extrabold uppercase text-sm text-foreground">{edu.degree}</h4>
                        <span className="font-mono text-[10px] font-black uppercase text-foreground-secondary bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm self-start sm:self-center">
                          {edu.startDate} – {edu.currentStudy ? "Present" : edu.endDate}
                        </span>
                      </div>
                      <p className="text-foreground-secondary font-semibold">
                        {edu.fieldOfStudy} • {edu.institution} {edu.cgpa ? `(GPA: ${edu.cgpa})` : ""}
                      </p>
                      {edu.description && (
                        <p className="text-foreground-secondary leading-relaxed pt-1 text-[11px]">{edu.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Portfolio Projects */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-4">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <FolderOpen className="h-5 w-5 text-primary" />
                Key Projects & Repositories
              </Heading>

              {projects.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No projects listed.</p>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {projects.map((proj) => (
                    <div key={proj.id} className="border-2 border-border p-4 rounded-sm bg-surface-secondary/20 flex flex-col justify-between gap-3">
                      <div className="space-y-1.5 text-xs">
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold uppercase text-foreground truncate">{proj.title}</h4>
                          {proj.featured && (
                            <Star className="h-3.5 w-3.5 fill-warning text-warning shrink-0" />
                          )}
                        </div>
                        <p className="text-foreground-secondary font-semibold leading-normal">
                          Role: {proj.role} • Size: {proj.teamSize}
                        </p>
                        <p className="text-foreground-secondary text-[11px] leading-relaxed line-clamp-3">
                          {proj.description}
                        </p>
                      </div>

                      {proj.techStack.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {proj.techStack.map((tech, i) => (
                            <span key={i} className="px-1.5 py-0.5 border border-border text-[8px] font-bold uppercase bg-surface">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

        </div>

        {/* Right Side: Skill Tags, Certs, Preferences (1/3 Column) */}
        <div className="space-y-6">
          
          {/* Skills & Expertise */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-4">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <Code2 className="h-5 w-5 text-primary" />
                Skills & Tech Stack
              </Heading>

              {skills.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No skills tag added.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill) => (
                    <div
                      key={skill.id}
                      className="px-2.5 py-1 border-2 border-border bg-surface-secondary text-[10px] font-extrabold uppercase rounded-sm flex items-center gap-1 brutal-shadow-sm"
                    >
                      {skill.featured && <Star className="h-3 w-3 fill-warning text-warning shrink-0" />}
                      <span>{skill.name}</span>
                      <span className="text-foreground-muted text-[8px] font-bold">({skill.yearsOfExperience}y)</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Certifications */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-4">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <Award className="h-5 w-5 text-primary" />
                Certifications
              </Heading>

              {certifications.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No certs configured.</p>
              ) : (
                <div className="space-y-3">
                  {certifications.map((c) => (
                    <div key={c.id} className="border-b border-border/10 pb-2.5 last:border-0 last:pb-0 space-y-0.5 text-xs">
                      <h4 className="font-extrabold uppercase text-foreground">{c.name}</h4>
                      <p className="text-foreground-secondary font-medium">{c.issuingOrganization}</p>
                      <p className="text-foreground-muted font-mono text-[9px]">
                        Issued: {c.issueDate} {c.neverExpires ? "" : `• Expires: ${c.expiryDate}`}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Languages */}
          <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
            <div className="space-y-4">
              <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                <MessageSquare className="h-5 w-5 text-primary" />
                Languages Spoken
              </Heading>

              {languages.length === 0 ? (
                <p className="text-xs text-foreground-muted text-center py-4">No languages listed.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {languages.map((l) => (
                    <span
                      key={l.id}
                      className="px-2.5 py-1 border-2 border-border bg-surface-secondary text-[10px] font-black uppercase rounded-sm"
                    >
                      {l.language} ({l.nativeLanguage ? "Native" : LANGUAGE_LEVEL_LABELS[l.speakingLevel] || l.speakingLevel})
                    </span>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* Career Target & Preferences */}
          {preferences && (
            <BrutalCard className="bg-surface border-3 border-border p-6 brutal-shadow">
              <div className="space-y-4">
                <Heading level="h3" className="text-base font-black uppercase tracking-tight flex items-center gap-2 pb-2 border-b-2 border-border/10">
                  <Settings className="h-5 w-5 text-primary" />
                  Target Preferences
                </Heading>

                <div className="space-y-2 text-xs">
                  <p><strong>Target Role:</strong> {preferences.preferredRole}</p>
                  <p><strong>Job Type:</strong> {EMPLOYMENT_TYPE_LABELS[preferences.employmentType] || preferences.employmentType}</p>
                  <p><strong>Work Mode:</strong> {WORK_MODE_LABELS[preferences.workMode]} ({preferences.preferredLocation})</p>
                  <p><strong>Expected Compensation:</strong> {preferences.currency} {preferences.expectedSalary}</p>
                  <p><strong>Notice Period:</strong> {preferences.noticePeriod}</p>
                  <p><strong>Willing to relocate:</strong> {preferences.relocationWillingness ? "Yes" : "No"}</p>
                  <p><strong>Visa sponsorship required:</strong> {preferences.visaSponsorshipRequired ? "Yes" : "No"}</p>
                </div>
              </div>
            </BrutalCard>
          )}

        </div>

      </div>

    </div>
  );
}
