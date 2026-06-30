"use client";

import React, { useState } from "react";
import {
  Github,
  Linkedin,
  Globe,
  Twitter,
  Code2,
  Trophy,
  Copy,
  Check,
  Pencil,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/typography";
import type { SocialLink, SocialPlatform } from "../types/social-link.types";
import { SOCIAL_PLATFORM_LABELS } from "../data/social-links.mock";

interface SocialLinkItemProps {
  link: SocialLink;
  onEdit: (link: SocialLink) => void;
  onDelete: (id: string) => void;
}

const PLATFORM_ICONS: Record<SocialPlatform, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  portfolio: Globe,
  website: Globe,
  twitter: Twitter,
  leetcode: Code2,
  hackerrank: Trophy,
  codeforces: Trophy,
  stackoverflow: Globe,
};

export function SocialLinkItem({ link, onEdit, onDelete }: SocialLinkItemProps) {
  const [copied, setCopied] = useState(false);
  const Icon = PLATFORM_ICONS[link.platform] || Globe;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link: ", err);
    }
  };

  return (
    <div className="flex items-center justify-between border-2 border-border bg-surface p-4 brutal-shadow-sm transition-all hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow w-full min-w-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="h-10 w-10 border-2 border-border bg-primary/10 text-primary flex items-center justify-center brutal-shadow-sm rounded-sm shrink-0">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>

        <div className="space-y-0.5 min-w-0">
          <Heading level="h4" className="text-sm font-black uppercase tracking-tight truncate">
            {SOCIAL_PLATFORM_LABELS[link.platform] || link.platform}
          </Heading>
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-foreground-secondary hover:text-primary hover:underline truncate flex items-center gap-1 min-w-0 block"
            aria-label={`Open ${SOCIAL_PLATFORM_LABELS[link.platform]}`}
          >
            <span className="truncate max-w-[200px] sm:max-w-xs">{link.url}</span>
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        </div>
      </div>

      <div className="flex items-center gap-1.5 ml-4 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          aria-label={`Copy link for ${SOCIAL_PLATFORM_LABELS[link.platform]}`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          {copied ? (
            <Check className="h-3.5 w-3.5 text-success" />
          ) : (
            <Copy className="h-3.5 w-3.5" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(link)}
          aria-label={`Edit ${SOCIAL_PLATFORM_LABELS[link.platform]} link`}
          className="h-8 w-8 hover:bg-surface-secondary border-2 border-transparent hover:border-border rounded-sm"
        >
          <Pencil className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(link.id)}
          aria-label={`Delete ${SOCIAL_PLATFORM_LABELS[link.platform]} link`}
          className="h-8 w-8 text-error hover:bg-error/10 border-2 border-transparent hover:border-error rounded-sm"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}
