"use client";

import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

export function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="system"
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-surface group-[.toaster]:text-foreground group-[.toaster]:border-[3px] group-[.toaster]:border-border group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:group-[.toaster]:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] group-[.toaster]:rounded-none group-[.toaster]:font-sans",
          description: "group-[.toast]:text-foreground-secondary",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white group-[.toast]:font-bold group-[.toast]:uppercase",
          cancelButton:
            "group-[.toast]:bg-surface-secondary group-[.toast]:text-foreground-muted group-[.toast]:font-bold group-[.toast]:uppercase",
          error:
            "group-[.toaster]:bg-error/5 border-[3px] border-error group-[.toaster]:text-error",
          success:
            "group-[.toaster]:bg-success/5 border-[3px] border-success group-[.toaster]:text-success-dark dark:group-[.toaster]:text-success-light",
          warning:
            "group-[.toaster]:bg-warning/5 border-[3px] border-warning group-[.toaster]:text-warning-dark dark:group-[.toaster]:text-warning-light",
          info:
            "group-[.toaster]:bg-info/5 border-[3px] border-info group-[.toaster]:text-info-dark dark:group-[.toaster]:text-info-light",
        },
      }}
      {...props}
    />
  );
}
