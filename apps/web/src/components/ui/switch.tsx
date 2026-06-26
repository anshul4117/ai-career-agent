import * as React from "react";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  error?: string;
  description?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

export const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ id, label, error, description, className, checked, onChange, ...props }, ref) => {
    const generatedId = React.useId();
    const switchId = id || generatedId;
    const descriptionId = `${switchId}-description`;
    const errorId = `${switchId}-error`;

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (props.disabled) return;
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        onChange?.(!checked);
      }
    };

    return (
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center h-6">
            <input
              ref={ref}
              id={switchId}
              type="checkbox"
              className="peer sr-only"
              checked={checked}
              onChange={(e) => onChange?.(e.target.checked)}
              aria-describedby={
                cn(
                  description ? descriptionId : undefined,
                  error ? errorId : undefined
                ) || undefined
              }
              {...props}
            />
            {/* Custom Switch Track */}
            <div
              tabIndex={props.disabled ? -1 : 0}
              onKeyDown={handleKeyDown}
              onClick={() => {
                if (props.disabled) return;
                onChange?.(!checked);
              }}
              className={cn(
                "relative h-6 w-11 cursor-pointer rounded-full bg-surface border-2 border-foreground transition-colors duration-200 outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                checked && "bg-accent border-foreground",
                error && "border-error focus-visible:outline-error",
                props.disabled && "cursor-not-allowed opacity-50",
                className
              )}
              role="switch"
              aria-checked={checked}
              aria-label={label}
            >
              {/* Switch Thumb */}
              <span
                className={cn(
                  "pointer-events-none block h-4 w-4 rounded-full bg-foreground transition-transform duration-200 border border-foreground translate-x-0.5 translate-y-[2px]",
                  checked && "translate-x-[22px] bg-surface border-surface"
                )}
              />
            </div>
          </div>
          {label && (
            <Label
              htmlFor={switchId}
              className={cn(
                "select-none cursor-pointer leading-normal",
                props.disabled && "cursor-not-allowed opacity-50"
              )}
            >
              {label}
            </Label>
          )}
        </div>
        {(description || error) && (
          <div className="pl-[56px]">
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
Switch.displayName = "Switch";
