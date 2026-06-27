"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { resetPasswordSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { PasswordInput } from "./password-input";
import { ConfirmPasswordInput } from "./confirm-password-input";
import { PasswordStrength } from "./password-strength";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { BrutalInput } from "@/components/ui/brutal-input";
import { Text } from "@/components/ui/typography";
import { z } from "zod";

type ResetFormValues = z.infer<typeof resetPasswordSchema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenFromUrl = searchParams.get("token") || "";
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token: tokenFromUrl, password: "", confirmPassword: "" },
  });

  const passwordValue = watch("password", "");

  const onSubmit = async (data: ResetFormValues) => {
    setError(null);
    setIsLoading(true);
    try {
      await authService.resetPassword(data.password, data.token);
      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to reset password. The link might be expired.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-success/10 p-4 border-[3px] border-success text-success-foreground brutal-shadow">
          <Text className="text-sm font-bold text-success mb-1">Password Changed Successfully!</Text>
          <Text variant="small" className="text-xs text-foreground-secondary leading-relaxed">
            Your password has been updated. Redirecting to login page...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Render token input if not found in URL query string */}
        {!tokenFromUrl && (
          <BrutalInput
            id="reset-token"
            label="Reset Token"
            placeholder="Paste your reset token here"
            error={errors.token?.message}
            disabled={isLoading}
            required
            {...register("token")}
          />
        )}

        <PasswordInput
          id="reset-password-input"
          label="New Password"
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
          id="reset-confirm-password"
          error={errors.confirmPassword?.message}
          disabled={isLoading}
          {...register("confirmPassword")}
        />

        <LoadingButton type="submit" loading={isLoading} loadingText="Updating password...">
          Update Password
        </LoadingButton>
      </form>
    </div>
  );
}
