"use client";

import React from "react";
import { StatsCard } from "@/components/ui/stats-card";
import { ANALYTICS_DATA } from "../data/mock-dashboard-data";
import { FileText, Bookmark, Eye, Mail } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  "file-text": FileText,
  "bookmark": Bookmark,
  "eye": Eye,
  "mail": Mail,
};

export function AnalyticsCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
      {ANALYTICS_DATA.map((card, index) => {
        const Icon = ICON_MAP[card.icon] || FileText;
        const trendValue = card.trend === "neutral" ? "stable" : card.trend;
        return (
          <StatsCard
            key={index}
            label={card.title}
            value={card.count}
            trendLabel={card.percentage}
            icon={Icon}
            trend={trendValue}
          />
        );
      })}
    </div>
  );
}
