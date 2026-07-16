"use client";

import React, { useState } from "react";
import { WifiOff, Loader2 } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface OfflineStateProps {
  onBackOnline?: () => void;
}

export function OfflineState({ onBackOnline }: OfflineStateProps) {
  const [isChecking, setIsChecking] = useState(false);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    // Simulate minor loading network check
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    const isOnline = typeof window !== "undefined" ? window.navigator.onLine : true;
    setIsChecking(false);

    if (isOnline) {
      toast.success("You are back online! Reconnecting to services...");
      if (onBackOnline) {
        onBackOnline();
      }
    } else {
      toast.error("Still offline. Please verify your connection settings and try again.");
    }
  };

  const handleContinueOffline = () => {
    toast.info("Continuing in offline cached mode. Some features may be disabled.");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex min-h-[400px] flex-col items-center justify-center p-4 text-center select-none"
    >
      <BrutalCard className="p-8 max-w-md w-full border-[3px] border-black dark:border-border bg-surface brutal-shadow space-y-6 rounded-sm">
        <div className="inline-flex p-3 bg-red-100 dark:bg-red-500/10 border-2 border-black dark:border-border text-red-600 dark:text-red-400 rounded-sm mx-auto">
          <WifiOff className="h-10 w-10 stroke-[2.5px]" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-black uppercase tracking-tight text-foreground">
            You appear to be offline
          </h2>
          <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-sm mx-auto">
            Please check your internet connection or try reconnecting to retrieve your current dashboard updates.
          </p>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <BrutalButton
            onClick={handleCheckConnection}
            disabled={isChecking}
            variant="default"
            className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs flex items-center justify-center gap-2"
          >
            {isChecking && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isChecking ? "Checking..." : "Retry Connection"}
          </BrutalButton>
          <BrutalButton
            onClick={handleContinueOffline}
            variant="secondary"
            className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs"
          >
            Continue Offline
          </BrutalButton>
        </div>
      </BrutalCard>
    </motion.div>
  );
}
export default OfflineState;
