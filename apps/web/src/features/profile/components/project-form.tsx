"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Checkbox } from "@/components/ui/checkbox";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import type { Project, ProjectCategory } from "../types/project.types";
import type { ProjectFormValues } from "../schemas/project.schema";

interface ProjectFormProps {
  initialValues?: Project | null;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  existingProjects?: Project[];
}

const categoryOptions = [
  { value: "Web", label: "Web" },
  { value: "Mobile", label: "Mobile" },
  { value: "AI", label: "AI" },
  { value: "Backend", label: "Backend" },
  { value: "Full Stack", label: "Full Stack" },
  { value: "DevOps", label: "DevOps" },
  { value: "Open Source", label: "Open Source" },
  { value: "Other", label: "Other" },
];

const optionalUrlSchema = z
  .string()
  .url("Invalid URL format")
  .or(z.literal(""))
  .nullable()
  .optional();

const projectFormInputsSchema = z
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
    techStack: z.string().refine(
      (val) =>
        val
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean).length > 0,
      { message: "At least one technology is required" },
    ),
    githubUrl: optionalUrlSchema,
    liveDemoUrl: optionalUrlSchema,
    teamSize: z
      .number({ invalid_type_error: "Team size must be a number" })
      .min(1, "Team size must be at least 1")
      .max(100, "Team size cannot exceed 100")
      .optional()
      .or(z.nan()),
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
    currentlyWorking: z.boolean(),
    featured: z.boolean(),
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

type ProjectFormInputs = z.infer<typeof projectFormInputsSchema>;

export function ProjectForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Project",
  existingProjects = [],
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProjectFormInputs>({
    resolver: zodResolver(
      projectFormInputsSchema,
    ) as unknown as Resolver<ProjectFormInputs>,
    defaultValues: {
      title: "",
      shortDescription: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveDemoUrl: "",
      teamSize: 1,
      role: "",
      startDate: "",
      endDate: "",
      currentlyWorking: false,
      featured: false,
      category: "Web",
    },
  });

  const currentlyWorking = watch("currentlyWorking");

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title,
        shortDescription: initialValues.shortDescription || "",
        description: initialValues.description,
        techStack: initialValues.techStack
          ? initialValues.techStack.join(", ")
          : "",
        githubUrl: initialValues.githubUrl || "",
        liveDemoUrl: initialValues.liveDemoUrl || "",
        teamSize: initialValues.teamSize || 1,
        role: initialValues.role,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate || "",
        currentlyWorking: initialValues.currentlyWorking || false,
        featured: initialValues.featured,
        category: initialValues.category || "Web",
      });
    } else {
      reset({
        title: "",
        shortDescription: "",
        description: "",
        techStack: "",
        githubUrl: "",
        liveDemoUrl: "",
        teamSize: 1,
        role: "",
        startDate: "",
        endDate: "",
        currentlyWorking: false,
        featured: false,
        category: "Web",
      });
    }
  }, [initialValues, reset]);

  // Clear endDate when currentlyWorking is checked
  useEffect(() => {
    if (currentlyWorking) {
      setValue("endDate", "");
    }
  }, [currentlyWorking, setValue]);

  const handleFormSubmit = (data: ProjectFormInputs) => {
    // Duplicate check
    const isDuplicate = existingProjects.some(
      (proj) =>
        proj.title.toLowerCase().trim() === data.title.toLowerCase().trim() &&
        proj.id !== initialValues?.id,
    );

    if (isDuplicate) {
      setError("title", {
        type: "manual",
        message: "A project with this name has already been added.",
      });
      return;
    }

    const techs = data.techStack
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    onSubmit({
      title: data.title,
      shortDescription: data.shortDescription,
      description: data.description,
      techStack: techs,
      githubUrl: data.githubUrl || null,
      liveDemoUrl: data.liveDemoUrl || null,
      teamSize: Number.isNaN(data.teamSize) ? undefined : data.teamSize,
      role: data.role,
      startDate: data.startDate,
      endDate: data.endDate || null,
      currentlyWorking: data.currentlyWorking,
      featured: data.featured,
      category: data.category as ProjectCategory,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <BrutalInput
        label="Project Name"
        placeholder="e.g. AI-powered Career Agent"
        required
        error={errors.title?.message}
        {...register("title")}
      />

      <BrutalSelect
        label="Category"
        options={categoryOptions}
        required
        error={errors.category?.message}
        {...register("category")}
      />

      <BrutalInput
        label="Short Description"
        placeholder="e.g. Short summary for previews (max 150 chars)"
        required
        error={errors.shortDescription?.message}
        {...register("shortDescription")}
      />

      <BrutalInput
        label="Your Role"
        placeholder="e.g. Lead Full Stack Developer"
        required
        error={errors.role?.message}
        {...register("role")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Team Size"
          type="number"
          min="1"
          max="100"
          error={errors.teamSize?.message}
          {...register("teamSize", { valueAsNumber: true })}
        />

        <BrutalInput
          label="Tech Stack (Comma-separated)"
          placeholder="e.g. React, TypeScript, Next.js, Node.js"
          required
          error={errors.techStack?.message}
          {...register("techStack")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="GitHub URL"
          placeholder="e.g. https://github.com/..."
          error={errors.githubUrl?.message}
          {...register("githubUrl")}
        />

        <BrutalInput
          label="Live Demo URL"
          placeholder="e.g. https://myproject.com"
          error={errors.liveDemoUrl?.message}
          {...register("liveDemoUrl")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Start Date"
          type="date"
          required
          error={errors.startDate?.message}
          {...register("startDate")}
        />

        <BrutalInput
          label="End Date"
          type="date"
          required={!currentlyWorking}
          disabled={currentlyWorking}
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Checkbox
          id="currentlyWorking"
          label="I currently work on this project"
          error={errors.currentlyWorking?.message}
          {...register("currentlyWorking")}
        />

        <Checkbox
          id="featured"
          label="Feature this project on dashboard summary"
          error={errors.featured?.message}
          {...register("featured")}
        />
      </div>

      <BrutalTextarea
        label="Detailed Description"
        placeholder="Describe the project's purpose, impact, challenges, and implementation details..."
        error={errors.description?.message}
        required
        rows={4}
        {...register("description")}
      />

      <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-border/10">
        <BrutalButton
          type="button"
          variant="secondary"
          onClick={() => reset()}
          disabled={!isDirty || isSubmitting}
          className="h-10 px-4 text-xs font-bold uppercase tracking-wider"
        >
          Reset
        </BrutalButton>
        <BrutalButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 px-4 text-xs font-bold uppercase tracking-wider"
        >
          Cancel
        </BrutalButton>
        <BrutalButton
          type="submit"
          disabled={!isDirty || isSubmitting}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </BrutalButton>
      </div>
    </form>
  );
}
