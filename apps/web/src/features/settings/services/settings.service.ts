import type { UserSettings } from "../types/settings.types";

const DEFAULT_SETTINGS: UserSettings = {
  profile: {
    avatarUrl: "",
    fullName: "",
    headline: "",
    bio: "",
    location: "",
    phone: "",
    website: "",
    portfolio: "",
    github: "",
    linkedin: "",
    twitter: "",
  },
  account: {
    email: "",
    username: "",
  },
  jobPreferences: {
    desiredJobTitle: "",
    employmentType: ["Full-time"],
    experienceLevel: ["Mid-level", "Senior"],
    workplaceType: ["Remote", "Hybrid"],
    preferredLocations: [],
    salaryExpectation: "",
    noticePeriod: "Immediate",
    openToRelocation: true,
    openToRecruiters: true,
  },
  notifications: {
    jobAlerts: true,
    savedSearchAlerts: false,
    applicationUpdates: true,
    interviewReminders: true,
    weeklyDigest: true,
    productUpdates: false,
    marketingEmails: false,
  },
  ai: {
    defaultResumeId: "res_primary",
    defaultCoverLetterTemplate: "modern",
    aiWritingTone: "confident",
    atsOptimizationLevel: 85,
    autoResumeOptimization: false,
    autoCoverLetterPersonalization: true,
  },
  appearance: {
    theme: "light",
    accentColor: "#f35f22",
    compactMode: false,
    language: "English",
    timezone: "UTC -8 (PST)",
  },
  connections: [
    { id: "c_goog", provider: "google", connected: false },
    { id: "c_git", provider: "github", connected: false },
    { id: "c_link", provider: "linkedin", connected: false },
    { id: "c_well", provider: "wellfound", connected: false },
    { id: "c_ind", provider: "indeed", connected: false },
  ],
  privacy: {
    twoFactorAuth: false,
    sessionTimeout: 30,
    deviceSessions: [
      {
        id: "dev_1",
        name: "Apple Macbook Pro 16",
        location: "San Francisco, CA (Active)",
        lastActive: "Just now",
      },
      {
        id: "dev_2",
        name: "Apple iPhone 15 Pro",
        location: "San Francisco, CA",
        lastActive: "2 hours ago",
      },
      {
        id: "dev_3",
        name: "Chrome on Windows 11 Desktop",
        location: "Seattle, WA",
        lastActive: "3 days ago",
      },
    ],
    profileVisible: true,
    shareDataWithRecruiters: true,
  },
  lastUpdated: new Date().toISOString(),
};

export const settingsService = {
  load(): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    const raw = localStorage.getItem("user_settings_configuration");
    if (!raw) {
      localStorage.setItem(
        "user_settings_configuration",
        JSON.stringify(DEFAULT_SETTINGS),
      );
      return DEFAULT_SETTINGS;
    }
    try {
      const parsed = JSON.parse(raw) as UserSettings;
      if (parsed?.profile?.fullName === "Alex Rivera") {
        return DEFAULT_SETTINGS;
      }
      return parsed;
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  save(settings: UserSettings): void {
    if (typeof window === "undefined") return;
    const updated = {
      ...settings,
      lastUpdated: new Date().toISOString(),
    };
    localStorage.setItem(
      "user_settings_configuration",
      JSON.stringify(updated),
    );
  },

  reset(): UserSettings {
    if (typeof window === "undefined") return DEFAULT_SETTINGS;
    localStorage.setItem(
      "user_settings_configuration",
      JSON.stringify(DEFAULT_SETTINGS),
    );
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
  },
};
export { DEFAULT_SETTINGS };
