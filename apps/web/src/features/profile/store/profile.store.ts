/** Profile Module — Zustand Store */

import { create } from "zustand";
import type { Profile } from "../types/profile.types";
import type { Skill } from "../types/skill.types";
import type { Education } from "../types/education.types";
import type { Experience } from "../types/experience.types";
import type { Project } from "../types/project.types";
import type { Certification } from "../types/certification.types";
import type { Language } from "../types/language.types";
import type { SocialLink } from "../types/social-link.types";
import type { CareerPreference } from "../types/career-preference.types";

import { MOCK_PROFILE } from "../data/profile.mock";
import { MOCK_SKILLS } from "../data/skills.mock";
import { MOCK_EDUCATION } from "../data/education.mock";
import { MOCK_EXPERIENCE } from "../data/experience.mock";
import { MOCK_PROJECTS } from "../data/projects.mock";
import { MOCK_CERTIFICATIONS } from "../data/certifications.mock";
import { MOCK_LANGUAGES } from "../data/languages.mock";
import { MOCK_SOCIAL_LINKS } from "../data/social-links.mock";
import { MOCK_CAREER_PREFERENCES } from "../data/career-preferences.mock";

import { calculateProfileCompletion } from "../utils/completion-engine";

interface ProfileState {
  profile: Profile | null;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  preferences: CareerPreference | null;
  isLoading: boolean;
  error: string | null;
  
  // Onboarding Wizard Progress
  wizardStep: number;
  setWizardStep: (step: number) => void;
  
  // Form Status States
  isDirty: boolean;
  setIsDirty: (isDirty: boolean) => void;
  autosaveTimestamp: string | null;
  setAutosaveTimestamp: (timestamp: string | null) => void;
  
  setProfile: (profile: Profile | null) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loadProfile: () => void;
  reset: () => void;
  
  // Dynamic sync helper
  syncCompletion: () => void;

  // Skills CRUD
  addSkill: (skill: Omit<Skill, "id" | "createdAt" | "updatedAt">) => void;
  updateSkill: (id: string, skill: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>) => void;
  deleteSkill: (id: string) => void;
  
  // Education CRUD
  addEducation: (edu: Omit<Education, "id" | "createdAt" | "updatedAt">) => void;
  updateEducation: (id: string, edu: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>) => void;
  deleteEducation: (id: string) => void;

  // Experience CRUD
  addExperience: (exp: Omit<Experience, "id" | "createdAt" | "updatedAt">) => void;
  updateExperience: (id: string, exp: Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>) => void;
  deleteExperience: (id: string) => void;

  // Projects CRUD
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt">) => void;
  updateProject: (id: string, project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>) => void;
  deleteProject: (id: string) => void;
  toggleFeaturedProject: (id: string) => void;

  // Certifications CRUD
  addCertification: (cert: Omit<Certification, "id" | "createdAt" | "updatedAt">) => void;
  updateCertification: (id: string, cert: Partial<Omit<Certification, "id" | "createdAt" | "updatedAt">>) => void;
  deleteCertification: (id: string) => void;

  // Languages CRUD
  addLanguage: (lang: Omit<Language, "id" | "createdAt" | "updatedAt">) => void;
  updateLanguage: (id: string, lang: Partial<Omit<Language, "id" | "createdAt" | "updatedAt">>) => void;
  deleteLanguage: (id: string) => void;

  // Social Links CRUD
  addSocialLink: (link: Omit<SocialLink, "id" | "createdAt" | "updatedAt">) => void;
  updateSocialLink: (id: string, link: Partial<Omit<SocialLink, "id" | "createdAt" | "updatedAt">>) => void;
  deleteSocialLink: (id: string) => void;

  // Preferences Update
  updatePreferences: (pref: Omit<CareerPreference, "id" | "createdAt" | "updatedAt">) => void;
  
  // Avatar upload/remove
  uploadAvatar: (url: string | null) => void;
  removeAvatar: () => void;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  profile: null,
  skills: [],
  education: [],
  experience: [],
  projects: [],
  certifications: [],
  languages: [],
  socialLinks: [],
  preferences: null,
  isLoading: false,
  error: null,
  
  wizardStep: 1,
  setWizardStep: (wizardStep) => set({ wizardStep }),
  
  isDirty: false,
  setIsDirty: (isDirty) => set({ isDirty }),
  
  autosaveTimestamp: null,
  setAutosaveTimestamp: (autosaveTimestamp) => set({ autosaveTimestamp }),

