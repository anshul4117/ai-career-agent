"use client";

import { create } from "zustand";
import type { 
  Resume, ResumeContent, ResumePersonal, ResumeSummary, CustomSection, CustomSectionItem
} from "../types/resume.types";
import { builderService } from "../services/builder.service";

interface HistoryEntry {
  content: ResumeContent;
  templateId: string;
}

interface BuilderState {
  currentResume: Resume | null;
  activeSection: string;
  savingState: "idle" | "saving" | "saved";
  unsavedChanges: boolean;
  lastSaved: Date | null;
  isLoading: boolean;
  error: string | null;
  
  // History Undo/Redo Stacks
  past: HistoryEntry[];
  future: HistoryEntry[];

  loadResume: (id: string) => Promise<Resume | null>;
  setActiveSection: (sectionId: string) => void;
  updatePersonal: (personal: ResumePersonal) => void;
  updateSummary: (summary: ResumeSummary) => void;
  
  addListSectionItem: (
    sectionId: "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "socialLinks",
    item: Record<string, unknown>
  ) => void;
  updateListSectionItem: (
    sectionId: "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "socialLinks",
    itemId: string,
    item: Record<string, unknown>
  ) => void;
  deleteListSectionItem: (
    sectionId: "experience" | "education" | "skills" | "projects" | "certifications" | "languages" | "socialLinks",
    itemId: string
  ) => void;
  
  updateTemplate: (templateId: string) => void;
  updateMetadata: (title: string, description: string, isDefault: boolean, status: "active" | "archived") => void;
  forceSave: () => Promise<void>;
  resetStore: () => void;

  // History operations (Sprint 3.3)
  commitHistory: () => void;
  undo: () => void;
  redo: () => void;

  // Drag & Drop operations
  reorderSections: (newOrder: string[]) => void;
  reorderSectionItems: (sectionId: string, newItems: unknown[]) => void;
  moveSection: (sectionId: string, direction: "up" | "down") => void;
  moveItem: (sectionId: string, itemId: string, direction: "up" | "down") => void;
  toggleSectionVisibility: (sectionId: string) => void;
  duplicateSectionItem: (sectionId: string, itemId: string) => void;

  // Custom sections operations
  addCustomSection: (title: string) => void;
  deleteCustomSection: (sectionId: string) => void;
  updateCustomSectionTitle: (sectionId: string, title: string) => void;
  addCustomSectionItem: (sectionId: string, item: Omit<CustomSectionItem, "id">) => void;
  updateCustomSectionItem: (sectionId: string, itemId: string, updatedItem: Partial<Omit<CustomSectionItem, "id">>) => void;
  deleteCustomSectionItem: (sectionId: string, itemId: string) => void;
}

let saveTimeoutId: ReturnType<typeof setTimeout> | null = null;

const triggerAutoSave = (
  get: () => { currentResume: Resume | null },
  set: (state: Partial<BuilderState> | ((state: BuilderState) => Partial<BuilderState>)) => void
) => {
  set({ unsavedChanges: true, savingState: "idle" });

  if (saveTimeoutId) {
    clearTimeout(saveTimeoutId);
  }

  saveTimeoutId = setTimeout(async () => {
    const resume = get().currentResume;
    if (!resume) return;

    set({ savingState: "saving" });
    try {
      await builderService.saveResume(resume);
      set({ 
        savingState: "saved", 
        unsavedChanges: false, 
        lastSaved: new Date() 
      });
    } catch (err) {
      set({ 
        savingState: "idle", 
        error: (err as Error).message || "Auto-save failed" 
      });
    }
  }, 1000);
};

