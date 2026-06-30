"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { Mail } from "lucide-react";
import type { ContactInfo } from "../types/profile.types";

interface ContactInfoCardProps {
  contact: ContactInfo;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b-2 border-border/10 py-2.5 last:border-0">
      <span className="text-foreground-muted text-xs uppercase font-bold tracking-wider">{label}</span>
      <span className="text-right text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

export function ContactInfoCard({ contact }: ContactInfoCardProps) {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
          <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
          Contact Information
        </Heading>

        <div>
          <InfoRow label="Email" value={contact.email} />
          <InfoRow label="Phone" value={contact.phone} />
          <InfoRow label="City" value={contact.city} />
          <InfoRow label="State" value={contact.state} />
          <InfoRow label="Country" value={contact.country} />
        </div>
      </div>
    </BrutalCard>
  );
}
