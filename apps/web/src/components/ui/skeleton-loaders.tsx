"use client";
 
import * as React from "react";
import { Skeleton } from "./skeleton";
import { BrutalCard } from "./brutal-card";
 
// ==========================================
// 1. DASHBOARD SKELETONS
// ==========================================
 
export function StatsCardSkeleton() {
  return (
    <BrutalCard className="flex flex-col gap-2 justify-between min-h-[106px] border-[3px] border-border bg-surface rounded-sm p-4 brutal-shadow-xs">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-3 w-[60%]" />
          <Skeleton className="h-6.5 w-[35%]" />
        </div>
        <Skeleton className="h-8 w-8 rounded-md shrink-0" />
      </div>
      <Skeleton className="h-5 w-24 rounded-sm mt-2" />
    </BrutalCard>
  );
}
 
export function ResumeProgressCardSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 flex flex-col justify-between space-y-6 brutal-shadow w-full min-h-[220px] rounded-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4.5 w-[40%]" />
            <Skeleton className="h-3 w-[70%]" />
          </div>
          <Skeleton className="h-6 w-16 rounded-none shrink-0" />
        </div>
        <Skeleton className="h-4 w-full rounded-sm" />
        <div className="grid grid-cols-2 gap-4 border-t-2 border-border/10 pt-4">
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-16" />
            <Skeleton className="h-5 w-20" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-2.5 w-12" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>
      <Skeleton className="h-11 w-full rounded-md mt-2" />
    </BrutalCard>
  );
}
 
export function ProfileCompletionCardSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 flex flex-col justify-between space-y-6 brutal-shadow w-full min-h-[220px] rounded-sm">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4.5 w-[40%]" />
            <Skeleton className="h-3 w-[70%]" />
          </div>
          <Skeleton className="h-6 w-16 rounded-none shrink-0" />
        </div>
        <Skeleton className="h-4 w-full rounded-sm" />
        <div className="space-y-2 pt-4 border-t-2 border-border/10">
          <Skeleton className="h-3 w-[75%]" />
          <Skeleton className="h-3 w-[60%]" />
        </div>
      </div>
      <Skeleton className="h-11 w-full rounded-md mt-2" />
    </BrutalCard>
  );
}
 
export function RecommendedJobCardSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 brutal-shadow rounded-sm min-h-[92px]">
      <div className="flex items-start gap-4 min-w-0 w-full">
        <Skeleton className="h-12 w-12 border-2 border-border rounded-sm shrink-0" />
        <div className="space-y-2 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4.5 w-[40%]" />
            <Skeleton className="h-5 w-16" />
          </div>
          <Skeleton className="h-3 w-[60%]" />
        </div>
      </div>
      <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 pt-2 sm:pt-0">
        <Skeleton className="h-10 w-28" />
        <Skeleton className="h-10 w-10 shrink-0" />
      </div>
    </BrutalCard>
  );
}
 
export function AIInsightCardSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-5 flex gap-4 brutal-shadow rounded-sm min-h-[92px]">
      <Skeleton className="h-10 w-10 border-2 border-border rounded-sm shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4 w-[50%]" />
        <Skeleton className="h-3 w-[90%]" />
      </div>
    </BrutalCard>
  );
}
 
export function RecentApplicationTableSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-0 brutal-shadow overflow-hidden rounded-sm">
      <div className="p-4 bg-surface-secondary border-b-[3px] border-border">
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="p-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex justify-between items-center border-b border-border/10 pb-3 last:border-0 last:pb-0">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-[30%]" />
              <Skeleton className="h-3 w-[20%]" />
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
 
