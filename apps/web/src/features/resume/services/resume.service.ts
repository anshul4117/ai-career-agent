import { apiClient } from "@/lib/api-client";
import type {
  Resume,
  ResumeTemplate,
  UploadedResume,
} from "../types/resume.types";

export const MOCK_TEMPLATES: ResumeTemplate[] = [
  {
    id: "classic",
    name: "Classic",
    description:
      "Traditional centered serif design, perfect for corporate and conservative fields.",
    category: "Corporate",
    previewColor: "bg-[#f3f4f6]",
  },
  {
    id: "modern",
    name: "Modern",
    description:
      "Balanced grid spacing with custom accents and clean sans-serif typography.",
    category: "Modern",
    previewColor: "bg-primary/20",
  },
  {
    id: "minimal",
    name: "Minimal",
    description:
      "Ultra-compact single column layout with minimal headings and maximum density.",
    category: "Clean",
    previewColor: "bg-[#ffffff]",
  },
  {
    id: "professional",
    name: "Professional",
    description:
      "Business-focused header band with secondary detail columns, great for managers.",
    category: "Executive",
    previewColor: "bg-[#1e293b]",
  },
  {
    id: "developer",
    name: "Developer",
    description:
      "Clean monospace coding elements, perfect for showing technical skills.",
    category: "Tech",
    previewColor: "bg-[#0f172a]",
  },
  {
    id: "creative",
    name: "Creative",
    description:
      "Bold brutalist styling, bright background accents, and unique borders.",
    category: "Design",
    previewColor: "bg-[#ffde4d]",
  },
];

export interface BackendResume {
  id: string;
  userId: string;
  title: string;
  fileUrl: string;
  fileType: "PDF" | "DOCX";
  fileSize?: number | null;
  originalFileName?: string | null;
  isDefault: boolean;
  status: "ACTIVE" | "ARCHIVED";
  currentVersion: number;
  templateId?: string | null;
  themeConfig?: Record<string, unknown> | null;
  customSections?: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
  versions?: Array<{
    id: string;
    versionNumber: number;
    title: string;
    fileUrl?: string | null;
    createdAt: string;
  }>;
  analyses?: Array<{
    overallAtsScore: number;
  }>;
}

