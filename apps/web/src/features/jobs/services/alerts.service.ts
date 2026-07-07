import type { JobAlert } from "../types/alerts.types";
 
const STORAGE_KEY = "ai_career_agent_job_alerts";
 
const MOCK_ALERTS: JobAlert[] = [
  {
    id: "alert_001",
    title: "Senior React Engineer",
    filters: {
      keyword: "React",
      skills: ["React", "TypeScript", "Next.js"],
      remoteType: ["remote", "hybrid"],
      experienceLevel: ["senior", "lead"]
    },
    frequency: "daily",
    isActive: true,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggeredAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    nextRunAt: new Date(Date.now() + 20 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "alert_002",
    title: "Kubernetes DevOps",
    filters: {
      keyword: "DevOps",
      skills: ["Kubernetes", "Docker", "AWS"],
      remoteType: ["remote"],
      salaryMin: 100000
    },
    frequency: "instant",
    isActive: true,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggeredAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    nextRunAt: new Date(Date.now() + 5 * 60 * 1000).toISOString()
  },
  {
    id: "alert_003",
    title: "Full Time Python fintech",
    filters: {
      keyword: "Python",
      employmentType: ["full-time"],
      salaryMin: 80000
    },
    frequency: "weekly",
    isActive: false,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    lastTriggeredAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
  }
];
 
export const alertsService = {
  async getAlerts(): Promise<JobAlert[]> {
    if (typeof window === "undefined") return [];
    
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(MOCK_ALERTS));
      return MOCK_ALERTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return MOCK_ALERTS;
    }
  },
 
  async saveAlerts(alerts: JobAlert[]): Promise<void> {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(alerts));
    }
  },
 
  async createAlert(alertData: Omit<JobAlert, "id" | "createdAt" | "isActive">): Promise<JobAlert> {
    const alerts = await this.getAlerts();
    const newAlert: JobAlert = {
      ...alertData,
      id: `alert_${Date.now()}`,
      isActive: true,
      createdAt: new Date().toISOString()
    };
    alerts.unshift(newAlert);
    await this.saveAlerts(alerts);
    return newAlert;
  },
 
  async updateAlert(id: string, updates: Partial<Omit<JobAlert, "id" | "createdAt">>): Promise<JobAlert | null> {
    const alerts = await this.getAlerts();
    let updatedAlert: JobAlert | null = null;
    const updatedList = alerts.map((a) => {
      if (a.id === id) {
        updatedAlert = { ...a, ...updates } as JobAlert;
        return updatedAlert;
      }
      return a;
    });
    await this.saveAlerts(updatedList);
    return updatedAlert;
  },
 
  async duplicateAlert(id: string): Promise<JobAlert | null> {
    const alerts = await this.getAlerts();
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return null;
 
    const copy: JobAlert = {
      ...alert,
      id: `alert_${Date.now()}`,
      title: `${alert.title} (Copy)`,
      createdAt: new Date().toISOString(),
      lastTriggeredAt: undefined,
      nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
 
    alerts.unshift(copy);
    await this.saveAlerts(alerts);
    return copy;
  },
 
  async deleteAlert(id: string): Promise<boolean> {
    const alerts = await this.getAlerts();
    const filtered = alerts.filter((a) => a.id !== id);
    await this.saveAlerts(filtered);
    return true;
  }
};
