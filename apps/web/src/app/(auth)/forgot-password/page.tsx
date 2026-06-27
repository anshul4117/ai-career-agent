import type { Metadata } from "next";
import { AuthCard, AuthHeader, AuthFooter, ForgotPasswordForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Recover Password — AI Career Agent",
  description: "Recover your AI Career Agent account password by triggering a recovery link.",
};

export default function ForgotPasswordPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Forgot Password?"
        description="Enter your email below and we'll send you instructions to reset your password."
      />
      <ForgotPasswordForm />
      <AuthFooter
        mainLinkText="Remembered your password?"
        mainLinkHref="/login"
        mainLinkActionText="Sign In"
      />
    </AuthCard>
  );
}
