/** Profile Module — Zustand Store (Connected to NestJS API) */

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
import {
  profileService,
  type FullProfileResponse,
} from "../services/profile.service";
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

  setProfile: (profile: Profile | null) => Promise<void>;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  loadProfile: () => Promise<void>;
  saveProfileToServer: () => Promise<FullProfileResponse | void>;
  reset: () => void;

  // Dynamic sync helper
  syncCompletion: () => void;

  // Skills CRUD
  addSkill: (
    skill: Omit<Skill, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Skill>;
  updateSkill: (
    id: string,
    skill: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Skill>;
  deleteSkill: (id: string) => Promise<boolean>;

  // Education CRUD
  addEducation: (
    edu: Omit<Education, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Education>;
  updateEducation: (
    id: string,
    edu: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Education>;
  deleteEducation: (id: string) => Promise<boolean>;

  // Experience CRUD
  addExperience: (
    exp: Omit<Experience, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Experience>;
  updateExperience: (
    id: string,
    exp: Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Experience>;
  deleteExperience: (id: string) => Promise<boolean>;

  // Projects CRUD
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Project>;
  updateProject: (
    id: string,
    project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Project>;
  deleteProject: (id: string) => Promise<boolean>;
  toggleFeaturedProject: (id: string) => Promise<void>;

  // Certifications CRUD
  addCertification: (
    cert: Omit<Certification, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Certification>;
  updateCertification: (
    id: string,
    cert: Partial<Omit<Certification, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Certification>;
  deleteCertification: (id: string) => Promise<boolean>;

  // Languages CRUD
  addLanguage: (
    lang: Omit<Language, "id" | "createdAt" | "updatedAt">,
  ) => Promise<Language>;
  updateLanguage: (
    id: string,
    lang: Partial<Omit<Language, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Language>;
  deleteLanguage: (id: string) => Promise<boolean>;

  // Social Links CRUD
  addSocialLink: (
    link: Omit<SocialLink, "id" | "createdAt" | "updatedAt">,
  ) => Promise<SocialLink>;
  updateSocialLink: (
    id: string,
    link: Partial<Omit<SocialLink, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<SocialLink>;
  deleteSocialLink: (id: string) => Promise<boolean>;

  // Preferences Update
  updatePreferences: (
    pref: Omit<CareerPreference, "id" | "createdAt" | "updatedAt">,
  ) => Promise<CareerPreference>;

  // Avatar upload/remove
  uploadAvatar: (url: string | null) => Promise<void>;
  removeAvatar: () => Promise<void>;
}

export const useProfileStore = create<ProfileState>((originalSet, get) => {
  const set = (
    updater:
      Partial<ProfileState> | ((state: ProfileState) => Partial<ProfileState>),
  ) => {
    originalSet((state) => {
      const partialUpdate =
        typeof updater === "function" ? updater(state) : updater;
      const merged = { ...state, ...partialUpdate };

      if (merged.profile) {
        const audit = calculateProfileCompletion(
          merged.profile,
          merged.skills,
          merged.education,
          merged.experience,
          merged.projects,
          merged.certifications,
          merged.languages,
          merged.socialLinks,
          merged.preferences,
        );

        const updatedSections = (merged.profile.completion?.sections || []).map(
          (sec) => {
            const isCompleted = audit.completedSections.some(
              (c) => c.id === sec.id,
            );
            return { ...sec, completed: isCompleted };
          },
        );

        merged.profile = {
          ...merged.profile,
          completion: {
            percentage: audit.percentage,
            sections:
              updatedSections.length > 0
                ? updatedSections
                : audit.checklist.map((c) => ({
                    id: c.id,
                    label: c.label,
                    completed: c.completed,
                  })),
          },
        };
        merged.autosaveTimestamp = new Date().toLocaleTimeString();
      }

      return merged;
    });
  };

  return {
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

    setProfile: async (profile) => {
      if (!profile) {
        set({ profile: null, error: null });
        return;
      }
      try {
        const res = await profileService.saveProfile(profile);
        set({
          profile: res.profile,
          skills: res.skills || get().skills,
          education: res.education || get().education,
          experience: res.experience || get().experience,
          projects: res.projects || get().projects,
          certifications: res.certifications || get().certifications,
          languages: res.languages || get().languages,
          socialLinks: res.socialLinks || get().socialLinks,
          preferences:
            res.preferences !== undefined ? res.preferences : get().preferences,
          error: null,
        });
        get().syncCompletion();
      } catch (err) {
        console.error("Failed to persist profile updates:", err);
        throw err;
      }
    },

    setIsLoading: (isLoading) => set({ isLoading }),
    setError: (error) => set({ error, isLoading: false }),

    loadProfile: async () => {
      set({ isLoading: true, error: null });
      try {
        const data = await profileService.getProfile();
        set({
          profile: data.profile,
          skills: data.skills || [],
          education: data.education || [],
          experience: data.experience || [],
          projects: data.projects || [],
          certifications: data.certifications || [],
          languages: data.languages || [],
          socialLinks: data.socialLinks || [],
          preferences: data.preferences,
          isLoading: false,
          error: null,
        });
        get().syncCompletion();
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load profile. Please try again.";
        set({
          isLoading: false,
          error: message,
        });
      }
    },

    saveProfileToServer: async () => {
      const currentProfile = get().profile;
      if (!currentProfile) return;
      const res = await profileService.saveProfile(currentProfile);
      set({
        profile: res.profile,
        error: null,
      });
      get().syncCompletion();
      return res;
    },

    reset: () =>
      set({
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
        autosaveTimestamp: null,
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
          state.preferences,
        );

        const updatedSections = (state.profile.completion?.sections || []).map(
          (sec) => {
            const isCompleted = audit.completedSections.some(
              (c) => c.id === sec.id,
            );
            return { ...sec, completed: isCompleted };
          },
        );

        return {
          profile: {
            ...state.profile,
            completion: {
              percentage: audit.percentage,
              sections:
                updatedSections.length > 0
                  ? updatedSections
                  : audit.checklist.map((c) => ({
                      id: c.id,
                      label: c.label,
                      completed: c.completed,
                    })),
            },
          },
          autosaveTimestamp: new Date().toLocaleTimeString(),
        };
      });
    },

    // Skills Actions
    addSkill: async (newSkill) => {
      try {
        const saved = await profileService.createSkill(newSkill);
        set((state) => {
          const updatedSkills = [...state.skills, saved];
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  skillsCount: updatedSkills.length,
                },
              }
            : null;
          return { skills: updatedSkills, profile: updatedProfile };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add skill:", err);
        throw err;
      }
    },

    updateSkill: async (id, updatedFields) => {
      try {
        const updated = await profileService.updateSkill(id, updatedFields);
        set((state) => {
          const updatedSkills = state.skills.map((s) =>
            s.id === id ? updated : s,
          );
          return { skills: updatedSkills };
        });
        get().syncCompletion();
        return updated;
      } catch (err) {
        console.error("Failed to update skill:", err);
        throw err;
      }
    },

    deleteSkill: async (id) => {
      try {
        await profileService.deleteSkill(id);
        set((state) => {
          const updatedSkills = state.skills.filter((s) => s.id !== id);
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  skillsCount: updatedSkills.length,
                },
              }
            : null;
          return { skills: updatedSkills, profile: updatedProfile };
        });
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete skill:", err);
        throw err;
      }
    },

    // Education Actions
    addEducation: async (newEdu) => {
      try {
        const saved = await profileService.createEducation(newEdu);
        set((state) => {
          let updatedEdu = [...state.education];
          if (saved.highestEducation) {
            updatedEdu = updatedEdu.map((e) => ({
              ...e,
              highestEducation: false,
            }));
          }
          updatedEdu.push(saved);
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  educationCount: updatedEdu.length,
                },
              }
            : null;
          return { education: updatedEdu, profile: updatedProfile };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add education:", err);
        throw err;
      }
    },

    updateEducation: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateEducation(id, updatedFields);
        set((state) => {
          const updatedEdu = state.education.map((e) => {
            let updated = e.id === id ? saved : e;
            if (saved.highestEducation && e.id !== id) {
              updated = { ...updated, highestEducation: false };
            }
            return updated;
          });
          return { education: updatedEdu };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update education:", err);
        throw err;
      }
    },

    deleteEducation: async (id) => {
      try {
        await profileService.deleteEducation(id);
        set((state) => {
          const updatedEdu = state.education.filter((e) => e.id !== id);
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  educationCount: updatedEdu.length,
                },
              }
            : null;
          return { education: updatedEdu, profile: updatedProfile };
        });
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete education:", err);
        throw err;
      }
    },

    // Experience Actions
    addExperience: async (newExp) => {
      try {
        const saved = await profileService.createExperience(newExp);
        set((state) => {
          const updatedExp = [...state.experience, saved];
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  experienceCount: updatedExp.length,
                },
              }
            : null;
          return { experience: updatedExp, profile: updatedProfile };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add experience:", err);
        throw err;
      }
    },

    updateExperience: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateExperience(id, updatedFields);
        set((state) => {
          const updatedExp = state.experience.map((e) =>
            e.id === id ? saved : e,
          );
          return { experience: updatedExp };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update experience:", err);
        throw err;
      }
    },

    deleteExperience: async (id) => {
      try {
        await profileService.deleteExperience(id);
        set((state) => {
          const updatedExp = state.experience.filter((e) => e.id !== id);
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  experienceCount: updatedExp.length,
                },
              }
            : null;
          return { experience: updatedExp, profile: updatedProfile };
        });
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete experience:", err);
        throw err;
      }
    },

    // Projects Actions
    addProject: async (newProject) => {
      try {
        const saved = await profileService.createProject(newProject);
        set((state) => {
          const updatedProjects = [...state.projects, saved];
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  projectsCount: updatedProjects.length,
                },
              }
            : null;
          return { projects: updatedProjects, profile: updatedProfile };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add project:", err);
        throw err;
      }
    },

    updateProject: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateProject(id, updatedFields);
        set((state) => {
          const updatedProjects = state.projects.map((p) =>
            p.id === id ? saved : p,
          );
          return { projects: updatedProjects };
        });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update project:", err);
        throw err;
      }
    },

    deleteProject: async (id) => {
      try {
        await profileService.deleteProject(id);
        set((state) => {
          const updatedProjects = state.projects.filter((p) => p.id !== id);
          const updatedProfile = state.profile
            ? {
                ...state.profile,
                stats: {
                  ...state.profile.stats,
                  projectsCount: updatedProjects.length,
                },
              }
            : null;
          return { projects: updatedProjects, profile: updatedProfile };
        });
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete project:", err);
        throw err;
      }
    },

    toggleFeaturedProject: async (id) => {
      const current = get().projects.find((p) => p.id === id);
      if (!current) return;
      const newFeatured = !current.featured;
      try {
        const saved = await profileService.updateProject(id, {
          featured: newFeatured,
        });
        set((state) => ({
          projects: state.projects.map((p) => (p.id === id ? saved : p)),
        }));
      } catch (err) {
        console.error("Failed to toggle featured project:", err);
        throw err;
      }
    },

    // Certifications Actions
    addCertification: async (newCert) => {
      try {
        const saved = await profileService.createCertification(newCert);
        set((state) => ({
          certifications: [...state.certifications, saved],
        }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add certification:", err);
        throw err;
      }
    },

    updateCertification: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateCertification(
          id,
          updatedFields,
        );
        set((state) => ({
          certifications: state.certifications.map((c) =>
            c.id === id ? saved : c,
          ),
        }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update certification:", err);
        throw err;
      }
    },

    deleteCertification: async (id) => {
      try {
        await profileService.deleteCertification(id);
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        }));
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete certification:", err);
        throw err;
      }
    },

    // Languages Actions
    addLanguage: async (newLang) => {
      try {
        const saved = await profileService.createLanguage(newLang);
        set((state) => ({ languages: [...state.languages, saved] }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add language:", err);
        throw err;
      }
    },

    updateLanguage: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateLanguage(id, updatedFields);
        set((state) => ({
          languages: state.languages.map((l) => (l.id === id ? saved : l)),
        }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update language:", err);
        throw err;
      }
    },

    deleteLanguage: async (id) => {
      try {
        await profileService.deleteLanguage(id);
        set((state) => ({
          languages: state.languages.filter((l) => l.id !== id),
        }));
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete language:", err);
        throw err;
      }
    },

    // Social Links Actions
    addSocialLink: async (newLink) => {
      try {
        const saved = await profileService.createSocialLink(newLink);
        set((state) => ({
          socialLinks: [...state.socialLinks, saved],
        }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to add social link:", err);
        throw err;
      }
    },

    updateSocialLink: async (id, updatedFields) => {
      try {
        const saved = await profileService.updateSocialLink(id, updatedFields);
        set((state) => ({
          socialLinks: state.socialLinks.map((l) => (l.id === id ? saved : l)),
        }));
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update social link:", err);
        throw err;
      }
    },

    deleteSocialLink: async (id) => {
      try {
        await profileService.deleteSocialLink(id);
        set((state) => ({
          socialLinks: state.socialLinks.filter((l) => l.id !== id),
        }));
        get().syncCompletion();
        return true;
      } catch (err) {
        console.error("Failed to delete social link:", err);
        throw err;
      }
    },

    // Preferences Actions
    updatePreferences: async (updatedFields) => {
      try {
        const saved = await profileService.updatePreferences(updatedFields);
        set({ preferences: saved });
        get().syncCompletion();
        return saved;
      } catch (err) {
        console.error("Failed to update career preferences:", err);
        throw err;
      }
    },

    // Avatar Actions
    uploadAvatar: async (url) => {
      try {
        if (url !== undefined) {
          await profileService.patchProfile({ avatarUrl: url });
        }
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
      } catch (err) {
        console.error("Failed to update avatar:", err);
        throw err;
      }
    },

    removeAvatar: async () => {
      try {
        await profileService.patchProfile({ avatarUrl: null });
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
      } catch (err) {
        console.error("Failed to remove avatar:", err);
        throw err;
      }
    },
  };
});
