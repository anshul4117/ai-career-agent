"use client";

import { create } from "zustand";
import type { Resume } from "../types/resume.types";
import type {
  OptimizerAnalysis,
  ResumeVersion,
  OptimizationHistory,
} from "../types/optimizer.types";
import { resumeOptimizerService } from "../services/resume-optimizer.service";
import { toast } from "sonner";

interface OptimizerState {
  analysis: OptimizerAnalysis | null;
  loading: boolean;
  error: string | null;
  jobDescription: string;

  // Advanced features (Sprint 9.2)
  versions: ResumeVersion[];
  activeVersionId: string | null;
  history: OptimizationHistory[];
  activeStudioTab:
    "comparison" | "bullets" | "readability" | "versions" | "history";

  // Actions
  setJobDescription: (jd: string) => void;
  runAnalysis: (resume: Resume) => Promise<void>;
  resetOptimizer: () => void;
  setActiveStudioTab: (
    tab: "comparison" | "bullets" | "readability" | "versions" | "history",
  ) => void;
  switchVersion: (versionId: string) => void;
  createVersion: (name: string, resume: Resume) => Promise<void>;
  clearHistory: () => void;
  exportResume: (format: "pdf" | "docx") => Promise<string>;

  // Newly requested actions for Phase 9
  analyzeResume: (resumeId: string, jobDescription: string) => Promise<void>;
  optimizeResume: (resumeId: string, jobDescription: string) => Promise<void>;
  rewriteSection: (
    resumeId: string,
    sectionKey: string,
    jobDescription: string,
  ) => Promise<string>;
  saveOptimizedVersion: (name: string) => Promise<void>;
  getOptimizationHistory: () => Promise<OptimizationHistory[]>;
}

const fallbackResume: Resume = {
  id: "res_001",
  title: "anshul-kumar-resume-v2.pdf",
  description: "Primary Resume Document",
  templateId: "default",
  status: "active",
  isDefault: true,
  atsScore: 82,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  content: {
    personal: {
      firstName: "Anshul",
      lastName: "Kumar",
      headline: "Senior Frontend Engineer",
      email: "anshul.k@gmail.com",
      phone: "+1 (555) 019-2834",
      city: "San Francisco",
      country: "USA",
    },
    summary: {
      summary:
        "Experienced Senior Frontend Engineer with 8+ years of expertise in React, Next.js, TypeScript, and high-performance Web App development.",
    },
    experience: [
      {
        id: "exp_1",
        companyName: "TechCorp Inc.",
        jobTitle: "Lead Frontend Architect",
        location: "San Francisco, CA",
        startDate: "2022-03",
        endDate: "Present",
        currentPosition: true,
        description:
          "Led development of a high-traffic React dashboard. Optimized performance, reducing page load speed by 35%.",
      },
    ],
    education: [
      {
        id: "edu_1",
        institution: "Stanford University",
        degree: "Master of Science",
        fieldOfStudy: "Computer Science",
        startDate: "2018-09",
        endDate: "2020-06",
        currentStudy: false,
        cgpa: "3.8",
      },
    ],
    skills: [
      { id: "sk_1", name: "React", yearsOfExperience: "8", level: "expert" },
      { id: "sk_2", name: "Next.js", yearsOfExperience: "6", level: "expert" },
      {
        id: "sk_3",
        name: "TypeScript",
        yearsOfExperience: "7",
        level: "expert",
      },
      {
        id: "sk_4",
        name: "Tailwind CSS",
        yearsOfExperience: "5",
        level: "expert",
      },
    ],
    projects: [
      {
        id: "proj_1",
        title: "AI Career Copilot Dashboard",
        role: "Creator",
        description:
          "Built an interactive brutalist portal to track job applications and optimize resumes using Zustand and Framer Motion.",
        techStack: ["Next.js", "Zustand", "Framer Motion", "Tailwind"],
      },
    ],
    certifications: [
      {
        id: "cert_1",
        name: "AWS Certified Solutions Architect",
        issuingOrganization: "Amazon Web Services",
        issueDate: "2024-05",
      },
    ],
    languages: [],
    socialLinks: [],
  },
};

const initialHistory: OptimizationHistory[] = [
  {
    id: "h1",
    date: "2026-07-08 14:30",
    atsScore: 72,
    jobTitle: "Junior React Dev at Vercel",
    version: "Primary Draft",
  },
  {
    id: "h2",
    date: "2026-07-09 09:45",
    atsScore: 85,
    jobTitle: "Senior Next.js Dev at Linear",
    version: "Frontend Specialized",
  },
];

