export interface ProfileSettings {
  avatarUrl?: string;
  fullName: string;
  headline: string;
  bio: string;
  location: string;
  phone: string;
  website: string;
  portfolio: string;
  github: string;
  linkedin: string;
  twitter?: string;
}
 
export interface AccountSettings {
  email: string;
  username: string;
}
 
export interface JobPreferences {
  desiredJobTitle: string;
  employmentType: string[]; // e.g. "Full-time", "Part-time", "Contract", "Internship"
  experienceLevel: string[]; // e.g. "Entry", "Mid-level", "Senior", "Lead"
  workplaceType: string[]; // e.g. "Remote", "Hybrid", "Onsite"
  preferredLocations: string[];
  salaryExpectation: string;
  noticePeriod: string;
  openToRelocation: boolean;
  openToRecruiters: boolean;
}
 
export interface NotificationSettings {
  jobAlerts: boolean;
  savedSearchAlerts: boolean;
  applicationUpdates: boolean;
  interviewReminders: boolean;
  weeklyDigest: boolean;
  productUpdates: boolean;
  marketingEmails: boolean;
}
 
export interface AIPreferences {
  defaultResumeId: string;
  defaultCoverLetterTemplate: string;
  aiWritingTone: string;
  atsOptimizationLevel: number;
  autoResumeOptimization: boolean;
  autoCoverLetterPersonalization: boolean;
}
 
export interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  accentColor: string;
  compactMode: boolean;
  language: string;
  timezone: string;
}
 
export interface ConnectedAccount {
  id: string;
  provider: "google" | "github" | "linkedin" | "wellfound" | "indeed";
  connected: boolean;
  username?: string;
}
 
export interface DeviceSession {
  id: string;
  name: string;
  location: string;
  lastActive: string;
}
 
export interface PrivacySettings {
  twoFactorAuth: boolean;
  sessionTimeout: number; // in minutes
  deviceSessions: DeviceSession[];
  profileVisible: boolean;
  shareDataWithRecruiters: boolean;
}
 
export interface UserSettings {
  profile: ProfileSettings;
  account: AccountSettings;
  jobPreferences: JobPreferences;
  notifications: NotificationSettings;
  ai: AIPreferences;
  appearance: AppearanceSettings;
  connections: ConnectedAccount[];
  privacy: PrivacySettings;
  lastUpdated: string;
}
