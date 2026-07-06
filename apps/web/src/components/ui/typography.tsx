import * as React from "react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// Heading Component
// ----------------------------------------------------
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
}

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = "h2", className, children, ...props }, ref) => {
    const Component = level;
    
    const sizes: Record<HeadingLevel, string> = {
      h1: "text-2xl md:text-3xl font-bold tracking-tight",
      h2: "text-xl md:text-2xl font-bold tracking-tight",
      h3: "text-lg md:text-xl font-bold",
      h4: "text-base md:text-lg font-semibold",
      h5: "text-sm font-semibold",
      h6: "text-[13px] font-semibold",
    };

    return (
      <Component
        ref={ref}
        className={cn("font-heading text-foreground", sizes[level], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Heading.displayName = "Heading";

// ----------------------------------------------------
// Text Component
// ----------------------------------------------------
type TextVariant = "large" | "body" | "small" | "muted";

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: TextVariant;
  as?: "p" | "span" | "div";
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ variant = "body", as = "p", className, children, ...props }, ref) => {
    const Component = as;

    const variants: Record<TextVariant, string> = {
      large: "text-base md:text-lg text-foreground-secondary",
      body: "text-sm text-foreground-secondary leading-relaxed",
      small: "text-[13px] text-foreground-secondary",
      muted: "text-[13px] text-foreground-muted",
    };

    return (
      <Component
        ref={ref}
        className={cn("font-body", variants[variant], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Text.displayName = "Text";

// ----------------------------------------------------
// Caption Component
// ----------------------------------------------------
interface CaptionProps extends React.HTMLAttributes<HTMLSpanElement> {
  as?: "span" | "p";
}

export const Caption = React.forwardRef<HTMLSpanElement, CaptionProps>(
  ({ as = "span", className, children, ...props }, ref) => {
    const Component = as as "span";

    return (
      <Component
        ref={ref}
        className={cn("text-xs font-medium uppercase tracking-wider text-foreground-muted font-body", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
Caption.displayName = "Caption";
