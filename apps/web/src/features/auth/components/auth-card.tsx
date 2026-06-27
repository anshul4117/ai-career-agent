import * as React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { cn } from "@/lib/utils";

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AuthCard({ children, className, ...props }: AuthCardProps) {
  return (
    <BrutalCard
      padding="lg"
      className={cn("w-full bg-surface border-[3px] border-border brutal-shadow", className)}
      {...props}
    >
      {children}
    </BrutalCard>
  );
}