export function ActivityTimelineSkeleton() {
  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow rounded-sm space-y-6">
      <div className="relative border-l-[3px] border-border pl-6 space-y-6 pb-2 ml-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="relative pl-6">
            <span className="absolute -left-[35px] top-0.5 h-7 w-7 rounded-full border-2 border-border bg-surface flex items-center justify-center shrink-0">
              <Skeleton className="h-4 w-4 rounded-full" />
            </span>
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-[55%]" />
              <Skeleton className="h-2.5 w-[20%]" />
            </div>
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
 
export function RecentlyViewedJobsCardSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-5 brutal-shadow rounded-sm space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="divide-y divide-border/10 space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="pt-2 flex items-center justify-between gap-4">
            <div className="space-y-1.5 flex-1 min-w-0">
              <Skeleton className="h-3.5 w-[65%]" />
              <Skeleton className="h-2.5 w-[45%]" />
            </div>
            <Skeleton className="h-5 w-12 shrink-0" />
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
 
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 text-left select-none w-full">
      {/* 1. Analytics Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 w-full min-w-0">
        {[...Array(4)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>
 
      {/* 2. Progress Cards */}
      <div className="grid gap-6 md:grid-cols-2 w-full min-w-0">
        <ResumeProgressCardSkeleton />
        <ProfileCompletionCardSkeleton />
      </div>
 
      {/* 3. Quick Actions row */}
      <BrutalCard className="border-[3px] border-border bg-surface p-4 brutal-shadow rounded-sm">
        <div className="flex flex-wrap gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-9 w-28 rounded-md" />
          ))}
        </div>
      </BrutalCard>
 
      {/* 4. Bottom grid split */}
      <div className="grid gap-6 lg:grid-cols-2 w-full min-w-0">
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <RecommendedJobCardSkeleton />
            <RecommendedJobCardSkeleton />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <div className="grid gap-4 sm:grid-cols-2">
              <AIInsightCardSkeleton />
              <AIInsightCardSkeleton />
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <RecentApplicationTableSkeleton />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-6 w-48" />
            <ActivityTimelineSkeleton />
          </div>
          <RecentlyViewedJobsCardSkeleton />
        </div>
      </div>
    </div>
  );
}
 
// ==========================================
// 2. JOBS SKELETONS
// ==========================================
 
export function JobCardSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface rounded-sm p-3 relative flex flex-col justify-between gap-2.5 min-h-[175px]">
      <div>
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-3.5 w-[70%]" />
            <Skeleton className="h-2.5 w-[40%]" />
          </div>
          <Skeleton className="h-7 w-7 rounded-sm shrink-0" />
        </div>
        <div className="flex flex-wrap gap-1 mt-2.5">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-14" />
        </div>
        <div className="space-y-1.5 mt-3">
          <Skeleton className="h-2 w-full border-none" />
          <Skeleton className="h-2 w-[85%] border-none" />
        </div>
        <div className="flex flex-wrap gap-1 mt-3">
          <Skeleton className="h-4.5 w-10" />
          <Skeleton className="h-4.5 w-12" />
          <Skeleton className="h-4.5 w-9" />
        </div>
      </div>
      <div className="border-t border-border/10 pt-2.5 mt-2 flex items-center justify-between">
        <Skeleton className="h-3.5 w-24" />
        <Skeleton className="h-3.5 w-16" />
      </div>
    </BrutalCard>
  );
}
 
export function JobsFilterSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm space-y-5">
      <Skeleton className="h-5 w-24" />
      {[...Array(4)].map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3.5 w-16" />
          <Skeleton className="h-9 w-full" />
        </div>
      ))}
      <div className="space-y-2 pt-2">
        <Skeleton className="h-3.5 w-24" />
        <div className="space-y-1.5">
          <Skeleton className="h-4.5 w-full" />
          <Skeleton className="h-4.5 w-[80%]" />
        </div>
      </div>
    </BrutalCard>
  );
}
 
export function JobDetailsSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-6 rounded-sm space-y-6 text-left">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b border-border/10">
        <div className="space-y-2 flex-1">
          <Skeleton className="h-6 w-[60%]" />
          <Skeleton className="h-4.5 w-[30%]" />
          <div className="flex gap-2.5 pt-1.5">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-full border-none" />
            <Skeleton className="h-3 w-full border-none" />
            <Skeleton className="h-3 w-[70%] border-none" />
          </div>
          <Skeleton className="h-5 w-28" />
          <div className="space-y-2">
            <Skeleton className="h-3 w-[90%] border-none" />
            <Skeleton className="h-3 w-[85%] border-none" />
          </div>
        </div>
        <div className="space-y-4">
          <BrutalCard className="p-4 border-2 border-border space-y-3">
            <Skeleton className="h-4.5 w-24" />
            <div className="space-y-2 pt-1">
              <Skeleton className="h-3 w-[80%]" />
              <Skeleton className="h-3 w-[60%]" />
            </div>
          </BrutalCard>
        </div>
      </div>
    </BrutalCard>
  );
}
 
