/** Experience Module — Zod Validation Schemas */

import { z } from "zod";

export const experienceSchema = z
  .object({
    jobTitle: z
      .string()
      .min(1, "Job title is required")
      .max(100, "Job title must be under 100 characters")
      .trim(),
    companyName: z
      .string()
      .min(1, "Company name is required")
      .max(100, "Company name must be under 100 characters")
      .trim(),
    employmentType: z.enum(["full-time", "part-time", "internship", "contract", "freelance"], {
      errorMap: () => ({ message: "Please select an employment type" }),
    }),
    location: z
      .string()
      .min(1, "Location is required")
      .max(100, "Location must be under 100 characters")
      .trim(),
    workMode: z.enum(["remote", "hybrid", "onsite"], {
      errorMap: () => ({ message: "Please select a work mode" }),
    }),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .preprocess((val) => (val === "" ? null : val), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format").nullable().optional()),
    currentPosition: z.boolean().default(false),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be under 1000 characters")
      .trim(),
    technologiesUsed: z
      .preprocess(
        (val) => {
          if (typeof val === "string") {
            return val
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
          }
          return val;
        },
        z.array(z.string())
      )
      .default([]),
  })
  .refine(
    (data) => {
      if (data.currentPosition) return true;
      if (!data.endDate) return false;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    }
  );

export type ExperienceFormValues = z.infer<typeof experienceSchema>;
