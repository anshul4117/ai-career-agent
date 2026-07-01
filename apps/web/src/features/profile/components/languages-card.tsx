"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { MessageSquare } from "lucide-react";
import type { Language } from "../types/language.types";
import { LANGUAGE_LEVEL_LABELS } from "../data/languages.mock";

interface LanguagesCardProps {
  languages: Language[];
}

export function LanguagesCard({ languages }: LanguagesCardProps) {
  const previewLangs = [...languages].slice(0, 3);

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
            Languages
          </Heading>
        </div>

        {/* List Preview */}
        {languages.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No languages added yet. Add language proficiencies.
            </Text>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {previewLangs.map((lang) => (
              <div
                key={lang.id}
                className="flex items-center gap-1.5 border-2 border-border bg-surface-secondary px-2.5 py-1.5 brutal-shadow-sm"
              >
                <span className="font-extrabold text-xs text-foreground uppercase tracking-tight">
                  {lang.language}
                </span>
                <span className="text-[9px] font-black uppercase text-foreground-muted select-none">
                  ({lang.nativeLanguage ? "Native" : LANGUAGE_LEVEL_LABELS[lang.speakingLevel] || lang.speakingLevel})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
