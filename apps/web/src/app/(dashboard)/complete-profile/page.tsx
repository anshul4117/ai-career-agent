"use client";

import React, { useEffect, useState } from "react";
import { useProfileStore } from "@/features/profile/store/profile.store";
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
  Settings,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Save,
} from "lucide-react";

// Forms
import { PersonalInfoForm } from "@/features/profile/components/personal-info-form";
import { ContactInfoForm } from "@/features/profile/components/contact-info-form";
import { SkillForm } from "@/features/profile/components/skill-form";
import { EducationForm } from "@/features/profile/components/education-form";
import { ExperienceForm } from "@/features/profile/components/experience-form";
import { ProjectForm } from "@/features/profile/components/project-form";
import { CareerPreferenceForm } from "@/features/profile/components/career-preference-form";

// Previews
import { SkillsList } from "@/features/profile/components/skills-list";
import { EducationTimeline } from "@/features/profile/components/education-timeline";
import { ExperienceTimeline } from "@/features/profile/components/experience-timeline";
import { ProjectsGrid } from "@/features/profile/components/projects-grid";

import { useRouter } from "next/navigation";

const WIZARD_STEPS = [
  { step: 1, label: "Personal", icon: User, optional: false },
  { step: 2, label: "Contact", icon: Mail, optional: false },
  { step: 3, label: "Skills", icon: Code2, optional: true },
  { step: 4, label: "Education", icon: GraduationCap, optional: true },
  { step: 5, label: "Experience", icon: Briefcase, optional: true },
  { step: 6, label: "Projects", icon: FolderOpen, optional: true },
  { step: 7, label: "Preferences", icon: Settings, optional: true },
  { step: 8, label: "Review", icon: CheckCircle, optional: false },
];

