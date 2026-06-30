"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { certificationSchema, type CertificationFormValues } from "../schemas/certification.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Certification } from "../types/certification.types";

interface CertificationFormProps {
  initialValues?: Certification | null;
  onSubmit: (values: CertificationFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export function CertificationForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Certification",
}: CertificationFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      name: "",
      issuingOrganization: "",
      issueDate: "",
      expiryDate: "",
      credentialId: "",
      credentialUrl: "",
      neverExpires: false,
    },
  });

  const neverExpires = watch("neverExpires");

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        issuingOrganization: initialValues.issuingOrganization,
        issueDate: initialValues.issueDate,
        expiryDate: initialValues.expiryDate || "",
        credentialId: initialValues.credentialId || "",
        credentialUrl: initialValues.credentialUrl || "",
        neverExpires: initialValues.neverExpires,
      });
    } else {
      reset({
        name: "",
        issuingOrganization: "",
        issueDate: "",
        expiryDate: "",
        credentialId: "",
        credentialUrl: "",
        neverExpires: false,
      });
    }
  }, [initialValues, reset]);

  // Clear expiryDate if neverExpires is checked
  useEffect(() => {
    if (neverExpires) {
      setValue("expiryDate", "");
    }
  }, [neverExpires, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalInput
        label="Certification Name"
        placeholder="e.g. AWS Certified Solutions Architect"
        required
        error={errors.name?.message}
        {...register("name")}
      />

      <BrutalInput
        label="Issuing Organization"
        placeholder="e.g. Amazon Web Services (AWS), Google"
        required
        error={errors.issuingOrganization?.message}
        {...register("issuingOrganization")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Issue Date"
          type="date"
          required
          error={errors.issueDate?.message}
          {...register("issueDate")}
        />

        <BrutalInput
          label="Expiry Date"
          type="date"
          required={!neverExpires}
          disabled={neverExpires}
          error={errors.expiryDate?.message}
          {...register("expiryDate")}
        />
      </div>

      <div className="pt-2">
        <Checkbox
          id="neverExpires"
          label="This certification never expires"
          error={errors.neverExpires?.message}
          {...register("neverExpires")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalInput
          label="Credential ID (Optional)"
          placeholder="e.g. AWS-ASA-9988"
          error={errors.credentialId?.message as string}
          {...register("credentialId")}
        />

        <BrutalInput
          label="Credential URL (Optional)"
          placeholder="e.g. https://aws.amazon.com/verify/..."
          error={errors.credentialUrl?.message as string}
          {...register("credentialUrl")}
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
