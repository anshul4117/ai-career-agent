"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema, type ExperienceFormValues } from "../schemas/experience.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Checkbox } from "@/components/ui/checkbox";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import type { Experience } from "../types/experience.types";

interface ExperienceFormProps {
  initialValues?: Experience | null;
  onSubmit: (values: ExperienceFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const employmentOptions = [
  { value: "full-time", label: "Full-time" },
  { value: "part-time", label: "Part-time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const workModeOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export function ExperienceForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Experience",
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceSchema) as unknown as Resolver<ExperienceFormValues>,
    defaultValues: {
      jobTitle: "",
      companyName: "",
      employmentType: "full-time",
      location: "",
      workMode: "onsite",
      startDate: "",
      endDate: "",
      currentPosition: false,
      description: "",
      technologiesUsed: [],
    },
  });

  const currentPosition = watch("currentPosition");

  useEffect(() => {
    if (initialValues) {
      reset({
        jobTitle: initialValues.jobTitle,
        companyName: initialValues.companyName,
        employmentType: initialValues.employmentType,
        location: initialValues.location,
        workMode: initialValues.workMode,
        startDate: initialValues.startDate,
        endDate: initialValues.endDate || "",
        currentPosition: initialValues.currentPosition,
        description: initialValues.description || "",
        technologiesUsed: initialValues.technologiesUsed,
      });
    } else {
      reset({
        jobTitle: "",
        companyName: "",
        employmentType: "full-time",
        location: "",
        workMode: "onsite",
        startDate: "",
        endDate: "",
        currentPosition: false,
        description: "",
        technologiesUsed: [],
      });
    }
  }, [initialValues, reset]);

  // Clear endDate when currentPosition is checked
  useEffect(() => {
    if (currentPosition) {
      setValue("endDate", "");
    }
  }, [currentPosition, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalInput
        label="Job Title"
        placeholder="e.g. Senior Frontend Engineer"
        required
        error={errors.jobTitle?.message}
        {...register("jobTitle")}
      />

      <BrutalInput
        label="Company Name"
        placeholder="e.g. Google, Stripe"
        required
        error={errors.companyName?.message}
        {...register("companyName")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalSelect
          label="Employment Type"
          options={employmentOptions}
          required
          error={errors.employmentType?.message}
          {...register("employmentType")}
        />

        <BrutalSelect
          label="Work Mode"
          options={workModeOptions}
          required
          error={errors.workMode?.message}
          {...register("workMode")}
        />
      </div>

      <BrutalInput
        label="Location"
        placeholder="e.g. Bengaluru, India or San Francisco, CA"
        required
        error={errors.location?.message}
        {...register("location")}
      />

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
          required={!currentPosition}
          disabled={currentPosition}
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <div className="pt-2">
        <Checkbox
          id="currentPosition"
          label="I currently work here"
          error={errors.currentPosition?.message}
          {...register("currentPosition")}
        />
      </div>

      <BrutalInput
        label="Technologies Used (Comma-separated)"
        placeholder="e.g. TypeScript, React, Next.js, Node.js"
        error={errors.technologiesUsed?.message}
        {...register("technologiesUsed")}
      />

      <BrutalTextarea
        label="Description / Key Achievements"
        placeholder="Describe your responsibilities, impact, and projects..."
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
