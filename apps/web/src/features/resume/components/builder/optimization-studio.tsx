"use client";
 
import React, { useState } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { useResumeOptimizerStore } from "../../store/resume-optimizer.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { 
  Diff, 
  ListTodo, 
  BookOpen, 
  Layers, 
  History, 
  ArrowRight,
  Download,
  Sparkles,
  CheckCircle,
  FileDown
} from "lucide-react";
import { cn } from "@/lib/utils";
 
export function OptimizationStudio() {
  const { currentResume } = useBuilderStore();
  const { 
    analysis, 
    activeStudioTab, 
    setActiveStudioTab,
    versions,
    activeVersionId,
    switchVersion,
    createVersion,
    history,
    clearHistory,
    exportResume
  } = useResumeOptimizerStore();
 
  // Local state for versions and toast notification
  const [newVersionName, setNewVersionName] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
 
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };
 
  const handleCreateVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVersionName.trim() || !currentResume) return;
    await createVersion(newVersionName.trim(), currentResume);
    triggerToast(`Created version "${newVersionName}" successfully!`);
    setNewVersionName("");
  };
 
  const handleExport = async (format: "pdf" | "docx") => {
    setExportingFormat(format);
    const path = await exportResume(format);
    setExportingFormat(null);
    triggerToast(`Exported successfully as ${format.toUpperCase()}! File saved: ${path}`);
  };
 
  if (!analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-6 space-y-4">
        <div className="h-16 w-16 border-2 border-dashed border-border/40 rounded-sm flex items-center justify-center bg-surface text-foreground-muted">
          <Sparkles className="h-8 w-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-black uppercase tracking-wider">AI Optimizer Studio</h3>
          <p className="text-xs text-foreground-secondary max-w-sm">
            Paste a target Job Description in the left panel and trigger the scan to unlock diffs, bullet enhancers, and versions trackers.
          </p>
        </div>
      </div>
    );
  }
 
  const tabs = [
    { id: "comparison", label: "Diff View", icon: Diff },
    { id: "bullets", label: "Bullet Enhancer", icon: ListTodo },
    { id: "readability", label: "Readability", icon: BookOpen },
    { id: "versions", label: "Versions & Export", icon: Layers },
    { id: "history", label: "Audit History", icon: History }
  ] as const;
 
  return (
    <div className="space-y-6 text-left relative">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white border-2 border-border p-3 text-[10px] font-black uppercase tracking-wider brutal-shadow flex items-center gap-1.5" role="alert">
          <CheckCircle className="h-4 w-4 stroke-[3px]" /> {toastMsg}
        </div>
      )}
 
      {/* Studio Header tabs selector */}
      <div className="flex border-b-2 border-border overflow-x-auto select-none bg-surface shrink-0 rounded-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeStudioTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveStudioTab(tab.id)}
              className={cn(
                "flex-1 min-w-[100px] py-2.5 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors h-11 flex items-center justify-center gap-1.5",
                isActive 
                  ? "bg-primary text-white" 
                  : "bg-surface hover:bg-surface-secondary text-foreground-secondary"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
 
      {/* Active Tab Panel Content */}
      <div className="space-y-4">
        
        {/* Tab 1: Before / After Comparison */}
        {activeStudioTab === "comparison" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  Professional Summary Comparison
                </h3>
                <p className="text-[8px] text-foreground-muted uppercase">Highlights text level edits and metrics adjustments</p>
              </div>
 
              <div className="grid gap-4 md:grid-cols-2 text-[10.5px] leading-relaxed">
                {/* Original */}
                <div className="p-3 border border-border bg-slate-50/50 rounded-sm space-y-2">
                  <span className="text-[7.5px] font-black text-rose-700 uppercase bg-rose-50 border border-rose-200 px-1 py-0.5 rounded-none shadow-none">Original Summary</span>
                  <p className="text-foreground-secondary italic">{analysis.summaryOpt.original}</p>
                </div>
 
                {/* Optimized */}
                <div className="p-3 border-2 border-green-400 bg-green-50/10 rounded-sm space-y-2">
                  <span className="text-[7.5px] font-black text-green-700 uppercase bg-green-50 border border-green-200 px-1 py-0.5 rounded-none shadow-none">AI Optimized Summary</span>
                  <p className="text-green-950 font-medium bg-green-50/30 p-1.5 rounded-sm">{analysis.summaryOpt.improved}</p>
                  <p className="text-[8.5px] text-foreground-muted font-bold pt-1.5 border-t border-border/10">Rationale: {analysis.summaryOpt.rationale}</p>
                </div>
              </div>
            </BrutalCard>
          </div>
        )}
 
        {/* Tab 2: Bullet Point Enhancer */}
        {activeStudioTab === "bullets" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
                  Experience Bullet Enhancer
                </h3>
                <p className="text-[8px] text-foreground-muted uppercase">Converts passive phrases into metric-infused metrics</p>
              </div>
 
              <div className="space-y-3">
                {analysis.bullets.map((b, idx) => (
                  <div key={idx} className="p-3 border border-border bg-surface rounded-sm flex flex-col md:flex-row gap-3 items-stretch">
                    {/* Before */}
                    <div className="flex-1 space-y-1">
                      <span className="text-[7px] font-black text-foreground-muted uppercase">Original bullet</span>
                      <p className="text-[10.5px] text-foreground-secondary italic leading-relaxed">{b.original}</p>
                    </div>
                    {/* Arrow spacer */}
                    <div className="hidden md:flex items-center justify-center text-foreground-muted">
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    {/* After */}
                    <div className="flex-1 space-y-1 border-t md:border-t-0 md:border-l border-border/10 pt-2 md:pt-0 md:pl-3">
                      <span className="text-[7.5px] font-black text-primary uppercase">Optimized version</span>
                      <p className="text-[10.5px] text-foreground font-black leading-relaxed text-green-950 bg-green-50/10 p-1 rounded-xs">{b.improved}</p>
                      <span className="text-[8px] font-bold text-foreground-muted block mt-1.5">{b.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </BrutalCard>
          </div>
        )}
 
        {/* Tab 3: Readability Analysis */}
        {activeStudioTab === "readability" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid gap-4 md:grid-cols-2">
              {/* Score gauge card */}
              <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex flex-col justify-between">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                  Readability Index
                </h3>
                <div className="py-6 flex flex-col items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-[3px] border-primary flex items-center justify-center text-lg font-black bg-amber-50/10 text-primary brutal-shadow-xs">
                    {analysis.readability.readabilityScore}
                  </div>
                  <span className="text-[8.5px] font-black uppercase tracking-wider text-foreground mt-3">Tone: {analysis.readability.tone}</span>
                </div>
              </BrutalCard>
 
              {/* Diagnostic meters */}
              <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                  Sentence Diagnostics
                </h3>
 
                <div className="space-y-3.5">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                      <span>Avg Sentence Length</span>
                      <span>{analysis.readability.sentenceLength} words</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 border border-border rounded-sm overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${Math.min(100, (analysis.readability.sentenceLength / 25) * 100)}%` }} />
                    </div>
                  </div>
 
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                      <span>Passive Voice Instances</span>
                      <span>{analysis.readability.passiveVoiceCount} detected</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 border border-border rounded-sm overflow-hidden">
                      <div className="h-full bg-rose-500" style={{ width: `${Math.min(100, (analysis.readability.passiveVoiceCount / 8) * 100)}%` }} />
                    </div>
                  </div>
 
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase">
                      <span>Grammar Warnings</span>
                      <span>{analysis.readability.grammarWarningsCount} flagged</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 border border-border rounded-sm overflow-hidden">
                      <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (analysis.readability.grammarWarningsCount / 5) * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </BrutalCard>
            </div>
          </div>
        )}
 
        {/* Tab 4: Versions & Export */}
        {activeStudioTab === "versions" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid gap-4 md:grid-cols-2">
              
              {/* Active versions management */}
              <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                  Variant Profiles versions
                </h3>
 
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                  {versions.map((ver) => (
                    <div 
                      key={ver.id}
                      onClick={() => switchVersion(ver.id)}
                      className={cn(
                        "p-2.5 border-2 border-border rounded-sm flex justify-between items-center cursor-pointer transition-all",
                        ver.id === activeVersionId 
                          ? "bg-amber-50 border-primary" 
                          : "bg-slate-50/50 hover:bg-slate-100/50"
                      )}
                    >
                      <div>
                        <span className="text-[10.5px] font-black uppercase block">{ver.name}</span>
                        <span className="text-[8px] text-foreground-muted block font-mono">Created: {ver.createdAt.split("T")[0]}</span>
                      </div>
                      <Badge className="text-[7px] font-black uppercase bg-primary text-white border-none py-0.5 px-1 shadow-none rounded-none">ATS: {ver.atsScore}%</Badge>
                    </div>
                  ))}
                </div>
 
                {/* Create form */}
                <form onSubmit={handleCreateVersion} className="flex gap-2 border-t border-border/10 pt-3">
                  <input
                    type="text"
                    placeholder="e.g. DevOps Engineer"
                    value={newVersionName}
                    onChange={(e) => setNewVersionName(e.target.value)}
                    className="flex-1 text-[10px] font-bold p-1.5 border border-border rounded-sm bg-surface"
                    required
                  />
                  <BrutalButton type="submit" className="h-8 px-3 text-[9px] font-black uppercase shrink-0">Add Version</BrutalButton>
                </form>
              </BrutalCard>
 
              {/* Mock export cards */}
              <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground border-b-2 border-border/10 pb-2">
                  Export Workspaces
                </h3>
                <p className="text-[9px] text-foreground-secondary leading-relaxed">
                  Download this optimized variant to your desktop files using the mock system.
                </p>
                <div className="grid gap-2">
                  <BrutalButton 
                    onClick={() => handleExport("pdf")}
                    disabled={!!exportingFormat}
                    className="w-full h-10 text-[9px] font-black uppercase bg-primary text-white flex items-center justify-center gap-1.5"
                  >
                    <Download className="h-4 w-4" /> Download PDF File
                  </BrutalButton>
                  <BrutalButton 
                    onClick={() => handleExport("docx")}
                    disabled={!!exportingFormat}
                    variant="secondary"
                    className="w-full h-10 text-[9px] font-black uppercase flex items-center justify-center gap-1.5"
                  >
                    <FileDown className="h-4 w-4" /> Download DOCX Document
                  </BrutalButton>
                </div>
              </BrutalCard>
 
            </div>
          </div>
        )}
 
        {/* Tab 5: Optimization Audit History */}
        {activeStudioTab === "history" && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  Optimization History Audit logs
                </h3>
                {history.length > 0 && (
                  <button 
                    onClick={clearHistory}
                    className="text-[8px] font-black uppercase text-error hover:text-red-700 transition-colors"
                  >
                    Clear History
                  </button>
                )}
              </div>
 
              {history.length > 0 ? (
                <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div key={item.id} className="p-2 border border-border bg-slate-50/50 rounded-sm flex justify-between items-center text-[9px] font-bold uppercase">
                      <div>
                        <span className="font-black text-foreground block">{item.jobTitle}</span>
                        <span className="text-[7.5px] text-foreground-muted block font-mono">Date: {item.date} | Active Profile: {item.version}</span>
                      </div>
                      <Badge className="text-[7px] font-black bg-primary text-white border-none rounded-none">{item.atsScore}% Score</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-foreground-muted text-[9px] font-bold uppercase text-center py-6">No past optimization logs available.</p>
              )}
            </BrutalCard>
          </div>
        )}
 
      </div>
    </div>
  );
}
