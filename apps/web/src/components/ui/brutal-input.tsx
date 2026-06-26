import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface BrutalInputProps extends Omit<React.ComponentProps<"input">, "label"> {
  label?: string;
  error?: string;
  description?: string;
  required?: boolean;
}

export const BrutalInput = React.forwardRef<HTMLInputElement, BrutalInputProps>(
  ({ id, label, error, description, required, className, type = "text", ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const descriptionId = `${inputId}-description`;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={inputId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-error" aria-hidden="true">*</span>}
          </Label>
        )}
        <Input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
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
BrutalInput.displayName = "BrutalInput";
