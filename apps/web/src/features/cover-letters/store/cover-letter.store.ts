"use client";

import { create } from "zustand";
import type { Resume } from "../../resume/types/resume.types";
import type {
  CoverLetterDraft,
  CoverLetterTemplate,
  CoverLetterTone,
  CoverLetterVersion,
} from "../types/cover-letter.types";
import { coverLetterService } from "../services/cover-letter.service";
import { toast } from "sonner";

interface CoverLetterState {
  drafts: CoverLetterDraft[];
  activeDraft: CoverLetterDraft | null;
  loading: boolean;
  previewMode: boolean;
  activeView: "dashboard" | "wizard";

  // Undo/Redo stack for text editor
  undoStack: string[];
  redoStack: string[];

  // Actions
  loadDrafts: () => void;
  setActiveDraft: (draft: CoverLetterDraft | null) => void;
  updateDraftContent: (content: string) => void;
  undo: () => void;
  redo: () => void;
  saveDraft: (draft: Partial<CoverLetterDraft>) => void;
  deleteDraft: (id: string) => void;
  duplicateDraft: (id: string) => void;
  togglePreviewMode: () => void;
  setActiveView: (view: "dashboard" | "wizard") => void;
  generateCoverLetter: (
    title: string,
    jobTitle: string,
    company: string,
    jobDescription: string,
    template: CoverLetterTemplate,
    tone: CoverLetterTone,
    resume: Resume | null,
  ) => Promise<void>;
  createVersion: (template: CoverLetterTemplate, tone: CoverLetterTone) => void;
  restoreVersion: (versionId: string) => void;

  // 17. Zustand Store: Newly requested Phase 10 Async actions
  generateLetter: (
    title: string,
    jobTitle: string,
    company: string,
    jobDescription: string,
    template: CoverLetterTemplate,
    tone: CoverLetterTone,
    resume: Resume | null,
  ) => Promise<void>;
  regenerateSection: (
    sectionKey: string,
    tone: CoverLetterTone,
    jobTitle: string,
    company: string,
  ) => Promise<string>;
  updateDraft: (
    id: string,
    updates: Partial<CoverLetterDraft>,
  ) => Promise<void>;
  exportPDF: (id: string) => Promise<string>;
  exportDOCX: (id: string) => Promise<string>;
  copyLetter: (id: string) => Promise<void>;
}

