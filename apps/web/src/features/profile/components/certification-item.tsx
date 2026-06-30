"use client";

import React from "react";
import { Award, Calendar, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import type { Certification } from "../types/certification.types";

interface CertificationItemProps {
  cert: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (id: string) => void;
}

export function CertificationItem({ cert, onEdit, onDelete }: CertificationItemProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No Expiration";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div className="flex items-start justify-between border-2 border-border bg-surface p-4 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow w-full min-w-0">
      <div className="flex items-start gap-4 min-w-0">
        <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0 mt-0.5">
          <Award className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1.5 min-w-0">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight truncate">
            {cert.name}
          </Heading>
          <p className="font-bold text-xs text-foreground-secondary truncate">
            {cert.issuingOrganization}
          </p>

          <div className="flex flex-wrap items-center gap-3 text-[10px] text-foreground-muted font-mono pt-1">
            <span className="flex items-center gap-1 font-bold">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Issued: {formatDate(cert.issueDate)} – {cert.neverExpires ? "Never Expires" : `Expires: ${formatDate(cert.expiryDate)}`}
            </span>
            {cert.credentialId && (
              <span className="px-2 py-0.5 border border-border bg-surface-secondary font-black uppercase text-[9px] text-foreground brutal-shadow-sm">
                ID: {cert.credentialId}
              </span>
            )}
          </div>

          {cert.credentialUrl && (
            <a
              href={cert.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-primary hover:underline pt-1.5"
            >
              Verify Credential
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(cert)}
          aria-label={`Edit ${cert.name}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(cert.id)}
          aria-label={`Delete ${cert.name}`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