export const useBuilderStore = create<BuilderState>((set, get) => ({
  currentResume: null,
  activeSection: "personal",
  savingState: "saved",
  unsavedChanges: false,
  lastSaved: null,
  isLoading: false,
  error: null,
  past: [],
  future: [],

  commitHistory: () => {
    const { currentResume } = get();
    if (!currentResume || !currentResume.content) return;
    const snapshot: HistoryEntry = {
      content: JSON.parse(JSON.stringify(currentResume.content)),
      templateId: currentResume.templateId,
    };
    const lastPast = get().past[get().past.length - 1];
    if (lastPast && JSON.stringify(lastPast) === JSON.stringify(snapshot)) {
      return;
    }
    set((state) => ({
      past: [...state.past, snapshot].slice(-50),
      future: [],
    }));
  },

  undo: () => {
    const { past, currentResume } = get();
    if (past.length === 0 || !currentResume || !currentResume.content) return;

    const previous = past[past.length - 1];
    const newPast = past.slice(0, -1);
    const snapshot: HistoryEntry = {
      content: JSON.parse(JSON.stringify(currentResume.content)),
      templateId: currentResume.templateId,
    };

    set({
      past: newPast,
      future: [...get().future, snapshot],
      currentResume: {
        ...currentResume,
        content: previous.content,
        templateId: previous.templateId,
      },
      unsavedChanges: true,
      savingState: "idle",
    });

    triggerAutoSave(get, set);
  },

  redo: () => {
    const { future, currentResume } = get();
    if (future.length === 0 || !currentResume || !currentResume.content) return;

    const nextState = future[future.length - 1];
    const newFuture = future.slice(0, -1);
    const snapshot: HistoryEntry = {
      content: JSON.parse(JSON.stringify(currentResume.content)),
      templateId: currentResume.templateId,
    };

    set({
      past: [...get().past, snapshot],
      future: newFuture,
      currentResume: {
        ...currentResume,
        content: nextState.content,
        templateId: nextState.templateId,
      },
      unsavedChanges: true,
      savingState: "idle",
    });

    triggerAutoSave(get, set);
  },

  loadResume: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      const resume = await builderService.loadResume(id);
      if (resume && resume.content) {
        if (!resume.content.sectionsOrder) {
          resume.content.sectionsOrder = ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"];
        }
        if (!resume.content.hiddenSections) {
          resume.content.hiddenSections = [];
        }
        if (!resume.content.customSections) {
          resume.content.customSections = [];
        }
      }
      set({ 
        currentResume: resume, 
        isLoading: false, 
        lastSaved: new Date(resume.updatedAt),
        past: [],
        future: []
      });
      return resume;
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
      return null;
    }
  },

  setActiveSection: (sectionId) => {
    set({ activeSection: sectionId });
  },

  updatePersonal: (personal) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            personal,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateSummary: (summary) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            summary,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  addListSectionItem: (sectionId, item) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const list = state.currentResume.content[sectionId] || [];
      const newItem = {
        ...item,
        id: item.id || `${sectionId.substring(0, 3)}_${Date.now()}`,
      };
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: [...list, newItem],
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateListSectionItem: (sectionId, itemId, updatedItem) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const list = state.currentResume.content[sectionId] || [];
      const updatedList = (list as Array<{ id: string }>).map((item) => 
        item.id === itemId ? { ...item, ...updatedItem } : item
      );
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: updatedList,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  deleteListSectionItem: (sectionId, itemId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const list = state.currentResume.content[sectionId] || [];
      const updatedList = (list as Array<{ id: string }>).filter((item) => item.id !== itemId);
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: updatedList,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateTemplate: (templateId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume) return {};
      return {
        currentResume: {
          ...state.currentResume,
          templateId,
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateMetadata: (title, description, isDefault, status) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume) return {};
      return {
        currentResume: {
          ...state.currentResume,
          title,
          description,
          isDefault,
          status,
        },
      };
    });
    triggerAutoSave(get, set);
  },

  forceSave: async () => {
    const resume = get().currentResume;
    if (!resume) return;

    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }

    set({ savingState: "saving" });
    try {
      await builderService.saveResume(resume);
      set({ 
        savingState: "saved", 
        unsavedChanges: false, 
        lastSaved: new Date() 
      });
    } catch (err) {
      set({ 
        savingState: "idle", 
        error: (err as Error).message || "Save failed" 
      });
    }
  },

  resetStore: () => {
    if (saveTimeoutId) {
      clearTimeout(saveTimeoutId);
    }
    set({
      currentResume: null,
      activeSection: "personal",
      savingState: "saved",
      unsavedChanges: false,
      lastSaved: null,
      isLoading: false,
      error: null,
      past: [],
      future: [],
    });
  },

  // Drag & Drop operations (Sprint 3.3)
  reorderSections: (newOrder) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            sectionsOrder: newOrder,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  reorderSectionItems: (sectionId, newItems) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};

      if (sectionId.startsWith("custom_")) {
        const customs = state.currentResume.content.customSections || [];
        const updatedCustoms = customs.map((sec) => 
          sec.id === sectionId ? { ...sec, items: newItems as CustomSectionItem[] } : sec
        );
        return {
          currentResume: {
            ...state.currentResume,
            content: {
              ...state.currentResume.content,
              customSections: updatedCustoms,
            },
          },
        };
      }

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: newItems as unknown as ResumeContent[keyof ResumeContent],
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  moveSection: (sectionId, direction) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const order = state.currentResume.content.sectionsOrder || ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"];
      const index = order.indexOf(sectionId);
      if (index === -1) return {};

      const newOrder = [...order];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return {};

      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = sectionId;

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            sectionsOrder: newOrder,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  moveItem: (sectionId, itemId, direction) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};

      if (sectionId.startsWith("custom_")) {
        const customs = state.currentResume.content.customSections || [];
        const secIndex = customs.findIndex((c) => c.id === sectionId);
        if (secIndex === -1) return {};

        const section = customs[secIndex];
        const items = [...section.items];
        const index = items.findIndex((i) => i.id === itemId);
        if (index === -1) return {};

        const targetIndex = direction === "up" ? index - 1 : index + 1;
        if (targetIndex < 0 || targetIndex >= items.length) return {};

        const temp = items[index];
        items[index] = items[targetIndex];
        items[targetIndex] = temp;

        const newCustoms = [...customs];
        newCustoms[secIndex] = { ...section, items };

        return {
          currentResume: {
            ...state.currentResume,
            content: {
              ...state.currentResume.content,
              customSections: newCustoms,
            },
          },
        };
      }

      const list = state.currentResume.content[sectionId as keyof ResumeContent];
      if (!Array.isArray(list)) return {};

      const items = [...list] as unknown as Array<{ id: string }>;
      const index = items.findIndex((i) => i.id === itemId);
      if (index === -1) return {};

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return {};

      const temp = items[index];
      items[index] = items[targetIndex];
      items[targetIndex] = temp;

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: items as unknown as ResumeContent[keyof ResumeContent],
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  toggleSectionVisibility: (sectionId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const hidden = state.currentResume.content.hiddenSections || [];
      const newHidden = hidden.includes(sectionId)
        ? hidden.filter((id) => id !== sectionId)
        : [...hidden, sectionId];
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            hiddenSections: newHidden,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  duplicateSectionItem: (sectionId, itemId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};

      if (sectionId.startsWith("custom_")) {
        const customs = state.currentResume.content.customSections || [];
        const secIndex = customs.findIndex((c) => c.id === sectionId);
        if (secIndex === -1) return {};

        const section = customs[secIndex];
        const items = [...section.items];
        const index = items.findIndex((i) => i.id === itemId);
        if (index === -1) return {};

        const clone = {
          ...items[index],
          id: `${itemId}_dup_${Date.now()}`,
        };
        items.splice(index + 1, 0, clone);

        const newCustoms = [...customs];
        newCustoms[secIndex] = { ...section, items };

        return {
          currentResume: {
            ...state.currentResume,
            content: {
              ...state.currentResume.content,
              customSections: newCustoms,
            },
          },
        };
      }

      const list = state.currentResume.content[sectionId as keyof ResumeContent];
      if (!Array.isArray(list)) return {};

      const items = [...list] as unknown as Array<{ id: string } & Record<string, unknown>>;
      const index = items.findIndex((i) => i.id === itemId);
      if (index === -1) return {};

      const clone = {
        ...items[index],
        id: `${itemId}_dup_${Date.now()}`,
      };
      items.splice(index + 1, 0, clone);

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            [sectionId]: items as unknown as ResumeContent[keyof ResumeContent],
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  // Custom sections operations
  addCustomSection: (title) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const newId = `custom_${Date.now()}`;
      const newSection: CustomSection = {
        id: newId,
        title,
        items: [],
      };
      const order = state.currentResume.content.sectionsOrder || [];
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: [...customs, newSection],
            sectionsOrder: [...order, newId],
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  deleteCustomSection: (sectionId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const order = state.currentResume.content.sectionsOrder || [];
      const hidden = state.currentResume.content.hiddenSections || [];

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: customs.filter((c) => c.id !== sectionId),
            sectionsOrder: order.filter((id) => id !== sectionId),
            hiddenSections: hidden.filter((id) => id !== sectionId),
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateCustomSectionTitle: (sectionId, title) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const updatedCustoms = customs.map((sec) => 
        sec.id === sectionId ? { ...sec, title } : sec
      );
      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: updatedCustoms,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  addCustomSectionItem: (sectionId, item) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const secIndex = customs.findIndex((c) => c.id === sectionId);
      if (secIndex === -1) return {};

      const section = customs[secIndex];
      const newItem: CustomSectionItem = {
        ...item,
        id: `item_${Date.now()}`,
      };

      const newCustoms = [...customs];
      newCustoms[secIndex] = {
        ...section,
        items: [...section.items, newItem],
      };

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: newCustoms,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  updateCustomSectionItem: (sectionId, itemId, updatedItem) => {
    if (!get().unsavedChanges) {
      get().commitHistory();
    }
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const secIndex = customs.findIndex((c) => c.id === sectionId);
      if (secIndex === -1) return {};

      const section = customs[secIndex];
      const updatedItems = section.items.map((i) => 
        i.id === itemId ? { ...i, ...updatedItem } : i
      );

      const newCustoms = [...customs];
      newCustoms[secIndex] = {
        ...section,
        items: updatedItems,
      };

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: newCustoms,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },

  deleteCustomSectionItem: (sectionId, itemId) => {
    get().commitHistory();
    set((state) => {
      if (!state.currentResume || !state.currentResume.content) return {};
      const customs = state.currentResume.content.customSections || [];
      const secIndex = customs.findIndex((c) => c.id === sectionId);
      if (secIndex === -1) return {};

      const section = customs[secIndex];
      const filteredItems = section.items.filter((i) => i.id !== itemId);

      const newCustoms = [...customs];
      newCustoms[secIndex] = {
        ...section,
        items: filteredItems,
      };

      return {
        currentResume: {
          ...state.currentResume,
          content: {
            ...state.currentResume.content,
            customSections: newCustoms,
          },
        },
      };
    });
    triggerAutoSave(get, set);
  },
}));
