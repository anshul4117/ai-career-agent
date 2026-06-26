import * as React from "react";
import { Check } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  description?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ id, label, error, description, className, ...props }, ref) => {
    const generatedId = React.useId();
    const checkboxId = id || generatedId;
    const descriptionId = `${checkboxId}-description`;
    const errorId = `${checkboxId}-error`;

    return (
      <div className="space-y-1">
        <div className="flex items-start gap-3">
          <div className="relative flex items-center h-6">
            <input
              ref={ref}
              id={checkboxId}
              type="checkbox"
              className="peer sr-only"
              aria-describedby={
                cn(
                  description ? descriptionId : undefined,
                  error ? errorId : undefined
                ) || undefined
              }
              {...props}
            />
            {/* Custom Checkbox Box */}
            <div
              className={cn(
                "h-5 w-5 rounded-sm bg-surface border-2 border-foreground transition-all peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary peer-checked:bg-foreground peer-checked:text-surface flex items-center justify-center cursor-pointer",
                error && "border-error peer-focus-visible:outline-error",
                props.disabled && "cursor-not-allowed opacity-50",
                className
              )}
              onClick={(e) => {
                if (props.disabled) return;
                const input = document.getElementById(checkboxId) as HTMLInputElement | null;
                if (input) {
                  input.click();
                }
              }}
            >
              <Check className="h-4.5 w-4.5 stroke-[3px] text-surface hidden peer-checked:block" />
            </div>
          </div>
          {label && (
            <Label
              htmlFor={checkboxId}
              className={cn(
                "select-none cursor-pointer leading-normal pt-0.5",
                props.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
            </Label>
          )}
        </div>
        {(description || error) && (
          <div className="pl-8">
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
        )}
      </div>
    );
  }
);
Checkbox.displayName = "Checkbox";
