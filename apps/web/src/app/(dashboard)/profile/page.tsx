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
import { QuickStatsCard } from "@/features/profile/components/quick-stats-card";
import { QuickActionsCard } from "@/features/profile/components/quick-actions-card";
import { RecentActivityCard } from "@/features/profile/components/recent-activity-card";

import { useProfileStore } from "@/features/profile/store/profile.store";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";
import { ProfileSkeleton } from "@/components/ui/skeleton-loaders";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 },
  },
};

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
    error,
    loadProfile,
  } = useProfileStore();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  if (error) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12 px-4 text-center">
        <BrutalCard className="bg-surface border-[3px] border-border p-8 brutal-shadow">
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight text-error">
              Failed to Load Profile
            </h3>
            <p className="text-sm text-foreground-secondary font-medium">
              {error ||
                "An unexpected error occurred while fetching your profile details."}
            </p>
            <BrutalButton
              onClick={() => loadProfile()}
              variant="default"
              className="mt-2"
            >
              Retry Connection
            </BrutalButton>
          </div>
        </BrutalCard>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto py-12 px-4 text-center">
        <BrutalCard className="bg-surface border-[3px] border-border p-8 brutal-shadow">
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tight">
              Profile Not Found
            </h3>
            <p className="text-sm text-foreground-secondary font-medium">
              No active candidate profile details were found for this account.
            </p>
            <BrutalButton
              onClick={() => loadProfile()}
              variant="default"
              className="mt-2"
            >
              Reload Profile
            </BrutalButton>
          </div>
        </BrutalCard>
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
    preferences,
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
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full"
      >
        {/* Left Column: Primary CV Feed (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6 w-full min-w-0">
          <motion.div variants={itemVariants}>
            <CareerSummaryCard career={profile.career} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ExperienceCard experience={experience} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <EducationCard education={education} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ProjectsCard projects={projects} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SkillsCard skills={skills} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <LanguagesCard languages={languages} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CertificationsCard certifications={certifications} />
          </motion.div>
        </div>

        {/* Right Column: Sidebar Widgets (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6 w-full min-w-0">
          {/* Desktop-Only Strength & Missing Sections */}
          <div className="hidden lg:block space-y-6 w-full">
            <motion.div variants={itemVariants}>
              <ProfileCompletionCard completion={completionData} />
            </motion.div>
            <motion.div variants={itemVariants}>
              <MissingSections missingSections={audit.missingSections} />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <QuickActionsCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <QuickStatsCard stats={profile.stats} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <RecentActivityCard />
          </motion.div>
          <motion.div variants={itemVariants}>
            <PersonalInfoCard profile={profile} socialLinks={socialLinks} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ContactInfoCard contact={profile.contact} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <SocialLinksCard socialLinks={socialLinks} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CareerPreferenceCard preferences={preferences} />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
