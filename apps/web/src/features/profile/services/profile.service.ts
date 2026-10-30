/**
 * Profile Module — API Service Layer
 * Connects to NestJS Backend via apiClient (/api/v1/profile)
 */

import { apiClient } from "@/lib/api-client";
import type {
  Profile,
  PersonalInfo,
  ContactInfo,
  CareerInfo,
} from "../types/profile.types";
import type { Skill } from "../types/skill.types";
import type { Education } from "../types/education.types";
import type { Experience } from "../types/experience.types";
import type { Project } from "../types/project.types";
import type { Certification } from "../types/certification.types";
import type { Language } from "../types/language.types";
import type { SocialLink } from "../types/social-link.types";
import type { CareerPreference } from "../types/career-preference.types";

export interface FullProfileResponse {
  profile: Profile;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  projects: Project[];
  certifications: Certification[];
  languages: Language[];
  socialLinks: SocialLink[];
  preferences: CareerPreference | null;
}

export const profileService = {
  /**
   * Fetch complete profile and all related sub-sections
   */
  async getProfile(): Promise<FullProfileResponse> {
    return apiClient.get<FullProfileResponse>("/profile/me");
  },

  /**
   * Update full profile with all sub-sections
   */
  async updateProfile(
    payload: Record<string, unknown>,
  ): Promise<FullProfileResponse> {
    return apiClient.put<FullProfileResponse>("/profile/me", payload);
  },

  /**
   * Partial profile update
   */
  async patchProfile(
    payload: Record<string, unknown>,
  ): Promise<FullProfileResponse> {
    return apiClient.patch<FullProfileResponse>("/profile/me", payload);
  },

  /**
   * Persist current store Profile object
   */
  async saveProfile(profile: Profile): Promise<FullProfileResponse> {
    return apiClient.put<FullProfileResponse>("/profile/me", {
      personal: profile.personal,
      contact: profile.contact,
      career: profile.career,
      avatarUrl: profile.avatar.url,
      availability: profile.availability,
    });
  },

  async updatePersonalInfo(data: PersonalInfo): Promise<FullProfileResponse> {
    return apiClient.patch<FullProfileResponse>("/profile/me", {
      personal: data,
    });
  },

  async updateContactInfo(data: ContactInfo): Promise<FullProfileResponse> {
    return apiClient.patch<FullProfileResponse>("/profile/me", {
      contact: data,
    });
  },

  async updateCareerInfo(data: CareerInfo): Promise<FullProfileResponse> {
    return apiClient.patch<FullProfileResponse>("/profile/me", {
      career: data,
    });
  },

  async uploadAvatar(file: File): Promise<string> {
    // For file uploads, convert to base64 Data URL or pass through
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        const url = reader.result as string;
        try {
          await apiClient.patch("/profile/me", { avatarUrl: url });
          resolve(url);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  // ── Skills APIs ───────────────────────────────────────────────
  async getSkills(): Promise<Skill[]> {
    return apiClient.get<Skill[]>("/profile/skills");
  },

  async createSkill(
    skill: Omit<Skill, "id" | "createdAt" | "updatedAt">,
  ): Promise<Skill> {
    return apiClient.post<Skill>("/profile/skills", skill);
  },

  async updateSkill(
    id: string,
    skill: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Skill> {
    return apiClient.put<Skill>(`/profile/skills/${id}`, skill);
  },

  async deleteSkill(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/skills/${id}`);
    return true;
  },

  // ── Education APIs ────────────────────────────────────────────
  async getEducation(): Promise<Education[]> {
    return apiClient.get<Education[]>("/profile/education");
  },

  async createEducation(
    edu: Omit<Education, "id" | "createdAt" | "updatedAt">,
  ): Promise<Education> {
    return apiClient.post<Education>("/profile/education", edu);
  },

  async updateEducation(
    id: string,
    edu: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Education> {
    return apiClient.put<Education>(`/profile/education/${id}`, edu);
  },

  async deleteEducation(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/education/${id}`);
    return true;
  },

  // ── Experience APIs ───────────────────────────────────────────
  async getExperience(): Promise<Experience[]> {
    return apiClient.get<Experience[]>("/profile/experience");
  },

  async createExperience(
    exp: Omit<Experience, "id" | "createdAt" | "updatedAt">,
  ): Promise<Experience> {
    return apiClient.post<Experience>("/profile/experience", exp);
  },

  async updateExperience(
    id: string,
    exp: Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Experience> {
    return apiClient.put<Experience>(`/profile/experience/${id}`, exp);
  },

  async deleteExperience(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/experience/${id}`);
    return true;
  },

  // ── Projects APIs ─────────────────────────────────────────────
  async getProjects(): Promise<Project[]> {
    return apiClient.get<Project[]>("/profile/projects");
  },

  async createProject(
    project: Omit<Project, "id" | "createdAt" | "updatedAt">,
  ): Promise<Project> {
    return apiClient.post<Project>("/profile/projects", project);
  },

  async updateProject(
    id: string,
    project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Project> {
    return apiClient.put<Project>(`/profile/projects/${id}`, project);
  },

  async deleteProject(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/projects/${id}`);
    return true;
  },

  // ── Certifications APIs ───────────────────────────────────────
  async getCertifications(): Promise<Certification[]> {
    return apiClient.get<Certification[]>("/profile/certifications");
  },

  async createCertification(
    cert: Omit<Certification, "id" | "createdAt" | "updatedAt">,
  ): Promise<Certification> {
    return apiClient.post<Certification>("/profile/certifications", cert);
  },

  async updateCertification(
    id: string,
    cert: Partial<Omit<Certification, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Certification> {
    return apiClient.put<Certification>(`/profile/certifications/${id}`, cert);
  },

  async deleteCertification(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/certifications/${id}`);
    return true;
  },

  // ── Languages APIs ────────────────────────────────────────────
  async getLanguages(): Promise<Language[]> {
    return apiClient.get<Language[]>("/profile/languages");
  },

  async createLanguage(
    lang: Omit<Language, "id" | "createdAt" | "updatedAt">,
  ): Promise<Language> {
    return apiClient.post<Language>("/profile/languages", lang);
  },

  async updateLanguage(
    id: string,
    lang: Partial<Omit<Language, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Language> {
    return apiClient.put<Language>(`/profile/languages/${id}`, lang);
  },

  async deleteLanguage(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/languages/${id}`);
    return true;
  },

  // ── Social Links APIs ─────────────────────────────────────────
  async getSocialLinks(): Promise<SocialLink[]> {
    return apiClient.get<SocialLink[]>("/profile/social-links");
  },

  async createSocialLink(
    link: Omit<SocialLink, "id" | "createdAt" | "updatedAt">,
  ): Promise<SocialLink> {
    return apiClient.post<SocialLink>("/profile/social-links", link);
  },

  async updateSocialLink(
    id: string,
    link: Partial<Omit<SocialLink, "id" | "createdAt" | "updatedAt">>,
  ): Promise<SocialLink> {
    return apiClient.put<SocialLink>(`/profile/social-links/${id}`, link);
  },

  async deleteSocialLink(id: string): Promise<boolean> {
    await apiClient.delete(`/profile/social-links/${id}`);
    return true;
  },

  // ── Preferences APIs ──────────────────────────────────────────
  async getPreferences(): Promise<CareerPreference | null> {
    return apiClient.get<CareerPreference | null>("/profile/preferences");
  },

  async updatePreferences(
    pref: Omit<CareerPreference, "id" | "createdAt" | "updatedAt">,
  ): Promise<CareerPreference> {
    return apiClient.put<CareerPreference>("/profile/preferences", pref);
  },
};