export const useResumeOptimizerStore = create<OptimizerState>((set, get) => ({
  analysis: null,
  loading: false,
  error: null,
  jobDescription: "",

  // Advanced defaults
  versions: [
    {
      id: "v1",
      name: "Primary Draft",
      title: "Full Stack Engineer Profile",
      atsScore: 78,
      createdAt: "2026-07-08T10:00:00Z",
    },
    {
      id: "v2",
      name: "Frontend Specialized",
      title: "Frontend Specialist Layout",
      atsScore: 88,
      createdAt: "2026-07-09T08:30:00Z",
    },
    {
      id: "v3",
      name: "Backend Tailored",
      title: "Backend Systems Layout",
      atsScore: 84,
      createdAt: "2026-07-09T09:15:00Z",
    },
  ],
  activeVersionId: "v1",
  history: initialHistory,
  activeStudioTab: "comparison",

  setJobDescription: (jd) => set({ jobDescription: jd }),

  runAnalysis: async (resume) => {
    set({ loading: true, error: null });
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const report = resumeOptimizerService.analyze(
        resume,
        get().jobDescription,
      );

      const updatedVersions = get().versions.map((v) =>
        v.id === get().activeVersionId
          ? { ...v, atsScore: report.atsScore }
          : v,
      );

      const newHistoryItem: OptimizationHistory = {
        id: `h_${Date.now()}`,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        atsScore: report.atsScore,
        jobTitle:
          get().jobDescription.trim().substring(0, 30) || "Direct Profile Scan",
        version:
          get().versions.find((v) => v.id === get().activeVersionId)?.name ||
          "Primary Draft",
      };

      set({
        analysis: report,
        loading: false,
        versions: updatedVersions,
        history: [newHistoryItem, ...get().history],
      });
    } catch {
      set({ error: "Failed to compile resume analysis", loading: false });
    }
  },

  resetOptimizer: () =>
    set({
      analysis: null,
      error: null,
      jobDescription: "",
      activeStudioTab: "comparison",
    }),

  setActiveStudioTab: (tab) => set({ activeStudioTab: tab }),

  switchVersion: (versionId) => set({ activeVersionId: versionId }),

  createVersion: async (name, _resume) => {
    void _resume;
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newVer: ResumeVersion = {
      id: `v_${Date.now()}`,
      name,
      title: `${name} Optimize Layout`,
      atsScore: 75,
      createdAt: new Date().toISOString(),
    };

    set({
      versions: [...get().versions, newVer],
      activeVersionId: newVer.id,
      loading: false,
    });
  },

  clearHistory: () => set({ history: [] }),

  exportResume: async (format) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    toast.success(
      `Successfully formatted and exported document to ${format.toUpperCase()}`,
    );
    return `/downloads/mock_resume_optimized.${format}`;
  },

  // 18. Zustand Store: Mock async actions implementation
  analyzeResume: async (_resumeId, jobDescription) => {
    void _resumeId;
    set({ loading: true, error: null, jobDescription });
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const report = resumeOptimizerService.analyze(
        fallbackResume,
        jobDescription,
      );
      set({
        analysis: report,
        loading: false,
      });
      toast.success("Resume ATS check audit complete!");
    } catch {
      set({ error: "AI Analysis Failed to evaluate resume", loading: false });
      toast.error("AI Analysis Failed.");
    }
  },

  optimizeResume: async (_resumeId, jobDescription) => {
    void _resumeId;
    set({ loading: true, error: null, jobDescription });
    await new Promise((resolve) => setTimeout(resolve, 800));

    try {
      const report = resumeOptimizerService.analyze(
        fallbackResume,
        jobDescription,
      );

      // Simulate optimizations by increasing score bounds
      const optimizedReport: OptimizerAnalysis = {
        ...report,
        atsScore: Math.min(100, report.atsScore + 15),
        qualityScore: Math.min(100, report.qualityScore + 12),
        keywordScore: Math.min(100, report.keywordScore + 18),
        readabilityScore: Math.min(100, report.readabilityScore + 10),
        suggestions: {
          high: [],
          medium: report.suggestions.medium.slice(1),
          low: report.suggestions.low,
        },
      };

      set({
        analysis: optimizedReport,
        loading: false,
      });
      toast.success("AI resume tailoring applied successfully!");
    } catch {
      set({ error: "Failed to run optimization tailoring", loading: false });
      toast.error("Tailoring failed.");
    }
  },

  rewriteSection: async (_resumeId, sectionKey, _jobDescription) => {
    void _resumeId;
    void _jobDescription;
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    toast.success(`AI rewritten suggestions generated for ${sectionKey}`);

    if (sectionKey === "summary") {
      return "Engineered robust UI platform elements and optimized layout rendering, saving 35% page latency overhead.";
    }
    return "Optimized Next.js dynamic routing structures to handle 20k+ concurrent sessions, elevating page load speeds by 25%.";
  },

  saveOptimizedVersion: async (name) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newVer: ResumeVersion = {
      id: `v_${Date.now()}`,
      name,
      title: `${name} Tailored Profile`,
      atsScore: Math.min(100, (get().analysis?.atsScore || 78) + 3),
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      versions: [newVer, ...state.versions],
      activeVersionId: newVer.id,
      loading: false,
    }));
    toast.success(`Version '${name}' persisted successfully to history.`);
  },

  getOptimizationHistory: async () => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    return get().history;
  },
}));
