"use client";
 
import { create } from "zustand";
import type { JobAlert } from "../types/alerts.types";
import { alertsService } from "../services/alerts.service";
 
interface AlertsState {
  alerts: JobAlert[];
  loading: boolean;
  
  fetchAlerts: () => Promise<void>;
  createAlert: (alertData: Omit<JobAlert, "id" | "createdAt" | "isActive">) => Promise<void>;
  updateAlert: (id: string, updates: Partial<Omit<JobAlert, "id" | "createdAt">>) => Promise<void>;
  deleteAlert: (id: string) => Promise<void>;
  duplicateAlert: (id: string) => Promise<void>;
  toggleAlertActive: (id: string) => Promise<void>;
}
 
export const useAlertsStore = create<AlertsState>((set, get) => ({
  alerts: [],
  loading: false,
 
  fetchAlerts: async () => {
    set({ loading: true });
    try {
      const list = await alertsService.getAlerts();
      set({ alerts: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },
 
  createAlert: async (alertData) => {
    set({ loading: true });
    try {
      const newAlert = await alertsService.createAlert({
        ...alertData,
        lastTriggeredAt: undefined,
        nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      });
      const list = await alertsService.getAlerts();
      set({ alerts: list, loading: false });
 
      // Background Engine Mock Sync Flow: find matches after 3 seconds
      setTimeout(async () => {
        const { useNotificationsStore } = await import("@/features/notifications/store/notifications.store");
        useNotificationsStore.getState().addMockNotification({
          category: "job_alerts",
          title: `New Matches: ${newAlert.title}`,
          description: `We found 3 new opportunities matching your filters for "${newAlert.title}".`,
          actionUrl: `/jobs?keyword=${encodeURIComponent(newAlert.filters.keyword || "")}`
        });
      }, 3000);
    } catch {
      set({ loading: false });
    }
  },
 
  updateAlert: async (id, updates) => {
    set({ loading: true });
    try {
      await alertsService.updateAlert(id, updates);
      const list = await alertsService.getAlerts();
      set({ alerts: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },
 
  duplicateAlert: async (id) => {
    set({ loading: true });
    try {
      await alertsService.duplicateAlert(id);
      const list = await alertsService.getAlerts();
      set({ alerts: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },
 
  deleteAlert: async (id) => {
    set({ loading: true });
    try {
      await alertsService.deleteAlert(id);
      const list = await alertsService.getAlerts();
      set({ alerts: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },
 
  toggleAlertActive: async (id) => {
    const alerts = get().alerts;
    const alert = alerts.find((a) => a.id === id);
    if (!alert) return;
 
    // Optimistic state toggle
    const updatedAlerts = alerts.map((a) => {
      if (a.id === id) {
        return { ...a, isActive: !a.isActive };
      }
      return a;
    });
    set({ alerts: updatedAlerts });
 
    try {
      await alertsService.updateAlert(id, { isActive: !alert.isActive });
    } catch {
      // Revert on error
      set({ alerts });
    }
  }
}));
