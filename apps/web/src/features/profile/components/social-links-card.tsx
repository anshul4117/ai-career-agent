"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { Share2 } from "lucide-react";
import type { SocialLink } from "../types/social-link.types";
import { SOCIAL_PLATFORM_LABELS } from "../data/social-links.mock";

interface SocialLinksCardProps {
  socialLinks: SocialLink[];
}

export function SocialLinksCard({ socialLinks }: SocialLinksCardProps) {
  const previewLinks = [...socialLinks].slice(0, 4);

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <Heading level="h4" className="text-base font-black uppercase tracking-tight flex items-center gap-2">
            <Share2 className="h-5 w-5 text-primary" aria-hidden="true" />
            Social Links
          </Heading>
        </div>

        {/* List Preview */}
        {socialLinks.length === 0 ? (
          <div className="py-6 text-center space-y-2">
            <Text className="text-foreground-secondary text-xs">
              No social links added yet. Connect your profiles.
            </Text>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2.5 pt-2">
            {previewLinks.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 border-2 border-border bg-surface-secondary px-2.5 py-1.5 brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] transition-transform duration-100"
              >
                <span className="font-extrabold text-xs text-foreground uppercase tracking-tight">
                  {SOCIAL_PLATFORM_LABELS[link.platform] || link.platform}
                </span>
              </a>
            ))}
          </div>
        )}
      </div>
    </BrutalCard>
  );
}
