import type { LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export interface ApiError {
  success: false;
  message: string;
}

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "INTERNSHIP"
  | "CONTRACT"
  | "REMOTE"
  | "HYBRID";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW_SCHEDULED"
  | "INTERVIEW_COMPLETED"
  | "REJECTED"
  | "OFFER_RECEIVED"
  | "ACCEPTED"
  | "WITHDRAWN";

export type ParsingStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
