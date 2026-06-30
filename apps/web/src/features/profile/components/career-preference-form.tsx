"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { careerPreferenceSchema, type CareerPreferenceFormValues } from "../schemas/career-preference.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import type { CareerPreference } from "../types/career-preference.types";

interface CareerPreferenceFormProps {
  initialValues?: CareerPreference | null;
  onSubmit: (values: CareerPreferenceFormValues) => void;
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

const currencyOptions = [
  { value: "INR", label: "INR (₹)" },
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "CAD", label: "CAD ($)" },
  { value: "AUD", label: "AUD ($)" },
];

export function CareerPreferenceForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Preferences",
}: CareerPreferenceFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CareerPreferenceFormValues>({
    resolver: zodResolver(careerPreferenceSchema),
    defaultValues: {
      preferredRole: "",
      employmentType: "full-time",
      preferredLocation: "",
      workMode: "remote",
      expectedSalary: "",
      currency: "INR",
      noticePeriod: "",
      openToWork: true,
      visaSponsorshipRequired: false,
      relocationWillingness: true,
      preferredIndustry: "",
      preferredCompanySize: "",
      preferredShift: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        preferredRole: initialValues.preferredRole,
        employmentType: initialValues.employmentType,
        preferredLocation: initialValues.preferredLocation,
        workMode: initialValues.workMode,
        expectedSalary: initialValues.expectedSalary,
        currency: initialValues.currency || "INR",
        noticePeriod: initialValues.noticePeriod,
        openToWork: initialValues.openToWork,
        visaSponsorshipRequired: initialValues.visaSponsorshipRequired,
        relocationWillingness: initialValues.relocationWillingness,
        preferredIndustry: initialValues.preferredIndustry,
        preferredCompanySize: initialValues.preferredCompanySize,
        preferredShift: initialValues.preferredShift,
      });
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Preferred Role / Title"
          placeholder="e.g. Senior Frontend Engineer"
          required
          error={errors.preferredRole?.message}
          {...register("preferredRole")}
        />

        <BrutalInput
          label="Preferred Job Location"
          placeholder="e.g. Bengaluru, India or Remote"
          required
          error={errors.preferredLocation?.message}
          {...register("preferredLocation")}
        />
      </div>

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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <BrutalInput
            label="Expected Salary"
            placeholder="e.g. 24,00,000 or 120,000"
            required
            error={errors.expectedSalary?.message}
            {...register("expectedSalary")}
          />
        </div>
        <BrutalSelect
          label="Currency"
          options={currencyOptions}
          required
          error={errors.currency?.message}
          {...register("currency")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Preferred Industry"
          placeholder="e.g. Fintech, Edtech, SaaS, AI"
          required
          error={errors.preferredIndustry?.message}
          {...register("preferredIndustry")}
        />

        <BrutalInput
          label="Preferred Company Size"
          placeholder="e.g. 11-50, 51-200, 1000+ employees"
          required
          error={errors.preferredCompanySize?.message}
          {...register("preferredCompanySize")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Notice Period"
          placeholder="e.g. 30 days, Immediate"
          required
          error={errors.noticePeriod?.message}
          {...register("noticePeriod")}
        />

        <BrutalInput
          label="Preferred Shift / Timings"
          placeholder="e.g. Day Shift, Night Shift, Flexible"
          required
          error={errors.preferredShift?.message}
          {...register("preferredShift")}
        />
      </div>

      <div className="space-y-3 pt-2 border-t border-border/10">
        <Checkbox
          id="openToWork"
          label="Open to work (shows Open To Work status)"
          error={errors.openToWork?.message}
          {...register("openToWork")}
        />

        <Checkbox
          id="visaSponsorshipRequired"
          label="Visa sponsorship required for employment"
          error={errors.visaSponsorshipRequired?.message}
          {...register("visaSponsorshipRequired")}
        />

        <Checkbox
          id="relocationWillingness"
          label="Willing to relocate for preferred roles"
          error={errors.relocationWillingness?.message}
          {...register("relocationWillingness")}
        />
      </div>

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
