"use client";
 
import React from "react";
import type { JobApplication } from "../types/application.types";
import type { ApplicationStatus } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  ChevronRight,
  ChevronLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
 
interface KanbanBoardProps {
  applications: JobApplication[];
  onOpenDetails: (id: string) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onAddApplication: (status: ApplicationStatus) => void;
}
 
interface ColumnConfig {
  label: string;
  status: ApplicationStatus;
  colorClass: string;
}
 
const COLUMNS: ColumnConfig[] = [
  { label: "Saved", status: "SAVED", colorClass: "border-slate-400 dark:border-border-secondary bg-slate-50 dark:bg-surface-secondary" },
  { label: "Applied", status: "APPLIED", colorClass: "border-blue-400 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10/20" },
  { label: "Screening", status: "SCREENING", colorClass: "border-indigo-400 bg-indigo-50/20" },
  { label: "Assessment", status: "ASSESSMENT", colorClass: "border-purple-400 bg-purple-50/20" },
  { label: "Interview", status: "INTERVIEW", colorClass: "border-amber-400 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10/20" },
  { label: "Offer", status: "OFFER", colorClass: "border-emerald-400 bg-emerald-50/20" },
  { label: "Accepted", status: "ACCEPTED", colorClass: "border-green-500 bg-green-50 dark:bg-green-500/10/30" },
  { label: "Rejected", status: "REJECTED", colorClass: "border-rose-400 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10/20" }
];
 
export function KanbanBoard({ 
  applications, 
  onOpenDetails, 
  onUpdateStatus, 
  onAddApplication 
}: KanbanBoardProps) {
  const [draggedAppId, setDraggedAppId] = React.useState<string | null>(null);
  const [activeColumnHover, setActiveColumnHover] = React.useState<string | null>(null);
 
  // Drag handlers
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData("text/plain", id);
    setDraggedAppId(id);
  };
 
  const handleDragOver = (e: React.DragEvent, columnStatus: string) => {
    e.preventDefault();
    setActiveColumnHover(columnStatus);
  };
 
  const handleDragLeave = () => {
    setActiveColumnHover(null);
  };
 
  const handleDrop = (e: React.DragEvent, columnStatus: ApplicationStatus) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain") || draggedAppId;
    if (id) {
      onUpdateStatus(id, columnStatus);
    }
    setDraggedAppId(null);
    setActiveColumnHover(null);
  };
 
  // Accessibility stage-shift helpers
  const handleMoveStage = (id: string, currentStatus: ApplicationStatus, direction: "next" | "prev") => {
    const idx = COLUMNS.findIndex((c) => c.status === currentStatus);
    if (idx === -1) return;
    
    let targetIdx = idx;
    if (direction === "next" && idx < COLUMNS.length - 1) targetIdx = idx + 1;
    if (direction === "prev" && idx > 0) targetIdx = idx - 1;
    
    if (targetIdx !== idx) {
      onUpdateStatus(id, COLUMNS[targetIdx].status);
    }
  };
 
  return (
    <div className="flex gap-4 overflow-x-auto pb-6 -mx-4 px-4 scrollbar-thin select-none">
      {COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.status);
        const isHovered = activeColumnHover === col.status;
 
        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={cn(
              "w-[260px] md:w-[280px] shrink-0 flex flex-col max-h-[75vh] border-[3px] border-border brutal-shadow-xs bg-surface transition-all rounded-sm",
              isHovered && "scale-[1.01] brutal-shadow border-primary bg-slate-50/50 dark:bg-surface-secondary/50"
            )}
          >
            {/* Column Header */}
            <div className={cn("p-3 border-b-[3px] border-border flex justify-between items-center", col.colorClass)}>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase text-foreground-secondary">{col.label}</span>
                <Badge className="text-[8px] font-black bg-surface text-foreground border border-border/40 px-1 py-0 shadow-none rounded-none">
                  {columnApps.length}
                </Badge>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onAddApplication(col.status)}
                className="h-6 w-6 border border-border/25 bg-surface text-foreground-secondary hover:text-primary rounded-sm flex items-center justify-center"
                aria-label={`Add application in ${col.label} stage`}
              >
                <Plus className="h-3.5 w-3.5 stroke-[2.5px]" />
              </Button>
            </div>
 
            {/* Column Body Cards list */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-3 min-h-[150px]">
              {columnApps.length > 0 ? (
                columnApps.map((app) => (
                  <div
                    key={app.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, app.id)}
                    onClick={() => onOpenDetails(app.id)}
                    className="p-3 border-2 border-border brutal-shadow-xs hover:brutal-shadow bg-surface hover:-translate-y-0.5 transition-all cursor-grab active:cursor-grabbing rounded-sm relative text-left space-y-2 group"
                  >
                    {/* Header info */}
                    <div>
                      <div className="flex justify-between items-start gap-1">
                        <span className="text-[7.5px] font-black text-primary uppercase tracking-wider truncate max-w-[120px]">{app.company}</span>
                        
                        {/* Accessibility Stage Shifter Arrows */}
                        <div className="hidden group-hover:flex items-center gap-0.5 bg-surface border border-border/40 p-0.5 rounded-sm shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(app.id, app.status, "prev");
                            }}
                            className="p-0.5 hover:bg-slate-100 dark:hover:bg-surface-hover rounded-sm text-foreground-muted hover:text-primary"
                            title="Move column left"
                            aria-label={`Move ${app.jobTitle} application left`}
                          >
                            <ChevronLeft className="h-2.5 w-2.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMoveStage(app.id, app.status, "next");
                            }}
                            className="p-0.5 hover:bg-slate-100 dark:hover:bg-surface-hover rounded-sm text-foreground-muted hover:text-primary"
                            title="Move column right"
                            aria-label={`Move ${app.jobTitle} application right`}
                          >
                            <ChevronRight className="h-2.5 w-2.5" />
                          </button>
                        </div>
                      </div>
                      <h4 className="text-[11px] font-black uppercase text-foreground leading-tight tracking-tight truncate mt-0.5">
                        {app.jobTitle}
                      </h4>
                    </div>
 
                    {/* Match Score & Quality */}
                    <div className="flex items-center gap-1">
                      <Badge className="text-[6.5px] font-extrabold bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border border-green-200 px-1 py-0 shadow-none rounded-none shrink-0">
                        {app.matchScore}% Match
                      </Badge>
                      <Badge className="text-[6.5px] font-extrabold bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-200 px-1 py-0 shadow-none rounded-none shrink-0">
                        {app.jobQuality}% Quality
                      </Badge>
                    </div>
 
                    {/* Footnote details */}
                    <div className="flex items-center justify-between text-[7px] font-black uppercase tracking-wider text-foreground-muted border-t border-border/10 pt-2">
                      <span>Source: {app.source}</span>
                      <span>{app.appliedAt.split("T")[0]}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex flex-col justify-center items-center py-8 text-center text-foreground-muted border-2 border-dashed border-border/20 rounded-sm p-4 text-[9px] font-bold uppercase">
                  Empty Stage
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
