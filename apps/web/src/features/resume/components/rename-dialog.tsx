"use client";

import React, { useEffect } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";

interface RenameDialogProps {
  isOpen: boolean;
  onClose: () => void;
  originalName: string;
  existingNames: string[];
  onRename: (newName: string) => Promise<void>;
}

const renameSchema = (existingNames: string[], originalName: string) =>
  z.object({
    name: z
      .string()
      .min(1, "Filename cannot be empty")
      .trim()
      .refine((val) => {
        const ext = val.split(".").pop()?.toLowerCase();
        return ["pdf", "doc", "docx"].includes(ext || "");
      }, "Filename must keep a valid extension (.pdf, .doc, or .docx)")
      .refine((val) => {
        if (val.toLowerCase().trim() === originalName.toLowerCase().trim())
          return true;
        const isDuplicate = existingNames.some(
          (name) => name.toLowerCase().trim() === val.toLowerCase().trim(),
        );
        return !isDuplicate;
      }, "A resume with this filename has already been uploaded"),
  });

type RenameFormValues = { name: string };

export function RenameDialog({
  isOpen,
  onClose,
  originalName,
  existingNames,
  onRename,
}: RenameDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RenameFormValues>({
    resolver: zodResolver(
      renameSchema(existingNames, originalName),
    ) as unknown as Resolver<RenameFormValues>,
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({ name: originalName });
    }
  }, [isOpen, originalName, reset]);

  const handleFormSubmit = async (values: RenameFormValues) => {
    try {
      await onRename(values.name);
      onClose();
    } catch {
      // handled by parent toast
    }
  };

  return (
    <ProfileDialog isOpen={isOpen} onClose={onClose} title="Rename Resume File">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <BrutalInput
          label="File Name"
          placeholder="e.g. my-resume.pdf"
          required
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-border/10">
          <BrutalButton
            type="button"
            variant="secondary"
            onClick={onClose}
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
            {isSubmitting ? "Renaming..." : "Rename File"}
          </BrutalButton>
        </div>
      </form>
    </ProfileDialog>
  );
}