export function JobsSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <JobCardSkeleton key={i} />
      ))}
    </div>
  );
}
 
// ==========================================
// 3. COMPANIES SKELETONS
// ==========================================
 
export function CompanyCardSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[140px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <Skeleton className="h-10 w-10 rounded-sm" />
          <Skeleton className="h-5 w-12" />
        </div>
        <Skeleton className="h-4.5 w-[60%]" />
        <Skeleton className="h-3 w-[85%] border-none" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-border/10">
        <Skeleton className="h-3 w-[40%]" />
        <Skeleton className="h-6 w-14" />
      </div>
    </BrutalCard>
  );
}
 
export function CompanyDetailsSkeleton() {
  return (
    <div className="space-y-6 text-left">
      <BrutalCard className="border-[3px] border-border bg-surface p-6 rounded-sm space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-14 w-14 border-2 border-border" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-3.5 w-32" />
          </div>
        </div>
      </BrutalCard>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <BrutalCard className="border-[3px] border-border p-5 space-y-3">
            <Skeleton className="h-5 w-24" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-full border-none" />
              <Skeleton className="h-3 w-[90%] border-none" />
            </div>
          </BrutalCard>
        </div>
        <div className="space-y-4">
          <BrutalCard className="border-[3px] border-border p-4 space-y-3">
            <Skeleton className="h-4.5 w-28" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-[70%]" />
              <Skeleton className="h-3 w-[50%]" />
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
 
export function CompaniesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left select-none">
      {[...Array(6)].map((_, i) => (
        <CompanyCardSkeleton key={i} />
      ))}
    </div>
  );
}
 
// ==========================================
// 4. APPLICATIONS SKELETONS
// ==========================================
 
export function ApplicationCardSkeleton() {
  return (
    <BrutalCard className="border-2 border-border p-3.5 bg-surface rounded-sm space-y-2.5 brutal-shadow-xs min-h-[108px]">
      <div className="space-y-1">
        <Skeleton className="h-3.5 w-[75%]" />
        <Skeleton className="h-2.5 w-[45%]" />
      </div>
      <div className="flex gap-1.5">
        <Skeleton className="h-4.5 w-12" />
        <Skeleton className="h-4.5 w-14" />
      </div>
      <div className="flex justify-between items-center pt-2 border-t border-border/10">
        <Skeleton className="h-3 w-10" />
        <Skeleton className="h-4 w-12" />
      </div>
    </BrutalCard>
  );
}
 
export function ApplicationTimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-5 w-5 rounded-full shrink-0 mt-0.5" />
          <div className="space-y-1.5 flex-1">
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-2.5 w-[30%]" />
          </div>
        </div>
      ))}
    </div>
  );
}
 
export function CalendarSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow">
      <div className="grid grid-cols-7 gap-2">
        {[...Array(35)].map((_, i) => (
          <div key={i} className="aspect-square border border-border/20 p-1 flex flex-col justify-between">
            <Skeleton className="h-3 w-3" />
            <Skeleton className="h-2 w-[70%] border-none" />
          </div>
        ))}
      </div>
    </BrutalCard>
  );
}
 
