"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { languageSchema, type LanguageFormValues } from "../schemas/language.schema";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Language } from "../types/language.types";

interface LanguageFormProps {
  initialValues?: Language | null;
  onSubmit: (values: LanguageFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "fluent", label: "Fluent" },
  { value: "native", label: "Native" },
];

const commonLanguages = [
  { value: "English", label: "English" },
  { value: "Spanish", label: "Spanish" },
  { value: "French", label: "French" },
  { value: "German", label: "German" },
  { value: "Mandarin", label: "Mandarin" },
  { value: "Hindi", label: "Hindi" },
  { value: "Japanese", label: "Japanese" },
  { value: "Arabic", label: "Arabic" },
  { value: "Russian", label: "Russian" },
  { value: "Portuguese", label: "Portuguese" },
  { value: "Italian", label: "Italian" },
  { value: "Korean", label: "Korean" },
  { value: "Turkish", label: "Turkish" },
  { value: "Bengali", label: "Bengali" },
  { value: "Dutch", label: "Dutch" },
];

export function LanguageForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Language",
}: LanguageFormProps) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LanguageFormValues>({
    resolver: zodResolver(languageSchema),
    defaultValues: {
      language: commonLanguages[0].value,
      readingLevel: "intermediate",
      writingLevel: "intermediate",
      speakingLevel: "intermediate",
      nativeLanguage: false,
    },
  });

  const nativeLanguage = watch("nativeLanguage");

  useEffect(() => {
    if (initialValues) {
      reset({
        language: initialValues.language,
        readingLevel: initialValues.readingLevel,
        writingLevel: initialValues.writingLevel,
        speakingLevel: initialValues.speakingLevel,
        nativeLanguage: initialValues.nativeLanguage,
      });
    } else {
      reset({
        language: commonLanguages[0].value,
        readingLevel: "intermediate",
        writingLevel: "intermediate",
        speakingLevel: "intermediate",
        nativeLanguage: false,
      });
    }
  }, [initialValues, reset]);

  // Force levels to native if nativeLanguage is checked
  useEffect(() => {
    if (nativeLanguage) {
      setValue("readingLevel", "native");
      setValue("writingLevel", "native");
      setValue("speakingLevel", "native");
    }
  }, [nativeLanguage, setValue]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalSelect
        label="Language"
        options={commonLanguages}
        required
        error={errors.language?.message}
        {...register("language")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <BrutalSelect
          label="Speaking"
          options={levelOptions}
          required
          disabled={nativeLanguage}
          error={errors.speakingLevel?.message}
          {...register("speakingLevel")}
        />

        <BrutalSelect
          label="Reading"
          options={levelOptions}
          required
          disabled={nativeLanguage}
          error={errors.readingLevel?.message}
          {...register("readingLevel")}
        />

        <BrutalSelect
          label="Writing"
          options={levelOptions}
          required
          disabled={nativeLanguage}
          error={errors.writingLevel?.message}
          {...register("writingLevel")}
        />
      </div>

      <div className="pt-2">
        <Checkbox
          id="nativeLanguage"
          label="This is my native language"
          error={errors.nativeLanguage?.message}
          {...register("nativeLanguage")}
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
