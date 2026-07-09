import type { ApplicationStatus } from "@/types";
 
export interface TimelineEvent {
  id: string;
  stage: ApplicationStatus;
  title: string;
  description: string;
  timestamp: string; // ISO string
}
 
export interface JobApplication {
  id: string;
  jobId?: string;
  jobTitle: string;
  company: string;
  matchScore: number;
  jobQuality: number;
  status: ApplicationStatus;
  appliedAt: string; // ISO string
  source: string; // e.g. "LinkedIn", "Indeed", "Direct Portal"
  resumeUsed?: string; // name of file
  coverLetterUsed?: string; // name of file
  
  // Recruiter contact & notes
  recruiterName: string;
  recruiterEmail: string;
  phone: string;
  salaryNotes: string;
  salaryDiscussion: string;
  interviewNotes: string;
  followUpNotes: string;
  personalNotes: string;
  
  // Interview logs
  interviewDate: string; // YYYY-MM-DD
  interviewTime: string; // HH:MM
  interviewType: "Video Call" | "Onsite" | "Phone Screen" | "Technical Challenge" | "N/A";
  interviewRound: string; // e.g. "HR Screening", "System Design"
  interviewStatus: "Scheduled" | "Completed" | "Cancelled" | "Pending" | "N/A";
  interviewerName: string;
  meetingLink: string;
  
  // Deadlines & filters info
  offerDeadline: string; // YYYY-MM-DD
  isRemote: boolean;
  location: string;
  salaryRange: string;
  
  // Timeline log
  timeline: TimelineEvent[];
}
