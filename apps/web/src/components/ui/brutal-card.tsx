import * as React from "react";
import { cn } from "@/lib/utils";

export interface BrutalCardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

export const BrutalCard = React.forwardRef<HTMLDivElement, BrutalCardProps>(
  ({ children, className, hoverable = false, padding = "md", ...props }, ref) => {
    const paddings = {
      none: "p-0",
      sm: "p-3",
      md: "p-4",
      lg: "p-5",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "bg-surface brutal-border rounded-md brutal-shadow text-foreground",
          hoverable && "brutal-hover-lift hover:brutal-shadow-hover transition-all duration-150 cursor-pointer",
          paddings[padding],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
BrutalCard.displayName = "BrutalCard";
