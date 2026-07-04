"use client";

import React, { useEffect, useState } from "react";
import { useExportStore } from "../../store/export.store";
import { useBuilderStore } from "../../store/builder.store";
import { exportService } from "../../services/export.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { X, FileText, Printer, FileCode, Database, Check, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExportDialog({ isOpen, onClose }: ExportDialogProps) {
  const { currentResume } = useBuilderStore();
  const { settings, updateSettings, exportHistory, addExportLog, loadExportHistory } = useExportStore();
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (currentResume?.id) {
      loadExportHistory(currentResume.id);
    }
  }, [currentResume?.id, loadExportHistory]);

  if (!isOpen || !currentResume) return null;

  const triggerSuccessMsg = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const handleDownloadPDF = async () => {
    if (!currentResume) return;
    addExportLog("pdf", currentResume.templateId);
    triggerSuccessMsg("Preparing PDF generation...");
    await exportService.printResume(currentResume, settings);
  };

  const handlePrint = async () => {
    if (!currentResume) return;
    addExportLog("print", currentResume.templateId);
    triggerSuccessMsg("Opening printer dialogue...");
    await exportService.printResume(currentResume, settings);
  };

  const handleDownloadHTML = () => {
    if (!currentResume) return;
    exportService.downloadHTML(currentResume);
    addExportLog("html", currentResume.templateId);
    triggerSuccessMsg("HTML backup downloaded successfully!");
  };

  const handleDownloadJSON = () => {
    if (!currentResume) return;
    exportService.downloadJSON(currentResume);
    addExportLog("json", currentResume.templateId);
    triggerSuccessMsg("JSON configuration exported!");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 md:p-6 overflow-y-auto select-none">
      
      {/* Container Modal / Mobile Sheet */}
      <div 
        className="relative w-full max-w-4xl bg-surface border-4 border-border brutal-shadow-lg flex flex-col md:flex-row max-h-[90vh] overflow-hidden rounded-sm"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Left Side: Print Configuration Panel */}
        <div className="w-full md:w-1/2 p-4 md:p-6 border-b-4 md:border-b-0 md:border-r-4 border-border overflow-y-auto max-h-[45vh] md:max-h-none">
          <div className="flex justify-between items-center pb-3 border-b-2 border-border/10 mb-4">
            <Heading level="h4" className="text-xs font-black uppercase tracking-widest text-foreground">
              Print Settings
            </Heading>
          </div>

          <div className="space-y-4">
            {/* Paper Size */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary">Paper Dimensions</label>
              <div className="grid grid-cols-2 gap-2">
                {(["a4", "letter"] as const).map((sz) => (
                  <button
                    key={sz}
                    onClick={() => updateSettings({ paperSize: sz })}
                    className={cn(
                      "py-1.5 border-2 text-[9px] font-black uppercase rounded-sm transition-all",
                      settings.paperSize === sz ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary text-foreground border-border"
                    )}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            {/* Orientation */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary">Orientation</label>
              <div className="grid grid-cols-2 gap-2">
                {(["portrait", "landscape"] as const).map((o) => (
                  <button
                    key={o}
                    onClick={() => updateSettings({ orientation: o })}
                    className={cn(
                      "py-1.5 border-2 text-[9px] font-black uppercase rounded-sm transition-all",
                      settings.orientation === o ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary text-foreground border-border"
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
            </div>

            {/* Margins */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary">Margins Padding</label>
              <div className="grid grid-cols-3 gap-2">
                {(["narrow", "normal", "wide"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => updateSettings({ margins: m })}
                    className={cn(
                      "py-1.5 border-2 text-[9px] font-black uppercase rounded-sm transition-all",
                      settings.margins === m ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary text-foreground border-border"
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Scale */}
            <div className="space-y-1">
              <label className="text-[9px] font-black uppercase text-foreground-secondary">Zoom Scale</label>
              <div className="grid grid-cols-3 gap-2">
                {([90, 100, 110] as const).map((sc) => (
                  <button
                    key={sc}
                    onClick={() => updateSettings({ scale: sc })}
                    className={cn(
                      "py-1.5 border-2 text-[9px] font-black uppercase rounded-sm transition-all",
                      settings.scale === sc ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary text-foreground border-border"
                    )}
                  >
                    {sc}%
                  </button>
                ))}
              </div>
            </div>

            {/* Grayscale Mode, Backgrounds, Break lines */}
            <div className="space-y-2.5 pt-2 border-t-2 border-border/10">
              {([
                { key: "hideColors", label: "Grayscale / Monochrome PDF" },
                { key: "pageBreakPreview", label: "Show Page Break Line Guides" },
                { key: "sectionBreaks", label: "Force Page Break per Section" }
              ] as const).map((opt) => {
                const key = opt.key;
                return (
                  <button
                    key={key}
                    onClick={() => updateSettings({ [key]: !settings[key] })}
                    className="flex items-center justify-between w-full p-2 border border-border/20 rounded-sm bg-surface-secondary/15 hover:bg-surface-secondary/35 text-left transition-colors"
                  >
                    <span className="text-[10px] font-black uppercase text-foreground">{opt.label}</span>
                    <div className={cn(
                      "h-4 w-7 border-2 border-border rounded-full relative transition-colors",
                      settings[key] ? "bg-primary" : "bg-slate-200"
                    )}>
                      <div className={cn(
                        "h-2.5 w-2.5 bg-white border border-border rounded-full absolute top-0.5 transition-all",
                        settings[key] ? "right-0.5" : "left-0.5"
                      )} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Side: Exporters Actions & Logs */}
        <div className="w-full md:w-1/2 p-4 md:p-6 flex flex-col justify-between overflow-y-auto max-h-[45vh] md:max-h-none">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-1 border-2 border-border bg-surface hover:bg-surface-secondary rounded-sm active:translate-x-0 active:translate-y-0"
            aria-label="Close Export Panel"
          >
            <X className="h-5 w-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 pb-3 border-b-2 border-border/10 mb-4 select-none">
              <Heading level="h4" className="text-xs font-black uppercase tracking-widest text-foreground">
                Export Options
              </Heading>
            </div>

            {/* Success notification banner */}
            {successMsg && (
              <div className="mb-4 bg-primary text-white text-[10px] font-black uppercase p-2 border-2 border-border brutal-shadow-xs flex items-center gap-1.5">
                <Check className="h-4 w-4 stroke-[3px]" /> {successMsg}
              </div>
            )}

            {/* Action buttons list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {/* PDF Print trigger */}
              <BrutalCard className="p-3 bg-surface hover:bg-primary/5 transition-colors cursor-pointer border-2 border-border" onClick={handleDownloadPDF}>
                <div className="flex items-center gap-2 mb-1.5 text-primary">
                  <FileText className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase text-foreground">Download PDF</span>
                </div>
                <Text variant="muted" className="text-[9px] leading-relaxed">
                  Generate print-ready vector PDF using client-side renderer.
                </Text>
              </BrutalCard>

              {/* Physical Print */}
              <BrutalCard className="p-3 bg-surface hover:bg-primary/5 transition-colors cursor-pointer border-2 border-border" onClick={handlePrint}>
                <div className="flex items-center gap-2 mb-1.5 text-emerald-600">
                  <Printer className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase text-foreground">Print Document</span>
                </div>
                <Text variant="muted" className="text-[9px] leading-relaxed">
                  Send directly to browser print queue.
                </Text>
              </BrutalCard>

              {/* HTML backup */}
              <BrutalCard className="p-3 bg-surface hover:bg-primary/5 transition-colors cursor-pointer border-2 border-border" onClick={handleDownloadHTML}>
                <div className="flex items-center gap-2 mb-1.5 text-amber-500">
                  <FileCode className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase text-foreground">Download HTML</span>
                </div>
                <Text variant="muted" className="text-[9px] leading-relaxed">
                  Export responsive webpage markup.
                </Text>
              </BrutalCard>

              {/* JSON configuration backup */}
              <BrutalCard className="p-3 bg-surface hover:bg-primary/5 transition-colors cursor-pointer border-2 border-border" onClick={handleDownloadJSON}>
                <div className="flex items-center gap-2 mb-1.5 text-indigo-500">
                  <Database className="h-5 w-5" />
                  <span className="text-[10px] font-black uppercase text-foreground">Export JSON</span>
                </div>
                <Text variant="muted" className="text-[9px] leading-relaxed">
                  Download raw data configurations backup.
                </Text>
              </BrutalCard>
            </div>
          </div>

          {/* Export Logs History */}
          <div className="border-t-2 border-border/10 pt-4">
            <div className="flex items-center gap-1.5 mb-2 select-none">
              <History className="h-4.5 w-4.5 text-foreground-secondary" />
              <h5 className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary">
                Export Logs ({exportHistory.length})
              </h5>
            </div>
            
            <div className="max-h-28 overflow-y-auto space-y-1.5 pr-1">
              {exportHistory.length === 0 ? (
                <div className="text-center py-4 border border-dashed border-border/25 rounded-sm bg-surface-secondary/5 text-[9px] font-bold text-foreground-muted select-none">
                  No export logs available.
                </div>
              ) : (
                exportHistory.map((log) => (
                  <div 
                    key={log.id} 
                    className="flex justify-between items-center text-[9px] font-semibold border border-border/10 p-1.5 bg-surface-secondary/10 rounded-sm"
                  >
                    <div className="flex items-center gap-2">
                      <span className="bg-primary text-white font-black text-[7px] uppercase px-1 rounded-sm">
                        {log.format}
                      </span>
                      <span className="text-foreground font-mono">{log.timestamp}</span>
                    </div>
                    <span className="text-foreground-muted font-mono uppercase text-[8px]">
                      Template: {log.templateId}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
