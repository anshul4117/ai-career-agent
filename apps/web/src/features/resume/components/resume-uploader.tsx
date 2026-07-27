"use client";

import React, { useState, useRef } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Upload, AlertOctagon, RefreshCw } from "lucide-react";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

interface ResumeUploaderProps {
  onUpload: (file: File) => Promise<void>;
  existingNames: string[];
}

const allowedExtensions = ["pdf", "doc", "docx"];
const maxSizeBytes = 5 * 1024 * 1024; // 5MB

const resumeUploadSchema = (existingNames: string[]) =>
  z
    .custom<File>((val) => val instanceof File, "File is required")
    .refine((file) => {
      const ext = file.name.split(".").pop()?.toLowerCase();
      return allowedExtensions.includes(ext || "");
    }, "Only PDF, DOC, and DOCX files are allowed")
    .refine((file) => {
      return file.size <= maxSizeBytes;
    }, "File size must be 5 MB or less")
    .refine((file) => {
      const isDuplicate = existingNames.some(
        (name) => name.toLowerCase().trim() === file.name.toLowerCase().trim(),
      );
      return !isDuplicate;
    }, "A resume with this filename has already been uploaded");

export function ResumeUploader({
  onUpload,
  existingNames,
}: ResumeUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = async (file: File) => {
    const validator = resumeUploadSchema(existingNames);
    const result = validator.safeParse(file);

    if (!result.success) {
      const errorMsg =
        result.error.errors[0]?.message || "Invalid file selection";
      setValidationError(errorMsg);
      toast.error(errorMsg);
      return;
    }

    setValidationError(null);
    setIsUploading(true);
    const uploadToastId = toast.loading("Uploading resume file...");

    try {
      await onUpload(file);
      toast.success("Resume uploaded successfully!", { id: uploadToastId });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch {
      toast.error("Failed to upload resume. Please try again.", {
        id: uploadToastId,
      });
    } finally {
      setIsUploading(false);
    }
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
    <div className="space-y-4 max-w-xl mx-auto select-none">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "border-[3px] border-dashed border-border p-8 text-center bg-surface brutal-shadow transition-all relative rounded-sm flex flex-col items-center justify-center min-h-[220px]",
          dragActive && "border-primary bg-primary/5 scale-[0.99]",
          isUploading && "opacity-80 pointer-events-none",
        )}
      >
        <input
          type="file"
          id="resume-upload-input"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          disabled={isUploading}
        />

        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="h-12 w-12 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
            {isUploading ? (
              <RefreshCw className="h-6 w-6 animate-spin" />
            ) : (
              <Upload className="h-6 w-6" aria-hidden="true" />
            )}
          </div>

          <div className="space-y-1">
            <Heading
              level="h4"
              className="text-sm font-black uppercase tracking-widest text-foreground"
            >
              {isUploading ? "Uploading Resume..." : "Upload Your Resume"}
            </Heading>
            <Text className="text-foreground-secondary text-xs">
              {dragActive
                ? "Drop file here to start..."
                : "Drag & drop your file here, or click below to browse"}
            </Text>
            <p className="text-[10px] text-foreground-muted font-mono pt-1">
              Supports PDF, DOC, DOCX up to 5 MB
            </p>
          </div>

          {!isUploading && (
            <BrutalButton
              onClick={() => fileInputRef.current?.click()}
              className="h-9 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
            >
              Select File
            </BrutalButton>
          )}
        </div>
      </div>

      {validationError && (
        <div className="flex items-center gap-2 border-2 border-error bg-error/5 text-error p-3 brutal-shadow-sm rounded-sm">
          <AlertOctagon className="h-4 w-4 shrink-0" />
          <p className="text-xs font-bold font-mono leading-none">
            {validationError}
          </p>
        </div>
      )}
    </div>
  );
}
