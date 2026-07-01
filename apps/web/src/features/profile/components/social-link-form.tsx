"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { socialLinkSchema, type SocialLinkFormValues } from "../schemas/social-link.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import type { SocialLink, SocialPlatform } from "../types/social-link.types";
import { SOCIAL_PLATFORM_LABELS } from "../data/social-links.mock";

interface SocialLinkFormProps {
  initialValues?: SocialLink | null;
  onSubmit: (values: SocialLinkFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
  existingPlatforms?: string[];
}

export function SocialLinkForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Link",
  existingPlatforms = [],
}: SocialLinkFormProps) {
  // Filter platform options so the user doesn't add duplicates
  const platformOptions = React.useMemo(() => {
    return Object.entries(SOCIAL_PLATFORM_LABELS)
      .filter(([key]) => !existingPlatforms.includes(key) || initialValues?.platform === key)
      .map(([key, label]) => ({
        value: key,
        label,
      }));
  }, [existingPlatforms, initialValues?.platform]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<SocialLinkFormValues>({
    resolver: zodResolver(socialLinkSchema),
    defaultValues: {
      platform: (platformOptions[0]?.value ?? "github") as SocialPlatform,
      url: "",
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        platform: initialValues.platform,
        url: initialValues.url,
      });
    } else if (platformOptions.length > 0) {
      reset({
        platform: platformOptions[0].value as SocialPlatform,
        url: "",
      });
    }
  }, [initialValues, reset, platformOptions]);

  if (platformOptions.length === 0 && !initialValues) {
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-sm font-bold text-foreground-secondary">
          All social platforms have already been added!
        </p>
        <BrutalButton variant="secondary" onClick={onCancel} className="h-10 px-4 uppercase font-bold text-xs">
          Close
        </BrutalButton>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalSelect
        label="Platform"
        options={platformOptions}
        required
        disabled={!!initialValues}
        error={errors.platform?.message}
        {...register("platform")}
      />

      <BrutalInput
        label="Link URL"
        placeholder="e.g. https://github.com/myusername"
        required
        error={errors.url?.message}
        {...register("url")}
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
