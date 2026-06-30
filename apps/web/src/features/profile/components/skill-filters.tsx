"use client";

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SKILL_CATEGORIES } from "../data/skills.mock";

interface SkillFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  sortBy: "alphabetical" | "experience";
  onSortChange: (sort: "alphabetical" | "experience") => void;
}

export function SkillFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
}: SkillFiltersProps) {
  return (
    <div className="bg-surface-secondary border-2 border-border p-4 space-y-4 brutal-shadow-sm w-full min-w-0">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground-muted" />
          <Input
            type="search"
            placeholder="Search skills..."
            className="pl-10 h-10 w-full"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            aria-label="Search skills"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <select
            className="flex h-10 w-full rounded-md bg-surface px-4 py-2 text-sm text-foreground brutal-border transition-colors appearance-none pr-10"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
            aria-label="Filter by category"
          >
            <option value="all">All Categories</option>
            {SKILL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
            <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            className="flex h-10 w-full rounded-md bg-surface px-4 py-2 text-sm text-foreground brutal-border transition-colors appearance-none pr-10"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as "alphabetical" | "experience")}
            aria-label="Sort skills"
          >
            <option value="alphabetical">Sort Alphabetically</option>
            <option value="experience">Sort by Experience</option>
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-foreground">
            <svg className="h-4 w-4 stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
