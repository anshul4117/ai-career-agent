/** Education Module — Zod Validation Schemas */

import { z } from "zod";

export const educationSchema = z
  .object({
    degree: z
      .string()
      .min(1, "Degree/Qualification is required")
      .max(100, "Degree name must be under 100 characters")
      .trim(),
    fieldOfStudy: z
      .string()
      .min(1, "Field of study is required")
      .max(100, "Field of study must be under 100 characters")
      .trim(),
    institution: z
      .string()
      .min(1, "Institution name is required")
      .max(150, "Institution name must be under 150 characters")
      .trim(),
    location: z
      .string()
      .max(100, "Location must be under 100 characters")
      .trim()
      .optional()
      .or(z.literal("")),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
      .or(z.literal(""))
      .nullable()
      .optional(),
    currentStudy: z.boolean(),
    cgpa: z.string().max(20, "Grade too long").optional().or(z.literal("")),
    description: z
      .string()
      .max(500, "Description must be under 500 characters")
      .or(z.literal(""))
      .nullable()
      .optional(),
    highestEducation: z.boolean().default(false),
  })
  .refine(
    (data) => {
      if (data.currentStudy) return true;
      if (!data.endDate || data.endDate === "") return false;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );

export type EducationFormValues = z.infer<typeof educationSchema>;
