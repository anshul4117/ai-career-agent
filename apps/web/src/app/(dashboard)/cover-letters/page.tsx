"use client";
 
import React, { useEffect } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { useCoverLetterStore } from "@/features/cover-letters/store/cover-letter.store";
import { useShallow } from "zustand/react/shallow";
import dynamic from "next/dynamic";
import { ProductTips } from "@/features/onboarding/components/product-tips";

const CoverLetterDashboard = dynamic(() => import("@/features/cover-letters/components/cover-letter-dashboard").then(m => m.CoverLetterDashboard));
const CoverLetterWizard = dynamic(() => import("@/features/cover-letters/components/cover-letter-wizard").then(m => m.CoverLetterWizard));

export default function CoverLettersPage() {
  const { 
    activeView, 
    setActiveView, 
    setActiveDraft 
  } = useCoverLetterStore(useShallow(state => ({
    activeView: state.activeView,
    setActiveView: state.setActiveView,
    setActiveDraft: state.setActiveDraft
  })));
 
  // Reset active draft on initial load
  useEffect(() => {
    setActiveDraft(null);
    setActiveView("dashboard");
  }, [setActiveDraft, setActiveView]);
 
  return (
    <div className="space-y-6 pb-12 select-none relative max-w-[1200px] mx-auto w-full">
      {/* Page Title Header */}
      {activeView === "dashboard" && (
        <PageHeader
          title="Cover Letters"
          description="Generate personalized, highly-tailored cover letters instantly with AI."
        />
      )}
      {activeView === "wizard" && (
        <PageHeader
          title="Cover Letter Studio"
          description="Build, edit, and fine-tune your personalized cover letter templates."
        />
      )}

      <ProductTips tipId="first-cover-letter" />
 
      {/* Active Panel View */}
      {activeView === "dashboard" ? (
        <CoverLetterDashboard 
          onStartNew={(template) => {
            void template;
            setActiveDraft(null);
            setActiveView("wizard");
          }} 
        />
      ) : (
        <CoverLetterWizard 
          onBackToDashboard={() => setActiveView("dashboard")} 
        />
      )}
    </div>
  );
}
