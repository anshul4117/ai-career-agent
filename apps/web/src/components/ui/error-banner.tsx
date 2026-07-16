"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type ErrorBannerVariant = "info" | "warning" | "error" | "success";

interface ErrorBannerProps {
  variant?: ErrorBannerVariant;
  message: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

const icons = {
  info: Info,
  warning: AlertTriangle,
  error: AlertCircle,
  success: CheckCircle2,
};

const styles = {
  info: {
    container: "bg-[#e0f2fe] dark:bg-sky-950/30 border-sky-400 dark:border-sky-800 text-sky-800 dark:text-sky-300",
    iconColor: "text-sky-500",
  },
  warning: {
    container: "bg-[#fef3c7] dark:bg-amber-950/30 border-amber-400 dark:border-amber-800 text-amber-800 dark:text-amber-300",
    iconColor: "text-amber-500",
  },
  error: {
    container: "bg-[#fee2e2] dark:bg-red-950/30 border-red-400 dark:border-red-800 text-red-800 dark:text-red-300",
    iconColor: "text-red-500",
  },
  success: {
    container: "bg-[#dcfce7] dark:bg-green-950/30 border-green-400 dark:border-green-800 text-green-800 dark:text-green-300",
    iconColor: "text-green-500",
  },
};

export function ErrorBanner({
  variant = "error",
  message,
  description,
  dismissible = true,
  onDismiss,
  className,
}: ErrorBannerProps) {
  const [isVisible, setIsVisible] = React.useState(true);
  const Icon = icons[variant];
  const colorStyle = styles[variant];

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="alert"
          aria-live="polite"
          initial={{ opacity: 0, scale: 0.98, y: -8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: -8 }}
          transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-full flex items-start gap-3 p-4 border-[3px] border-black dark:border-border brutal-shadow rounded-sm select-none text-xs font-semibold",
            colorStyle.container,
            className
          )}
        >
          <div className={cn("inline-flex h-5 w-5 shrink-0 items-center justify-center", colorStyle.iconColor)}>
            <Icon className="h-4.5 w-4.5 stroke-[2.5px]" />
          </div>
          <div className="flex-1 space-y-1 pr-6">
            <h5 className="font-black uppercase tracking-wide text-foreground">
              {message}
            </h5>
            {description && (
              <p className="text-[10px] text-foreground-secondary leading-relaxed opacity-95">
                {description}
              </p>
            )}
          </div>
          {dismissible && (
            <button
              onClick={handleDismiss}
              className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-sm text-foreground-muted hover:bg-black/5 dark:hover:bg-white/5 hover:text-foreground focus:outline-none transition-colors border border-transparent focus:border-black dark:focus:border-border"
              aria-label="Dismiss banner"
            >
              <X className="h-3.5 w-3.5 stroke-[2.5px]" />
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
