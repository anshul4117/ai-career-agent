"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactInfoSchema, type ContactInfoFormValues } from "../schemas/profile.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import type { ContactInfo } from "../types/profile.types";

interface ContactInfoFormProps {
  initialValues: ContactInfo;
  onSubmit: (values: ContactInfoFormValues) => void;
  onCancel: () => void;
}

export function ContactInfoForm({
  initialValues,
  onSubmit,
  onCancel,
}: ContactInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ContactInfoFormValues>({
    resolver: zodResolver(contactInfoSchema),
    defaultValues: {
      email: "",
      phone: "",
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    reset({
      email: initialValues.email || "",
      phone: initialValues.phone || "",
      city: initialValues.city || "",
      state: initialValues.state || "",
      country: initialValues.country || "",
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <BrutalInput
        label="Email Address"
        type="email"
        placeholder="e.g. john.doe@example.com"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <BrutalInput
        label="Phone Number"
        placeholder="e.g. +91 9988776655"
        required
        error={errors.phone?.message}
        {...register("phone")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2">
          <BrutalInput
            label="City"
            placeholder="e.g. Bengaluru"
            required
            error={errors.city?.message}
            {...register("city")}
          />
        </div>
        <BrutalInput
          label="State"
          placeholder="e.g. Karnataka"
          error={errors.state?.message}
          {...register("state")}
        />
      </div>

      <BrutalInput
        label="Country"
        placeholder="e.g. India"
        required
        error={errors.country?.message}
        {...register("country")}
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
