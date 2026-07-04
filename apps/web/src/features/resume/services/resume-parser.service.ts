import { mockParserAdapter } from "./parser-adapter";
import { useParserStore } from "../store/resume-parser.store";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { useResumeStore } from "../store/resume.store";
import type { ReviewState } from "../types/parser.types";
import type { LanguageLevel } from "@/features/profile/types/language.types";
import type { SocialPlatform } from "@/features/profile/types/social-link.types";

const mapLanguageLevel = (lvl: string): LanguageLevel => {
  const normalized = lvl.toLowerCase();
  if (normalized.includes("native")) return "native";
  if (normalized.includes("fluent")) return "fluent";
  if (normalized.includes("advanced")) return "advanced";
  if (normalized.includes("conversational") || normalized.includes("intermediate")) return "intermediate";
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

export const resumeParserService = {
  /**
   * Validates file size and format types
   */
  validateFile(file: File): string | null {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ];

    if (!allowedTypes.includes(file.type)) {
      return "Unsupported file format. Please upload a PDF or DOCX file.";
    }

    const maxSize = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSize) {
      return "File size exceeds the 5MB limit. Please upload a smaller file.";
    }

    return null;
  },

  /**
   * Orchestrates simulated parser lifecycle stages
   */
  async parseResumeWorkflow(
    file: File,
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst"
  ): Promise<void> {
    const store = useParserStore.getState();
    store.setError(null);
    store.setProgress(0);

    try {
      // 1. Upload stage (0% to 25%)
      store.setProcessingState("uploading");
      for (let i = 0; i <= 25; i += 5) {
        store.setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 80));
      }

      // 2. Extraction stage (25% to 60%)
      store.setProcessingState("extracting");
      for (let i = 25; i <= 60; i += 7) {
        store.setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // 3. AI Parsing stage (60% to 90%)
      store.setProcessingState("parsing");
      for (let i = 60; i <= 90; i += 6) {
        store.setProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 90));
      }

      // Execute mock parsing
      const { data, confidence } = await mockParserAdapter.parseResume(file.name, rolePreset);

      // 4. Completed stage (90% to 100%)
      store.setProgress(100);
      store.setProcessingState("completed");
      useParserStore.setState({ confidenceScores: confidence });
      store.initReviewState(data);
    } catch (err) {
      store.setError((err as Error).message || "An unexpected error occurred during parsing.");
    }
  },

  /**
   * Synchronizes accepted extracted values to Profile Store and Resume Store
   */
  async saveAndSync(review: ReviewState): Promise<void> {
    const profileStore = useProfileStore.getState();
    const resumeStore = useResumeStore.getState();

    // 1. Update Candidate Profile personal information
    if (review.personal.action === "accept" || review.personal.action === "edit") {
      const personal = review.personal.value;
      const currentProfile = profileStore.profile;
      
      if (currentProfile) {
        profileStore.setProfile({
          ...currentProfile,
          personal: {
            ...currentProfile.personal,
            firstName: personal.firstName,
            lastName: personal.lastName
          },
          contact: {
            ...currentProfile.contact,
            email: personal.email,
            phone: personal.phone,
            city: personal.city,
            country: personal.country
          },
          career: {
            ...currentProfile.career,
            headline: personal.headline,
            summary: review.summary.value.summary
          }
        });
      }
    }

    // 2. Add experiences (no duplicates check)
    if (review.experience.action === "accept" && review.experience.value.length > 0) {
      review.experience.value.forEach((exp) => {
        const isDuplicate = profileStore.experience.some(
          (e) => e.companyName.toLowerCase() === exp.companyName.toLowerCase() &&
                 e.jobTitle.toLowerCase() === exp.jobTitle.toLowerCase()
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
            technologiesUsed: []
          });
        }
      });
    }

    // 3. Add education (no duplicates check)
    if (review.education.action === "accept" && review.education.value.length > 0) {
      review.education.value.forEach((edu) => {
        const isDuplicate = profileStore.education.some(
          (e) => e.institution.toLowerCase() === edu.institution.toLowerCase() &&
                 e.degree.toLowerCase() === edu.degree.toLowerCase()
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
            description: ""
          });
        }
      });
    }

    // 4. Add skills (no duplicates check)
    if (review.skills.action === "accept" && review.skills.value.length > 0) {
      review.skills.value.forEach((skill) => {
        const isDuplicate = profileStore.skills.some(
          (s) => s.name.toLowerCase() === skill.name.toLowerCase()
        );
        if (!isDuplicate) {
          profileStore.addSkill({
            name: skill.name,
            category: "Technical",
            level: skill.level,
            yearsOfExperience: parseInt(skill.yearsOfExperience, 10) || 1,
            featured: false
          });
        }
      });
    }

    // 5. Add projects (no duplicates check)
    if (review.projects.action === "accept" && review.projects.value.length > 0) {
      review.projects.value.forEach((proj) => {
        const isDuplicate = profileStore.projects.some(
          (p) => p.title.toLowerCase() === proj.title.toLowerCase()
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
            featured: false
          });
        }
      });
    }

    // 6. Add certifications
    if (review.certifications.action === "accept" && review.certifications.value.length > 0) {
      review.certifications.value.forEach((cert) => {
        const isDuplicate = profileStore.certifications.some(
          (c) => c.name.toLowerCase() === cert.name.toLowerCase()
        );
        if (!isDuplicate) {
          profileStore.addCertification({
            name: cert.name,
            issuingOrganization: cert.issuingOrganization,
            issueDate: cert.issueDate,
            expiryDate: null,
            credentialId: "",
            credentialUrl: "",
            neverExpires: true
          });
        }
      });
    }

    // 7. Add languages
    if (review.languages.action === "accept" && review.languages.value.length > 0) {
      review.languages.value.forEach((lang) => {
        const isDuplicate = profileStore.languages.some(
          (l) => l.language.toLowerCase() === lang.language.toLowerCase()
        );
        if (!isDuplicate) {
          profileStore.addLanguage({
            language: lang.language,
            readingLevel: mapLanguageLevel(lang.speakingLevel),
            writingLevel: mapLanguageLevel(lang.speakingLevel),
            speakingLevel: mapLanguageLevel(lang.speakingLevel),
            nativeLanguage: lang.nativeLanguage
          });
        }
      });
    }

    // 8. Add social links
    if (review.socialLinks.action === "accept" && review.socialLinks.value.length > 0) {
      review.socialLinks.value.forEach((link) => {
        const isDuplicate = profileStore.socialLinks.some(
          (s) => s.platform.toLowerCase() === link.platform.toLowerCase()
        );
        if (!isDuplicate) {
          profileStore.addSocialLink({
            platform: mapSocialPlatform(link.platform),
            url: link.url
          });
        }
      });
    }

    // 9. Sync & Initialise a brand new Resume draft layout in the resume workspace!
    const personalData = review.personal.value;
    const summaryData = review.summary.value;

    await resumeStore.createResume({
      title: `Parsed - ${personalData.firstName || "Imported"} Resume`,
      description: "Automatically initialized draft from parsed resume PDF/DOCX file.",
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
          country: personalData.country
        },
        summary: {
          summary: summaryData.summary
        },
        experience: review.experience.action === "accept" ? review.experience.value : [],
        education: review.education.action === "accept" ? review.education.value : [],
        skills: review.skills.action === "accept" ? review.skills.value : [],
        projects: review.projects.action === "accept" ? review.projects.value : [],
        certifications: review.certifications.action === "accept" ? review.certifications.value : [],
        languages: review.languages.action === "accept" ? review.languages.value : [],
        socialLinks: review.socialLinks.action === "accept" ? review.socialLinks.value : [],
        sectionsOrder: ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"],
        hiddenSections: [],
        customSections: []
      }
    });

    // Profile stores completion engine trigger
    if (typeof profileStore.syncCompletion === "function") {
      profileStore.syncCompletion();
    }
  }
};
