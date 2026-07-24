"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  personalInfoSchema,
  type PersonalInfoFormValues,
} from "../schemas/profile.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";

interface PersonalInfoFormProps {
  initialValues: PersonalInfoFormValues;
  onSubmit: (values: PersonalInfoFormValues) => void;
  onCancel: () => void;
}

export function PersonalInfoForm({
  initialValues,
  onSubmit,
  onCancel,
}: PersonalInfoFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      portfolioUrl: "",
      githubUrl: "",
      linkedinUrl: "",
    },
  });

  useEffect(() => {
    reset({
      firstName: initialValues.firstName || "",
      lastName: initialValues.lastName || "",
      headline: initialValues.headline || "",
      email: initialValues.email || "",
      phone: initialValues.phone || "",
      location: initialValues.location || "",
      portfolioUrl: initialValues.portfolioUrl || "",
      githubUrl: initialValues.githubUrl || "",
      linkedinUrl: initialValues.linkedinUrl || "",
    });
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="First Name"
          placeholder="e.g. Anshul"
          required
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <BrutalInput
          label="Last Name"
          placeholder="e.g. Kumar"
          required
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <BrutalInput
        label="Professional Headline"
        placeholder="e.g. Full Stack Developer | AI Specialist"
        required
        error={errors.headline?.message}
        {...register("headline")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Email Address"
          type="email"
          placeholder="e.g. user@domain.com"
          required
          error={errors.email?.message}
          {...register("email")}
        />

        <BrutalInput
          label="Phone Number"
          type="tel"
          placeholder="e.g. +91 98765 43210"
          required
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <BrutalInput
        label="Location"
        placeholder="e.g. Bengaluru, India"
        required
        error={errors.location?.message}
        {...register("location")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BrutalInput
          label="Portfolio URL"
          placeholder="e.g. https://portfolio.com"
          error={errors.portfolioUrl?.message}
          {...register("portfolioUrl")}
        />

        <BrutalInput
          label="GitHub URL"
          placeholder="e.g. https://github.com/user"
          error={errors.githubUrl?.message}
          {...register("githubUrl")}
        />

        <BrutalInput
          label="LinkedIn URL"
          placeholder="e.g. https://linkedin.com/in/user"
          error={errors.linkedinUrl?.message}
          {...register("linkedinUrl")}
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-border/10">
        <BrutalButton
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          Cancel
        </BrutalButton>
        <BrutalButton
          type="submit"
          variant="default"
          disabled={isSubmitting}
          className="px-4 py-2 text-xs font-bold uppercase tracking-wider"
        >
          {isSubmitting ? "Saving..." : "Save Details"}
        </BrutalButton>
      </div>
    </form>
  );
}
