"use client";

import React, { useState } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { InlineLoader } from "@/components/ui/brand-loader";

interface NetworkErrorProps {
  title?: string;
  description?: string;
  onRetry?: () => Promise<void> | void;
}

export function NetworkError({
  title = "Network Request Failed",
  description = "We had trouble communicating with the server. Please verify your connection or refresh the page.",
  onRetry,
}: NetworkErrorProps) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (!onRetry) return;
    setIsRetrying(true);
    try {
      await onRetry();
      toast.success("Connection recovered successfully!");
    } catch {
      toast.error("Retry attempt failed. The server is still unreachable.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex min-h-[300px] flex-col items-center justify-center p-4 text-center select-none"
    >
      <BrutalCard className="p-8 max-w-md w-full border-[3px] border-black dark:border-border bg-surface brutal-shadow space-y-6 rounded-sm">
        <div className="inline-flex p-3 bg-amber-100 dark:bg-amber-500/10 border-2 border-black dark:border-border text-amber-600 dark:text-amber-400 rounded-sm mx-auto">
          <AlertCircle className="h-10 w-10 stroke-[2.5px]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-lg font-black uppercase tracking-tight text-foreground">
            {title}
          </h2>
          <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-sm mx-auto">
            {description}
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          {onRetry && (
            <BrutalButton
              onClick={handleRetry}
              disabled={isRetrying}
              variant="default"
              className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs flex items-center justify-center gap-2"
            >
              {isRetrying && <InlineLoader />}
              {isRetrying ? "Retrying..." : "Retry"}
            </BrutalButton>
          )}
          <BrutalButton
            onClick={handleRefresh}
            variant="secondary"
            className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs flex items-center justify-center gap-2"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Refresh Page
          </BrutalButton>
        </div>
      </BrutalCard>
    </motion.div>
  );
}
export default NetworkError;
