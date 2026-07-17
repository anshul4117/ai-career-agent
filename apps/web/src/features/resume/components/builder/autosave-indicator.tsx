"use client";

import React, { useEffect, useState } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { Cloud, CheckCircle2 } from "lucide-react";
import { InlineLoader } from "@/components/ui/brand-loader";

export function AutoSaveIndicator() {
  const { savingState, lastSaved } = useBuilderStore();
  const [timeText, setTimeText] = useState("Saved just now");

  useEffect(() => {
    if (!lastSaved) return;

    const updateText = () => {
      const diffMs = Date.now() - new Date(lastSaved).getTime();
      const diffSec = Math.floor(diffMs / 1000);

      if (diffSec < 10) {
        setTimeText("Saved just now");
      } else if (diffSec < 60) {
        setTimeText(`Saved ${diffSec}s ago`);
      } else {
        setTimeText(`Saved at ${new Date(lastSaved).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      }
    };

    updateText();
    const interval = setInterval(updateText, 5000);
    return () => clearInterval(interval);
  }, [lastSaved, savingState]);

  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 border-2 border-border bg-surface brutal-shadow-sm text-[10px] font-black uppercase tracking-wider">
      {savingState === "saving" ? (
        <>
          <InlineLoader />
          <span className="text-foreground">Saving...</span>
        </>
      ) : lastSaved ? (
        <>
          <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
          <span className="text-foreground-secondary">{timeText}</span>
        </>
      ) : (
        <>
          <Cloud className="h-3.5 w-3.5 text-foreground-muted shrink-0" />
          <span className="text-foreground-muted">Unsaved changes</span>
        </>
      )}
    </div>
  );
}
