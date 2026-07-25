/** Skills Module — Mock Data */

import type { Skill } from "../types/skill.types";

export const MOCK_SKILLS: Skill[] = [
  {
    id: "sk_1",
    name: "TypeScript",
    category: "Programming Language",
    level: "expert",
    yearsOfExperience: 4,
    featured: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_2",
    name: "React & Next.js",
    category: "Frontend",
    level: "expert",
    yearsOfExperience: 3,
    featured: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_3",
    name: "Node.js & Express",
    category: "Backend",
    level: "advanced",
    yearsOfExperience: 3,
    featured: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_4",
    name: "PostgreSQL & Prisma",
    category: "Database",
    level: "advanced",
    yearsOfExperience: 2,
    featured: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_5",
    name: "Docker & Containerization",
    category: "Cloud",
    level: "intermediate",
    yearsOfExperience: 1,
    featured: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_6",
    name: "Tailwind CSS",
    category: "Frontend",
    level: "expert",
    yearsOfExperience: 3,
    featured: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "sk_7",
    name: "Git & GitHub Actions",
    category: "DevOps",
    level: "advanced",
    yearsOfExperience: 3,
    featured: false,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];

export const SKILL_LEVEL_LABELS: Record<string, string> = {
  beginner: "Beginner",
  intermediate: "Intermediate",
  advanced: "Advanced",
  expert: "Expert",
};

export const SKILL_CATEGORIES = [
  "Frontend",
  "Backend",
  "Database",
  "DevOps",
  "Cloud",
  "Mobile",
  "Programming Language",
  "Testing",
  "AI",
  "Other",
];
