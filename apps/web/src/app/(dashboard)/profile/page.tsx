"use client";

import React, { useEffect, useState } from "react";
import { ProfileHeader } from "@/features/profile/components/profile-header";
import { ProfileCompletionCard } from "@/features/profile/components/profile-completion-card";
import { PersonalInfoCard } from "@/features/profile/components/personal-info-card";
import { ContactInfoCard } from "@/features/profile/components/contact-info-card";
import { CareerSummaryCard } from "@/features/profile/components/career-summary-card";
import { QuickStatsCard } from "@/features/profile/components/quick-stats-card";
import { QuickActionsCard } from "@/features/profile/components/quick-actions-card";
import { SkillsCard } from "@/features/profile/components/skills-card";
import { EducationCard } from "@/features/profile/components/education-card";
import { ExperienceCard } from "@/features/profile/components/experience-card";
import { ProjectsCard } from "@/features/profile/components/projects-card";
import { CertificationsCard } from "@/features/profile/components/certifications-card";
import { LanguagesCard } from "@/features/profile/components/languages-card";
import { SocialLinksCard } from "@/features/profile/components/social-links-card";
import { CareerPreferenceCard } from "@/features/profile/components/career-preference-card";

import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { SkillForm } from "@/features/profile/components/skill-form";
import { EducationForm } from "@/features/profile/components/education-form";
import { ExperienceForm } from "@/features/profile/components/experience-form";
import { ProjectForm } from "@/features/profile/components/project-form";
import { CertificationForm } from "@/features/profile/components/certification-form";
import { LanguageForm } from "@/features/profile/components/language-form";
import { SocialLinkForm } from "@/features/profile/components/social-link-form";
import { CareerPreferenceForm } from "@/features/profile/components/career-preference-form";

import { useProfileStore } from "@/features/profile/store/profile.store";

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
    addSkill, 
    addEducation,
    addExperience,
    addProject,
    addCertification,
    addLanguage,
    addSocialLink,
    updatePreferences
  } = useProfileStore();

  const [isSkillOpen, setIsSkillOpen] = useState(false);
  const [isEduOpen, setIsEduOpen] = useState(false);
  const [isExpOpen, setIsExpOpen] = useState(false);
  const [isProjOpen, setIsProjOpen] = useState(false);
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSocOpen, setIsSocOpen] = useState(false);
  const [isPrefOpen, setIsPrefOpen] = useState(false);

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

  const existingSocialPlatforms = socialLinks.map((l) => l.platform);

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* 1. Profile Header */}
      <ProfileHeader profile={profile} />

      {/* 2. Profile Completion */}
      <ProfileCompletionCard completion={profile.completion} />

      {/* 3. Info Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <PersonalInfoCard personal={profile.personal} />
        <ContactInfoCard contact={profile.contact} />
      </div>

      {/* 4. Career Summary */}
      <CareerSummaryCard career={profile.career} />

      {/* 5. Previews Grid (Skills & Education, Experience & Projects) */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <SkillsCard skills={skills} onAddClick={() => setIsSkillOpen(true)} />
        <EducationCard education={education} onAddClick={() => setIsEduOpen(true)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <ExperienceCard experience={experience} onAddClick={() => setIsExpOpen(true)} />
        <ProjectsCard projects={projects} onAddClick={() => setIsProjOpen(true)} />
      </div>

      {/* 6. Remaining Previews Grid (Certifications & Languages, Social Links & Career Preferences) */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <CertificationsCard certifications={certifications} onAddClick={() => setIsCertOpen(true)} />
        <LanguagesCard languages={languages} onAddClick={() => setIsLangOpen(true)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <SocialLinksCard socialLinks={socialLinks} onAddClick={() => setIsSocOpen(true)} />
        <CareerPreferenceCard preferences={preferences} onEditClick={() => setIsPrefOpen(true)} />
      </div>

      {/* 7. Stats & Actions Grid */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <QuickStatsCard stats={profile.stats} />
        <QuickActionsCard />
      </div>

      {/* Skills Modal */}
      <ProfileDialog
        isOpen={isSkillOpen}
        onClose={() => setIsSkillOpen(false)}
        title="Add New Skill"
      >
        <SkillForm
          onSubmit={(values) => {
            addSkill(values);
            setIsSkillOpen(false);
          }}
          onCancel={() => setIsSkillOpen(false)}
          submitLabel="Add Skill"
        />
      </ProfileDialog>

      {/* Education Modal */}
      <ProfileDialog
        isOpen={isEduOpen}
        onClose={() => setIsEduOpen(false)}
        title="Add Education"
      >
        <EducationForm
          onSubmit={(values) => {
            addEducation(values);
            setIsEduOpen(false);
          }}
          onCancel={() => setIsEduOpen(false)}
          submitLabel="Add Education"
        />
      </ProfileDialog>

      {/* Experience Modal */}
      <ProfileDialog
        isOpen={isExpOpen}
        onClose={() => setIsExpOpen(false)}
        title="Add Professional Experience"
      >
        <ExperienceForm
          onSubmit={(values) => {
            addExperience(values);
            setIsExpOpen(false);
          }}
          onCancel={() => setIsExpOpen(false)}
          submitLabel="Add Experience"
        />
      </ProfileDialog>

      {/* Project Modal */}
      <ProfileDialog
        isOpen={isProjOpen}
        onClose={() => setIsProjOpen(false)}
        title="Add Project"
      >
        <ProjectForm
          onSubmit={(values) => {
            addProject(values);
            setIsProjOpen(false);
          }}
          onCancel={() => setIsProjOpen(false)}
          submitLabel="Add Project"
        />
      </ProfileDialog>

      {/* Certifications Modal */}
      <ProfileDialog
        isOpen={isCertOpen}
        onClose={() => setIsCertOpen(false)}
        title="Add Certification"
      >
        <CertificationForm
          onSubmit={(values) => {
            addCertification(values);
            setIsCertOpen(false);
          }}
          onCancel={() => setIsCertOpen(false)}
          submitLabel="Add Certification"
        />
      </ProfileDialog>

      {/* Languages Modal */}
      <ProfileDialog
        isOpen={isLangOpen}
        onClose={() => setIsLangOpen(false)}
        title="Add Language"
      >
        <LanguageForm
          onSubmit={(values) => {
            addLanguage(values);
            setIsLangOpen(false);
          }}
          onCancel={() => setIsLangOpen(false)}
          submitLabel="Add Language"
        />
      </ProfileDialog>

      {/* Social Links Modal */}
      <ProfileDialog
        isOpen={isSocOpen}
        onClose={() => setIsSocOpen(false)}
        title="Add Social Profile"
      >
        <SocialLinkForm
          existingPlatforms={existingSocialPlatforms}
          onSubmit={(values) => {
            addSocialLink(values);
            setIsSocOpen(false);
          }}
          onCancel={() => setIsSocOpen(false)}
          submitLabel="Add Link"
        />
      </ProfileDialog>

      {/* Career Preferences Modal */}
      <ProfileDialog
        isOpen={isPrefOpen}
        onClose={() => setIsPrefOpen(false)}
        title="Edit Career Preferences"
      >
        <CareerPreferenceForm
          initialValues={preferences}
          onSubmit={(values) => {
            updatePreferences(values);
            setIsPrefOpen(false);
          }}
          onCancel={() => setIsPrefOpen(false)}
          submitLabel="Save Preferences"
        />
      </ProfileDialog>
    </div>
  );
}
