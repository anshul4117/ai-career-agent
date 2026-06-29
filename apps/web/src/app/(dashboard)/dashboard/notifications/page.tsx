"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { Heading, Text } from "@/components/ui/typography";
import { EmptyState } from "@/components/shared/empty-state";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  Briefcase, 
  FileText, 
  Sparkles, 
  User, 
  Settings,
  Circle
} from "lucide-react";
import { cn } from "@/lib/utils";

type NotificationCategory = "all" | "jobs" | "applications" | "ai" | "profile" | "system";

interface NotificationItem {
  id: string;
  category: Exclude<NotificationCategory, "all">;
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif_1",
    category: "jobs",
    title: "New High-Match Opportunity",
    description: "Senior React Developer at Linear Labs (94% match) matches your skills: TypeScript, Tailwind, and Design Systems.",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "notif_2",
    category: "applications",
    title: "Interview Request Received",
    description: "Vercel Startup moved your application for 'Full Stack Developer' to the Interview stage.",
    time: "1 day ago",
    read: false,
  },
  {
    id: "notif_3",
    category: "ai",
    title: "ATS Optimization Complete",
    description: "Your tailored resume for Notion-inspired Co has been optimized. Match score increased from 55% to 88%.",
    time: "2 days ago",
    read: true,
  },
  {
    id: "notif_4",
    category: "profile",
    title: "Profile Onboarding Completed",
    description: "Thank you for completing your career goals profile. Personalized matching is now active.",
    time: "3 days ago",
    read: true,
  },
  {
    id: "notif_5",
    category: "system",
    title: "System Update",
    description: "AI Career Agent Version 1.0 architecture audit finalized. All systems operational.",
    time: "5 days ago",
    read: true,
  },
];

const CATEGORY_LABELS: Record<NotificationCategory, string> = {
  all: "All Alerts",
  jobs: "Jobs Feed",
  applications: "Applications",
  ai: "AI Optimizations",
  profile: "Onboarding",
  system: "System Alerts",
};

const CATEGORY_ICONS: Record<Exclude<NotificationCategory, "all">, React.ComponentType<any>> = {
  jobs: Briefcase,
  applications: FileText,
  ai: Sparkles,
  profile: User,
  system: Settings,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotificationCategory>("all");
  const [isLoading, setIsLoading] = useState(false);

  const filteredNotifications = notifications.filter(
    (n) => activeCategory === "all" || n.category === activeCategory
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setIsLoading(true);
    setTimeout(() => {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setIsLoading(false);
    }, 400);
  };

  const toggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Notifications"
          description="Stay updated on matched jobs, application stages, and resume parsing audits."
        />
        {unreadCount > 0 && (
          <div className="flex items-center gap-2">
            <BrutalButton
              onClick={markAllRead}
              disabled={isLoading}
              variant="secondary"
              size="sm"
              className="h-10 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              <CheckCheck className="h-4 w-4" />
              Mark All Read
            </BrutalButton>
          </div>
        )}
      </div>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b-[3px] border-border pb-4 select-none">
        {(Object.keys(CATEGORY_LABELS) as NotificationCategory[]).map((cat) => {
          const count = cat === "all" 
            ? notifications.length 
            : notifications.filter((n) => n.category === cat).length;
          
          const unreadCountInCat = cat === "all"
            ? notifications.filter((n) => !n.read).length
            : notifications.filter((n) => n.category === cat && !n.read).length;

          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-4 py-2 text-xs font-bold uppercase tracking-wider border-[3px] border-border brutal-shadow transition-all active:translate-x-0 active:translate-y-0 active:shadow-none hover:bg-surface-secondary flex items-center gap-2",
                activeCategory === cat ? "bg-foreground text-surface" : "bg-surface text-foreground"
              )}
            >
              {cat === "all" ? (
                <Bell className="h-3.5 w-3.5" />
              ) : (
                React.createElement(CATEGORY_ICONS[cat as Exclude<NotificationCategory, "all">], {
                  className: "h-3.5 w-3.5",
                })
              )}
              {CATEGORY_LABELS[cat]}
              <span className={cn(
                "ml-1 px-1.5 py-0.5 text-[10px] rounded-sm font-black border-2 border-current",
                activeCategory === cat ? "bg-surface text-foreground" : "bg-foreground text-surface"
              )}>
                {count}
              </span>
              {unreadCountInCat > 0 && (
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              )}
            </button>
          );
        })}
      </div>

      {/* Loading Skeleton Simulation */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-surface border-[3px] border-border brutal-shadow animate-pulse" />
          ))}
        </div>
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          title={`No alerts in ${CATEGORY_LABELS[activeCategory]}`}
          description="Everything is currently quiet. We will notify you when matching jobs or applications status changes occur."
          actionLabel="Go to Dashboard"
          actionHref="/dashboard"
        />
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notif) => {
            const Icon = CATEGORY_ICONS[notif.category];
            return (
              <BrutalCard
                key={notif.id}
                className={cn(
                  "border-[3px] border-border p-4 transition-transform duration-150 flex items-start gap-4 brutal-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow-hover",
                  notif.read ? "bg-surface" : "bg-surface-secondary border-primary/40 ring-1 ring-primary/10"
                )}
              >
                {/* Category Icon with Badge styling */}
                <div className={cn(
                  "p-2.5 border-2 border-border brutal-shadow rounded-md",
                  notif.read ? "bg-surface-secondary" : "bg-primary text-primary-foreground"
                )}>
                  <Icon className="h-5 w-5" />
                </div>

                {/* Content */}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <Heading level="h4" className="text-base font-bold uppercase tracking-tight">
                      {notif.title}
                    </Heading>
                    {!notif.read && (
                      <Badge variant="success" className="text-[9px] px-1 py-0 border border-border tracking-wider font-extrabold uppercase">
                        New
                      </Badge>
                    )}
                  </div>
                  <Text variant="small" className="text-foreground-secondary leading-relaxed">
                    {notif.description}
                  </Text>
                  <div className="flex items-center gap-2 pt-1 text-[11px] font-bold text-foreground-muted uppercase tracking-wider">
                    <span>{CATEGORY_LABELS[notif.category]}</span>
                    <span>•</span>
                    <span>{notif.time}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <BrutalButton
                    onClick={() => toggleRead(notif.id)}
                    variant="secondary"
                    size="sm"
                    className="h-9 w-9 p-0 flex items-center justify-center border-2 border-border brutal-shadow-sm"
                    aria-label={notif.read ? "Mark as unread" : "Mark as read"}
                  >
                    <Circle className={cn("h-4 w-4", notif.read ? "fill-none text-foreground-muted" : "fill-primary text-primary")} />
                  </BrutalButton>
                  <BrutalButton
                    onClick={() => deleteNotification(notif.id)}
                    variant="ghost"
                    size="sm"
                    className="h-9 w-9 p-0 flex items-center justify-center hover:text-error hover:bg-error/10 hover:border-error border-2 border-transparent"
                    aria-label="Delete notification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </BrutalButton>
                </div>
              </BrutalCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
