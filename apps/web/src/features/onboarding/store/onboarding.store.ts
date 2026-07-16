import { create } from "zustand";
import { persist } from "zustand/middleware";

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isWelcomeOpen: boolean;
  isTourActive: boolean;
  currentStep: number;
  completedTasks: string[];
  tipsShown: string[];
  enableProductTips: boolean;

  // Actions
  setHasCompletedOnboarding: (val: boolean) => void;
  setIsWelcomeOpen: (val: boolean) => void;
  setIsTourActive: (val: boolean) => void;
  setCurrentStep: (step: number) => void;
  completeTask: (taskId: string) => void;
  showTip: (tipId: string) => void;
  setEnableProductTips: (val: boolean) => void;
  resetOnboarding: () => void;
  resetTour: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      hasCompletedOnboarding: false,
      isWelcomeOpen: false, // will be controlled by client-side initialization
      isTourActive: false,
      currentStep: 0,
      completedTasks: [],
      tipsShown: [],
      enableProductTips: true,

      setHasCompletedOnboarding: (val) => set({ hasCompletedOnboarding: val }),
      setIsWelcomeOpen: (val) => set({ isWelcomeOpen: val }),
      setIsTourActive: (val) => set({ isTourActive: val }),
      setCurrentStep: (step) => set({ currentStep: step }),
      completeTask: (taskId) => set((state) => {
        if (state.completedTasks.includes(taskId)) return {};
        return { completedTasks: [...state.completedTasks, taskId] };
      }),
      showTip: (tipId) => set((state) => {
        if (state.tipsShown.includes(tipId)) return {};
        return { tipsShown: [...state.tipsShown, tipId] };
      }),
      setEnableProductTips: (val) => set({ enableProductTips: val }),
      resetOnboarding: () => set({
        hasCompletedOnboarding: false,
        isWelcomeOpen: true,
        isTourActive: false,
        currentStep: 0,
        completedTasks: [],
        tipsShown: []
      }),
      resetTour: () => set({
        isTourActive: true,
        currentStep: 0
      })
    }),
    {
      name: "aca-onboarding",
      partialize: (state) => ({
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        completedTasks: state.completedTasks,
        tipsShown: state.tipsShown,
        enableProductTips: state.enableProductTips
      })
    }
  )
);
