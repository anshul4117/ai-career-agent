"use client";

import React from "react";
import Link from "next/link";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ProfileAvatar } from "./profile-avatar";
import { MapPin, Pencil } from "lucide-react";
import type { Profile } from "../types/profile.types";
import { AVAILABILITY_LABELS } from "../data/profile.mock";

interface ProfileHeaderProps {
  profile: Profile;
}

export function ProfileHeader({ profile }: ProfileHeaderProps) {
  const { avatar, personal, career, contact, availability } = profile;
  const fullName = `${personal.firstName} ${personal.lastName}`;
  const availabilityInfo = AVAILABILITY_LABELS[availability];

  return (
    <div className="bg-surface border-[3px] border-border p-5 md:p-6 brutal-shadow w-full min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-start gap-5">
        <ProfileAvatar url={avatar.url} initials={avatar.initials} size="lg" />

        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="space-y-1">
              <Heading level="h2" className="text-2xl md:text-3xl font-black uppercase tracking-tight">
                {fullName}
              </Heading>
              <Text className="text-foreground-secondary text-sm font-medium">
                {career.headline}
              </Text>
            </div>
            <BrutalButton asChild variant="secondary" className="h-10 px-4 uppercase font-bold text-xs tracking-wider shrink-0 self-start">
              <Link href="/profile/edit" aria-label="Edit profile">
                <Pencil className="h-4 w-4 mr-1.5" />
                Edit Profile
              </Link>
            </BrutalButton>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-foreground-secondary">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {contact.city}, {contact.country}
            </span>
            <span
              className={`px-2 py-0.5 border-2 border-border font-black uppercase text-[10px] brutal-shadow-sm ${
                availabilityInfo.color === "success"
                  ? "bg-success text-white"
                  : availabilityInfo.color === "warning"
                  ? "bg-warning text-white"
                  : "bg-error text-white"
              }`}
            >
              {availabilityInfo.label}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
