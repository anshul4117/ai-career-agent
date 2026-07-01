"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { Award } from "lucide-react";
import type { Certification } from "../types/certification.types";

interface CertificationsCardProps {
  certifications: Certification[];
}

export function CertificationsCard({ certifications }: CertificationsCardProps) {
  const previewCerts = [...certifications]
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 2);

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Award className="h-5 w-5 text-primary" aria-hidden="true" />
            Certifications
          </Heading>
        </div>

        {/* List Preview */}
        {certifications.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No certifications added yet. List your achievements.
            </Text>
          </div>
        ) : (
          <div className="space-y-3 pt-2">
            {previewCerts.map((cert) => (
              <div
                key={cert.id}
                className="flex items-start justify-between gap-4 border-b-2 border-border/10 pb-3 last:border-none last:pb-0"
              >
                <div className="space-y-0.5 min-w-0">
                  <p className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
                    {cert.name}
                  </p>
                  <p className="text-xs text-foreground-secondary truncate font-medium">
                    {cert.issuingOrganization}
                  </p>
                </div>
                <span className="font-mono text-[10px] font-bold text-primary shrink-0 bg-surface-secondary border border-border px-1.5 py-0.5 rounded-sm">
                  {new Date(cert.issueDate).getFullYear()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
