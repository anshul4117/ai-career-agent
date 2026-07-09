import type { ApplicationStatus } from "@/types";
 
export const notificationService = {
  triggerStatusAlert(jobTitle: string, company: string, status: ApplicationStatus): string {
    const stageLabel = status.replace(/_/g, " ").toLowerCase();
    return `Application status updated: ${jobTitle} at ${company} is now in the "${stageLabel}" column.`;
  }
};
