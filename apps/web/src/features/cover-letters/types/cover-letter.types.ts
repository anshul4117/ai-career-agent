export type CoverLetterTemplate = "professional" | "startup" | "enterprise" | "modern" | "minimal";
export type CoverLetterTone = "professional" | "friendly" | "confident" | "formal" | "enthusiastic";
 
export interface CoverLetterVersion {
  id: string;
  template: CoverLetterTemplate;
  tone: CoverLetterTone;
  jobTitle: string;
  company: string;
  content: string;
  createdAt: string;
}
 
export interface CoverLetterDraft {
  id: string;
  title: string;
  jobTitle: string;
  company: string;
  jobDescription?: string;
  template: CoverLetterTemplate;
  tone: CoverLetterTone;
  content: string; // The current editable content
  resumeId?: string;
  versions: CoverLetterVersion[];
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}
