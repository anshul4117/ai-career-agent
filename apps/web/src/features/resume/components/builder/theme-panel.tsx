"use client";

import React from "react";
import { useThemeStore } from "../../store/theme.store";
import { THEME_PRESETS } from "../../services/theme.service";
import { Heading } from "@/components/ui/typography";
import { RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemePanel() {
  const { currentTheme, updateTheme, applyPreset, resetTheme } = useThemeStore();

  const handleColorChange = (key: "primaryColor" | "accentColor" | "backgroundColor" | "textColor" | "headingColor", val: string) => {
    updateTheme({ [key]: val });
  };

  const fontOptions = [
    { value: "Inter", label: "Sans-Serif (Inter)" },
    { value: "Times New Roman", label: "Classical Serif (Times)" },
    { value: "Georgia", label: "Book Serif (Georgia)" },
    { value: "Playfair Display", label: "Elegant Serif (Playfair)" },
    { value: "Fira Code", label: "Monospace (Fira Code)" }
  ];

  const presets = Object.keys(THEME_PRESETS);

  return (
    <div className="space-y-6 p-3 select-none pb-20">
      
      {/* 1. PRESETS BLOCK */}
      <div className="space-y-2">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1 mb-1">
          Theme Presets
        </Heading>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => {
            const isActive = currentTheme.activePreset === preset;
            return (
              <button
                key={preset}
                type="button"
                onClick={() => applyPreset(preset)}
                className={cn(
                  "px-2.5 py-1.5 border-2 text-[10px] font-black uppercase tracking-wider transition-all rounded-sm",
                  isActive
                    ? "bg-primary text-white border-foreground brutal-shadow-xs translate-x-[-1px] translate-y-[-1px]"
                    : "bg-surface text-foreground border-border hover:bg-surface-secondary"
                )}
              >
                {preset}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={resetTheme}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 border-2 border-dashed border-error text-error hover:bg-error/5 text-[9px] font-black uppercase rounded-sm transition-all"
        >
          <RefreshCw className="h-3 w-3" /> Reset Customizations
        </button>
      </div>

      {/* 2. COLORS CONFIGURATION */}
      <div className="space-y-3">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1">
          Color Palette
        </Heading>
        
        {/* Colors Row */}
        <div className="space-y-2">
          {[
            { key: "primaryColor", label: "Primary Theme Color" },
            { key: "accentColor", label: "Accent / Dividers" },
            { key: "backgroundColor", label: "Page Background" },
            { key: "textColor", label: "Body Text Color" },
            { key: "headingColor", label: "Headings Color" }
          ].map((item) => {
            const key = item.key as "primaryColor" | "accentColor" | "backgroundColor" | "textColor" | "headingColor";
            return (
              <div key={key} className="flex items-center justify-between gap-3 border border-border/20 p-1.5 rounded-sm bg-surface">
                <label className="text-[10px] font-black uppercase text-foreground-secondary">{item.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={currentTheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="w-16 border border-border bg-surface text-[9px] font-mono p-1 rounded-sm text-center focus:outline-none"
                  />
                  <input
                    type="color"
                    value={currentTheme[key]}
                    onChange={(e) => handleColorChange(key, e.target.value)}
                    className="h-7 w-7 border-2 border-border cursor-pointer p-0 bg-transparent rounded-sm shrink-0"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. TYPOGRAPHY */}
      <div className="space-y-3">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1">
          Typography
        </Heading>
        
        {/* Heading Font */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Headings Font</label>
          <select
            value={currentTheme.headingFont}
            onChange={(e) => updateTheme({ headingFont: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10 w-full"
          >
            {fontOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Body Font */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Body Text Font</label>
          <select
            value={currentTheme.bodyFont}
            onChange={(e) => updateTheme({ bodyFont: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10 w-full"
          >
            {fontOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {/* Font size, Line Height, Letter Spacing */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase text-foreground-secondary">Font Size</label>
            <select
              value={currentTheme.fontSize}
              onChange={(e) => updateTheme({ fontSize: e.target.value })}
              className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
            >
              {["9px", "10px", "11px", "12px", "13px"].map((sz) => <option key={sz} value={sz}>{sz}</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[9px] font-black uppercase text-foreground-secondary">Line Height</label>
            <select
              value={currentTheme.lineHeight}
              onChange={(e) => updateTheme({ lineHeight: e.target.value })}
              className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
            >
              <option value="tight">Tight</option>
              <option value="normal">Normal</option>
              <option value="relaxed">Relaxed</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 col-span-2">
            <label className="text-[9px] font-black uppercase text-foreground-secondary">Letter Spacing</label>
            <select
              value={currentTheme.letterSpacing}
              onChange={(e) => updateTheme({ letterSpacing: e.target.value })}
              className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
            >
              <option value="tracking-tight">Tight</option>
              <option value="tracking-normal">Normal</option>
              <option value="tracking-wide">Wide</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. LAYOUT OPTIONS */}
      <div className="space-y-3">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1">
          Layout Structure
        </Heading>

        {/* Grid Columns */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Column Split</label>
          <div className="grid grid-cols-2 gap-2">
            {[1, 2].map((col) => {
              const isActive = currentTheme.columns === col;
              return (
                <button
                  key={col}
                  type="button"
                  onClick={() => updateTheme({ columns: col as 1 | 2 })}
                  className={cn(
                    "py-1.5 border-2 text-[10px] font-black uppercase rounded-sm",
                    isActive ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary"
                  )}
                >
                  {col} Column{col > 1 ? "s" : ""}
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar position */}
        {currentTheme.columns === 2 && (
          <div className="space-y-1">
            <label className="text-[9px] font-black uppercase text-foreground-secondary">Sidebar Position</label>
            <div className="grid grid-cols-2 gap-2">
              {["left", "right"].map((pos) => {
                const isActive = currentTheme.sidebarPosition === pos;
                return (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateTheme({ sidebarPosition: pos as "left" | "right" })}
                    className={cn(
                      "py-1.5 border-2 text-[10px] font-black uppercase rounded-sm",
                      isActive ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary"
                    )}
                  >
                    {pos}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Width mode */}
        <div className="space-y-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Canvas Width</label>
          <div className="grid grid-cols-2 gap-2">
            {["compact", "wide"].map((w) => {
              const isActive = currentTheme.widthMode === w;
              return (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateTheme({ widthMode: w as "compact" | "wide" })}
                  className={cn(
                    "py-1.5 border-2 text-[10px] font-black uppercase rounded-sm",
                    isActive ? "bg-primary text-white border-foreground" : "bg-surface hover:bg-surface-secondary"
                  )}
                >
                  {w}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. SPACING CONTROLS */}
      <div className="space-y-3">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1">
          Margins & Spacing
        </Heading>

        {/* Margins */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Page Outer Margins</label>
          <select
            value={currentTheme.margins}
            onChange={(e) => updateTheme({ margins: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="p-4">Compact (p-4)</option>
            <option value="p-6">Normal (p-6)</option>
            <option value="p-8">Comfortable (p-8)</option>
            <option value="p-10">Wide (p-10)</option>
          </select>
        </div>

        {/* Section Spacing */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Section Gaps</label>
          <select
            value={currentTheme.sectionSpacing}
            onChange={(e) => updateTheme({ sectionSpacing: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="space-y-3">Compact (3)</option>
            <option value="space-y-5">Standard (5)</option>
            <option value="space-y-7">Spacious (7)</option>
          </select>
        </div>

        {/* Paragraph Spacing */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Paragraph Gaps</label>
          <select
            value={currentTheme.paragraphSpacing}
            onChange={(e) => updateTheme({ paragraphSpacing: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="space-y-1">Compact (1)</option>
            <option value="space-y-2">Standard (2)</option>
            <option value="space-y-3">Spacious (3)</option>
          </select>
        </div>

        {/* Item Spacing */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">List Entry Gaps</label>
          <select
            value={currentTheme.itemSpacing}
            onChange={(e) => updateTheme({ itemSpacing: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="space-y-1.5">Compact (1.5)</option>
            <option value="space-y-2.5">Standard (2.5)</option>
            <option value="space-y-3.5">Spacious (3.5)</option>
          </select>
        </div>
      </div>

      {/* 6. BORDER AND SHAPES */}
      <div className="space-y-3">
        <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-1">
          Borders & Styling
        </Heading>

        {/* Rounded Corners */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Corner Rounding</label>
          <select
            value={currentTheme.roundedCorners}
            onChange={(e) => updateTheme({ roundedCorners: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="rounded-none">Square (Brutalist)</option>
            <option value="rounded-sm">Subtle Rounded</option>
            <option value="rounded-md">Medium Rounded</option>
            <option value="rounded-lg">Pill Rounded</option>
          </select>
        </div>

        {/* Border Style */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Border Style</label>
          <select
            value={currentTheme.borderStyle}
            onChange={(e) => updateTheme({ borderStyle: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="border-none">No Border</option>
            <option value="border-2 border-solid">Solid Outline</option>
            <option value="border-2 border-dashed">Dashed Outline</option>
          </select>
        </div>

        {/* Divider Style */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Section Dividers</label>
          <select
            value={currentTheme.dividerStyle}
            onChange={(e) => updateTheme({ dividerStyle: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="divider-none">No Dividers</option>
            <option value="divider-solid">Solid Dividers</option>
            <option value="divider-dashed">Dashed Dividers</option>
          </select>
        </div>

        {/* Section Background */}
        <div className="flex flex-col gap-1">
          <label className="text-[9px] font-black uppercase text-foreground-secondary">Card Background</label>
          <select
            value={currentTheme.sectionBackground}
            onChange={(e) => updateTheme({ sectionBackground: e.target.value })}
            className="border-2 border-border bg-surface p-1.5 text-[10px] font-bold uppercase rounded-sm brutal-shadow-sm h-10"
          >
            <option value="bg-transparent">Transparent</option>
            <option value="bg-slate-50/50">Subtle Slate</option>
            <option value="bg-slate-100/50">Solid Slate tint</option>
          </select>
        </div>
      </div>

    </div>
  );
}
