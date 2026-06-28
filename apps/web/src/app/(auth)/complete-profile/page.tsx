import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { CompleteProfileForm } from "@/features/auth/components/complete-profile-form";

export const metadata: Metadata = {
  title: "Onboarding — AI Career Agent",
  description: "Complete your profile preferences to configure your AI Career Agent assistant.",
};

export default function CompleteProfilePage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Complete Your Profile"
        description="Help us personalize your resume optimization and job matches."
      />
      <CompleteProfileForm />
    </AuthCard>
  );
}
