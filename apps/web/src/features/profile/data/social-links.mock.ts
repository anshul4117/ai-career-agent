/** Social Links Module — Mock Data */

import type { SocialLink, SocialPlatform } from "../types/social-link.types";

export const MOCK_SOCIAL_LINKS: SocialLink[] = [
  {
    id: "soc_1",
    platform: "github",
    url: "https://github.com/anshulkumar",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "soc_2",
    platform: "linkedin",
    url: "https://linkedin.com/in/anshulkumar",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "soc_3",
    platform: "portfolio",
    url: "https://anshul.dev",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];

export const SOCIAL_PLATFORM_LABELS: Record<SocialPlatform, string> = {
  github: "GitHub",
  linkedin: "LinkedIn",
  portfolio: "Portfolio Portfolio",
  website: "Personal Website",
  twitter: "Twitter / X",
  leetcode: "LeetCode",
  hackerrank: "HackerRank",
  codeforces: "Codeforces",
  stackoverflow: "Stack Overflow",
};
