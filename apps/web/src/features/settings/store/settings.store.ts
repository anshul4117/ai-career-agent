"use client";

import { create } from "zustand";
import type { UserSettings } from "../types/settings.types";
import { settingsService } from "../services/settings.service";
import type { Profile } from "@/features/profile/types/profile.types";
import type { SocialLink } from "@/features/profile/types/social-link.types";
import type { CareerPreference } from "@/features/profile/types/career-preference.types";
import type { AuthUser } from "@/features/auth/types/auth.types";

type SettingsTab =
  | "profile"
  | "account"
  | "jobs"
  | "notifications"
  | "ai"
  | "appearance"
  | "connections"
  | "privacy";

interface SettingsState {
  settings: UserSettings | null;
  draftSettings: UserSettings | null;
  loading: boolean;
  hasUnsavedChanges: boolean;
  activeTab: SettingsTab;

  // Actions
  loadSettings: () => void;
  syncWithProfile: (
    profile: Profile | null,
    user: AuthUser | null,
    socialLinks?: SocialLink[],
    preferences?: CareerPreference | null,
  ) => void;
  updateDraft: (updater: (draft: UserSettings) => void) => void;
  saveChanges: () => Promise<void>;
  resetChanges: () => void;
  restoreDefaults: () => void;
  setActiveTab: (tab: SettingsTab) => void;
  calculateProfileCompletion: () => number;
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: null,
  draftSettings: null,
  loading: false,
  hasUnsavedChanges: false,
  activeTab: "profile",

  loadSettings: () => {
    const data = settingsService.load();
    set({
      settings: data,
      draftSettings: JSON.parse(JSON.stringify(data)), // deep copy
      hasUnsavedChanges: false,
    });
  },

