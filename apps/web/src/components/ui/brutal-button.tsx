import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface BrutalButtonProps extends ButtonProps {
  shadowColor?: string;
  hasLift?: boolean;
}

export const BrutalButton = React.forwardRef<HTMLButtonElement, BrutalButtonProps>(
  ({ children, className, variant = "default", hasLift = true, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        className={cn(
          "transition-all duration-150 active:translate-x-0 active:translate-y-0 active:shadow-none font-heading tracking-wide uppercase",
          variant === "default" && "bg-foreground text-surface brutal-border brutal-shadow hover:brutal-shadow-hover",
          variant === "secondary" && "bg-transparent text-foreground brutal-border hover:bg-foreground hover:text-surface",
          variant === "success" && "bg-success text-white border-[3px] border-foreground brutal-shadow hover:brutal-shadow-hover",
          hasLift && "brutal-hover-lift",
          className
        )}
        {...props}
      >
        {children}
      </Button>
    );
  }
);
BrutalButton.displayName = "BrutalButton";
