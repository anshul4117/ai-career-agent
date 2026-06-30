"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Share2, ArrowLeft, Plus } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { SocialLinkItem } from "@/features/profile/components/social-link-item";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { SocialLinkForm } from "@/features/profile/components/social-link-form";
import type { SocialLink } from "@/features/profile/types/social-link.types";
import { SocialLinkFormValues } from "@/features/profile/schemas/social-link.schema";

export default function SocialLinksPage() {
  const { socialLinks, isLoading, loadProfile, addSocialLink, updateSocialLink, deleteSocialLink } = useProfileStore();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<SocialLink | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingLink(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (link: SocialLink) => {
    setEditingLink(link);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    if (window.confirm("Are you sure you want to delete this social link?")) {
      deleteSocialLink(id);
    }
  };

  const handleFormSubmit = (values: SocialLinkFormValues) => {
    if (editingLink) {
      updateSocialLink(editingLink.id, values);
    } else {
      addSocialLink(values);
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

  const existingSocialPlatforms = socialLinks.map((l) => l.platform);

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
            <Share2 className="h-6 w-6 text-primary shrink-0" />
            Manage Social Profiles
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Social Link
        </BrutalButton>
      </div>

      {socialLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
          <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
            <Share2 className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight">
              No Social Links Added Yet
            </Heading>
            <Text className="text-foreground-secondary text-xs leading-relaxed">
              Connect profiles like LinkedIn, GitHub, or your personal website so recruiters can see your complete work.
            </Text>
          </div>
          <BrutalButton
            onClick={handleAddClick}
            className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Social Profile
          </BrutalButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          {socialLinks.map((link) => (
            <SocialLinkItem
              key={link.id}
              link={link}
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
        title={editingLink ? "Edit Social Profile" : "Add Social Profile"}
      >
        <SocialLinkForm
          existingPlatforms={existingSocialPlatforms}
          initialValues={editingLink}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingLink ? "Save Changes" : "Save Link"}
        />
      </ProfileDialog>
    </div>
  );
}
