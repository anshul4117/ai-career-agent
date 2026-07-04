/** Resume Module — Type Definitions */

export interface ResumePersonal {
  firstName: string;
  lastName: string;
  headline: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface ResumeSummary {
  summary: string;
}

export interface ResumeExperience {
  id: string;
  companyName: string;
  jobTitle: string;
  location: string;
  startDate: string;
  endDate: string;
  currentPosition: boolean;
  description: string;
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  currentStudy: boolean;
  cgpa: string;
}

export interface ResumeProject {
  id: string;
  title: string;
  role: string;
  description: string;
  techStack: string[];
}

export interface ResumeSkill {
  id: string;
  name: string;
  yearsOfExperience: string;
  level: "beginner" | "intermediate" | "expert";
}

export interface ResumeLanguage {
  id: string;
  language: string;
  speakingLevel: string;
  nativeLanguage: boolean;
}

export interface ResumeCertification {
  id: string;
  name: string;
  issuingOrganization: string;
  issueDate: string;
}

export interface ResumeSocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  subtitle: string;
  date: string;
  description: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: CustomSectionItem[];
}

export interface ResumeContent {
  personal: ResumePersonal;
  summary: ResumeSummary;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  certifications: ResumeCertification[];
  languages: ResumeLanguage[];
  socialLinks: ResumeSocialLink[];
  
  // Custom configurations (Sprint 3.3)
  sectionsOrder?: string[];
  hiddenSections?: string[];
  customSections?: CustomSection[];
}

export interface ResumeTheme {
  // Colors
  primaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingColor: string;

  // Typography
  headingFont: string;
  bodyFont: string;
  fontSize: string; // e.g. "10px" | "11px" | "12px" | "13px"
  lineHeight: string; // e.g. "relaxed" | "normal" | "tight"
  letterSpacing: string; // e.g. "tracking-tight" | "tracking-normal" | "tracking-wide"

  // Layout
  columns: 1 | 2;
  sidebarPosition: "left" | "right";
  widthMode: "compact" | "wide";

  // Spacing
  // Spacing
  margins: string;
  sectionSpacing: string;
  paragraphSpacing: string;
  itemSpacing: string;

  // Section Styling
  roundedCorners: string;
  borderStyle: string;
  dividerStyle: string;
  sectionBackground: string;

  // Preset tracking
  activePreset: string; // "professional" | "corporate" | "developer" | "creative" | "minimal" | "classic" | "default"
}

export interface Resume {
  id: string;
  title: string;
  description: string;
  templateId: string;
  status: "active" | "archived";
  isDefault: boolean;
  atsScore: number;
  content?: ResumeContent; // Optional to support legacy/empty metadata
  theme?: ResumeTheme; // Custom styling customizations (Sprint 3.6)
  createdAt: string;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewColor: string; // Neon accents for Brutalist look
  recommendedFor?: string;
}
