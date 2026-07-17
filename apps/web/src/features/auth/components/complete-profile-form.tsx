"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { completeProfileSchema } from "../schemas/auth.schema";
import { BrutalInput } from "@/components/ui/brutal-input";
import { BrutalButton } from "@/components/ui/brutal-button";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { Text } from "@/components/ui/typography";
import { Camera, User } from "lucide-react";
import Image from "next/image";
import { z } from "zod";
import { useAuth } from "../hooks/use-auth";

type ProfileFormValues = z.infer<typeof completeProfileSchema>;

export function CompleteProfileForm() {
  const { completeProfile, user } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  // Localized loading state
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      headline: "",
      preferredRole: "",
      preferredLocation: "",
    },
  });

  const onSubmit = async (data: ProfileFormValues) => {
    setError(null);
    setIsSaving(true);
    try {
      await completeProfile({
        firstName: data.firstName,
        lastName: data.lastName,
        headline: data.headline,
        preferredRole: data.preferredRole,
        preferredLocation: data.preferredLocation,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update profile onboarding.";
      setError(message);
      setIsSaving(false);
    }
  };

  const handleSkip = async () => {
    setError(null);
    setIsSaving(true);
    try {
      const defaultFirstName = user?.email.split("@")[0] || "User";
      await completeProfile({
        firstName: defaultFirstName,
        lastName: "",
        headline: "",
        preferredRole: "",
        preferredLocation: "",
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to skip onboarding.";
      setError(message);
      setIsSaving(false);
    }
  };

  const handlePhotoClick = () => {
    // Mock image selection
    if (photoUrl) {
      setPhotoUrl(null);
    } else {
      setPhotoUrl("https://api.dicebear.com/7.x/bottts/svg?seed=anshul");
    }
  };

  return (
    <div className="space-y-6">
      <ErrorMessage message={error} onClose={() => setError(null)} />

      {/* Interactive Profile Photo Selection Placeholder */}
      <div className="flex flex-col items-center gap-2 select-none">
        <button
          type="button"
          onClick={handlePhotoClick}
          className="relative h-20 w-20 flex items-center justify-center rounded-full bg-surface-secondary border-[3px] border-border brutal-shadow hover:brutal-shadow-hover transition-all active:translate-x-0 active:translate-y-0 active:shadow-none overflow-hidden group focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Upload profile image"
        >
          {photoUrl ? (
            <Image 
              src={photoUrl} 
              alt="Profile Avatar Preview" 
              fill
              sizes="80px"
              className="object-cover" 
            />
          ) : (
            <User className="h-8 w-8 text-foreground-muted" />
          )}
          <div className="absolute inset-0 bg-foreground/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="h-5 w-5 text-surface" />
          </div>
        </button>
        <Text variant="small" className="text-xs text-foreground-muted font-bold uppercase tracking-wider">
          {photoUrl ? "Click to Remove" : "Click to Upload Photo"}
        </Text>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BrutalInput
            id="onboarding-firstName"
            label="First Name"
            placeholder="John"
            error={errors.firstName?.message}
            disabled={isSaving}
            required
            {...register("firstName")}
          />

          <BrutalInput
            id="onboarding-lastName"
            label="Last Name"
            placeholder="Doe"
            error={errors.lastName?.message}
            disabled={isSaving}
            required
            {...register("lastName")}
          />
        </div>

        <BrutalInput
          id="onboarding-headline"
          label="Professional Headline"
          placeholder="Software Engineer | Frontend Specialist"
          error={errors.headline?.message}
          disabled={isSaving}
          required
          {...register("headline")}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <BrutalInput
            id="onboarding-role"
            label="Preferred Role"
            placeholder="React Developer"
            error={errors.preferredRole?.message}
            disabled={isSaving}
            required
            {...register("preferredRole")}
          />

          <BrutalInput
            id="onboarding-location"
            label="Preferred Location"
            placeholder="Remote / New York"
            error={errors.preferredLocation?.message}
            disabled={isSaving}
            required
            {...register("preferredLocation")}
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <LoadingButton
            type="submit"
            loading={isSaving}
            disabled={isSaving}
            loadingText="Saving profile..."
          >
            Continue
          </LoadingButton>

          <BrutalButton
            type="button"
            variant="secondary"
            onClick={handleSkip}
            disabled={isSaving}
            className="w-full sm:w-auto px-6 h-12 uppercase font-bold text-sm tracking-wide bg-transparent border-2 border-border text-foreground hover:bg-foreground/5 hover:text-foreground"
          >
            Skip for Now
          </BrutalButton>
        </div>
      </form>
    </div>
  );
}
