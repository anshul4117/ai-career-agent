import type { NotificationItem } from "../types/notifications.types";
 
const STORAGE_KEY = "ai_career_agent_notifications_v2";
 
const SEED_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_001",
    category: "job_alerts",
    title: "New matches for 'Senior React Engineer'",
    description: "We found 3 new jobs matching your alert filters: React, Go, remote. Click View to review them.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    read: false,
    actionUrl: "/jobs?keyword=React"
  },
  {
    id: "notif_002",
    category: "applications",
    title: "Interview Scheduled with Linear Labs",
    description: "Your application for Full Stack Engineer has been moved to Interview. Check details.",
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    read: false,
    actionUrl: "/applications"
  },
  {
    id: "notif_003",
    category: "resume_parsing",
    title: "Resume Parsing Complete",
    description: "Successfully extracted 12 skills, 3 educational credentials, and 4 experiences from 'resume_v2.pdf'.",
    timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    read: true,
    actionUrl: "/resume"
  },
  {
    id: "notif_004",
    category: "resume_optimization",
    title: "Resume Optimization Suggestion",
    description: "AI optimized suggestion completed. Tailored resume for Stripe Startup increases match percentage by 18%.",
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    read: true,
    actionUrl: "/resume"
  },
  {
    id: "notif_005",
    category: "ai_match",
    title: "Match Score Update: ByteFlow Finance",
    description: "A new analysis indicates you have a 95% skills match score for Backend Developer at ByteFlow Finance.",
    timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4 days ago
    read: false,
    actionUrl: "/jobs/job_seed_004"
  },
  {
    id: "notif_006",
    category: "cover_letter",
    title: "Cover Letter Tailored Successfully",
    description: "A customized cover letter for CloudScale Systems has been generated and added to your dashboard.",
    timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    read: true,
    actionUrl: "/cover-letters"
  },
  {
    id: "notif_007",
    category: "system",
    title: "Profile Onboarding Completed",
    description: "Welcome to AI Career Agent! Your career profile is complete. Automated matching runs are now active.",
    timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
    read: true,
    actionUrl: "/profile"
  }
];
 
export const notificationsService = {
  async getNotifications(): Promise<NotificationItem[]> {
    if (typeof window === "undefined") return [];
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_NOTIFICATIONS));
      return SEED_NOTIFICATIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return SEED_NOTIFICATIONS;
    }
  },
 
  async saveNotifications(list: NotificationItem[]): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  },
 
  async addNotification(notifData: Omit<NotificationItem, "id" | "timestamp" | "read">): Promise<NotificationItem> {
    const list = await this.getNotifications();
    const newNotif: NotificationItem = {
      ...notifData,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false
    };
    list.unshift(newNotif);
    await this.saveNotifications(list);
    return newNotif;
  },
 
  async markRead(id: string, readStatus = true): Promise<NotificationItem | null> {
    const list = await this.getNotifications();
    let updated: NotificationItem | null = null;
    const updatedList = list.map((item) => {
      if (item.id === id) {
        updated = { ...item, read: readStatus };
        return updated;
      }
      return item;
    });
    await this.saveNotifications(updatedList);
    return updated;
  },
 
  async markAllRead(): Promise<void> {
    const list = await this.getNotifications();
    const updatedList = list.map((item) => ({ ...item, read: true }));
    await this.saveNotifications(updatedList);
  },
 
  async deleteNotification(id: string): Promise<void> {
    const list = await this.getNotifications();
    const filtered = list.filter((item) => item.id !== id);
    await this.saveNotifications(filtered);
  }
};