export function ApplicationsSkeleton() {
  return (
    <div className="space-y-6 text-left select-none w-full">
      <div className="grid gap-4 md:grid-cols-4">
        {["Applied", "Interview", "Offer", "Archived"].map((col, idx) => (
          <div key={idx} className="space-y-3 bg-surface p-3.5 border-[3px] border-border rounded-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <Skeleton className="h-4.5 w-16" />
              <Skeleton className="h-4.5 w-6" />
            </div>
            {[...Array(2)].map((_, i) => (
              <ApplicationCardSkeleton key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
 
// ==========================================
// 5. RESUME SKELETONS
// ==========================================
 
export function ResumeCardSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[160px] space-y-4">
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-[30%]" />
          <Skeleton className="h-4 w-16" />
        </div>
        <Skeleton className="h-4.5 w-[75%]" />
        <Skeleton className="h-3 w-[50%]" />
      </div>
      <div className="flex justify-between items-center pt-3 border-t border-border/10">
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-6" />
          <Skeleton className="h-6 w-6" />
        </div>
      </div>
    </BrutalCard>
  );
}
 
export function ResumeBuilderSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start text-left">
      <div className="lg:col-span-3">
        <BrutalCard className="border-[3px] border-border bg-surface p-2.5 rounded-sm space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </BrutalCard>
      </div>
      <div className="lg:col-span-9">
        <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm space-y-5">
          <Skeleton className="h-5 w-48" />
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
        </BrutalCard>
      </div>
    </div>
  );
}
 
export function ResumePreviewSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-8 max-w-[800px] mx-auto min-h-[700px] space-y-6">
      <div className="space-y-2 text-center border-b border-border/20 pb-4">
        <Skeleton className="h-6 w-48 mx-auto" />
        <Skeleton className="h-3.5 w-64 mx-auto" />
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4.5 w-24" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full border-none" />
          <Skeleton className="h-3.5 w-[90%] border-none" />
        </div>
      </div>
      <div className="space-y-3">
        <Skeleton className="h-4.5 w-24" />
        <div className="space-y-1.5">
          <Skeleton className="h-3.5 w-full border-none" />
          <Skeleton className="h-3.5 w-[95%] border-none" />
        </div>
      </div>
    </BrutalCard>
  );
}
 
export function ResumeSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left select-none">
      {[...Array(3)].map((_, i) => (
        <ResumeCardSkeleton key={i} />
      ))}
    </div>
  );
}
 
// ==========================================
// 6. RESUME OPTIMIZER SKELETON
// ==========================================
 
export function ResumeOptimizerSkeleton() {
  return (
    <div className="space-y-6 text-left select-none">
      <div className="grid gap-6 md:grid-cols-3">
        <BrutalCard className="md:col-span-1 border-[3px] border-border bg-surface p-5 rounded-sm space-y-4 brutal-shadow">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-28 w-28 rounded-full mx-auto" />
          <Skeleton className="h-4.5 w-40 mx-auto" />
        </BrutalCard>
        <div className="md:col-span-2 space-y-4">
          <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm space-y-4 brutal-shadow">
            <Skeleton className="h-5 w-48" />
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b border-border/10 pb-2">
                  <Skeleton className="h-4 w-[65%]" />
                  <Skeleton className="h-5 w-14" />
                </div>
              ))}
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
 
// ==========================================
// 7. COVER LETTERS SKELETONS
// ==========================================
 
export function CoverLetterDashboardSkeleton() {
  return (
    <div className="space-y-6 text-left select-none">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-2.5 w-[50%]" />
              <Skeleton className="h-5 w-[80%]" />
            </div>
          </BrutalCard>
        ))}
      </div>
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b-2 border-border pb-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-8.5 w-24" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[160px]">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-[30%]" />
                  <Skeleton className="h-4.5 w-[80%]" />
                  <Skeleton className="h-3 w-[60%]" />
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-border/10">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="h-5 w-12" />
                </div>
              </BrutalCard>
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-5 w-32" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <BrutalCard key={i} className="p-3 border-2 border-border space-y-2">
                <Skeleton className="h-3.5 w-[75%]" />
                <Skeleton className="h-2.5 w-[50%]" />
              </BrutalCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
export function CoverLetterEditorSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm space-y-4 text-left">
      <div className="flex gap-2">
        <Skeleton className="h-9 w-20" />
        <Skeleton className="h-9 w-20" />
      </div>
      <Skeleton className="h-72 w-full rounded-md" />
    </BrutalCard>
  );
}
 
export function CoverLetterPreviewSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-6 rounded-sm min-h-[400px] space-y-4 text-left">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-[25%]" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-3 w-full border-none" />
        <Skeleton className="h-3 w-full border-none" />
        <Skeleton className="h-3 w-[80%] border-none" />
      </div>
    </BrutalCard>
  );
}
 
// ==========================================
// 8. SETTINGS SKELETON
// ==========================================
 
export function SettingsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-4 items-start text-left select-none">
      <div className="lg:col-span-1">
        <BrutalCard className="border-[3px] border-border bg-surface p-2.5 rounded-sm space-y-2">
          {[...Array(8)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </BrutalCard>
      </div>
      <div className="lg:col-span-3">
        <BrutalCard className="border-[3px] border-border bg-surface p-5 rounded-sm space-y-6">
          <div className="flex items-center gap-2 border-b-2 border-border/10 pb-2">
            <Skeleton className="h-6 w-48" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-9.5 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-10 w-24 ml-auto" />
        </BrutalCard>
      </div>
    </div>
  );
}
 
