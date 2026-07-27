/** Projects Module — Type Definitions */

export type ProjectCategory =
  | "Web"
  | "Mobile"
  | "AI"
  | "Backend"
  | "Full Stack"
  | "DevOps"
  | "Open Source"
  | "Other";

export interface Project {
  id: string;
  title: string;
  shortDescription?: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  imageUrl: string | null;
  teamSize?: number;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD, null if ongoing/currentlyWorking is true
  currentlyWorking?: boolean;
  featured: boolean;
  category?: ProjectCategory;
  createdAt: string;
  updatedAt: string;
}
