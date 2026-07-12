"use client";

import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ShieldAlert } from "lucide-react";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center select-none">
      <BrutalCard className="p-8 max-w-md w-full border-[3px] border-border bg-surface brutal-shadow space-y-6 rounded-sm">
        <div className="inline-flex p-3 bg-amber-100 dark:bg-amber-500/20 border-2 border-border text-amber-600 dark:text-amber-400 rounded-sm">
          <ShieldAlert className="h-10 w-10 stroke-[2.5px]" />
        </div>
        
        <div className="space-y-2">
          <Heading level="h1" className="text-4xl font-black uppercase tracking-tighter text-foreground">
            System Failure
          </Heading>
          <Heading level="h3" className="text-xs font-black uppercase tracking-wider text-foreground-secondary">
            Something Went Wrong
          </Heading>
        </div>

        <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-sm mx-auto">
          An unexpected layout or state rendering crash occurred. You can attempt to reload the component or navigate back.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
          <BrutalButton onClick={reset} variant="secondary" className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs">
            Try Again
          </BrutalButton>
          <BrutalButton asChild className="h-10 px-5 text-xs font-black uppercase tracking-wider brutal-shadow-xs">
            <Link href="/dashboard">Dashboard</Link>
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  );
}
