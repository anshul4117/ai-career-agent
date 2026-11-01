import { create } from "zustand";
import type { Resume, UploadedResume } from "../types/resume.types";
import { resumeService } from "../services/resume.service";

interface ResumeState {
  // Legacy Builder State
  resumes: Resume[];
  currentResume: Resume | null;
  isLoading: boolean;
  error: string | null;

  loadResumes: () => Promise<void>;
  loadResume: (id: string) => Promise<Resume | null>;
  createResume: (
    data: Omit<Resume, "id" | "atsScore" | "createdAt" | "updatedAt">,
  ) => Promise<Resume>;
  updateResume: (
    id: string,
    updates: Partial<Omit<Resume, "id" | "createdAt" | "updatedAt">>,
  ) => Promise<Resume>;
  deleteResume: (id: string) => Promise<void>;
  duplicateResume: (id: string) => Promise<Resume>;
  archiveResume: (id: string) => Promise<Resume>;
  restoreResume: (id: string) => Promise<Resume>;

  // Uploaded Resumes State (Sprint 1.7 & 1.8)
  uploadedResumes: UploadedResume[];
  uploadResume: (file: File) => Promise<void>;
  deleteUploadedResume: (id: string) => Promise<void>;
  renameUploadedResume: (id: string, newName: string) => Promise<void>;
  setDefaultUploadedResume: (id: string) => Promise<void>;
  downloadResume: (id: string) => Promise<void>;
}

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Legacy Builder State
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  // Uploaded Resumes State — Starts empty for fresh users until they manually upload
  uploadedResumes: [],

  loadResumes: async () => {
    set({ isLoading: true, error: null });
    try {
      const [list, uploaded] = await Promise.all([
        resumeService.getAll(),
        resumeService.getUploadedResumes(),
      ]);
      set({
        resumes: list,
        uploadedResumes: uploaded,
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },

  loadResume: async (id: string) => {
    if (id.startsWith("res_")) {
      // For uploaded resumes, just return null or simulated mock Resume matching ID
      return null;
    }
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
      set({
        resumes: list,
        currentResume:
          get().currentResume?.id === id ? updated : get().currentResume,
        isLoading: false,
      });
      return updated;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteResume: async (id) => {
    if (id.startsWith("res_")) {
      await get().deleteUploadedResume(id);
      return;
    }
    set({ isLoading: true, error: null });
    try {
      await resumeService.delete(id);
      const list = await resumeService.getAll();
      set({
        resumes: list,
        currentResume:
          get().currentResume?.id === id ? null : get().currentResume,
        isLoading: false,
      });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  duplicateResume: async (id) => {
    if (id.startsWith("res_")) {
      set({ isLoading: true });
      await new Promise((resolve) => setTimeout(resolve, 800));

      let duplicated: UploadedResume | null = null;
      set((state) => {
        const target = state.uploadedResumes.find((r) => r.id === id);
        if (!target) return { isLoading: false };

        const ext = target.fileName.split(".").pop();
        const baseName = target.fileName.substring(
          0,
          target.fileName.lastIndexOf("."),
        );
        const newFileName = `${baseName}-copy.${ext}`;

        duplicated = {
          ...target,
          id: `res_${Date.now()}`,
          fileName: newFileName,
          uploadedAt: new Date().toISOString(),
          isDefault: false,
          version: 1,
          versionHistory: [
            {
              version: 1,
              fileName: newFileName,
              uploadedAt: new Date().toISOString(),
              fileSize: target.fileSize,
            },
          ],
        };

        return {
          uploadedResumes: [...state.uploadedResumes, duplicated],
          isLoading: false,
        };
      });

      if (!duplicated) throw new Error("Duplication failed");
      return duplicated as unknown as Resume;
    }

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
      set({
        resumes: list,
        currentResume:
          get().currentResume?.id === id ? archived : get().currentResume,
        isLoading: false,
      });
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
      set({
        resumes: list,
        currentResume:
          get().currentResume?.id === id ? restored : get().currentResume,
        isLoading: false,
      });
      return restored;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  // Uploaded Resumes Actions (Connected to backend API)
  uploadResume: async (file: File) => {
    set({ isLoading: true, error: null });
    try {
      const newResume = await resumeService.upload(file);
      set((state) => ({
        uploadedResumes: [
          newResume,
          ...state.uploadedResumes.filter((r) => r.id !== newResume.id),
        ],
        isLoading: false,
      }));
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      throw err;
    }
  },

  deleteUploadedResume: async (id: string) => {
    set({ isLoading: true });
    try {
      await resumeService.delete(id);
      set((state) => ({
        uploadedResumes: state.uploadedResumes.filter((r) => r.id !== id),
        isLoading: false,
      }));
    } catch {
      set((state) => ({
        uploadedResumes: state.uploadedResumes.filter((r) => r.id !== id),
        isLoading: false,
      }));
    }
  },

  renameUploadedResume: async (id: string, newName: string) => {
    set({ isLoading: true });
    try {
      await resumeService.update(id, { title: newName });
      set((state) => ({
        uploadedResumes: state.uploadedResumes.map((r) =>
          r.id === id ? { ...r, fileName: newName } : r,
        ),
        isLoading: false,
      }));
    } catch {
      set((state) => ({
        uploadedResumes: state.uploadedResumes.map((r) =>
          r.id === id ? { ...r, fileName: newName } : r,
        ),
        isLoading: false,
      }));
    }
  },

  setDefaultUploadedResume: async (id: string) => {
    set({ isLoading: true });
    try {
      await resumeService.setDefault(id);
      set((state) => ({
        uploadedResumes: state.uploadedResumes.map((r) => ({
          ...r,
          isDefault: r.id === id,
        })),
        isLoading: false,
      }));
    } catch {
      set((state) => ({
        uploadedResumes: state.uploadedResumes.map((r) => ({
          ...r,
          isDefault: r.id === id,
        })),
        isLoading: false,
      }));
    }
  },

  downloadResume: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 300));
    set({ isLoading: false });
  },
}));
