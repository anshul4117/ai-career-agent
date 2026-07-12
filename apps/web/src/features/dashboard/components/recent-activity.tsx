"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { RECENT_ACTIVITY } from "../data/mock-dashboard-data";
import { FileEdit, FileText, CheckCircle2, RefreshCw, type LucideIcon } from "lucide-react";

const ACTIVITY_ICONS: Record<string, LucideIcon> = {
  resume: FileText,
  application: CheckCircle2,
  profile: FileEdit,
  optimize: RefreshCw,
};

import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0, transition: { duration: 0.2 } }
};

export function RecentActivity() {
  return (
    <div className="space-y-4 w-full min-w-0">
      <Heading level="h3" className="text-xl font-black uppercase tracking-tight">
        Recent Activity History
      </Heading>

      <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow space-y-6">
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="relative border-l-[3px] border-border pl-6 space-y-6 pb-2 ml-3"
        >
          {RECENT_ACTIVITY.map((act) => {
            const Icon = ACTIVITY_ICONS[act.type] || FileText;
            return (
              <motion.div variants={item} key={act.id} className="relative pl-6">
                <span className="absolute -left-[35px] top-0.5 h-7 w-7 rounded-full border-2 border-border bg-surface flex items-center justify-center brutal-shadow-sm shrink-0 select-none">
                  <Icon className="h-3.5 w-3.5 text-primary" />
                </span>
                
                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-foreground">{act.action}</p>
                  <p className="text-[10px] font-mono font-bold text-foreground-muted uppercase tracking-wider">
                    {act.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </BrutalCard>
    </div>
  );
}
