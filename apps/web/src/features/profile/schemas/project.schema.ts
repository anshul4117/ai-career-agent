/** Projects Module — Zod Validation Schemas */

import { z } from "zod";

const optionalUrlSchema = z.preprocess(
  (val) => (val === "" ? null : val),
  z.string().url("Invalid URL format").nullable().optional()
);

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(1, "Project title is required")
      .max(100, "Project title must be under 100 characters")
      .trim(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(500, "Description must be under 500 characters")
      .trim(),
    techStack: z
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
        z.array(z.string()).min(1, "At least one technology is required")
      ),
    githubUrl: optionalUrlSchema,
    liveDemoUrl: optionalUrlSchema,
    teamSize: z
      .number({ invalid_type_error: "Team size must be a number" })
      .min(1, "Team size must be at least 1")
      .max(100, "Team size cannot exceed 100"),
    role: z
      .string()
      .min(1, "Your role is required")
      .max(100, "Role must be under 100 characters")
      .trim(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .preprocess((val) => (val === "" ? null : val), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format").nullable().optional()),
    featured: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.endDate) return true;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    }
  );

export type ProjectFormValues = z.infer<typeof projectSchema>;
