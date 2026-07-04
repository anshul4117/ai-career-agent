"use client";

import { create } from "zustand";

export interface ExportSettings {
  paperSize: "a4" | "letter";
  orientation: "portrait" | "landscape";
  margins: "narrow" | "normal" | "wide";
  scale: 90 | 100 | 110;
  hideColors: boolean; // Grayscale mode
  printBackground: boolean;
  pageBreakPreview: boolean;
  sectionBreaks: boolean;
  widowProtection: boolean;
}

export interface ExportLog {
  id: string;
  timestamp: string;
  format: "pdf" | "print" | "html" | "json";
  templateId: string;
}

interface ExportState {
  settings: ExportSettings;
  exportHistory: ExportLog[];
  isExporting: boolean;
  resumeId: string | null;

  // Actions
  updateSettings: (updates: Partial<ExportSettings>) => void;
  addExportLog: (format: "pdf" | "print" | "html" | "json", templateId: string) => void;
  loadExportHistory: (resumeId: string) => void;
  setExporting: (state: boolean) => void;
}

const DEFAULT_SETTINGS: ExportSettings = {
  paperSize: "a4",
  orientation: "portrait",
  margins: "normal",
  scale: 100,
  hideColors: false,
  printBackground: true,
  pageBreakPreview: true,
  sectionBreaks: false,
  widowProtection: true,
};

const LOCAL_STORAGE_KEY_PREFIX = "ai-career-agent:export-history:";

export const useExportStore = create<ExportState>((set, get) => ({
  settings: { ...DEFAULT_SETTINGS },
  exportHistory: [],
  isExporting: false,
  resumeId: null,

  updateSettings: (updates) => {
    set((state) => ({
      settings: { ...state.settings, ...updates }
    }));
  },

  loadExportHistory: (resumeId) => {
    let history: ExportLog[] = [];
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${resumeId}`);
      if (saved) {
        try {
          history = JSON.parse(saved);
        } catch {
          history = [];
        }
      }
    }
    set({ exportHistory: history, resumeId });
  },

  addExportLog: (format, templateId) => {
    const { exportHistory, resumeId } = get();
    const newLog: ExportLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleString(),
      format,
      templateId
    };

    const updated = [newLog, ...exportHistory].slice(0, 20); // Keep last 20 logs
    set({ exportHistory: updated });

    if (typeof window !== "undefined" && resumeId) {
      localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${resumeId}`, JSON.stringify(updated));
    }
  },

  setExporting: (state) => {
    set({ isExporting: state });
  }
}));
