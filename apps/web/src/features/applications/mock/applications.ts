import type { ApplicationStatus } from "@/types";

export interface ApplicationItem {
  id: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: ApplicationStatus;
}

export const mockApplications: ApplicationItem[] = [
  {
    id: "app_001",
    jobTitle: "Backend Engineer",
    company: "Linear Labs",
    appliedAt: "2025-06-19",
    status: "APPLIED",
  },
  {
    id: "app_002",
    jobTitle: "Full Stack Developer",
    company: "Vercel Startup",
    appliedAt: "2025-06-17",
    status: "INTERVIEW",
  },
  {
    id: "app_003",
    jobTitle: "Software Engineering Intern",
    company: "YC Startup",
    appliedAt: "2025-06-14",
    status: "SAVED",
  },
];

export const mockSavedJobIds = ["job_003"];
