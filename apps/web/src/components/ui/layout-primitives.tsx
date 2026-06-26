import * as React from "react";
import { cn } from "@/lib/utils";

// ----------------------------------------------------
// PageContainer Component
// ----------------------------------------------------
export interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "narrow" | "wide" | "full";
}

export const PageContainer = React.forwardRef<HTMLDivElement, PageContainerProps>(
  ({ className, size = "default", children, ...props }, ref) => {
    const sizes = {
      default: "max-w-6xl",
      narrow: "max-w-4xl",
      wide: "max-w-7xl",
      full: "max-w-full",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto px-4 md:px-6 lg:px-8",
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
PageContainer.displayName = "PageContainer";

// ----------------------------------------------------
// Section Component
// ----------------------------------------------------
export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  spacing?: "none" | "sm" | "md" | "lg" | "xl";
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, spacing = "md", children, ...props }, ref) => {
    const spacings = {
      none: "py-0",
      sm: "py-4 md:py-6",
      md: "py-8 md:py-12",
      lg: "py-12 md:py-18",
      xl: "py-16 md:py-24",
    };

    return (
      <section
        ref={ref}
        className={cn(spacings[spacing], className)}
        {...props}
      >
        {children}
      </section>
    );
  }
);
Section.displayName = "Section";

// ----------------------------------------------------
// Grid Component
// ----------------------------------------------------
export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsSm?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
  gap?: 0 | 2 | 4 | 6 | 8 | 10 | 12;
}

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ className, cols = 1, colsSm, colsMd, colsLg, gap = 6, children, ...props }, ref) => {
    const colClasses = {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    };

    const smColClasses = {
      1: "sm:grid-cols-1",
      2: "sm:grid-cols-2",
      3: "sm:grid-cols-3",
      4: "sm:grid-cols-4",
      5: "sm:grid-cols-5",
      6: "sm:grid-cols-6",
      12: "sm:grid-cols-12",
    };

    const mdColClasses = {
      1: "md:grid-cols-1",
      2: "md:grid-cols-2",
      3: "md:grid-cols-3",
      4: "md:grid-cols-4",
      5: "md:grid-cols-5",
      6: "md:grid-cols-6",
      12: "md:grid-cols-12",
    };

    const lgColClasses = {
      1: "lg:grid-cols-1",
      2: "lg:grid-cols-2",
      3: "lg:grid-cols-3",
      4: "lg:grid-cols-4",
      5: "lg:grid-cols-5",
      6: "lg:grid-cols-6",
      12: "lg:grid-cols-12",
    };

    const gapClasses = {
      0: "gap-0",
      2: "gap-2",
      4: "gap-4",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "grid",
          colClasses[cols],
          colsSm && smColClasses[colsSm],
          colsMd && mdColClasses[colsMd],
          colsLg && lgColClasses[colsLg],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Grid.displayName = "Grid";

// ----------------------------------------------------
// Stack Component
// ----------------------------------------------------
export interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: "row" | "col" | "row-reverse" | "col-reverse";
  align?: "start" | "end" | "center" | "baseline" | "stretch";
  justify?: "start" | "end" | "center" | "between" | "around" | "evenly";
  gap?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
}

export const Stack = React.forwardRef<HTMLDivElement, StackProps>(
  ({ className, direction = "col", align = "stretch", justify = "start", gap = 4, children, ...props }, ref) => {
    const directions = {
      row: "flex-row",
      col: "flex-col",
      "row-reverse": "flex-row-reverse",
      "col-reverse": "flex-col-reverse",
    };

    const aligns = {
      start: "items-start",
      end: "items-end",
      center: "items-center",
      baseline: "items-baseline",
      stretch: "items-stretch",
    };

    const justifies = {
      start: "justify-start",
      end: "justify-end",
      center: "justify-center",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    };

    const gapClasses = {
      0: "gap-0",
      1: "gap-1",
      2: "gap-2",
      3: "gap-3",
      4: "gap-4",
      5: "gap-5",
      6: "gap-6",
      8: "gap-8",
      10: "gap-10",
      12: "gap-12",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex",
          directions[direction],
          aligns[align],
          justifies[justify],
          gapClasses[gap],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Stack.displayName = "Stack";

// ----------------------------------------------------
// Divider Component
// ----------------------------------------------------
export interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
  thickness?: "sm" | "md";
}

export const Divider = React.forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation = "horizontal", thickness = "md", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          orientation === "horizontal" ? "w-full" : "h-full min-h-[1em]",
          orientation === "horizontal"
            ? thickness === "md"
              ? "border-t-[3px] border-foreground"
              : "border-t-[2px] border-border-secondary"
            : thickness === "md"
              ? "border-l-[3px] border-foreground"
              : "border-l-[2px] border-border-secondary",
          className
        )}
        role="separator"
        aria-orientation={orientation}
        {...props}
      />
    );
  }
);
Divider.displayName = "Divider";
