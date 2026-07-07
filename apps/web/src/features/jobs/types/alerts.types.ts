import type { ExperienceLevel, RemoteType, EmploymentType } from "./jobs.types";
 
export interface JobAlertFilters {
  keyword?: string;
  skills?: string[];
  company?: string;
  location?: string;
  remoteType?: RemoteType[];
  salaryMin?: number | null;
  experienceLevel?: ExperienceLevel[];
  employmentType?: EmploymentType[];
}
 
export interface JobAlert {
  id: string;
  title: string;
  filters: JobAlertFilters;
  frequency: "instant" | "daily" | "weekly";
  isActive: boolean;
  createdAt: string;
  lastTriggeredAt?: string;
  nextRunAt?: string;
}
