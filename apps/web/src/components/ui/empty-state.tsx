"use client";
 
import * as React from "react";
import { BrutalCard } from "./brutal-card";
import { BrutalButton } from "./brutal-button";
import { LucideIcon } from "lucide-react";
 
interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}
 
export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryAction,
  secondaryAction
}: EmptyStateProps) {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-10 text-center space-y-4 brutal-shadow max-w-xl mx-auto w-full select-none text-xs font-semibold">
      {/* 1. Icon Container */}
      <div className="h-14 w-14 border-2 border-border bg-slate-100 dark:bg-surface-hover flex items-center justify-center rounded-sm mx-auto text-foreground-muted">
        <Icon className="h-7 w-7 stroke-[2.5px]" />
      </div>
 
      {/* 2. Text Content */}
      <div className="space-y-1.5">
        <h3 className="text-sm font-black uppercase text-foreground tracking-wide">
          {title}
        </h3>
        <p className="text-[10px] text-foreground-secondary leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>
 
      {/* 3. CTA Actions */}
      {(primaryAction || secondaryAction) && (
        <div className="flex justify-center gap-3 pt-2">
          {secondaryAction && (
            <BrutalButton
              onClick={secondaryAction.onClick}
              variant="secondary"
              className="h-9 px-4 uppercase text-[9px] font-black"
            >
              {secondaryAction.label}
            </BrutalButton>
          )}
          {primaryAction && (
            <BrutalButton
              onClick={primaryAction.onClick}
              className="h-9 px-5 uppercase text-[9px] font-black bg-primary text-white"
            >
              {primaryAction.label}
            </BrutalButton>
          )}
        </div>
      )}
    </BrutalCard>
  );
}
export default EmptyState;
