"use client";
 
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { NotificationsSkeleton } from "@/components/ui/skeleton-loaders";
import { useNotificationsStore } from "@/features/notifications/store/notifications.store";
import { useShallow } from "zustand/react/shallow";
import type { NotificationCategory, NotificationItem as NotificationType } from "@/features/notifications/types/notifications.types";
import { 
  Bell, 
  CheckCheck, 
  Trash2, 
  FileText, 
  Sparkles, 
  TrendingUp,
  Mail,
  Info,
  Circle,
  Eye,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
 
type CategoryFilter = "all" | NotificationCategory;
 
const CATEGORY_LABELS: Record<CategoryFilter, string> = {
  all: "All Notifications",
  job_alerts: "Job Alerts",
  applications: "Applications",
  resume_parsing: "Resume Parsing",
  resume_optimization: "Resume Tailoring",
  ai_match: "AI Matches",
  cover_letter: "Cover Letters",
  system: "System Alerts",
};
 
const CATEGORY_ICONS: Record<NotificationCategory, LucideIcon> = {
  job_alerts: Bell,
  applications: FileText,
  resume_parsing: Sparkles,
  resume_optimization: TrendingUp,
  ai_match: Sparkles,
  cover_letter: Mail,
  system: Info,
};

const formatTime = (isoString: string) => {
  try {
    const date = new Date(isoString);
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (60 * 1000));
    const diffHours = Math.floor(diffMs / (60 * 60 * 1000));
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  } catch {
    return "recently";
  }
};

const NotificationCard = React.memo(function NotificationCard({
  notif,
  onView,
  onMarkRead,
  onDelete
}: {
  notif: NotificationType;
  onView: (id: string, actionUrl?: string) => void;
  onMarkRead: (id: string, read: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = CATEGORY_ICONS[notif.category];
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, x: -20 }}
      transition={{ duration: 0.2 }}
    >
      <BrutalCard
        className={cn(
          "border-2 border-border p-3 flex items-start gap-3.5 rounded-sm relative text-left transition-all brutal-shadow-xs hover:brutal-shadow",
          notif.read ? "bg-surface" : "bg-surface-secondary/40 border-primary/30"
        )}
      >
        {/* Category Icon */}
        <div className={cn(
          "p-2 border border-border rounded-sm shrink-0",
          notif.read ? "bg-surface text-foreground-muted" : "bg-primary text-white"
        )}>
          <Icon className="h-4 w-4" />
        </div>

        {/* Content Details */}
        <div className="flex-1 space-y-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h4 className="text-xs font-black uppercase text-foreground leading-tight tracking-tight">
              {notif.title}
            </h4>
            {!notif.read && (
              <Badge className="text-[7px] font-black uppercase bg-primary text-white border-2 border-border px-1 py-0.5">
                New
              </Badge>
            )}
          </div>
          <p className="text-[10px] text-foreground-muted leading-relaxed font-semibold">
            {notif.description}
          </p>
          <div className="flex items-center gap-2 pt-1 text-[8px] font-bold text-foreground-muted uppercase tracking-wider">
            <span>{CATEGORY_LABELS[notif.category]}</span>
            <span>•</span>
            <span>{formatTime(notif.timestamp)}</span>
          </div>
        </div>

        {/* Actions (View details & Toggle read & Delete) */}
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          {notif.actionUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(notif.id, notif.actionUrl)}
              className="h-8 px-2 text-[9px] font-black uppercase text-foreground border border-border/20 rounded-sm flex items-center gap-1 hover:bg-surface-secondary"
              aria-label="View action details"
            >
              <Eye className="h-3 w-3" /> View
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onMarkRead(notif.id, !notif.read)}
            className="h-8 w-8 p-0 flex items-center justify-center border border-border/20 rounded-sm hover:bg-surface-secondary text-foreground"
            aria-label={notif.read ? "Mark as unread" : "Mark as read"}
          >
            <Circle className={cn("h-3 w-3", notif.read ? "fill-none text-foreground-muted" : "fill-primary text-primary")} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(notif.id)}
            className="h-8 w-8 p-0 flex items-center justify-center text-error border border-border/20 rounded-sm hover:bg-error/5 hover:border-error"
            aria-label="Delete notification"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </BrutalCard>
    </motion.div>
  );
});

