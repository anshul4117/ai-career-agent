"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { AvatarUpload } from "@/features/profile/components/avatar-upload";
import { 
  ArrowLeft, Save, Plus, Pencil, Trash2, Eye
} from "lucide-react";

// Forms
import { PersonalInfoForm } from "@/features/profile/components/personal-info-form";
import { ContactInfoForm } from "@/features/profile/components/contact-info-form";
import { SkillForm } from "@/features/profile/components/skill-form";
import { ExperienceForm } from "@/features/profile/components/experience-form";
import { EducationForm } from "@/features/profile/components/education-form";
import { ProjectForm } from "@/features/profile/components/project-form";
import { CertificationForm } from "@/features/profile/components/certification-form";
import { LanguageForm } from "@/features/profile/components/language-form";
import { SocialLinkForm } from "@/features/profile/components/social-link-form";
import { CareerPreferenceForm } from "@/features/profile/components/career-preference-form";

// Values Types
import type { PersonalInfoFormValues, ContactInfoFormValues } from "@/features/profile/schemas/profile.schema";
import type { SkillFormValues } from "@/features/profile/schemas/skill.schema";
import type { ExperienceFormValues } from "@/features/profile/schemas/experience.schema";
import type { EducationFormValues } from "@/features/profile/schemas/education.schema";
import type { ProjectFormValues } from "@/features/profile/schemas/project.schema";
import type { CertificationFormValues } from "@/features/profile/schemas/certification.schema";
import type { LanguageFormValues } from "@/features/profile/schemas/language.schema";
import type { SocialLinkFormValues } from "@/features/profile/schemas/social-link.schema";
import type { CareerPreferenceFormValues } from "@/features/profile/schemas/career-preference.schema";

import { SOCIAL_PLATFORM_LABELS } from "@/features/profile/data/social-links.mock";
import { LANGUAGE_LEVEL_LABELS } from "@/features/profile/data/languages.mock";
import { WORK_MODE_LABELS, EMPLOYMENT_TYPE_LABELS } from "@/features/profile/data/experience.mock";
import { calculateProfileCompletion } from "@/features/profile/utils/completion-engine";

const SECTIONS = [
  { id: "personal", label: "Personal", ariaLabel: "Jump to Personal Information form" },
  { id: "contact", label: "Contact", ariaLabel: "Jump to Contact Information form" },
  { id: "skills", label: "Skills", ariaLabel: "Jump to Skills and Expertise form" },
  { id: "experience", label: "Experience", ariaLabel: "Jump to Work Experience form" },
  { id: "education", label: "Education", ariaLabel: "Jump to Education History form" },
  { id: "projects", label: "Projects", ariaLabel: "Jump to Portfolio Projects form" },
  { id: "certifications", label: "Certifications", ariaLabel: "Jump to Certifications form" },
  { id: "languages", label: "Languages", ariaLabel: "Jump to Languages Spoken form" },
  { id: "social", label: "Social Links", ariaLabel: "Jump to Social Links form" },
  { id: "preferences", label: "Preferences", ariaLabel: "Jump to Career Preferences form" },
];