function formatBytes(bytes?: number | null): string {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = 1;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function toUploadedResume(raw: BackendResume): UploadedResume {
  const latestScore = raw.analyses?.[0]?.overallAtsScore ?? 80;
  return {
    id: raw.id,
    fileName: raw.originalFileName || raw.title || "resume.pdf",
    fileSize: formatBytes(raw.fileSize),
    fileUrl: raw.fileUrl,
    uploadedAt: raw.createdAt,
    status: "Completed",
    atsScore: Math.round(latestScore),
    isDefault: raw.isDefault,
    version: raw.currentVersion,
    versionHistory: (raw.versions || []).map((v) => ({
      version: v.versionNumber,
      fileName: v.title || raw.originalFileName || "resume.pdf",
      uploadedAt: v.createdAt,
      fileSize: formatBytes(raw.fileSize),
      fileUrl: v.fileUrl || raw.fileUrl,
    })),
  };
}

export function toResume(raw: BackendResume): Resume {
  const latestScore = raw.analyses?.[0]?.overallAtsScore ?? 80;
  return {
    id: raw.id,
    title: raw.title,
    description: `Version ${raw.currentVersion} • ${raw.fileType}`,
    templateId: raw.templateId || "default",
    status: raw.status === "ARCHIVED" ? "archived" : "active",
    isDefault: raw.isDefault,
    atsScore: Math.round(latestScore),
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  };
}

export const resumeService = {
  getTemplates: (): ResumeTemplate[] => {
    return MOCK_TEMPLATES;
  },

  getAll: async (): Promise<Resume[]> => {
    try {
      const data = await apiClient.get<BackendResume[]>("/resumes");
      return data.map(toResume);
    } catch {
      return [];
    }
  },

  getUploadedResumes: async (): Promise<UploadedResume[]> => {
    try {
      const data = await apiClient.get<BackendResume[]>("/resumes");
      return data.map(toUploadedResume);
    } catch {
      return [];
    }
  },

  getOne: async (id: string): Promise<Resume | undefined> => {
    try {
      const raw = await apiClient.get<BackendResume>(`/resumes/${id}`);
      return toResume(raw);
    } catch {
      return undefined;
    }
  },

  upload: async (
    file: File,
    options?: { title?: string; isDefault?: boolean },
  ): Promise<UploadedResume> => {
    const formData = new FormData();
    formData.append("file", file);
    if (options?.title) formData.append("title", options.title);
    if (options?.isDefault !== undefined) {
      formData.append("isDefault", String(options.isDefault));
    }

    const raw = await apiClient.upload<BackendResume>(
      "/resumes/upload",
      formData,
    );
    return toUploadedResume(raw);
  },

  create: async (
    data: Omit<Resume, "id" | "atsScore" | "createdAt" | "updatedAt">,
  ): Promise<Resume> => {
    try {
      const raw = await apiClient.post<BackendResume>("/resumes", {
        title: data.title,
        templateId: data.templateId,
        isDefault: data.isDefault,
        status: data.status === "archived" ? "ARCHIVED" : "ACTIVE",
        themeConfig: data.theme,
        customSections: data.content,
      });
      return toResume(raw);
    } catch {
      return {
        ...data,
        id: `res_${Date.now()}`,
        atsScore: 80,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  update: async (
    id: string,
    updates: Partial<Omit<Resume, "id" | "createdAt" | "updatedAt">>,
  ): Promise<Resume> => {
    try {
      const payload: Record<string, unknown> = {};
      if (updates.title !== undefined) payload.title = updates.title;
      if (updates.templateId !== undefined)
        payload.templateId = updates.templateId;
      if (updates.isDefault !== undefined)
        payload.isDefault = updates.isDefault;
      if (updates.status !== undefined) {
        payload.status = updates.status === "archived" ? "ARCHIVED" : "ACTIVE";
      }
      if (updates.theme !== undefined) payload.themeConfig = updates.theme;
      if (updates.content !== undefined)
        payload.customSections = updates.content;

      const raw = await apiClient.patch<BackendResume>(
        `/resumes/${id}`,
        payload,
      );
      return toResume(raw);
    } catch {
      return {
        id,
        title: updates.title || "Resume",
        description: updates.description || "",
        templateId: updates.templateId || "default",
        status: updates.status || "active",
        isDefault: updates.isDefault ?? false,
        atsScore: 80,
        content: updates.content,
        theme: updates.theme,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }
  },

  duplicate: async (id: string): Promise<Resume> => {
    const original = await resumeService.getOne(id);
    if (!original) throw new Error("Resume not found");

    return resumeService.create({
      ...original,
      title: `${original.title} (Copy)`,
      isDefault: false,
    });
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/resumes/${id}`);
  },

  createVersion: async (
    id: string,
    file?: File,
    changeSummary?: string,
  ): Promise<void> => {
    const formData = new FormData();
    if (file) formData.append("file", file);
    if (changeSummary) formData.append("changeSummary", changeSummary);

    await apiClient.upload(`/resumes/${id}/versions`, formData);
  },

  setDefault: async (id: string): Promise<void> => {
    await apiClient.patch(`/resumes/${id}`, { isDefault: true });
  },

  archive: async (id: string): Promise<Resume> => {
    const raw = await apiClient.patch<BackendResume>(`/resumes/${id}`, {
      status: "ARCHIVED",
    });
    return toResume(raw);
  },

  restore: async (id: string): Promise<Resume> => {
    const raw = await apiClient.patch<BackendResume>(`/resumes/${id}`, {
      status: "ACTIVE",
    });
    return toResume(raw);
  },
};
