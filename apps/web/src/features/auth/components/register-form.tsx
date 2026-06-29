"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";
import { EmailInput } from "./email-input";
import { PasswordInput } from "./password-input";
import { ConfirmPasswordInput } from "./confirm-password-input";
import { PasswordStrength } from "./password-strength";
import { SocialLoginButton } from "./social-login-button";
import { AuthDivider } from "./auth-divider";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { z } from "zod";

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { register: signup, registerWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Localized loading states
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: "", password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: RegisterFormValues) => {
    setError(null);
    setIsSigningUp(true);
    try {
      await signup(data.email, data.password);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setError(message);
      setIsSigningUp(false);
    }
  };

  const handleGoogleSignup = async () => {
    setError(null);
    setIsGoogleLoading(true);
    try {
      await registerWithGoogle();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign up failed.";
      setError(message);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const isAnyLoading = isSigningUp || isGoogleLoading;

  return (
    <div className="space-y-4">
      <SocialLoginButton
        provider="google"
        onClick={handleGoogleSignup}
        isLoading={isGoogleLoading}
      />
      
      <AuthDivider />

      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <EmailInput
          id="register-email"
          error={errors.email?.message}
          disabled={isAnyLoading}
          {...register("email")}
        />

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isAnyLoading}
          {...register("password")}
        />

        {passwordValue.length > 0 && (
          <div className="pt-1">
            <PasswordStrength value={passwordValue} />
          </div>
        )}

        <ConfirmPasswordInput
          id="register-confirm-password"
          error={errors.confirmPassword?.message}
          disabled={isAnyLoading}
          {...register("confirmPassword")}
        />

        <LoadingButton
          type="submit"
          loading={isSigningUp}
          disabled={isAnyLoading}
          loadingText="Creating account..."
        >
          Create Account
        </LoadingButton>
      </form>
    </div>
  );
}
