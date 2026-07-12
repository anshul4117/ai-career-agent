"use client";

import React, { useState, useEffect } from "react";
import { ResumeToolbar } from "./resume-toolbar";
import { ResumeSectionsSidebar } from "./resume-sections-sidebar";
import { ResumeEditor } from "./resume-editor";
import { ResumePreview } from "./resume-preview";
import { TemplateGallery } from "./template-gallery";
import { ThemePanel } from "./theme-panel";
import { ExportDialog } from "./export-dialog";
import { ResumeOptimizePanel } from "./resume-optimize-panel";
import { OptimizationStudio } from "./optimization-studio";
import { useBuilderStore } from "../../store/builder.store";
import { useThemeStore } from "../../store/theme.store";
import { cn } from "@/lib/utils";
import { Eye, X, GripVertical, Settings } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { motion, AnimatePresence } from "framer-motion";

const fadeVariants = {
  hidden: { opacity: 0, y: 5 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } }
};

export function ResumeBuilderLayout() {
  const { currentResume } = useBuilderStore();
  const { loadTheme } = useThemeStore();

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeSidebarTab, setActiveSidebarTab] = useState<"sections" | "templates" | "theme" | "optimize">("sections");
  const [previewWidth, setPreviewWidth] = useState(500);
  const [isResizing, setIsResizing] = useState(false);
  
  // Mobile drawer states
  const [showMobilePreviewSheet, setShowMobilePreviewSheet] = useState(false);
  const [showMobileThemeSheet, setShowMobileThemeSheet] = useState(false);
  
  // Export modal state
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);

  // Sync theme when resume loads
  useEffect(() => {
    if (currentResume?.id) {
      loadTheme(currentResume.id);
    }
  }, [currentResume?.id, loadTheme]);

  // Set default sidebar state based on window size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        setIsSidebarCollapsed(true); // default collapsed on tablet
      } else {
        setIsSidebarCollapsed(false); // expanded on desktop
      }
    };
    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Resize handler for desktop / laptop
  const startResizing = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth > 320 && newWidth < window.innerWidth * 0.6) {
        setPreviewWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-background">
      {/* Top Toolbar */}
      <ResumeToolbar 
        onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        isSidebarCollapsed={isSidebarCollapsed}
        onExportClick={() => setIsExportDialogOpen(true)}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 w-full relative">
        
        {/* Left Column: Sidebar Customization Panel */}
        <div 
          className={cn(
            "hidden md:flex flex-col shrink-0 border-r-3 border-border transition-all duration-300 ease-in-out bg-surface",
            isSidebarCollapsed ? "w-[68px]" : "w-[260px]"
          )}
        >
          {/* Tab Selection Headers - Visible only if expanded */}
          {!isSidebarCollapsed && (
            <div className="flex border-b-2 border-border select-none shrink-0">
              {(["sections", "templates", "theme", "optimize"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSidebarTab(tab)}
                  className={cn(
                    "flex-1 py-2 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors h-10",
                    activeSidebarTab === tab 
                      ? "bg-primary text-white" 
                      : "bg-surface hover:bg-surface-secondary text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          {/* Sidebar Content View */}
          <div className="flex-1 overflow-y-auto">
            {isSidebarCollapsed ? (
              // Collapsed mode: default to Sections icons only
              <ResumeSectionsSidebar isCollapsed={true} />
            ) : (
              // Expanded Mode: render active tab component
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSidebarTab}
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="h-full w-full"
                >
                  {activeSidebarTab === "sections" && <ResumeSectionsSidebar />}
                  {activeSidebarTab === "templates" && <TemplateGallery />}
                  {activeSidebarTab === "theme" && <ThemePanel />}
                  {activeSidebarTab === "optimize" && <ResumeOptimizePanel />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>

        {/* Center Column: Forms Editor (+ Tablet Preview below it) */}
        <div className="flex-1 flex flex-col overflow-hidden min-w-0 bg-background-light">
          {/* Mobile horizontal scroll pill tabs navigation at the top */}
          <div className="block md:hidden border-b-2 border-border p-2 bg-surface overflow-x-auto shrink-0 select-none">
            <ResumeSectionsSidebar isMobileHeader />
          </div>

          {/* Primary scroll container: Editor and Preview stack vertically on Tablet */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto min-w-0">
            <div className="max-w-3xl mx-auto space-y-12">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSidebarTab === "optimize" ? "optimize" : "editor"}
                  variants={fadeVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="w-full"
                >
                  {activeSidebarTab === "optimize" ? <OptimizationStudio /> : <ResumeEditor />}
                </motion.div>
              </AnimatePresence>

              {/* Tablet view for Live Preview (rendered directly below editor on md screen, hidden on lg and sm) */}
              <div className="hidden md:block lg:hidden border-t-3 border-border pt-8 mt-8">
                <div className="flex items-center justify-between pb-3 border-b-2 border-border/10 mb-4 select-none">
                  <h3 className="font-black text-xs uppercase text-foreground-secondary tracking-widest">
                    Live Preview
                  </h3>
                </div>
                <ResumePreview />
              </div>
            </div>
          </div>
        </div>

        {/* Resize Handler / Divider (Laptop / Desktop only - >= 1024px) */}
        <div 
          onMouseDown={startResizing}
          className={cn(
            "hidden lg:flex w-1.5 hover:w-2 bg-border hover:bg-primary cursor-col-resize items-center justify-center transition-all duration-150 shrink-0 self-stretch select-none",
            isResizing && "bg-primary w-2"
          )}
          title="Drag to resize preview panel"
        >
          <GripVertical className="h-4 w-4 text-white opacity-40 hover:opacity-100" />
        </div>

        {/* Right Column: Live Preview Canvas (Desktop & Laptop only - >= 1024px) */}
        <div 
          style={{ width: `${previewWidth}px` }}
          className="hidden lg:block shrink-0 overflow-y-auto bg-surface-secondary/15 p-4 border-l border-border/20"
        >
          <div className="flex items-center justify-between pb-3 border-b-2 border-border/10 mb-4 select-none">
            <h3 className="font-black text-xs uppercase text-foreground-secondary tracking-widest">
              Live Preview
            </h3>
            <span className="text-[9px] font-mono text-foreground-muted">
              {previewWidth}px width
            </span>
          </div>

          <div 
            className={cn(
              "w-full origin-top transition-transform",
              previewWidth < 460 && "scale-90 origin-top-left",
              previewWidth < 380 && "scale-[0.8] origin-top-left"
            )}
          >
            <ResumePreview />
          </div>
        </div>

      </div>

      {/* MOBILE FLOATING ACTION BUTTONS */}
      <div className="block md:hidden fixed bottom-4 right-4 z-40 select-none flex gap-2">
        {/* Customize Theme Button */}
        <BrutalButton
          onClick={() => setShowMobileThemeSheet(true)}
          variant="secondary"
          className="h-12 w-12 flex items-center justify-center brutal-shadow p-0"
          aria-label="Customize Theme"
        >
          <Settings className="h-5 w-5" />
        </BrutalButton>

        {/* Preview Resume Button */}
        <BrutalButton
          onClick={() => setShowMobilePreviewSheet(true)}
          className="h-12 px-5 font-black uppercase text-xs flex items-center gap-2 brutal-shadow"
          aria-label="Preview Resume"
        >
          <Eye className="h-4.5 w-4.5" />
          Preview
        </BrutalButton>
      </div>

      {/* MOBILE BOTTOM SHEET PREVIEW OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden",
          showMobilePreviewSheet ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowMobilePreviewSheet(false)}
      >
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 top-16 bg-surface border-t-4 border-border flex flex-col transition-transform duration-300 ease-in-out brutal-shadow-lg",
            showMobilePreviewSheet ? "translate-y-0" : "translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-border p-4 bg-surface-secondary/10 select-none">
            <h3 className="font-black text-sm uppercase text-foreground">
              Resume Preview
            </h3>
            <button
              onClick={() => setShowMobilePreviewSheet(false)}
              className="p-1 border-2 border-border hover:bg-surface-secondary rounded-sm active:translate-x-0 active:translate-y-0"
              aria-label="Close Preview"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Canvas */}
          <div className="flex-1 overflow-y-auto p-4 bg-[#f1f5f9]">
            <ResumePreview />
          </div>
        </div>
      </div>

      {/* MOBILE BOTTOM SHEET THEME OVERLAY */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/60 z-50 transition-opacity duration-300 md:hidden",
          showMobileThemeSheet ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setShowMobileThemeSheet(false)}
      >
        <div 
          className={cn(
            "absolute inset-x-0 bottom-0 top-20 bg-surface border-t-4 border-border flex flex-col transition-transform duration-300 ease-in-out brutal-shadow-lg",
            showMobileThemeSheet ? "translate-y-0" : "translate-y-full"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header with tabs */}
          <div className="flex items-center justify-between border-b-2 border-border p-3 bg-surface-secondary/10 select-none">
            <div className="flex border-2 border-border select-none rounded-sm">
              {(["templates", "theme", "optimize"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveSidebarTab(tab)}
                  className={cn(
                    "px-3 py-1.5 text-[9px] font-black uppercase tracking-wider border-r border-border last:border-r-0 transition-colors",
                    activeSidebarTab === tab 
                      ? "bg-primary text-white" 
                      : "bg-surface text-foreground"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMobileThemeSheet(false)}
              className="p-1 border-2 border-border hover:bg-surface-secondary rounded-sm active:translate-x-0 active:translate-y-0"
              aria-label="Close Customizations"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeSidebarTab === "templates" && <TemplateGallery />}
            {activeSidebarTab === "theme" && <ThemePanel />}
            {activeSidebarTab === "optimize" && <ResumeOptimizePanel />}
          </div>
        </div>
      </div>

      {/* EXPORT OPTIONS MODAL */}
      <ExportDialog 
        isOpen={isExportDialogOpen} 
        onClose={() => setIsExportDialogOpen(false)} 
      />

    </div>
  );
}
