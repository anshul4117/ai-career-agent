import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface IconButtonProps extends Omit<ButtonProps, "children"> {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  ariaLabel: string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, ariaLabel, className, size = "icon", variant = "secondary", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        variant={variant}
        size={size}
        aria-label={ariaLabel}
        className={cn(
          "inline-flex items-center justify-center p-0 text-foreground rounded-md brutal-border brutal-hover-lift hover:brutal-shadow-hover",
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5" aria-hidden="true" />
      </Button>
    );
  }
);
IconButton.displayName = "IconButton";