export default function CompleteProfileWizard() {
  const {
    profile,
    skills,
    education,
    experience,
    projects,
    preferences,
    isLoading,
    loadProfile,
    setProfile,
    addSkill,
    deleteSkill,
    addEducation,
    deleteEducation,
    addExperience,
    deleteExperience,
    addProject,
    deleteProject,
    updatePreferences,
    wizardStep,
    setWizardStep,
  } = useProfileStore();

  const router = useRouter();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleNext = () => {
    if (wizardStep < 8) {
      setWizardStep(wizardStep + 1);
    }
  };

  const handlePrev = () => {
    if (wizardStep > 1) {
      setWizardStep(wizardStep - 1);
    }
  };

  const handleSkip = () => {
    if (WIZARD_STEPS[wizardStep - 1].optional) {
      handleNext();
    }
  };

  const handleSaveDraft = () => {
    showToast("Draft saved successfully!");
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  // Active step details
  const activeStepInfo = WIZARD_STEPS[wizardStep - 1];

  return (
    <div className="space-y-6 w-full max-w-3xl min-w-0 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-success border-2 border-border p-3 text-white font-extrabold uppercase text-xs brutal-shadow">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="space-y-1">
        <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          Complete Profile Onboarding
        </Heading>
        <Text className="text-foreground-secondary text-xs">
          Step-by-step onboarding wizard to build a professional job readiness score.
        </Text>
      </div>

      {/* Progress Bar & Indicators */}
      <div className="bg-surface border-2 border-border p-4 brutal-shadow-sm flex flex-col gap-4">
        {/* Progress Bar */}
        <div className="h-3 w-full border-2 border-border bg-surface-secondary rounded-sm overflow-hidden p-[1px]">
          <div
            className="h-full bg-primary border-r border-border transition-all duration-300"
            style={{ width: `${(wizardStep / 8) * 100}%` }}
          />
        </div>

        {/* Indicators List */}
        <div className="flex justify-between items-center gap-1 overflow-x-auto pb-1 select-none">
          {WIZARD_STEPS.map((s) => {
            const StepIcon = s.icon;
            const isActive = s.step === wizardStep;
            const isCompleted = s.step < wizardStep;

            return (
              <div
                key={s.step}
                className={`flex items-center gap-1 px-2 py-1 border-2 text-[10px] font-black uppercase rounded-sm shrink-0 ${
                  isActive
                    ? "bg-primary text-white border-border brutal-shadow-sm"
                    : isCompleted
                    ? "bg-success/20 text-success border-success/30"
                    : "bg-surface-secondary text-foreground-muted border-border/10"
                }`}
              >
                <StepIcon className="h-3 w-3 shrink-0" />
                <span className="hidden sm:inline">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Step Canvas */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        {/* STEP 1: Personal */}
        {wizardStep === 1 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 1: Personal Information
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Provide your legal name and nationality details. (Mandatory)
              </Text>
            </div>
            <PersonalInfoForm
              initialValues={profile.personal}
              onSubmit={(values) => {
                setProfile({ ...profile, personal: values });
                handleNext();
              }}
              onCancel={() => router.push("/profile")}
            />
          </div>
        )}

        {/* STEP 2: Contact */}
        {wizardStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 2: Contact Information
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Provide your primary coordinates for recruiters. (Mandatory)
              </Text>
            </div>
            <ContactInfoForm
              initialValues={profile.contact}
              onSubmit={(values) => {
                setProfile({ ...profile, contact: values });
                handleNext();
              }}
              onCancel={handlePrev}
            />
          </div>
        )}

        {/* STEP 3: Skills */}
        {wizardStep === 3 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 3: Skills & Expertise
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Add your technical and domain tags. (Optional)
              </Text>
            </div>

            <div className="border-2 border-border p-4 bg-surface-secondary">
              <SkillForm
                onSubmit={(values) => {
                  addSkill(values);
                  showToast("Skill added!");
                }}
                onCancel={() => {}}
                submitLabel="Add Skill Tag"
              />
            </div>

            {skills.length > 0 && (
              <div className="space-y-2">
                <Text className="font-extrabold uppercase text-xs">Active Skills</Text>
                <SkillsList skills={skills} onDelete={deleteSkill} />
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Education */}
        {wizardStep === 4 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 4: Education History
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Add degrees, certifications, or schools. (Optional)
              </Text>
            </div>

            <div className="border-2 border-border p-4 bg-surface-secondary">
              <EducationForm
                onSubmit={(values) => {
                  addEducation(values);
                  showToast("Education added!");
                }}
                onCancel={() => {}}
                submitLabel="Add Education"
              />
            </div>

            {education.length > 0 && (
              <div className="space-y-2">
                <Text className="font-extrabold uppercase text-xs">Education Records</Text>
                <EducationTimeline education={education} onEdit={() => {}} onDelete={deleteEducation} />
              </div>
            )}
          </div>
        )}

        {/* STEP 5: Experience */}
        {wizardStep === 5 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 5: Work Experience
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Add professional work experience or internships. (Optional)
              </Text>
            </div>

            <div className="border-2 border-border p-4 bg-surface-secondary">
              <ExperienceForm
                onSubmit={(values) => {
                  addExperience(values);
                  showToast("Work experience added!");
                }}
                onCancel={() => {}}
                submitLabel="Add Work Experience"
              />
            </div>

            {experience.length > 0 && (
              <div className="space-y-2">
                <Text className="font-extrabold uppercase text-xs">Work History</Text>
                <ExperienceTimeline experience={experience} onEdit={() => {}} onDelete={deleteExperience} />
              </div>
            )}
          </div>
        )}

        {/* STEP 6: Projects */}
        {wizardStep === 6 && (
          <div className="space-y-5">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 6: Projects & Portfolio
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Highlight side projects or open-source credentials. (Optional)
              </Text>
            </div>

            <div className="border-2 border-border p-4 bg-surface-secondary">
              <ProjectForm
                onSubmit={(values) => {
                  addProject(values);
                  showToast("Project added!");
                }}
                onCancel={() => {}}
                submitLabel="Add Project Record"
              />
            </div>

            {projects.length > 0 && (
              <div className="space-y-2">
                <Text className="font-extrabold uppercase text-xs">Portfolio Grid</Text>
                <ProjectsGrid projects={projects} onEdit={() => {}} onDelete={deleteProject} />
              </div>
            )}
          </div>
        )}

        {/* STEP 7: Career Preferences */}
        {wizardStep === 7 && (
          <div className="space-y-4">
            <div className="space-y-1">
              <Heading level="h3" className="text-lg font-black uppercase">
                Step 7: Career Preferences
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Specify preferred roles, expected packages, and shifts. (Optional)
              </Text>
            </div>
            <CareerPreferenceForm
              initialValues={preferences}
              onSubmit={(values) => {
                updatePreferences(values);
                handleNext();
              }}
              onCancel={handlePrev}
            />
          </div>
        )}

        {/* STEP 8: Review & Finish */}
        {wizardStep === 8 && (
          <div className="space-y-6">
            <div className="space-y-1 text-center">
              <Heading level="h3" className="text-xl font-black uppercase">
                Review Profile Alignment
              </Heading>
              <Text className="text-foreground-secondary text-xs">
                Almost done! Confirm your profile details before finishing onboarding.
              </Text>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 text-xs">
              <div className="border-2 border-border p-3">
                <Text className="font-bold uppercase text-[10px] text-foreground-muted">Personal Info</Text>
                <p className="font-black uppercase truncate">{profile.personal.firstName} {profile.personal.lastName}</p>
              </div>
              <div className="border-2 border-border p-3">
                <Text className="font-bold uppercase text-[10px] text-foreground-muted">Contact Info</Text>
                <p className="font-black truncate">{profile.contact.email} ({profile.contact.city})</p>
              </div>
              <div className="border-2 border-border p-3">
                <Text className="font-bold uppercase text-[10px] text-foreground-muted">Skills Added</Text>
                <p className="font-black">{skills.length} skills tags</p>
              </div>
              <div className="border-2 border-border p-3">
                <Text className="font-bold uppercase text-[10px] text-foreground-muted">Experience Records</Text>
                <p className="font-black">{experience.length} work entries</p>
              </div>
            </div>

            <div className="pt-4 border-t-2 border-border/10 flex justify-center">
              <BrutalButton
                onClick={() => {
                  router.push("/profile");
                }}
                className="h-11 px-8 uppercase font-bold text-xs tracking-wider"
              >
                Finish Onboarding
                <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </BrutalButton>
            </div>
          </div>
        )}

        {/* Footer controls for optional/non-form steps (3, 4, 5, 6) */}
        {activeStepInfo.optional && (
          <div className="flex items-center justify-between gap-3 pt-6 border-t-2 border-border/10 mt-6">
            <BrutalButton
              onClick={handlePrev}
              variant="secondary"
              className="h-10 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Previous
            </BrutalButton>

            <div className="flex items-center gap-2">
              <BrutalButton
                onClick={handleSaveDraft}
                variant="secondary"
                className="h-10 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Save className="h-4 w-4" />
                Save Draft
              </BrutalButton>

              <BrutalButton
                onClick={handleSkip}
                variant="secondary"
                className="h-10 px-4 text-xs font-bold uppercase tracking-wider"
              >
                Skip Step
              </BrutalButton>

              <BrutalButton
                onClick={handleNext}
                className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
              >
                Next Step
                <ArrowRight className="h-4 w-4" />
              </BrutalButton>
            </div>
          </div>
        )}
      </BrutalCard>
    </div>
  );
}
