import { create } from "zustand";
import type { Resume } from "../types/resume.types";
import { resumeService } from "../services/resume.service";

interface ResumeState {
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;

  loadResumes: () => Promise<void>;
  loadResume: (id: string) => Promise<Resume | null>;
  createResume: (data: Omit<Resume, "id" | "atsScore" | "createdAt" | "updatedAt">) => Promise<Resume>;
  updateResume: (id: string, updates: Partial<Omit<Resume, "id" | "createdAt" | "updatedAt">>) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<Resume>;
  archiveResume: (id: string) => Promise<Resume>;
  restoreResume: (id: string) => Promise<Resume>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  loadResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const list = await resumeService.getAll();
      set({ resumes: list, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  loadResume: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const resume = await resumeService.getOne(id);
      set({ currentResume: resume || null, isLoading: false });
      return resume || null;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  createResume: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const newResume = await resumeService.create(data);
      const list = await resumeService.getAll();
      set({ resumes: list, isLoading: false });
      return newResume;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  updateResume: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await resumeService.update(id, updates);
      const list = await resumeService.getAll();
      set({ resumes: list, currentResume: get().currentResume?.id === id ? updated : get().currentResume, isLoading: false });
      return updated;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await resumeService.delete(id);
      const list = await resumeService.getAll();
      set({ resumes: list, currentResume: get().currentResume?.id === id ? null : get().currentResume, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  duplicateResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const copy = await resumeService.duplicate(id);
      const list = await resumeService.getAll();
      set({ resumes: list, isLoading: false });
      return copy;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  archiveResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const archived = await resumeService.archive(id);
      const list = await resumeService.getAll();
      set({ resumes: list, currentResume: get().currentResume?.id === id ? archived : get().currentResume, isLoading: false });
      return archived;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  restoreResume: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const restored = await resumeService.restore(id);
      const list = await resumeService.getAll();
      set({ resumes: list, currentResume: get().currentResume?.id === id ? restored : get().currentResume, isLoading: false });
      return restored;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  }
}));
