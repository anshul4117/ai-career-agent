"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { MessageSquare, ArrowLeft, Plus } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { LanguageItem } from "@/features/profile/components/language-item";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { LanguageForm } from "@/features/profile/components/language-form";
import type { Language } from "@/features/profile/types/language.types";
import { LanguageFormValues } from "@/features/profile/schemas/language.schema";

export default function LanguagesPage() {
  const { languages, isLoading, loadProfile, addLanguage, updateLanguage, deleteLanguage } = useProfileStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLang, setEditingLang] = useState<Language | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingLang(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (lang: Language) => {
    setEditingLang(lang);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this language?")) {
      deleteLanguage(id);
    }
  };

  const handleFormSubmit = (values: LanguageFormValues) => {
    if (editingLang) {
      updateLanguage(editingLang.id, values);
    } else {
      addLanguage(values);
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
            <MessageSquare className="h-6 w-6 text-primary shrink-0" />
            Manage Languages
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Language
        </BrutalButton>
      </div>

      {languages.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
          <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
            <MessageSquare className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight">
              No Languages Added Yet
            </Heading>
            <Text className="text-foreground-secondary text-xs leading-relaxed">
              List the languages you speak and write to showcase your communication strengths.
            </Text>
          </div>
          <BrutalButton
            onClick={handleAddClick}
            className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Language
          </BrutalButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          {languages.map((lang) => (
            <LanguageItem
              key={lang.id}
              lang={lang}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      {/* Add / Edit Dialog */}
      <ProfileDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title={editingLang ? "Edit Language" : "Add Language Details"}
      >
        <LanguageForm
          initialValues={editingLang}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingLang ? "Save Changes" : "Save Details"}
        />
      </ProfileDialog>
    </div>
  );
}
