import * as React from "react";
import { Loader2 } from "lucide-react";
import { BrutalButton, type BrutalButtonProps } from "@/components/ui/brutal-button";
import { cn } from "@/lib/utils";

export interface LoadingButtonProps extends BrutalButtonProps {
  loading?: boolean;
  loadingText?: string;
}

export const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ children, loading = false, loadingText, className, disabled, ...props }, ref) => {
    return (
      <BrutalButton
        ref={ref}
        disabled={disabled || loading}
        aria-busy={loading ? "true" : undefined}
        className={cn("w-full h-12 uppercase font-bold text-sm tracking-wide select-none", className)}
        {...props}
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin text-current" aria-hidden="true" />
            {loadingText || children}
          </span>
        ) : (
          children
        )}
      </BrutalButton>
    );
  }
);
LoadingButton.displayName = "LoadingButton";
