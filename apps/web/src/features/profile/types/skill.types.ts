/** Skills Module — Type Definitions */

export type SkillLevel = "beginner" | "intermediate" | "advanced" | "expert";

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: SkillLevel;
  yearsOfExperience: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
