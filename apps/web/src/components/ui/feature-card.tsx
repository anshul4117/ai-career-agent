import * as React from "react";
import { type LucideIcon } from "lucide-react";
import { BrutalCard, type BrutalCardProps } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export interface FeatureCardProps extends Omit<BrutalCardProps, "children"> {
  icon: LucideIcon | React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  actionNode?: React.ReactNode;
  iconClassName?: string;
}

export const FeatureCard = React.forwardRef<HTMLDivElement, FeatureCardProps>(
  ({ icon: Icon, title, description, actionNode, className, iconClassName, hoverable = true, ...props }, ref) => {
    return (
      <BrutalCard
        ref={ref}
        hoverable={hoverable}
        className={cn("flex flex-col gap-4", className)}
        {...props}
      >
        <div className="flex items-center gap-3">
          <div className={cn("inline-flex items-center justify-center p-3 rounded-md bg-surface-secondary brutal-border-secondary text-foreground", iconClassName)}>
            <Icon className="h-6 w-6" aria-hidden="true" />
          </div>
          <Heading level="h4" className="font-bold text-lg md:text-xl">
            {title}
          </Heading>
        </div>
        <Text variant="body" className="flex-1 text-sm md:text-base">
          {description}
        </Text>
        {actionNode && <div className="mt-2 pt-2 border-t border-border/10">{actionNode}</div>}
      </BrutalCard>
    );
  }
);
FeatureCard.displayName = "FeatureCard";
