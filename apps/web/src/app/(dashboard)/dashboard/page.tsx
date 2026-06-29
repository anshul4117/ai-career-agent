"use client";

import React from "react";
import { WelcomeBanner } from "@/features/dashboard/components/welcome-banner";
import { AnalyticsCards } from "@/features/dashboard/components/analytics-cards";
import { ResumeProgressCard } from "@/features/dashboard/components/resume-progress-card";
import { ProfileCompletionCard } from "@/features/dashboard/components/profile-completion-card";
import { QuickActions } from "@/features/dashboard/components/quick-actions";
import { RecommendedJobs } from "@/features/dashboard/components/recommended-jobs";
import { RecentApplications } from "@/features/dashboard/components/recent-applications";
import { AIInsights } from "@/features/dashboard/components/ai-insights";
import { RecentActivity } from "@/features/dashboard/components/recent-activity";

export default function DashboardPage() {
  return (
    <div className="space-y-6 w-full min-w-0">
      {/* 1. Welcome Section */}
      <WelcomeBanner />

      {/* 2. Analytics Cards */}
      <AnalyticsCards />

      {/* 3. Resume & Profile Progress Cards */}
      <div className="grid gap-6 md:grid-cols-2 w-full min-w-0">
        <ResumeProgressCard />
        <ProfileCompletionCard />
      </div>

      {/* 4. Quick Actions Shortcuts */}
      <QuickActions />

      {/* 5. Jobs, Applications, AI Insights, and Activity Timelines */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        {/* Left Column: Recommended Jobs & AI Insights */}
        <div className="space-y-6 w-full min-w-0">
          <RecommendedJobs />
          <AIInsights />
        </div>

        {/* Right Column: Recent Applications & Timeline Activity */}
        <div className="space-y-6 w-full min-w-0">
          <RecentApplications />
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
