"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";
import { SocialLoginButton } from "./social-login-button";
import { AuthDivider } from "./auth-divider";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { z } from "zod";

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const { login, loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);
  
  // Localized and isolated loading states
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setError(null);
    setIsSigningIn(true);
    try {
      await login(data.email, data.password);
      router.push("/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setError(message);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign in failed.";
      setError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const passwordLabel = (
    <div className="flex w-full items-center justify-between">
      <span>Password</span>
      <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline lowercase tracking-wider">
        Forgot password?
      </Link>
    </div>
  );

  const isAnyLoading = isSigningIn || isGoogleLoading;

  return (
    <div className="space-y-4">
      <SocialLoginButton
        provider="google"
        onClick={handleGoogleLogin}
        isLoading={isGoogleLoading}
      />
      
      <AuthDivider />

      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <EmailInput
          id="login-email"
          error={errors.email?.message}
          disabled={isAnyLoading}
          {...register("email")}
        />

        <PasswordInput
          id="login-password"
          label={passwordLabel}
          error={errors.password?.message}
          disabled={isAnyLoading}
          {...register("password")}
        />

        <LoadingButton
          type="submit"
          loading={isSigningIn}
          disabled={isAnyLoading}
          loadingText="Signing in..."
        >
          Sign In
        </LoadingButton>
      </form>
    </div>
  );
}
