/** Experience Module — Type Definitions */

export type EmploymentType = "full-time" | "part-time" | "internship" | "contract" | "freelance";
export type WorkMode = "remote" | "hybrid" | "onsite";

export interface Experience {
  id: string;
  jobTitle: string;
  companyName: string;
  employmentType: EmploymentType;
  location: string;
  workMode: WorkMode;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD, null if currentPosition is true
  currentPosition: boolean;
  description: string;
  technologiesUsed: string[]; // e.g. ["TypeScript", "Next.js"]
  createdAt: string;
  updatedAt: string;
}
