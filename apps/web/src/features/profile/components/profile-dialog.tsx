"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ProfileDialog({
  isOpen,
  onClose,
  title,
  children,
  className,
}: ProfileDialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Trap focus and handle escape key for full accessibility (a11y)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden"; // Prevent body scroll

    // Focus close button or first interactive element
    const focusable = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    if (focusable && focusable.length > 0) {
      (focusable[0] as HTMLElement).focus();
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="dialog-title"
    >
      {/* Click outside overlay to close */}
      <div className="absolute inset-0" onClick={onClose} />

      <div
        ref={dialogRef}
        className={cn(
          "relative w-full max-w-lg bg-surface border-[3px] border-border p-6 brutal-shadow rounded-md overflow-hidden max-h-[90vh] flex flex-col z-10 animate-in fade-in zoom-in-95 duration-150",
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-3 border-border pb-3 shrink-0">
          <Heading level="h3" id="dialog-title" className="text-lg font-black uppercase tracking-tight">
            {title}
          </Heading>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label="Close dialog"
            className="h-8 w-8 rounded-md hover:bg-surface-secondary border-2 border-transparent hover:border-border"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-4 pb-2 pr-1">
          {children}
        </div>
      </div>
    </div>
  );
}
