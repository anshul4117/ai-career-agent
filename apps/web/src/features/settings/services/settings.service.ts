import type { UserSettings } from "../types/settings.types";
 
const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    avatarUrl: "",
    fullName: "Alex Rivera",
    headline: "Senior Frontend Architect | React & Next.js Core",
    bio: "Passionate about engineering stable, metrics-driven developer interfaces and optimizing largest contentful paint (LCP). Team lead and open-source enthusiast.",
    location: "San Francisco, CA",
    phone: "+1 (555) 019-2834",
    website: "https://alexrivera.dev",
    portfolio: "https://portfolio.alexrivera.dev",
    github: "github.com/alexrivera-codes",
    linkedin: "linkedin.com/in/alex-rivera-architect",
    twitter: "x.com/alex_dev_tweets"
  },
  account: {
    email: "alex.rivera@example.com",
    username: "alexrivera"
  },
  jobPreferences: {
    desiredJobTitle: "Senior Frontend Engineer",
    employmentType: ["Full-time", "Contract"],
    experienceLevel: ["Senior", "Lead"],
    workplaceType: ["Remote", "Hybrid"],
    preferredLocations: ["San Francisco, CA", "New York, NY", "Austin, TX"],
    salaryExpectation: "$165,000 - $185,000",
    noticePeriod: "2 Weeks",
    openToRelocation: true,
    openToRecruiters: true
  },
  notifications: {
    jobAlerts: true,
    savedSearchAlerts: false,
    applicationUpdates: true,
    interviewReminders: true,
    weeklyDigest: true,
    productUpdates: false,
    marketingEmails: false
  },
  ai: {
    defaultResumeId: "res_primary",
    defaultCoverLetterTemplate: "modern",
    aiWritingTone: "confident",
    atsOptimizationLevel: 85,
    autoResumeOptimization: false,
    autoCoverLetterPersonalization: true
  },
  appearance: {
    theme: "light",
    accentColor: "#f35f22",
    compactMode: false,
    language: "English",
    timezone: "UTC -8 (PST)"
  },
  connections: [
    { id: "c_goog", provider: "google", connected: true, username: "alex.rivera@gmail.com" },
    { id: "c_git", provider: "github", connected: true, username: "alexrivera-codes" },
    { id: "c_link", provider: "linkedin", connected: false },
    { id: "c_well", provider: "wellfound", connected: false },
    { id: "c_ind", provider: "indeed", connected: false }
  ],
  privacy: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    deviceSessions: [
      { id: "dev_1", name: "Apple Macbook Pro 16", location: "San Francisco, CA (Active)", lastActive: "Just now" },
      { id: "dev_2", name: "Apple iPhone 15 Pro", location: "San Francisco, CA", lastActive: "2 hours ago" },
      { id: "dev_3", name: "Chrome on Windows 11 Desktop", location: "Seattle, WA", lastActive: "3 days ago" }
    ],
    profileVisible: true,
    shareDataWithRecruiters: true
  },
  lastUpdated: new Date().toISOString()
};
 
export const settingsService = {
  load(): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const raw = localStorage.getItem("user_settings_configuration");
    if (!raw) {
      localStorage.setItem("user_settings_configuration", JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_SETTINGS;
    }
  },
 
  save(settings: UserSettings): void {
    if (typeof window === "undefined") return;
    const updated = {
      ...settings,
      lastUpdated: new Date().toISOString()
    };
    localStorage.setItem("user_settings_configuration", JSON.stringify(updated));
  },
 
  reset(): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    localStorage.setItem("user_settings_configuration", JSON.stringify(DEFAULT_SETTINGS));
    return DEFAULT_SETTINGS;
  },
 
  export(settings: UserSettings): string {
    return JSON.stringify(settings, null, 2);
  },
 
  import(jsonString: string): UserSettings {
    const parsed = JSON.parse(jsonString) as UserSettings;
    // Basic verification check
    if (!parsed.profile || !parsed.account || !parsed.jobPreferences) {
      throw new Error("Invalid UserSettings config payload");
    }
    this.save(parsed);
    return parsed;
  }
};
export { DEFAULT_SETTINGS };
