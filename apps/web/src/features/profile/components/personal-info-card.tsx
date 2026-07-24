"use client";

import React from "react";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Github,
  Linkedin,
} from "lucide-react";
import { ProfileAvatar } from "./profile-avatar";
import type { Profile } from "../types/profile.types";
import type { SocialLink } from "../types/social-link.types";

interface PersonalInfoCardProps {
  profile: Profile;
  socialLinks: SocialLink[];
}

function InfoRow({
  icon: Icon,
  label,
  value,
  isUrl = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | null | undefined;
  isUrl?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b-2 border-border/10 py-2.5 last:border-0">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="h-4 w-4 text-primary shrink-0" />
        <span className="text-foreground-muted text-[10px] uppercase font-bold tracking-wider truncate">
          {label}
        </span>
      </div>
      <span className="text-right text-xs font-semibold text-foreground truncate max-w-[180px]">
        {value ? (
          isUrl ? (
            <a
              href={value.startsWith("http") ? value : `https://${value}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-mono"
            >
              {value.replace(/(^\w+:|^)\/\//, "")}
            </a>
          ) : (
            value
          )
        ) : (
          "—"
        )}
      </span>
    </div>
  );
}

export function PersonalInfoCard({
  profile,
  socialLinks,
}: PersonalInfoCardProps) {
  const { personal, contact, career, avatar } = profile;
  const fullName = `${personal.firstName} ${personal.lastName}`;

  const githubUrl = socialLinks.find((link) => link.platform === "github")?.url;
  const linkedinUrl = socialLinks.find(
    (link) => link.platform === "linkedin",
  )?.url;
  const portfolioUrl = socialLinks.find(
    (link) => link.platform === "portfolio",
  )?.url;

  return (
    <BrutalCard className="bg-surface border-[3px] border-border p-6 brutal-shadow w-full min-w-0">
      <div className="space-y-6">
        {/* Header */}
        <Heading
          level="h4"
          className="text-base font-black uppercase tracking-tight flex items-center gap-2"
        >
          <User className="h-5 w-5 text-primary" aria-hidden="true" />
          Personal Information
        </Heading>

        {/* Profile Card Header with Photo, Name & Headline */}
        <div className="flex items-center gap-4 border-2 border-border p-4 bg-surface-secondary brutal-shadow-sm">
          <ProfileAvatar
            url={avatar.url}
            initials={avatar.initials}
            size="md"
            className="shrink-0"
          />
          <div className="min-w-0">
            <h5 className="font-extrabold text-sm text-foreground truncate uppercase tracking-tight">
              {fullName}
            </h5>
            <Text className="text-foreground-secondary text-xs truncate font-medium">
              {career.headline || "No headline added"}
            </Text>
          </div>
        </div>

        {/* Info Rows */}
        <div>
          <InfoRow icon={Mail} label="Email" value={contact.email} />
          <InfoRow icon={Phone} label="Phone" value={contact.phone} />
          <InfoRow
            icon={MapPin}
            label="Location"
            value={`${contact.city}, ${contact.country}`}
          />
          <InfoRow
            icon={Globe}
            label="Portfolio"
            value={portfolioUrl}
            isUrl={true}
          />
          <InfoRow
            icon={Github}
            label="GitHub"
            value={githubUrl}
            isUrl={true}
          />
          <InfoRow
            icon={Linkedin}
            label="LinkedIn"
            value={linkedinUrl}
            isUrl={true}
          />
        </div>
      </div>
    </BrutalCard>
  );
}
