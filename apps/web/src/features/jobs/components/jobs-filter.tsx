"use client";

import React from "react";
import { useJobsStore } from "../store/jobs.store";
import type { ExperienceLevel, RemoteType, EmploymentType } from "../types/jobs.types";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { RefreshCw, Filter } from "lucide-react";

export function JobsFilter() {
  const { filters, updateFilters, resetFilters } = useJobsStore();

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

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Title */}
      <div className="flex justify-between items-center border-b-2 border-border/10 pb-3">
        <h4 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
          <Filter className="h-4 w-4 text-primary" /> Filter Jobs
        </h4>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="h-8 px-2 text-[9px] font-black uppercase text-foreground-muted hover:bg-surface-secondary flex items-center gap-1 border border-border/25 rounded-sm"
        >
          <RefreshCw className="h-3 w-3" /> Reset
        </Button>
      </div>

      {/* Salary Select */}
      <div className="space-y-2">
        <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
          Minimum Base Salary
        </Label>
        <BrutalSelect
          value={filters.salaryMin?.toString() || ""}
          onChange={(e) => updateFilters({ salaryMin: e.target.value ? parseInt(e.target.value, 10) : null })}
          options={salaryOptions}
          className="text-xs font-bold"
        />
      </div>

      {/* Remote type options */}
      <div className="space-y-2.5">
        <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
          Location Type
        </Label>
        <div className="space-y-2">
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

      {/* Experience criteria options */}
      <div className="space-y-2.5">
        <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
          Experience level
        </Label>
        <div className="space-y-2">
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
      </div>

      {/* Employment type options */}
      <div className="space-y-2.5">
        <Label className="text-[10px] font-black uppercase tracking-wide text-foreground-secondary">
          Employment classification
        </Label>
        <div className="space-y-2">
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
      </div>

    </div>
  );
}
