export type NotificationCategory =
  | "job_alerts"
  | "applications"
  | "resume_parsing"
  | "resume_optimization"
  | "ai_match"
  | "cover_letter"
  | "system";
 
export interface NotificationItem {
  id: string;
  category: NotificationCategory;
  title: string;
  description: string;
  timestamp: string; // ISO string
  read: boolean;
  actionUrl?: string; // Route path to navigate (e.g. "/jobs/job_seed_001")
}