// ==========================================
// 9. NOTIFICATIONS SKELETON
// ==========================================
 
export function NotificationSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm flex items-center gap-3 text-left">
      <Skeleton className="h-9 w-9 rounded-full shrink-0" />
      <div className="flex-1 space-y-1.5">
        <Skeleton className="h-3.5 w-[50%]" />
        <Skeleton className="h-2.5 w-[75%] border-none" />
      </div>
      <Skeleton className="h-3 w-10 shrink-0" />
    </BrutalCard>
  );
}
 
export function NotificationsSkeleton() {
  return (
    <div className="space-y-4 text-left select-none">
      <div className="flex flex-wrap gap-2">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-8 w-24 rounded-sm" />
        ))}
      </div>
      <div className="space-y-3">
        {[...Array(4)].map((_, i) => (
          <NotificationSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
 
// ==========================================
// 10. SAVED JOBS SKELETON
// ==========================================
 
export function SavedJobSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm flex justify-between items-center text-left">
      <div className="space-y-2 flex-1">
        <Skeleton className="h-4.5 w-[35%]" />
        <Skeleton className="h-3 w-[20%]" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-8 rounded-sm" />
      </div>
    </BrutalCard>
  );
}
 
// ==========================================
// 11. JOB ALERTS SKELETON
// ==========================================
 
export function JobAlertSkeleton() {
  return (
    <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[140px] space-y-4 text-left">
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1.5 flex-1">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-3 w-[30%]" />
        </div>
        <Skeleton className="h-5 w-9 rounded-full shrink-0" />
      </div>
      <div className="flex flex-wrap gap-1">
        <Skeleton className="h-4.5 w-14" />
        <Skeleton className="h-4.5 w-12" />
      </div>
      <div className="flex justify-between items-center pt-2.5 border-t border-border/10">
        <Skeleton className="h-3 w-[45%]" />
        <Skeleton className="h-6 w-14" />
      </div>
    </BrutalCard>
  );
}
 
// ==========================================
// 12. PROFILE SKELETON
// ==========================================
export function ProfileSkeleton() {
  return (
    <div className="space-y-6 w-full min-w-0 pb-16 max-w-6xl mx-auto text-left">
      {/* 1. Header Card Skeleton */}
      <BrutalCard className="border-[3px] border-border bg-surface p-6 brutal-shadow rounded-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex gap-4 items-center w-full">
          <Skeleton className="h-16 w-16 border-[3px] border-border rounded-sm shrink-0" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-24 shrink-0" />
      </BrutalCard>
 
      {/* 2. Two-Column Dashboard Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
        {/* Left Column (lg:col-span-2) */}
        <div className="lg:col-span-2 space-y-6 w-full">
          {[...Array(4)].map((_, i) => (
            <BrutalCard key={i} className="border-[3px] border-border p-5 rounded-sm space-y-3">
              <Skeleton className="h-4.5 w-32 border-b border-border/10 pb-2" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full border-none" />
                <Skeleton className="h-3 w-[90%] border-none" />
                <Skeleton className="h-3 w-[75%] border-none" />
              </div>
            </BrutalCard>
          ))}
        </div>
 
        {/* Right Column (lg:col-span-1) */}
        <div className="lg:col-span-1 space-y-6 w-full">
          <BrutalCard className="border-[3px] border-border p-5 rounded-sm space-y-4">
            <Skeleton className="h-4.5 w-24" />
            <Skeleton className="h-4 w-full" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-[70%]" />
              <Skeleton className="h-3 w-[50%]" />
            </div>
          </BrutalCard>
          {[...Array(3)].map((_, i) => (
            <BrutalCard key={i} className="border-[3px] border-border p-4 rounded-sm space-y-3">
              <Skeleton className="h-4 w-28" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full border-none" />
                <Skeleton className="h-3 w-[60%] border-none" />
              </div>
            </BrutalCard>
          ))}
        </div>
      </div>
    </div>
  );
}
