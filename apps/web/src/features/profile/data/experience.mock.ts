/** Experience Module — Mock Data */

import type { Experience } from "../types/experience.types";

export const MOCK_EXPERIENCE: Experience[] = [
  {
    id: "exp_1",
    jobTitle: "Software Engineer Intern",
    companyName: "Tech Corp",
    employmentType: "internship",
    location: "Bengaluru, India",
    workMode: "hybrid",
    startDate: "2024-06-01",
    endDate: "2024-12-31",
    currentPosition: false,
    description: "Collaborated with the core platform team to build scalable microservices. Reduced database response time by 15% through query optimization and index configurations. Maintained unit test coverage above 85%.",
    technologiesUsed: ["Node.js", "Express", "PostgreSQL", "Jest", "Docker"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "exp_2",
    jobTitle: "Frontend Developer",
    companyName: "Creative Labs",
    employmentType: "contract",
    location: "Remote",
    workMode: "remote",
    startDate: "2023-09-01",
    endDate: "2024-05-15",
    currentPosition: false,
    description: "Designed and developed highly responsive marketing portals and dashboard tools utilizing Next.js and Tailwind CSS. Implemented accessible (a11y) components according to WCAG AA guidelines.",
    technologiesUsed: ["TypeScript", "Next.js", "Tailwind CSS", "Framer Motion", "Figma"],
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];

export const EMPLOYMENT_TYPE_LABELS: Record<string, string> = {
  "full-time": "Full-time",
  "part-time": "Part-time",
  internship: "Internship",
  contract: "Contract",
  freelance: "Freelance",
};

export const WORK_MODE_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};
