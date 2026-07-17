"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Code2, ArrowLeft, Plus } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { SkillFilters } from "@/features/profile/components/skill-filters";
import { SkillsList } from "@/features/profile/components/skills-list";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { SkillForm } from "@/features/profile/components/skill-form";
import type { Skill } from "@/features/profile/types/skill.types";
import { SkillFormValues } from "@/features/profile/schemas/skill.schema";
import { PageLoader } from "@/components/ui/brand-loader";

export default function SkillsPage() {
  const { skills, isLoading, loadProfile, addSkill, updateSkill, deleteSkill } = useProfileStore();
  const { confirm, ConfirmationDialog } = useConfirm();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState<"alphabetical" | "experience">("alphabetical");

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    // Make sure profile and skills are loaded
    loadProfile();
  }, [loadProfile]);

  // Filter and sort skills
  const processedSkills = useMemo(() => {
    let result = [...skills];

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((s) => s.name.toLowerCase().includes(query));
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((s) => s.category === selectedCategory);
    }

    // Sort
    if (sortBy === "alphabetical") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "experience") {
      result.sort((a, b) => b.yearsOfExperience - a.yearsOfExperience);
    }

    return result;
  }, [skills, searchQuery, selectedCategory, sortBy]);

  const handleAddClick = () => {
    setEditingSkill(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (skill: Skill) => {
    setEditingSkill(skill);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Skill",
      description: "Are you sure you want to delete this skill? This action cannot be undone.",
      isDestructive: true,
      confirmLabel: "Delete"
    });
    if (isConfirmed) {
      deleteSkill(id);
    }
  };

  const handleFormSubmit = (values: SkillFormValues) => {
    if (editingSkill) {
      updateSkill(editingSkill.id, values);
    } else {
      addSkill(values);
    }
    setIsDialogOpen(false);
  };

  if (isLoading) {
    return <PageLoader label="Loading candidate skills..." />;
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
            <Code2 className="h-6 w-6 text-primary shrink-0" />
            Manage Skills
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Skill
        </BrutalButton>
      </div>

      {/* Filters */}
      <SkillFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      {/* Skills List */}
      <SkillsList
        skills={processedSkills}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAddClick={handleAddClick}
      />

      {/* Add / Edit Dialog */}
      <ProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingSkill ? "Edit Skill" : "Add New Skill"}
      >
        <SkillForm
          initialValues={editingSkill}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingSkill ? "Save Changes" : "Add Skill"}
        />
      </ProfileDialog>

      <ConfirmationDialog />
    </div>
  );
}
