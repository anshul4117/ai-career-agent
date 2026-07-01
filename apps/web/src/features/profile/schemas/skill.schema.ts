/** Skills Module — Zod Validation Schemas */

import { z } from "zod";

export const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required")
    .max(50, "Skill name must be under 50 characters")
    .trim(),
  category: z.string().min(1, "Category is required"),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    errorMap: () => ({ message: "Please select a valid skill level" }),
  }),
  yearsOfExperience: z
    .number({ invalid_type_error: "Years of experience must be a number" })
    .min(0, "Years of experience cannot be negative")
    .max(50, "Experience cannot exceed 50 years"),
  featured: z.boolean(),
});

export type SkillFormValues = z.infer<typeof skillSchema>;
