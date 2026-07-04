import type { 
  ResumePersonal, ResumeSummary, ResumeSkill, 
  ResumeExperience, ResumeEducation, ResumeProject, 
  ResumeCertification, ResumeLanguage, ResumeSocialLink 
} from "./resume.types";

export interface ExtractedData {
  personal: ResumePersonal;
  summary: ResumeSummary;
  skills: ResumeSkill[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  socialLinks: ResumeSocialLink[];
}

export interface SectionConfidence {
  personal: number;
  summary: number;
  skills: number;
  experience: number;
  education: number;
  projects: number;
  certifications: number;
  languages: number;
  socialLinks: number;
}

export type ReviewAction = "accept" | "ignore" | "edit";

export interface ReviewState {
  personal: { action: ReviewAction; value: ResumePersonal };
  summary: { action: ReviewAction; value: ResumeSummary };
  skills: { action: "accept" | "ignore"; value: ResumeSkill[] };
  experience: { action: "accept" | "ignore"; value: ResumeExperience[] };
  education: { action: "accept" | "ignore"; value: ResumeEducation[] };
  projects: { action: "accept" | "ignore"; value: ResumeProject[] };
  certifications: { action: "accept" | "ignore"; value: ResumeCertification[] };
  languages: { action: "accept" | "ignore"; value: ResumeLanguage[] };
  socialLinks: { action: "accept" | "ignore"; value: ResumeSocialLink[] };
}

export interface ParserAdapter {
  parseResume(
    fileName: string, 
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst"
  ): Promise<{ data: ExtractedData; confidence: SectionConfidence }>;
}
