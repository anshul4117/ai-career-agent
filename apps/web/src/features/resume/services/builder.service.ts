import type { Resume, ResumeContent } from "../types/resume.types";
import { resumeService } from "./resume.service";
import { MOCK_PROFILE } from "@/features/profile/data/profile.mock";
import { MOCK_SKILLS } from "@/features/profile/data/skills.mock";
import { MOCK_EDUCATION } from "@/features/profile/data/education.mock";
import { MOCK_EXPERIENCE } from "@/features/profile/data/experience.mock";
import { MOCK_PROJECTS } from "@/features/profile/data/projects.mock";
import { MOCK_CERTIFICATIONS } from "@/features/profile/data/certifications.mock";
import { MOCK_LANGUAGES } from "@/features/profile/data/languages.mock";
import { MOCK_SOCIAL_LINKS } from "@/features/profile/data/social-links.mock";

export function getInitialResumeContent(): ResumeContent {
  return {
    personal: {
      firstName: MOCK_PROFILE.personal.firstName,
      lastName: MOCK_PROFILE.personal.lastName,
      headline: MOCK_PROFILE.career.headline,
      email: MOCK_PROFILE.contact.email,
      phone: MOCK_PROFILE.contact.phone,
      city: MOCK_PROFILE.contact.city,
      country: MOCK_PROFILE.contact.country,
    },
    summary: {
      summary: MOCK_PROFILE.career.summary,
    },
    experience: MOCK_EXPERIENCE.map((e) => ({
      id: e.id,
      companyName: e.companyName,
      jobTitle: e.jobTitle,
      location: e.location,
      startDate: e.startDate,
      endDate: e.endDate || "",
      currentPosition: e.currentPosition,
      description: e.description || "",
    })),
    education: MOCK_EDUCATION.map((e) => ({
      id: e.id,
      institution: e.institution,
      degree: e.degree,
      fieldOfStudy: e.fieldOfStudy,
      startDate: e.startDate,
      endDate: e.endDate || "",
      currentStudy: e.currentStudy,
      cgpa: e.cgpa || "",
    })),
    skills: MOCK_SKILLS.map((s) => ({
      id: s.id,
      name: s.name,
      yearsOfExperience: String(s.yearsOfExperience),
      level: "expert",
    })),
    projects: MOCK_PROJECTS.map((p) => ({
      id: p.id,
      title: p.title,
      role: p.role,
      description: p.description,
      techStack: p.techStack,
    })),
    certifications: MOCK_CERTIFICATIONS.map((c) => ({
      id: c.id,
      name: c.name,
      issuingOrganization: c.issuingOrganization,
      issueDate: c.issueDate,
    })),
    languages: MOCK_LANGUAGES.map((l) => ({
      id: l.id,
      language: l.language,
      speakingLevel: l.speakingLevel,
      nativeLanguage: l.nativeLanguage,
    })),
    socialLinks: MOCK_SOCIAL_LINKS.map((s) => ({
      id: s.id,
      platform: s.platform,
      url: s.url,
    })),
    sectionsOrder: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"],
    hiddenSections: [],
    customSections: [],
  };
}

export const builderService = {
  loadResume: async (id: string): Promise<Resume> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const resume = await resumeService.getOne(id);
          if (!resume) {
            reject(new Error("Resume not found"));
            return;
          }
          // If content doesn't exist, populate it with initial profile data
          if (!resume.content) {
            resume.content = getInitialResumeContent();
            // Save it so it gets stored in localStorage
            await resumeService.update(id, { content: resume.content });
          }
          resolve(resume);
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  },

  saveResume: async (resume: Resume): Promise<Resume> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const updated = await resumeService.update(resume.id, {
            title: resume.title,
            description: resume.description,
            templateId: resume.templateId,
            isDefault: resume.isDefault,
            status: resume.status,
            content: resume.content,
          });
          resolve(updated);
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  },

  updateSection: async (
    id: string, 
    sectionId: keyof ResumeContent, 
    data: ResumeContent[keyof ResumeContent]
  ): Promise<Resume> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const resume = await resumeService.getOne(id);
          if (!resume || !resume.content) {
            reject(new Error("Resume not found or initialized"));
            return;
          }
          // Update the specific section with type-safe casting
          (resume.content as unknown as Record<string, unknown>)[sectionId] = data;
          const updated = await resumeService.update(id, { content: resume.content });
          resolve(updated);
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  },

  deleteSectionItem: async (id: string, sectionId: keyof ResumeContent, itemId: string): Promise<Resume> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const resume = await resumeService.getOne(id);
          if (!resume || !resume.content) {
            reject(new Error("Resume not found"));
            return;
          }
          const list = resume.content[sectionId];
          if (Array.isArray(list)) {
            const filteredList = (list as Array<{ id: string }>).filter((item) => item.id !== itemId);
            (resume.content as unknown as Record<string, unknown>)[sectionId] = filteredList;
            const updated = await resumeService.update(id, { content: resume.content });
            resolve(updated);
          } else {
            reject(new Error("Section is not a list"));
          }
        } catch (err) {
          reject(err);
        }
      }, 300);
    });
  },

  getPreview: async (id: string): Promise<ResumeContent> => {
    return new Promise((resolve, reject) => {
      setTimeout(async () => {
        try {
          const resume = await resumeService.getOne(id);
          if (!resume || !resume.content) {
            reject(new Error("Resume not found"));
            return;
          }
          resolve(resume.content);
        } catch (err) {
          reject(err);
        }
      }, 100);
    });
  },
};
