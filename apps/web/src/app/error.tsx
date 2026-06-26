"use client";

import { Button } from "@/components/ui/button";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center">
      <h1 className="mb-2 text-4xl font-bold">Something Went Wrong</h1>
      <p className="mb-8 text-foreground-secondary">An unexpected error occurred.</p>
      <Button onClick={reset} variant="secondary">
        Try Again
      </Button>
    </div>
  );
}
