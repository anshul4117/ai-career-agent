"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ArrowLeft, User, Mail, Briefcase, Settings, Pencil } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";

// Import Forms
import { PersonalInfoForm } from "@/features/profile/components/personal-info-form";
import { ContactInfoForm } from "@/features/profile/components/contact-info-form";
import { CareerInfoForm } from "@/features/profile/components/career-info-form";
import { CareerPreferenceForm } from "@/features/profile/components/career-preference-form";
import { AvatarUpload } from "@/features/profile/components/avatar-upload";

// Import Preview Cards
import { PersonalInfoCard } from "@/features/profile/components/personal-info-card";
import { ContactInfoCard } from "@/features/profile/components/contact-info-card";
import { CareerSummaryCard } from "@/features/profile/components/career-summary-card";
import { CareerPreferenceCard } from "@/features/profile/components/career-preference-card";

import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const {
    profile,
    preferences,
    isLoading,
    loadProfile,
    updatePreferences,
    setProfile,
  } = useProfileStore();

  const router = useRouter();

  // Segmented edit toggles
  const [editPersonal, setEditPersonal] = useState(false);
  const [editContact, setEditContact] = useState(false);
  const [editCareer, setEditCareer] = useState(false);
  const [editPref, setEditPref] = useState(false);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Unsaved changes warning blocker (Part 10)
  const isAnyFormDirty = editPersonal || editContact || editCareer || editPref;

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isAnyFormDirty) {
        e.preventDefault();
        e.returnValue = "You have unsaved changes. Are you sure you want to leave?";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [isAnyFormDirty]);

  const handleBackClick = (e: React.MouseEvent) => {
    if (isAnyFormDirty) {
      const confirmLeave = window.confirm(
        "You have unsaved edits. Are you sure you want to leave this page?"
      );
      if (!confirmLeave) {
        e.preventDefault();
      }
    }
  };

  if (isLoading || !profile) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-12 h-12 border-[3px] border-foreground border-t-transparent animate-spin brutal-shadow bg-surface rounded-full" />
      </div>
    );
  }

  // Handle Form Submissions independently
  const handlePersonalSubmit = (values: any) => {
    setProfile({
      ...profile,
      personal: values,
    });
    setEditPersonal(false);
  };

  const handleContactSubmit = (values: any) => {
    setProfile({
      ...profile,
      contact: values,
    });
    setEditContact(false);
  };

  const handleCareerSubmit = (values: any) => {
    setProfile({
      ...profile,
      career: values,
    });
    setEditCareer(false);
  };

  const handlePrefSubmit = (values: any) => {
    updatePreferences(values);
    setEditPref(false);
  };

  return (
    <div className="space-y-6 w-full max-w-4xl min-w-0 pb-12">
      {/* Header */}
      <div className="space-y-1">
        <Link
          href="/profile"
          onClick={handleBackClick}
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
          Edit Profile
        </Heading>
        <Text className="text-foreground-secondary text-xs">
          Manage your personal details, coordinates, career statistics, and social links independently.
        </Text>
      </div>

      {/* 1. Avatar Upload */}
      <AvatarUpload />

      {/* 2. Personal Information */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        {editPersonal ? (
          <div className="space-y-4">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <User className="h-5 w-5 text-primary" aria-hidden="true" />
              Edit Personal Info
            </Heading>
            <PersonalInfoForm
              initialValues={profile.personal}
              onSubmit={handlePersonalSubmit}
              onCancel={() => setEditPersonal(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <User className="h-5 w-5 text-primary" aria-hidden="true" />
                Personal Information
              </Heading>
              <BrutalButton
                onClick={() => setEditPersonal(true)}
                variant="secondary"
                className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </BrutalButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
              <p><strong>First Name:</strong> {profile.personal.firstName}</p>
              <p><strong>Last Name:</strong> {profile.personal.lastName}</p>
              <p><strong>Date of Birth:</strong> {profile.personal.dateOfBirth || "—"}</p>
              <p><strong>Gender:</strong> {profile.personal.gender || "—"}</p>
              <p className="md:col-span-2"><strong>Nationality:</strong> {profile.personal.nationality || "—"}</p>
            </div>
          </div>
        )}
      </BrutalCard>

      {/* 3. Contact Information */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        {editContact ? (
          <div className="space-y-4">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
              Edit Contact Info
            </Heading>
            <ContactInfoForm
              initialValues={profile.contact}
              onSubmit={handleContactSubmit}
              onCancel={() => setEditContact(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
                Contact Information
              </Heading>
              <BrutalButton
                onClick={() => setEditContact(true)}
                variant="secondary"
                className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </BrutalButton>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
              <p><strong>Email Address:</strong> {profile.contact.email}</p>
              <p><strong>Phone Number:</strong> {profile.contact.phone}</p>
              <p><strong>City:</strong> {profile.contact.city}</p>
              <p><strong>Country:</strong> {profile.contact.country}</p>
            </div>
          </div>
        )}
      </BrutalCard>

      {/* 4. Career Summary */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        {editCareer ? (
          <div className="space-y-4">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
              Edit Career Summary
            </Heading>
            <CareerInfoForm
              initialValues={profile.career}
              onSubmit={handleCareerSubmit}
              onCancel={() => setEditCareer(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-primary" aria-hidden="true" />
                Career Summary
              </Heading>
              <BrutalButton
                onClick={() => setEditCareer(true)}
                variant="secondary"
                className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </BrutalButton>
            </div>
            <div className="space-y-2 text-sm pt-2">
              <p><strong>Headline:</strong> {profile.career.headline}</p>
              <p><strong>Current Role:</strong> {profile.career.currentRole} ({profile.career.yearsOfExperience} yrs exp)</p>
              <p><strong>Preferred Role:</strong> {profile.career.preferredRole} • {profile.career.preferredLocation}</p>
              <p><strong>Summary:</strong> {profile.career.summary || "—"}</p>
            </div>
          </div>
        )}
      </BrutalCard>

      {/* 5. Career Preferences */}
      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        {editPref ? (
          <div className="space-y-4">
            <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
              Edit Preferences
            </Heading>
            <CareerPreferenceForm
              initialValues={preferences}
              onSubmit={handlePrefSubmit}
              onCancel={() => setEditPref(false)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" aria-hidden="true" />
                Career Preferences
              </Heading>
              <BrutalButton
                onClick={() => setEditPref(true)}
                variant="secondary"
                className="h-8 px-2.5 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1"
              >
                <Pencil className="h-3.5 w-3.5" />
                Edit
              </BrutalButton>
            </div>
            {!preferences ? (
              <p className="text-sm text-foreground-muted">No preferences set.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm pt-2">
                <p><strong>Preferred Role:</strong> {preferences.preferredRole}</p>
                <p><strong>Expected Salary:</strong> {preferences.currency} {preferences.expectedSalary}</p>
                <p><strong>Job Type:</strong> {preferences.employmentType} ({preferences.workMode})</p>
                <p><strong>Preferred Industries:</strong> {preferences.preferredIndustry}</p>
              </div>
            )}
          </div>
        )}
      </BrutalCard>
    </div>
  );
}
