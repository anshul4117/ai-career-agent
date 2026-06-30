/** Profile Module — Barrel Exports */

// Types
export type {
  Profile,
  PersonalInfo,
  ContactInfo,
  CareerInfo,
  ProfileStats,
  ProfileCompletion,
  ProfileCompletionSection,
  ProfileAvatarType,
  Gender,
  WorkPreference,
  AvailabilityStatus,
} from "./types/profile.types";
export type { Skill, SkillLevel } from "./types/skill.types";
export type { Education } from "./types/education.types";
export type { Experience, EmploymentType, WorkMode } from "./types/experience.types";
export type { Project } from "./types/project.types";
export type { Certification } from "./types/certification.types";
export type { Language, LanguageLevel } from "./types/language.types";
export type { SocialLink, SocialPlatform } from "./types/social-link.types";
export type { CareerPreference } from "./types/career-preference.types";

// Components
export { ProfileHeader } from "./components/profile-header";
export { ProfileAvatar } from "./components/profile-avatar";
export { ProfileCompletionCard } from "./components/profile-completion-card";
export { PersonalInfoCard } from "./components/personal-info-card";
export { ContactInfoCard } from "./components/contact-info-card";
export { CareerSummaryCard } from "./components/career-summary-card";
export { QuickStatsCard } from "./components/quick-stats-card";
export { QuickActionsCard } from "./components/quick-actions-card";
export { ProfileDialog } from "./components/profile-dialog";
export { AvatarUpload } from "./components/avatar-upload";

// Core Info Forms
export { PersonalInfoForm } from "./components/personal-info-form";
export { ContactInfoForm } from "./components/contact-info-form";
export { CareerInfoForm } from "./components/career-info-form";

// Skills Components
export { SkillBadge } from "./components/skill-badge";
export { SkillForm } from "./components/skill-form";
export { SkillItem } from "./components/skill-item";
export { SkillFilters } from "./components/skill-filters";
export { SkillsList } from "./components/skills-list";
export { SkillsCard } from "./components/skills-card";

// Education Components
export { EducationForm } from "./components/education-form";
export { EducationItem } from "./components/education-item";
export { EducationTimeline } from "./components/education-timeline";
export { EducationCard } from "./components/education-card";

// Experience Components
export { ExperienceForm } from "./components/experience-form";
export { ExperienceItem } from "./components/experience-item";
export { ExperienceTimeline } from "./components/experience-timeline";
export { ExperienceCard } from "./components/experience-card";

// Projects Components
export { ProjectForm } from "./components/project-form";
export { ProjectCard } from "./components/project-card";
export { ProjectsGrid } from "./components/projects-grid";
export { ProjectsCard } from "./components/projects-card";

// Certifications Components
export { CertificationForm } from "./components/certification-form";
export { CertificationItem } from "./components/certification-item";
export { CertificationsCard } from "./components/certifications-card";

// Languages Components
export { LanguageForm } from "./components/language-form";
export { LanguageItem } from "./components/language-item";
export { LanguagesCard } from "./components/languages-card";

// Social Links Components
export { SocialLinkForm } from "./components/social-link-form";
export { SocialLinkItem } from "./components/social-link-item";
export { SocialLinksCard } from "./components/social-links-card";

// Career Preferences Components
export { CareerPreferenceForm } from "./components/career-preference-form";
export { CareerPreferenceCard } from "./components/career-preference-card";

// Store
export { useProfileStore } from "./store/profile.store";

// Data
export { MOCK_PROFILE, AVAILABILITY_LABELS, WORK_PREFERENCE_LABELS } from "./data/profile.mock";
export { MOCK_SKILLS, SKILL_LEVEL_LABELS, SKILL_CATEGORIES } from "./data/skills.mock";
export { MOCK_EDUCATION } from "./data/education.mock";
export { MOCK_EXPERIENCE, EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "./data/experience.mock";
export { MOCK_PROJECTS } from "./data/projects.mock";
export { MOCK_CERTIFICATIONS } from "./data/certifications.mock";
export { MOCK_LANGUAGES, LANGUAGE_LEVEL_LABELS } from "./data/languages.mock";
export { MOCK_SOCIAL_LINKS, SOCIAL_PLATFORM_LABELS } from "./data/social-links.mock";
export { MOCK_CAREER_PREFERENCES } from "./data/career-preferences.mock";

// Services
export { profileService } from "./services/profile.service";

// Schemas
export { skillSchema } from "./schemas/skill.schema";
export { educationSchema } from "./schemas/education.schema";
export { experienceSchema } from "./schemas/experience.schema";
export { projectSchema } from "./schemas/project.schema";
export { certificationSchema } from "./schemas/certification.schema";
export { languageSchema } from "./schemas/language.schema";
export { socialLinkSchema } from "./schemas/social-link.schema";
export { careerPreferenceSchema } from "./schemas/career-preference.schema";

// Utils
export { calculateProfileCompletion } from "./utils/completion-engine";
