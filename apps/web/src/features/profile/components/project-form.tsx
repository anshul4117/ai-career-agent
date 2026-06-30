"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema, type ProjectFormValues } from "../schemas/project.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import type { Project } from "../types/project.types";

interface ProjectFormProps {
  initialValues?: Project | null;
  onSubmit: (values: ProjectFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function ProjectForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Project",
}: ProjectFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: [],
      githubUrl: "",
      liveDemoUrl: "",
      teamSize: 1,
      role: "",
      startDate: "",
      endDate: "",
      featured: false,
    },
  });

  const featured = watch("featured");

  useEffect(() => {
    if (initialValues) {
      reset({
        title: initialValues.title,
        description: initialValues.description,
        techStack: initialValues.techStack,
        githubUrl: initialValues.githubUrl || "",
        liveDemoUrl: initialValues.liveDemoUrl || "",
        teamSize: initialValues.teamSize,
        role: initialValues.role,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate || "",
        featured: initialValues.featured,
      });
    } else {
      reset({
        title: "",
        description: "",
        techStack: [],
        githubUrl: "",
        liveDemoUrl: "",
        teamSize: 1,
        role: "",
        startDate: "",
        endDate: "",
        featured: false,
      });
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalInput
        label="Project Title"
        placeholder="e.g. AI-powered Career Agent"
        required
        error={errors.title?.message}
        {...register("title")}
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
          required
          error={errors.teamSize?.message}
          {...register("teamSize", { valueAsNumber: true })}
        />

        <BrutalInput
          label="Tech Stack (Comma-separated)"
          placeholder="e.g. React, TypeScript, Next.js, Node.js"
          required
          error={errors.techStack?.message as string}
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
          label="End Date (Optional)"
          type="date"
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <div className="pt-2">
        <Checkbox
          id="featured"
          label="Feature this project on profile summary"
          error={errors.featured?.message}
          {...register("featured")}
        />
      </div>

      <BrutalTextarea
        label="Description / Details"
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
          onClick={onCancel}
          disabled={isSubmitting}
          className="h-10 px-4 text-xs font-bold uppercase tracking-wider"
        >
          Cancel
        </BrutalButton>
        <BrutalButton
          type="submit"
          disabled={isSubmitting}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </BrutalButton>
      </div>
    </form>
  );
}
