"use client";

import React from "react";
import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading } from "@/components/ui/typography";
import { Badge } from "@/components/ui/badge";
import { RECENT_APPLICATIONS } from "../data/mock-dashboard-data";
import { ArrowRight, Eye } from "lucide-react";

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "success" | "warning" | "outline"> = {
  applied: "secondary",
  interviewing: "warning",
  offer: "success",
  rejected: "outline",
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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
};

export function RecentApplications() {
  return (
    <div className="space-y-4 w-full min-w-0">
      <div className="flex items-center justify-between">
        <Heading level="h3" className="text-xl font-black uppercase tracking-tight">
          Recent Applications
        </Heading>
        <Link 
          href="/applications" 
          className="text-xs font-bold uppercase tracking-wider text-primary hover:underline flex items-center gap-1"
        >
          View Tracker Board
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <BrutalCard className="bg-surface border-[3px] border-border p-0 brutal-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse" role="table">
            <thead>
              <tr className="border-b-[3px] border-border bg-surface-secondary text-xs uppercase font-extrabold select-none">
                <th className="p-2 sm:p-4" role="columnheader">Company</th>
                <th className="p-2 sm:p-4" role="columnheader">Role</th>
                <th className="p-2 sm:p-4" role="columnheader">Applied Date</th>
                <th className="p-2 sm:p-4" role="columnheader">Status</th>
                <th className="p-2 sm:p-4" role="columnheader">Current Stage</th>
                <th className="p-2 sm:p-4 text-right" role="columnheader">Actions</th>
              </tr>
            </thead>
            <motion.tbody 
              variants={container} 
              initial="hidden" 
              animate="show" 
              className="divide-y-2 divide-border text-sm"
            >
              {RECENT_APPLICATIONS.map((app) => (
                <motion.tr variants={item} key={app.id} className="hover:bg-surface-secondary/50 transition-colors">
                  <td className="p-2 sm:p-4 font-bold">{app.company}</td>
                  <td className="p-2 sm:p-4 text-foreground-secondary">{app.role}</td>
                  <td className="p-2 sm:p-4 text-foreground-secondary font-mono text-xs">{app.appliedDate}</td>
                  <td className="p-2 sm:p-4">
                    <Badge variant={STATUS_VARIANTS[app.status]} className="text-[10px] uppercase font-black px-2 py-0.5 border border-current">
                      {app.status}
                    </Badge>
                  </td>
                  <td className="p-2 sm:p-4 font-semibold text-xs text-foreground-secondary">{app.timelineBadge}</td>
                  <td className="p-2 sm:p-4 text-right">
                    <BrutalButton asChild variant="secondary" size="sm" className="h-8 px-3 uppercase font-bold text-[10px] tracking-wider inline-flex items-center gap-1">
                      <Link href="/applications">
                        <Eye className="h-3.5 w-3.5" />
                        View
                      </Link>
                    </BrutalButton>
                  </td>
                </motion.tr>
              ))}
            </motion.tbody>
          </table>
        </div>
      </BrutalCard>
    </div>
  );
}
