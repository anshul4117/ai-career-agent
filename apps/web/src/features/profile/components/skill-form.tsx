"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { skillSchema, type SkillFormValues } from "../schemas/skill.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Checkbox } from "@/components/ui/checkbox";
import type { Skill } from "../types/skill.types";
import { SKILL_CATEGORIES } from "../data/skills.mock";

interface SkillFormProps {
  initialValues?: Skill | null;
  onSubmit: (values: SkillFormValues) => void;
  onCancel: () => void;
  submitLabel?: string;
}

const levelOptions = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
  { value: "expert", label: "Expert" },
];

const categoryOptions = SKILL_CATEGORIES.map((cat) => ({
  value: cat,
  label: cat,
}));

export function SkillForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel = "Save Skill",
}: SkillFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SkillFormValues>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: "",
      category: categoryOptions[0].value,
      level: "intermediate",
      yearsOfExperience: 1,
      featured: false,
    },
  });
  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name,
        category: initialValues.category,
        level: initialValues.level,
        yearsOfExperience: initialValues.yearsOfExperience,
        featured: initialValues.featured,
      });
    } else {
      reset({
        name: "",
        category: categoryOptions[0].value,
        level: "intermediate",
        yearsOfExperience: 1,
        featured: false,
      });
    }
  }, [initialValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <BrutalInput
        label="Skill Name"
        placeholder="e.g. TypeScript, Product Management"
        required
        error={errors.name?.message}
        {...register("name")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <BrutalSelect
          label="Category"
          options={categoryOptions}
          required
          error={errors.category?.message}
          {...register("category")}
        />

        <BrutalSelect
          label="Skill Level"
          options={levelOptions}
          required
          error={errors.level?.message}
          {...register("level")}
        />
      </div>

      <BrutalInput
        label="Years of Experience"
        type="number"
        min="0"
        max="50"
        required
        error={errors.yearsOfExperience?.message}
        {...register("yearsOfExperience", { valueAsNumber: true })}
      />

      <div className="pt-2">
        <Checkbox
          id="featured"
          label="Feature this skill on profile summary"
          error={errors.featured?.message}
          {...register("featured")}
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
