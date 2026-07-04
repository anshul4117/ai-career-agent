import type { ResumeTheme } from "../types/resume.types";

export const DEFAULT_THEME: ResumeTheme = {
  primaryColor: "#0f172a", // Slate 900
  accentColor: "#2563eb",  // Blue 600
  backgroundColor: "#ffffff",
  textColor: "#334155",    // Slate 700
  headingColor: "#0f172a",
  headingFont: "Inter",
  bodyFont: "Inter",
  fontSize: "11px",
  lineHeight: "normal",
  letterSpacing: "tracking-normal",
  columns: 1,
  sidebarPosition: "left",
  widthMode: "wide",
  margins: "p-8",
  sectionSpacing: "space-y-5",
  paragraphSpacing: "space-y-1.5",
  itemSpacing: "space-y-2.5",
  roundedCorners: "rounded-none",
  borderStyle: "border-none",
  dividerStyle: "divider-solid",
  sectionBackground: "bg-transparent",
  activePreset: "default"
};

export const THEME_PRESETS: Record<string, ResumeTheme> = {
  default: { ...DEFAULT_THEME },
  professional: {
    primaryColor: "#0f172a",
    accentColor: "#2563eb",
    backgroundColor: "#ffffff",
    textColor: "#334155",
    headingColor: "#0f172a",
    headingFont: "Inter",
    bodyFont: "Inter",
    fontSize: "11px",
    lineHeight: "normal",
    letterSpacing: "tracking-normal",
    columns: 2,
    sidebarPosition: "right",
    widthMode: "compact",
    margins: "p-8",
    sectionSpacing: "space-y-5",
    paragraphSpacing: "space-y-1.5",
    itemSpacing: "space-y-2.5",
    roundedCorners: "rounded-none",
    borderStyle: "border-none",
    dividerStyle: "divider-solid",
    sectionBackground: "bg-transparent",
    activePreset: "professional"
  },
  corporate: {
    primaryColor: "#1e3a8a",
    accentColor: "#0d9488",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    headingColor: "#111827",
    headingFont: "Georgia",
    bodyFont: "Inter",
    fontSize: "11px",
    lineHeight: "normal",
    letterSpacing: "tracking-normal",
    columns: 1,
    sidebarPosition: "left",
    widthMode: "wide",
    margins: "p-8",
    sectionSpacing: "space-y-7",
    paragraphSpacing: "space-y-1",
    itemSpacing: "space-y-2",
    roundedCorners: "rounded-sm",
    borderStyle: "border-none",
    dividerStyle: "divider-solid",
    sectionBackground: "bg-transparent",
    activePreset: "corporate"
  },
  developer: {
    primaryColor: "#10b981",
    accentColor: "#3b82f6",
    backgroundColor: "#0f172a",
    textColor: "#e2e8f0",
    headingColor: "#38bdf8",
    headingFont: "Fira Code",
    bodyFont: "Fira Code",
    fontSize: "10px",
    lineHeight: "relaxed",
    letterSpacing: "tracking-normal",
    columns: 1,
    sidebarPosition: "left",
    widthMode: "compact",
    margins: "p-6",
    sectionSpacing: "space-y-5",
    paragraphSpacing: "space-y-1",
    itemSpacing: "space-y-2",
    roundedCorners: "rounded-md",
    borderStyle: "border-2 border-solid",
    dividerStyle: "divider-dashed",
    sectionBackground: "bg-slate-50/50",
    activePreset: "developer"
  },
  creative: {
    primaryColor: "#db2777",
    accentColor: "#f59e0b",
    backgroundColor: "#faf5ff",
    textColor: "#581c87",
    headingColor: "#3b0764",
    headingFont: "Playfair Display",
    bodyFont: "Inter",
    fontSize: "12px",
    lineHeight: "relaxed",
    letterSpacing: "tracking-wide",
    columns: 2,
    sidebarPosition: "left",
    widthMode: "wide",
    margins: "p-8",
    sectionSpacing: "space-y-7",
    paragraphSpacing: "space-y-2",
    itemSpacing: "space-y-3.5",
    roundedCorners: "rounded-lg",
    borderStyle: "border-2 border-solid",
    dividerStyle: "divider-solid",
    sectionBackground: "bg-slate-100/50",
    activePreset: "creative"
  },
  minimal: {
    primaryColor: "#000000",
    accentColor: "#475569",
    backgroundColor: "#ffffff",
    textColor: "#4b5563",
    headingColor: "#111827",
    headingFont: "Inter",
    bodyFont: "Georgia",
    fontSize: "10px",
    lineHeight: "tight",
    letterSpacing: "tracking-tight",
    columns: 1,
    sidebarPosition: "left",
    widthMode: "compact",
    margins: "p-4",
    sectionSpacing: "space-y-3",
    paragraphSpacing: "space-y-1",
    itemSpacing: "space-y-1.5",
    roundedCorners: "rounded-none",
    borderStyle: "border-none",
    dividerStyle: "divider-none",
    sectionBackground: "bg-transparent",
    activePreset: "minimal"
  },
  classic: {
    primaryColor: "#000000",
    accentColor: "#000000",
    backgroundColor: "#ffffff",
    textColor: "#111827",
    headingColor: "#000000",
    headingFont: "Times New Roman",
    bodyFont: "Times New Roman",
    fontSize: "11px",
    lineHeight: "normal",
    letterSpacing: "tracking-normal",
    columns: 1,
    sidebarPosition: "left",
    widthMode: "wide",
    margins: "p-8",
    sectionSpacing: "space-y-5",
    paragraphSpacing: "space-y-1.5",
    itemSpacing: "space-y-2.5",
    roundedCorners: "rounded-none",
    borderStyle: "border-none",
    dividerStyle: "divider-solid",
    sectionBackground: "bg-transparent",
    activePreset: "classic"
  }
};

const LOCAL_STORAGE_KEY_PREFIX = "ai-career-agent:theme:";

export const themeService = {
  loadTheme(resumeId: string): ResumeTheme {
    if (typeof window === "undefined") return { ...DEFAULT_THEME };
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY_PREFIX}${resumeId}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return { ...DEFAULT_THEME };
      }
    }
    return { ...DEFAULT_THEME };
  },

  saveTheme(resumeId: string, theme: ResumeTheme): void {
    if (typeof window === "undefined") return;
    localStorage.setItem(`${LOCAL_STORAGE_KEY_PREFIX}${resumeId}`, JSON.stringify(theme));
  },

  resetTheme(resumeId: string): ResumeTheme {
    const defaultTheme = { ...DEFAULT_THEME };
    this.saveTheme(resumeId, defaultTheme);
    return defaultTheme;
  },

  applyPreset(presetName: string): ResumeTheme {
    const preset = THEME_PRESETS[presetName] || DEFAULT_THEME;
    return { ...preset };
  },

  duplicateTheme(sourceId: string, targetId: string): void {
    const sourceTheme = this.loadTheme(sourceId);
    this.saveTheme(targetId, sourceTheme);
  }
};
