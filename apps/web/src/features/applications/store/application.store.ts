"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  JobApplication,
  TimelineEvent,
  ApplicationNote,
} from "../types/application.types";
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
  addApplication: (
    app: Omit<JobApplication, "id" | "timeline">,
  ) => Promise<void>;
  updateApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteApplication: (id: string) => Promise<void>;
  updateStatus: (
    id: string,
    status: ApplicationStatus,
  ) => Promise<string | null>; // Returns notification alert string
  addTimelineEvent: (id: string, title: string, description: string) => void;
  scheduleInterview: (
    id: string,
    details: {
      date: string;
      time: string;
      type: JobApplication["interviewType"];
      round: string;
      status: JobApplication["interviewStatus"];
    },
  ) => void;

  // Save & Unsave Job actions
  saveJob: (job: {
    id: string;
    title: string;
    company: string;
    location: string;
    matchScore?: number;
    jobQuality?: number;
  }) => Promise<void>;
  unsaveJob: (jobId: string) => Promise<void>;

  // Notes actions
  addNote: (appId: string, content: string) => Promise<void>;
  updateNote: (appId: string, noteId: string, content: string) => Promise<void>;
  deleteNote: (appId: string, noteId: string) => Promise<void>;

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
  jobQualityMin: null,
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
          // Ensure notes exist as array on mock list
          const normalized = list.map((app) => ({
            ...app,
            notes: app.notes || [
              {
                id: "note_1",
                content: "Great office location, close to transit.",
                createdAt: new Date(
                  Date.now() - 3 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
              {
                id: "note_2",
                content:
                  "HR recruiter was super helpful. Follow up on tech stack specifics.",
                createdAt: new Date(
                  Date.now() - 1 * 24 * 60 * 60 * 1000,
                ).toISOString(),
              },
            ],
          }));
          set({ applications: normalized, loading: false });
        } catch {
          set({
            error: "Failed to load applications pipeline",
            loading: false,
          });
        }
      },

      addApplication: async (app) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const newApp: JobApplication = {
          ...app,
          id: `app_${Math.random().toString(36).substr(2, 9)}`,
          timeline: [
            timelineService.createEvent(
              app.status,
              "Application Created",
              "Job added to application tracker.",
            ),
          ],
          notes: [],
        };

        set((state) => ({
          applications: [newApp, ...state.applications],
          loading: false,
        }));
      },

      updateApplication: (id, updates) => {
        set((state) => ({
          applications: state.applications.map((app) =>
            app.id === id ? { ...app, ...updates } : app,
          ),
        }));
      },

      deleteApplication: async (id) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set((state) => ({
          applications: state.applications.filter((app) => app.id !== id),
          selectedAppId:
            state.selectedAppId === id ? null : state.selectedAppId,
          loading: false,
        }));
      },

      updateStatus: async (id, status) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        let alertMsg: string | null = null;
        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== id) return app;

            // Build progression event
            const event = timelineService.createEvent(status);
            alertMsg = notificationService.triggerStatusAlert(
              app.jobTitle,
              app.company,
              status,
            );

            return {
              ...app,
              status,
              timeline: [...app.timeline, event],
            };
          });
          return { applications: updated, loading: false };
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
              timestamp: new Date().toISOString(),
            };
            return {
              ...app,
              timeline: [...app.timeline, event],
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
              `Round structured as ${details.type} on ${details.date} at ${details.time}`,
            );

            return {
              ...app,
              interviewDate: details.date,
              interviewTime: details.time,
              interviewType: details.type,
              interviewRound: details.round,
              interviewStatus: details.status,
              timeline: [...app.timeline, event],
            };
          });
          return { applications: updated };
        });
      },

      saveJob: async (job) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        const existing = get().applications.find(
          (app) =>
            app.jobId === job.id ||
            (app.jobTitle === job.title && app.company === job.company),
        );
        if (existing) {
          set({ loading: false });
          return;
        }

        const newApp: JobApplication = {
          id: `app_${Math.random().toString(36).substr(2, 9)}`,
          jobId: job.id,
          jobTitle: job.title,
          company: job.company,
          status: "SAVED",
          appliedAt: new Date().toISOString(),
          source: "Direct Portal",
          matchScore: job.matchScore || 75,
          jobQuality: job.jobQuality || 70,
          recruiterName: "",
          recruiterEmail: "",
          phone: "",
          salaryNotes: "",
          salaryDiscussion: "",
          interviewNotes: "",
          followUpNotes: "",
          personalNotes: "",
          interviewDate: "",
          interviewTime: "",
          interviewType: "N/A",
          interviewRound: "N/A",
          interviewStatus: "N/A",
          interviewerName: "",
          meetingLink: "",
          offerDeadline: "",
          isRemote: false,
          location: job.location || "Remote",
          salaryRange: "",
          timeline: [
            timelineService.createEvent(
              "SAVED",
              "Job Saved",
              "Opportunity saved to career discovery tracker.",
            ),
          ],
          notes: [],
        };

        set((state) => ({
          applications: [newApp, ...state.applications],
          loading: false,
        }));
      },

      unsaveJob: async (jobId) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set((state) => ({
          applications: state.applications.filter((app) => app.jobId !== jobId),
          loading: false,
        }));
      },

      addNote: async (appId, content) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== appId) return app;
            const newNote: ApplicationNote = {
              id: `note_${Math.random().toString(36).substr(2, 9)}`,
              content,
              createdAt: new Date().toISOString(),
            };
            return {
              ...app,
              notes: [...(app.notes || []), newNote],
            };
          });
          return { applications: updated, loading: false };
        });
      },

      updateNote: async (appId, noteId, content) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              notes: (app.notes || []).map((n) =>
                n.id === noteId
                  ? { ...n, content, createdAt: new Date().toISOString() }
                  : n,
              ),
            };
          });
          return { applications: updated, loading: false };
        });
      },

      deleteNote: async (appId, noteId) => {
        set({ loading: true });
        await new Promise((resolve) => setTimeout(resolve, 800));

        set((state) => {
          const updated = state.applications.map((app) => {
            if (app.id !== appId) return app;
            return {
              ...app,
              notes: (app.notes || []).filter((n) => n.id !== noteId),
            };
          });
          return { applications: updated, loading: false };
        });
      },

      setSearch: (term) => set({ search: term }),

      updateFilters: (updates) =>
        set((state) => ({
          filters: { ...state.filters, ...updates },
        })),

      resetFilters: () => set({ filters: DEFAULT_FILTERS, search: "" }),
    }),
    {
      name: "ai-career-agent-applications-tracker",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
