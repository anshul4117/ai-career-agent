import React, { useEffect, useRef } from "react";
import { SearchResult } from "../types/search";
import { cn } from "@/lib/utils";

interface CommandItemProps {
  result: SearchResult;
  isSelected: boolean;
  onSelect: () => void;
  onMouseEnter: () => void;
}

export const CommandItem = React.memo(function CommandItem({ result, isSelected, onSelect, onMouseEnter }: CommandItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && ref.current) {
      ref.current.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected]);

  const Icon = result.icon;

  return (
    <div
      ref={ref}
      role="option"
      aria-selected={isSelected}
      onClick={onSelect}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex items-center px-4 py-2.5 cursor-pointer select-none transition-colors border-l-4",
        isSelected 
          ? "bg-primary/10 border-primary" 
          : "bg-transparent border-transparent"
      )}
    >
      <div className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-sm border-2 mr-3",
        isSelected ? "border-primary bg-primary/20 text-primary" : "border-border/50 bg-surface-secondary text-foreground-muted"
      )}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex flex-col min-w-0 flex-1">
        <span className={cn("text-sm font-bold truncate transition-colors", isSelected ? "text-primary" : "text-foreground")}>
          {result.title}
        </span>
        {(result.company || result.location) && (
          <span className="text-[11px] font-semibold text-foreground-muted truncate">
            {result.company} {result.company && result.location && "•"} {result.location}
          </span>
        )}
      </div>
    </div>
  );
});
