"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { motion, AnimatePresence } from "framer-motion";
import { useOnboardingStore } from "../store/onboarding.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Sparkles, Briefcase, FileText, X } from "lucide-react";

export function WelcomeModal() {
  const { isWelcomeOpen, setIsWelcomeOpen, setIsTourActive, setHasCompletedOnboarding } = useOnboardingStore();

  const handleStartTour = () => {
    setIsWelcomeOpen(false);
    setIsTourActive(true);
  };

  const handleSkip = () => {
    setIsWelcomeOpen(false);
  };

  const handleDontShow = () => {
    setIsWelcomeOpen(false);
    setHasCompletedOnboarding(true);
  };

  return (
    <Dialog.Root open={isWelcomeOpen} onOpenChange={setIsWelcomeOpen}>
      <AnimatePresence>
        {isWelcomeOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={{ opacity: 0, scale: 0.98, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -20 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="fixed left-1/2 top-[15%] z-50 w-full max-w-lg -translate-x-1/2 focus:outline-none px-4 sm:px-0"
              >
                <BrutalCard className="border-[3px] border-black dark:border-border bg-surface p-8 brutal-shadow-lg rounded-sm overflow-hidden flex flex-col space-y-6 select-none text-xs font-semibold">
                  {/* Close button */}
                  <Dialog.Close asChild>
                    <button
                      className="absolute top-4 right-4 text-foreground-muted hover:text-foreground transition-colors p-1 border-2 border-transparent focus:border-black dark:focus:border-border rounded-sm"
                      aria-label="Close welcome modal"
                    >
                      <X className="h-4 w-4 stroke-[2.5px]" />
                    </button>
                  </Dialog.Close>

                  {/* Icon & Title */}
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-3 bg-primary/10 border-2 border-black dark:border-border text-primary rounded-sm mx-auto">
                      <Sparkles className="h-10 w-10" />
                    </div>
                    <div className="space-y-1">
                      <h2 className="text-2xl font-black uppercase tracking-tight text-foreground">
                        Welcome to AI Career Agent
                      </h2>
                      <p className="text-[10px] text-foreground-muted leading-relaxed font-semibold max-w-sm mx-auto">
                        Your professional career copilot. Let us help you organize your application pipeline, optimize your resumes, and land your next role.
                      </p>
                    </div>
                  </div>

                  {/* Features Highlights */}
                  <div className="space-y-3.5 bg-surface-secondary border-2 border-black dark:border-border p-4 rounded-sm">
                    <h4 className="text-[9px] font-black uppercase tracking-widest text-foreground-secondary">
                      Core Platform Highlights
                    </h4>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-surface border-2 border-black dark:border-border text-foreground-secondary rounded-sm shrink-0">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black uppercase text-[10px] text-foreground">Job Search Engine</p>
                          <p className="text-[9.5px] text-foreground-muted leading-normal">Discover highly tailored job matches based on your skills, experience, and relocation preferences.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-surface border-2 border-black dark:border-border text-foreground-secondary rounded-sm shrink-0">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black uppercase text-[10px] text-foreground">AI Resume Optimization</p>
                          <p className="text-[9.5px] text-foreground-muted leading-normal">Optimize resume variants against job descriptions to optimize ATS parsing compliance scores.</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-1.5 bg-surface border-2 border-black dark:border-border text-foreground-secondary rounded-sm shrink-0">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="font-black uppercase text-[10px] text-foreground">Application Pipelines</p>
                          <p className="text-[9.5px] text-foreground-muted leading-normal">Track interviews, notes, and metrics on our brutalist Kanban dashboard.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <BrutalButton
                      onClick={handleStartTour}
                      variant="default"
                      className="h-10 flex-1 text-xs font-black uppercase tracking-wider bg-primary text-white brutal-shadow-xs"
                    >
                      Start Product Tour
                    </BrutalButton>
                    <div className="flex gap-3 flex-1">
                      <BrutalButton
                        onClick={handleSkip}
                        variant="secondary"
                        className="h-10 flex-1 text-xs font-black uppercase tracking-wider"
                      >
                        Skip
                      </BrutalButton>
                      <BrutalButton
                        onClick={handleDontShow}
                        variant="secondary"
                        className="h-10 flex-1 text-xs font-black uppercase tracking-wider text-foreground-muted hover:text-foreground"
                      >
                        Don&apos;t Show Again
                      </BrutalButton>
                    </div>
                  </div>
                </BrutalCard>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
}
export default WelcomeModal;
