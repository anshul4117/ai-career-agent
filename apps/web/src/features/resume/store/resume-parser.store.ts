"use client";

import { create } from "zustand";
import type {
  ExtractedData,
  SectionConfidence,
  ReviewState,
  ReviewAction,
} from "../types/parser.types";
import { mockParserAdapter } from "../services/parser-adapter";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { useResumeStore } from "./resume.store";
import type { LanguageLevel } from "@/features/profile/types/language.types";
import type { SocialPlatform } from "@/features/profile/types/social-link.types";

interface ParserStoreState {
  uploadedFile: File | null;
  processingState: "waiting" | "parsing" | "completed" | "failed";
  currentStep: number;
  progress: number;
  parsedData: ExtractedData | null;
  confidenceScores: SectionConfidence | null;
  reviewState: ReviewState | null;
  error: string | null;

  // Actions
  setUploadedFile: (file: File | null) => void;
  setProcessingState: (
    state: "waiting" | "parsing" | "completed" | "failed",
  ) => void;
  setProgress: (p: number) => void;
  setError: (err: string | null) => void;
  initReviewState: (data: ExtractedData) => void;
  updateReviewAction: (
    section: keyof ReviewState,
    action: ReviewAction,
  ) => void;
  updateReviewValue: (section: "personal" | "summary", value: unknown) => void;
  resetParserStore: () => void;

  // Phase 4 New Store Actions
  startParsing: (
    file: File,
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst",
  ) => Promise<void>;
  retryParsing: (
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst",
  ) => Promise<void>;
  acceptParsing: () => Promise<void>;
  rejectParsing: () => Promise<void>;
  updateParsedField: (
    section: keyof ReviewState,
    fieldOrIndex: string | number,
    value: unknown,
  ) => void;
}

const mapLanguageLevel = (lvl: string): LanguageLevel => {
  const normalized = lvl.toLowerCase();
  if (normalized.includes("native")) return "native";
  if (normalized.includes("fluent")) return "fluent";
  if (normalized.includes("advanced")) return "advanced";
  if (
    normalized.includes("conversational") ||
    normalized.includes("intermediate")
  )
    return "intermediate";
  return "beginner";
};

const mapSocialPlatform = (platform: string): SocialPlatform => {
  const p = platform.toLowerCase();
  if (p === "github") return "github";
  if (p === "linkedin") return "linkedin";
  if (p === "portfolio") return "portfolio";
  if (p === "twitter" || p === "x") return "twitter";
  return "website";
};

const INITIAL_STATE = {
  uploadedFile: null,
  processingState: "waiting" as const,
  currentStep: 0,
  progress: 0,
  parsedData: null,
  confidenceScores: null,
  reviewState: null,
  error: null,
};

