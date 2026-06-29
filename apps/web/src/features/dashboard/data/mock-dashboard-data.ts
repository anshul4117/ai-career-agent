import { 
  AnalyticsCardData, 
  RecommendedJobData, 
  RecentApplicationData, 
  AiInsightData, 
  RecentActivityData 
} from "../types/dashboard.types";

export const ANALYTICS_DATA: AnalyticsCardData[] = [
  {
    title: "Applications",
    count: 8,
    percentage: "+12.5% vs last week",
    trend: "up",
    icon: "file-text",
  },
  {
    title: "Saved Jobs",
    count: 14,
    percentage: "+4% vs last week",
    trend: "up",
    icon: "bookmark",
  },
  {
    title: "Resume Views",
    count: 42,
    percentage: "+28% vs last week",
    trend: "up",
    icon: "eye",
  },
  {
    title: "Interview Invites",
    count: 3,
    percentage: "+100% vs last week",
    trend: "up",
    icon: "mail",
  },
];

export const RECOMMENDED_JOBS: RecommendedJobData[] = [
  {
    id: "job_001",
    title: "Backend Engineer",
    company: "Linear Labs",
    location: "Bengaluru, India",
    salary: "₹18L - ₹24L",
    matchScore: 92,
  },
  {
    id: "job_002",
    title: "Full Stack Developer",
    company: "Vercel Startup",
    location: "Remote",
    salary: "$120k - $150k",
    matchScore: 85,
  },
  {
    id: "job_003",
    title: "Software Engineering Intern",
    company: "YC Startup",
    location: "Hyderabad, India",
    salary: "₹40k/mo",
    matchScore: 78,
  },
];

export const RECENT_APPLICATIONS: RecentApplicationData[] = [
  {
    id: "app_1",
    company: "Linear Labs",
    role: "Backend Engineer",
    appliedDate: "June 20, 2025",
    status: "applied",
    timelineBadge: "Applied",
  },
  {
    id: "app_2",
    company: "Vercel Startup",
    role: "Full Stack Developer",
    appliedDate: "June 18, 2025",
    status: "interviewing",
    timelineBadge: "Technical Round",
  },
  {
    id: "app_3",
    company: "Notion-inspired Co",
    role: "Frontend Engineer",
    appliedDate: "June 12, 2025",
    status: "rejected",
    timelineBadge: "Rejected",
  },
];

export const AI_INSIGHTS: AiInsightData[] = [
  {
    id: "insight_1",
    type: "keyword",
    title: "Resume Keywords Needed",
    description: "Integrate 'REST APIs' or 'GraphQL' to match the active Backend position at Linear Labs.",
  },
  {
    id: "insight_2",
    type: "profile",
    title: "Improve Profile Coordinates",
    description: "Fill in work details to complete the remaining 28% of your profile scorecard.",
  },
  {
    id: "insight_3",
    type: "skill",
    title: "Top Matching Skills",
    description: "Your React and Zustand skills match 92% of active frontend development listings.",
  },
  {
    id: "insight_4",
    type: "tip",
    title: "Optimal Application Window",
    description: "Applying on Monday mornings increases screening responses by up to 35%.",
  },
];

export const RECENT_ACTIVITY: RecentActivityData[] = [
  {
    id: "act_1",
    type: "optimize",
    action: "Optimized resume for Full Stack Developer at Vercel Startup",
    time: "2 hours ago",
  },
  {
    id: "act_2",
    type: "application",
    action: "Submitted application for Backend Engineer at Linear Labs",
    time: "1 day ago",
  },
  {
    id: "act_3",
    type: "profile",
    action: "Updated work experience fields during onboarding",
    time: "3 days ago",
  },
  {
    id: "act_4",
    type: "resume",
    action: "Uploaded resume draft 'anshul-kumar-resume.pdf'",
    time: "4 days ago",
  },
];
