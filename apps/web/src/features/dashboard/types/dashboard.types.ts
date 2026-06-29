export interface DashboardStats {
  profileCompletion: number;
  resumeUploaded: boolean;
  jobMatches: number;
  totalApplications: number;
}

export interface AnalyticsCardData {
  title: string;
  count: number;
  percentage: string;
  trend: "up" | "down" | "neutral";
  icon: string;
}

export interface RecommendedJobData {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  matchScore: number;
}

export interface RecentApplicationData {
  id: string;
  company: string;
  role: string;
  appliedDate: string;
  status: "applied" | "interviewing" | "offer" | "rejected";
  timelineBadge: string;
}

export interface AiInsightData {
  id: string;
  type: "keyword" | "profile" | "skill" | "tip";
  title: string;
  description: string;
}

export interface RecentActivityData {
  id: string;
  type: "resume" | "application" | "profile" | "optimize";
  action: string;
  time: string;
}
