import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthCard, AuthHeader, AuthFooter, ResetPasswordForm } from "@/features/auth";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Reset Password — AI Career Agent",
  description: "Reset your AI Career Agent account password securely.",
};

export default function ResetPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Reset Password"
        description="Choose a strong, secure new password for your account."
      />
      <Suspense
        fallback={
          <div className="h-48 flex flex-col items-center justify-center gap-2 text-foreground-secondary text-sm">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading form configuration...</span>
          </div>
        }
      >
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
