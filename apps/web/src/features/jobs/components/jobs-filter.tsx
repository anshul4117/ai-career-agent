"use client";
 
import React, { useState } from "react";
import { useJobsStore } from "../store/jobs.store";
import type { ExperienceLevel, RemoteType, EmploymentType, JobFilters } from "../types/jobs.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { 
  RefreshCw, 
  Filter, 
  ChevronDown, 
  Plus, 
  X 
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
 
export function JobsFilter() {
  const { filters, updateFilters, resetFilters } = useJobsStore();
 
  // Collapsible section toggles
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    salary: true,
    location: true,
    experience: true,
    employment: true,
    skills: true,
    company: true,
    posted: true,
    score: true,
    easyApply: true,
    matchFilter: true
  });
 
  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };
 
  // Local skill input state
  const [skillInput, setSkillInput] = useState("");
 
  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanSkill = skillInput.trim();
    if (cleanSkill && !filters.skills.includes(cleanSkill)) {
      updateFilters({ skills: [...filters.skills, cleanSkill] });
    }
    setSkillInput("");
  };
 
  const handleRemoveSkill = (skillToRemove: string) => {
    updateFilters({ skills: filters.skills.filter((s) => s !== skillToRemove) });
  };
 
  const handleCheckboxChange = <T extends string>(
    key: "experienceLevel" | "remoteType" | "employmentType",
    value: T,
    checked: boolean
  ) => {
    const currentList = (filters[key] as T[]) || [];
    const updatedList = checked
      ? [...currentList, value]
      : currentList.filter((item) => item !== value);
 
    updateFilters({ [key]: updatedList });
  };
 
  const experienceOptions: { label: string; value: ExperienceLevel }[] = [
    { label: "Entry Level", value: "entry" },
    { label: "Mid Level", value: "mid" },
    { label: "Senior Level", value: "senior" },
    { label: "Lead / Principal", value: "lead" }
  ];
 
  const remoteOptions: { label: string; value: RemoteType }[] = [
    { label: "Fully Remote", value: "remote" },
    { label: "Hybrid Office", value: "hybrid" },
    { label: "Onsite Office", value: "onsite" }
  ];
 
  const employmentOptions: { label: string; value: EmploymentType }[] = [
    { label: "Full Time", value: "full-time" },
    { label: "Part Time", value: "part-time" },
    { label: "Contract", value: "contract" },
    { label: "Internship", value: "internship" }
  ];
 
  const salaryOptions = [
    { label: "Any Salary", value: "" },
    { label: "$60,000+ USD", value: "60000" },
    { label: "$80,000+ USD", value: "80000" },
    { label: "$100,000+ USD", value: "100000" },
    { label: "$120,000+ USD", value: "120000" },
    { label: "$140,000+ USD", value: "140000" }
  ];
 
  const postedDateOptions = [
    { label: "Any Time", value: "any" },
    { label: "Past 24 Hours", value: "24h" },
    { label: "Past Week", value: "week" },
    { label: "Past Month", value: "month" }
  ];
 
  const matchScoreOptions = [
    { label: "Any Score", value: "" },
    { label: "85%+ Match", value: "85" },
    { label: "90%+ Match", value: "90" },
    { label: "95%+ Match", value: "95" }
  ];
 
  const aiMatchOptions = [
    { label: "All Opportunities", value: "all" },
    { label: "90%+ Match Score", value: "90" },
    { label: "80%+ Match Score", value: "80" },
    { label: "70%+ Match Score", value: "70" },
    { label: "High Match Only (>= 80%)", value: "high_match" },
    { label: "Missing <= 2 Skills", value: "missing_skills" },
    { label: "High Match + High Quality", value: "high_quality_match" }
  ];
 
  return (
    <div className="space-y-4 text-left select-none">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b-2 border-border/10 pb-2.5">
        <h4 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" /> Filter Jobs
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-2 text-[9px] font-black uppercase text-foreground-muted hover:bg-surface-secondary flex items-center gap-1 border border-border/25 rounded-sm"
        >
          <RefreshCw className="h-3 w-3" /> Reset All
        </Button>
      </div>
 
      {/* Easy Apply Checkbox - Instant toggle */}
      <div className="border-b border-border/10 pb-3">
        <div className="flex items-center gap-2">
          <Checkbox
            id="filter-easy"
            checked={filters.easyApply}
            onChange={(e) => updateFilters({ easyApply: e.target.checked })}
          />
          <label
            htmlFor="filter-easy"
            className="text-xs font-black uppercase text-foreground cursor-pointer flex items-center gap-1"
          >
            ⚡ Easy Apply Only
          </label>
        </div>
      </div>
 
      {/* Company & Industry Category */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("company")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Company &amp; Industry</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.company ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.company && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase">Company Name</span>
                  <Input
                    placeholder="e.g. Stripe, Linear"
                    value={filters.company}
                    onChange={(e) => updateFilters({ company: e.target.value })}
                    className="h-8 text-xs font-semibold border border-border/50"
                  />
                </div>
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase">Industry</span>
                  <Input
                    placeholder="e.g. Fintech, Healthcare"
                    value={filters.industry}
                    onChange={(e) => updateFilters({ industry: e.target.value })}
                    className="h-8 text-xs font-semibold border border-border/50"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Location Selector */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("location")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Location &amp; Remote</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.location ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.location && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-3">
                <div className="space-y-1">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase">HQ/Location City</span>
                  <Input
                    placeholder="e.g. Austin, London"
                    value={filters.location}
                    onChange={(e) => updateFilters({ location: e.target.value })}
                    className="h-8 text-xs font-semibold border border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[9px] font-bold text-foreground-muted uppercase block">Location Class</span>
                  {remoteOptions.map((opt) => (
                    <div key={opt.value} className="flex items-center gap-2">
                      <Checkbox
                        id={`filter-rem-${opt.value}`}
                        checked={filters.remoteType.includes(opt.value)}
                        onChange={(e) =>
                          handleCheckboxChange("remoteType", opt.value, e.target.checked)
                        }
                      />
                      <label
                        htmlFor={`filter-rem-${opt.value}`}
                        className="text-xs font-semibold text-foreground cursor-pointer"
                      >
                        {opt.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Base Salary Select */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("salary")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Base Salary Target</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.salary ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.salary && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <BrutalSelect
                  value={filters.salaryMin?.toString() || ""}
                  onChange={(e) => updateFilters({ salaryMin: e.target.value ? parseInt(e.target.value, 10) : null })}
                  options={salaryOptions}
                  className="text-xs font-bold h-8.5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Experience level criteria options */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("experience")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Experience Level</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.experience ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.experience && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                {experienceOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-exp-${opt.value}`}
                      checked={filters.experienceLevel.includes(opt.value)}
                      onChange={(e) =>
                        handleCheckboxChange("experienceLevel", opt.value, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`filter-exp-${opt.value}`}
                      className="text-xs font-semibold text-foreground cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Employment type options */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("employment")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Employment Type</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.employment ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.employment && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                {employmentOptions.map((opt) => (
                  <div key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      id={`filter-emp-${opt.value}`}
                      checked={filters.employmentType.includes(opt.value)}
                      onChange={(e) =>
                        handleCheckboxChange("employmentType", opt.value, e.target.checked)
                      }
                    />
                    <label
                      htmlFor={`filter-emp-${opt.value}`}
                      className="text-xs font-semibold text-foreground cursor-pointer"
                    >
                      {opt.label}
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Skills Filters */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("skills")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Skills Required</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.skills ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.skills && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2 space-y-2">
                <form onSubmit={handleAddSkill} className="flex gap-1">
                  <Input
                    placeholder="e.g. Rust, Figma"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    className="h-8 text-xs font-semibold border border-border/50 flex-1"
                  />
                  <Button
                    type="submit"
                    className="h-8 w-8 p-0 border border-border rounded-sm bg-primary text-white flex items-center justify-center shrink-0 brutal-shadow-xs hover:brutal-shadow"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </form>
     
                {filters.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {filters.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 text-[8px] font-black uppercase bg-surface border border-border px-1.5 py-0.5 rounded-sm"
                      >
                        {skill}
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(skill)}
                          className="text-error font-bold"
                        >
                          <X className="h-2.5 w-2.5" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Date Posted options */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("posted")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Date Posted</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.posted ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.posted && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <BrutalSelect
                  value={filters.datePosted}
                  onChange={(e) => updateFilters({ datePosted: e.target.value as "any" | "24h" | "week" | "month" })}
                  options={postedDateOptions}
                  className="text-xs font-bold h-8.5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* AI Match Filters */}
      <div className="border-b border-border/10 pb-3">
        <button
          onClick={() => toggleSection("matchFilter")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>AI Match Filters</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.matchFilter ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.matchFilter && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <BrutalSelect
                  value={filters.matchFilter || "all"}
                  onChange={(e) => updateFilters({ matchFilter: e.target.value as JobFilters["matchFilter"] })}
                  options={aiMatchOptions}
                  className="text-xs font-bold h-8.5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
      {/* Match Score option */}
      <div>
        <button
          onClick={() => toggleSection("score")}
          className="w-full flex justify-between items-center text-[10px] font-black uppercase tracking-wide text-foreground-secondary py-1"
        >
          <span>Match Score Minimum</span>
          <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200 text-foreground-muted", openSections.score ? "" : "-rotate-90")} />
        </button>
        <AnimatePresence>
          {openSections.score && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-2">
                <BrutalSelect
                  value={filters.matchScoreMin?.toString() || ""}
                  onChange={(e) => updateFilters({ matchScoreMin: e.target.value ? parseInt(e.target.value, 10) : null })}
                  options={matchScoreOptions}
                  className="text-xs font-bold h-8.5"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
 
    </div>
  );
}
