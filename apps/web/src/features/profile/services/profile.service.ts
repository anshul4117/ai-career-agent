/** Profile Module — Mock Service Layer */

import type { Profile, PersonalInfo, ContactInfo, CareerInfo } from "../types/profile.types";
import type { Skill } from "../types/skill.types";
import type { Education } from "../types/education.types";
import type { Experience } from "../types/experience.types";
import type { Project } from "../types/project.types";
import { MOCK_PROFILE } from "../data/profile.mock";
import { MOCK_SKILLS } from "../data/skills.mock";
import { MOCK_EDUCATION } from "../data/education.mock";
import { MOCK_EXPERIENCE } from "../data/experience.mock";
import { MOCK_PROJECTS } from "../data/projects.mock";

// Simulated delay for mock API calls
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  async getProfile(): Promise<Profile> {
    await delay(200);
    return { ...MOCK_PROFILE };
  },

  async updatePersonalInfo(data: PersonalInfo): Promise<Profile> {
    await delay(300);
    return { ...MOCK_PROFILE, personal: data, updatedAt: new Date().toISOString() };
  },

  async updateContactInfo(data: ContactInfo): Promise<Profile> {
    await delay(300);
    return { ...MOCK_PROFILE, contact: data, updatedAt: new Date().toISOString() };
  },

  async updateCareerInfo(data: CareerInfo): Promise<Profile> {
    await delay(300);
    return { ...MOCK_PROFILE, career: data, updatedAt: new Date().toISOString() };
  },

  async uploadAvatar(file: File): Promise<string> {
    await delay(500);
    return file ? "/placeholder-avatar.png" : "/placeholder-avatar.png";
  },

  // Skills Mock APIs
  async getSkills(): Promise<Skill[]> {
    await delay(200);
    return [...MOCK_SKILLS];
  },

  async createSkill(skill: Omit<Skill, "id" | "createdAt" | "updatedAt">): Promise<Skill> {
    await delay(300);
    return {
      ...skill,
      id: `sk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateSkill(id: string, skill: Partial<Omit<Skill, "id" | "createdAt" | "updatedAt">>): Promise<Skill> {
    await delay(300);
    const original = MOCK_SKILLS.find((s) => s.id === id) || MOCK_SKILLS[0];
    return {
      ...original,
      ...skill,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteSkill(id: string): Promise<boolean> {
    await delay(200);
    return !!id;
  },

  // Education Mock APIs
  async getEducation(): Promise<Education[]> {
    await delay(200);
    return [...MOCK_EDUCATION];
  },

  async createEducation(edu: Omit<Education, "id" | "createdAt" | "updatedAt">): Promise<Education> {
    await delay(300);
    return {
      ...edu,
      id: `edu_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateEducation(id: string, edu: Partial<Omit<Education, "id" | "createdAt" | "updatedAt">>): Promise<Education> {
    await delay(300);
    const original = MOCK_EDUCATION.find((e) => e.id === id) || MOCK_EDUCATION[0];
    return {
      ...original,
      ...edu,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteEducation(id: string): Promise<boolean> {
    await delay(200);
    return !!id;
  },

  // Experience Mock APIs
  async getExperience(): Promise<Experience[]> {
    await delay(200);
    return [...MOCK_EXPERIENCE];
  },

  async createExperience(exp: Omit<Experience, "id" | "createdAt" | "updatedAt">): Promise<Experience> {
    await delay(300);
    return {
      ...exp,
      id: `exp_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateExperience(id: string, exp: Partial<Omit<Experience, "id" | "createdAt" | "updatedAt">>): Promise<Experience> {
    await delay(300);
    const original = MOCK_EXPERIENCE.find((e) => e.id === id) || MOCK_EXPERIENCE[0];
    return {
      ...original,
      ...exp,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteExperience(id: string): Promise<boolean> {
    await delay(200);
    return !!id;
  },

  // Projects Mock APIs
  async getProjects(): Promise<Project[]> {
    await delay(200);
    return [...MOCK_PROJECTS];
  },

  async createProject(project: Omit<Project, "id" | "createdAt" | "updatedAt">): Promise<Project> {
    await delay(300);
    return {
      ...project,
      id: `proj_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  },

  async updateProject(id: string, project: Partial<Omit<Project, "id" | "createdAt" | "updatedAt">>): Promise<Project> {
    await delay(300);
    const original = MOCK_PROJECTS.find((p) => p.id === id) || MOCK_PROJECTS[0];
    return {
      ...original,
      ...project,
      updatedAt: new Date().toISOString(),
    };
  },

  async deleteProject(id: string): Promise<boolean> {
    await delay(200);
    return !!id;
  },
};
