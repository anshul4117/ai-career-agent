"use client";
 
import React from "react";
import { useBuilderStore } from "../../store/builder.store";
import { useResumeOptimizerStore } from "../../store/resume-optimizer.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { 
  Sparkles, 
  Target, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  PlusCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ResumeOptimizerSkeleton } from "@/components/ui/skeleton-loaders";
 
export function ResumeOptimizePanel() {
  const { currentResume } = useBuilderStore();
  const { 
    analysis, 
    loading, 
    jobDescription, 
    setJobDescription, 
    runAnalysis,
    versions,
    activeVersionId,
    switchVersion
  } = useResumeOptimizerStore();
 
  const handleAnalyze = () => {
    if (!currentResume) return;
    runAnalysis(currentResume);
  };
 
  const getScoreColorClass = (score: number) => {
    if (score >= 85) return "text-green-600 dark:text-green-400 border-green-400 dark:border-green-500/40 bg-green-50 dark:bg-green-500/10";
    if (score >= 70) return "text-blue-600 dark:text-blue-400 border-blue-400 dark:border-blue-500/40 bg-blue-50 dark:bg-blue-500/10";
    if (score >= 50) return "text-amber-600 dark:text-amber-400 border-amber-400 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10";
    return "text-rose-600 dark:text-rose-400 border-rose-400 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10";
  };
 
  const getStatusLabel = (status: "excellent" | "good" | "needs_improvement" | "poor") => {
    switch (status) {
      case "excellent": return "Excellent";
      case "good": return "Good";
      case "needs_improvement": return "Improve";
      case "poor": return "Critical";
    }
  };
 
  const getStatusColor = (status: "excellent" | "good" | "needs_improvement" | "poor") => {
    switch (status) {
      case "excellent": return "bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300 border-green-300 dark:border-green-500/30";
      case "good": return "bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-500/30";
      case "needs_improvement": return "bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-500/30";
      case "poor": return "bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-500/30";
    }
  };
 
  return (
    <div className="p-3.5 space-y-4 text-left text-xs font-semibold select-none">
      
      {/* Target Job description input */}
      <div className="space-y-1.5">
        <label className="text-[9px] font-black uppercase text-foreground-secondary tracking-wider block">Target Job Specification</label>
        <textarea
          placeholder="Paste the target job description here to check critical keywords and skill alignments..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={4}
          className="w-full text-[10px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <BrutalButton
          onClick={handleAnalyze}
          disabled={loading || !currentResume}
          className="w-full h-8.5 text-[9px] font-black uppercase tracking-wider bg-primary text-white flex items-center justify-center gap-1"
        >
          {loading ? (
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
          ) : (
            <>
              <Sparkles className="h-3.5 w-3.5" /> Optimize Resume
            </>
          )}
        </BrutalButton>
      </div>
 
      {/* Active Optimized Version switcher */}
      <div className="space-y-1.5 border-t border-border/10 pt-3">
        <label className="text-[9px] font-black uppercase text-foreground-secondary tracking-wider block">Active Optimized Version</label>
        <select
          value={activeVersionId || ""}
          onChange={(e) => switchVersion(e.target.value)}
          className="w-full text-[10px] font-bold p-1.5 border-2 border-border bg-surface rounded-sm focus:outline-none"
        >
          {versions.map((ver) => (
            <option key={ver.id} value={ver.id}>
              {ver.name} (ATS: {ver.atsScore}%)
            </option>
          ))}
        </select>
      </div>
 
      {/* Loading spacer */}
      {loading && (
        <ResumeOptimizerSkeleton />
      )}
 
      {/* Analysis widgets */}
      {analysis && !loading && (
        <div className="space-y-4 animate-in fade-in duration-200">
          
          {/* ATS Score card */}
          <BrutalCard className="border-[3px] border-border bg-slate-50/50 dark:bg-surface-secondary/50 p-3 rounded-sm flex flex-col items-center relative overflow-hidden text-center">
            <div className="absolute top-1 right-2 text-[6.5px] font-black text-foreground-muted uppercase tracking-widest">ATS score</div>
            
            <div className={cn(
              "h-14 w-14 rounded-full border-[3px] flex flex-col items-center justify-center font-black text-lg brutal-shadow-xs",
              getScoreColorClass(analysis.atsScore)
            )}>
              {analysis.atsScore}
            </div>
            
            <div className="mt-2 text-[8px] font-black uppercase tracking-wide">
              {analysis.atsScore >= 80 ? "🎯 Ready for Submission!" : "🛠 Needs Optimization"}
            </div>
          </BrutalCard>
 
          {/* Score breakdown metrics list */}
          <div className="grid grid-cols-2 gap-2 text-[8.5px] font-black uppercase">
            <div className="p-2 border border-border rounded-sm bg-surface">
              <span className="text-foreground-muted block text-[6.5px]">Completeness</span>
              <span className="text-foreground">{analysis.completenessScore}%</span>
            </div>
            <div className="p-2 border border-border rounded-sm bg-surface">
              <span className="text-foreground-muted block text-[6.5px]">Keywords Match</span>
              <span className="text-foreground">{analysis.keywordScore}%</span>
            </div>
            <div className="p-2 border border-border rounded-sm bg-surface">
              <span className="text-foreground-muted block text-[6.5px]">Content Quality</span>
              <span className="text-foreground">{analysis.qualityScore}%</span>
            </div>
            <div className="p-2 border border-border rounded-sm bg-surface">
              <span className="text-foreground-muted block text-[6.5px]">Readability</span>
              <span className="text-foreground">{analysis.readabilityScore}%</span>
            </div>
          </div>
 
          {/* Section Breakdown Details */}
          <details className="group border-2 border-border rounded-sm bg-surface">
            <summary className="p-2 text-[9px] font-black uppercase tracking-wider flex justify-between items-center cursor-pointer list-none select-none">
              <span>Section Breakdown</span>
              <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90 text-foreground-muted" />
            </summary>
            
            <div className="border-t border-border/10 p-2 space-y-2 max-h-[220px] overflow-y-auto">
              {Object.entries(analysis.sections).map(([name, sec]) => (
                <div key={name} className="flex justify-between items-center border-b border-border/5 pb-1.5 last:border-0 last:pb-0">
                  <span className="capitalize text-[9px] font-bold">{name}</span>
                  <Badge className={cn("text-[6px] font-black px-1.5 py-0 shadow-none border rounded-none uppercase", getStatusColor(sec.status))}>
                    {getStatusLabel(sec.status)} ({sec.score}%)
                  </Badge>
                </div>
              ))}
            </div>
          </details>
 
          {/* Keyword Comparisons */}
          <details className="group border-2 border-border rounded-sm bg-surface">
            <summary className="p-2 text-[9px] font-black uppercase tracking-wider flex justify-between items-center cursor-pointer list-none select-none">
              <span>Keywords Analysis</span>
              <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90 text-foreground-muted" />
            </summary>
            
            <div className="border-t border-border/10 p-2.5 space-y-3.5 max-h-[250px] overflow-y-auto">
              {/* Matching */}
              <div className="space-y-1">
                <span className="text-[7.5px] font-black text-green-700 dark:text-green-400 uppercase">Matching Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.matching.map((k) => (
                    <Badge key={k} className="text-[6.5px] font-black uppercase bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-400 border-green-200 px-1 py-0 shadow-none rounded-none">{k}</Badge>
                  ))}
                </div>
              </div>
 
              {/* Missing */}
              <div className="space-y-1">
                <span className="text-[7.5px] font-black text-rose-700 dark:text-rose-400 uppercase">Missing Keywords</span>
                <div className="flex flex-wrap gap-1">
                  {analysis.keywords.missing.map((k) => (
                    <Badge key={k} className="text-[6.5px] font-black uppercase bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 px-1 py-0 shadow-none rounded-none">{k}</Badge>
                  ))}
                </div>
              </div>
 
              {/* Densities */}
              <div className="space-y-1">
                <span className="text-[7.5px] font-black text-foreground-secondary uppercase">Density Distributions</span>
                <div className="space-y-1.5">
                  {analysis.keywords.density.slice(0, 3).map((d) => (
                    <div key={d.keyword} className="flex justify-between text-[7px] font-bold uppercase text-foreground-secondary border-b border-border/5 pb-1">
                      <span>{d.keyword}</span>
                      <span>{d.count}x ({d.percentage}%)</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </details>
 
          {/* Skill Gap Analysis */}
          <details className="group border-2 border-border rounded-sm bg-surface">
            <summary className="p-2 text-[9px] font-black uppercase tracking-wider flex justify-between items-center cursor-pointer list-none select-none">
              <span>Skill Gap Analysis</span>
              <ChevronRight className="h-3 w-3 transition-transform group-open:rotate-90 text-foreground-muted" />
            </summary>
            
            <div className="border-t border-border/10 p-2.5 space-y-3 max-h-[220px] overflow-y-auto">
              <div className="space-y-1.5">
                <span className="text-[7.5px] font-black text-rose-700 dark:text-rose-400 uppercase block">Priority Gaps to Add</span>
                {analysis.skillGap.priority.map((skill, sIdx) => (
                  <div key={sIdx} className="flex items-center gap-1 text-[8.5px] font-bold text-foreground">
                    <PlusCircle className="h-3 w-3 text-rose-500 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </details>
 
          {/* Action Suggestions list */}
          <div className="space-y-2 border-t border-border/10 pt-3">
            <h4 className="text-[9px] font-black uppercase text-foreground">Action Suggestions Checklist</h4>
            
            <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
              {/* High Priority suggestions */}
              {analysis.suggestions.high.map((s, idx) => (
                <div key={`h_${idx}`} className="p-2 border-2 border-rose-400 dark:border-rose-500/40 bg-rose-50 dark:bg-rose-500/10/15 rounded-sm flex items-start gap-1.5 text-[8.5px] font-bold leading-snug">
                  <AlertTriangle className="h-3.5 w-3.5 text-rose-500 shrink-0 mt-0.5" />
                  <span className="text-rose-950">{s}</span>
                </div>
              ))}
 
              {/* Medium Priority suggestions */}
              {analysis.suggestions.medium.map((s, idx) => (
                <div key={`m_${idx}`} className="p-2 border border-amber-400 dark:border-amber-500/40 bg-amber-50 dark:bg-amber-500/10/10 rounded-sm flex items-start gap-1.5 text-[8.5px] font-bold leading-snug">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                  <span className="text-amber-950">{s}</span>
                </div>
              ))}
 
              {/* Low Priority suggestions */}
              {analysis.suggestions.low.map((s, idx) => (
                <div key={`l_${idx}`} className="p-2 border border-slate-300 dark:border-border-secondary bg-slate-50/40 dark:bg-surface-secondary/40 rounded-sm flex items-start gap-1.5 text-[8.5px] font-bold leading-snug">
                  <CheckCircle2 className="h-3.5 w-3.5 text-slate-500 shrink-0 mt-0.5" />
                  <span className="text-slate-700 dark:text-foreground-secondary">{s}</span>
                </div>
              ))}
            </div>
          </div>
 
        </div>
      )}
      
      {/* Empty State placeholder */}
      {!analysis && !loading && (
        <div className="text-center py-10 text-foreground-muted space-y-3">
          <div className="h-10 w-10 border border-dashed border-border/40 rounded-sm flex items-center justify-center mx-auto text-foreground-muted bg-slate-50/50 dark:bg-surface-secondary/50">
            <Target className="h-5 w-5" />
          </div>
          <p className="text-[8.5px] font-black uppercase max-w-[200px] mx-auto leading-relaxed">
            Paste target job details and click Optimize to check ATS scores!
          </p>
        </div>
      )}
 
    </div>
  );
}
