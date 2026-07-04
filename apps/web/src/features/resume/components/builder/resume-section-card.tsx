"use client";

import React, { useState } from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading } from "@/components/ui/typography";
import { 
  ChevronDown, ChevronUp, Plus, GripVertical, 
  Eye, EyeOff, ArrowUp, ArrowDown, Trash2 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ResumeSectionCardProps {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  onAddItem?: () => void;
  addItemLabel?: string;
  children: React.ReactNode;
  className?: string;
  
  // Controls (Sprint 3.3)
  dragHandleProps?: Record<string, unknown>;
  isHidden?: boolean;
  onToggleVisibility?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onDeleteSection?: () => void;
  onTitleChange?: (newTitle: string) => void;
}

export function ResumeSectionCard({
  id,
  title,
  icon: Icon,
  onAddItem,
  addItemLabel = "Add Item",
  children,
  className,
  dragHandleProps,
  isHidden = false,
  onToggleVisibility,
  onMoveUp,
  onMoveDown,
  onDeleteSection,
  onTitleChange
}: ResumeSectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <BrutalCard
      id={id}
      className={cn(
        "bg-surface border-[3px] border-border brutal-shadow-sm scroll-mt-24 w-full transition-all duration-150",
        isHidden && "opacity-75 border-dashed bg-surface-secondary/10",
        className
      )}
    >
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-border p-4 bg-surface-secondary/10 gap-3">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          {/* Grip Handle */}
          {dragHandleProps && (
            <div 
              {...dragHandleProps} 
              className="p-1 border border-border/20 hover:bg-surface-secondary cursor-grab active:cursor-grabbing shrink-0"
              aria-label="Drag to reorder section"
            >
              <GripVertical className="h-4 w-4 text-foreground-muted" />
            </div>
          )}
          <Icon className="h-5 w-5 text-primary shrink-0" />
          
          {/* Editable title for custom sections */}
          {onTitleChange ? (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="font-black uppercase text-sm tracking-wider text-foreground border-b-2 border-transparent hover:border-border/30 focus:border-primary focus:outline-none bg-transparent p-0.5 truncate flex-1"
              placeholder="Custom Section Title"
            />
          ) : (
            <Heading level="h4" className="text-sm font-black uppercase tracking-wider text-foreground truncate">
              {title}
            </Heading>
          )}

          {isHidden && (
            <span className="text-[8px] font-black uppercase bg-error/10 text-error border border-error px-1.5 py-0.2 shrink-0">
              Hidden
            </span>
          )}
        </div>

        {/* Section Actions Panel */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Visibility Toggle */}
          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              className="h-11 w-11 md:h-10 md:w-10 flex items-center justify-center border-2 border-border bg-surface hover:bg-surface-secondary brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0"
              aria-label={isHidden ? "Show section" : "Hide section"}
            >
              {isHidden ? (
                <EyeOff className="h-4 w-4 text-error" />
              ) : (
                <Eye className="h-4 w-4 text-foreground-secondary" />
              )}
            </button>
          )}

          {/* Move Up Button */}
          {onMoveUp && (
            <button
              type="button"
              onClick={onMoveUp}
              className="h-11 w-11 md:h-10 md:w-10 flex items-center justify-center border-2 border-border bg-surface hover:bg-surface-secondary brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0"
              aria-label="Move section up"
            >
              <ArrowUp className="h-4 w-4 text-foreground-secondary" />
            </button>
          )}

          {/* Move Down Button */}
          {onMoveDown && (
            <button
              type="button"
              onClick={onMoveDown}
              className="h-11 w-11 md:h-10 md:w-10 flex items-center justify-center border-2 border-border bg-surface hover:bg-surface-secondary brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0"
              aria-label="Move section down"
            >
              <ArrowDown className="h-4 w-4 text-foreground-secondary" />
            </button>
          )}

          {/* Custom Section Delete */}
          {onDeleteSection && (
            <button
              type="button"
              onClick={onDeleteSection}
              className="h-11 w-11 md:h-10 md:w-10 flex items-center justify-center border-2 border-border bg-surface text-error hover:bg-error/10 brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0"
              aria-label="Delete custom section"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}

          {/* Add Item Action (Visible only if expanded and handler is supplied) */}
          {isExpanded && onAddItem && !isHidden && (
            <BrutalButton
              type="button"
              onClick={onAddItem}
              className="h-11 md:h-9 px-3.5 text-[10px] font-black uppercase flex items-center gap-1.5 brutal-shadow-xs"
            >
              <Plus className="h-4.5 w-4.5 stroke-[3px]" />
              {addItemLabel}
            </BrutalButton>
          )}

          {/* Toggle Expand/Collapse */}
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-11 w-11 md:h-10 md:w-10 flex items-center justify-center border-2 border-border bg-surface hover:bg-surface-secondary brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0"
            aria-label={isExpanded ? `Collapse ${title}` : `Expand ${title}`}
          >
            {isExpanded ? (
              <ChevronUp className="h-4.5 w-4.5" />
            ) : (
              <ChevronDown className="h-4.5 w-4.5" />
            )}
          </button>
        </div>
      </div>

      {/* Editable Fields (Padded when open) */}
      <div
        className={cn(
          "transition-all duration-200 ease-in-out overflow-hidden",
          isExpanded && !isHidden ? "max-h-[3000px] p-4 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {children}
      </div>
      
      {/* Fallback state when hidden */}
      {isHidden && (
        <div className="p-4 bg-surface-secondary/5 text-center text-xs font-bold uppercase text-foreground-muted select-none">
          This section is hidden from the live resume printable canvas.
        </div>
      )}
    </BrutalCard>
  );
}
