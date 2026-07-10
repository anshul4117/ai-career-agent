"use client";
 
import { create } from "zustand";
import type { UserSettings } from "../types/settings.types";
import { settingsService } from "../services/settings.service";
 
type SettingsTab = "profile" | "account" | "jobs" | "notifications" | "ai" | "appearance" | "connections" | "privacy";
 
interface SettingsState {
  settings: UserSettings | null;
  draftSettings: UserSettings | null;
  loading: boolean;
  hasUnsavedChanges: boolean;
  activeTab: SettingsTab;
 
  // Actions
  loadSettings: () => void;
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
      hasUnsavedChanges: false 
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
      hasUnsavedChanges: original !== modified
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
      loading: false
    });
  },
 
  resetChanges: () => {
    const current = get().settings;
    if (!current) return;
    set({
      draftSettings: JSON.parse(JSON.stringify(current)),
      hasUnsavedChanges: false
    });
  },
 
  restoreDefaults: () => {
    const defaults = settingsService.reset();
    set({
      settings: defaults,
      draftSettings: JSON.parse(JSON.stringify(defaults)),
      hasUnsavedChanges: false
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
      p.twitter
    ];
 
    const filled = fields.filter((f) => f && f.trim() !== "").length;
    return Math.round((filled / fields.length) * 100);
  }
}));
export type { SettingsTab };
