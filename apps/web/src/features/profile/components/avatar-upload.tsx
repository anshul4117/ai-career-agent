"use client";

import React, { useRef, useState } from "react";
import { Upload, Trash2, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/typography";
import { ProfileAvatar } from "./profile-avatar";
import { useProfileStore } from "../store/profile.store";
import { InlineLoader } from "@/components/ui/brand-loader";

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function AvatarUpload() {
  const { profile, uploadAvatar, removeAvatar } = useProfileStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  if (!profile) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate type
    if (!ALLOWED_TYPES.includes(file.type)) {
      setError("Only JPG, JPEG, and PNG images are allowed.");
      return;
    }

    // Validate size
    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds 2MB limit.");
      return;
    }

    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadAvatar(reader.result as string);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }, 600);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex flex-col sm:flex-row items-center gap-5 p-4 border-2 border-border bg-surface-secondary brutal-shadow-sm rounded-sm">
      <div className="relative group shrink-0">
        <ProfileAvatar url={profile.avatar.url} initials={profile.avatar.initials} size="lg" />
        <div 
          onClick={handleUploadClick}
          className="absolute inset-0 bg-foreground/60 flex items-center justify-center text-surface opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-150 rounded-sm"
          role="button"
          aria-label="Upload new avatar"
        >
          <Camera className="h-6 w-6" />
        </div>
      </div>

      <div className="flex-1 space-y-2 text-center sm:text-left min-w-0">
        <Text className="font-extrabold uppercase text-xs tracking-wider text-foreground">
          Profile Photo
        </Text>
        <Text className="text-foreground-secondary text-xs leading-relaxed">
          Upload a high-resolution JPG or PNG. Max size 2MB.
        </Text>

        <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".png,.jpg,.jpeg"
            className="hidden"
            aria-label="Upload profile image file"
          />
          
          <Button
            variant="ghost"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="h-8 text-xs font-bold border-2 border-border hover:bg-surface rounded-sm uppercase tracking-wider flex items-center gap-1 bg-surface"
          >
            {isUploading ? (
              <InlineLoader />
            ) : (
              <Upload className="h-3.5 w-3.5" />
            )}
            {profile.avatar.url ? "Replace" : "Upload Image"}
          </Button>

          {profile.avatar.url && (
            <Button
              variant="ghost"
              onClick={removeAvatar}
              disabled={isUploading}
              className="h-8 text-xs font-bold border-2 border-transparent text-error hover:bg-error/10 hover:border-error rounded-sm uppercase tracking-wider flex items-center gap-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Remove
            </Button>
          )}
        </div>

        {error && (
          <Text className="text-xs text-error font-semibold pt-1" role="alert">
            {error}
          </Text>
        )}
        
        {/* Crop Support Placeholder */}
        <p className="text-[10px] text-foreground-muted font-bold uppercase tracking-widest pt-1">
          * Drag photo overlay to crop (Placeholder)
        </p>
      </div>
    </div>
  );
}