export const useCoverLetterStore = create<CoverLetterState>((set, get) => ({
  drafts: [],
  activeDraft: null,
  loading: false,
  previewMode: false,
  activeView: "dashboard",

  undoStack: [],
  redoStack: [],

  loadDrafts: () => {
    const list = coverLetterService.getAll();
    set({ drafts: list });
  },

  setActiveDraft: (draft) => {
    set({
      activeDraft: draft,
      undoStack: draft ? [draft.content] : [],
      redoStack: [],
      previewMode: false,
    });
  },

  updateDraftContent: (newContent) => {
    const active = get().activeDraft;
    if (!active) return;

    const currentUndo = get().undoStack;
    const lastItem = currentUndo[currentUndo.length - 1];

    if (lastItem !== newContent) {
      set({
        undoStack: [...currentUndo, newContent],
        redoStack: [],
        activeDraft: { ...active, content: newContent },
      });
    }
  },

  undo: () => {
    const active = get().activeDraft;
    const undoStack = get().undoStack;
    if (!active || undoStack.length <= 1) return;

    const currentContent = undoStack[undoStack.length - 1];
    const prevContent = undoStack[undoStack.length - 2];
    const newUndo = undoStack.slice(0, -1);

    set({
      undoStack: newUndo,
      redoStack: [...get().redoStack, currentContent],
      activeDraft: { ...active, content: prevContent },
    });
  },

  redo: () => {
    const active = get().activeDraft;
    const redoStack = get().redoStack;
    if (!active || redoStack.length === 0) return;

    const nextContent = redoStack[redoStack.length - 1];
    const newRedo = redoStack.slice(0, -1);

    set({
      undoStack: [...get().undoStack, nextContent],
      redoStack: newRedo,
      activeDraft: { ...active, content: nextContent },
    });
  },

  saveDraft: (updates) => {
    const active = get().activeDraft;
    if (!active) return;

    const updatedDraft: CoverLetterDraft = {
      ...active,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const updatedList = get().drafts.map((d) =>
      d.id === active.id ? updatedDraft : d,
    );

    const exists = get().drafts.some((d) => d.id === active.id);
    const finalList = exists ? updatedList : [updatedDraft, ...get().drafts];

    coverLetterService.saveAll(finalList);
    set({
      drafts: finalList,
      activeDraft: updatedDraft,
    });
  },

  deleteDraft: (id) => {
    const filtered = get().drafts.filter((d) => d.id !== id);
    coverLetterService.saveAll(filtered);

    set((state) => ({
      drafts: filtered,
      activeDraft: state.activeDraft?.id === id ? null : state.activeDraft,
    }));
  },

  duplicateDraft: (id) => {
    const target = get().drafts.find((d) => d.id === id);
    if (!target) return;

    const copy: CoverLetterDraft = {
      ...target,
      id: `cl_${Date.now()}`,
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newList = [copy, ...get().drafts];
    coverLetterService.saveAll(newList);
    set({ drafts: newList });
  },

  togglePreviewMode: () =>
    set((state) => ({ previewMode: !state.previewMode })),

  setActiveView: (view) => set({ activeView: view }),

  generateCoverLetter: async (
    title,
    jobTitle,
    company,
    jobDescription,
    template,
    tone,
    resume,
  ) => {
    set({ loading: true });

    await new Promise((resolve) => setTimeout(resolve, 800));

    const content = coverLetterService.generate(
      resume,
      jobTitle,
      company,
      jobDescription,
      template,
      tone,
    );

    const newDraft: CoverLetterDraft = {
      id: `cl_${Date.now()}`,
      title,
      jobTitle,
      company,
      jobDescription,
      template,
      tone,
      content,
      resumeId: resume?.id,
      versions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newList = [newDraft, ...get().drafts];
    coverLetterService.saveAll(newList);

    set({
      drafts: newList,
      activeDraft: newDraft,
      undoStack: [content],
      redoStack: [],
      loading: false,
      activeView: "wizard",
    });
  },

  createVersion: (template, tone) => {
    const active = get().activeDraft;
    if (!active) return;

    const newVersion: CoverLetterVersion = {
      id: `ver_${Date.now()}`,
      template,
      tone,
      jobTitle: active.jobTitle,
      company: active.company,
      content: active.content,
      createdAt: new Date().toISOString(),
    };

    const updatedVersions = [newVersion, ...(active.versions || [])];
    get().saveDraft({ versions: updatedVersions });
  },

  restoreVersion: (versionId) => {
    const active = get().activeDraft;
    if (!active) return;

    const version = active.versions.find((v) => v.id === versionId);
    if (!version) return;

    const currentUndo = get().undoStack;
    set({
      undoStack: [...currentUndo, version.content],
      redoStack: [],
      activeDraft: {
        ...active,
        content: version.content,
        template: version.template,
        tone: version.tone,
      },
    });
  },

  // 17. Zustand Store: Newly requested Phase 10 Async actions implementation
  generateLetter: async (
    title,
    jobTitle,
    company,
    jobDescription,
    template,
    tone,
    resume,
  ) => {
    await get().generateCoverLetter(
      title,
      jobTitle,
      company,
      jobDescription,
      template,
      tone,
      resume,
    );
    toast.success("AI Cover Letter generated successfully!");
  },

  regenerateSection: async (sectionKey, tone, jobTitle, company) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    toast.success(`Regenerated ${sectionKey} section in a ${tone} tone!`);

    if (sectionKey === "introduction") {
      return `Dear Hiring Team at ${company || "Target Company"},\n\nI am thrilled to express my enthusiastic interest in the ${jobTitle || "Software Engineer"} position. With a strong foundation in modern frontend architecture and a passion for crafting highly intuitive UI frameworks, I am excited about the opportunity to contribute to your engineering milestones.`;
    }
    if (sectionKey === "experience") {
      return `Over the past five years, I have engineered high-performance frontend components, driving React rendering speed improvements of over 35%. I am confident that my technical execution aligns directly with the values at ${company || "Target Company"}.`;
    }
    if (sectionKey === "skills") {
      return `My core skillset includes Expert-level React, Next.js, and TypeScript, combined with robust state management paradigms like Zustand and Redux, allowing me to build robust applications with strict focus on semantic HTML and accessibility guidelines.`;
    }
    return `Thank you for your time and consideration of my application. I look forward to discussing how my experience can support your goals at ${company || "Target Company"}.\n\nSincerely,\nAnshul Kumar`;
  },

  updateDraft: async (id, updates) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    const updatedList = get().drafts.map((d) =>
      d.id === id
        ? { ...d, ...updates, updatedAt: new Date().toISOString() }
        : d,
    );

    coverLetterService.saveAll(updatedList);
    const active = get().activeDraft;
    set({
      drafts: updatedList,
      activeDraft:
        active && active.id === id ? { ...active, ...updates } : active,
      loading: false,
    });
    toast.success("Draft updated successfully.");
  },

  exportPDF: async (id) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    toast.success("Cover letter PDF export transfer initiated!");
    return `/downloads/mock_cover_letter_${id}.pdf`;
  },

  exportDOCX: async (id) => {
    set({ loading: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ loading: false });
    toast.success("Cover letter DOCX export transfer initiated!");
    return `/downloads/mock_cover_letter_${id}.docx`;
  },

  copyLetter: async (id) => {
    const draft = get().drafts.find((d) => d.id === id) || get().activeDraft;
    if (draft) {
      await navigator.clipboard.writeText(draft.content);
      toast.success("Cover letter content copied to clipboard!");
    }
  },
}));
