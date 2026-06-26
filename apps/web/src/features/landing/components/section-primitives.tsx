import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  id?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  id,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-12 max-w-3xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      <h2
        id={id}
        className="font-heading text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl"
      >
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base text-foreground-secondary md:text-lg">{description}</p>
      )}
    </div>
  );
}

interface LandingSectionProps {
  id?: string;
  children: ReactNode;
  className?: string;
  ariaLabelledBy?: string;
}

export function LandingSection({
  id,
  children,
  className,
  ariaLabelledBy,
}: LandingSectionProps) {
  return (
    <section
      id={id}
      className={cn("border-b-[3px] border-border px-4 py-16 md:py-24", className)}
      aria-labelledby={ariaLabelledBy}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}