  setProfile: (profile) => set({ profile, error: null }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),

  loadProfile: () => {
    set({ isLoading: true, error: null });
    // Simulate async load with mock data
    setTimeout(() => {
      const state = get();
      if (state.profile) {
        set({ isLoading: false });
        return;
      }

      set({ 
        profile: MOCK_PROFILE, 
        skills: [...MOCK_SKILLS],
        education: [...MOCK_EDUCATION],
        experience: [...MOCK_EXPERIENCE],
        projects: [...MOCK_PROJECTS],
        certifications: [...MOCK_CERTIFICATIONS],
        languages: [...MOCK_LANGUAGES],
        socialLinks: [...MOCK_SOCIAL_LINKS],
        preferences: MOCK_CAREER_PREFERENCES,
        isLoading: false 
      });

      get().syncCompletion();
    }, 200);
  },

  reset: () => set({ 
    profile: null, 
    skills: [], 
    education: [], 
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: [],
    preferences: null,
    isLoading: false, 
    error: null,
    wizardStep: 1,
    isDirty: false,
    autosaveTimestamp: null
  }),

  // Dynamic Sync Engine Action
  syncCompletion: () => {
    set((state) => {
      if (!state.profile) return {};
      const audit = calculateProfileCompletion(
        state.profile,
        state.skills,
        state.education,
        state.experience,
        state.projects,
        state.certifications,
        state.languages,
        state.socialLinks,
        state.preferences
      );

      // Re-map the section completions
      const updatedSections = state.profile.completion.sections.map((sec) => {
        const isCompleted = audit.completedSections.some((c) => c.id === sec.id);
        return { ...sec, completed: isCompleted };
      });

      return {
        profile: {
          ...state.profile,
          completion: {
            percentage: audit.percentage,
            sections: updatedSections,
          },
        },
        autosaveTimestamp: new Date().toLocaleTimeString(),
      };
    });
  },

