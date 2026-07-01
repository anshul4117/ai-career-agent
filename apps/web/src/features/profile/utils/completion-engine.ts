/** Profile Module — Profile Completion Engine */

import type { Profile } from "../types/profile.types";
import type { Skill } from "../types/skill.types";
import type { Education } from "../types/education.types";
import type { Experience } from "../types/experience.types";
import type { Project } from "../types/project.types";
import type { Certification } from "../types/certification.types";
import type { Language } from "../types/language.types";
import type { SocialLink } from "../types/social-link.types";
import type { CareerPreference } from "../types/career-preference.types";

export interface CompletionChecklistItem {
  id: string;
  label: string;
  weight: number;
  completed: boolean;
  suggestion: string;
  actionUrl: string;
}

export interface CompletionAudit {
  percentage: number;
  completedSections: { id: string; label: string }[];
  missingSections: { id: string; label: string; suggestion: string }[];
  checklist: CompletionChecklistItem[];
}

export function calculateProfileCompletion(
  profile: Profile | null,
  skills: Skill[],
  education: Education[],
  experience: Experience[],
  projects: Project[],
  certifications: Certification[],
  languages: Language[],
  socialLinks: SocialLink[],
  preferences: CareerPreference | null
): CompletionAudit {
  const checklist: CompletionChecklistItem[] = [
    {
      id: "personal",
      label: "Personal Information",
      weight: 15,
      completed: !!(profile?.personal?.firstName && profile?.personal?.lastName),
      suggestion: "Add your first and last name to verify your identity.",
      actionUrl: "/profile/edit#personal",
    },
    {
      id: "contact",
      label: "Contact Information",
      weight: 10,
      completed: !!(profile?.contact?.email && profile?.contact?.phone),
      suggestion: "Provide your email address and phone number.",
      actionUrl: "/profile/edit#contact",
    },
    {
      id: "skills",
      label: "Skills & Expertise",
      weight: 15,
      completed: skills.length > 0,
      suggestion: "Add technical or professional skills.",
      actionUrl: "/profile/edit#skills",
    },
    {
      id: "education",
      label: "Education History",
      weight: 10,
      completed: education.length > 0,
      suggestion: "List your degrees, institutions, and grades.",
      actionUrl: "/profile/edit#education",
    },
    {
      id: "experience",
      label: "Work Experience",
      weight: 15,
      completed: experience.length > 0,
      suggestion: "List your professional work experiences.",
      actionUrl: "/profile/edit#experience",
    },
    {
      id: "projects",
      label: "Projects & Portfolio",
      weight: 10,
      completed: projects.length > 0,
      suggestion: "Showcase side projects or portfolios.",
      actionUrl: "/profile/edit#projects",
    },
    {
      id: "certifications",
      label: "Certifications",
      weight: 5,
      completed: certifications.length > 0,
      suggestion: "Add professional licenses or certifications.",
      actionUrl: "/profile/edit#certifications",
    },
    {
      id: "languages",
      label: "Languages",
      weight: 5,
      completed: languages.length > 0,
      suggestion: "List languages you speak and write.",
      actionUrl: "/profile/edit#languages",
    },
    {
      id: "social",
      label: "Social Links",
      weight: 5,
      completed: socialLinks.length > 0,
      suggestion: "Add GitHub, LinkedIn, or Portfolio URLs.",
      actionUrl: "/profile/edit#social",
    },
    {
      id: "preferences",
      label: "Career Preferences",
      weight: 10,
      completed: !!preferences?.preferredRole,
      suggestion: "Provide expected salary, shifts, and notice period.",
      actionUrl: "/profile/edit#preferences",
    },
  ];

  let percentage = 0;
  const completedSections: { id: string; label: string }[] = [];
  const missingSections: { id: string; label: string; suggestion: string }[] = [];

  checklist.forEach((sec) => {
    if (sec.completed) {
      percentage += sec.weight;
      completedSections.push({ id: sec.id, label: sec.label });
    } else {
      missingSections.push({ id: sec.id, label: sec.label, suggestion: sec.suggestion });
    }
  });

  return {
    percentage,
    completedSections,
    missingSections,
    checklist,
  };
}
