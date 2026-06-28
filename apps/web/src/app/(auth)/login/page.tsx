import type { Metadata } from "next";
import { AuthCard } from "@/features/auth/components/auth-card";
import { AuthHeader } from "@/features/auth/components/auth-header";
import { AuthFooter } from "@/features/auth/components/auth-footer";
import { LoginForm } from "@/features/auth/components/login-form";

export const metadata: Metadata = {
  title: "Sign In — AI Career Agent",
  description: "Sign in to access your AI Career Agent dashboard and discover matching jobs.",
};

export default function LoginPage() {
  return (
    <AuthCard>
      <AuthHeader
        title="Welcome Back"
        description="Sign in to resume optimizing your career and discovering matches."
      />
      <LoginForm />
      <AuthFooter
        mainLinkText="Don't have an account?"
        mainLinkHref="/register"
        mainLinkActionText="Sign Up"
        secondaryLinkText="Trouble signing in?"
        secondaryLinkHref="#"
      />
    </AuthCard>
  );
}