export default function NotificationsPage() {
  const router = useRouter();
  const { 
    notifications, 
    loading, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationsStore(useShallow(state => ({
    notifications: state.notifications,
    loading: state.loading,
    fetchNotifications: state.fetchNotifications,
    markAsRead: state.markAsRead,
    markAllAsRead: state.markAllAsRead,
    deleteNotification: state.deleteNotification
  })));
 
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
 
  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);
 
  // Client-side filtering (Memoized)
  const filteredNotifications = React.useMemo(() => {
    return notifications
      .filter((n) => activeCategory === "all" || n.category === activeCategory)
      .filter((n) => {
        if (readFilter === "unread") return !n.read;
        if (readFilter === "read") return n.read;
        return true;
      });
  }, [notifications, activeCategory, readFilter]);
 
  const unreadCount = React.useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);
 
  const handleView = (id: string, actionUrl?: string) => {
    markAsRead(id, true);
    if (actionUrl) {
      router.push(actionUrl);
    }
  };
 
  return (
    <div className="space-y-5 pb-12 text-left select-none max-w-[1200px] mx-auto w-full">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Notification Center"
          description="Track your matching roles, ATS optimization runs, and cover letter generations in one feed."
        />
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            disabled={loading}
            className="sm:self-end h-9 border-2 border-border bg-accent text-foreground brutal-shadow-xs hover:brutal-shadow flex items-center gap-1.5 rounded-sm font-black uppercase text-xs"
          >
            <CheckCheck className="h-4 w-4 stroke-[3px]" />
            Mark All Read
          </Button>
        )}
      </div>
 
      {/* Toolbar Options (Category & Read/Unread Filters) */}
      <div className="space-y-3 bg-surface p-3.5 border-2 border-border rounded-sm">
        
        {/* Category filtering tags */}
        <div className="flex flex-wrap gap-1.5 border-b border-border/10 pb-3">
          {(Object.keys(CATEGORY_LABELS) as CategoryFilter[]).map((cat) => {
            const count = cat === "all" 
              ? notifications.length 
              : notifications.filter((n) => n.category === cat).length;
            
            const hasUnread = cat === "all"
              ? notifications.some((n) => !n.read)
              : notifications.some((n) => n.category === cat && !n.read);
 
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-2 border-border brutal-shadow-xs hover:bg-surface-secondary flex items-center gap-1.5 rounded-sm transition-all",
                  activeCategory === cat ? "bg-foreground text-surface" : "bg-surface text-foreground"
                )}
              >
                {cat === "all" ? (
                  <Bell className="h-3 w-3 shrink-0" />
                ) : (
                  React.createElement(CATEGORY_ICONS[cat as NotificationCategory], {
                    className: "h-3 w-3 shrink-0",
                  })
                )}
                <span>{CATEGORY_LABELS[cat]}</span>
                <span className={cn(
                  "px-1 py-0.2 text-[8px] rounded-sm font-black border",
                  activeCategory === cat ? "bg-surface text-foreground border-surface" : "bg-foreground text-surface border-foreground"
                )}>
                  {count}
                </span>
                {hasUnread && (
                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </div>
 
        {/* Read / Unread filtering buttons */}
        <div className="flex gap-2 text-[9px] font-black uppercase text-foreground-muted items-center">
          <span>Filter Status:</span>
          {(["all", "unread", "read"] as const).map((status) => (
            <button
              key={status}
              onClick={() => setReadFilter(status)}
              className={cn(
                "px-2 py-0.5 border-2 border-border brutal-shadow-xs rounded-sm transition-all",
                readFilter === status ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary text-foreground"
              )}
            >
              {status}
            </button>
          ))}
        </div>
 
      </div>
 
      {/* Main Inbox Render */}
      {loading && notifications.length === 0 ? (
        <NotificationsSkeleton />
      ) : filteredNotifications.length === 0 ? (
        <EmptyState
          icon={Bell}
          title={`No notifications in ${CATEGORY_LABELS[activeCategory]}`}
          description="Everything is currently quiet. We will notify you when matching jobs or applications status changes occur."
          primaryAction={{
            label: "Go to Job Discovery",
            onClick: () => router.push("/jobs")
          }}
        />
      ) : (
        <motion.div layout className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.map((notif) => (
              <NotificationCard 
                key={notif.id}
                notif={notif}
                onView={handleView}
                onMarkRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
