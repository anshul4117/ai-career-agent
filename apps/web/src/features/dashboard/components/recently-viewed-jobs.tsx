"use client";

import React, { useEffect } from "react";
import { useBookmarkStore } from "@/features/jobs/store/bookmark.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 }
};

export function RecentlyViewedJobs() {
  const { recentlyViewed, loadRecentlyViewed } = useBookmarkStore();

  useEffect(() => {
    loadRecentlyViewed();
  }, [loadRecentlyViewed]);

  if (recentlyViewed.length === 0) return null;

  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-5 brutal-shadow rounded-sm text-left">
      <h3 className="text-xs font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 mb-3 flex items-center gap-1.5">
        <Clock className="h-4 w-4 text-primary" /> Recently Viewed Jobs
      </h3>
      <motion.div 
        variants={listVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-border/10 space-y-2"
      >
        {recentlyViewed.slice(0, 5).map((job) => (
          <motion.div variants={itemVariants} key={job.id} className="pt-2 flex items-center justify-between gap-4 group">
            <div className="min-w-0">
              <p className="text-xs font-black uppercase truncate text-foreground group-hover:text-primary transition-colors">{job.title}</p>
              <p className="text-[9px] font-bold text-foreground-muted uppercase mt-0.5">
                {job.companyInfo.name} • {job.location}
              </p>
            </div>
            <Link
              href={`/jobs/${job.id}`}
              className="text-[9px] font-black uppercase text-primary hover:underline shrink-0 flex items-center gap-0.5"
            >
              View <ArrowRight className="h-3 w-3 stroke-[2.5px]" />
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </BrutalCard>
  );
}
