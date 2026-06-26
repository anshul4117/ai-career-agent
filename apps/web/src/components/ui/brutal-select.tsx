import * as React from "react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface BrutalSelectOption {
  value: string;
  label: string;
}

export interface BrutalSelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "label"> {
  label?: string;
  error?: string;
  description?: string;
  options: BrutalSelectOption[];
  required?: boolean;
}

export const BrutalSelect = React.forwardRef<HTMLSelectElement, BrutalSelectProps>(
  ({ id, label, error, description, options, required, className, ...props }, ref) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;
    const descriptionId = `${selectId}-description`;
    const errorId = `${selectId}-error`;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <Label htmlFor={selectId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-error" aria-hidden="true">*</span>}
          </Label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              "flex h-12 w-full rounded-md bg-surface px-4 py-2 text-base text-foreground brutal-border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50 appearance-none pr-10",
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
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Custom Arrow indicator */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-foreground">
            <svg
              className="h-4 w-4 stroke-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        </div>
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
BrutalSelect.displayName = "BrutalSelect";
