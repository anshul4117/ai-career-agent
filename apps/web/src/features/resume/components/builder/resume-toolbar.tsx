"use client";

import React from "react";
import Link from "next/link";
import { useBuilderStore } from "../../store/builder.store";
import { MOCK_TEMPLATES } from "../../services/resume.service";
import { AutoSaveIndicator } from "./autosave-indicator";
import { BrutalButton } from "@/components/ui/brutal-button";
import { ArrowLeft, Save, Layout, Undo2, Redo2, Menu, FileText } from "lucide-react";

interface ResumeToolbarProps {
  onToggleSidebar?: () => void;
  isSidebarCollapsed?: boolean;
  onExportClick?: () => void;
}

export function ResumeToolbar({ onToggleSidebar, isSidebarCollapsed, onExportClick }: ResumeToolbarProps) {
  const { 
    currentResume, 
    updateTemplate, 
    updateMetadata, 
    forceSave, 
    savingState,
    past,
    future,
    undo,
    redo
  } = useBuilderStore();

  if (!currentResume) return null;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateMetadata(
      e.target.value,
      currentResume.description,
      currentResume.isDefault,
      currentResume.status
    );
  };

  const handleTemplateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    updateTemplate(e.target.value);
  };

  return (
    <header className="border-b-3 border-border bg-surface px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 sticky top-0 z-30 select-none min-h-[64px]">
      
      {/* Title & Navigation Section */}
      <div className="flex items-center gap-2.5 w-full md:w-auto min-w-0">
        <Link
          href="/resume"
          className="h-10 w-10 flex items-center justify-center border-[3px] border-border bg-surface brutal-shadow-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0 shrink-0"
          aria-label="Back to dashboard"
        >
          <ArrowLeft className="h-4.5 w-4.5" />
        </Link>
        
        {/* Sidebar Toggle Button (Visible only on desktop/tablet) */}
        {onToggleSidebar && (
          <button
            type="button"
            onClick={onToggleSidebar}
            className="hidden md:flex h-10 w-10 items-center justify-center border-[3px] border-border bg-surface brutal-shadow-xs hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow-xs transition-all active:translate-x-0 active:translate-y-0 shrink-0"
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-4.5 w-4.5" />
          </button>
        )}
 
        <div className="flex-1 min-w-0">
          <input
            type="text"
            value={currentResume.title}
            onChange={handleTitleChange}
            placeholder="Untitled Resume"
            className="w-full bg-transparent border-0 border-b-2 border-transparent hover:border-border/20 focus:border-primary p-0.5 text-sm md:text-base font-black uppercase tracking-tight focus:outline-none focus:ring-0 truncate h-10"
          />
        </div>
      </div>
 
      {/* Toolbar Controls Section - Horizontally scrolls on mobile */}
      <div className="flex flex-nowrap items-center gap-2.5 overflow-x-auto scrollbar-none w-full md:w-auto pb-1 md:pb-0 shrink-0 max-w-full justify-start md:justify-end">
        
        {/* Undo / Redo Controls */}
        <div className="flex items-center gap-1 border-2 border-border bg-surface p-1 brutal-shadow-xs shrink-0 h-10">
          <button
            onClick={() => undo()}
            disabled={past.length === 0}
            className="h-8 w-8 flex items-center justify-center border border-transparent hover:border-border/10 disabled:opacity-40 disabled:hover:border-transparent rounded-sm text-foreground-secondary hover:bg-surface-secondary/40"
            title="Undo (Ctrl+Z / Cmd+Z)"
            aria-label="Undo"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => redo()}
            disabled={future.length === 0}
            className="h-8 w-8 flex items-center justify-center border border-transparent hover:border-border/10 disabled:opacity-40 disabled:hover:border-transparent rounded-sm text-foreground-secondary hover:bg-surface-secondary/40"
            title="Redo (Ctrl+Shift+Z / Cmd+Shift+Z)"
            aria-label="Redo"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>
 
        {/* Template Selector */}
        <div className="flex items-center gap-2 border-2 border-border bg-surface px-2.5 shrink-0 h-10 brutal-shadow-xs">
          <Layout className="h-4 w-4 text-foreground-muted" />
          <select
            value={currentResume.templateId}
            onChange={handleTemplateChange}
            className="bg-transparent border-none text-[10px] font-black uppercase tracking-wider p-0 focus:ring-0 focus:outline-none cursor-pointer h-full"
          >
            {MOCK_TEMPLATES.map((tmpl) => (
              <option key={tmpl.id} value={tmpl.id}>
                {tmpl.name}
              </option>
            ))}
          </select>
        </div>
 
        {/* AutoSave and Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <AutoSaveIndicator />
          <BrutalButton
            onClick={() => forceSave()}
            disabled={savingState === "saving"}
            className="h-10 px-4 text-[10px] font-black uppercase flex items-center gap-1.5 shrink-0 brutal-shadow-xs"
          >
            <Save className="h-4 w-4" />
            Save
          </BrutalButton>

          {/* Export Action */}
          {onExportClick && (
            <BrutalButton
              onClick={onExportClick}
              variant="secondary"
              className="h-10 px-4 text-[10px] font-black uppercase flex items-center gap-1.5 shrink-0 brutal-shadow-xs"
            >
              <FileText className="h-4 w-4" />
              Export
            </BrutalButton>
          )}
        </div>

      </div>
    </header>
  );
}
