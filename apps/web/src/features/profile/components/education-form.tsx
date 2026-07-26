"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  educationSchema,
  type EducationFormValues,
} from "../schemas/education.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import type { Education } from "../types/education.types";

interface EducationFormProps {
  initialValues?: Education | null;
  onSubmit: (values: EducationFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  existingEducation?: Education[];
}

export function EducationForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Education",
  existingEducation = [],
}: EducationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    setError,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<EducationFormValues>({
    resolver: zodResolver(
      educationSchema,
    ) as unknown as Resolver<EducationFormValues>,
    defaultValues: {
      degree: "",
      fieldOfStudy: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      currentStudy: false,
      cgpa: "",
      description: "",
      highestEducation: false,
    },
  });

  // Watch currentStudy state
  const currentStudy = watch("currentStudy");

  useEffect(() => {
    if (initialValues) {
      reset({
        degree: initialValues.degree,
        fieldOfStudy: initialValues.fieldOfStudy,
        institution: initialValues.institution,
        location: initialValues.location || "",
        startDate: initialValues.startDate,
        endDate: initialValues.endDate || "",
        currentStudy: initialValues.currentStudy,
        cgpa: initialValues.cgpa || "",
        description: initialValues.description || "",
        highestEducation: initialValues.highestEducation || false,
      });
    } else {
      reset({
        degree: "",
        fieldOfStudy: "",
        institution: "",
        location: "",
        startDate: "",
        endDate: "",
        currentStudy: false,
        cgpa: "",
        description: "",
        highestEducation: false,
      });
    }
  }, [initialValues, reset]);

  // Clear endDate when currentStudy is checked
  useEffect(() => {
    if (currentStudy) {
      setValue("endDate", "");
    }
  }, [currentStudy, setValue]);

  const handleFormSubmit = (values: EducationFormValues) => {
    const isDuplicate = existingEducation.some(
      (edu) =>
        edu.institution.toLowerCase().trim() ===
          values.institution.toLowerCase().trim() &&
        edu.degree.toLowerCase().trim() ===
          values.degree.toLowerCase().trim() &&
        edu.startDate === values.startDate &&
        edu.id !== initialValues?.id,
    );

    if (isDuplicate) {
      setError("institution", {
        type: "manual",
        message:
          "An identical degree at this institution with the same start date has already been added.",
      });
      return;
    }

    onSubmit(values);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
      <BrutalInput
        label="Degree / Qualification"
        placeholder="e.g. Bachelor of Technology (B.Tech), MBA"
        required
        error={errors.degree?.message}
        {...register("degree")}
      />

      <BrutalInput
        label="Field of Study"
        placeholder="e.g. Computer Science, Finance"
        required
        error={errors.fieldOfStudy?.message}
        {...register("fieldOfStudy")}
      />

      <BrutalInput
        label="Institution / University"
        placeholder="e.g. ABC Institute of Technology"
        required
        error={errors.institution?.message}
        {...register("institution")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Location"
          placeholder="e.g. Bengaluru, India"
          error={errors.location?.message}
          {...register("location")}
        />

        <BrutalInput
          label="Grade / CGPA / Percentage"
          placeholder="e.g. 8.5 / 10, 92.4%"
          error={errors.cgpa?.message}
          {...register("cgpa")}
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
          required={!currentStudy}
          disabled={currentStudy}
          error={errors.endDate?.message}
          {...register("endDate")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <Checkbox
          id="currentStudy"
          label="I am currently studying here"
          error={errors.currentStudy?.message}
          {...register("currentStudy")}
        />

        <Checkbox
          id="highestEducation"
          label="This is my highest education level"
          error={errors.highestEducation?.message}
          {...register("highestEducation")}
        />
      </div>

      <BrutalTextarea
        label="Description / Achievements (Optional)"
        placeholder="Describe major projects, activities, honors, or clubs..."
        error={errors.description?.message}
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
