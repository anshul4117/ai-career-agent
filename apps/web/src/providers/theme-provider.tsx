"use client";
 
import React, { useEffect } from "react";
import { useSettingsStore } from "@/features/settings/store/settings.store";
 
interface ThemeProviderProps {
  children: React.ReactNode;
}
 
export function ThemeProvider({ children }: ThemeProviderProps) {
  const { settings, loadSettings } = useSettingsStore();
 
  // Load settings on mount to bootstrap user preferences
  useEffect(() => {
    if (!settings) {
      loadSettings();
    }
  }, [settings, loadSettings]);
 
  // Sync the DOM class with the theme preference
  useEffect(() => {
    if (!settings) return;
 
    const theme = settings.appearance.theme;
    const root = document.documentElement;
 
    root.classList.remove("light", "dark");
 
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [settings]);
 
  // Listen for real-time OS preference changes if "system" mode is active
  useEffect(() => {
    if (settings?.appearance.theme !== "system") return;
 
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(e.matches ? "dark" : "light");
    };
 
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [settings]);
 
  return <>{children}</>;
}
