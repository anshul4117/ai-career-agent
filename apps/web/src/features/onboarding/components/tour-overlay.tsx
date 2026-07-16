"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { useOnboardingStore } from "../store/onboarding.store";
import { useUiStore } from "@/store/ui.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement: "top" | "bottom" | "left" | "right";
}

const TOUR_STEPS: TourStep[] = [
  {
    target: "#nav-dashboard",
    title: "Your Dashboard",
    content: "Welcome to your AI Career Dashboard. Track your profile completion, latest applications, and job match analytics in one central location.",
    placement: "right"
  },
  {
    target: "#nav-jobs",
    title: "Job Discovery",
    content: "Search and explore thousands of validated, fresh job listings matched to your experience and skills.",
    placement: "right" as const
  },
  {
    target: "#nav-resume",
    title: "Resume Builder",
    content: "Build and manage multiple versions of your resume, or parse existing ones automatically using AI.",
    placement: "right" as const
  },
  {
    target: "#nav-resume",
    title: "Resume Optimizer",
    content: "Within the builder, utilize the AI Optimizer Studio to improve ATS match scores against target job descriptions.",
    placement: "right" as const
  },
  {
    target: "#nav-cover-letters",
    title: "Cover Letter Wizard",
    content: "Generate highly customized, professionally written cover letters tailored to your target roles.",
    placement: "right" as const
  },
  {
    target: "#nav-applications",
    title: "Applications Tracker",
    content: "Manage your application pipeline with our drag-and-drop Kanban board, conversion funnel analytics, and interview schedules.",
    placement: "right" as const
  },
  {
    target: "#nav-settings",
    title: "System Settings",
    content: "Configure your job preferences, notification rules, AI writing tone, compact layout views, or toggle Dark Mode.",
    placement: "right" as const
  },
  {
    target: "#header-search-bar",
    title: "Global Command Palette",
    content: "Press ⌘+K (Ctrl+K on Windows) or click the search bar to instantly query jobs from anywhere in the app.",
    placement: "bottom" as const
  }
];

export function TourOverlay() {
  const { isTourActive, setIsTourActive, currentStep, setCurrentStep } = useOnboardingStore();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ top: 0, left: 0 });
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Set mounted on client side
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeStep = TOUR_STEPS[currentStep];

  const updatePosition = useCallback(() => {
    if (!isTourActive || !activeStep) return;

    // Dynamically open sidebar if target is nav-related and screen is mobile
    if (activeStep.target.startsWith("#nav-") && typeof window !== "undefined" && window.innerWidth < 1024) {
      if (!sidebarOpen) {
        setSidebarOpen(true);
        // Wait minor animation time
        setTimeout(updatePosition, 100);
        return;
      }
    }

    const element = document.querySelector(activeStep.target);
    if (element) {
      const rect = element.getBoundingClientRect();
      setTargetRect(rect);

      // Compute tooltip positioning
      let top = 0;
      let left = 0;
      const offset = 14;

      if (tooltipRef.current) {
        const tWidth = tooltipRef.current.offsetWidth;
        const tHeight = tooltipRef.current.offsetHeight;

        if (activeStep.placement === "right") {
          left = rect.left + rect.width + offset;
          top = rect.top + rect.height / 2 - tHeight / 2;
        } else if (activeStep.placement === "bottom") {
          left = rect.left + rect.width / 2 - tWidth / 2;
          top = rect.top + rect.height + offset;
        } else if (activeStep.placement === "left") {
          left = rect.left - tWidth - offset;
          top = rect.top + rect.height / 2 - tHeight / 2;
        } else {
          // top
          left = rect.left + rect.width / 2 - tWidth / 2;
          top = rect.top - tHeight - offset;
        }

        // Clamp inside window boundaries
        const winWidth = window.innerWidth;
        const winHeight = window.innerHeight;
        
        left = Math.max(10, Math.min(left, winWidth - tWidth - 10));
        top = Math.max(10, Math.min(top, winHeight - tHeight - 10));
      }

      setTooltipPos({ top, left });
    } else {
      // Fallback to center if element is not found (e.g. sidebar collapsed off-screen)
      setTargetRect(null);
      if (typeof window !== "undefined") {
        setTooltipPos({
          top: window.innerHeight / 2 - 100,
          left: window.innerWidth / 2 - 160
        });
      }
    }
  }, [isTourActive, activeStep, sidebarOpen, setSidebarOpen]);

  // Update rect on step change or resize/scroll
  useEffect(() => {
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [currentStep, isTourActive, updatePosition]);

  const handleNext = () => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsTourActive(false);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    setIsTourActive(false);
  };

  if (!mounted || !isTourActive) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-hidden pointer-events-none select-none">
      {/* SVG Mask Overlay */}
      <svg className="absolute inset-0 w-full h-full pointer-events-auto">
        <defs>
          <mask id="tour-cutout">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.x - 4}
                y={targetRect.y - 4}
                width={targetRect.width + 8}
                height={targetRect.height + 8}
                rx="6"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.45)"
          mask="url(#tour-cutout)"
          onClick={handleSkip}
        />
      </svg>

      {/* Tooltip Content */}
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          top: `${tooltipPos.top}px`,
          left: `${tooltipPos.left}px`,
          width: "320px",
        }}
        className="pointer-events-auto z-[101] transition-all duration-200"
      >
        <BrutalCard className="border-[3px] border-black dark:border-border bg-surface p-5 brutal-shadow rounded-sm flex flex-col space-y-3.5 text-xs font-semibold">
          {/* Close trigger */}
          <button
            onClick={handleSkip}
            className="absolute top-3 right-3 text-foreground-muted hover:text-foreground transition-colors p-1"
            aria-label="Skip tour"
          >
            <X className="h-3.5 w-3.5 stroke-[2.5px]" />
          </button>

          {/* Header */}
          <div className="space-y-0.5">
            <h4 className="text-[10px] font-black uppercase text-primary tracking-wider">
              Product Tour • {currentStep + 1}/{TOUR_STEPS.length}
            </h4>
            <h3 className="text-sm font-black uppercase tracking-tight text-foreground">
              {activeStep?.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-[10px] text-foreground-muted leading-relaxed">
            {activeStep?.content}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1 border-t border-border/10">
            <button
              onClick={handleSkip}
              className="text-[9px] font-black uppercase text-foreground-muted hover:text-foreground transition-colors"
            >
              Skip Tour
            </button>
            <div className="flex gap-2">
              <BrutalButton
                onClick={handlePrev}
                disabled={currentStep === 0}
                variant="secondary"
                className="h-7 px-2.5 text-[9px] font-black uppercase flex items-center gap-1 disabled:opacity-50"
              >
                <ChevronLeft className="h-3 w-3 stroke-[2.5px]" />
                Prev
              </BrutalButton>
              <BrutalButton
                onClick={handleNext}
                variant="default"
                className="h-7 px-3 text-[9px] font-black uppercase flex items-center gap-1 bg-primary text-white brutal-shadow-xs"
              >
                {currentStep === TOUR_STEPS.length - 1 ? "Finish" : "Next"}
                <ChevronRight className="h-3 w-3 stroke-[2.5px]" />
              </BrutalButton>
            </div>
          </div>
        </BrutalCard>
      </div>
    </div>,
    document.body
  );
}
export default TourOverlay;
