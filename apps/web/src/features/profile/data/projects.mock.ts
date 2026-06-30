/** Projects Module — Mock Data */

import type { Project } from "../types/project.types";

export const MOCK_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "AI Career Agent",
    description: "A premium AI-powered career operating system offering instant ATS resume reviews, automated cover letters, and a Kanban tracking board for applications.",
    techStack: ["TypeScript", "Next.js", "Zustand", "Tailwind CSS", "Zod", "Lucide React"],
    githubUrl: "https://github.com/example/ai-career-agent",
    liveDemoUrl: "https://ai-career-agent.vercel.app",
    imageUrl: null,
    teamSize: 1,
    role: "Lead Full Stack Engineer",
    startDate: "2026-01-01",
    endDate: null,
    featured: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "proj_2",
    title: "Brutalist Task Manager",
    description: "An offline-first task tracker featuring bold brutalist styling, keybinding shortcuts, CSV imports, and calendar timeline integrations.",
    techStack: ["JavaScript", "React", "Redux", "LocalStorage", "Vanilla CSS"],
    githubUrl: "https://github.com/example/brutalist-tasks",
    liveDemoUrl: "https://brutalist-tasks.net",
    imageUrl: null,
    teamSize: 2,
    role: "UI/UX Developer",
    startDate: "2025-06-15",
    endDate: "2025-08-30",
    featured: true,
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];
