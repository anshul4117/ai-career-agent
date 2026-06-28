import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export const metadata: Metadata = {
  title: "Recover Password — AI Career Agent",
  description: "Reset your AI Career Agent account password.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Reset Password"
        description="Enter your email address and we'll send you a recovery link."
      />
      <ForgotPasswordForm />
      <AuthFooter
        mainLinkText="Remembered your password?"
        mainLinkHref="/login"
        mainLinkActionText="Sign In"
        secondaryLinkText="Create an account?"
        secondaryLinkHref="/register"
      />
    </AuthCard>
  );
}
