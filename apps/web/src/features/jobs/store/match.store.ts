"use client";
 
import { create } from "zustand";
import type { Job } from "../types/jobs.types";
import { matchEngineService, type MatchReport } from "../services/match-engine.service";
import type { Skill } from "@/features/profile/types/skill.types";
import type { Education } from "@/features/profile/types/education.types";
import type { CareerPreference } from "@/features/profile/types/career-preference.types";
import type { Profile } from "@/features/profile/types/profile.types";
 
interface MatchState {
  matches: Record<string, MatchReport>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;
  
  calculateMatch: (
    job: Job,
    profileState: {
      skills: Skill[];
      education: Education[];
      preferences: CareerPreference | null;
      profile: Profile | null;
    },
    qualityScore: number,
    force?: boolean
  ) => Promise<void>;
}
 
export const useMatchStore = create<MatchState>((set, get) => ({
  matches: {},
  loading: {},
  errors: {},
 
  calculateMatch: async (job, profileState, qualityScore, force = false) => {
    const id = job.id;
    if (!force && get().matches[id]) return;
 
    set((state) => ({
      loading: { ...state.loading, [id]: true },
      errors: { ...state.errors, [id]: "" }
    }));
 
    try {
      // Simulate evaluation latency (400ms) for high fidelity feedback
      await new Promise((resolve) => setTimeout(resolve, 400));
 
      const yearsOfExp = profileState.profile?.career?.yearsOfExperience || 0;
      
      const report = matchEngineService.calculateOverallMatch(
        profileState.skills,
        profileState.education,
        profileState.preferences,
        yearsOfExp,
        job,
        qualityScore
      );
 
      set((state) => ({
        matches: { ...state.matches, [id]: report },
        loading: { ...state.loading, [id]: false }
      }));
    } catch {
      set((state) => ({
        loading: { ...state.loading, [id]: false },
        errors: { ...state.errors, [id]: "Failed to perform AI match calculations." }
      }));
    }
  }
}));
