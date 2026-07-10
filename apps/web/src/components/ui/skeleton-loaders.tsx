"use client";
 
import * as React from "react";
import { Skeleton } from "./skeleton";
import { BrutalCard } from "./brutal-card";
 
// 1. Dashboard skeleton
export function DashboardSkeleton() {
  return (
    <div className="space-y-6 text-left select-none max-w-[1200px] mx-auto w-full">
      {/* Stats row skeletons */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex items-center gap-3">
            <Skeleton className="h-10 w-10 shrink-0" />
            <div className="space-y-1.5 flex-1">
              <Skeleton className="h-2.5 w-[60%]" />
              <Skeleton className="h-5 w-[80%]" />
            </div>
          </BrutalCard>
        ))}
      </div>
 
      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Feed skeleton */}
        <div className="md:col-span-2 space-y-4">
          <Skeleton className="h-6 w-48" />
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3.5 w-[40%]" />
                    <Skeleton className="h-3 w-[25%]" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
                <Skeleton className="h-2 w-[90%] border-none" />
                <Skeleton className="h-2 w-[70%] border-none" />
              </BrutalCard>
            ))}
          </div>
        </div>
 
        {/* Sidebar widgets skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <BrutalCard key={i} className="border-2 border-border p-3.5 bg-surface rounded-sm space-y-2">
                <Skeleton className="h-3 w-[60%]" />
                <Skeleton className="h-2 w-[85%] border-none" />
                <Skeleton className="h-2.5 w-16" />
              </BrutalCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
 
// 2. Jobs skeleton
export function JobsSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-4 text-left select-none">
      {/* Filters sidebar skeleton */}
      <div className="md:col-span-1">
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm space-y-5">
          <Skeleton className="h-5 w-24" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-9 w-full" />
            </div>
          ))}
        </BrutalCard>
      </div>
 
      {/* Job list grid skeleton */}
      <div className="md:col-span-3 space-y-4">
        {[...Array(3)].map((_, i) => (
          <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm space-y-3">
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4.5 w-[35%]" />
                <Skeleton className="h-3 w-[20%]" />
                <div className="flex gap-2.5 pt-1">
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-5 w-16" />
                </div>
              </div>
              <Skeleton className="h-8.5 w-24" />
            </div>
          </BrutalCard>
        ))}
      </div>
    </div>
  );
}
 
// 3. Companies skeleton
export function CompaniesSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left select-none">
      {[...Array(6)].map((_, i) => (
        <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[140px] space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <Skeleton className="h-10 w-10" />
              <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-[60%]" />
            <Skeleton className="h-3 w-[85%] border-none" />
          </div>
          <div className="flex justify-between items-center pt-2 border-t border-border/10">
            <Skeleton className="h-3 w-[40%]" />
            <Skeleton className="h-6 w-14" />
          </div>
        </BrutalCard>
      ))}
    </div>
  );
}
 
// 4. Applications skeleton
export function ApplicationsSkeleton() {
  return (
    <div className="space-y-6 text-left select-none max-w-[1200px] mx-auto w-full">
      {/* Board Columns list skeleton */}
      <div className="grid gap-4 md:grid-cols-4">
        {["Applied", "Interview", "Offer", "Archived"].map((col, idx) => (
          <div key={idx} className="space-y-3 bg-surface p-3.5 border-[3px] border-border rounded-sm">
            <div className="flex justify-between items-center pb-2 border-b border-border/10">
              <Skeleton className="h-4.5 w-16" />
              <Skeleton className="h-4.5 w-6" />
            </div>
            {[...Array(2)].map((_, i) => (
              <BrutalCard key={i} className="border-2 border-border p-3 bg-surface space-y-2 brutal-shadow-xs">
                <Skeleton className="h-3.5 w-[75%]" />
                <Skeleton className="h-2.5 w-[45%]" />
                <div className="flex justify-between items-center pt-2">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-4 w-12" />
                </div>
              </BrutalCard>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
 
// 5. Resumes skeleton
export function ResumeSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 text-left select-none">
      {[...Array(3)].map((_, i) => (
        <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex flex-col justify-between min-h-[160px] space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-3.5 w-[30%]" />
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
      ))}
    </div>
  );
}
 
// 6. Settings skeleton
export function SettingsSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-4 items-start text-left select-none">
      <div className="lg:col-span-1">
        <BrutalCard className="border-[3px] border-border bg-surface p-2.5 rounded-sm space-y-2">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-full" />
          ))}
        </BrutalCard>
      </div>
      <div className="lg:col-span-3">
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm space-y-5">
          <Skeleton className="h-5 w-48" />
          <div className="grid gap-4 sm:grid-cols-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-1.5">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-9 w-full" />
              </div>
            ))}
          </div>
          <Skeleton className="h-24 w-full" />
        </BrutalCard>
      </div>
    </div>
  );
}
 
// 7. Notifications skeleton
export function NotificationsSkeleton() {
  return (
    <div className="space-y-3.5 text-left select-none">
      {[...Array(4)].map((_, i) => (
        <BrutalCard key={i} className="border-[3px] border-border bg-surface p-4 rounded-sm flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full shrink-0" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-3 w-[70%]" />
            <Skeleton className="h-2.5 w-[50%] border-none" />
          </div>
          <Skeleton className="h-3 w-10" />
        </BrutalCard>
      ))}
    </div>
  );
}
