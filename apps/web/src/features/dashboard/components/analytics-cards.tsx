"use client";

import React from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { ANALYTICS_DATA } from "../data/mock-dashboard-data";
import { FileText, Bookmark, Eye, Mail, type LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  "file-text": FileText,
  "bookmark": Bookmark,
  "eye": Eye,
  "mail": Mail,
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

export function AnalyticsCards() {
  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show" 
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0"
    >
      {ANALYTICS_DATA.map((card, index) => {
        const Icon = ICON_MAP[card.icon] || FileText;
        const trendValue = card.trend === "neutral" ? "stable" : card.trend;
        return (
          <motion.div variants={item} key={index}>
            <StatsCard
              label={card.title}
              value={card.count}
              trendLabel={card.percentage}
              icon={Icon}
              trend={trendValue}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
