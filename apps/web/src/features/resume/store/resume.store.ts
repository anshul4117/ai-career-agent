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

const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = 1;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const INITIAL_UPLOADED_RESUMES: UploadedResume[] = [
  {
    id: "res_001",
    fileName: "anshul-kumar-resume-v2.pdf",
    fileSize: "245 KB",
    uploadedAt: "2026-07-20T10:00:00Z",
    status: "Completed",
    atsScore: 82,
    isDefault: true,
    version: 2,
    versionHistory: [
      {
        version: 2,
        fileName: "anshul-kumar-resume-v2.pdf",
        uploadedAt: "2026-07-20T10:00:00Z",
        fileSize: "245 KB",
      },
      {
        version: 1,
        fileName: "anshul-kumar-resume-v1.pdf",
        uploadedAt: "2026-06-10T09:30:00Z",
        fileSize: "238 KB",
      },
    ],
  },
  {
    id: "res_002",
    fileName: "backend-focused-resume.pdf",
    fileSize: "198 KB",
    uploadedAt: "2026-07-18T14:22:00Z",
    status: "Completed",
    atsScore: 78,
    isDefault: false,
    version: 1,
    versionHistory: [
      {
        version: 1,
        fileName: "backend-focused-resume.pdf",
        uploadedAt: "2026-07-18T14:22:00Z",
        fileSize: "198 KB",
      },
    ],
  },
];

export const useResumeStore = create<ResumeState>((set, get) => ({
  // Legacy Builder State
  resumes: [],
  currentResume: null,
  isLoading: false,
  error: null,

  // Uploaded Resumes State
  uploadedResumes: INITIAL_UPLOADED_RESUMES,

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

  // Uploaded Resumes Actions (Simulating 800ms API latency)
  uploadResume: async (file: File) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newId = `res_${Date.now()}`;
    const newResume: UploadedResume = {
      id: newId,
      fileName: file.name,
      fileSize: formatBytes(file.size),
      uploadedAt: new Date().toISOString(),
      status: "Completed",
      atsScore: Math.floor(Math.random() * 20) + 75, // random score between 75 and 95
      isDefault: get().uploadedResumes.length === 0,
      version: 1,
      versionHistory: [
        {
          version: 1,
          fileName: file.name,
          uploadedAt: new Date().toISOString(),
          fileSize: formatBytes(file.size),
        },
      ],
    };

    set((state) => ({
      uploadedResumes: [newResume, ...state.uploadedResumes],
      isLoading: false,
    }));
  },

  deleteUploadedResume: async (id: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set((state) => {
      const deleted = state.uploadedResumes.find((r) => r.id === id);
      const filtered = state.uploadedResumes.filter((r) => r.id !== id);

      // Keep at least one default if possible
      if (deleted?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }

      return {
        uploadedResumes: filtered,
        isLoading: false,
      };
    });
  },

  renameUploadedResume: async (id: string, newName: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set((state) => {
      const updated = state.uploadedResumes.map((r) => {
        if (r.id === id) {
          const nextVersion = r.version + 1;
          const size = r.fileSize;
          const now = new Date().toISOString();

          return {
            ...r,
            fileName: newName,
            version: nextVersion,
            uploadedAt: now,
            versionHistory: [
              {
                version: nextVersion,
                fileName: newName,
                uploadedAt: now,
                fileSize: size,
              },
              ...r.versionHistory,
            ],
          };
        }
        return r;
      });

      return {
        uploadedResumes: updated,
        isLoading: false,
      };
    });
  },

  setDefaultUploadedResume: async (id: string) => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set((state) => {
      const updated = state.uploadedResumes.map((r) => ({
        ...r,
        isDefault: r.id === id,
      }));
      return {
        uploadedResumes: updated,
        isLoading: false,
      };
    });
  },

  downloadResume: async () => {
    set({ isLoading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ isLoading: false });
  },
}));
