import type { EmploymentType } from "@/types";

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  employmentType: EmploymentType;
  postedAt: string;
  matchScore: number;
  qualityScore: number;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  remoteAllowed: boolean;
  applyUrl: string;
}

export const mockJobs: Job[] = [
  {
    id: "job_001",
    title: "Backend Engineer",
    company: "Linear Labs",
    location: "Bengaluru, India",
    employmentType: "FULL_TIME",
    postedAt: "2025-06-20",
    matchScore: 92,
    qualityScore: 88,
    description:
      "Build scalable APIs and services for a high-growth AI product. Work with NestJS, PostgreSQL, and Redis.",
    requiredSkills: ["Node.js", "TypeScript", "PostgreSQL", "REST APIs"],
    preferredSkills: ["NestJS", "Redis", "BullMQ"],
    remoteAllowed: true,
    applyUrl: "https://example.com/jobs/backend-engineer",
  },
  {
    id: "job_002",
    title: "Full Stack Developer",
    company: "Vercel Startup",
    location: "Remote",
    employmentType: "REMOTE",
    postedAt: "2025-06-18",
    matchScore: 85,
    qualityScore: 91,
    description:
      "Own features end-to-end across Next.js frontend and NestJS backend in a quality-first job platform.",
    requiredSkills: ["Next.js", "React", "TypeScript", "Node.js"],
    preferredSkills: ["Tailwind CSS", "Prisma", "AI Integrations"],
    remoteAllowed: true,
    applyUrl: "https://example.com/jobs/full-stack",
  },
  {
    id: "job_003",
    title: "Software Engineering Intern",
    company: "YC Startup",
    location: "Hyderabad, India",
    employmentType: "INTERNSHIP",
    postedAt: "2025-06-15",
    matchScore: 78,
    qualityScore: 82,
    description:
      "Join a small team building AI-powered career tools. Ideal for B.Tech/M.Tech students.",
    requiredSkills: ["JavaScript", "Python", "Git"],
    preferredSkills: ["React", "OpenAI API"],
    remoteAllowed: false,
    applyUrl: "https://example.com/jobs/intern",
  },
  {
    id: "job_004",
    title: "Frontend Engineer",
    company: "Notion-inspired Co",
    location: "Pune, India",
    employmentType: "HYBRID",
    postedAt: "2025-06-12",
    matchScore: 55,
    qualityScore: 76,
    description:
      "Craft premium UI experiences with strong typography, accessibility, and performance focus.",
    requiredSkills: ["React", "TypeScript", "CSS"],
    preferredSkills: ["Next.js", "Design Systems", "shadcn/ui"],
    remoteAllowed: false,
    applyUrl: "https://example.com/jobs/frontend",
  },
];

export function getJobById(id: string): Job | undefined {
  return mockJobs.find((job) => job.id === id);
}
