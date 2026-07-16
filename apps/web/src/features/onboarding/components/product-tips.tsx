"use client";

import React, { useState, useEffect } from "react";
import { useOnboardingStore } from "../store/onboarding.store";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTipsProps {
  tipId: "first-resume" | "first-job-saved" | "first-cover-letter";
  className?: string;
}

const TIPS = {
  "first-resume": {
    title: "AI Resume Parsing",
    content: "You can parse any existing PDF resume using our AI Parser. This extracts your skills, work history, and education to automatically initialize your data profile."
  },
  "first-job-saved": {
    title: "Optimize for this Job",
    content: "Saved jobs are monitored by our matching engine. Try opening the AI Optimizer Studio inside your resume builder to calculate match scores against this specific role!"
  },
  "first-cover-letter": {
    title: "Cover Letter Tailoring",
    content: "You can adjust the writing tone (e.g. startup, enterprise, مدرن) to align with target company cultures. Always preview and refine details before downloading."
  }
};

export function ProductTips({ tipId, className }: ProductTipsProps) {
  const { enableProductTips, tipsShown, showTip } = useOnboardingStore();
  const [isVisible, setIsVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (enableProductTips && !tipsShown.includes(tipId)) {
      setIsVisible(true);
    }
  }, [enableProductTips, tipsShown, tipId]);

  const handleDismiss = () => {
    setIsVisible(false);
    showTip(tipId);
  };

  if (!mounted || !isVisible) return null;

  const tip = TIPS[tipId];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.98, y: 5 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 5 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "relative flex items-start gap-3 p-4 border-[3px] border-black dark:border-border bg-amber-50 dark:bg-amber-950/10 text-amber-900 dark:text-amber-300 rounded-sm brutal-shadow-xs text-xs font-semibold select-none",
            className
          )}
        >
          {/* Bulb Icon */}
          <div className="inline-flex h-5 w-5 shrink-0 items-center justify-center text-amber-600 dark:text-amber-500">
            <Lightbulb className="h-4.5 w-4.5 stroke-[2.5px]" />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-0.5 pr-6">
            <h5 className="font-black uppercase tracking-wide text-foreground">
              Tip: {tip.title}
            </h5>
            <p className="text-[10px] text-foreground-secondary leading-relaxed font-semibold opacity-95">
              {tip.content}
            </p>
          </div>

          {/* Dismiss button */}
          <button
            onClick={handleDismiss}
            className="absolute top-3.5 right-3.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground focus:outline-none transition-colors border border-transparent focus:border-black dark:focus:border-border"
            aria-label="Dismiss product tip"
          >
            <X className="h-3.5 w-3.5 stroke-[2.5px]" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
export default ProductTips;
