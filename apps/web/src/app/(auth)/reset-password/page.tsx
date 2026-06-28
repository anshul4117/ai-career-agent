import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { ResetPasswordForm } from "@/features/auth/components/reset-password-form";

export const metadata: Metadata = {
  title: "Reset Password — AI Career Agent",
  description: "Create a new password for your AI Career Agent account.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Choose New Password"
        description="Enter the recovery code/token sent to your email to set a new password."
      />
      <Suspense fallback={<div className="text-sm font-bold text-center py-4">Loading reset form...</div>}>
        <ResetPasswordForm />
      </Suspense>
      <AuthFooter
        mainLinkText="Remembered your password?"
        mainLinkHref="/login"
        mainLinkActionText="Sign In"
      />
    </AuthCard>
  );
}
