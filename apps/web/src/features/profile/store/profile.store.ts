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
import { profileService } from "../services/profile.service";
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
  loadProfile: () => Promise<void>;
  saveProfileToServer: () => Promise<void>;
  reset: () => void;

  // Dynamic sync helper
  syncCompletion: () => void;

  // Skills CRUD
  addSkill: (skill: Omit<Skill, "id" | "createdAt" | "updatedAt">) => void;
  updateSkill: (
    id: string,
    skill: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteSkill: (id: string) => void;

  // Education CRUD
  addEducation: (
    edu: Omit<Education, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateEducation: (
    id: string,
    edu: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteEducation: (id: string) => void;

  // Experience CRUD
  addExperience: (
    exp: Omit<Experience, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateExperience: (
    id: string,
    exp: Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteExperience: (id: string) => void;

  // Projects CRUD
  addProject: (
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateProject: (
    id: string,
    project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteProject: (id: string) => void;
  toggleFeaturedProject: (id: string) => void;

  // Certifications CRUD
  addCertification: (
    cert: Omit<Certification, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateCertification: (
    id: string,
    cert: Partial<Omit<Certification, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteCertification: (id: string) => void;

  // Languages CRUD
  addLanguage: (lang: Omit<Language, "id" | "createdAt" | "updatedAt">) => void;
  updateLanguage: (
    id: string,
    lang: Partial<Omit<Language, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteLanguage: (id: string) => void;

  // Social Links CRUD
  addSocialLink: (
    link: Omit<SocialLink, "id" | "createdAt" | "updatedAt">,
  ) => void;
  updateSocialLink: (
    id: string,
    link: Partial<Omit<SocialLink, "id" | "createdAt" | "updatedAt">>,
  ) => void;
  deleteSocialLink: (id: string) => void;

  // Preferences Update
  updatePreferences: (
    pref: Omit<CareerPreference, "id" | "createdAt" | "updatedAt">,
  ) => void;

  // Avatar upload/remove
  uploadAvatar: (url: string | null) => void;
  removeAvatar: () => void;
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

        const updatedSections = merged.profile.completion.sections.map(
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
            sections: updatedSections,
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

    setProfile: (profile) => {
      set({ profile, error: null });
      if (profile) {
        profileService.saveProfile(profile).catch((err) => {
          console.error("Failed to auto-persist profile updates:", err);
        });
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
      await profileService.saveProfile(currentProfile);
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

        // Re-map the section completions
        const updatedSections = state.profile.completion.sections.map((sec) => {
          const isCompleted = audit.completedSections.some(
            (c) => c.id === sec.id,
          );
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
      const tempId = `sk_${Date.now()}`;
      const optimisticSkill: Skill = {
        ...newSkill,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        const updatedSkills = [...state.skills, optimisticSkill];
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

      profileService
        .createSkill(newSkill)
        .then((saved) => {
          set((state) => ({
            skills: state.skills.map((s) => (s.id === tempId ? saved : s)),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add skill:", err);
        });
    },

    updateSkill: (id, updatedFields) => {
      set((state) => {
        const updatedSkills = state.skills.map((s) =>
          s.id === id
            ? { ...s, ...updatedFields, updatedAt: new Date().toISOString() }
            : s,
        );
        return { skills: updatedSkills };
      });
      get().syncCompletion();

      profileService.updateSkill(id, updatedFields).catch((err) => {
        console.error("Failed to update skill:", err);
      });
    },

    deleteSkill: (id) => {
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

      profileService.deleteSkill(id).catch((err) => {
        console.error("Failed to delete skill:", err);
      });
    },

    // Education Actions
    addEducation: (newEdu) => {
      const tempId = `edu_${Date.now()}`;
      set((state) => {
        let updatedEdu = [...state.education];
        if (newEdu.highestEducation) {
          updatedEdu = updatedEdu.map((e) => ({
            ...e,
            highestEducation: false,
          }));
        }
        const edu: Education = {
          ...newEdu,
          id: tempId,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        updatedEdu.push(edu);
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

      profileService
        .createEducation(newEdu)
        .then((saved) => {
          set((state) => ({
            education: state.education.map((e) =>
              e.id === tempId ? saved : e,
            ),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add education:", err);
        });
    },

    updateEducation: (id, updatedFields) => {
      set((state) => {
        const updatedEdu = state.education.map((e) => {
          let updated =
            e.id === id
              ? { ...e, ...updatedFields, updatedAt: new Date().toISOString() }
              : e;
          if (updatedFields.highestEducation && e.id !== id) {
            updated = { ...updated, highestEducation: false };
          }
          return updated;
        });
        return { education: updatedEdu };
      });
      get().syncCompletion();

      profileService.updateEducation(id, updatedFields).catch((err) => {
        console.error("Failed to update education:", err);
      });
    },

    deleteEducation: (id) => {
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

      profileService.deleteEducation(id).catch((err) => {
        console.error("Failed to delete education:", err);
      });
    },

    // Experience Actions
    addExperience: (newExp) => {
      const tempId = `exp_${Date.now()}`;
      const exp: Experience = {
        ...newExp,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        const updatedExp = [...state.experience, exp];
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

      profileService
        .createExperience(newExp)
        .then((saved) => {
          set((state) => ({
            experience: state.experience.map((e) =>
              e.id === tempId ? saved : e,
            ),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add experience:", err);
        });
    },

    updateExperience: (id, updatedFields) => {
      set((state) => {
        const updatedExp = state.experience.map((e) =>
          e.id === id
            ? { ...e, ...updatedFields, updatedAt: new Date().toISOString() }
            : e,
        );
        return { experience: updatedExp };
      });
      get().syncCompletion();

      profileService.updateExperience(id, updatedFields).catch((err) => {
        console.error("Failed to update experience:", err);
      });
    },

    deleteExperience: (id) => {
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

      profileService.deleteExperience(id).catch((err) => {
        console.error("Failed to delete experience:", err);
      });
    },

    // Projects Actions
    addProject: (newProject) => {
      const tempId = `proj_${Date.now()}`;
      const project: Project = {
        ...newProject,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        const updatedProjects = [...state.projects, project];
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

      profileService
        .createProject(newProject)
        .then((saved) => {
          set((state) => ({
            projects: state.projects.map((p) => (p.id === tempId ? saved : p)),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add project:", err);
        });
    },

    updateProject: (id, updatedFields) => {
      set((state) => {
        const updatedProjects = state.projects.map((p) =>
          p.id === id
            ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() }
            : p,
        );
        return { projects: updatedProjects };
      });
      get().syncCompletion();

      profileService.updateProject(id, updatedFields).catch((err) => {
        console.error("Failed to update project:", err);
      });
    },

    deleteProject: (id) => {
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

      profileService.deleteProject(id).catch((err) => {
        console.error("Failed to delete project:", err);
      });
    },

    toggleFeaturedProject: (id) => {
      const current = get().projects.find((p) => p.id === id);
      const newFeatured = !current?.featured;

      set((state) => {
        const updatedProjects = state.projects.map((p) =>
          p.id === id
            ? {
                ...p,
                featured: newFeatured,
                updatedAt: new Date().toISOString(),
              }
            : p,
        );
        return { projects: updatedProjects };
      });

      profileService
        .updateProject(id, { featured: newFeatured })
        .catch((err) => {
          console.error("Failed to toggle featured project:", err);
        });
    },

    // Certifications Actions
    addCertification: (newCert) => {
      const tempId = `cert_${Date.now()}`;
      const cert: Certification = {
        ...newCert,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => {
        const updatedCerts = [...state.certifications, cert];
        const updatedProfile = state.profile
          ? {
              ...state.profile,
              stats: {
                ...state.profile.stats,
                certificationsCount: updatedCerts.length,
              },
            }
          : null;
        return { certifications: updatedCerts, profile: updatedProfile };
      });
      get().syncCompletion();

      profileService
        .createCertification(newCert)
        .then((saved) => {
          set((state) => ({
            certifications: state.certifications.map((c) =>
              c.id === tempId ? saved : c,
            ),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add certification:", err);
        });
    },

    updateCertification: (id, updatedFields) => {
      set((state) => {
        const updatedCerts = state.certifications.map((c) =>
          c.id === id
            ? { ...c, ...updatedFields, updatedAt: new Date().toISOString() }
            : c,
        );
        return { certifications: updatedCerts };
      });
      get().syncCompletion();

      profileService.updateCertification(id, updatedFields).catch((err) => {
        console.error("Failed to update certification:", err);
      });
    },

    deleteCertification: (id) => {
      set((state) => {
        const updatedCerts = state.certifications.filter((c) => c.id !== id);
        return { certifications: updatedCerts };
      });
      get().syncCompletion();

      profileService.deleteCertification(id).catch((err) => {
        console.error("Failed to delete certification:", err);
      });
    },

    // Languages Actions
    addLanguage: (newLang) => {
      const tempId = `lang_${Date.now()}`;
      const lang: Language = {
        ...newLang,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({ languages: [...state.languages, lang] }));
      get().syncCompletion();

      profileService
        .createLanguage(newLang)
        .then((saved) => {
          set((state) => ({
            languages: state.languages.map((l) =>
              l.id === tempId ? saved : l,
            ),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add language:", err);
        });
    },

    updateLanguage: (id, updatedFields) => {
      set((state) => {
        const updatedLangs = state.languages.map((l) =>
          l.id === id
            ? { ...l, ...updatedFields, updatedAt: new Date().toISOString() }
            : l,
        );
        return { languages: updatedLangs };
      });
      get().syncCompletion();

      profileService.updateLanguage(id, updatedFields).catch((err) => {
        console.error("Failed to update language:", err);
      });
    },

    deleteLanguage: (id) => {
      set((state) => ({
        languages: state.languages.filter((l) => l.id !== id),
      }));
      get().syncCompletion();

      profileService.deleteLanguage(id).catch((err) => {
        console.error("Failed to delete language:", err);
      });
    },

    // Social Links Actions
    addSocialLink: (newLink) => {
      const tempId = `soc_${Date.now()}`;
      const link: SocialLink = {
        ...newLink,
        id: tempId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      set((state) => ({
        socialLinks: [...state.socialLinks, link],
      }));
      get().syncCompletion();

      profileService
        .createSocialLink(newLink)
        .then((saved) => {
          set((state) => ({
            socialLinks: state.socialLinks.map((sl) =>
              sl.id === tempId ? saved : sl,
            ),
          }));
          get().syncCompletion();
        })
        .catch((err) => {
          console.error("Failed to add social link:", err);
        });
    },

    updateSocialLink: (id, updatedFields) => {
      set((state) => {
        const updatedLinks = state.socialLinks.map((l) =>
          l.id === id
            ? { ...l, ...updatedFields, updatedAt: new Date().toISOString() }
            : l,
        );
        return { socialLinks: updatedLinks };
      });
      get().syncCompletion();

      profileService.updateSocialLink(id, updatedFields).catch((err) => {
        console.error("Failed to update social link:", err);
      });
    },

    deleteSocialLink: (id) => {
      set((state) => ({
        socialLinks: state.socialLinks.filter((l) => l.id !== id),
      }));
      get().syncCompletion();

      profileService.deleteSocialLink(id).catch((err) => {
        console.error("Failed to delete social link:", err);
      });
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

      profileService.updatePreferences(updatedFields).catch((err) => {
        console.error("Failed to update career preferences:", err);
      });
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

      if (url !== undefined) {
        profileService.patchProfile({ avatarUrl: url }).catch((err) => {
          console.error("Failed to update avatar:", err);
        });
      }
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

      profileService.patchProfile({ avatarUrl: null }).catch((err) => {
        console.error("Failed to remove avatar:", err);
      });
    },
  };
});
