"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { User } from "lucide-react";
import type { PersonalInfo } from "../types/profile.types";

interface PersonalInfoCardProps {
  personal: PersonalInfo;
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-4 border-b-2 border-border/10 py-2.5 last:border-0">
      <span className="text-foreground-muted text-xs uppercase font-bold tracking-wider">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value || "—"}</span>
    </div>
  );
}

export function PersonalInfoCard({ personal }: PersonalInfoCardProps) {
  const genderLabel = personal.gender
    ? personal.gender.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : null;

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
          <User className="h-5 w-5 text-primary" aria-hidden="true" />
          Personal Information
        </Heading>

        <div>
          <InfoRow label="First Name" value={personal.firstName} />
          <InfoRow label="Last Name" value={personal.lastName} />
          <InfoRow label="Date of Birth" value={personal.dateOfBirth} />
          <InfoRow label="Gender" value={genderLabel} />
          <InfoRow label="Nationality" value={personal.nationality} />
        </div>
      </div>
    </BrutalCard>
  );
}