  syncWithProfile: (profile, user, socialLinks, preferences) => {
    const current = get().settings || settingsService.load();

    const actualName =
      (profile &&
        `${profile.personal?.firstName || ""} ${profile.personal?.lastName || ""}`.trim()) ||
      user?.fullName ||
      user?.name ||
      "";

    const actualHeadline = profile?.career?.headline || user?.headline || "";

    const actualBio = profile?.career?.summary || "";

    const actualLocation =
      [
        profile?.contact?.city,
        profile?.contact?.state,
        profile?.contact?.country,
      ]
        .filter(Boolean)
        .join(", ") ||
      profile?.career?.preferredLocation ||
      user?.preferredLocation ||
      "";

    const actualPhone = profile?.contact?.phone || "";

    const actualEmail = user?.email || profile?.contact?.email || "";

    const actualUsername =
      (actualEmail ? actualEmail.split("@")[0] : "") ||
      (actualName ? actualName.toLowerCase().replace(/\s+/g, "") : "");

    const actualAvatarUrl =
      profile?.avatar?.url ||
      user?.profileImage ||
      (user as { avatarUrl?: string })?.avatarUrl ||
      "";

    const github = socialLinks?.find((s) => s.platform === "github")?.url;
    const linkedin = socialLinks?.find((s) => s.platform === "linkedin")?.url;
    const portfolio = socialLinks?.find((s) => s.platform === "portfolio")?.url;
    const website = socialLinks?.find((s) => s.platform === "website")?.url;
    const twitter = socialLinks?.find((s) => s.platform === "twitter")?.url;

    const desiredTitle =
      preferences?.preferredRole ||
      profile?.career?.preferredRole ||
      user?.preferredRole ||
      profile?.career?.currentRole;

    const preferredLocs = preferences?.preferredLocation
      ? [preferences.preferredLocation]
      : profile?.career?.preferredLocation
        ? [profile.career.preferredLocation]
        : user?.preferredLocation
          ? [user.preferredLocation]
          : undefined;

    const prefWork = preferences?.workMode || profile?.career?.workPreference;
    const workplaceType = prefWork
      ? [
          prefWork === "remote"
            ? "Remote"
            : prefWork === "hybrid"
              ? "Hybrid"
              : "Onsite",
        ]
      : undefined;

    const salary = preferences?.expectedSalary
      ? `${preferences.currency || "$"}${preferences.expectedSalary}`
      : undefined;

    const isLegacyMock = current.profile.fullName === "Alex Rivera";

    const merged: UserSettings = {
      ...current,
      profile: {
        ...current.profile,
        avatarUrl:
          actualAvatarUrl || (isLegacyMock ? "" : current.profile.avatarUrl),
        fullName: actualName || (isLegacyMock ? "" : current.profile.fullName),
        headline:
          actualHeadline || (isLegacyMock ? "" : current.profile.headline),
        bio: actualBio || (isLegacyMock ? "" : current.profile.bio),
        location:
          actualLocation || (isLegacyMock ? "" : current.profile.location),
        phone: actualPhone || (isLegacyMock ? "" : current.profile.phone),
        website: website || (isLegacyMock ? "" : current.profile.website),
        portfolio: portfolio || (isLegacyMock ? "" : current.profile.portfolio),
        github: github || (isLegacyMock ? "" : current.profile.github),
        linkedin: linkedin || (isLegacyMock ? "" : current.profile.linkedin),
        twitter: twitter || (isLegacyMock ? "" : current.profile.twitter),
      },
      account: {
        ...current.account,
        email: actualEmail || (isLegacyMock ? "" : current.account.email),
        username:
          actualUsername || (isLegacyMock ? "" : current.account.username),
      },
      jobPreferences: {
        ...current.jobPreferences,
        desiredJobTitle:
          desiredTitle ||
          (isLegacyMock ? "" : current.jobPreferences.desiredJobTitle),
        preferredLocations:
          preferredLocs ||
          (isLegacyMock ? [] : current.jobPreferences.preferredLocations),
        workplaceType:
          workplaceType ||
          (isLegacyMock ? ["Remote"] : current.jobPreferences.workplaceType),
        salaryExpectation:
          salary ||
          (isLegacyMock ? "" : current.jobPreferences.salaryExpectation),
        openToRelocation:
          preferences?.relocationWillingness ??
          current.jobPreferences.openToRelocation,
        noticePeriod:
          preferences?.noticePeriod || current.jobPreferences.noticePeriod,
      },
    };

    settingsService.save(merged);

    set((state) => {
      if (!state.hasUnsavedChanges) {
        return {
          settings: merged,
          draftSettings: JSON.parse(JSON.stringify(merged)),
        };
      }
      return { settings: merged };
    });
  },

  updateDraft: (updater) => {
    const draft = get().draftSettings;
    if (!draft) return;

    const nextDraft = JSON.parse(JSON.stringify(draft)); // deep copy
    updater(nextDraft);

    // Check if truly modified
    const original = JSON.stringify(get().settings);
    const modified = JSON.stringify(nextDraft);

    set({
      draftSettings: nextDraft,
      hasUnsavedChanges: original !== modified,
    });
  },

  saveChanges: async () => {
    const draft = get().draftSettings;
    if (!draft) return;

    set({ loading: true });

    // Simulate API network latency (400ms)
    await new Promise((resolve) => setTimeout(resolve, 400));

    settingsService.save(draft);
    set({
      settings: draft,
      hasUnsavedChanges: false,
      loading: false,
    });
  },

  resetChanges: () => {
    const current = get().settings;
    if (!current) return;
    set({
      draftSettings: JSON.parse(JSON.stringify(current)),
      hasUnsavedChanges: false,
    });
  },

  restoreDefaults: () => {
    const defaults = settingsService.reset();
    set({
      settings: defaults,
      draftSettings: JSON.parse(JSON.stringify(defaults)),
      hasUnsavedChanges: false,
    });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  calculateProfileCompletion: () => {
    const draft = get().draftSettings;
    if (!draft || !draft.profile) return 0;

    const p = draft.profile;
    const fields = [
      p.fullName,
      p.headline,
      p.bio,
      p.location,
      p.phone,
      p.website,
      p.portfolio,
      p.github,
      p.linkedin,
      p.twitter,
    ];

    const filled = fields.filter((f) => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  },
}));
export type { SettingsTab };
