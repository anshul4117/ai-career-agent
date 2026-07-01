"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { AlertTriangle, ArrowRight } from "lucide-react";

interface MissingSectionItem {
  id: string;
  label: string;
  suggestion: string;
}

interface MissingSectionsProps {
  missingSections: MissingSectionItem[];
}

export function MissingSections({ missingSections }: MissingSectionsProps) {
  if (missingSections.length === 0) return null;

  return (
    <BrutalCard className="bg-[#FFE2E2] border-[3px] border-border p-5 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading level="h4" className="text-xs font-black uppercase tracking-wider flex items-center gap-2 text-foreground">
          <AlertTriangle className="h-4.5 w-4.5 text-error shrink-0" aria-hidden="true" />
          Missing Sections ({missingSections.length})
        </Heading>

        <div className="divide-y-2 divide-border/10">
          {missingSections.map((item) => (
            <div key={item.id} className="py-3.5 first:pt-0 last:pb-0 space-y-1">
              <div className="text-xs font-extrabold uppercase text-foreground">
                • {item.label}
              </div>
              <Text className="text-foreground-secondary text-[11px] leading-relaxed">
                {item.suggestion}
              </Text>
              <div className="pt-1.5">
                <Link
                  href={`/profile/edit#${item.id}`}
                  className="inline-flex items-center gap-1 text-[10px] font-black uppercase text-primary hover:underline"
                  aria-label={`Complete ${item.label} section now`}
                >
                  Complete Now
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </BrutalCard>
  );
}
