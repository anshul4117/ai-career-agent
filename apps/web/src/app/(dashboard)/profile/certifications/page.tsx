"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Award, ArrowLeft, Plus } from "lucide-react";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { CertificationItem } from "@/features/profile/components/certification-item";
import { ProfileDialog } from "@/features/profile/components/profile-dialog";
import { CertificationForm } from "@/features/profile/components/certification-form";
import type { Certification } from "@/features/profile/types/certification.types";
import { CertificationFormValues } from "@/features/profile/schemas/certification.schema";

export default function CertificationsPage() {
  const { certifications, isLoading, loadProfile, addCertification, updateCertification, deleteCertification } = useProfileStore();
  const { confirm, ConfirmationDialog } = useConfirm();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleAddClick = () => {
    setEditingCert(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (cert: Certification) => {
    setEditingCert(cert);
    setIsDialogOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const isConfirmed = await confirm({
      title: "Delete Certification",
      description: "Are you sure you want to delete this certification? This action cannot be undone.",
      isDestructive: true,
      confirmLabel: "Delete"
    });
    if (isConfirmed) {
      deleteCertification(id);
    }
  };

  const handleFormSubmit = (values: CertificationFormValues) => {
    const mappedValues = {
      ...values,
      expiryDate: values.expiryDate ?? null,
      credentialId: values.credentialId ?? null,
      credentialUrl: values.credentialUrl ?? null,
    };
    if (editingCert) {
      updateCertification(editingCert.id, mappedValues);
    } else {
      addCertification(mappedValues);
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
            <Award className="h-6 w-6 text-primary shrink-0" />
            Manage Certifications
          </Heading>
        </div>

        <BrutalButton
          onClick={handleAddClick}
          className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shrink-0 self-start sm:self-auto"
        >
          <Plus className="h-4 w-4" />
          Add Certification
        </BrutalButton>
      </div>

      {certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 border-3 border-dashed border-border bg-surface text-center space-y-4 brutal-shadow rounded-md py-12">
          <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
            <Award className="h-6 w-6" aria-hidden="true" />
          </div>
          <div className="space-y-1.5 max-w-sm">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight">
              No Certifications Added Yet
            </Heading>
            <Text className="text-foreground-secondary text-xs leading-relaxed">
              Add professional certifications, courses, or licenses to boost your matching diagnostics scores.
            </Text>
          </div>
          <BrutalButton
            onClick={handleAddClick}
            className="h-10 px-5 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Certification
          </BrutalButton>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full min-w-0">
          {certifications.map((cert) => (
            <CertificationItem
              key={cert.id}
              cert={cert}
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
        title={editingCert ? "Edit Certification" : "Add Certification Record"}
      >
        <CertificationForm
          initialValues={editingCert}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsDialogOpen(false)}
          submitLabel={editingCert ? "Save Changes" : "Save Record"}
        />
      </ProfileDialog>
      
      <ConfirmationDialog />
    </div>
  );
}
