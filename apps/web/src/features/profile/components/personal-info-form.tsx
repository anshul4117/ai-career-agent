"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { personalInfoSchema, type PersonalInfoFormValues } from "../schemas/profile.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import type { PersonalInfo } from "../types/profile.types";

interface PersonalInfoFormProps {
  initialValues: PersonalInfo;
  onSubmit: (values: PersonalInfoFormValues) => void;
  onCancel: () => void;
}

const genderOptions = [
  { value: "prefer_not_to_say", label: "Prefer not to say" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non_binary", label: "Non-binary" },
];

export function PersonalInfoForm({
  initialValues,
  onSubmit,
  onCancel,
}: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "prefer_not_to_say",
      nationality: "",
    },
  });

  useEffect(() => {
    reset({
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      dateOfBirth: initialValues.dateOfBirth || "",
      gender: initialValues.gender || "prefer_not_to_say",
      nationality: initialValues.nationality || "",
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="First Name"
          placeholder="e.g. John"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <BrutalInput
          label="Last Name"
          placeholder="e.g. Doe"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Date of Birth"
          type="date"
          error={errors.dateOfBirth?.message as string}
          {...register("dateOfBirth")}
        />

        <BrutalSelect
          label="Gender"
          options={genderOptions}
          error={errors.gender?.message}
          {...register("gender")}
        />
      </div>

      <BrutalInput
        label="Nationality"
        placeholder="e.g. Indian"
        error={errors.nationality?.message as string}
        {...register("nationality")}
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
