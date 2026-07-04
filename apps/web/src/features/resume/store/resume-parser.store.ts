"use client";

import { create } from "zustand";
import type { ExtractedData, SectionConfidence, ReviewState, ReviewAction } from "../types/parser.types";

interface ParserStoreState {
  uploadedFile: File | null;
  processingState: "idle" | "uploading" | "extracting" | "parsing" | "completed" | "error";
  progress: number;
  parsedData: ExtractedData | null;
  confidenceScores: SectionConfidence | null;
  reviewState: ReviewState | null;
  error: string | null;

  // Actions
  setUploadedFile: (file: File | null) => void;
  setProcessingState: (state: "idle" | "uploading" | "extracting" | "parsing" | "completed" | "error") => void;
  setProgress: (p: number) => void;
  setError: (err: string | null) => void;
  initReviewState: (data: ExtractedData) => void;
  updateReviewAction: (section: keyof ReviewState, action: ReviewAction) => void;
  updateReviewValue: (
    section: "personal" | "summary", 
    value: { firstName?: string; lastName?: string; headline?: string; email?: string; phone?: string; city?: string; country?: string; summary?: string }
  ) => void;
  resetParserStore: () => void;
}

const INITIAL_STATE = {
  uploadedFile: null,
  processingState: "idle" as const,
  progress: 0,
  parsedData: null,
  confidenceScores: null,
  reviewState: null,
  error: null,
};

export const useParserStore = create<ParserStoreState>((set) => ({
  ...INITIAL_STATE,

  setUploadedFile: (file) => set({ uploadedFile: file }),
  
  setProcessingState: (state) => set({ processingState: state }),
  
  setProgress: (p) => set({ progress: p }),
  
  setError: (err) => set({ error: err, processingState: err ? "error" : "idle" }),

  initReviewState: (data) => {
    const review: ReviewState = {
      personal: { action: "accept", value: { ...data.personal } },
      summary: { action: "accept", value: { ...data.summary } },
      skills: { action: "accept", value: [...data.skills] },
      experience: { action: "accept", value: [...data.experience] },
      education: { action: "accept", value: [...data.education] },
      projects: { action: "accept", value: [...data.projects] },
      certifications: { action: "accept", value: [...data.certifications] },
      languages: { action: "accept", value: [...data.languages] },
      socialLinks: { action: "accept", value: [...data.socialLinks] },
    };
    set({ reviewState: review, parsedData: data });
  },

  updateReviewAction: (section, action) => {
    set((state) => {
      if (!state.reviewState) return {};
      return {
        reviewState: {
          ...state.reviewState,
          [section]: {
            ...state.reviewState[section],
            action
          }
        }
      };
    });
  },

  updateReviewValue: (section, value) => {
    set((state) => {
      if (!state.reviewState) return {};
      return {
        reviewState: {
          ...state.reviewState,
          [section]: {
            ...state.reviewState[section],
            value
          }
        }
      };
    });
  },

  resetParserStore: () => set(INITIAL_STATE)
}));
