"use client";

import React from "react";
import { Settings, Pencil } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading } from "@/components/ui/typography";
import type { CareerPreference } from "../types/career-preference.types";
import { EMPLOYMENT_TYPE_LABELS, WORK_MODE_LABELS } from "../data/experience.mock";

interface CareerPreferenceCardProps {
  preferences: CareerPreference | null;
  onEditClick: () => void;
}

function InfoRow({ label, value }: { label: string; value: string | boolean | undefined }) {
  return (
    <div className="flex justify-between gap-4 border-b-2 border-border/10 py-2.5 last:border-none last:pb-0">
      <span className="text-foreground-muted text-xs uppercase font-bold tracking-wider">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">
        {typeof value === "boolean" ? (value ? "Yes" : "No") : value || "—"}
      </span>
    </div>
  );
}

export function CareerPreferenceCard({ preferences, onEditClick }: CareerPreferenceCardProps) {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
            Career Preferences
          </Heading>

          <BrutalButton
            onClick={onEditClick}
            variant="secondary"
            className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shrink-0"
            aria-label="Edit career preferences"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </BrutalButton>
        </div>

        {/* Preferences Table */}
        {!preferences ? (
          <div className="py-6 text-center space-y-2">
            <p className="text-foreground-secondary text-xs">
              No preferences configured. Click edit to set them up.
            </p>
          </div>
        ) : (
          <div>
            <InfoRow label="Preferred Role" value={preferences.preferredRole} />
            <InfoRow
              label="Job Type"
              value={EMPLOYMENT_TYPE_LABELS[preferences.employmentType] || preferences.employmentType}
            />
            <InfoRow label="Job Location" value={preferences.preferredLocation} />
            <InfoRow label="Work Mode" value={WORK_MODE_LABELS[preferences.workMode] || preferences.workMode} />
            <InfoRow label="Expected Salary" value={`${preferences.currency || "INR"} ${preferences.expectedSalary}`} />
            <InfoRow label="Notice Period" value={preferences.noticePeriod} />
            <InfoRow label="Preferred Industries" value={preferences.preferredIndustry} />
            <InfoRow label="Relocate Willingness" value={preferences.relocationWillingness} />
            <InfoRow label="Sponsorship Needed" value={preferences.visaSponsorshipRequired} />
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
