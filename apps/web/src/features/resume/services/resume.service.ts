import type { Resume, ResumeTemplate } from "../types/resume.types";

export const MOCK_TEMPLATES: ResumeTemplate[] = [
  { 
    id: "classic", 
    name: "Classic", 
    description: "Traditional centered serif design, perfect for corporate and conservative fields.", 
    category: "Corporate",
    previewColor: "bg-[#f3f4f6]"
  },
  { 
    id: "modern", 
    name: "Modern", 
    description: "Balanced grid spacing with custom accents and clean sans-serif typography.", 
    category: "Modern",
    previewColor: "bg-primary/20"
  },
  { 
    id: "minimal", 
    name: "Minimal", 
    description: "Ultra-compact single column layout with minimal headings and maximum density.", 
    category: "Clean",
    previewColor: "bg-[#ffffff]"
  },
  { 
    id: "professional", 
    name: "Professional", 
    description: "Business-focused header band with secondary detail columns, great for managers.", 
    category: "Executive",
    previewColor: "bg-[#1e293b]"
  },
  { 
    id: "developer", 
    name: "Developer", 
    description: "Clean monospace coding elements, perfect for showing technical skills.", 
    category: "Tech",
    previewColor: "bg-[#0f172a]"
  },
  { 
    id: "creative", 
    name: "Creative", 
    description: "Bold brutalist styling, bright background accents, and unique borders.", 
    category: "Design",
    previewColor: "bg-[#ffde4d]"
  },
];

const STORAGE_KEY = "aca-resumes";

const INITIAL_RESUMES: Resume[] = [
  {
    id: "res_001",
    title: "Senior Full Stack Resume",
    description: "Optimized for software engineer, technical lead, and developer manager applications.",
    templateId: "developer",
    status: "active",
    isDefault: true,
    atsScore: 92,
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "res_002",
    title: "Agile Project Manager Draft",
    description: "Highlighting agile methodologies, team delivery, and product lifecycle support.",
    templateId: "modern",
    status: "active",
    isDefault: false,
    atsScore: 78,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  }
];

function getStoredResumes(): Resume[] {
  if (typeof window === "undefined") return INITIAL_RESUMES;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESUMES));
    return INITIAL_RESUMES;
  }
  try {
    return JSON.parse(raw);
  } catch {
    return INITIAL_RESUMES;
  }
}

function setStoredResumes(resumes: Resume[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(resumes));
}

export const resumeService = {
  getTemplates: (): ResumeTemplate[] => {
    return MOCK_TEMPLATES;
  },

  getAll: async (): Promise<Resume[]> => {
    return getStoredResumes();
  },

  getOne: async (id: string): Promise<Resume | undefined> => {
    const list = getStoredResumes();
    return list.find((r) => r.id === id);
  },

  create: async (data: Omit<Resume, "id" | "atsScore" | "createdAt" | "updatedAt">): Promise<Resume> => {
    const list = getStoredResumes();
    
    // If setting default, unset other defaults
    if (data.isDefault) {
      list.forEach((r) => { r.isDefault = false; });
    }

    const newResume: Resume = {
      ...data,
      id: `res_${Date.now()}`,
      atsScore: Math.floor(Math.random() * 30) + 65, // Mock ATS score between 65 and 95
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.push(newResume);
    setStoredResumes(list);
    return newResume;
  },

  update: async (id: string, updates: Partial<Omit<Resume, "id" | "createdAt" | "updatedAt">>): Promise<Resume> => {
    const list = getStoredResumes();
    const index = list.findIndex((r) => r.id === id);
    if (index === -1) throw new Error("Resume not found");

    // If default is updated to true, clear other defaults
    if (updates.isDefault) {
      list.forEach((r) => {
        if (r.id !== id) r.isDefault = false;
      });
    }

    const updated = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    list[index] = updated;
    setStoredResumes(list);
    return updated;
  },

  delete: async (id: string): Promise<void> => {
    const list = getStoredResumes();
    const filtered = list.filter((r) => r.id !== id);
    
    // Ensure at least one active resume stays default if we deleted the default one
    if (list.find((r) => r.id === id)?.isDefault && filtered.length > 0) {
      const firstActive = filtered.find((r) => r.status === "active");
      if (firstActive) firstActive.isDefault = true;
    }

    setStoredResumes(filtered);
  },

  duplicate: async (id: string): Promise<Resume> => {
    const list = getStoredResumes();
    const original = list.find((r) => r.id === id);
    if (!original) throw new Error("Resume not found");

    const copy: Resume = {
      ...original,
      id: `res_${Date.now()}`,
      title: `${original.title} (Copy)`,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    list.push(copy);
    setStoredResumes(list);
    return copy;
  },

  archive: async (id: string): Promise<Resume> => {
    const list = getStoredResumes();
    const target = list.find((r) => r.id === id);
    if (!target) throw new Error("Resume not found");

    target.status = "archived";
    target.isDefault = false; // Archived resumes cannot be default
    
    // If it was default, find another active to be default
    const activeResumes = list.filter((r) => r.status === "active" && r.id !== id);
    if (activeResumes.length > 0 && !activeResumes.some((r) => r.isDefault)) {
      activeResumes[0].isDefault = true;
    }

    setStoredResumes(list);
    return target;
  },

  restore: async (id: string): Promise<Resume> => {
    const list = getStoredResumes();
    const target = list.find((r) => r.id === id);
    if (!target) throw new Error("Resume not found");

    target.status = "active";
    
    // If it's the only active one, set default
    const activeCount = list.filter((r) => r.status === "active").length;
    if (activeCount === 1) {
      target.isDefault = true;
    }

    setStoredResumes(list);
    return target;
  }
};
