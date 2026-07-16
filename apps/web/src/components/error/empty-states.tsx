"use client";

import React from "react";
import { 
  Briefcase, 
  Bookmark, 
  ClipboardList, 
  FileText, 
  FileCheck, 
  Bell, 
  SearchX
} from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";

interface BaseEmptyProps {
  onAction?: () => void;
  actionLabel?: string;
}

export function NoJobsFound({ onAction, actionLabel = "Browse All Jobs" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={Briefcase}
      title="No Jobs Found"
      description="We couldn't find any job matches matching your parameters. Adjust your filters or browse our full index."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoSavedJobs({ onAction, actionLabel = "Browse Jobs" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={Bookmark}
      title="No Saved Jobs"
      description="You haven't saved any job postings yet. Keep track of interesting roles by clicking the bookmark icon."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoApplications({ onAction, actionLabel = "Find Jobs to Apply" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={ClipboardList}
      title="No Applications Tracked"
      description="Your application tracker dashboard is currently empty. Start tracking your applications here to organize your pipelines."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoCoverLetters({ onAction, actionLabel = "Generate New Letter" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={FileText}
      title="No Cover Letters"
      description="You haven't created any AI-optimized cover letters yet. Start the Cover Letter Wizard to build one in seconds."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoResume({ onAction, actionLabel = "Create Professional Resume" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={FileCheck}
      title="No Resumes Uploaded"
      description="No resumes found in your profile builder. Upload your resume or use our builder to initialize your data profile."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoNotifications({ onAction, actionLabel = "Check Notifications" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={Bell}
      title="All Caught Up"
      description="You have no notifications or activity alerts. Any alerts regarding applications or messages will appear here."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}

export function NoSearchResults({ onAction, actionLabel = "Reset Query" }: BaseEmptyProps) {
  return (
    <EmptyState
      icon={SearchX}
      title="No Search Results"
      description="We couldn't find matches for your query. Try modifying your keywords, adjusting the spellings, or clearing filters."
      primaryAction={onAction ? {
        label: actionLabel,
        onClick: onAction,
      } : undefined}
    />
  );
}
