"use client";

import { create } from "zustand";
import type { Job } from "../types/jobs.types";
import { mockJobs } from "../mock/jobs-data";
import {
  qualityEngineService,
  type TrustFactorEvaluation,
} from "../services/quality-engine.service";

export interface QualityReport {
  duplicateStatus: "Unique" | "Possible Duplicate" | "Duplicate";
  duplicateReason: string;
  freshnessScore: number;
  freshnessLabel: string;
  freshnessCategory: string;
  trustScore: number;
  trustLabel: "Low" | "Medium" | "High" | "Verified";
  trustFactors: TrustFactorEvaluation[];
  overallScore: number;
  overallLabel: "Excellent" | "Good" | "Average" | "Poor";
}

interface QualityState {
  reports: Record<string, QualityReport>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;

  calculateJobQuality: (
    job: Job,
    allJobs: Job[],
    force?: boolean,
  ) => Promise<void>;
  calculateQuality: (jobId: string) => Promise<void>;
  calculateTrust: (jobId: string) => Promise<void>;
  calculateFreshness: (jobId: string) => Promise<void>;
  detectDuplicates: (jobId: string) => Promise<void>;
  refreshQuality: (jobId: string) => Promise<void>;
}

export const useQualityStore = create<QualityState>((set, get) => ({
  reports: {},
  loading: {},
  errors: {},

  calculateJobQuality: async (job, allJobs, force = false) => {
    const id = job.id;

    // Return early if cached and not forcing recalculation
    if (!force && get().reports[id]) return;

    set((state) => ({
      loading: { ...state.loading, [id]: true },
      errors: { ...state.errors, [id]: "" },
    }));

    try {
      // 800ms simulated delay as requested in Phase 6 requirements
      await new Promise((resolve) => setTimeout(resolve, 800));

      const duplicateRes = qualityEngineService.calculateDuplicate(
        job,
        allJobs,
      );
      const freshnessRes = qualityEngineService.calculateFreshness(job);
      const trustRes = qualityEngineService.calculateTrust(job);
      const overallRes = qualityEngineService.calculateOverallQuality(
        duplicateRes.status,
        freshnessRes.score,
        trustRes.score,
      );

      const report: QualityReport = {
        duplicateStatus: duplicateRes.status,
        duplicateReason: duplicateRes.reason,
        freshnessScore: freshnessRes.score,
        freshnessLabel: freshnessRes.label,
        freshnessCategory: freshnessRes.category,
        trustScore: trustRes.score,
        trustLabel: trustRes.label,
        trustFactors: trustRes.factors,
        overallScore: overallRes.score,
        overallLabel: overallRes.label,
      };

      set((state) => ({
        reports: { ...state.reports, [id]: report },
        loading: { ...state.loading, [id]: false },
      }));
    } catch {
      set((state) => ({
        loading: { ...state.loading, [id]: false },
        errors: {
          ...state.errors,
          [id]: "Failed to perform job quality check.",
        },
      }));
    }
  },

  calculateQuality: async (jobId) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      await get().calculateJobQuality(job, mockJobs);
    }
  },

  calculateTrust: async (jobId) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      await get().calculateJobQuality(job, mockJobs);
    }
  },

  calculateFreshness: async (jobId) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      await get().calculateJobQuality(job, mockJobs);
    }
  },

  detectDuplicates: async (jobId) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      await get().calculateJobQuality(job, mockJobs);
    }
  },

  refreshQuality: async (jobId) => {
    const job = mockJobs.find((j) => j.id === jobId);
    if (job) {
      await get().calculateJobQuality(job, mockJobs, true);
    }
  },
}));
