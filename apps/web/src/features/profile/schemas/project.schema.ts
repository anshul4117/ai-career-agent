/** Projects Module — Zod Validation Schemas */

import { z } from "zod";

const optionalUrlSchema = z
  .string()
  .url("Invalid URL format")
  .or(z.literal(""))
  .nullable()
  .optional();

export const projectSchema = z
  .object({
    title: z
      .string()
      .min(1, "Project name is required")
      .max(100, "Project name must be under 100 characters")
      .trim(),
    shortDescription: z
      .string()
      .min(1, "Short description is required")
      .max(150, "Short description must be under 150 characters")
      .trim(),
    description: z
      .string()
      .min(1, "Detailed description is required")
      .max(1000, "Detailed description must be under 1000 characters")
      .trim(),
    techStack: z
      .array(z.string())
      .min(1, "At least one technology is required"),
    githubUrl: optionalUrlSchema,
    liveDemoUrl: optionalUrlSchema,
    teamSize: z
      .number({ invalid_type_error: "Team size must be a number" })
      .min(1, "Team size must be at least 1")
      .max(100, "Team size cannot exceed 100")
      .optional(),
    role: z
      .string()
      .min(1, "Your role is required")
      .max(100, "Role must be under 100 characters")
      .trim(),
    startDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "Start date must be in YYYY-MM-DD format"),
    endDate: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
      .or(z.literal(""))
      .nullable()
      .optional(),
    currentlyWorking: z.boolean().default(false),
    featured: z.boolean().default(false),
    category: z.enum(
      [
        "Web",
        "Mobile",
        "AI",
        "Backend",
        "Full Stack",
        "DevOps",
        "Open Source",
        "Other",
      ],
      {
        errorMap: () => ({ message: "Please select a category" }),
      },
    ),
  })
  .refine(
    (data) => {
      if (data.currentlyWorking) return true;
      if (!data.endDate || data.endDate === "") return false;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );

export type ProjectFormValues = z.infer<typeof projectSchema>;
