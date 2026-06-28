import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/typography";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "label"> {
  label?: React.ReactNode;
  error?: string;
  required?: boolean;
}

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ id, label = "Password", error, required, className, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const generatedId = React.useId();
    const inputId = id || generatedId;
    const errorId = `${inputId}-error`;

    return (
      <div className="space-y-2 w-full text-left">
        {label && (
          <Label htmlFor={inputId} className="flex items-center gap-1">
            {label}
            {required && <span className="text-error" aria-hidden="true">*</span>}
          </Label>
        )}
        <div className="relative">
          <Input
            ref={ref}
            id={inputId}
            type={showPassword ? "text" : "password"}
            className={cn(
              "pr-12",
              error && "border-error focus-visible:outline-error",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center h-8 w-8 text-foreground-muted hover:text-foreground focus:text-foreground focus:outline-none transition-colors"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {error && (
          <Text id={errorId} className="text-xs text-error font-medium" role="alert">
            {error}
          </Text>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";
