import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { VerifyEmailForm } from "@/features/auth/components/verify-email-form";

export const metadata: Metadata = {
  title: "Verify Email — AI Career Agent",
  description: "Verify your email address to complete signing up.",
};

export default function VerifyEmailPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Verify Email"
        description="We've sent a 6-digit confirmation code to your email. Enter it below to activate your account."
      />
      <VerifyEmailForm />
      <AuthFooter
        mainLinkText="Didn't receive a code?"
        mainLinkHref="#"
        mainLinkActionText="Resend Code"
      />
    </AuthCard>
  );
}
