"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { FolderOpen, ArrowLeft, Plus } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { ProjectsGrid } from "@/features/profile/components/projects-grid";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { ProjectForm } from "@/features/profile/components/project-form";
import type { Project } from "@/features/profile/types/project.types";
import { ProjectFormValues } from "@/features/profile/schemas/project.schema";

export default function ProjectsPage() {
  const { projects, isLoading, loadProfile, addProject, updateProject, deleteProject, toggleFeaturedProject } = useProfileStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProj, setEditingProj] = useState<Project | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingProj(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (project: Project) => {
    setEditingProj(project);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleFormSubmit = (values: ProjectFormValues) => {
    if (editingProj) {
      updateProject(editingProj.id, values);
    } else {
      addProject(values);
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
            <FolderOpen className="h-6 w-6 text-primary shrink-0" />
            Projects & Portfolio
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </BrutalButton>
      </div>

      {/* Projects Grid */}
      <ProjectsGrid
        projects={projects}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onToggleFeatured={toggleFeaturedProject}
        onAddClick={handleAddClick}
      />

      {/* Add / Edit Dialog */}
      <ProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingProj ? "Edit Project" : "Add Project Record"}
      >
        <ProjectForm
          initialValues={editingProj}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingProj ? "Save Changes" : "Save Project"}
        />
      </ProfileDialog>
    </div>
  );
}
