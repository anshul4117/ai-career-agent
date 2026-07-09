"use client";
 
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { JobApplication, TimelineEvent } from "../types/application.types";
import type { ApplicationStatus } from "@/types";
import { applicationService } from "../services/application.service";
import { timelineService } from "../services/timeline.service";
import { notificationService } from "../services/notification.service";
 
interface ApplicationFilters {
  status: string;
  company: string;
  location: string;
  isRemote: string; // "all" | "remote" | "onsite"
  salaryMin: number | null;
  matchScoreMin: number | null;
  jobQualityMin: number | null;
}
 
interface ApplicationState {
  applications: JobApplication[];
  loading: boolean;
  error: string | null;
  search: string;
  filters: ApplicationFilters;
  
  // Dialog State
  selectedAppId: string | null;
  setSelectedAppId: (id: string | null) => void;
  
  // Actions
  fetchApplications: () => Promise<void>;
  addApplication: (app: Omit<JobApplication, "id" | "timeline">) => void;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => void;
  updateStatus: (id: string, status: ApplicationStatus) => string | null; // Returns notification alert string
  addTimelineEvent: (id: string, title: string, description: string) => void;
  scheduleInterview: (
    id: string,
    details: {
      date: string;
      time: string;
      type: JobApplication["interviewType"];
      round: string;
      status: JobApplication["interviewStatus"];
    }
  ) => void;
  
  // Filter Actions
  setSearch: (term: string) => void;
  updateFilters: (updates: Partial<ApplicationFilters>) => void;
  resetFilters: () => void;
}
 
const DEFAULT_FILTERS: ApplicationFilters = {
  status: "all",
  company: "",
  location: "",
  isRemote: "all",
  salaryMin: null,
  matchScoreMin: null,
  jobQualityMin: null
};
 
export const useApplicationStore = create<ApplicationState>()(
  persist(
    (set, get) => ({
      applications: [],
      loading: false,
      error: null,
      search: "",
      filters: DEFAULT_FILTERS,
      selectedAppId: null,
 
      setSelectedAppId: (id) => set({ selectedAppId: id }),
 
      fetchApplications: async () => {
        // Only load mock list if store is empty to preserve user modifications
        if (get().applications.length > 0) return;
        
        set({ loading: true, error: null });
        try {
          const list = await applicationService.getApplications();
          set({ applications: list, loading: false });
        } catch {
          set({ error: "Failed to load applications pipeline", loading: false });
        }
      },
 
      addApplication: (app) => {
        const newApp: JobApplication = {
          ...app,
          id: `app_${Math.random().toString(36).substr(2, 9)}`,
          timeline: [
            timelineService.createEvent(app.status, "Application Created", "Job added to application tracker.")
          ]
        };
 
        set((state) => ({
          applications: [newApp, ...state.applications]
        }));
      },
 
      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app
          )
        }));
      },
 
      deleteApplication: (id) => {
        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          selectedAppId: state.selectedAppId === id ? null : state.selectedAppId
        }));
      },
 
      updateStatus: (id, status) => {
        let alertMsg: string | null = null;
        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== id) return app;
            
            // Build progression event
            const event = timelineService.createEvent(status);
            alertMsg = notificationService.triggerStatusAlert(app.jobTitle, app.company, status);
            
            return {
              ...app,
              status,
              timeline: [...app.timeline, event]
            };
          });
          return { applications: updated };
        });
        return alertMsg;
      },
 
      addTimelineEvent: (id, title, description) => {
        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== id) return app;
            const event: TimelineEvent = {
              id: `evt_${Math.random().toString(36).substr(2, 9)}`,
              stage: app.status,
              title,
              description,
              timestamp: new Date().toISOString()
            };
            return {
              ...app,
              timeline: [...app.timeline, event]
            };
          });
          return { applications: updated };
        });
      },
 
      scheduleInterview: (id, details) => {
        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== id) return app;
            
            const event = timelineService.createEvent(
              "INTERVIEW",
              `Interview Scheduled: ${details.round}`,
              `Round structured as ${details.type} on ${details.date} at ${details.time}`
            );
            
            return {
              ...app,
              interviewDate: details.date,
              interviewTime: details.time,
              interviewType: details.type,
              interviewRound: details.round,
              interviewStatus: details.status,
              timeline: [...app.timeline, event]
            };
          });
          return { applications: updated };
        });
      },
 
      setSearch: (term) => set({ search: term }),
 
      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates }
        })),
 
      resetFilters: () => set({ filters: DEFAULT_FILTERS, search: "" })
    }),
    {
      name: "ai-career-agent-applications-tracker",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
