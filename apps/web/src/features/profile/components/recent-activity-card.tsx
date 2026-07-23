"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { Clock, Pencil, Briefcase, Code, Settings } from "lucide-react";

const MOCK_ACTIVITIES = [
  {
    id: "act_1",
    action: "Updated profile headline & summary",
    time: "2 hours ago",
    icon: Pencil,
  },
  {
    id: "act_2",
    action: "Added work experience at VectorShift",
    time: "1 day ago",
    icon: Briefcase,
  },
  {
    id: "act_3",
    action: "Added skill tag: Next.js (Advanced)",
    time: "3 days ago",
    icon: Code,
  },
  {
    id: "act_4",
    action: "Updated job search preferences",
    time: "1 week ago",
    icon: Settings,
  },
];

export function RecentActivityCard() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        <Heading
          level="h4"
          className="text-base font-black uppercase tracking-tight flex items-center gap-2"
        >
          <Clock className="h-5 w-5 text-primary" aria-hidden="true" />
          Recent Activity
        </Heading>

        <div className="relative border-l-[3px] border-border/20 pl-4 space-y-4 ml-2 pb-1">
          {MOCK_ACTIVITIES.map((activity) => {
            const Icon = activity.icon;
            return (
              <div key={activity.id} className="relative pl-4">
                {/* Timeline node */}
                <span className="absolute -left-[27px] top-0.5 h-6 w-6 rounded-full border-2 border-border bg-surface-secondary flex items-center justify-center brutal-shadow-sm select-none shrink-0">
                  <Icon
                    className="h-3 w-3 text-foreground"
                    aria-hidden="true"
                  />
                </span>

                <div className="space-y-0.5">
                  <p className="text-xs font-bold text-foreground leading-normal">
                    {activity.action}
                  </p>
                  <p className="text-[9px] font-mono font-bold text-foreground-muted uppercase tracking-wider">
                    {activity.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </BrutalCard>
  );
}
