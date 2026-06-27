import type { Metadata } from "next";
import { AuthCard, AuthHeader, AuthFooter, VerifyEmailForm } from "@/features/auth";

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
