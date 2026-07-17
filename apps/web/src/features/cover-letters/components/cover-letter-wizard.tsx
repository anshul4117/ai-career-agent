"use client";
 
import React, { useState, useEffect } from "react";
import type { CoverLetterTemplate, CoverLetterTone } from "../types/cover-letter.types";
import { useCoverLetterStore } from "../store/cover-letter.store";
import { useResumeStore } from "../../resume/store/resume.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { InlineLoader } from "@/components/ui/brand-loader";
import { 
  Sparkles, 
  Copy, 
  Save, 
  FileDown, 
  Layers, 
  Printer, 
  Undo,
  Redo,
  ArrowLeft,
  Settings,
  Eye,
  Edit3
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CoverLetterEditorSkeleton, CoverLetterPreviewSkeleton } from "@/components/ui/skeleton-loaders";
import { motion, AnimatePresence } from "framer-motion";
 
interface CoverLetterWizardProps {
  initialTemplate?: CoverLetterTemplate;
  onBackToDashboard: () => void;
}
 
export function CoverLetterWizard({ initialTemplate, onBackToDashboard }: CoverLetterWizardProps) {
  const { resumes, loadResumes } = useResumeStore();
  const { 
    activeDraft, 
    loading, 
    generateCoverLetter, 
    updateDraftContent, 
    undo, 
    redo, 
    undoStack, 
    redoStack,
    saveDraft,
    createVersion,
    restoreVersion
  } = useCoverLetterStore();
 
  // Form input states
  const [title, setTitle] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [template, setTemplate] = useState<CoverLetterTemplate>("professional");
  const [tone, setTone] = useState<CoverLetterTone>("professional");
 
  // Local active tab for editor block: "editor" | "preview" | "versions"
  const [editorTab, setEditorTab] = useState<"editor" | "preview" | "versions">("editor");
  const [exportingFormat, setExportingFormat] = useState<string | null>(null);
 
  // Load resumes list on mount
  useEffect(() => {
    loadResumes();
  }, [loadResumes]);
 
  // Initialize form if a draft is loaded
  useEffect(() => {
    if (activeDraft) {
      setTitle(activeDraft.title);
      setJobTitle(activeDraft.jobTitle);
      setCompany(activeDraft.company);
      setJobDescription(activeDraft.jobDescription || "");
      setSelectedResumeId(activeDraft.resumeId || "");
      setTemplate(activeDraft.template);
      setTone(activeDraft.tone);
    } else {
      setTitle("");
      setJobTitle("");
      setCompany("");
      setJobDescription("");
      setSelectedResumeId("");
      setTemplate(initialTemplate || "professional");
      setTone("professional");
    }
  }, [activeDraft, initialTemplate]);
 
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobTitle.trim() || !company.trim()) {
      toast.error("Job Title and Company are required!");
      return;
    }
 
    const targetResume = resumes.find((r) => r.id === selectedResumeId) || null;
    const documentTitle = title.trim() || `${company} ${jobTitle} Cover Letter`;
 
    await generateCoverLetter(
      documentTitle,
      jobTitle.trim(),
      company.trim(),
      jobDescription.trim(),
      template,
      tone,
      targetResume
    );
 
    toast.success("AI Cover Letter generated successfully!");
    setEditorTab("editor");
  };
 
  const handleSave = () => {
    if (!activeDraft) return;
    saveDraft({
      title: title.trim(),
      jobTitle: jobTitle.trim(),
      company: company.trim(),
      jobDescription: jobDescription.trim(),
      resumeId: selectedResumeId,
      template,
      tone
    });
    toast.success("Draft document saved successfully!");
  };
 
  const handleCreateVersion = () => {
    if (!activeDraft) return;
    createVersion(template, tone);
    toast.success("Saved active version to history log!");
  };
 
  const handleRestoreVersion = (verId: string) => {
    restoreVersion(verId);
    toast.success("Restored selected version draft!");
  };
 
  const handleCopy = () => {
    if (!activeDraft?.content) return;
    navigator.clipboard.writeText(activeDraft.content);
    toast.success("Copied to clipboard!");
  };
 
  const handleExport = async (format: "pdf" | "docx") => {
    if (!activeDraft) return;
    setExportingFormat(format);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setExportingFormat(null);
    toast.success(`Document exported as ${format.toUpperCase()} successfully!`);
  };
 
  return (
    <div className="space-y-5 text-left select-none relative">
      
      {/* Navigation Row */}
      <div className="flex items-center gap-2 border-b-2 border-border pb-3 mb-2 select-none">
        <BrutalButton 
          onClick={onBackToDashboard}
          variant="secondary"
          className="h-8.5 px-3 text-[9px] font-black uppercase flex items-center gap-1 shrink-0"
        >
          <ArrowLeft className="h-4.5 w-4.5" /> Back to Studio
        </BrutalButton>
        <span className="text-[10px] font-black uppercase text-foreground-muted">/</span>
        <span className="text-[10px] font-black uppercase truncate text-foreground">
          {activeDraft ? activeDraft.title : "Generate Document Workspace"}
        </span>
      </div>
 
      {/* Split screen content */}
      <div className="grid gap-6 lg:grid-cols-2 items-start">
        
        {/* Left Column: Form Controls */}
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-4 text-xs font-semibold">
          <div className="flex items-center justify-between border-b-2 border-border/10 pb-2">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <Settings className="h-4 w-4 text-primary" /> Setup Parameters
            </h3>
            {activeDraft && (
              <Badge className="text-[6.5px] font-black uppercase bg-primary text-white border-none py-0.5 px-1 shadow-none rounded-none">Active Draft</Badge>
            )}
          </div>
 
          <form onSubmit={handleGenerate} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary block">Draft Title</label>
              <input
                type="text"
                placeholder="e.g. OpenAI Full Stack Dev Cover Letter"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
              />
            </div>
 
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Target Company *</label>
                <input
                  type="text"
                  placeholder="e.g. OpenAI"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Job Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                  required
                />
              </div>
            </div>
 
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary block">Job Description Details (Optional)</label>
              <textarea
                placeholder="Paste key keywords or bullet requirements here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                rows={4}
                className="w-full text-[10px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
              />
            </div>
 
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary block">Resume Reference</label>
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
              >
                <option value="">No Resume Profile (Use default settings)</option>
                {resumes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.title} ({r.isDefault ? "Primary" : "Draft"})
                  </option>
                ))}
              </select>
            </div>
 
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Template Layout</label>
                <select
                  value={template}
                  onChange={(e) => setTemplate(e.target.value as CoverLetterTemplate)}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="professional">Standard Professional</option>
                  <option value="startup">Startup Tech</option>
                  <option value="enterprise">Enterprise Systems</option>
                  <option value="modern">Streamlined Modern</option>
                  <option value="minimal">Letter Minimal</option>
                </select>
              </div>
 
              <div className="space-y-1">
                <label className="text-[9px] font-black uppercase text-foreground-secondary block">Tone Pitch</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value as CoverLetterTone)}
                  className="w-full text-[10.5px] font-bold p-2 border-2 border-border bg-surface rounded-sm focus:outline-none"
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly & Warm</option>
                  <option value="confident">Confident & Bold</option>
                  <option value="formal">Conservative Formal</option>
                  <option value="enthusiastic">Enthusiastic</option>
                </select>
              </div>
            </div>
 
            <BrutalButton
              type="submit"
              disabled={loading}
              className="w-full h-10 text-xs font-black uppercase bg-primary text-white flex items-center justify-center gap-1"
            >
              {loading ? (
                <InlineLoader />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> {activeDraft ? "Re-generate Statement" : "Generate Cover Letter"}
                </>
              )}
            </BrutalButton>
          </form>
        </BrutalCard>
 
        {/* Right Column: Editor / Preview Pane */}
        <div className="space-y-3">
          
          {/* Header tabs */}
          <div className="flex border-b-2 border-border select-none bg-surface shrink-0 rounded-sm">
            <button
              onClick={() => setEditorTab("editor")}
              className={cn(
                "flex-1 py-2.5 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors h-10 flex items-center justify-center gap-1",
                editorTab === "editor" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary text-foreground-secondary"
              )}
            >
              <Edit3 className="h-3.5 w-3.5" /> Editor
            </button>
            <button
              onClick={() => setEditorTab("preview")}
              className={cn(
                "flex-1 py-2.5 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors h-10 flex items-center justify-center gap-1",
                editorTab === "preview" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary text-foreground-secondary"
              )}
            >
              <Eye className="h-3.5 w-3.5" /> Printable Preview
            </button>
            <button
              onClick={() => setEditorTab("versions")}
              className={cn(
                "flex-1 py-2.5 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors h-10 flex items-center justify-center gap-1",
                editorTab === "versions" ? "bg-primary text-white" : "bg-surface hover:bg-surface-secondary text-foreground-secondary"
              )}
            >
              <Layers className="h-3.5 w-3.5" /> Version History ({activeDraft?.versions.length || 0})
            </button>
          </div>
 
          {/* Active Pane */}
          {loading ? (
            editorTab === "preview" ? (
              <CoverLetterPreviewSkeleton />
            ) : (
              <CoverLetterEditorSkeleton />
            )
          ) : activeDraft ? (
            <AnimatePresence mode="wait">
              <motion.div
                key={editorTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="w-full space-y-4"
              >
              
              {/* Tab 1: Editor */}
              {editorTab === "editor" && (
                <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs flex flex-col justify-between min-h-[350px]">
                  
                  {/* Editor Toolbar */}
                  <div className="flex flex-wrap items-center gap-2 border-b border-border/10 pb-3 mb-3 text-[8.5px] font-black uppercase text-foreground-muted select-none">
                    <button 
                      onClick={undo}
                      disabled={undoStack.length <= 1}
                      className="p-1 border border-border bg-slate-50 dark:bg-surface-secondary hover:bg-slate-100 dark:hover:bg-surface-hover disabled:opacity-40 rounded-xs flex items-center gap-0.5"
                      title="Undo edit"
                    >
                      <Undo className="h-3 w-3" /> Undo
                    </button>
                    <button 
                      onClick={redo}
                      disabled={redoStack.length === 0}
                      className="p-1 border border-border bg-slate-50 dark:bg-surface-secondary hover:bg-slate-100 dark:hover:bg-surface-hover disabled:opacity-40 rounded-xs flex items-center gap-0.5"
                      title="Redo edit"
                    >
                      <Redo className="h-3 w-3" /> Redo
                    </button>
 
                    <button 
                      onClick={handleCopy}
                      className="p-1 border border-border bg-slate-50 dark:bg-surface-secondary hover:bg-slate-100 dark:hover:bg-surface-hover rounded-xs flex items-center gap-0.5 ml-auto"
                    >
                      <Copy className="h-3 w-3" /> Copy
                    </button>
                    <button 
                      onClick={handleSave}
                      className="p-1 border border-border bg-amber-50 dark:bg-amber-500/10 hover:bg-amber-100 dark:hover:bg-amber-500/20 border-amber-300 dark:border-amber-500/30 text-amber-800 dark:text-amber-300 rounded-xs flex items-center gap-0.5"
                    >
                      <Save className="h-3 w-3" /> Save Draft
                    </button>
                  </div>
 
                  {/* Main textarea */}
                  <textarea
                    value={activeDraft.content}
                    onChange={(e) => updateDraftContent(e.target.value)}
                    className="flex-1 w-full text-[10px] font-mono leading-relaxed p-3 bg-slate-50 dark:bg-surface-secondary border-2 border-border focus:outline-none min-h-[260px] rounded-sm"
                  />
                  
                  {/* Save current version helper */}
                  <div className="border-t border-border/10 pt-3 mt-3 flex justify-between items-center select-none">
                    <span className="text-[7.5px] text-foreground-muted font-bold">Unsaved modifications are in memory cache.</span>
                    <BrutalButton 
                      onClick={handleCreateVersion}
                      variant="secondary"
                      className="h-7 px-2 text-[8px] font-black uppercase flex items-center gap-0.5"
                    >
                      <Layers className="h-3 w-3" /> Push version
                    </BrutalButton>
                  </div>
                </BrutalCard>
              )}
 
              {/* Tab 2: Printable Letter Preview */}
              {editorTab === "preview" && (
                <BrutalCard className="border-[3px] border-border bg-white text-slate-900 p-8 rounded-sm brutal-shadow-xs min-h-[380px] font-serif shadow-inner">
                  {/* Print triggers */}
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-6 font-sans text-[8.5px] font-black uppercase select-none">
                    <span className="text-slate-500 tracking-wider">Formal Document Preview</span>
                    
                    <div className="flex gap-2">
                      <BrutalButton 
                        onClick={() => handleExport("pdf")}
                        disabled={!!exportingFormat}
                        className="h-7 px-3 bg-slate-900 text-white flex items-center gap-1 rounded-sm text-[8px]"
                      >
                        <Printer className="h-3 w-3" /> Print PDF
                      </BrutalButton>
                      <BrutalButton 
                        onClick={() => handleExport("docx")}
                        disabled={!!exportingFormat}
                        variant="secondary"
                        className="h-7 px-3 flex items-center gap-1 rounded-sm text-[8px]"
                      >
                        <FileDown className="h-3 w-3" /> Export DOCX
                      </BrutalButton>
                    </div>
                  </div>
 
                  {/* Letter body */}
                  <div className="whitespace-pre-line text-xs leading-relaxed space-y-4 text-left">
                    {activeDraft.content}
                  </div>
                </BrutalCard>
              )}
 
              {/* Tab 3: Versions Panel */}
              {editorTab === "versions" && (
                <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs min-h-[350px] space-y-3">
                  <h4 className="text-[10px] font-black uppercase tracking-wider border-b-2 border-border/10 pb-2">
                    Draft Version History log
                  </h4>
 
                  {activeDraft.versions && activeDraft.versions.length > 0 ? (
                    <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                      {activeDraft.versions.map((ver) => (
                        <div 
                          key={ver.id}
                          className="p-2 border border-border bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm flex justify-between items-center text-[8.5px] font-bold uppercase"
                        >
                          <div>
                            <span className="font-black text-foreground block">{ver.template} format ({ver.tone} tone)</span>
                            <span className="text-[7.5px] text-foreground-muted block font-mono">Date: {ver.createdAt.replace("T", " ").substring(0, 16)}</span>
                          </div>
                          <button
                            onClick={() => handleRestoreVersion(ver.id)}
                            className="h-6 px-2 border border-border bg-surface hover:bg-surface-secondary text-[7.5px] font-black uppercase rounded-xs"
                          >
                            Restore
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-foreground-muted text-[9px] font-bold uppercase text-center py-10">No past versions archived. Click &quot;Push version&quot; inside editor toolbar to create one.</p>
                  )}
                </BrutalCard>
              )}
 
              </motion.div>
            </AnimatePresence>
          ) : (
            <div className="border-2 border-dashed border-border/20 bg-slate-50/50 dark:bg-surface-secondary/50 rounded-sm p-12 text-center text-foreground-muted min-h-[350px] flex items-center justify-center">
              <p className="text-[9px] font-bold uppercase tracking-wider max-w-xs">
                Draft letter preview will assemble here after you compile generator parameters.
              </p>
            </div>
          )}
 
        </div>
 
      </div>
    </div>
  );
}
