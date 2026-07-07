"use client";
 
import { create } from "zustand";
import type { NotificationItem } from "../types/notifications.types";
import { notificationsService } from "../services/notifications.service";
 
interface NotificationsState {
  notifications: NotificationItem[];
  loading: boolean;
  
  fetchNotifications: () => Promise<void>;
  addMockNotification: (notifData: Omit<NotificationItem, "id" | "timestamp" | "read">) => Promise<void>;
  markAsRead: (id: string, readStatus?: boolean) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}
 
export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  loading: false,
 
  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const list = await notificationsService.getNotifications();
      set({ notifications: list, loading: false });
    } catch {
      set({ loading: false });
    }
  },
 
  addMockNotification: async (notifData) => {
    try {
      await notificationsService.addNotification(notifData);
      const list = await notificationsService.getNotifications();
      set({ notifications: list });
    } catch {}
  },
 
  markAsRead: async (id, readStatus = true) => {
    const list = get().notifications;
    const updated = list.map((item) => {
      if (item.id === id) {
        return { ...item, read: readStatus };
      }
      return item;
    });
    set({ notifications: updated });
    try {
      await notificationsService.markRead(id, readStatus);
    } catch {
      set({ notifications: list });
    }
  },
 
  markAllAsRead: async () => {
    const list = get().notifications;
    const updated = list.map((item) => ({ ...item, read: true }));
    set({ notifications: updated });
    try {
      await notificationsService.markAllRead();
    } catch {
      set({ notifications: list });
    }
  },
 
  deleteNotification: async (id) => {
    const list = get().notifications;
    const filtered = list.filter((item) => item.id !== id);
    set({ notifications: filtered });
    try {
      await notificationsService.deleteNotification(id);
    } catch {
      set({ notifications: list });
    }
  }
}));
