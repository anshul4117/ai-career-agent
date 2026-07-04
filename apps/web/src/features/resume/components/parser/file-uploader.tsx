"use client";

import React, { useState } from "react";
import { useParserStore } from "../../store/resume-parser.store";
import { resumeParserService } from "../../services/resume-parser.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Upload, FileText, AlertOctagon, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploaderProps {
  onStartParsing: (role: "engineer" | "frontend" | "backend" | "fullstack" | "analyst") => void;
}

export function FileUploader({ onStartParsing }: FileUploaderProps) {
  const { setUploadedFile, setError, error } = useParserStore();
  const [dragActive, setDragActive] = useState(false);
  const [rolePreset, setRolePreset] = useState<"engineer" | "frontend" | "backend" | "fullstack" | "analyst">("engineer");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    const validationError = resumeParserService.validateFile(file);
    if (validationError) {
      setError(validationError);
      setUploadedFile(null);
      return;
    }

    setError(null);
    setUploadedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto select-none">
      
      {/* Configuration Option: Choose Mock AI Role Preset */}
      <BrutalCard className="p-4 bg-primary/5 border-2 border-border brutal-shadow-xs space-y-3">
        <div className="flex items-center gap-1.5">
          <Sparkles className="h-4.5 w-4.5 text-primary shrink-0" />
          <Heading level="h4" className="text-xs font-black uppercase tracking-widest text-foreground">
            Mock AI Parsing Preset
          </Heading>
        </div>
        <p className="text-[10px] text-foreground-secondary leading-relaxed">
          Select a role profile to simulate parsing extraction values. The confidence engine will automatically rate fields accordingly.
        </p>
        <select
          value={rolePreset}
          onChange={(e) => setRolePreset(e.target.value as "engineer" | "frontend" | "backend" | "fullstack" | "analyst")}
          className="border-2 border-border bg-surface p-2 text-[10px] font-black uppercase rounded-sm brutal-shadow-xs h-10 w-full cursor-pointer focus:ring-0 focus:outline-none"
        >
          <option value="engineer">Senior Software Engineer (Go/AWS Systems)</option>
          <option value="frontend">Frontend Developer (React/TS Lead UI)</option>
          <option value="backend">Backend Developer (Node/Mongo Core API)</option>
          <option value="fullstack">Full Stack Developer (Next.js/Postgres Product)</option>
          <option value="analyst">Data Analyst (Python BI Analyst)</option>
        </select>
      </BrutalCard>

      {/* Drag Zone Container */}
      <div 
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-[3px] border-dashed border-border p-8 text-center bg-surface brutal-shadow transition-all relative rounded-sm flex flex-col items-center justify-center min-h-[250px]",
          dragActive && "border-primary bg-primary/5 scale-[0.99]"
        )}
      >
        <input 
          type="file" 
          id="resume-file-input" 
          onChange={handleFileChange} 
          accept=".pdf,.docx" 
          className="hidden" 
        />

        <div className="p-4 border-2 border-border bg-surface-secondary/40 brutal-shadow-xs mb-4 rounded-sm flex items-center justify-center">
          <Upload className="h-8 w-8 text-foreground-secondary" />
        </div>

        <Heading level="h3" className="text-sm font-black uppercase tracking-wider mb-2">
          Drag & Drop Resume File
        </Heading>

        <Text variant="muted" className="text-[10px] max-w-sm mb-4 leading-relaxed font-semibold">
          Accepts PDF and DOCX files. Maximum file limit is 5MB.
        </Text>

        <label 
          htmlFor="resume-file-input"
          className="h-9 px-4 border-2 border-border bg-surface hover:bg-surface-secondary font-black uppercase text-[10px] flex items-center justify-center cursor-pointer brutal-shadow-xs transition-transform active:translate-x-0 active:translate-y-0"
        >
          Browse Files
        </label>
      </div>

      {/* Error alert wrapper */}
      {error && (
        <div className="bg-error/10 border-2 border-error p-3 text-error text-[10px] font-black uppercase brutal-shadow-xs flex items-center gap-2 rounded-sm" role="alert">
          <AlertOctagon className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Start Parsing Trigger (Visible only if file is loaded and valid) */}
      <BrutalButton
        onClick={() => onStartParsing(rolePreset)}
        className="w-full h-11 text-xs font-black uppercase brutal-shadow"
      >
        <FileText className="h-4 w-4 mr-2" /> Start AI Parsing Workflow
      </BrutalButton>

    </div>
  );
}
