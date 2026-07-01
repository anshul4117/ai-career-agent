"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  url: string | null;
  initials: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-16 w-16 text-lg",
  lg: "h-24 w-24 text-2xl",
};

export function ProfileAvatar({ url, initials, size = "lg", className }: ProfileAvatarProps) {
  return (
    <div
      className={cn(
        "relative shrink-0 border-[3px] border-border bg-surface-secondary flex items-center justify-center font-black uppercase select-none brutal-shadow rounded-sm overflow-hidden",
        sizeClasses[size],
        className,
      )}
      role="img"
      aria-label={`Avatar for ${initials}`}
    >
      {url ? (
        <Image src={url} alt="Profile avatar" fill unoptimized className="object-cover" />
      ) : (
        <span className="text-foreground">{initials}</span>
      )}
    </div>
  );
}
