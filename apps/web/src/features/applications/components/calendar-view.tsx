"use client";
 
import React from "react";
import type { JobApplication } from "../types/application.types";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  CalendarDays,
  Gift,
  Code,
  BellRing
} from "lucide-react";
import { cn } from "@/lib/utils";
 
interface CalendarViewProps {
  applications: JobApplication[];
  onOpenDetails: (id: string) => void;
}
 
interface CalendarEvent {
  applicationId: string;
  company: string;
  jobTitle: string;
  type: "interview" | "offer" | "assessment" | "followup";
  label: string;
}
 
export function CalendarView({ applications, onOpenDetails }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
 
  // Month navigation
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
 
  // Month details helper
  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const prevTotalDays = new Date(year, month, 0).getDate();
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];
 
  const daysGrid = React.useMemo(() => {
    const tempGrid: { dayNumber: number; isCurrentMonth: boolean; dateStr: string }[] = [];
    
    // Backfill previous month days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevTotalDays - i;
      const prevDate = new Date(year, month - 1, d);
      tempGrid.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateStr: prevDate.toISOString().split("T")[0]
      });
    }
 
    // Current month days
    for (let d = 1; d <= totalDays; d++) {
      const currDate = new Date(year, month, d);
      tempGrid.push({
        dayNumber: d,
        isCurrentMonth: true,
        dateStr: currDate.toISOString().split("T")[0]
      });
    }
 
    // Frontfill next month days to make grid grid multiples of 7
    const remaining = 42 - tempGrid.length;
    for (let d = 1; d <= remaining; d++) {
      const nextDate = new Date(year, month + 1, d);
      tempGrid.push({
        dayNumber: d,
        isCurrentMonth: false,
        dateStr: nextDate.toISOString().split("T")[0]
      });
    }
    
    return tempGrid;
  }, [year, month, firstDayIndex, totalDays, prevTotalDays]);
 
  // Map scheduled interviews, offer deadlines, and follow-ups by date
  const dateEventsMap = React.useMemo(() => {
    const map: Record<string, CalendarEvent[]> = {};
    
    applications.forEach((app) => {
      // 1. Interviews (Scheduled or completed)
      if (app.interviewDate) {
        const dStr = app.interviewDate;
        if (!map[dStr]) map[dStr] = [];
        
        const isAssessment = app.status === "ASSESSMENT";
        map[dStr].push({
          applicationId: app.id,
          company: app.company,
          jobTitle: app.jobTitle,
          type: isAssessment ? "assessment" : "interview",
          label: `${app.company}: ${app.interviewRound || "Interview"}`
        });
      }
 
      // 2. Offer Deadlines
      if (app.offerDeadline) {
        const dStr = app.offerDeadline;
        if (!map[dStr]) map[dStr] = [];
        map[dStr].push({
          applicationId: app.id,
          company: app.company,
          jobTitle: app.jobTitle,
          type: "offer",
          label: `${app.company}: Offer Deadline`
        });
      }
 
      // 3. Follow-up Reminders (Mocked to be 7 days after appliedAt)
      if (app.appliedAt && (app.status === "APPLIED" || app.status === "SCREENING")) {
        const dateObj = new Date(app.appliedAt);
        dateObj.setDate(dateObj.getDate() + 7);
        const dStr = dateObj.toISOString().split("T")[0];
        if (!map[dStr]) map[dStr] = [];
        map[dStr].push({
          applicationId: app.id,
          company: app.company,
          jobTitle: app.jobTitle,
          type: "followup",
          label: `${app.company}: Follow-up`
        });
      }
    });
    
    return map;
  }, [applications]);
 
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
 
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs text-left">
      {/* Calendar Header */}
      <div className="flex justify-between items-center border-b-2 border-border pb-3 mb-4">
        <h3 className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-primary" /> {monthNames[month]} {year}
        </h3>
        
        <div className="flex items-center gap-1.5">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={prevMonth}
            className="h-8 w-8 border border-border/20 hover:bg-surface-secondary rounded-sm"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={nextMonth}
            className="h-8 w-8 border border-border/20 hover:bg-surface-secondary rounded-sm"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
 
      {/* Week days label row */}
      <div className="grid grid-cols-7 text-center border-b border-border/10 pb-1.5 text-[8.5px] font-black uppercase text-foreground-muted">
        {weekDays.map((wd) => (
          <div key={wd}>{wd}</div>
        ))}
      </div>
 
      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1.5 mt-2">
        {daysGrid.map((cell, idx) => {
          const events = dateEventsMap[cell.dateStr] || [];
          const isToday = cell.dateStr === new Date().toISOString().split("T")[0];
 
          return (
            <div
              key={idx}
              className={cn(
                "min-h-[70px] md:min-h-[95px] border border-border/20 p-1 flex flex-col justify-between rounded-sm relative text-[8px] font-bold uppercase transition-all bg-surface",
                !cell.isCurrentMonth && "opacity-30 bg-slate-50/50 dark:bg-surface-secondary/50",
                isToday && "border-primary bg-amber-50 dark:bg-amber-500/10/10 border-2"
              )}
            >
              {/* Day Number */}
              <span className={cn(
                "self-end text-[9px] font-black tracking-tighter px-0.5",
                isToday && "text-primary border-b border-primary"
              )}>
                {cell.dayNumber}
              </span>
 
              {/* Event indicators */}
              <div className="flex-1 flex flex-col justify-end gap-1 mt-1 overflow-hidden">
                {events.map((evt, eIdx) => {
                  const isInterview = evt.type === "interview";
                  const isOffer = evt.type === "offer";
                  const isAssessment = evt.type === "assessment";
                  
                  return (
                    <button
                      key={eIdx}
                      onClick={() => onOpenDetails(evt.applicationId)}
                      className={cn(
                        "w-full text-left p-0.5 border border-border rounded-sm text-[7px] font-extrabold uppercase leading-none truncate flex items-center gap-1 cursor-pointer transition-colors",
                        isInterview && "bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20/50 text-amber-900 border-amber-300 dark:border-amber-500/30",
                        isOffer && "bg-emerald-50 hover:bg-emerald-100/50 text-emerald-900 border-emerald-300",
                        isAssessment && "bg-purple-50 hover:bg-purple-100 dark:hover:bg-purple-500/20/50 text-purple-900 border-purple-300",
                        evt.type === "followup" && "bg-blue-50 dark:bg-blue-500/10 hover:bg-blue-100 dark:hover:bg-blue-500/20/50 text-blue-900 border-blue-300 dark:border-blue-500/30"
                      )}
                      title={evt.label}
                      aria-label={`${evt.type} event: ${evt.label}`}
                    >
                      {isInterview && <Video className="h-2.5 w-2.5 text-primary shrink-0" />}
                      {isOffer && <Gift className="h-2.5 w-2.5 text-emerald-600 shrink-0" />}
                      {isAssessment && <Code className="h-2.5 w-2.5 text-purple-600 shrink-0" />}
                      {evt.type === "followup" && <BellRing className="h-2.5 w-2.5 text-blue-600 dark:text-blue-400 shrink-0" />}
                      <span className="truncate flex-1">{evt.company}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </BrutalCard>
  );
}
