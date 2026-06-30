/** Languages Module — Mock Data */

import type { Language } from "../types/language.types";

export const MOCK_LANGUAGES: Language[] = [
  {
    id: "lang_1",
    language: "English",
    readingLevel: "fluent",
    writingLevel: "fluent",
    speakingLevel: "fluent",
    nativeLanguage: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "lang_2",
    language: "Hindi",
    readingLevel: "native",
    writingLevel: "native",
    speakingLevel: "native",
    nativeLanguage: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];

export const LANGUAGE_LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  fluent: "Fluent",
  native: "Native",
};
