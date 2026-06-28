"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "../schemas/auth.schema";
import { useAuth } from "../hooks/use-auth";
import { LoadingButton } from "./loading-button";
import { ErrorMessage } from "./error-message";
import { BrutalInput } from "@/components/ui/brutal-input";
import { Text } from "@/components/ui/typography";
import { z } from "zod";

type VerifyFormValues = z.infer<typeof verifyEmailSchema>;

export function VerifyEmailForm() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);
  const { verifyEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);

  // Localized loading state
  const [isVerifying, setIsVerifying] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { code: "" },
  });

  const onSubmit = async (data: VerifyFormValues) => {
    setError(null);
    setIsVerifying(true);
    try {
      await verifyEmail(data.code);
      setSuccess(true);
      setTimeout(() => {
        router.push("/complete-profile");
      }, 1500);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Invalid verification code. Please check and try again.";
      setError(message);
    } finally {
      setIsVerifying(false);
    }
  };

  if (success) {
    return (
      <div className="space-y-4">
        <div className="rounded-md bg-success/10 p-4 border-[3px] border-success text-success-foreground brutal-shadow">
          <Text className="text-sm font-bold text-success mb-1">Email Verified Successfully!</Text>
          <Text variant="small" className="text-xs text-foreground-secondary leading-relaxed">
            Your email has been confirmed. Redirecting to profile setup...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ErrorMessage message={error} onClose={() => setError(null)} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <BrutalInput
          id="verify-code"
          label="Verification Code"
          placeholder="123456"
          maxLength={6}
          error={errors.code?.message}
          disabled={isVerifying}
          required
          {...register("code")}
        />

        <LoadingButton
          type="submit"
          loading={isVerifying}
          disabled={isVerifying}
          loadingText="Verifying email..."
        >
          Verify Email
        </LoadingButton>
      </form>
    </div>
  );
}
