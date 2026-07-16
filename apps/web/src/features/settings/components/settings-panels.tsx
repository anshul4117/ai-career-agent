"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useSettingsStore } from "../store/settings.store";
import { useResumeStore } from "../../resume/store/resume.store";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  User, 
  Key, 
  Briefcase, 
  Bell, 
  Sparkles, 
  Palette, 
  Link as LinkIcon, 
  Shield, 
  ShieldAlert,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

 
export function SettingsPanels() {
  const { resumes } = useResumeStore();
  const { 
    activeTab, 
    draftSettings, 
    updateDraft, 
    saveChanges, 
    resetChanges, 
    hasUnsavedChanges,
    loading 
  } = useSettingsStore();
  const { confirm, ConfirmationDialog } = useConfirm();
 
  // Modals Local State
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
 
  if (!draftSettings) return null;
 
  const handleSaveAll = async () => {
    await saveChanges();
    toast.success("All configuration settings saved successfully!");
  };
 
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    setPasswordModalOpen(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    toast.success("Password updated successfully!");
  };
 
  const handleDeleteAccount = () => {
    if (deleteConfirmText !== "DELETE") {
      toast.error("Please type DELETE to confirm!");
      return;
    }
    setDeleteModalOpen(false);
    setDeleteConfirmText("");
    toast.info("Account deletion simulated successfully! In production, this would delete your profile.");
  };
 
  const handleToggleConnection = (providerId: string) => {
    updateDraft((draft) => {
      draft.connections = draft.connections.map((c) => 
        c.id === providerId ? { ...c, connected: !c.connected, username: !c.connected ? "linked_user" : undefined } : c
      );
    });
    toast.success("Updated account connection status!");
  };
 
  // Multi-select helper
  const handleToggleArrayItem = (path: "employmentType" | "experienceLevel" | "workplaceType", item: string) => {
    updateDraft((draft) => {
      const arr = draft.jobPreferences[path];
      if (arr.includes(item)) {
        draft.jobPreferences[path] = arr.filter((x) => x !== item);
      } else {
        draft.jobPreferences[path] = [...arr, item];
      }
    });
  };
 
  return (
    <div className="space-y-6 text-left relative">
 
      {/* Active Form Sections */}
      <div className="space-y-6 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
 
        {/* Section 1: Profile */}
        {activeTab === "profile" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <User className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Candidate Profile Settings</h3>
            </div>
 
            {/* Avatar mock */}
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 border-2 border-border bg-slate-100 dark:bg-surface-hover flex items-center justify-center font-black text-xl uppercase rounded-sm text-foreground-muted select-none">
                AR
              </div>
              <div className="space-y-1">
                <label className="text-[8.5px] font-black uppercase text-foreground-muted block">Avatar Upload</label>
                <BrutalButton variant="secondary" size="sm" className="h-7.5 text-[8.5px] font-black uppercase" onClick={() => toast.success("Avatar file dialog uploaded")}>
                  Upload New
                </BrutalButton>
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Full Name</label>
                <input
                  type="text"
                  value={draftSettings.profile.fullName}
                  onChange={(e) => updateDraft((d) => { d.profile.fullName = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Professional Headline</label>
                <input
                  type="text"
                  value={draftSettings.profile.headline}
                  onChange={(e) => updateDraft((d) => { d.profile.headline = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
            </div>
 
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary block">Professional Bio</label>
              <textarea
                value={draftSettings.profile.bio}
                onChange={(e) => updateDraft((d) => { d.profile.bio = e.target.value; })}
                rows={4}
                className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
              />
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-3">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Location</label>
                <input
                  type="text"
                  value={draftSettings.profile.location}
                  onChange={(e) => updateDraft((d) => { d.profile.location = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Phone Number</label>
                <input
                  type="text"
                  value={draftSettings.profile.phone}
                  onChange={(e) => updateDraft((d) => { d.profile.phone = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Personal Website</label>
                <input
                  type="text"
                  value={draftSettings.profile.website}
                  onChange={(e) => updateDraft((d) => { d.profile.website = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-3 border-t border-border/10 pt-3.5 mt-3.5">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">GitHub Profile</label>
                <input
                  type="text"
                  value={draftSettings.profile.github}
                  onChange={(e) => updateDraft((d) => { d.profile.github = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">LinkedIn Link</label>
                <input
                  type="text"
                  value={draftSettings.profile.linkedin}
                  onChange={(e) => updateDraft((d) => { d.profile.linkedin = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Twitter / X Handle</label>
                <input
                  type="text"
                  value={draftSettings.profile.twitter || ""}
                  onChange={(e) => updateDraft((d) => { d.profile.twitter = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
            </div>
          </BrutalCard>
        )}
 
        {/* Section 2: Account */}
        {activeTab === "account" && (
          <div className="space-y-4">
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
                <Key className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Account Credentials</h3>
              </div>
 
              <div className="grid gap-3.5 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary block">Account Email Address</label>
                  <input
                    type="email"
                    value={draftSettings.account.email}
                    onChange={(e) => updateDraft((d) => { d.account.email = e.target.value; })}
                    className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-black uppercase text-foreground-secondary block">Username</label>
                  <input
                    type="text"
                    value={draftSettings.account.username}
                    onChange={(e) => updateDraft((d) => { d.account.username = e.target.value; })}
                    className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                  />
                </div>
              </div>
 
              <div className="flex gap-2.5 border-t border-border/10 pt-4 mt-2">
                <BrutalButton variant="secondary" className="h-9 px-4 uppercase font-bold text-xs" onClick={() => setPasswordModalOpen(true)}>
                  Change Account Password
                </BrutalButton>
                <BrutalButton variant="secondary" className="h-9 px-4 uppercase font-bold text-xs border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 ml-auto" onClick={() => setDeleteModalOpen(true)}>
                  Delete Account
                </BrutalButton>
              </div>
            </BrutalCard>
 
            {/* Active Sessions list */}
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-3.5 text-xs font-semibold">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Active Sessions Devices</h3>
                <p className="text-[8px] text-foreground-muted uppercase">Devices currently logged into this candidate profile</p>
              </div>
 
              <div className="border border-border rounded-sm overflow-hidden select-none bg-surface-secondary/20">
                <table className="w-full text-[9.5px] text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-surface-hover/50 border-b-2 border-border text-[8px] font-black uppercase tracking-wider text-foreground-muted">
                      <th className="p-2 border-r border-border">Device / OS</th>
                      <th className="p-2 border-r border-border">Location</th>
                      <th className="p-2">Last Active</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-border">
                      <td className="p-2 border-r border-border font-bold">Apple Macbook Pro 16</td>
                      <td className="p-2 border-r border-border">San Francisco, CA (Active)</td>
                      <td className="p-2">Just now</td>
                    </tr>
                    <tr className="border-b border-border">
                      <td className="p-2 border-r border-border font-bold">Apple iPhone 15 Pro</td>
                      <td className="p-2 border-r border-border">San Francisco, CA</td>
                      <td className="p-2">2 hours ago</td>
                    </tr>
                    <tr>
                      <td className="p-2 border-r border-border font-bold">Chrome on Windows 11 Desktop</td>
                      <td className="p-2 border-r border-border">Seattle, WA</td>
                      <td className="p-2">3 days ago</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </BrutalCard>
          </div>
        )}
 
        {/* Section 3: Job Preferences */}
        {activeTab === "jobs" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <Briefcase className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Job Discovery Preferences</h3>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Desired Job Title</label>
                <input
                  type="text"
                  value={draftSettings.jobPreferences.desiredJobTitle}
                  onChange={(e) => updateDraft((d) => { d.jobPreferences.desiredJobTitle = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
 
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Salary Expectation</label>
                <input
                  type="text"
                  value={draftSettings.jobPreferences.salaryExpectation}
                  onChange={(e) => updateDraft((d) => { d.jobPreferences.salaryExpectation = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                />
              </div>
            </div>
 
            {/* Employment Type Multi-checkboxes */}
            <div className="grid gap-3.5 sm:grid-cols-3 border-t border-border/10 pt-3.5">
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">Employment Type</span>
                {["Full-time", "Part-time", "Contract", "Internship"].map((type) => (
                  <label key={type} className="flex items-center gap-2 text-[10.5px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftSettings.jobPreferences.employmentType.includes(type)}
                      onChange={() => handleToggleArrayItem("employmentType", type)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
 
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">Experience Level</span>
                {["Entry", "Mid-level", "Senior", "Lead"].map((lvl) => (
                  <label key={lvl} className="flex items-center gap-2 text-[10.5px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftSettings.jobPreferences.experienceLevel.includes(lvl)}
                      onChange={() => handleToggleArrayItem("experienceLevel", lvl)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{lvl}</span>
                  </label>
                ))}
              </div>
 
              <div className="space-y-2">
                <span className="text-[9px] font-black uppercase text-foreground-secondary block">Workplace Type</span>
                {["Remote", "Hybrid", "Onsite"].map((w) => (
                  <label key={w} className="flex items-center gap-2 text-[10.5px] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftSettings.jobPreferences.workplaceType.includes(w)}
                      onChange={() => handleToggleArrayItem("workplaceType", w)}
                      className="h-4 w-4 accent-primary"
                    />
                    <span>{w}</span>
                  </label>
                ))}
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2 border-t border-border/10 pt-3.5 mt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Notice Period</label>
                <select
                  value={draftSettings.jobPreferences.noticePeriod}
                  onChange={(e) => updateDraft((d) => { d.jobPreferences.noticePeriod = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="Immediate">Immediate</option>
                  <option value="2 Weeks">2 Weeks</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                </select>
              </div>
 
              <div className="space-y-3.5 flex flex-col justify-end">
                <label className="flex items-center gap-2 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.jobPreferences.openToRelocation}
                    onChange={(e) => updateDraft((d) => { d.jobPreferences.openToRelocation = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>Open to Relocation</span>
                </label>
                <label className="flex items-center gap-2 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.jobPreferences.openToRecruiters}
                    onChange={(e) => updateDraft((d) => { d.jobPreferences.openToRecruiters = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <span>Open to Recruiters query searches</span>
                </label>
              </div>
            </div>
          </BrutalCard>
        )}
 
        {/* Section 4: Notifications */}
        {activeTab === "notifications" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <Bell className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Notification Toggle Settings</h3>
            </div>
 
            <div className="space-y-3">
              {[
                { key: "jobAlerts" as const, label: "Job Alerts", desc: "Instant notifications for matching job posts." },
                { key: "savedSearchAlerts" as const, label: "Saved Search Alerts", desc: "Alert me when new matches populate my saved filters." },
                { key: "applicationUpdates" as const, label: "Application Lifecycle Updates", desc: "Alerts when my application tracker status updates." },
                { key: "interviewReminders" as const, label: "Interview Reminders", desc: "Calendar events and mock prep prompts." },
                { key: "weeklyDigest" as const, label: "Weekly Career Digest", desc: "Summary mailers containing match metrics and profile completion tasks." },
                { key: "productUpdates" as const, label: "Product & Release Updates", desc: "Newsletters about AI agents features releases." },
                { key: "marketingEmails" as const, label: "Marketing Promotions", desc: "Occasional promotional events and partnership details." }
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center p-2.5 border border-border bg-surface rounded-sm">
                  <div className="space-y-0.5 max-w-[80%]">
                    <span className="text-[10px] font-black uppercase block">{item.label}</span>
                    <span className="text-[8px] text-foreground-secondary block">{item.desc}</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={draftSettings.notifications[item.key]}
                    onChange={(e) => updateDraft((d) => { d.notifications[item.key] = e.target.checked; })}
                    className="h-5 w-5 accent-primary cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </BrutalCard>
        )}
 
        {/* Section 5: AI Preferences */}
        {activeTab === "ai" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">AI Assistant Core Preferences</h3>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Default Resume Profile</label>
                <select
                  value={draftSettings.ai.defaultResumeId}
                  onChange={(e) => updateDraft((d) => { d.ai.defaultResumeId = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="res_primary">Primary Resume Profile</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>{r.title}</option>
                  ))}
                </select>
              </div>
 
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Default Cover Letter template</label>
                <select
                  value={draftSettings.ai.defaultCoverLetterTemplate}
                  onChange={(e) => updateDraft((d) => { d.ai.defaultCoverLetterTemplate = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="professional">Standard Professional</option>
                  <option value="startup">Startup Tech</option>
                  <option value="enterprise">Enterprise Systems</option>
                  <option value="modern">Streamlined Modern</option>
                  <option value="minimal">Letter Minimal</option>
                </select>
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">AI Writing Pitch Tone</label>
                <select
                  value={draftSettings.ai.aiWritingTone}
                  onChange={(e) => updateDraft((d) => { d.ai.aiWritingTone = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="confident">Confident & Bold</option>
                  <option value="formal">Conservative Formal</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
 
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[9px] font-black uppercase">
                  <span>ATS Optimization target Level</span>
                  <span>{draftSettings.ai.atsOptimizationLevel}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={draftSettings.ai.atsOptimizationLevel}
                  onChange={(e) => updateDraft((d) => { d.ai.atsOptimizationLevel = parseInt(e.target.value); })}
                  className="w-full accent-primary mt-2"
                />
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2 border-t border-border/10 pt-3.5 mt-2">
              <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={draftSettings.ai.autoResumeOptimization}
                  onChange={(e) => updateDraft((d) => { d.ai.autoResumeOptimization = e.target.checked; })}
                  className="h-4 w-4 accent-primary"
                />
                <div className="space-y-0.5">
                  <span className="font-black uppercase block text-[10px]">Auto Resume Optimization</span>
                  <span className="text-[8px] text-foreground-muted block">Run optimization scans immediately on JD paste.</span>
                </div>
              </label>
 
              <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={draftSettings.ai.autoCoverLetterPersonalization}
                  onChange={(e) => updateDraft((d) => { d.ai.autoCoverLetterPersonalization = e.target.checked; })}
                  className="h-4 w-4 accent-primary"
                />
                <div className="space-y-0.5">
                  <span className="font-black uppercase block text-[10px]">Auto Personalization letter</span>
                  <span className="text-[8px] text-foreground-muted block">Inject company values in paragraphs dynamically.</span>
                </div>
              </label>
            </div>
          </BrutalCard>
        )}
 
        {/* Section 6: Appearance */}
        {activeTab === "appearance" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <Palette className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Theme & Appearance</h3>
            </div>
 
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase text-foreground-secondary block">Select Layout Theme Mode</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "light" as const, label: "Brutal Light" },
                  { id: "dark" as const, label: "Midnight Dark" },
                  { id: "system" as const, label: "System Default" }
                ].map((t) => (
                  <button
                    type="button"
                    key={t.id}
                    onClick={() => updateDraft((d) => { d.appearance.theme = t.id; })}
                    className={cn(
                      "py-2 text-[9px] font-black uppercase tracking-wider border-2 border-border rounded-sm transition-colors",
                      draftSettings.appearance.theme === t.id ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary text-foreground-secondary"
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Theme Color Accent Palette</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={draftSettings.appearance.accentColor}
                    onChange={(e) => updateDraft((d) => { d.appearance.accentColor = e.target.value; })}
                    className="h-9 w-12 border-2 border-border rounded-sm cursor-pointer p-0.5 bg-surface"
                  />
                  <span className="font-mono text-[9px] uppercase tracking-wider">{draftSettings.appearance.accentColor}</span>
                </div>
              </div>
 
              <div className="space-y-1 flex flex-col justify-end">
                <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.appearance.compactMode}
                    onChange={(e) => updateDraft((d) => { d.appearance.compactMode = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="font-black uppercase block text-[10px]">Enable Compact Layout Mode</span>
                    <span className="text-[8px] text-foreground-muted block">Reduces padding margins to display denser text profiles.</span>
                  </div>
                </label>
              </div>
            </div>
 
            <div className="grid gap-3.5 sm:grid-cols-2 border-t border-border/10 pt-3.5 mt-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">System Language</label>
                <select
                  value={draftSettings.appearance.language}
                  onChange={(e) => updateDraft((d) => { d.appearance.language = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Spanish (Español)</option>
                  <option value="French">French (Français)</option>
                  <option value="German">German (Deutsch)</option>
                  <option value="Japanese">Japanese (日本語)</option>
                </select>
              </div>
 
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">System Time Zone</label>
                <select
                  value={draftSettings.appearance.timezone}
                  onChange={(e) => updateDraft((d) => { d.appearance.timezone = e.target.value; })}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="UTC -8 (PST)">UTC -8 (PST)</option>
                  <option value="UTC -5 (EST)">UTC -5 (EST)</option>
                  <option value="UTC +0 (GMT)">UTC +0 (GMT)</option>
                  <option value="UTC +1 (CET)">UTC +1 (CET)</option>
                  <option value="UTC +5.5 (IST)">UTC +5.5 (IST)</option>
                </select>
              </div>
            </div>
          </BrutalCard>
        )}
 
        {/* Section 7: Connected Accounts */}
        {activeTab === "connections" && (
          <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
              <LinkIcon className="h-4 w-4 text-primary" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Linked Accounts Providers</h3>
            </div>
 
            {draftSettings.connections.every((c) => !c.connected) ? (
              <EmptyState
                icon={LinkIcon}
                title="No connected accounts"
                description="Link your developer and social profiles to sync career credentials and resume data."
                primaryAction={{
                  label: "Connect Google Provider",
                  onClick: () => handleToggleConnection(draftSettings.connections[0]?.id)
                }}
              />
            ) : (
              <div className="space-y-3">
                {draftSettings.connections.map((c) => (
                  <div key={c.id} className="flex justify-between items-center p-3 border border-border bg-surface rounded-sm">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-black uppercase block">{c.provider}</span>
                      <span className="text-[8px] text-foreground-secondary block">
                        {c.connected ? `Connected as: ${c.username || "Authorized profile"}` : "Not authorized connection"}
                      </span>
                    </div>

                    <BrutalButton
                      onClick={() => handleToggleConnection(c.id)}
                      className={cn(
                        "h-8 px-3 text-[8.5px] font-black uppercase shadow-none border rounded-none",
                        c.connected ? "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200" : "bg-primary text-white border-primary"
                      )}
                    >
                      {c.connected ? "Disconnect" : "Connect Account"}
                    </BrutalButton>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}
 
        {/* Section 8: Privacy & Security */}
        {activeTab === "privacy" && (
          <div className="space-y-4">
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5 border-b-2 border-border/10 pb-2">
                <Shield className="h-4 w-4 text-primary" />
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Privacy & Security parameters</h3>
              </div>
 
              <div className="grid gap-3.5 sm:grid-cols-2">
                <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.privacy.twoFactorAuth}
                    onChange={(e) => updateDraft((d) => { d.privacy.twoFactorAuth = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="font-black uppercase block text-[10px]">Enable Two-Factor Auth (2FA)</span>
                    <span className="text-[8px] text-foreground-muted block">Validates session logins via mobile authenticator prompts.</span>
                  </div>
                </label>
 
                <div className="space-y-1">
                  <div className="flex justify-between items-center text-[9px] font-black uppercase">
                    <span>Session Idle Timeout</span>
                    <span>{draftSettings.privacy.sessionTimeout} minutes</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="120"
                    step="5"
                    value={draftSettings.privacy.sessionTimeout}
                    onChange={(e) => updateDraft((d) => { d.privacy.sessionTimeout = parseInt(e.target.value); })}
                    className="w-full accent-primary mt-2"
                  />
                </div>
              </div>
 
              <div className="grid gap-3.5 sm:grid-cols-2 border-t border-border/10 pt-3.5 mt-2">
                <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.privacy.profileVisible}
                    onChange={(e) => updateDraft((d) => { d.privacy.profileVisible = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="font-black uppercase block text-[10px]">Public Search visibility</span>
                    <span className="text-[8px] text-foreground-muted block">Enables recruiters to view my metrics score results.</span>
                  </div>
                </label>
 
                <label className="flex items-center gap-2.5 text-[10.5px] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={draftSettings.privacy.shareDataWithRecruiters}
                    onChange={(e) => updateDraft((d) => { d.privacy.shareDataWithRecruiters = e.target.checked; })}
                    className="h-4 w-4 accent-primary"
                  />
                  <div className="space-y-0.5">
                    <span className="font-black uppercase block text-[10px]">Share Platform Analytics data</span>
                    <span className="text-[8px] text-foreground-muted block">Utilizes metrics history to help train matching models.</span>
                  </div>
                </label>
              </div>
            </BrutalCard>
 
            {/* Compliance widgets downloads */}
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-3.5 text-xs font-semibold">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Data Subject Rights & Compliance</h3>
                <p className="text-[8px] text-foreground-muted uppercase">Download or delete your account records in compliance with CCPA/GDPR</p>
              </div>
 
              <div className="flex gap-2 text-[9px] font-black uppercase flex-wrap">
                <BrutalButton variant="secondary" className="h-8.5 px-3 uppercase text-[8.5px] font-black" onClick={() => toast.success("Downloaded GDPR data package (.json)")}>
                  Download My Data Package
                </BrutalButton>
                <BrutalButton variant="secondary" className="h-8.5 px-3 uppercase text-[8.5px] font-black border-rose-200 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10" onClick={async () => {
                  const isConfirmed = await confirm({
                    title: "Delete Telemetry Data",
                    description: "Are you sure you want to delete all cached telemetry records? This cannot be undone.",
                    isDestructive: true,
                    confirmLabel: "Delete Data"
                  });
                  if (isConfirmed) toast.info("GDPR data cleanup initiated");
                }}>
                  Delete My Telemetry Data
                </BrutalButton>
              </div>
            </BrutalCard>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
      </div>
 
      {/* 4. Sticky Save Bar at the bottom */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t-3 border-border p-3.5 flex justify-between items-center brutal-shadow select-none max-w-[1200px] mx-auto w-full">
          <span className="text-[9.5px] font-black uppercase text-foreground flex items-center gap-1">
            <ShieldAlert className="h-4 w-4 text-primary animate-pulse" /> Unsaved changes in settings configuration
          </span>
          <div className="flex gap-2">
            <BrutalButton
              onClick={resetChanges}
              variant="secondary"
              className="h-8.5 px-3.5 text-[9px] font-black uppercase"
            >
              Discard Changes
            </BrutalButton>
            <BrutalButton
              onClick={handleSaveAll}
              disabled={loading}
              className="h-8.5 px-4 text-[9px] font-black uppercase bg-primary text-white flex items-center gap-1.5"
            >
              {loading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                "Save Configuration"
              )}
            </BrutalButton>
          </div>
        </div>
      )}
 
      {/* Modals: Password modification mock dialog */}
      {passwordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm max-w-sm w-full brutal-shadow-lg space-y-4">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground">Modify Account Password</h4>
            
            <form onSubmit={handlePasswordChange} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-foreground-secondary block">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full text-[10.5px] font-bold p-1.5 border border-border bg-surface"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-foreground-secondary block">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full text-[10.5px] font-bold p-1.5 border border-border bg-surface"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase text-foreground-secondary block">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full text-[10.5px] font-bold p-1.5 border border-border bg-surface"
                  required
                />
              </div>
 
              <div className="flex gap-2 pt-3 border-t border-border/10">
                <BrutalButton type="button" variant="secondary" className="h-8.5 px-3.5 text-[8.5px] font-black uppercase" onClick={() => setPasswordModalOpen(false)}>
                  Cancel
                </BrutalButton>
                <BrutalButton type="submit" className="h-8.5 px-4 text-[8.5px] font-black uppercase bg-primary text-white ml-auto">
                  Save Password
                </BrutalButton>
              </div>
            </form>
          </BrutalCard>
        </div>
      )}
 
      {/* Modals: Delete account confirmation modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm max-w-sm w-full brutal-shadow-lg space-y-4">
            <div className="flex items-center gap-1 text-rose-600 dark:text-rose-400">
              <ShieldAlert className="h-5 w-5" />
              <h4 className="text-[10px] font-black uppercase tracking-widest">Delete Candidate Profile</h4>
            </div>
            
            <p className="text-[9.5px] text-foreground-secondary leading-relaxed font-bold">
              This action is permanent and will delete your resumes, cover letters, and application tracking records.
            </p>
 
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase text-foreground-muted block">Type &quot;DELETE&quot; to confirm</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                className="w-full text-[10.5px] font-bold p-1.5 border-2 border-rose-300 dark:border-rose-500/30 bg-rose-50 dark:bg-rose-500/10/10 focus:outline-none"
                placeholder="DELETE"
              />
            </div>
 
            <div className="flex gap-2 pt-3 border-t border-border/10">
              <BrutalButton type="button" variant="secondary" className="h-8.5 px-3.5 text-[8.5px] font-black uppercase" onClick={() => setDeleteModalOpen(false)}>
                Cancel
              </BrutalButton>
              <BrutalButton type="button" className="h-8.5 px-4 text-[8.5px] font-black uppercase bg-rose-600 text-white ml-auto" onClick={handleDeleteAccount}>
                Confirm Delete
              </BrutalButton>
            </div>
          </BrutalCard>
        </div>
      )}
      
      <ConfirmationDialog />
    </div>
  );
}
