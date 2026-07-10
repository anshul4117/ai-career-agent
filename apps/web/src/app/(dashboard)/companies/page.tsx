"use client";

import React, { useEffect, useState } from "react";
import { useCompanyStore } from "@/features/jobs/store/company.store";
import { PageHeader } from "@/components/shared/page-header";
import { CompanyCard } from "@/features/jobs/components/company-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { EmptyState } from "@/components/ui/empty-state";
import { CompaniesSkeleton } from "@/components/ui/skeleton-loaders";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight,
  LayoutGrid,
  LayoutList,
  Building2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CompaniesPage() {
  const {
    companies,
    totalCount,
    loading,
    page,
    limit,
    sorting,
    filters,
    fetchCompanies,
    updateFilters,
    setSorting,
    setPage,
    resetFilters
  } = useCompanyStore();

  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ keyword: keywordInput });
  };

  const handleSizeCheckbox = (size: string, checked: boolean) => {
    const current = filters.companySize || [];
    const updated = checked
      ? [...current, size]
      : current.filter((s) => s !== size);
    updateFilters({ companySize: updated });
  };

  const totalPages = Math.ceil(totalCount / limit);

  const sizeOptions = ["1-10", "11-50", "51-200", "201-500", "500+"];
  
  const industryOptions = [
    { label: "All Industries", value: "all" },
    { label: "AI & Productivity", value: "AI & Productivity" },
    { label: "Cloud Infrastructure", value: "Cloud Infrastructure" },
    { label: "Design & UX Tools", value: "Design & UX Tools" },
    { label: "Fintech", value: "Fintech" },
    { label: "AI & Robotics", value: "AI & Robotics" },
    { label: "Logistics Software", value: "Logistics Software" },
    { label: "Big Data & BI", value: "Big Data & BI" }
  ];

  return (
    <div className="space-y-6 pb-12 text-left select-none relative">
      
      {/* Page Header */}
      <PageHeader
        title="Companies Directory"
        description="Explore detailed corporate profiles, hiring pipelines, and engineering stacks."
      />

      {/* Search form controls */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 w-full">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-muted stroke-[2.5px]" />
          <Input
            placeholder="Search company names, culture keywords..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="pl-9 h-11 text-xs font-bold border-2 border-border"
          />
        </div>
        <Button 
          type="submit" 
          className="h-11 px-6 text-xs font-black uppercase tracking-wider brutal-shadow-xs border-2 border-border"
        >
          Search
        </Button>
        <Button
          type="button"
          onClick={() => setMobileFilterOpen(true)}
          className="lg:hidden h-11 w-11 shrink-0 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center justify-center"
          aria-label="Open filters"
        >
          <SlidersHorizontal className="h-4 w-4 stroke-[2.5px]" />
        </Button>
      </form>

      {/* Grid Layoutsplits */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        
        {/* A. Left Sidebar Filter (Desktop) */}
        <aside className="hidden lg:block lg:col-span-3 border-[3px] border-border brutal-shadow bg-surface p-5 rounded-sm sticky top-24 space-y-6">
          <div className="flex justify-between items-center border-b-2 border-border/10 pb-3">
            <h4 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <Building2 className="h-4 w-4 text-primary" /> Filter Profiles
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="h-8 px-2 text-[9px] font-black uppercase text-foreground-muted hover:bg-surface-secondary border border-border/25 rounded-sm"
            >
              Reset
            </Button>
          </div>

          {/* Industry filter */}
          <div className="space-y-2">
            <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
              Industry Sector
            </Label>
            <BrutalSelect
              value={filters.industry}
              onChange={(e) => updateFilters({ industry: e.target.value })}
              options={industryOptions}
              className="text-xs font-bold"
            />
          </div>

          {/* Company size filter */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
              Company Size
            </Label>
            <div className="space-y-2">
              {sizeOptions.map((sz) => (
                <div key={sz} className="flex items-center gap-2">
                  <Checkbox
                    id={`size-filter-${sz}`}
                    checked={filters.companySize.includes(sz)}
                    onChange={(e) => handleSizeCheckbox(sz, e.target.checked)}
                  />
                  <label htmlFor={`size-filter-${sz}`} className="text-xs font-semibold text-foreground cursor-pointer">
                    {sz} employees
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Hiring status switch */}
          <div className="space-y-2.5">
            <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
              Hiring status
            </Label>
            <div className="flex items-center gap-2">
              <Checkbox
                id="filter-hiring-status"
                checked={filters.isActivelyHiring === true}
                onChange={(e) => updateFilters({ isActivelyHiring: e.target.checked ? true : null })}
              />
              <label htmlFor="filter-hiring-status" className="text-xs font-semibold text-foreground cursor-pointer">
                Actively Hiring
              </label>
            </div>
          </div>
        </aside>

        {/* B. Right Grid Area */}
        <div className="lg:col-span-9 space-y-4">
          
          {/* Toolbar */}
          <div className="flex justify-between items-center bg-surface p-3 border-2 border-border rounded-sm">
            <span className="text-[10px] font-black uppercase text-foreground-secondary">
              {loading ? "Loading..." : `${totalCount} Companies found`}
            </span>

            <div className="flex items-center gap-3">
              <BrutalSelect
                value={sorting}
                onChange={(e) => setSorting(e.target.value as "name" | "positions")}
                options={[
                  { label: "Sort: Name (A-Z)", value: "name" },
                  { label: "Sort: Open Roles Count", value: "positions" }
                ]}
                className="h-8 text-[9px] font-black uppercase tracking-wider border-2 border-border"
              />

              <div className="hidden sm:flex border-2 border-border rounded-sm overflow-hidden shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "h-8 w-8 p-0 rounded-none border-r border-border",
                    viewMode === "list" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary"
                  )}
                  aria-label="List view"
                >
                  <LayoutList className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "h-8 w-8 p-0 rounded-none",
                    viewMode === "grid" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary"
                  )}
                  aria-label="Grid view"
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Company Cards List */}
          {loading ? (
            <CompaniesSkeleton />
          ) : companies.length === 0 ? (
            <EmptyState
              icon={Building2}
              title="No companies found"
              description="No matching corporate profiles found. Try widening size checkboxes or search parameters."
              primaryAction={{
                label: "Reset Filters",
                onClick: resetFilters
              }}
            />
          ) : (
            <div className={cn("grid gap-4", viewMode === "grid" ? "sm:grid-cols-2 md:grid-cols-3" : "grid-cols-1")}>
              {companies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center pt-2 border-t border-border/10">
              <Button
                variant="ghost"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </Button>
              <span className="text-[10px] font-black uppercase text-foreground-secondary">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="ghost"
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="h-9 px-3 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary text-[10px] font-black uppercase flex items-center gap-1"
              >
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}

        </div>

      </div>

      {/* Mobile filters bottom sheet */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 lg:hidden">
          <div className="w-full max-h-[85vh] overflow-y-auto bg-surface border-t-[4px] border-border p-5 brutal-shadow space-y-6 rounded-t-lg">
            <div className="flex justify-between items-center border-b border-border/10 pb-2">
              <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Filter Categories</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileFilterOpen(false)}
                className="h-8 w-8 border-2 border-border hover:bg-surface-secondary rounded-sm"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
                Industry Sector
              </Label>
              <BrutalSelect
                value={filters.industry}
                onChange={(e) => updateFilters({ industry: e.target.value })}
                options={industryOptions}
                className="text-xs font-bold"
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
                Company Size
              </Label>
              <div className="space-y-2">
                {sizeOptions.map((sz) => (
                  <div key={sz} className="flex items-center gap-2">
                    <Checkbox
                      id={`mob-size-${sz}`}
                      checked={filters.companySize.includes(sz)}
                      onChange={(e) => handleSizeCheckbox(sz, e.target.checked)}
                    />
                    <label htmlFor={`mob-size-${sz}`} className="text-xs font-semibold text-foreground cursor-pointer">
                      {sz} employees
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2.5 pb-8">
              <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
                Hiring status
              </Label>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="mob-filter-hiring"
                  checked={filters.isActivelyHiring === true}
                  onChange={(e) => updateFilters({ isActivelyHiring: e.target.checked ? true : null })}
                />
                <label htmlFor="mob-filter-hiring" className="text-xs font-semibold text-foreground cursor-pointer">
                  Actively Hiring
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
