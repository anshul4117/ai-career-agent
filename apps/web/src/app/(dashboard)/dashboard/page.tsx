"use client";

import React, { useEffect, useState } from "react";
import { WelcomeBanner } from "@/features/dashboard/components/welcome-banner";
import { AnalyticsCards } from "@/features/dashboard/components/analytics-cards";
import { ResumeProgressCard } from "@/features/dashboard/components/resume-progress-card";
import { ProfileCompletionCard } from "@/features/dashboard/components/profile-completion-card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { DashboardSkeleton } from "@/components/ui/skeleton-loaders";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const RecommendedJobs = dynamic(() => import("@/features/dashboard/components/recommended-jobs").then(m => m.RecommendedJobs));
const RecentApplications = dynamic(() => import("@/features/dashboard/components/recent-applications").then(m => m.RecentApplications));
const AIInsights = dynamic(() => import("@/features/dashboard/components/ai-insights").then(m => m.AIInsights));
const RecentActivity = dynamic(() => import("@/features/dashboard/components/recent-activity").then(m => m.RecentActivity));
const RecentlyViewedJobs = dynamic(() => import("@/features/dashboard/components/recently-viewed-jobs").then(m => m.RecentlyViewedJobs));

import { Checklist } from "@/features/onboarding/components/checklist";
import { useOnboardingStore } from "@/features/onboarding/store/onboarding.store";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring" as const, stiffness: 300, damping: 24 }
  }
};

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const hasCompletedOnboarding = useOnboardingStore(state => state.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 w-full min-w-0">
        <WelcomeBanner />
        <DashboardSkeleton />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 w-full min-w-0"
    >
      {/* 1. Welcome Section */}
      <motion.div variants={itemVariants}><WelcomeBanner /></motion.div>

      {!hasCompletedOnboarding && (
        <motion.div variants={itemVariants}><Checklist /></motion.div>
      )}

      {/* 2. Analytics Cards */}
      <motion.div variants={itemVariants}><AnalyticsCards /></motion.div>

      {/* 3. Resume & Profile Progress Cards */}
      <motion.div variants={itemVariants} className="grid gap-6 md:grid-cols-2 w-full min-w-0">
        <ResumeProgressCard />
        <ProfileCompletionCard />
      </motion.div>

      {/* 4. Quick Actions Shortcuts */}
      <motion.div variants={itemVariants}><QuickActions /></motion.div>

      {/* 5. Jobs, Applications, AI Insights, and Activity Timelines */}
      <motion.div variants={itemVariants} className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        {/* Left Column: Recommended Jobs & AI Insights */}
        <div className="space-y-6 w-full min-w-0">
          <RecommendedJobs />
          <AIInsights />
        </div>

        {/* Right Column: Recent Applications & Timeline Activity */}
        <div className="space-y-6 w-full min-w-0">
          <RecentApplications />
          <RecentActivity />
          <RecentlyViewedJobs />
        </div>
      </motion.div>
    </motion.div>
  );
}
