"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { Checkbox } from "@/components/ui/checkbox";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import { Plus, Trash2 } from "lucide-react";
import type {
  Experience,
  EmploymentType,
  WorkMode,
} from "../types/experience.types";
import type { ExperienceFormValues } from "../schemas/experience.schema";

interface ExperienceFormProps {
  initialValues?: Experience | null;
  onSubmit: (values: ExperienceFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  existingExperiences?: Experience[];
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

const experienceFormInputsSchema = z
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
    employmentType: z.enum(
      ["full-time", "part-time", "internship", "contract", "freelance"],
      {
        errorMap: () => ({ message: "Please select an employment type" }),
      },
    ),
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
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/, "End date must be in YYYY-MM-DD format")
      .or(z.literal(""))
      .nullable()
      .optional(),
    currentPosition: z.boolean(),
    description: z
      .string()
      .min(1, "Description is required")
      .max(1000, "Description must be under 1000 characters")
      .trim(),
    technologiesUsed: z.string().optional(),
    responsibilities: z.array(z.object({ value: z.string() })).default([]),
    achievements: z.array(z.object({ value: z.string() })).default([]),
  })
  .refine(
    (data) => {
      if (data.currentPosition) return true;
      if (!data.endDate || data.endDate === "") return false;
      return new Date(data.startDate) <= new Date(data.endDate);
    },
    {
      message: "End date must be after the start date",
      path: ["endDate"],
    },
  );

type ExperienceFormInputs = z.infer<typeof experienceFormInputsSchema>;

export function ExperienceForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Experience",
  existingExperiences = [],
}: ExperienceFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    control,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ExperienceFormInputs>({
    resolver: zodResolver(
      experienceFormInputsSchema,
    ) as unknown as Resolver<ExperienceFormInputs>,
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
      technologiesUsed: "",
      responsibilities: [],
      achievements: [],
    },
  });

  const {
    fields: respFields,
    append: appendResp,
    remove: removeResp,
  } = useFieldArray({
    control,
    name: "responsibilities",
  });

  const {
    fields: achFields,
    append: appendAch,
    remove: removeAch,
  } = useFieldArray({
    control,
    name: "achievements",
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
        technologiesUsed: initialValues.technologiesUsed
          ? initialValues.technologiesUsed.join(", ")
          : "",
        responsibilities: initialValues.responsibilities
          ? initialValues.responsibilities.map((r) => ({ value: r }))
          : [],
        achievements: initialValues.achievements
          ? initialValues.achievements.map((a) => ({ value: a }))
          : [],
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
        technologiesUsed: "",
        responsibilities: [{ value: "" }],
        achievements: [{ value: "" }],
      });
    }
  }, [initialValues, reset]);

  // Clear endDate when currentPosition is checked
  useEffect(() => {
    if (currentPosition) {
      setValue("endDate", "");
    }
  }, [currentPosition, setValue]);

  const handleFormSubmit = (data: ExperienceFormInputs) => {
    const techs = data.technologiesUsed
      ? data.technologiesUsed
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [];
    const resps = data.responsibilities
      .map((r) => r.value.trim())
      .filter(Boolean);
    const achs = data.achievements.map((a) => a.value.trim()).filter(Boolean);

    // Duplicate check
    const isDuplicate = existingExperiences.some(
      (exp) =>
        exp.companyName.toLowerCase().trim() ===
          data.companyName.toLowerCase().trim() &&
        exp.jobTitle.toLowerCase().trim() ===
          data.jobTitle.toLowerCase().trim() &&
        exp.startDate === data.startDate &&
        exp.id !== initialValues?.id,
    );

    if (isDuplicate) {
      setError("companyName", {
        type: "manual",
        message:
          "An identical position at this company and start date has already been added.",
      });
      return;
    }

    onSubmit({
      jobTitle: data.jobTitle,
      companyName: data.companyName,
      employmentType: data.employmentType as EmploymentType,
      location: data.location,
      workMode: data.workMode as WorkMode,
      startDate: data.startDate,
      endDate: data.endDate || null,
      currentPosition: data.currentPosition,
      description: data.description,
      technologiesUsed: techs,
      responsibilities: resps,
      achievements: achs,
    });
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
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
        label="Description / Summary"
        placeholder="Provide an overview of your role..."
        error={errors.description?.message}
        required
        rows={3}
        {...register("description")}
      />

      {/* Dynamic List: Responsibilities */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Responsibilities (Dynamic List)
          </label>
          <BrutalButton
            type="button"
            onClick={() => appendResp({ value: "" })}
            variant="secondary"
            className="h-7 px-2 text-[10px] uppercase font-bold flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add Item
          </BrutalButton>
        </div>

        {respFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <BrutalInput
              placeholder={`Responsibility #${index + 1}`}
              className="flex-1"
              error={errors.responsibilities?.[index]?.value?.message}
              {...register(`responsibilities.${index}.value` as const, {
                required: "Cannot be empty",
              })}
            />
            <BrutalButton
              type="button"
              onClick={() => removeResp(index)}
              variant="secondary"
              className="h-10 w-10 p-0 flex items-center justify-center text-error border-error/20 hover:border-error shrink-0"
              aria-label={`Remove responsibility #${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </BrutalButton>
          </div>
        ))}
      </div>

      {/* Dynamic List: Achievements */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-black uppercase tracking-wider text-foreground">
            Key Achievements (Dynamic List)
          </label>
          <BrutalButton
            type="button"
            onClick={() => appendAch({ value: "" })}
            variant="secondary"
            className="h-7 px-2 text-[10px] uppercase font-bold flex items-center gap-1"
          >
            <Plus className="h-3 w-3" /> Add Item
          </BrutalButton>
        </div>

        {achFields.map((field, index) => (
          <div key={field.id} className="flex items-center gap-2">
            <BrutalInput
              placeholder={`Achievement #${index + 1}`}
              className="flex-1"
              error={errors.achievements?.[index]?.value?.message}
              {...register(`achievements.${index}.value` as const, {
                required: "Cannot be empty",
              })}
            />
            <BrutalButton
              type="button"
              onClick={() => removeAch(index)}
              variant="secondary"
              className="h-10 w-10 p-0 flex items-center justify-center text-error border-error/20 hover:border-error shrink-0"
              aria-label={`Remove achievement #${index + 1}`}
            >
              <Trash2 className="h-4 w-4" />
            </BrutalButton>
          </div>
        ))}
      </div>

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
