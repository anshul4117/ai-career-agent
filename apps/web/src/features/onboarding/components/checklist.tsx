"use client";

import React, { useEffect, useState } from "react";
import { useOnboardingStore } from "../store/onboarding.store";
import { useSettingsStore } from "@/features/settings/store/settings.store";
import { useResumeStore } from "@/features/resume/store/resume.store";
import { useResumeOptimizerStore } from "@/features/resume/store/resume-optimizer.store";
import { useBookmarkStore } from "@/features/jobs/store/bookmark.store";
import { useCoverLetterStore } from "@/features/cover-letters/store/cover-letter.store";
import { useAlertsStore } from "@/features/jobs/store/alerts.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { CheckSquare, Square, Award, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface TaskItem {
  id: string;
  label: string;
  description: string;
}

const TASKS: TaskItem[] = [
  { id: "profile", label: "Complete Profile", description: "Fill in your candidate contact info and headline." },
  { id: "resume", label: "Upload Resume", description: "Add a primary resume draft to the platform." },
  { id: "optimize", label: "Optimize Resume", description: "Run AI Optimizer analysis against any job description." },
  { id: "save_job", label: "Save a Job", description: "Bookmark any job posting of interest." },
  { id: "cover_letter", label: "Generate Cover Letter", description: "Create an AI-written cover letter tailored to a role." },
  { id: "job_alert", label: "Create Job Alert", description: "Setup a search alert to receive matching jobs." }
];

export function Checklist() {
  const { completedTasks, completeTask, hasCompletedOnboarding, setHasCompletedOnboarding } = useOnboardingStore();
  const [celebrate, setCelebrate] = useState(false);
  const [confettiParticles, setConfettiParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number; rotate: number }[]>([]);

  // Other stores
  const { calculateProfileCompletion, loadSettings } = useSettingsStore();
  const { resumes, loadResumes } = useResumeStore();
  const { analysis, versions } = useResumeOptimizerStore();
  const { savedJobs, fetchSavedJobs } = useBookmarkStore();
  const { drafts, loadDrafts } = useCoverLetterStore();
  const { alerts, fetchAlerts } = useAlertsStore();

  // Load store data on mount
  useEffect(() => {
    loadSettings();
    loadResumes().catch(() => {});
    fetchSavedJobs().catch(() => {});
    loadDrafts();
    fetchAlerts().catch(() => {});
  }, [loadSettings, loadResumes, fetchSavedJobs, loadDrafts, fetchAlerts]);

  // Compute dynamic task completion
  const isProfileComplete = calculateProfileCompletion() > 10;
  const isResumeUploaded = resumes.length > 0;
  const isResumeOptimized = analysis !== null || versions.length > 2 || completedTasks.includes("optimize");
  const isJobSaved = savedJobs.length > 0;
  const isLetterGenerated = drafts.length > 0;
  const isAlertCreated = alerts.length > 0;

  // Sync state to Onboarding Store
  useEffect(() => {
    const activeTasks = {
      profile: isProfileComplete,
      resume: isResumeUploaded,
      optimize: isResumeOptimized,
      save_job: isJobSaved,
      cover_letter: isLetterGenerated,
      job_alert: isAlertCreated
    };
    Object.entries(activeTasks).forEach(([taskId, completed]) => {
      if (completed) {
        completeTask(taskId);
      }
    });
  }, [isProfileComplete, isResumeUploaded, isResumeOptimized, isJobSaved, isLetterGenerated, isAlertCreated, completeTask]);

  const completedCount = [
    isProfileComplete,
    isResumeUploaded,
    isResumeOptimized,
    isJobSaved,
    isLetterGenerated,
    isAlertCreated
  ].filter(Boolean).length;
  const progressPercent = Math.round((completedCount / TASKS.length) * 100);

  // Check for completion celebration
  useEffect(() => {
    if (progressPercent === 100 && !hasCompletedOnboarding) {
      setCelebrate(true);
      setHasCompletedOnboarding(true);
      toast.success("Congratulations! 100% Onboarding Checklist Complete! You earned the ACA Explorer badge!");
      
      // Generate 60 confetti particles
      const colors = ["#2563eb", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899"];
      const newParticles = Array.from({ length: 60 }).map((_, i) => ({
        id: i,
        x: Math.random() * 400 - 200,
        y: Math.random() * -300 - 100,
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.4,
        rotate: Math.random() * 360
      }));
      setConfettiParticles(newParticles);

      // Stop celebration after 5 seconds
      setTimeout(() => {
        setCelebrate(false);
      }, 5000);
    }
  }, [progressPercent, hasCompletedOnboarding, setHasCompletedOnboarding]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Confetti Animation Portal */}
      <AnimatePresence>
        {celebrate && (
          <div className="fixed inset-0 pointer-events-none z-[99] flex items-center justify-center">
            {confettiParticles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 1, x: 0, y: 300, scale: 0.5, rotate: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  x: p.x,
                  y: p.y,
                  scale: [0.5, 1, 0.8],
                  rotate: p.rotate
                }}
                transition={{
                  duration: 2.2,
                  ease: "easeOut",
                  delay: p.delay
                }}
                style={{
                  position: "absolute",
                  width: "12px",
                  height: "12px",
                  backgroundColor: p.color,
                  borderRadius: "2px"
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      <BrutalCard className="border-[3px] border-black dark:border-border bg-surface p-6 brutal-shadow rounded-sm flex flex-col space-y-4 text-xs font-semibold select-none">
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-border/10 pb-3">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-tight text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-primary" />
              Getting Started Checklist
            </h3>
            <p className="text-[9.5px] text-foreground-muted block font-semibold leading-none">
              Complete these setup steps to launch your job application copilot.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {progressPercent === 100 && (
              <div className="inline-flex items-center gap-1 bg-green-50 dark:bg-green-500/10 border-2 border-green-300 text-green-700 dark:text-green-400 px-2 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider">
                <Award className="h-3.5 w-3.5" />
                ACA Explorer
              </div>
            )}
            <span className="font-mono text-sm font-black text-primary">{progressPercent}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-4 w-full bg-surface-secondary border-2 border-black dark:border-border rounded-sm overflow-hidden p-0.5">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="h-full bg-primary rounded-xs"
          />
        </div>

        {/* Tasks Checklist Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2 pt-1.5">
          {TASKS.map((t) => {
            const isCompleted = 
              t.id === "profile" ? isProfileComplete :
              t.id === "resume" ? isResumeUploaded :
              t.id === "optimize" ? isResumeOptimized :
              t.id === "save_job" ? isJobSaved :
              t.id === "cover_letter" ? isLetterGenerated :
              t.id === "job_alert" ? isAlertCreated : false;
            return (
              <div 
                key={t.id} 
                className={`flex items-start gap-2.5 p-3 border-2 rounded-sm transition-colors ${
                  isCompleted 
                    ? "bg-primary/5 border-primary text-foreground" 
                    : "bg-surface border-border/60 text-foreground-muted"
                }`}
              >
                <div className="shrink-0 mt-0.5">
                  {isCompleted ? (
                    <CheckSquare className="h-4 w-4 text-primary fill-primary/10 stroke-[2.5px]" />
                  ) : (
                    <Square className="h-4 w-4 text-foreground-muted stroke-[2.5px]" />
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className={`font-black uppercase text-[10px] leading-tight ${isCompleted ? "text-primary" : "text-foreground"}`}>
                    {t.label}
                  </p>
                  <p className="text-[8.5px] text-foreground-muted leading-tight">
                    {t.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </BrutalCard>
    </div>
  );
}
export default Checklist;
