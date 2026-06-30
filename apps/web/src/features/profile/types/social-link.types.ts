/** Social Links Module — Type Definitions */

export type SocialPlatform =
  | "github"
  | "linkedin"
  | "portfolio"
  | "website"
  | "twitter"
  | "leetcode"
  | "hackerrank"
  | "codeforces"
  | "stackoverflow";

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  createdAt: string;
  updatedAt: string;
}
