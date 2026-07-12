"use client";
 
import React from "react";
import { useSettingsStore, type SettingsTab } from "../store/settings.store";
import { settingsService } from "../services/settings.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { 
  User, 
  Key, 
  Briefcase, 
  Bell, 
  Sparkles, 
  Palette, 
  Link, 
  Shield,
  Download,
  RotateCcw,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";
 
export function SettingsSidebar() {
  const { 
    activeTab, 
    setActiveTab, 
    calculateProfileCompletion, 
    settings,
    draftSettings,
    restoreDefaults,
    loadSettings
  } = useSettingsStore();
 
  const completion = calculateProfileCompletion();
 
  const menuItems = [
    { id: "profile" as SettingsTab, label: "Profile", icon: User },
    { id: "account" as SettingsTab, label: "Account Info", icon: Key },
    { id: "jobs" as SettingsTab, label: "Job Preferences", icon: Briefcase },
    { id: "notifications" as SettingsTab, label: "Notifications", icon: Bell },
    { id: "ai" as SettingsTab, label: "AI & Resume Setup", icon: Sparkles },
    { id: "appearance" as SettingsTab, label: "Appearance", icon: Palette },
    { id: "connections" as SettingsTab, label: "Linked Accounts", icon: Link },
    { id: "privacy" as SettingsTab, label: "Privacy & Safety", icon: Shield }
  ];
 
  const handleExport = () => {
    if (!draftSettings) return;
    const dataStr = settingsService.export(draftSettings);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ai_career_agent_settings_${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };
 
  const handleRestore = () => {
    if (!window.confirm("Are you sure you want to restore default factory settings? Any unsaved edits will be discarded.")) return;
    restoreDefaults();
    loadSettings();
  };
 
  return (
    <div className="space-y-4 text-left select-none">
      
      {/* 1. Navigation Menu */}
      <BrutalCard className="border-[3px] border-border bg-surface p-2.5 rounded-sm brutal-shadow-xs">
        <nav className="flex flex-col gap-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "w-full text-left py-2 px-3 text-[10px] font-black uppercase tracking-wider rounded-xs transition-colors flex items-center gap-2",
                  isActive 
                    ? "bg-primary text-white" 
                    : "hover:bg-surface-secondary text-foreground-secondary"
                )}
                aria-label={`Navigate to ${item.label}`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </BrutalCard>
 
      {/* 2. Profile Completion Widget */}
      <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-3">
        <div>
          <span className="text-[8px] font-black uppercase tracking-wider text-foreground-muted block">completeness gauge</span>
          <h4 className="text-[10px] font-black uppercase text-foreground">Candidate Profile Score</h4>
        </div>
 
        <div className="space-y-1">
          <div className="flex justify-between items-center text-[9px] font-mono font-black text-primary">
            <span>{completion}% Completed</span>
          </div>
          <div className="h-3 w-full bg-slate-100 dark:bg-surface-hover border border-border rounded-sm overflow-hidden p-0.5">
            <div 
              className="h-full bg-primary transition-all duration-300 rounded-2xs" 
              style={{ width: `${completion}%` }}
            />
          </div>
        </div>
        <p className="text-[7.5px] text-foreground-secondary leading-relaxed font-bold">
          Fill in your headline, location, and social handles to reach a perfect 100% score for recruiter queries.
        </p>
      </BrutalCard>
 
      {/* 3. Settings Operations */}
      <BrutalCard className="border-[3px] border-border bg-surface p-3.5 rounded-sm brutal-shadow-xs space-y-2 text-[9px] font-bold uppercase">
        <span className="text-[7.5px] font-black text-foreground-muted block">system diagnostic settings</span>
        
        <BrutalButton
          onClick={handleExport}
          className="w-full h-8 flex items-center justify-center gap-1 text-[8.5px] font-black uppercase"
          variant="secondary"
        >
          <Download className="h-3.5 w-3.5" /> Export Configuration
        </BrutalButton>
 
        <BrutalButton
          onClick={handleRestore}
          className="w-full h-8 flex items-center justify-center gap-1 text-[8.5px] font-black uppercase border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          variant="secondary"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Factory Reset
        </BrutalButton>
 
        {settings?.lastUpdated && (
          <div className="flex items-center justify-center gap-1 text-[7px] font-mono text-foreground-muted border-t border-border/10 pt-2.5 mt-2.5 select-none">
            <Clock className="h-3 w-3" /> Updated: {new Date(settings.lastUpdated).toLocaleTimeString()}
          </div>
        )}
      </BrutalCard>
    </div>
  );
}
