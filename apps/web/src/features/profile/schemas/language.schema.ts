/** Languages Module — Zod Validation Schemas */

import { z } from "zod";

const languageLevelSchema = z.enum(["beginner", "intermediate", "advanced", "fluent", "native"], {
  errorMap: () => ({ message: "Please select a valid proficiency level" }),
});

export const languageSchema = z.object({
  language: z
    .string()
    .min(1, "Language is required")
    .max(100, "Language must be under 100 characters")
    .trim(),
  readingLevel: languageLevelSchema,
  writingLevel: languageLevelSchema,
  speakingLevel: languageLevelSchema,
  nativeLanguage: z.boolean().default(false),
});

export type LanguageFormValues = z.infer<typeof languageSchema>;
