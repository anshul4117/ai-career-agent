import type { Metadata } from "next";
import { AuthCard, AuthHeader, AuthFooter, RegisterForm } from "@/features/auth";

export const metadata: Metadata = {
  title: "Create Account — AI Career Agent",
  description: "Create your AI Career Agent account to start your quality-first job search journey.",
};

export default function RegisterPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Get Started"
        description="Start discovering high-quality opportunities without the spam."
      />
      <RegisterForm />
      <AuthFooter
        mainLinkText="Already have an account?"
        mainLinkHref="/login"
        mainLinkActionText="Sign In"
      />
    </AuthCard>
  );
}