  // Skills Actions
  addSkill: (newSkill) => {
    const skill: Skill = {
      ...newSkill,
      id: `sk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedSkills = [...state.skills, skill];
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, skillsCount: updatedSkills.length },
          }
        : null;
      return { skills: updatedSkills, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  updateSkill: (id, updatedFields) => {
    set((state) => {
      const updatedSkills = state.skills.map((s) =>
        s.id === id
          ? { ...s, ...updatedFields, updatedAt: new Date().toISOString() }
          : s
      );
      return { skills: updatedSkills };
    });
    get().syncCompletion();
  },

  deleteSkill: (id) => {
    set((state) => {
      const updatedSkills = state.skills.filter((s) => s.id !== id);
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, skillsCount: updatedSkills.length },
          }
        : null;
      return { skills: updatedSkills, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  // Education Actions
  addEducation: (newEdu) => {
    const edu: Education = {
      ...newEdu,
      id: `edu_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedEdu = [...state.education, edu];
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, educationCount: updatedEdu.length },
          }
        : null;
      return { education: updatedEdu, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  updateEducation: (id, updatedFields) => {
    set((state) => {
      const updatedEdu = state.education.map((e) =>
        e.id === id
          ? { ...e, ...updatedFields, updatedAt: new Date().toISOString() }
          : e
      );
      return { education: updatedEdu };
    });
    get().syncCompletion();
  },

  deleteEducation: (id) => {
    set((state) => {
      const updatedEdu = state.education.filter((e) => e.id !== id);
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, educationCount: updatedEdu.length },
          }
        : null;
      return { education: updatedEdu, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  // Experience Actions
  addExperience: (newExp) => {
    const exp: Experience = {
      ...newExp,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedExp = [...state.experience, exp];
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, experienceCount: updatedExp.length },
          }
        : null;
      return { experience: updatedExp, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  updateExperience: (id, updatedFields) => {
    set((state) => {
      const updatedExp = state.experience.map((e) =>
        e.id === id
          ? { ...e, ...updatedFields, updatedAt: new Date().toISOString() }
          : e
      );
      return { experience: updatedExp };
    });
    get().syncCompletion();
  },

  deleteExperience: (id) => {
    set((state) => {
      const updatedExp = state.experience.filter((e) => e.id !== id);
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, experienceCount: updatedExp.length },
          }
        : null;
      return { experience: updatedExp, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  // Projects Actions
  addProject: (newProject) => {
    const project: Project = {
      ...newProject,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedProjects = [...state.projects, project];
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, projectsCount: updatedProjects.length },
          }
        : null;
      return { projects: updatedProjects, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  updateProject: (id, updatedFields) => {
    set((state) => {
      const updatedProjects = state.projects.map((p) =>
        p.id === id
          ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() }
          : p
      );
      return { projects: updatedProjects };
    });
    get().syncCompletion();
  },

  deleteProject: (id) => {
    set((state) => {
      const updatedProjects = state.projects.filter((p) => p.id !== id);
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, projectsCount: updatedProjects.length },
          }
        : null;
      return { projects: updatedProjects, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  toggleFeaturedProject: (id) => {
    set((state) => {
      const updatedProjects = state.projects.map((p) =>
        p.id === id ? { ...p, featured: !p.featured, updatedAt: new Date().toISOString() } : p
      );
      return { projects: updatedProjects };
    });
  },

  // Certifications Actions
  addCertification: (newCert) => {
    const cert: Certification = {
      ...newCert,
      id: `cert_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedCerts = [...state.certifications, cert];
      const updatedProfile = state.profile
        ? {
            ...state.profile,
            stats: { ...state.profile.stats, certificationsCount: updatedCerts.length },
          }
        : null;
      return { certifications: updatedCerts, profile: updatedProfile };
    });
    get().syncCompletion();
  },

  updateCertification: (id, updatedFields) => {
    set((state) => {
      const updatedCerts = state.certifications.map((c) =>
        c.id === id
          ? { ...c, ...updatedFields, updatedAt: new Date().toISOString() }
          : c
      );
      return { certifications: updatedCerts };
    });
    get().syncCompletion();
  },

  deleteCertification: (id) => {
    set((state) => {
      const updatedCerts = state.certifications.filter((c) => c.id !== id);
      return { certifications: updatedCerts };
    });
    get().syncCompletion();
  },

  // Languages Actions
  addLanguage: (newLang) => {
    const lang: Language = {
      ...newLang,
      id: `lang_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => ({ languages: [...state.languages, lang] }));
    get().syncCompletion();
  },

  updateLanguage: (id, updatedFields) => {
    set((state) => {
      const updatedLangs = state.languages.map((l) =>
        l.id === id
          ? { ...l, ...updatedFields, updatedAt: new Date().toISOString() }
          : l
      );
      return { languages: updatedLangs };
    });
    get().syncCompletion();
  },

  deleteLanguage: (id) => {
    set((state) => ({ languages: state.languages.filter((l) => l.id !== id) }));
    get().syncCompletion();
  },

  // Social Links Actions
  addSocialLink: (newLink) => {
    const link: SocialLink = {
      ...newLink,
      id: `soc_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    set((state) => {
      const updatedLinks = [...state.socialLinks, link];
      return { socialLinks: updatedLinks };
    });
    get().syncCompletion();
  },

  updateSocialLink: (id, updatedFields) => {
    set((state) => {
      const updatedLinks = state.socialLinks.map((l) =>
        l.id === id
          ? { ...l, ...updatedFields, updatedAt: new Date().toISOString() }
          : l
      );
      return { socialLinks: updatedLinks };
    });
    get().syncCompletion();
  },

  deleteSocialLink: (id) => {
    set((state) => ({ socialLinks: state.socialLinks.filter((l) => l.id !== id) }));
    get().syncCompletion();
  },

  // Preferences Actions
  updatePreferences: (updatedFields) => {
    set((state) => {
      const currentPref = state.preferences || {
        id: "pref_1",
        preferredRole: "",
        employmentType: "full-time",
        preferredLocation: "",
        workMode: "remote",
        expectedSalary: "",
        currency: "INR",
        noticePeriod: "",
        openToWork: true,
        visaSponsorshipRequired: false,
        relocationWillingness: true,
        preferredIndustry: "",
        preferredCompanySize: "",
        preferredShift: "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const updatedPref: CareerPreference = {
        ...currentPref,
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      };

      return { preferences: updatedPref };
    });
    get().syncCompletion();
  },

  // Avatar Actions
  uploadAvatar: (url) => {
    set((state) => {
      if (!state.profile) return {};
      return {
        profile: {
          ...state.profile,
          avatar: {
            ...state.profile.avatar,
            url,
          },
        },
      };
    });
    get().syncCompletion();
  },

  removeAvatar: () => {
    set((state) => {
      if (!state.profile) return {};
      return {
        profile: {
          ...state.profile,
          avatar: {
            ...state.profile.avatar,
            url: null,
          },
        },
      };
    });
    get().syncCompletion();
  },
}));
