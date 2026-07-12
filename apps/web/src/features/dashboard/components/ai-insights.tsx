"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { AI_INSIGHTS } from "../data/mock-dashboard-data";
import { Sparkles, Key, AlertCircle, Award, Compass, type LucideIcon } from "lucide-react";

const INSIGHT_ICONS: Record<string, LucideIcon> = {
  keyword: Key,
  profile: AlertCircle,
  skill: Award,
  tip: Compass,
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
  hidden: { opacity: 0, scale: 0.95 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.2 } }
};

export function AIInsights() {
  return (
    <div className="space-y-4 w-full min-w-0">
      <Heading level="h3" className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-primary" />
        AI Insights & Tips
      </Heading>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-4 sm:grid-cols-2"
      >
        {AI_INSIGHTS.map((insight) => {
          const Icon = INSIGHT_ICONS[insight.type] || Compass;
          return (
            <motion.div variants={item} key={insight.id}>
              <BrutalCard
                className="bg-surface border-[3px] border-border p-5 flex gap-4 brutal-shadow transition-transform duration-150 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow-hover"
              >
                <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <Heading level="h4" className="text-sm font-bold uppercase tracking-tight">
                    {insight.title}
                  </Heading>
                  <Text className="text-foreground-secondary text-xs leading-relaxed">
                    {insight.description}
                  </Text>
                </div>
              </BrutalCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
