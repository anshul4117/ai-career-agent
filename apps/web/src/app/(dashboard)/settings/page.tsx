"use client";
 
import React, { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useSettingsStore, type SettingsTab } from "@/features/settings/store/settings.store";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { SettingsSidebar } from "@/features/settings/components/settings-sidebar";
import { SettingsPanels } from "@/features/settings/components/settings-panels";
import { cn } from "@/lib/utils";
 
export default function SettingsPage() {
  const { loadSettings, activeTab, setActiveTab } = useSettingsStore();
  const { loadResumes } = useResumeStore();
 
  useEffect(() => {
    loadSettings();
    loadResumes();
  }, [loadSettings, loadResumes]);
 
  // Mobile horizontal scroll tabs definitions
  const mobileTabs = [
    { id: "profile" as SettingsTab, label: "Profile" },
    { id: "account" as SettingsTab, label: "Account" },
    { id: "jobs" as SettingsTab, label: "Job Preferences" },
    { id: "notifications" as SettingsTab, label: "Notifications" },
    { id: "ai" as SettingsTab, label: "AI & Resumes" },
    { id: "appearance" as SettingsTab, label: "Appearance" },
    { id: "connections" as SettingsTab, label: "Linked" },
    { id: "privacy" as SettingsTab, label: "Privacy" }
  ];
 
  return (
    <div className="space-y-6 pb-12 select-none relative max-w-[1200px] mx-auto w-full">
      <PageHeader 
        title="Settings & Preferences" 
        description="Manage your profile metadata, AI assistants settings, notifications frequency, and credentials." 
      />
 
      {/* Mobile Horizontal Tab Navigation */}
      <div className="block lg:hidden overflow-x-auto border-b-2 border-border bg-surface p-1 select-none shrink-0 rounded-sm">
        <div className="flex gap-1.5 min-w-[640px] px-1 py-1">
          {mobileTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "py-1.5 px-3 text-[9px] font-black uppercase tracking-wider border border-border rounded-xs transition-colors",
                activeTab === tab.id 
                  ? "bg-primary text-white border-primary" 
                  : "bg-surface text-foreground-secondary hover:bg-surface-secondary"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
 
      {/* Desktop side-by-side grid */}
      <div className="grid gap-6 lg:grid-cols-4 items-start">
        
        {/* Left Column: Sidebar on Desktop, hidden on mobile */}
        <div className="hidden lg:block lg:col-span-1">
          <SettingsSidebar />
        </div>
 
        {/* Right Column: Active Configuration Forms Panels */}
        <div className="lg:col-span-3">
          <SettingsPanels />
        </div>
 
      </div>
    </div>
  );
}
