import type { Metadata } from "next";
import { AuthCard, AuthHeader, CompleteProfileForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Complete Your Profile — AI Career Agent",
  description: "Complete your onboarding details to unlock job discovery and matching.",
};

export default function CompleteProfilePage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Tell Us About Yourself"
        description="Share a few professional details to help us customize your matches."
      />
      <CompleteProfileForm />
    </AuthCard>
  );
}
