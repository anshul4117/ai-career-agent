"use client";
 
import React from "react";
import type { JobApplication } from "../types/application.types";
import { analyticsService } from "../services/analytics.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { 
  Clock, 
  TrendingUp, 
  UserCheck, 
  Briefcase, 
  Award,
  Video,
  AlertCircle,
  FileText,
  ExternalLink,
  Gift,
  BellRing
} from "lucide-react";
 
interface ApplicationsDashboardProps {
  applications: JobApplication[];
  onOpenDetails: (id: string) => void;
}
 
export function ApplicationsDashboard({ applications, onOpenDetails }: ApplicationsDashboardProps) {
  const stats = React.useMemo(() => {
    const total = applications.length;
    const saved = applications.filter((a) => a.status === "SAVED").length;
    const applied = applications.filter((a) => a.status === "APPLIED").length;
    const screening = applications.filter((a) => a.status === "SCREENING").length;
    const assessment = applications.filter((a) => a.status === "ASSESSMENT").length;
    const interview = applications.filter((a) => a.status === "INTERVIEW").length;
    const offer = applications.filter((a) => a.status === "OFFER").length;
    const accepted = applications.filter((a) => a.status === "ACCEPTED").length;
    const rejected = applications.filter((a) => a.status === "REJECTED").length;
    
    return {
      total,
      saved,
      applied,
      screening,
      assessment,
      interview,
      offer,
      accepted,
      rejected,
      active: total - saved - accepted - rejected
    };
  }, [applications]);
 
  const conversion = React.useMemo(() => {
    return analyticsService.calculateRates(applications);
  }, [applications]);
 
  const monthlyData = React.useMemo(() => {
    return analyticsService.getMonthlyData(applications);
  }, [applications]);
 
  // Advanced Widgets Memo Data
  const upcomingInterviews = React.useMemo(() => {
    return applications
      .filter((a) => a.interviewDate && a.interviewStatus === "Scheduled")
      .sort((a, b) => new Date(a.interviewDate).getTime() - new Date(b.interviewDate).getTime())
      .slice(0, 3);
  }, [applications]);
 
  const recentApplications = React.useMemo(() => {
    return [...applications]
      .filter((a) => a.status !== "SAVED")
      .sort((a, b) => new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime())
      .slice(0, 3);
  }, [applications]);
 
  const offersReceived = React.useMemo(() => {
    return applications.filter((a) => a.status === "OFFER");
  }, [applications]);
 
  const followUpReminders = React.useMemo(() => {
    return applications.filter((a) => a.followUpNotes && (a.status === "APPLIED" || a.status === "SCREENING"));
  }, [applications]);
 
  const weeklyActivity = React.useMemo(() => {
    const counts = [0, 0, 0, 0, 0, 0, 0]; // Sun to Sat
    applications.forEach((app) => {
      if (app.appliedAt) {
        const date = new Date(app.appliedAt);
        counts[date.getDay()]++;
      }
    });
    return counts;
  }, [applications]);
 
  // Chart geometry helpers
  const maxCount = Math.max(...monthlyData.map((d) => d.count), 5);
  const chartHeight = 100;
  const chartWidth = 300;
  const padding = 20;
  const points = monthlyData
    .map((d, i) => {
      const x = padding + (i * (chartWidth - padding * 2)) / (monthlyData.length - 1);
      const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxCount;
      return `${x},${y}`;
    })
    .join(" ");
 
  const weekdayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const maxWeeklyCount = Math.max(...weeklyActivity, 1);
 
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 1. Statistics Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center rounded-sm text-blue-700 dark:text-blue-400 shrink-0">
            <Briefcase className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Total Queue</span>
            <span className="text-lg font-black text-foreground">{stats.total} Roles</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center rounded-sm text-amber-700 dark:text-amber-400 shrink-0">
            <Clock className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Active Pipelines</span>
            <span className="text-lg font-black text-foreground">{stats.active} Active</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-green-100 dark:bg-green-500/20 flex items-center justify-center rounded-sm text-green-700 dark:text-green-400 shrink-0">
            <Award className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Offers Won</span>
            <span className="text-lg font-black text-foreground">{stats.offer + stats.accepted} Offers</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-rose-100 dark:bg-rose-500/20 flex items-center justify-center rounded-sm text-rose-700 dark:text-rose-400 shrink-0">
            <UserCheck className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Response Rate</span>
            <span className="text-lg font-black text-foreground">{conversion.responseRate}% Rate</span>
          </div>
        </BrutalCard>
      </div>
 
      {/* 2. Grid split: funnel conversions vs monthly charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Conversion Funnel */}
        <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm brutal-shadow-xs space-y-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-primary" /> Application Funnel Analytics
          </h3>
          
          <div className="space-y-3.5">
            {/* Response Rate */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span>Employer Response Rate</span>
                <span className="text-blue-600 dark:text-blue-400">{conversion.responseRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-surface-hover border-2 border-border rounded-sm overflow-hidden" role="progressbar" aria-valuenow={conversion.responseRate} aria-valuemin={0} aria-valuemax={100} aria-label="Employer Response Rate Progress">
                <div className="h-full bg-blue-500 border-r border-border" style={{ width: `${conversion.responseRate}%` }} />
              </div>
            </div>
 
            {/* Interview Rate */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span>Interview Invite Rate</span>
                <span className="text-amber-600 dark:text-amber-400">{conversion.interviewRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-surface-hover border-2 border-border rounded-sm overflow-hidden" role="progressbar" aria-valuenow={conversion.interviewRate} aria-valuemin={0} aria-valuemax={100} aria-label="Interview Invitation Rate Progress">
                <div className="h-full bg-amber-500 border-r border-border" style={{ width: `${conversion.interviewRate}%` }} />
              </div>
            </div>
 
            {/* Offer Rate */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-[9px] font-black uppercase">
                <span>Offer Conversion Rate</span>
                <span className="text-green-600 dark:text-green-400">{conversion.offerRate}%</span>
              </div>
              <div className="h-3 w-full bg-slate-100 dark:bg-surface-hover border-2 border-border rounded-sm overflow-hidden" role="progressbar" aria-valuenow={conversion.offerRate} aria-valuemin={0} aria-valuemax={100} aria-label="Offer Conversion Rate Progress">
                <div className="h-full bg-green-500 border-r border-border" style={{ width: `${conversion.offerRate}%` }} />
              </div>
            </div>
          </div>
        </BrutalCard>
 
        {/* Applications Chart */}
        <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm brutal-shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
              Monthly Pipeline Distribution
            </h3>
          </div>
 
          {/* Responsive SVG Sparkline Chart */}
          <div className="w-full flex justify-center items-center py-4 bg-slate-50/40 dark:bg-surface-secondary/40 border border-border/10 rounded-sm mt-3">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full max-h-[140px] drop-shadow-sm overflow-visible"
              aria-label="Applications line graph over the past 6 months"
              role="img"
            >
              <line x1={padding} y1={chartHeight - padding} x2={chartWidth - padding} y2={chartHeight - padding} stroke="#cbd5e1" strokeWidth="1.5" />
              <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="#cbd5e1" strokeDasharray="3 3" />
              <path
                d={`M ${padding},${chartHeight - padding} L ${points} L ${chartWidth - padding},${chartHeight - padding} Z`}
                fill="rgba(245, 158, 11, 0.08)"
              />
              <polyline
                fill="none"
                stroke="var(--color-primary, #ff5e00)"
                strokeWidth="3.5"
                points={points}
              />
              {monthlyData.map((d, i) => {
                const x = padding + (i * (chartWidth - padding * 2)) / (monthlyData.length - 1);
                const y = chartHeight - padding - (d.count * (chartHeight - padding * 2)) / maxCount;
                return (
                  <g key={i} className="group cursor-pointer">
                    <title>{`${d.month}: ${d.count} applications`}</title>
                    <circle cx={x} cy={y} r="4.5" fill="#ffffff" stroke="var(--color-primary, #ff5e00)" strokeWidth="2.5" />
                    <circle cx={x} cy={y} r="7" fill="transparent" className="hover:fill-primary/20 transition-colors" />
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-between px-5 text-[8.5px] font-black uppercase text-foreground-muted mt-2 border-t border-border/10 pt-2.5">
            {monthlyData.map((d) => (
              <span key={d.month}>{d.month}</span>
            ))}
          </div>
        </BrutalCard>
      </div>
 
      {/* 3. Advanced Widgets Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        
        {/* Widget 1: Upcoming Interviews */}
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 flex items-center gap-1">
              <Video className="h-4 w-4 text-primary" /> Interview Briefs
            </h3>
            
            {upcomingInterviews.length > 0 ? (
              <div className="space-y-3 mt-3">
                {upcomingInterviews.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => onOpenDetails(app.id)}
                    className="p-2.5 border-2 border-border hover:border-primary bg-slate-50/40 dark:bg-surface-secondary/40 rounded-sm cursor-pointer space-y-1.5 transition-all text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-primary uppercase">{app.company}</span>
                      <Badge className="text-[6.5px] font-black uppercase bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30 border py-0 px-1 rounded-none shadow-none">{app.interviewRound}</Badge>
                    </div>
                    <h4 className="font-black uppercase text-[10.5px] tracking-tight truncate">{app.jobTitle}</h4>
                    
                    <div className="text-[8px] font-bold text-foreground-secondary space-y-1">
                      <div className="flex items-center gap-1.5"><Clock className="h-3 w-3 text-foreground-muted" /> {app.interviewDate} at {app.interviewTime}</div>
                      {app.interviewerName && <div className="flex items-center gap-1.5"><UserCheck className="h-3 w-3 text-foreground-muted" /> Interviewer: {app.interviewerName}</div>}
                    </div>
 
                    {app.meetingLink && (
                      <a 
                        href={app.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="mt-2 text-[7.5px] font-black uppercase text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:text-blue-300 flex items-center gap-0.5 border border-blue-200 bg-blue-50 dark:bg-blue-500/10 px-1 py-0.5 w-max rounded-sm"
                      >
                        Join Call <ExternalLink className="h-2 w-2" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground-muted text-[9px] font-bold uppercase py-6 text-center">No upcoming rounds.</p>
            )}
          </div>
        </BrutalCard>
 
        {/* Widget 2: Offers & Reminders */}
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 flex items-center gap-1">
              <Gift className="h-4 w-4 text-emerald-600" /> Active Offers
            </h3>
 
            {offersReceived.length > 0 ? (
              <div className="space-y-3 mt-3">
                {offersReceived.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => onOpenDetails(app.id)}
                    className="p-2.5 border-2 border-emerald-400 bg-emerald-50/20 hover:bg-emerald-50/40 rounded-sm cursor-pointer space-y-1.5 transition-all text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[8px] font-black text-emerald-700 uppercase">{app.company}</span>
                      {app.offerDeadline && (
                        <Badge className="text-[6px] font-black bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/30 border py-0 px-1 rounded-none shadow-none flex items-center gap-0.5">
                          <AlertCircle className="h-2 w-2" /> Expires: {app.offerDeadline}
                        </Badge>
                      )}
                    </div>
                    <h4 className="font-black uppercase text-[10.5px] tracking-tight truncate text-emerald-950">{app.jobTitle}</h4>
                    <p className="text-[8.5px] font-bold text-emerald-800">{app.salaryNotes}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground-muted text-[9px] font-bold uppercase py-6 text-center">No active offer letters.</p>
            )}
          </div>
 
          {/* Follow-up Reminders */}
          <div className="border-t border-border/10 pt-3">
            <h4 className="text-[9px] font-black uppercase text-foreground flex items-center gap-1 mb-2">
              <BellRing className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" /> Follow-up tasks
            </h4>
            {followUpReminders.length > 0 ? (
              <div className="space-y-2 max-h-[100px] overflow-y-auto pr-1">
                {followUpReminders.map((app) => (
                  <div 
                    key={app.id}
                    onClick={() => onOpenDetails(app.id)}
                    className="p-1.5 border border-border/40 hover:border-primary bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm cursor-pointer flex justify-between items-center text-[8.5px] font-bold uppercase"
                  >
                    <span className="truncate max-w-[120px]">{app.company} ({app.jobTitle})</span>
                    <Badge className="text-[6.5px] font-black bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-none px-1 rounded-none">Active</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-foreground-muted text-[7.5px] font-bold uppercase py-2">No follow-ups needed.</p>
            )}
          </div>
        </BrutalCard>
 
        {/* Widget 3: Recent Activity & Weekly Sparkline */}
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex flex-col justify-between space-y-3">
          <div>
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2 flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-purple-600" /> Weekly Activity
            </h3>
 
            {/* Sparkline column graph */}
            <div className="flex justify-between items-end h-[60px] px-2 mt-4 bg-slate-50/30 dark:bg-surface-secondary/30 border border-border/10 rounded-sm py-2">
              {weeklyActivity.map((count, idx) => {
                const heightPercent = Math.max(8, (count / maxWeeklyCount) * 100);
                return (
                  <div key={idx} className="flex flex-col items-center flex-1 space-y-1">
                    <div 
                      className="w-3 bg-primary border border-border hover:bg-primary-dark transition-colors rounded-t-xs"
                      style={{ height: `${heightPercent}%` }}
                      title={`${weekdayNames[idx]}: ${count} applications`}
                    />
                    <span className="text-[6px] font-black text-foreground-muted">{weekdayNames[idx]}</span>
                  </div>
                );
              })}
            </div>
          </div>
 
          {/* Recent Applications checklist */}
          <div className="border-t border-border/10 pt-3">
            <h4 className="text-[9px] font-black uppercase text-foreground flex items-center gap-1 mb-2">
              <FileText className="h-3.5 w-3.5 text-foreground-secondary" /> Recent Applications
            </h4>
            
            <div className="space-y-2">
              {recentApplications.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => onOpenDetails(app.id)}
                  className="flex justify-between items-center text-[8px] font-black uppercase hover:text-primary cursor-pointer border-b border-border/5 pb-1"
                >
                  <div className="truncate max-w-[140px]">
                    <span className="text-primary font-black">{app.company}</span> - {app.jobTitle}
                  </div>
                  <span className="text-foreground-muted text-[6.5px] shrink-0">{app.appliedAt.split("T")[0]}</span>
                </div>
              ))}
            </div>
          </div>
        </BrutalCard>
        
      </div>
    </div>
  );
}
