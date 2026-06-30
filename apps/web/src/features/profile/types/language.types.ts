/** Languages Module — Type Definitions */

export type LanguageLevel = "beginner" | "intermediate" | "advanced" | "fluent" | "native";

export interface Language {
  id: string;
  language: string;
  readingLevel: LanguageLevel;
  writingLevel: LanguageLevel;
  speakingLevel: LanguageLevel;
  nativeLanguage: boolean;
  createdAt: string;
  updatedAt: string;
}
