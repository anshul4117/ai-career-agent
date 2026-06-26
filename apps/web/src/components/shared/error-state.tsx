import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-md bg-surface px-6 py-16 text-center brutal-border brutal-shadow"
      role="alert"
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-md bg-surface-secondary brutal-border-secondary">
        <AlertCircle className="h-8 w-8 text-error" aria-hidden="true" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-6 max-w-md text-sm text-foreground-secondary">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="secondary">
          Try Again
        </Button>
      )}
    </div>
  );
}
