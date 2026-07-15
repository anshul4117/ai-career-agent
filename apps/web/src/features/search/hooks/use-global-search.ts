import { useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { SearchResult } from "../types/search";
import { useJobsStore } from "@/features/jobs/store/jobs.store";
import { useSearchStore } from "../store/search.store";
import { 
  Briefcase
} from "lucide-react";
import type { Job } from "@/features/jobs/types/jobs.types";

export function useGlobalSearch() {
  const router = useRouter();
  const query = useSearchStore(state => state.globalQuery);
  const setQuery = useSearchStore(state => state.setGlobalQuery);
  
  // Stores
  const jobs = useJobsStore(state => state.jobs);
  
  const { addRecentSearch, recentSearches, setIsOpen } = useSearchStore();

  const handleSelect = useCallback((result: SearchResult, path?: string) => {
    addRecentSearch(result);
    setIsOpen(false);
    if (path) router.push(path);
  }, [addRecentSearch, setIsOpen, router]);

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    const allResults: SearchResult[] = [];

    if (!q) {
      // Return recent searches if query is empty
      if (recentSearches.length > 0) {
        return recentSearches.map(s => ({
          ...s,
          icon: Briefcase,
          onSelect: () => {
            setIsOpen(false);
            router.push(`/jobs/${s.id}`);
          }
        } as SearchResult));
      }
      return [];
    }

    // Filter Jobs
    if (jobs) {
      const matchedJobs = jobs.filter((j: Job) => {
        const matchTitle = j.title.toLowerCase().includes(q);
        const matchCompany = j.companyInfo.name.toLowerCase().includes(q);
        const matchLocation = j.location.toLowerCase().includes(q);
        const matchEmploymentType = j.employmentType?.toLowerCase().includes(q);
        
        return matchTitle || matchCompany || matchLocation || matchEmploymentType;
      }).slice(0, 10);
      
      allResults.push(...matchedJobs.map((j: Job) => ({
        id: j.id,
        title: j.title,
        company: j.companyInfo.name,
        location: j.location,
        icon: Briefcase,
        onSelect: () => handleSelect({ 
          id: j.id, 
          title: j.title, 
          company: j.companyInfo.name,
          location: j.location,
          icon: Briefcase, 
          onSelect: () => {} 
        }, `/jobs/${j.id}`)
      })));
    }

    return allResults;
  }, [query, jobs, recentSearches, router, setIsOpen, handleSelect]);

  return {
    query,
    setQuery,
    results
  };
}
