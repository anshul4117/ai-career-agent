"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Map, Briefcase, Home, ChevronRight, AlertTriangle } from "lucide-react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-center select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="max-w-md w-full"
      >
        <BrutalCard className="p-8 border-[3px] border-black dark:border-border bg-surface brutal-shadow space-y-6 rounded-sm">
          {/* Custom Brutalist SVG Illustration */}
          <div className="relative inline-flex p-4 bg-red-100 dark:bg-red-500/10 border-2 border-black dark:border-border text-red-600 dark:text-red-400 rounded-sm mx-auto">
            <Map className="h-12 w-12 stroke-[2.5px]" />
            <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-black border border-black p-0.5 rounded-sm">
              <AlertTriangle className="h-4 w-4 stroke-[3px]" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="text-6xl font-black uppercase tracking-tighter text-foreground leading-none">
              404
            </h1>
            <h3 className="text-sm font-black uppercase tracking-wider text-foreground-secondary">
              Page Not Found
            </h3>
          </div>

          <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-xs mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or may have been moved.
          </p>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col gap-2.5">
            <BrutalButton asChild variant="default" className="h-10 text-xs font-black uppercase tracking-wider brutal-shadow-xs">
              <Link href="/dashboard" className="flex items-center justify-center gap-1.5">
                Back to Dashboard
              </Link>
            </BrutalButton>
            <div className="grid grid-cols-2 gap-2.5">
              <BrutalButton asChild variant="secondary" className="h-10 text-xs font-black uppercase tracking-wider">
                <Link href="/jobs" className="flex items-center justify-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  Browse Jobs
                </Link>
              </BrutalButton>
              <BrutalButton asChild variant="secondary" className="h-10 text-xs font-black uppercase tracking-wider">
                <Link href="/" className="flex items-center justify-center gap-1.5">
                  <Home className="h-3.5 w-3.5" />
                  Go Home
                </Link>
              </BrutalButton>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-border/10 dark:border-border/30 pt-4 mt-2">
            <p className="text-[9px] font-black uppercase tracking-wider text-foreground-muted mb-2 text-left px-1">
              Popular Destinations
            </p>
            <div className="grid grid-cols-1 divide-y-2 divide-border/10 dark:divide-border/30 text-left">
              <Link
                href="/resume"
                className="group flex items-center justify-between py-1.5 text-[10px] font-black uppercase text-foreground hover:text-primary transition-colors px-1"
              >
                <span>Resume Builder</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/applications"
                className="group flex items-center justify-between py-1.5 text-[10px] font-black uppercase text-foreground hover:text-primary transition-colors px-1"
              >
                <span>Applications Tracker</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/cover-letters"
                className="group flex items-center justify-between py-1.5 text-[10px] font-black uppercase text-foreground hover:text-primary transition-colors px-1"
              >
                <span>Cover Letters</span>
                <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </BrutalCard>
      </motion.div>
    </div>
  );
}
