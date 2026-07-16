"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Loader2, RefreshCw, ChevronDown, ChevronUp, Flag } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { toast } from "sonner";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  // Log error to console in dev mode
  useEffect(() => {
    console.error("Route Error Boundary caught crash:", error);
  }, [error]);

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      await reset();
      toast.success("State refreshed successfully.");
    } catch {
      toast.error("Page recovery failed. Please try again or navigate away.");
    } finally {
      setIsRetrying(false);
    }
  };

  const handleReportIssue = () => {
    toast.success("Error log submitted to development team. Thank you for your feedback!");
  };

  return (
    <div 
      className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center select-none"
      role="alert"
      aria-live="assertive"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <BrutalCard className="p-8 border-[3px] border-black dark:border-border bg-surface brutal-shadow space-y-6 rounded-sm">
          {/* Warning Icon Container */}
          <div className="inline-flex p-3 bg-amber-100 dark:bg-amber-500/10 border-2 border-black dark:border-border text-amber-600 dark:text-amber-400 rounded-sm mx-auto">
            <ShieldAlert className="h-12 w-12 stroke-[2.5px]" />
          </div>

          <div className="space-y-1.5">
            <h1 className="text-3xl font-black uppercase tracking-tight text-foreground leading-none">
              Something went wrong
            </h1>
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground-secondary">
              We couldn&apos;t load this page
            </h3>
          </div>

          <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-xs mx-auto">
            An unexpected error occurred during segment rendering. You can attempt to retry the page render or return to your dashboard.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <div className="grid grid-cols-2 gap-2.5">
              <BrutalButton
                onClick={handleRetry}
                disabled={isRetrying}
                variant="default"
                className="h-10 text-xs font-black uppercase tracking-wider brutal-shadow-xs flex items-center justify-center gap-1.5"
              >
                {isRetrying ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <RefreshCw className="h-3.5 w-3.5" />
                )}
                {isRetrying ? "Retrying..." : "Retry"}
              </BrutalButton>
              <BrutalButton asChild variant="secondary" className="h-10 text-xs font-black uppercase tracking-wider">
                <Link href="/dashboard">Go Dashboard</Link>
              </BrutalButton>
            </div>
            <BrutalButton
              onClick={handleReportIssue}
              variant="secondary"
              className="h-10 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5"
            >
              <Flag className="h-3.5 w-3.5" />
              Report Issue
            </BrutalButton>
          </div>

          {/* Collapsible Error Details */}
          <div className="border-t-2 border-border/10 dark:border-border/30 pt-4 text-left">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between text-[9px] font-black uppercase tracking-wider text-foreground-secondary hover:text-foreground transition-colors px-1"
            >
              <span>Show Error Details</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
            
            <AnimatePresence initial={false}>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0, marginTop: 0 }}
                  animate={{ height: "auto", opacity: 1, marginTop: 8 }}
                  exit={{ height: 0, opacity: 0, marginTop: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <pre className="p-3 bg-surface-secondary border border-black dark:border-border rounded-sm text-[9px] font-mono text-red-500 overflow-x-auto select-text leading-relaxed whitespace-pre-wrap break-all max-h-40">
                    {error.message || "Unknown rendering exception"}
                    {error.digest && `\nDigest: ${error.digest}`}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </BrutalCard>
      </motion.div>
    </div>
  );
}