export const useParserStore = create<ParserStoreState>((set, get) => ({
  ...INITIAL_STATE,

  setUploadedFile: (file) => set({ uploadedFile: file }),

  setProcessingState: (state) => set({ processingState: state }),

  setProgress: (p) => set({ progress: p }),

  setError: (err) =>
    set({ error: err, processingState: err ? "failed" : "waiting" }),

  initReviewState: (data) => {
    const review: ReviewState = {
      personal: { action: "accept", value: { ...data.personal } },
      summary: { action: "accept", value: { ...data.summary } },
      skills: { action: "accept", value: [...data.skills] },
      experience: { action: "accept", value: [...data.experience] },
      education: { action: "accept", value: [...data.education] },
      projects: { action: "accept", value: [...data.projects] },
      certifications: { action: "accept", value: [...data.certifications] },
      languages: { action: "accept", value: [...data.languages] },
      socialLinks: { action: "accept", value: [...data.socialLinks] },
    };
    set({ reviewState: review, parsedData: data });
  },

  updateReviewAction: (section, action) => {
    set((state) => {
      if (!state.reviewState) return {};
      return {
        reviewState: {
          ...state.reviewState,
          [section]: {
            ...state.reviewState[section],
            action,
          },
        },
      };
    });
  },

  updateReviewValue: (section, value) => {
    set((state) => {
      if (!state.reviewState) return {};
      return {
        reviewState: {
          ...state.reviewState,
          [section]: {
            ...state.reviewState[section],
            value,
          },
        },
      };
    });
  },

  resetParserStore: () => set(INITIAL_STATE),

  startParsing: async (file, rolePreset) => {
    set({
      uploadedFile: file,
      processingState: "parsing",
      currentStep: 0,
      progress: 0,
      error: null,
    });

    try {
      // Step 0: Upload Resume (15%)
      set({ currentStep: 0, progress: 15 });
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Step 1: Extract Text (35%)
      set({ currentStep: 1, progress: 35 });
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Step 2: Analyze Sections (55%)
      set({ currentStep: 2, progress: 55 });
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Step 3: Extract Skills (75%)
      set({ currentStep: 3, progress: 75 });
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Step 4: Extract Experience (90%)
      set({ currentStep: 4, progress: 90 });
      await new Promise((resolve) => setTimeout(resolve, 150));

      // Execute mock parsing
      const { data, confidence } = await mockParserAdapter.parseResume(
        file.name,
        rolePreset,
      );

      // Step 5: Completed (100%)
      set({
        currentStep: 5,
        progress: 100,
        processingState: "completed",
        confidenceScores: confidence,
      });
      get().initReviewState(data);
    } catch (err) {
      set({
        error:
          (err as Error).message ||
          "An unexpected error occurred during parsing.",
        processingState: "failed",
      });
    }
  },

  retryParsing: async (rolePreset) => {
    const file = get().uploadedFile;
    if (!file) {
      set({ error: "No file uploaded to parse", processingState: "failed" });
      return;
    }
    await get().startParsing(file, rolePreset);
  },

  acceptParsing: async () => {
    const review = get().reviewState;
    if (!review) return;

    set({ processingState: "parsing", progress: 50 }); // Simulate saving process
    await new Promise((resolve) => setTimeout(resolve, 800));

    const profileStore = useProfileStore.getState();
    const resumeStore = useResumeStore.getState();

    // 1. Sync Personal Info
    if (
      review.personal.action === "accept" ||
      review.personal.action === "edit"
    ) {
      const personal = review.personal.value;
      const currentProfile = profileStore.profile;

      if (currentProfile) {
        profileStore.setProfile({
          ...currentProfile,
          personal: {
            ...currentProfile.personal,
            firstName: personal.firstName,
            lastName: personal.lastName,
          },
          contact: {
            ...currentProfile.contact,
            email: personal.email,
            phone: personal.phone,
            city: personal.city,
            country: personal.country,
          },
          career: {
            ...currentProfile.career,
            headline: personal.headline,
            summary: review.summary.value.summary,
          },
        });
      }
    }

    // 2. Sync Work Experience
    if (
      review.experience.action === "accept" &&
      review.experience.value.length > 0
    ) {
      review.experience.value.forEach((exp) => {
        const isDuplicate = profileStore.experience.some(
          (e) =>
            e.companyName.toLowerCase() === exp.companyName.toLowerCase() &&
            e.jobTitle.toLowerCase() === exp.jobTitle.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addExperience({
            companyName: exp.companyName,
            jobTitle: exp.jobTitle,
            location: exp.location || "",
            employmentType: "full-time",
            workMode: "remote",
            startDate: exp.startDate || "2023-01",
            endDate: exp.endDate || null,
            currentPosition: exp.currentPosition,
            description: exp.description,
            technologiesUsed: [],
          });
        }
      });
    }

    // 3. Sync Education
    if (
      review.education.action === "accept" &&
      review.education.value.length > 0
    ) {
      review.education.value.forEach((edu) => {
        const isDuplicate = profileStore.education.some(
          (e) =>
            e.institution.toLowerCase() === edu.institution.toLowerCase() &&
            e.degree.toLowerCase() === edu.degree.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addEducation({
            institution: edu.institution,
            degree: edu.degree,
            fieldOfStudy: edu.fieldOfStudy,
            location: "",
            startDate: edu.startDate || "2019-09",
            endDate: edu.endDate || null,
            currentStudy: edu.currentStudy,
            cgpa: edu.cgpa,
            description: "",
          });
        }
      });
    }

    // 4. Sync Skills
    if (review.skills.action === "accept" && review.skills.value.length > 0) {
      review.skills.value.forEach((skill) => {
        const isDuplicate = profileStore.skills.some(
          (s) => s.name.toLowerCase() === skill.name.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addSkill({
            name: skill.name,
            category: "Technical",
            level: skill.level,
            yearsOfExperience: parseInt(skill.yearsOfExperience, 10) || 1,
            featured: false,
          });
        }
      });
    }

    // 5. Sync Projects
    if (
      review.projects.action === "accept" &&
      review.projects.value.length > 0
    ) {
      review.projects.value.forEach((proj) => {
        const isDuplicate = profileStore.projects.some(
          (p) => p.title.toLowerCase() === proj.title.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addProject({
            title: proj.title,
            description: proj.description,
            techStack: proj.techStack,
            githubUrl: null,
            liveDemoUrl: null,
            imageUrl: null,
            teamSize: 1,
            role: proj.role,
            startDate: "2023-01",
            endDate: null,
            featured: false,
          });
        }
      });
    }

    // 6. Sync Certifications
    if (
      review.certifications.action === "accept" &&
      review.certifications.value.length > 0
    ) {
      review.certifications.value.forEach((cert) => {
        const isDuplicate = profileStore.certifications.some(
          (c) => c.name.toLowerCase() === cert.name.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addCertification({
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate,
            expiryDate: null,
            credentialId: "",
            credentialUrl: "",
            neverExpires: true,
          });
        }
      });
    }

    // 7. Sync Languages
    if (
      review.languages.action === "accept" &&
      review.languages.value.length > 0
    ) {
      review.languages.value.forEach((lang) => {
        const isDuplicate = profileStore.languages.some(
          (l) => l.language.toLowerCase() === lang.language.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addLanguage({
            language: lang.language,
            readingLevel: mapLanguageLevel(lang.speakingLevel),
            writingLevel: mapLanguageLevel(lang.speakingLevel),
            speakingLevel: mapLanguageLevel(lang.speakingLevel),
            nativeLanguage: lang.nativeLanguage,
          });
        }
      });
    }

    // 8. Sync Social Links
    if (
      review.socialLinks.action === "accept" &&
      review.socialLinks.value.length > 0
    ) {
      review.socialLinks.value.forEach((link) => {
        const isDuplicate = profileStore.socialLinks.some(
          (s) => s.platform.toLowerCase() === link.platform.toLowerCase(),
        );
        if (!isDuplicate) {
          profileStore.addSocialLink({
            platform: mapSocialPlatform(link.platform),
            url: link.url,
          });
        }
      });
    }

    // 9. Sync & Initialise a brand new Resume draft layout in the resume store!
    const personalData = review.personal.value;
    const summaryData = review.summary.value;

    await resumeStore.createResume({
      title: `Parsed - ${personalData.firstName || "Imported"} Resume`,
      description:
        "Automatically initialized draft from parsed resume PDF/DOCX file.",
      templateId: "modern",
      status: "active",
      isDefault: false,
      content: {
        personal: {
          firstName: personalData.firstName,
          lastName: personalData.lastName,
          headline: personalData.headline,
          email: personalData.email,
          phone: personalData.phone,
          city: personalData.city,
          country: personalData.country,
        },
        summary: {
          summary: summaryData.summary,
        },
        experience:
          review.experience.action === "accept" ? review.experience.value : [],
        education:
          review.education.action === "accept" ? review.education.value : [],
        skills: review.skills.action === "accept" ? review.skills.value : [],
        projects:
          review.projects.action === "accept" ? review.projects.value : [],
        certifications:
          review.certifications.action === "accept"
            ? review.certifications.value
            : [],
        languages:
          review.languages.action === "accept" ? review.languages.value : [],
        socialLinks:
          review.socialLinks.action === "accept"
            ? review.socialLinks.value
            : [],
        sectionsOrder: [
          "personal",
          "summary",
          "experience",
          "education",
          "skills",
          "projects",
          "certifications",
          "languages",
          "socialLinks",
        ],
        hiddenSections: [],
        customSections: [],
      },
    });

    if (typeof profileStore.syncCompletion === "function") {
      profileStore.syncCompletion();
    }

    set({ ...INITIAL_STATE });
  },

  rejectParsing: async () => {
    set({ processingState: "parsing", progress: 30 }); // Simulate rejection processing
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ ...INITIAL_STATE });
  },

  updateParsedField: (section, fieldOrIndex, value) => {
    set((state) => {
      if (!state.reviewState) return {};
      const sectionState = state.reviewState[section];

      if (Array.isArray(value)) {
        return {
          reviewState: {
            ...state.reviewState,
            [section]: {
              ...sectionState,
              action: "edit",
              value,
            },
          },
        };
      }

      if (Array.isArray(sectionState.value)) {
        // Handle array item update
        const updatedArray = [...sectionState.value];
        const index =
          typeof fieldOrIndex === "number"
            ? fieldOrIndex
            : parseInt(fieldOrIndex as string, 10);
        if (!isNaN(index) && updatedArray[index]) {
          updatedArray[index] = {
            ...updatedArray[index],
            ...(value as Record<string, unknown>),
          };
        }
        return {
          reviewState: {
            ...state.reviewState,
            [section]: {
              ...sectionState,
              action: "edit",
              value: updatedArray,
            },
          },
        };
      } else {
        // Handle object field update
        return {
          reviewState: {
            ...state.reviewState,
            [section]: {
              ...sectionState,
              action: "edit",
              value: {
                ...sectionState.value,
                [fieldOrIndex as string]: value,
              },
            },
          },
        };
      }
    });
  },
}));
