"use client";
 
import React from "react";
import type { CoverLetterDraft, CoverLetterTemplate } from "../types/cover-letter.types";
import { useCoverLetterStore } from "../store/cover-letter.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { 
  FileText, 
  Plus, 
  Trash2, 
  Copy, 
  Sparkles, 
  TrendingUp, 
  Clock, 
  Heart
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoverLetterDashboardSkeleton } from "@/components/ui/skeleton-loaders";
 
interface CoverLetterDashboardProps {
  onStartNew: (template?: CoverLetterTemplate) => void;
}
 
export function CoverLetterDashboard({ onStartNew }: CoverLetterDashboardProps) {
  const { 
    drafts, 
    loadDrafts, 
    setActiveDraft, 
    setActiveView, 
    deleteDraft, 
    duplicateDraft, 
    saveDraft 
  } = useCoverLetterStore();
 
  const [localLoading, setLocalLoading] = React.useState(true);
 
  React.useEffect(() => {
    loadDrafts();
    const timer = setTimeout(() => setLocalLoading(false), 500);
    return () => clearTimeout(timer);
  }, [loadDrafts]);
 
  const generatedToday = React.useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return drafts.filter((d) => d.createdAt.startsWith(todayStr)).length;
  }, [drafts]);
 
  const favCount = React.useMemo(() => {
    return drafts.filter((d) => d.isFavorite).length;
  }, [drafts]);
 
  const handleSelectDraft = (draft: CoverLetterDraft) => {
    setActiveDraft(draft);
    setActiveView("wizard");
  };
 
  const toggleFavorite = (e: React.MouseEvent, draft: CoverLetterDraft) => {
    e.stopPropagation();
    setActiveDraft(draft);
    saveDraft({ isFavorite: !draft.isFavorite });
    loadDrafts(); // reload
  };
 
  const handleDelete = (e: React.MouseEvent, id: string, title: string) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;
    deleteDraft(id);
    loadDrafts();
  };
 
  const handleDuplicate = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    duplicateDraft(id);
    loadDrafts();
  };
 
  // Preset list details
  const templatesDetails = [
    { id: "professional" as CoverLetterTemplate, name: "Standard Professional", desc: "Corporate roles, finance, traditional systems.", color: "bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400" },
    { id: "startup" as CoverLetterTemplate, name: "Startup Tech", desc: "Early stage tech, product growth hackers.", color: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400" },
    { id: "enterprise" as CoverLetterTemplate, name: "Enterprise Systems", desc: "High-compliance, large orchestration setups.", color: "bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-400" },
    { id: "modern" as CoverLetterTemplate, name: "Streamlined Modern", desc: "Design-centric roles, product managers.", color: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400" },
    { id: "minimal" as CoverLetterTemplate, name: "Letter Minimal", desc: "Direct, clean cover layouts.", color: "bg-slate-100 dark:bg-surface-hover text-slate-700 dark:text-foreground-secondary" }
  ];
 
  if (localLoading) {
    return <CoverLetterDashboardSkeleton />;
  }
 
  return (
    <div className="space-y-6 text-left select-none">
      
      {/* 1. Metrics counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center rounded-sm text-blue-700 dark:text-blue-400 shrink-0">
            <FileText className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Saved Drafts</span>
            <span className="text-lg font-black text-foreground">{drafts.length} Documents</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-amber-100 dark:bg-amber-500/20 flex items-center justify-center rounded-sm text-amber-700 dark:text-amber-400 shrink-0">
            <Sparkles className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Generated Today</span>
            <span className="text-lg font-black text-foreground">{generatedToday} Generated</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-red-100 flex items-center justify-center rounded-sm text-red-700 shrink-0">
            <Heart className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Favorites</span>
            <span className="text-lg font-black text-foreground">{favCount} Templates</span>
          </div>
        </BrutalCard>
 
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex items-center gap-3">
          <div className="h-10 w-10 border-2 border-border bg-green-100 dark:bg-green-500/20 flex items-center justify-center rounded-sm text-green-700 dark:text-green-400 shrink-0">
            <TrendingUp className="h-5 w-5 stroke-[2.5px]" />
          </div>
          <div>
            <span className="text-[8px] font-black text-foreground-muted uppercase block">Templates Available</span>
            <span className="text-lg font-black text-foreground">5 Formats</span>
          </div>
        </BrutalCard>
      </div>
 
      {/* 2. Main Section: Drafts list vs Presets */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Drafts List */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center border-b-2 border-border pb-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-foreground">Saved Cover Letter Drafts</h3>
            <BrutalButton 
              onClick={() => onStartNew()}
              className="h-8.5 px-3 text-[9px] font-black uppercase flex items-center gap-1 bg-primary text-white"
            >
              <Plus className="h-3.5 w-3.5" /> Generate New
            </BrutalButton>
          </div>
 
          {drafts.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {drafts.map((draft) => (
                <BrutalCard 
                  key={draft.id}
                  onClick={() => handleSelectDraft(draft)}
                  className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow hover:brutal-shadow-md cursor-pointer transition-all flex flex-col justify-between min-h-[160px]"
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-1">
                      <span className="text-[7.5px] font-black uppercase text-primary tracking-wider">{draft.company}</span>
                      <button 
                        onClick={(e) => toggleFavorite(e, draft)}
                        className="text-foreground-muted hover:text-red-500 transition-colors"
                        aria-label={draft.isFavorite ? "Remove favorite" : "Mark as favorite"}
                      >
                        <Heart className={cn("h-4 w-4", draft.isFavorite ? "fill-red-500 text-red-500" : "text-foreground-muted")} />
                      </button>
                    </div>
 
                    <div>
                      <h4 className="text-[11.5px] font-black uppercase truncate tracking-tight">{draft.title}</h4>
                      <p className="text-[8.5px] font-bold text-foreground-secondary">{draft.jobTitle}</p>
                    </div>
                  </div>
 
                  <div className="border-t border-border/10 pt-3 mt-3 flex justify-between items-center text-[7.5px] font-black uppercase text-foreground-muted">
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {draft.createdAt.split("T")[0]}</span>
                    
                    <div className="flex gap-1.5">
                      <button 
                        onClick={(e) => handleDuplicate(e, draft.id)}
                        className="p-1 border border-border bg-slate-50 dark:bg-surface-secondary hover:bg-slate-100 dark:hover:bg-surface-hover rounded-xs"
                        title="Duplicate draft"
                      >
                        <Copy className="h-3 w-3 text-foreground-secondary" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(e, draft.id, draft.title)}
                        className="p-1 border border-border bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xs text-rose-600 dark:text-rose-400 border-rose-200"
                        title="Delete draft"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </BrutalCard>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No cover letters found"
              description="You do not have any saved cover letter drafts yet. Open the wizard generator to build your first tailored statement!"
              primaryAction={{
                label: "Create Layout",
                onClick: () => onStartNew()
              }}
            />
          )}
        </div>
 
        {/* Templates Presets sidebar */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-foreground border-b-2 border-border pb-2">
            Template Styles
          </h3>
          
          <div className="space-y-3">
            {templatesDetails.map((tmpl) => (
              <BrutalCard 
                key={tmpl.id}
                onClick={() => onStartNew(tmpl.id)}
                className="border-2 border-border hover:border-primary p-3 bg-surface rounded-sm cursor-pointer transition-colors flex flex-col justify-between space-y-1 brutal-shadow-xs text-xs font-semibold"
              >
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase text-[10.5px] tracking-tight">{tmpl.name}</span>
                  <Badge className={cn("text-[6px] font-black px-1.5 py-0 shadow-none border rounded-none uppercase", tmpl.color)}>Active</Badge>
                </div>
                <p className="text-[9px] text-foreground-secondary leading-relaxed">{tmpl.desc}</p>
              </BrutalCard>
            ))}
          </div>
        </div>
 
      </div>
    </div>
  );
}
