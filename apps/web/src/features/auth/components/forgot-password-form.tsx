"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { forgotPasswordSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";
import { EmailInput } from "./email-input";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { Text } from "@/components/ui/typography";
import { z } from "zod";

type ForgotFormValues = z.infer<typeof forgotPasswordSchema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const [sent, setSent] = useState(false);
  const { forgotPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Localized loading state
  const [isRecovering, setIsRecovering] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: ForgotFormValues) => {
    setError(null);
    setIsRecovering(true);
    try {
      await forgotPassword(data.email);
      setSent(true);
      setTimeout(() => {
        router.push("/reset-password");
      }, 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to trigger password recovery. Please try again.";
      setError(message);
    } finally {
      setIsRecovering(false);
    }
  };

  if (sent) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-success/10 p-4 border-[3px] border-success text-success-foreground brutal-shadow">
          <Text className="text-sm font-bold text-success mb-1">Recovery Link Sent!</Text>
          <Text variant="small" className="text-xs text-foreground-secondary leading-relaxed">
            If an account exists, a link/token has been sent. Redirecting to reset page...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <EmailInput
          id="forgot-email"
          error={errors.email?.message}
          disabled={isRecovering}
          {...register("email")}
        />

        <LoadingButton
          type="submit"
          loading={isRecovering}
          disabled={isRecovering}
          loadingText="Sending recovery link..."
        >
          Send Recovery Link
        </LoadingButton>
      </form>
    </div>
  );
}
