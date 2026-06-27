"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { register: signup, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

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
    try {
      await signup(data.email, data.password);
      router.push("/verify-email");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create account. Please try again.";
      setError(message);
    }
  };

  const handleGoogleSignup = () => {
    setError(null);
    // TODO: Connect Google Sign-Up with Clerk OAuth trigger in Sprint 7
    alert("Google sign-in is coming in the next sprint (Sprint 7)!");
  };

  return (
    <div className="space-y-4">
      <SocialLoginButton provider="google" onClick={handleGoogleSignup} isLoading={isLoading} />
      
      <AuthDivider />

      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <EmailInput
          id="register-email"
          error={errors.email?.message}
          disabled={isLoading}
          {...register("email")}
        />

        <PasswordInput
          id="register-password"
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          disabled={isLoading}
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
          disabled={isLoading}
          {...register("confirmPassword")}
        />

        <LoadingButton type="submit" loading={isLoading} loadingText="Creating account...">
          Create Account
        </LoadingButton>
      </form>
    </div>
  );
}
