import * as React from "react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface BrutalTextareaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "label"> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const BrutalTextarea = React.forwardRef<HTMLTextAreaElement, BrutalTextareaProps>(
  ({ id, label, error, description, required, className, rows = 4, ...props }, ref) => {
    const generatedId = React.useId();
    const textareaId = id || generatedId;
    const descriptionId = `${textareaId}-description`;
    const errorId = `${textareaId}-error`;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={textareaId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-error" aria-hidden="true">*</span>}
          </Label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          className={cn(
            "flex w-full rounded-md bg-surface px-4 py-2 text-base text-foreground brutal-border transition-colors placeholder:text-foreground-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:outline-error",
            className
          )}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={
            cn(
              description ? descriptionId : undefined,
              error ? errorId : undefined
            ) || undefined
          }
          {...props}
        />
        {description && !error && (
          <Text id={descriptionId} variant="muted" className="text-xs">
            {description}
          </Text>
        )}
        {error && (
          <Text id={errorId} className="text-xs text-error font-medium" role="alert">
            {error}
          </Text>
        )}
      </div>
    );
  }
);
BrutalTextarea.displayName = "BrutalTextarea";
