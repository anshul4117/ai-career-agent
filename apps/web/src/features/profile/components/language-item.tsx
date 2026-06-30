"use client";

import React from "react";
import { MessageSquare, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import type { Language } from "../types/language.types";
import { LANGUAGE_LEVEL_LABELS } from "../data/languages.mock";

interface LanguageItemProps {
  lang: Language;
  onEdit: (lang: Language) => void;
  onDelete: (id: string) => void;
}

export function LanguageItem({ lang, onEdit, onDelete }: LanguageItemProps) {
  return (
    <div className="flex items-center justify-between border-2 border-border bg-surface p-4 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <MessageSquare className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Heading level="h4" className="text-sm font-black uppercase tracking-tight truncate">
              {lang.language}
            </Heading>
            {lang.nativeLanguage && (
              <span className="px-1.5 py-0.5 border border-border bg-warning text-white text-[8px] font-black uppercase flex items-center gap-0.5 brutal-shadow-sm">
                <Star className="h-2 w-2 fill-white" />
                Native
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[10px] text-foreground-secondary font-mono">
            <span>Speak: {LANGUAGE_LEVEL_LABELS[lang.speakingLevel] || lang.speakingLevel}</span>
            <span>•</span>
            <span>Read: {LANGUAGE_LEVEL_LABELS[lang.readingLevel] || lang.readingLevel}</span>
            <span>•</span>
            <span>Write: {LANGUAGE_LEVEL_LABELS[lang.writingLevel] || lang.writingLevel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(lang)}
          aria-label={`Edit ${lang.language}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(lang.id)}
          aria-label={`Delete ${lang.language}`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
