"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Briefcase, ArrowLeft, Plus } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { ExperienceTimeline } from "@/features/profile/components/experience-timeline";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { ExperienceForm } from "@/features/profile/components/experience-form";
import type { Experience } from "@/features/profile/types/experience.types";
import { ExperienceFormValues } from "@/features/profile/schemas/experience.schema";

export default function ExperiencePage() {
  const { experience, isLoading, loadProfile, addExperience, updateExperience, deleteExperience } = useProfileStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Experience | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingExp(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (exp: Experience) => {
    setEditingExp(exp);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this experience record?")) {
      deleteExperience(id);
    }
  };

  const handleFormSubmit = (values: ExperienceFormValues) => {
    const mappedValues = {
      ...values,
      endDate: values.endDate ?? null,
    };
    if (editingExp) {
      updateExperience(editingExp.id, mappedValues);
    } else {
      addExperience(mappedValues);
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full min-w-0">
      {/* Back button and Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/profile"
            className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </Link>
          <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
            <Briefcase className="h-6 w-6 text-primary shrink-0" />
            Work Experience
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </BrutalButton>
      </div>

      {/* Experience Timeline */}
      <ExperienceTimeline
        experience={experience}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAddClick={handleAddClick}
      />

      {/* Add / Edit Dialog */}
      <ProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingExp ? "Edit Work Experience" : "Add Experience Record"}
      >
        <ExperienceForm
          initialValues={editingExp}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingExp ? "Save Changes" : "Save Record"}
        />
      </ProfileDialog>
    </div>
  );
}
