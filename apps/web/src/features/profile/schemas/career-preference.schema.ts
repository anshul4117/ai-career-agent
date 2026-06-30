/** Career Preferences Module — Zod Validation Schemas */

import { z } from "zod";

export const careerPreferenceSchema = z.object({
  preferredRole: z
    .string()
    .min(1, "Preferred role is required")
    .max(100)
    .trim(),
  employmentType: z.enum(["full-time", "part-time", "internship", "contract", "freelance"], {
    errorMap: () => ({ message: "Please select a valid employment type" }),
  }),
  preferredLocation: z
    .string()
    .min(1, "Preferred location is required")
    .max(100)
    .trim(),
  workMode: z.enum(["remote", "hybrid", "onsite"], {
    errorMap: () => ({ message: "Please select a valid work mode" }),
  }),
  expectedSalary: z
    .string()
    .min(1, "Expected salary is required")
    .max(50)
    .trim(),
  currency: z
    .string()
    .min(1, "Currency is required")
    .max(10)
    .trim(),
  noticePeriod: z
    .string()
    .min(1, "Notice period is required")
    .max(50)
    .trim(),
  openToWork: z.boolean().default(true),
  visaSponsorshipRequired: z.boolean().default(false),
  relocationWillingness: z.boolean().default(true),
  preferredIndustry: z
    .string()
    .min(1, "Preferred industry is required")
    .max(150)
    .trim(),
  preferredCompanySize: z
    .string()
    .min(1, "Preferred company size is required")
    .max(100)
    .trim(),
  preferredShift: z
    .string()
    .min(1, "Preferred shift is required")
    .max(50)
    .trim(),
});

export type CareerPreferenceFormValues = z.infer<typeof careerPreferenceSchema>;
