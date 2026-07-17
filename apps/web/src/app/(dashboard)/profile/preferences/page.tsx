"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Heading, Text } from "@/components/ui/typography";
import { ArrowLeft, Settings } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";
import { CareerPreferenceForm } from "@/features/profile/components/career-preference-form";
import { CareerPreferenceFormValues } from "@/features/profile/schemas/career-preference.schema";
import { useRouter } from "next/navigation";
import { PageLoader } from "@/components/ui/brand-loader";

export default function PreferencesPage() {
  const { preferences, isLoading, loadProfile, updatePreferences } = useProfileStore();
  const router = useRouter();

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleFormSubmit = (values: CareerPreferenceFormValues) => {
    updatePreferences(values);
    router.push("/profile");
  };

  if (isLoading) {
    return <PageLoader label="Loading career preferences..." />;
  }

  return (
    <div className="space-y-6 w-full max-w-2xl min-w-0">
      <div className="space-y-1">
        <Link
          href="/profile"
          className="text-xs font-bold uppercase tracking-wider text-foreground-secondary hover:text-primary flex items-center gap-1 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Profile
        </Link>
        <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight flex items-center gap-2">
          <Settings className="h-6 w-6 text-primary shrink-0" />
          Career Preferences
        </Heading>
        <Text className="text-foreground-secondary text-xs">
          Configure job roles, expected package, location preferences, and sponsorship details to optimize matcher algorithms.
        </Text>
      </div>

      <div className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
        <CareerPreferenceForm
          initialValues={preferences}
          onSubmit={handleFormSubmit}
          onCancel={() => router.push("/profile")}
          submitLabel="Save Preferences"
        />
      </div>
    </div>
  );
}