export default function EditProfilePage() {
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
    setProfile,
    addSkill,
    deleteSkill,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addProject,
    updateProject,
    deleteProject,
    addCertification,
    updateCertification,
    deleteCertification,
    addLanguage,
    updateLanguage,
    deleteLanguage,
    addSocialLink,
    deleteSocialLink,
    updatePreferences,
  } = useProfileStore();

  const router = useRouter();
  const searchParams = useSearchParams();
  const fromOnboarding = searchParams.get("from") === "onboarding";

  // Active section tracked via Intersection Observer
  const [activeSection, setActiveSection] = useState("personal");

  // Editor states (toggled sections)
  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editPreferences, setEditPreferences] = useState(false);

  // List editor states: stores "add" or the id of the item being edited
  const [activeSkillEditor, setActiveSkillEditor] = useState<"add" | null>(null);
  const [activeExpEditor, setActiveExpEditor] = useState<"add" | string | null>(null);
  const [activeEduEditor, setActiveEduEditor] = useState<"add" | string | null>(null);
  const [activeProjEditor, setActiveProjEditor] = useState<"add" | string | null>(null);
  const [activeCertEditor, setActiveCertEditor] = useState<"add" | string | null>(null);
  const [activeLangEditor, setActiveLangEditor] = useState<"add" | string | null>(null);
  const [activeSocEditor, setActiveSocEditor] = useState<"add" | string | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // IntersectionObserver section tracker
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-25% 0px -55% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    SECTIONS.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) observer.observe(el);
    });

    return () => {
      SECTIONS.forEach((section) => {
        const el = document.getElementById(section.id);
        if (el) observer.unobserve(el);
      });
    };
  }, []);

  // Monitor if any form is currently dirty
  const isAnyFormDirty = useMemo(() => {
    return editPersonal ||
      editContact ||
      editPreferences ||
      !!activeSkillEditor ||
      !!activeExpEditor ||
      !!activeEduEditor ||
      !!activeProjEditor ||
      !!activeCertEditor ||
      !!activeLangEditor ||
      !!activeSocEditor;
  }, [
    editPersonal, editContact, editPreferences,
    activeSkillEditor, activeExpEditor, activeEduEditor,
    activeProjEditor, activeCertEditor, activeLangEditor, activeSocEditor
  ]);

  // Unsaved changes browser prompt
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyFormDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isAnyFormDirty]);

  // Scroll smooth anchor jump
  const handleJumpToSection = (id: string) => {
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePostSaveRedirect = () => {
    if (fromOnboarding) {
      router.push("/complete-profile");
    }
  };

  const handleBackClick = (e: React.MouseEvent) => {
    if (isAnyFormDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved edits. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  // Calculate completion engine results
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

  // Handle CRUD Form submits
  const handlePersonalSubmit = (values: PersonalInfoFormValues) => {
    setProfile({
      ...profile,
      personal: {
        ...values,
        dateOfBirth: values.dateOfBirth ?? null,
        gender: values.gender ?? null,
        nationality: values.nationality ?? null,
      },
    });
    setEditPersonal(false);
    showToast("Personal details updated!");
    handlePostSaveRedirect();
  };

  const handleContactSubmit = (values: ContactInfoFormValues) => {
    setProfile({
      ...profile,
      contact: {
        ...values,
        state: values.state ?? "",
      },
    });
    setEditContact(false);
    showToast("Contact details updated!");
    handlePostSaveRedirect();
  };

  const handlePreferencesSubmit = (values: CareerPreferenceFormValues) => {
    updatePreferences(values);
    setEditPreferences(false);
    showToast("Career preferences updated!");
    handlePostSaveRedirect();
  };

  const handleSkillSubmit = (values: SkillFormValues) => {
    addSkill(values);
    setActiveSkillEditor(null);
    showToast("Skill tag added!");
    handlePostSaveRedirect();
  };

  const handleExpSubmit = (values: ExperienceFormValues) => {
    const mapped = { ...values, endDate: values.endDate ?? null };
    if (activeExpEditor === "add") {
      addExperience(mapped);
    } else if (activeExpEditor) {
      updateExperience(activeExpEditor, mapped);
    }
    setActiveExpEditor(null);
    showToast("Experience record updated!");
    handlePostSaveRedirect();
  };

  const handleEduSubmit = (values: EducationFormValues) => {
    const mapped = {
      ...values,
      description: values.description ?? null,
      endDate: values.endDate ?? null,
    };
    if (activeEduEditor === "add") {
      addEducation(mapped);
    } else if (activeEduEditor) {
      updateEducation(activeEduEditor, mapped);
    }
    setActiveEduEditor(null);
    showToast("Education record updated!");
    handlePostSaveRedirect();
  };

  const handleProjSubmit = (values: ProjectFormValues) => {
    const mapped = {
      ...values,
      imageUrl: null,
      githubUrl: values.githubUrl ?? null,
      liveDemoUrl: values.liveDemoUrl ?? null,
      endDate: values.endDate ?? null,
    };
    if (activeProjEditor === "add") {
      addProject(mapped);
    } else if (activeProjEditor) {
      updateProject(activeProjEditor, mapped);
    }
    setActiveProjEditor(null);
    showToast("Portfolio project updated!");
    handlePostSaveRedirect();
  };

  const handleCertSubmit = (values: CertificationFormValues) => {
    const mapped = {
      ...values,
      expiryDate: values.expiryDate ?? null,
      credentialId: values.credentialId ?? null,
      credentialUrl: values.credentialUrl ?? null,
    };
    if (activeCertEditor === "add") {
      addCertification(mapped);
    } else if (activeCertEditor) {
      updateCertification(activeCertEditor, mapped);
    }
    setActiveCertEditor(null);
    showToast("Certification updated!");
    handlePostSaveRedirect();
  };

  const handleLangSubmit = (values: LanguageFormValues) => {
    if (activeLangEditor === "add") {
      addLanguage(values);
    } else if (activeLangEditor) {
      updateLanguage(activeLangEditor, values);
    }
    setActiveLangEditor(null);
    showToast("Language record updated!");
    handlePostSaveRedirect();
  };

  const handleSocSubmit = (values: SocialLinkFormValues) => {
    if (activeSocEditor === "add") {
      addSocialLink(values);
    } else if (activeSocEditor) {
      addSocialLink(values);
    }
    setActiveSocEditor(null);
    showToast("Social profile updated!");
    handlePostSaveRedirect();
  };

  return (
    <div className="space-y-6 w-full min-w-0 pb-16">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-4 right-4 z-50 bg-success border-2 border-border p-3 text-white font-extrabold uppercase text-xs brutal-shadow" role="alert">
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href={fromOnboarding ? "/complete-profile" : "/profile"}
            onClick={handleBackClick}
            className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {fromOnboarding ? "Back to Checklist" : "Back to Profile"}
          </Link>
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            Edit Profile
          </Heading>
        </div>

        <div className="flex gap-2 shrink-0">
          <BrutalButton
            onClick={() => router.push("/profile/preview")}
            variant="secondary"
            className="h-10 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1"
          >
            <Eye className="h-4 w-4" />
            Preview Profile
          </BrutalButton>
          <BrutalButton
            onClick={() => {
              showToast("All drafts saved successfully!");
              handlePostSaveRedirect();
            }}
            className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Save className="h-4 w-4" />
            Save Draft
          </BrutalButton>
        </div>
      </div>

      {/* Mobile Sticky Section Menu trigger (Visible on Mobile only, sticky below header) */}
      <nav 
        className="md:hidden w-full sticky top-[64px] z-30 bg-surface border-y-[3px] border-border py-3 px-4 -mx-4 flex items-center gap-3 overflow-x-auto scrollbar-none transition-all duration-300"
        aria-label="Profile section swiper"
      >
        <span className="text-[10px] font-black uppercase text-foreground/80 tracking-wider shrink-0 mr-1">
          JUMP TO:
        </span>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-0.5">
          {SECTIONS.map((sec) => {
            const isActive = activeSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => handleJumpToSection(sec.id)}
                aria-label={sec.ariaLabel}
                aria-current={isActive ? "location" : undefined}
                className={`px-3 py-1.5 border-2 rounded-lg text-[9px] font-black uppercase tracking-wider shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  isActive
                    ? "bg-primary text-white border-foreground brutal-shadow-sm translate-x-[-1px] translate-y-[-1px]"
                    : "bg-white text-foreground border-foreground hover:bg-surface-secondary"
                }`}
              >
                {sec.label}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="flex flex-col md:flex-row gap-6 items-start relative w-full min-w-0">
        
        {/* LEFT SIDEBAR (Sticky - Hidden on Mobile) */}
        <aside 
          className="hidden md:block w-72 shrink-0 sticky top-24 bg-surface border-3 border-border p-5 brutal-shadow max-h-[calc(100vh-120px)] overflow-y-auto"
          aria-label="Profile section settings sidebar"
        >
          {/* Profile Completion Card */}
          <div className="space-y-2.5 border-b-2 border-border/10 pb-5 mb-5">
            <Heading level="h4" className="text-[10px] font-black uppercase text-foreground-muted tracking-wider">
              Profile Strength
            </Heading>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black text-foreground">{audit.percentage}%</span>
              <span className="text-[9px] font-black uppercase text-success bg-success/15 border border-success px-1.5 py-0.5 rounded-sm">
                Completeness
              </span>
            </div>
            <div className="h-3 w-full border-2 border-border bg-surface-secondary rounded-sm overflow-hidden p-[1px]">
              <div
                className="h-full bg-success border-r border-border transition-all duration-300"
                style={{ width: `${audit.percentage}%` }}
              />
            </div>
          </div>

          {/* Jump To Navigation */}
          <div className="space-y-3">
            <Heading level="h4" className="text-[10px] font-black uppercase text-foreground-muted tracking-wider">
              Jump To
            </Heading>
            <nav className="space-y-2.5 flex flex-col w-full">
              {SECTIONS.map((sec) => {
                const isActive = activeSection === sec.id;
                return (
                  <button
                    key={sec.id}
                    onClick={() => handleJumpToSection(sec.id)}
                    aria-label={sec.ariaLabel}
                    aria-current={isActive ? "location" : undefined}
                    className={`w-full text-left px-3 py-2.5 border-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      isActive
                        ? "bg-primary text-white border-foreground brutal-shadow-sm border-l-4 border-l-white scale-[1.02]"
                        : "bg-white text-foreground border-foreground hover:bg-surface-secondary hover:translate-x-[-1px] hover:translate-y-[-1px]"
                    }`}
                  >
                    {sec.label}
                  </button>
                );
              })}
            </nav>
          </div>
        </aside>

        {/* RIGHT CONTENT: Forms Canvas */}
        <div className="flex-1 w-full space-y-8 min-w-0">
          
          {/* Avatar Upload */}
          <AvatarUpload />

          {/* 1. Personal Information */}
          <BrutalCard id="personal" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            {editPersonal ? (
              <div className="space-y-4">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Edit Personal Info
                </Heading>
                <PersonalInfoForm
                  initialValues={profile.personal}
                  onSubmit={handlePersonalSubmit}
                  onCancel={() => setEditPersonal(false)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                    Personal Information
                  </Heading>
                  <BrutalButton
                    onClick={() => setEditPersonal(true)}
                    variant="secondary"
                    className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </BrutalButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                  <p><strong>First Name:</strong> {profile.personal.firstName}</p>
                  <p><strong>Last Name:</strong> {profile.personal.lastName}</p>
                  <p><strong>Date of Birth:</strong> {profile.personal.dateOfBirth || "—"}</p>
                  <p><strong>Gender:</strong> {profile.personal.gender || "—"}</p>
                  <p className="md:col-span-2"><strong>Nationality:</strong> {profile.personal.nationality || "—"}</p>
                </div>
              </div>
            )}
          </BrutalCard>

          {/* 2. Contact Information */}
          <BrutalCard id="contact" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            {editContact ? (
              <div className="space-y-4">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Edit Contact Info
                </Heading>
                <ContactInfoForm
                  initialValues={profile.contact}
                  onSubmit={handleContactSubmit}
                  onCancel={() => setEditContact(false)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                    Contact Information
                  </Heading>
                  <BrutalButton
                    onClick={() => setEditContact(true)}
                    variant="secondary"
                    className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </BrutalButton>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                  <p><strong>Email Address:</strong> {profile.contact.email}</p>
                  <p><strong>Phone Number:</strong> {profile.contact.phone}</p>
                  <p><strong>City:</strong> {profile.contact.city}</p>
                  <p><strong>Country:</strong> {profile.contact.country}</p>
                </div>
              </div>
            )}
          </BrutalCard>

          {/* 3. Skills */}
          <BrutalCard id="skills" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Skills & Expertise
                </Heading>
                {!activeSkillEditor && (
                  <BrutalButton
                    onClick={() => setActiveSkillEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Skill
                  </BrutalButton>
                )}
              </div>

              {activeSkillEditor === "add" ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    Add New Skill Tag
                  </Heading>
                  <SkillForm
                    onSubmit={handleSkillSubmit}
                    onCancel={() => setActiveSkillEditor(null)}
                    submitLabel="Add Skill"
                  />
                </div>
              ) : skills.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No skills configured. Add a technical tag to showcase your stack.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {skills.map((s) => (
                    <div
                      key={s.id}
                      className="px-2.5 py-1.5 border-2 border-border bg-surface-secondary text-[10px] font-extrabold uppercase rounded-sm flex items-center gap-2 brutal-shadow-sm"
                    >
                      <span>{s.name} ({s.yearsOfExperience}y exp)</span>
                      <button
                        onClick={() => {
                          if (window.confirm(`Delete skill "${s.name}"?`)) {
                            deleteSkill(s.id);
                            showToast("Skill deleted!");
                          }
                        }}
                        className="text-error hover:text-error-hover transition-colors"
                        aria-label={`Delete ${s.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 4. Experience */}
          <BrutalCard id="experience" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Work Experience
                </Heading>
                {!activeExpEditor && (
                  <BrutalButton
                    onClick={() => setActiveExpEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Experience
                  </BrutalButton>
                )}
              </div>

              {activeExpEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    {activeExpEditor === "add" ? "Add Work Experience" : "Edit Experience Record"}
                  </Heading>
                  <ExperienceForm
                    initialValues={activeExpEditor === "add" ? null : experience.find(e => e.id === activeExpEditor)}
                    onSubmit={handleExpSubmit}
                    onCancel={() => setActiveExpEditor(null)}
                    submitLabel={activeExpEditor === "add" ? "Add Experience" : "Save Record"}
                  />
                </div>
              ) : experience.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No work history configured. List your career experience.
                </div>
              ) : (
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="border-2 border-border p-4 rounded-sm flex justify-between gap-4 bg-surface-secondary/20">
                      <div className="space-y-1 text-xs">
                        <h5 className="font-extrabold uppercase text-foreground">{exp.jobTitle}</h5>
                        <p className="text-foreground-secondary font-semibold">
                          {exp.companyName} • {exp.location} ({WORK_MODE_LABELS[exp.workMode]})
                        </p>
                        <p className="text-foreground-muted font-mono text-[10px]">
                          {exp.startDate} – {exp.currentPosition ? "Present" : exp.endDate}
                        </p>
                        {exp.description && (
                          <p className="text-foreground-secondary leading-relaxed pt-1.5">{exp.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <BrutalButton
                          onClick={() => setActiveExpEditor(exp.id)}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          aria-label={`Edit experience ${exp.jobTitle}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </BrutalButton>
                        <BrutalButton
                          onClick={() => {
                            if (window.confirm(`Delete experience "${exp.jobTitle}"?`)) {
                              deleteExperience(exp.id);
                              showToast("Experience deleted!");
                            }
                          }}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
                          aria-label={`Delete experience ${exp.jobTitle}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </BrutalButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 5. Education */}
          <BrutalCard id="education" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Education History
                </Heading>
                {!activeEduEditor && (
                  <BrutalButton
                    onClick={() => setActiveEduEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Education
                  </BrutalButton>
                )}
              </div>

              {activeEduEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    {activeEduEditor === "add" ? "Add Education Record" : "Edit Education Record"}
                  </Heading>
                  <EducationForm
                    initialValues={activeEduEditor === "add" ? null : education.find(e => e.id === activeEduEditor)}
                    onSubmit={handleEduSubmit}
                    onCancel={() => setActiveEduEditor(null)}
                    submitLabel={activeEduEditor === "add" ? "Add Education" : "Save Record"}
                  />
                </div>
              ) : education.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No education history configured. Add qualifications to your profile.
                </div>
              ) : (
                <div className="space-y-4">
                  {education.map((edu) => (
                    <div key={edu.id} className="border-2 border-border p-4 rounded-sm flex justify-between gap-4 bg-surface-secondary/20">
                      <div className="space-y-1 text-xs">
                        <h5 className="font-extrabold uppercase text-foreground">{edu.degree}</h5>
                        <p className="text-foreground-secondary font-semibold">
                          {edu.fieldOfStudy} • {edu.institution}
                        </p>
                        <p className="text-foreground-muted font-mono text-[10px]">
                          {edu.startDate} – {edu.currentStudy ? "Present" : edu.endDate} • Grade: {edu.cgpa}
                        </p>
                        {edu.description && (
                          <p className="text-foreground-secondary leading-relaxed pt-1">{edu.description}</p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <BrutalButton
                          onClick={() => setActiveEduEditor(edu.id)}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          aria-label={`Edit education ${edu.degree}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </BrutalButton>
                        <BrutalButton
                          onClick={() => {
                            if (window.confirm(`Delete education "${edu.degree}"?`)) {
                              deleteEducation(edu.id);
                              showToast("Education deleted!");
                            }
                          }}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
                          aria-label={`Delete education ${edu.degree}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </BrutalButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 6. Projects */}
          <BrutalCard id="projects" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Portfolio Projects
                </Heading>
                {!activeProjEditor && (
                  <BrutalButton
                    onClick={() => setActiveProjEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Project
                  </BrutalButton>
                )}
              </div>

              {activeProjEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    {activeProjEditor === "add" ? "Add Portfolio Project" : "Edit Project Record"}
                  </Heading>
                  <ProjectForm
                    initialValues={activeProjEditor === "add" ? null : projects.find(p => p.id === activeProjEditor)}
                    onSubmit={handleProjSubmit}
                    onCancel={() => setActiveProjEditor(null)}
                    submitLabel={activeProjEditor === "add" ? "Add Project" : "Save Record"}
                  />
                </div>
              ) : projects.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No projects configured. Highlight your side-projects or open source work.
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((proj) => (
                    <div key={proj.id} className="border-2 border-border p-4 rounded-sm flex justify-between gap-4 bg-surface-secondary/20">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <h5 className="font-extrabold uppercase text-foreground">{proj.title}</h5>
                          {proj.featured && (
                            <span className="bg-primary/25 border border-primary text-[8px] px-1.5 py-0.2 uppercase font-black">Featured</span>
                          )}
                        </div>
                        <p className="text-foreground-secondary font-semibold">
                          Role: {proj.role} • Team size: {proj.teamSize}
                        </p>
                        <p className="text-foreground-muted font-mono text-[10px]">
                          {proj.startDate} – {proj.endDate || "Present"}
                        </p>
                        <p className="text-foreground-secondary leading-relaxed pt-1">{proj.description}</p>
                        {proj.techStack.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-2">
                            {proj.techStack.map((tech, i) => (
                              <span key={i} className="px-1.5 py-0.5 border border-border text-[8px] font-bold uppercase bg-surface">
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 shrink-0">
                        <BrutalButton
                          onClick={() => setActiveProjEditor(proj.id)}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center"
                          aria-label={`Edit project ${proj.title}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </BrutalButton>
                        <BrutalButton
                          onClick={() => {
                            if (window.confirm(`Delete project "${proj.title}"?`)) {
                              deleteProject(proj.id);
                              showToast("Project deleted!");
                            }
                          }}
                          variant="secondary"
                          className="h-8 w-8 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
                          aria-label={`Delete project ${proj.title}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </BrutalButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 7. Certifications */}
          <BrutalCard id="certifications" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Certifications
                </Heading>
                {!activeCertEditor && (
                  <BrutalButton
                    onClick={() => setActiveCertEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Certification
                  </BrutalButton>
                )}
              </div>

              {activeCertEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    {activeCertEditor === "add" ? "Add Certification" : "Edit Certification Record"}
                  </Heading>
                  <CertificationForm
                    initialValues={activeCertEditor === "add" ? null : certifications.find(c => c.id === activeCertEditor)}
                    onSubmit={handleCertSubmit}
                    onCancel={() => setActiveCertEditor(null)}
                    submitLabel={activeCertEditor === "add" ? "Add Cert" : "Save Record"}
                  />
                </div>
              ) : certifications.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No certifications configured. Showcase your credentials.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {certifications.map((c) => (
                    <div key={c.id} className="border-2 border-border p-4 rounded-sm flex justify-between gap-3 bg-surface-secondary/20">
                      <div className="text-xs space-y-1">
                        <h5 className="font-extrabold uppercase">{c.name}</h5>
                        <p className="text-foreground-secondary font-semibold">{c.issuingOrganization}</p>
                        <p className="text-foreground-muted font-mono text-[9px]">
                          Issued: {c.issueDate} {c.neverExpires ? "• Permanent" : `• Expires: ${c.expiryDate}`}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0 self-start">
                        <BrutalButton
                          onClick={() => setActiveCertEditor(c.id)}
                          variant="secondary"
                          className="h-7 w-7 p-0 flex items-center justify-center"
                          aria-label={`Edit certification ${c.name}`}
                        >
                          <Pencil className="h-3 w-3" />
                        </BrutalButton>
                        <BrutalButton
                          onClick={() => {
                            if (window.confirm(`Delete certification "${c.name}"?`)) {
                              deleteCertification(c.id);
                              showToast("Certification deleted!");
                            }
                          }}
                          variant="secondary"
                          className="h-7 w-7 p-0 flex items-center justify-center text-error border-error/20 hover:border-error"
                          aria-label={`Delete certification ${c.name}`}
                        >
                          <Trash2 className="h-3 w-3" />
                        </BrutalButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 8. Languages */}
          <BrutalCard id="languages" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Languages
                </Heading>
                {!activeLangEditor && (
                  <BrutalButton
                    onClick={() => setActiveLangEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Language
                  </BrutalButton>
                )}
              </div>

              {activeLangEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    {activeLangEditor === "add" ? "Add Language" : "Edit Language"}
                  </Heading>
                  <LanguageForm
                    initialValues={activeLangEditor === "add" ? null : languages.find(l => l.id === activeLangEditor)}
                    onSubmit={handleLangSubmit}
                    onCancel={() => setActiveLangEditor(null)}
                    submitLabel={activeLangEditor === "add" ? "Add Language" : "Save Record"}
                  />
                </div>
              ) : languages.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No languages configured. Add languages you speak.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2.5">
                  {languages.map((l) => (
                    <div
                      key={l.id}
                      className="px-3 py-2 border-2 border-border bg-surface-secondary text-[10px] font-extrabold uppercase rounded-sm flex items-center gap-3 brutal-shadow-sm"
                    >
                      <div className="space-y-0.5">
                        <span>{l.language}</span>
                        <div className="text-[8px] text-foreground-muted">
                          {l.nativeLanguage ? "Native" : `Speaking: ${LANGUAGE_LEVEL_LABELS[l.speakingLevel]}`}
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setActiveLangEditor(l.id)}
                          className="text-foreground-secondary hover:text-primary transition-colors"
                          aria-label={`Edit language ${l.language}`}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete language "${l.language}"?`)) {
                              deleteLanguage(l.id);
                              showToast("Language deleted!");
                            }
                          }}
                          className="text-error hover:text-error-hover transition-colors"
                          aria-label={`Delete language ${l.language}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 9. Social Links */}
          <BrutalCard id="social" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Social Profiles
                </Heading>
                {!activeSocEditor && (
                  <BrutalButton
                    onClick={() => setActiveSocEditor("add")}
                    className="h-8 px-3 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Link
                  </BrutalButton>
                )}
              </div>

              {activeSocEditor ? (
                <div className="border-2 border-border p-4 bg-surface-secondary space-y-4 rounded-sm brutal-shadow-sm">
                  <Heading level="h5" className="text-xs font-black uppercase tracking-wider">
                    Add Social Connection
                  </Heading>
                  <SocialLinkForm
                    existingPlatforms={socialLinks.map((s) => s.platform)}
                    onSubmit={handleSocSubmit}
                    onCancel={() => setActiveSocEditor(null)}
                    submitLabel="Add Connection"
                  />
                </div>
              ) : socialLinks.length === 0 ? (
                <div className="text-center py-6 border-2 border-dashed border-border/20 text-xs text-foreground-secondary">
                  No social profiles connected. Connect your GitHub or LinkedIn profile.
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {socialLinks.map((s) => (
                    <div key={s.id} className="border-2 border-border p-3.5 rounded-sm flex justify-between items-center bg-surface-secondary/20">
                      <div className="space-y-0.5 text-xs truncate">
                        <strong className="uppercase text-[10px] text-foreground-muted">
                          {SOCIAL_PLATFORM_LABELS[s.platform] || s.platform}
                        </strong>
                        <p className="font-mono text-[10px] truncate text-foreground-secondary max-w-[200px]">
                          {s.url}
                        </p>
                      </div>
                      <BrutalButton
                        onClick={() => {
                          if (window.confirm(`Remove connection for "${s.platform}"?`)) {
                            deleteSocialLink(s.id);
                            showToast("Social profile disconnected!");
                          }
                        }}
                        variant="secondary"
                        className="h-7 px-2 text-[9px] font-bold uppercase text-error border-error/20 hover:border-error"
                        aria-label={`Disconnect ${s.platform}`}
                      >
                        Disconnect
                      </BrutalButton>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </BrutalCard>

          {/* 10. Career Preferences */}
          <BrutalCard id="preferences" className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0 scroll-mt-28">
            {editPreferences ? (
              <div className="space-y-4">
                <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                  Edit Career Preferences
                </Heading>
                <CareerPreferenceForm
                  initialValues={preferences}
                  onSubmit={handlePreferencesSubmit}
                  onCancel={() => setEditPreferences(false)}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Heading level="h4" className="text-base font-black uppercase tracking-tight">
                    Career Preferences
                  </Heading>
                  <BrutalButton
                    onClick={() => setEditPreferences(true)}
                    variant="secondary"
                    className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </BrutalButton>
                </div>
                {!preferences ? (
                  <p className="text-xs text-foreground-muted">No preferences configured.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
                    <p><strong>Preferred Role:</strong> {preferences.preferredRole}</p>
                    <p><strong>Job Type:</strong> {EMPLOYMENT_TYPE_LABELS[preferences.employmentType] || preferences.employmentType}</p>
                    <p><strong>Preferred Location:</strong> {preferences.preferredLocation} ({WORK_MODE_LABELS[preferences.workMode]})</p>
                    <p><strong>Expected Salary:</strong> {preferences.currency} {preferences.expectedSalary}</p>
                    <p><strong>Notice Period:</strong> {preferences.noticePeriod}</p>
                    <p><strong>Target Industry:</strong> {preferences.preferredIndustry}</p>
                    <p><strong>Shift preference:</strong> {preferences.preferredShift}</p>
                    <p><strong>Relocation:</strong> {preferences.relocationWillingness ? "Yes" : "No"}</p>
                  </div>
                )}
              </div>
            )}
          </BrutalCard>

        </div>
      </div>
    </div>
  );
}
