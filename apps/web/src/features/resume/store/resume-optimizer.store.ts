"use client";
 
import { create } from "zustand";
import type { Resume } from "../types/resume.types";
import type { OptimizerAnalysis, ResumeVersion, OptimizationHistory } from "../types/optimizer.types";
import { resumeOptimizerService } from "../services/resume-optimizer.service";
 
interface OptimizerState {
  analysis: OptimizerAnalysis | null;
  loading: boolean;
  error: string | null;
  jobDescription: string;
 
  // Advanced features (Sprint 9.2)
  versions: ResumeVersion[];
  activeVersionId: string | null;
  history: OptimizationHistory[];
  activeStudioTab: "comparison" | "bullets" | "readability" | "versions" | "history";
 
  // Actions
  setJobDescription: (jd: string) => void;
  runAnalysis: (resume: Resume) => Promise<void>;
  resetOptimizer: () => void;
  setActiveStudioTab: (tab: "comparison" | "bullets" | "readability" | "versions" | "history") => void;
  switchVersion: (versionId: string) => void;
  createVersion: (name: string, resume: Resume) => Promise<void>;
  clearHistory: () => void;
  exportResume: (format: "pdf" | "docx") => Promise<string>;
}
 
export const useResumeOptimizerStore = create<OptimizerState>((set, get) => ({
  analysis: null,
  loading: false,
  error: null,
  jobDescription: "",
 
  // Advanced defaults
  versions: [
    { id: "v1", name: "Primary Draft", title: "Full Stack Engineer Profile", atsScore: 78, createdAt: "2026-07-08T10:00:00Z" },
    { id: "v2", name: "Frontend Specialized", title: "Frontend Specialist Layout", atsScore: 88, createdAt: "2026-07-09T08:30:00Z" },
    { id: "v3", name: "Backend Tailored", title: "Backend Systems Layout", atsScore: 84, createdAt: "2026-07-09T09:15:00Z" }
  ],
  activeVersionId: "v1",
  history: [
    { id: "h1", date: "2026-07-08 14:30", atsScore: 72, jobTitle: "Junior React Dev at Vercel", version: "Primary Draft" },
    { id: "h2", date: "2026-07-09 09:45", atsScore: 85, jobTitle: "Senior Next.js Dev at Linear", version: "Frontend Specialized" }
  ],
  activeStudioTab: "comparison",
 
  setJobDescription: (jd) => set({ jobDescription: jd }),
 
  runAnalysis: async (resume) => {
    set({ loading: true, error: null });
    
    await new Promise((resolve) => setTimeout(resolve, 600));
 
    try {
      const report = resumeOptimizerService.analyze(resume, get().jobDescription);
      
      // Update score in active version metadata
      const updatedVersions = get().versions.map((v) => 
        v.id === get().activeVersionId ? { ...v, atsScore: report.atsScore } : v
      );
 
      // Append a history log item
      const newHistoryItem: OptimizationHistory = {
        id: `h_${Date.now()}`,
        date: new Date().toISOString().replace("T", " ").substring(0, 16),
        atsScore: report.atsScore,
        jobTitle: get().jobDescription.trim().substring(0, 30) || "Direct Profile Scan",
        version: get().versions.find((v) => v.id === get().activeVersionId)?.name || "Primary Draft"
      };
 
      set({ 
        analysis: report, 
        loading: false,
        versions: updatedVersions,
        history: [newHistoryItem, ...get().history]
      });
    } catch {
      set({ error: "Failed to compile resume analysis", loading: false });
    }
  },
 
  resetOptimizer: () => set({ 
    analysis: null, 
    error: null, 
    jobDescription: "", 
    activeStudioTab: "comparison" 
  }),
 
  setActiveStudioTab: (tab) => set({ activeStudioTab: tab }),
 
  switchVersion: (versionId) => set({ activeVersionId: versionId }),
 
  createVersion: async (name, _resume) => {
    void _resume;
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 400));
    
    const newVer: ResumeVersion = {
      id: `v_${Date.now()}`,
      name,
      title: `${name} Optimize Layout`,
      atsScore: 75,
      createdAt: new Date().toISOString()
    };
 
    set({
      versions: [...get().versions, newVer],
      activeVersionId: newVer.id,
      loading: false
    });
  },
 
  clearHistory: () => set({ history: [] }),
 
  exportResume: async (format) => {
    // Return a mock download URL/file path
    await new Promise((resolve) => setTimeout(resolve, 800));
    return `/downloads/mock_resume_optimized.${format}`;
  }
}));
