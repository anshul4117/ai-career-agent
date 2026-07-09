import type { ApplicationStatus } from "@/types";
import type { TimelineEvent } from "../types/application.types";
 
export const timelineService = {
  createEvent(stage: ApplicationStatus, title?: string, description?: string): TimelineEvent {
    let t = title || "";
    let d = description || "";
    
    if (!title) {
      switch (stage) {
        case "SAVED":
          t = "Application Saved";
          d = "Job bookmarked to tracker pipelines.";
          break;
        case "APPLIED":
          t = "Application Submitted";
          d = "Application profile sent to employer hiring portal.";
          break;
        case "SCREENING":
          t = "Resume Screening Started";
          d = "Hiring managers are auditing listed experience.";
          break;
        case "ASSESSMENT":
          t = "Assessment Scheduled";
          d = "Hiring test or task completed/assigned.";
          break;
        case "INTERVIEW":
          t = "Interview Scheduled";
          d = "Interview round coordinate date/time configured.";
          break;
        case "OFFER":
          t = "Offer Received";
          d = "Formal job compensation offer draft received.";
          break;
        case "ACCEPTED":
          t = "Offer Accepted";
          d = "Hired! Signed final agreement.";
          break;
        case "REJECTED":
          t = "Application Closed";
          d = "Hiring review closed by employer.";
          break;
        case "WITHDRAWN":
          t = "Application Withdrawn";
          d = "Process archived by candidate.";
          break;
      }
    }
    
    return {
      id: `evt_${Math.random().toString(36).substr(2, 9)}`,
      stage,
      title: t,
      description: d,
      timestamp: new Date().toISOString()
    };
  }
};
