import * as React from "react";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { BrutalCard, type BrutalCardProps } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type TrendDirection = "up" | "down" | "stable";

export interface StatsCardProps extends Omit<BrutalCardProps, "children"> {
  label: string;
  value: string | number;
  trend?: TrendDirection;
  trendLabel?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ label, value, trend, trendLabel, icon: Icon, className, ...props }, ref) => {
    return (
      <BrutalCard ref={ref} className={cn("flex flex-col gap-2 justify-between", className)} {...props}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <Text variant="small" className="font-semibold uppercase tracking-wider text-foreground-muted">
              {label}
            </Text>
            <Heading level="h3" className="text-3xl font-bold tracking-tight">
              {value}
            </Heading>
          </div>
          {Icon && (
            <div className="p-2 rounded-md bg-surface-secondary brutal-border-secondary text-foreground">
              <Icon className="h-5 w-5" aria-hidden="true" />
            </div>
          )}
        </div>

        {trend && (
          <div className="mt-2 flex items-center gap-1.5 text-sm">
            {trend === "up" && (
              <span className="flex items-center gap-0.5 font-semibold text-success bg-success/10 px-2 py-0.5 rounded-sm border border-success/20">
                <ArrowUpRight className="h-4 w-4 shrink-0" />
                {trendLabel}
              </span>
            )}
            {trend === "down" && (
              <span className="flex items-center gap-0.5 font-semibold text-error bg-error/10 px-2 py-0.5 rounded-sm border border-error/20">
                <ArrowDownRight className="h-4 w-4 shrink-0" />
                {trendLabel}
              </span>
            )}
            {trend === "stable" && (
              <span className="flex items-center gap-0.5 font-semibold text-foreground-muted bg-surface-secondary px-2 py-0.5 rounded-sm border border-border/10">
                <Minus className="h-4 w-4 shrink-0" />
                {trendLabel}
              </span>
            )}
          </div>
        )}
      </BrutalCard>
    );
  }
);
StatsCard.displayName = "StatsCard";
