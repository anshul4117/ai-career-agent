"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { GraduationCap, ArrowLeft, Plus } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { EducationTimeline } from "@/features/profile/components/education-timeline";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { EducationForm } from "@/features/profile/components/education-form";
import type { Education } from "@/features/profile/types/education.types";

import { EducationFormValues } from "@/features/profile/schemas/education.schema";

export default function EducationPage() {
  const { education, isLoading, loadProfile, addEducation, updateEducation, deleteEducation } = useProfileStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEdu, setEditingEdu] = useState<Education | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingEdu(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (edu: Education) => {
    setEditingEdu(edu);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this education record?")) {
      deleteEducation(id);
    }
  };

  const handleFormSubmit = (values: EducationFormValues) => {
    if (editingEdu) {
      updateEducation(editingEdu.id, values);
    } else {
      addEducation(values);
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
            <GraduationCap className="h-6 w-6 text-primary shrink-0" />
            Education History
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Education
        </BrutalButton>
      </div>

      {/* Education Timeline */}
      <EducationTimeline
        education={education}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAddClick={handleAddClick}
      />

      {/* Add / Edit Dialog */}
      <ProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingEdu ? "Edit Education" : "Add Education Record"}
      >
        <EducationForm
          initialValues={editingEdu}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingEdu ? "Save Changes" : "Save Record"}
        />
      </ProfileDialog>
    </div>
  );
}
