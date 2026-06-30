/** Social Links Module — Zod Validation Schemas */

import { z } from "zod";

export const socialLinkSchema = z.object({
  platform: z.enum(
    [
      "github",
      "linkedin",
      "portfolio",
      "website",
      "twitter",
      "leetcode",
      "hackerrank",
      "codeforces",
      "stackoverflow",
    ],
    {
      errorMap: () => ({ message: "Please select a supported platform" }),
    }
  ),
  url: z
    .string()
    .min(1, "Link URL is required")
    .url("Invalid URL format. Please include http:// or https://")
    .trim(),
});

export type SocialLinkFormValues = z.infer<typeof socialLinkSchema>;
