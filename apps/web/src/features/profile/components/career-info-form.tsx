"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerInfoSchema, type CareerInfoFormValues } from "../schemas/profile.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import { BrutalTextarea } from "@/components/ui/brutal-textarea";
import type { CareerInfo } from "../types/profile.types";

interface CareerInfoFormProps {
  initialValues: CareerInfo;
  onSubmit: (values: CareerInfoFormValues) => void;
  onCancel: () => void;
}

const workPreferenceOptions = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export function CareerInfoForm({
  initialValues,
  onSubmit,
  onCancel,
}: CareerInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CareerInfoFormValues>({
    resolver: zodResolver(careerInfoSchema),
    defaultValues: {
      currentRole: "",
      yearsOfExperience: 0,
      preferredRole: "",
      preferredLocation: "",
      workPreference: "remote",
      headline: "",
      summary: "",
    },
  });

  useEffect(() => {
    reset({
      currentRole: initialValues.currentRole || "",
      yearsOfExperience: initialValues.yearsOfExperience || 0,
      preferredRole: initialValues.preferredRole || "",
      preferredLocation: initialValues.preferredLocation || "",
      workPreference: initialValues.workPreference || "remote",
      headline: initialValues.headline || "",
      summary: initialValues.summary || "",
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <BrutalInput
        label="Professional Headline"
        placeholder="e.g. Senior Frontend Engineer | React & Next.js Specialist"
        required
        error={errors.headline?.message}
        {...register("headline")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Current Role"
          placeholder="e.g. Frontend Developer"
          required
          error={errors.currentRole?.message}
          {...register("currentRole")}
        />

        <BrutalInput
          label="Years of Experience"
          type="number"
          min="0"
          max="50"
          required
          error={errors.yearsOfExperience?.message}
          {...register("yearsOfExperience", { valueAsNumber: true })}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Preferred Role"
          placeholder="e.g. Senior Frontend Engineer"
          required
          error={errors.preferredRole?.message}
          {...register("preferredRole")}
        />

        <BrutalInput
          label="Preferred Location"
          placeholder="e.g. Remote or Bengaluru"
          required
          error={errors.preferredLocation?.message}
          {...register("preferredLocation")}
        />
      </div>

      <BrutalSelect
        label="Work Preference"
        options={workPreferenceOptions}
        required
        error={errors.workPreference?.message}
        {...register("workPreference")}
      />

      <BrutalTextarea
        label="Professional Summary"
        placeholder="Brief summary of your achievements and skills..."
        error={errors.summary?.message}
        rows={4}
        {...register("summary")}
      />

      <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-border/10">
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
          {isSubmitting ? "Saving..." : "Save Changes"}
        </BrutalButton>
      </div>
    </form>
  );
}
