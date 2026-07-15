import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SearchResult } from "../types/search";

interface SearchStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;
  
  recentSearches: SearchResult[];
  addRecentSearch: (item: SearchResult) => void;
  clearRecentSearches: () => void;

  globalQuery: string;
  setGlobalQuery: (query: string) => void;
}

export const useSearchStore = create<SearchStore>()(
  persist(
    (set) => ({
      isOpen: false,
      setIsOpen: (isOpen) => set({ isOpen }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      
      recentSearches: [],
      addRecentSearch: (item) => set((state) => {
        const filtered = state.recentSearches.filter((s) => s.id !== item.id);
        return {
          recentSearches: [item, ...filtered].slice(0, 10)
        };
      }),
      clearRecentSearches: () => set({ recentSearches: [] }),

      globalQuery: "",
      setGlobalQuery: (query) => set({ globalQuery: query }),
    }),
    {
      name: "ai-career-agent-search-history",
      partialize: (state) => ({ recentSearches: state.recentSearches }),
      version: 2,
      migrate: (persistedState: unknown, version: number) => {
        if (version < 2) {
          // The data structure changed fundamentally (no categories, new properties)
          // We wipe the old cache and start fresh.
          const state = persistedState as Record<string, unknown>;
          return {
            ...state,
            recentSearches: []
          };
        }
        return persistedState as SearchStore;
      },
    }
  )
);
