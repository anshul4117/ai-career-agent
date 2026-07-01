"use client";

import React, { useEffect } from "react";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileCompletionCard } from "@/features/profile/components/profile-completion-card";
import { MissingSections } from "@/features/profile/components/missing-sections";
import { PersonalInfoCard } from "@/features/profile/components/personal-info-card";
import { ContactInfoCard } from "@/features/profile/components/contact-info-card";
import { CareerSummaryCard } from "@/features/profile/components/career-summary-card";
import { SkillsCard } from "@/features/profile/components/skills-card";
import { EducationCard } from "@/features/profile/components/education-card";
import { ExperienceCard } from "@/features/profile/components/experience-card";
import { ProjectsCard } from "@/features/profile/components/projects-card";
import { CertificationsCard } from "@/features/profile/components/certifications-card";
import { LanguagesCard } from "@/features/profile/components/languages-card";
import { SocialLinksCard } from "@/features/profile/components/social-links-card";
import { CareerPreferenceCard } from "@/features/profile/components/career-preference-card";

import { useProfileStore } from "@/features/profile/store/profile.store";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";

export default function ProfilePage() {
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

  // Recalculate audit dynamically
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

  const completionData = {
    percentage: audit.percentage,
    sections: audit.checklist.map((c) => ({
      id: c.id,
      label: c.label,
      completed: c.completed,
    })),
  };

  return (
    <div className="space-y-6 w-full min-w-0 pb-16 max-w-6xl mx-auto">
      {/* 1. Profile Header (Avatar, Name, Headline, Location, Edit Button) */}
      <ProfileHeader profile={profile} showEdit={true} />

      {/* 2. Mobile-Only Strength & Missing Sections (highly visible at top on mobile) */}
      <div className="lg:hidden space-y-6 w-full">
        <ProfileCompletionCard completion={completionData} />
        <MissingSections missingSections={audit.missingSections} />
      </div>

      {/* 3. Two-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        
        {/* Left Column: Primary CV Feed (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6 w-full min-w-0">
          {/* About (Career Summary) */}
          <CareerSummaryCard career={profile.career} />

          {/* Work Experience */}
          <ExperienceCard experience={experience} />

          {/* Education History */}
          <EducationCard education={education} />

          {/* Portfolio Projects */}
          <ProjectsCard projects={projects} />

          {/* Skills & Expertise */}
          <SkillsCard skills={skills} />

          {/* Languages Spoken */}
          <LanguagesCard languages={languages} />

          {/* Certifications */}
          <CertificationsCard certifications={certifications} />
        </div>

        {/* Right Column: Sidebar Widgets (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6 w-full min-w-0">
          {/* Desktop-Only Strength & Missing Sections */}
          <div className="hidden lg:block space-y-6 w-full">
            <ProfileCompletionCard completion={completionData} />
            <MissingSections missingSections={audit.missingSections} />
          </div>

          {/* Personal Info details */}
          <PersonalInfoCard personal={profile.personal} />

          {/* Contact Details */}
          <ContactInfoCard contact={profile.contact} />

          {/* Social Profiles */}
          <SocialLinksCard socialLinks={socialLinks} />

          {/* Target Career Preferences */}
          <CareerPreferenceCard preferences={preferences} />
        </div>

      </div>
    </div>
  );
}
