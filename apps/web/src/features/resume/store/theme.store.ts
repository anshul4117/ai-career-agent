"use client";

import { create } from "zustand";
import type { ResumeTheme } from "../types/resume.types";
import { themeService, DEFAULT_THEME } from "../services/theme.service";
import { useBuilderStore } from "./builder.store";

interface ThemeState {
  currentTheme: ResumeTheme;
  favoritedTemplates: string[];
  resumeId: string | null;

  // Actions
  loadTheme: (resumeId: string) => void;
  updateTheme: (updates: Partial<ResumeTheme>) => void;
  applyPreset: (presetName: string) => void;
  toggleFavoriteTemplate: (templateId: string) => void;
  resetTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  currentTheme: { ...DEFAULT_THEME },
  favoritedTemplates: [],
  resumeId: null,

  loadTheme: (resumeId) => {
    const theme = themeService.loadTheme(resumeId);
    
    // Load favorites from local storage
    let favorites: string[] = [];
    if (typeof window !== "undefined") {
      const savedFavs = localStorage.getItem("ai-career-agent:favorite-templates");
      if (savedFavs) {
        try {
          favorites = JSON.parse(savedFavs);
        } catch {
          favorites = [];
        }
      }
    }

    set({ currentTheme: theme, resumeId, favoritedTemplates: favorites });

    // Also update builder store's currentResume's theme object so the preview canvas is synchronized!
    const builderStore = useBuilderStore.getState();
    if (builderStore.currentResume) {
      // Sync it silently without committing to history
      builderStore.currentResume.theme = theme;
    }
  },

  updateTheme: (updates) => {
    const { currentTheme, resumeId } = get();
    const newTheme = { ...currentTheme, ...updates };
    
    // If layout columns or width changed, it's a discrete layout preset override
    if (updates.activePreset === undefined) {
      newTheme.activePreset = "custom";
    }

    set({ currentTheme: newTheme });

    if (resumeId) {
      themeService.saveTheme(resumeId, newTheme);
      
      // Update builder store to trigger debounced auto-save & history tracking!
      const builderStore = useBuilderStore.getState();
      if (builderStore.currentResume && builderStore.currentResume.content) {
        builderStore.commitHistory();
        builderStore.currentResume.theme = newTheme;
        
        // Trigger save callback in builder store
        useBuilderStore.setState({
          currentResume: {
            ...builderStore.currentResume,
            theme: newTheme
          }
        });
        // Call auto-save trigger
        builderStore.forceSave();
      }
    }
  },

  applyPreset: (presetName) => {
    const presetTheme = themeService.applyPreset(presetName);
    get().updateTheme(presetTheme);
  },

  toggleFavoriteTemplate: (templateId) => {
    const { favoritedTemplates } = get();
    const isFav = favoritedTemplates.includes(templateId);
    const newFavs = isFav 
      ? favoritedTemplates.filter(id => id !== templateId)
      : [...favoritedTemplates, templateId];

    set({ favoritedTemplates: newFavs });

    if (typeof window !== "undefined") {
      localStorage.setItem("ai-career-agent:favorite-templates", JSON.stringify(newFavs));
    }
  },

  resetTheme: () => {
    const { resumeId } = get();
    if (resumeId) {
      const theme = themeService.resetTheme(resumeId);
      set({ currentTheme: theme });
      
      // Update builder store
      const builderStore = useBuilderStore.getState();
      if (builderStore.currentResume) {
        builderStore.commitHistory();
        builderStore.currentResume.theme = theme;
        useBuilderStore.setState({
          currentResume: {
            ...builderStore.currentResume,
            theme
          }
        });
      }
    }
  }
}));
