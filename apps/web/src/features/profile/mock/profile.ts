export interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  headline: string;
  summary: string;
  preferredRole: string;
  preferredLocation: string;
  employmentType: string;
  completionPercent: number;
}

export const mockProfile: ProfileData = {
  firstName: "Anshul",
  lastName: "Kumar",
  email: "anshul@example.com",
  phone: "+91 98765 43210",
  location: "Bengaluru, India",
  headline: "Full Stack Developer | AI Enthusiast",
  summary:
    "Passionate software engineer with experience building scalable web applications and AI-powered products.",
  preferredRole: "Full Stack Developer",
  preferredLocation: "Bengaluru / Remote",
  employmentType: "FULL_TIME",
  completionPercent: 72,
};

export const mockSkills = [
  { id: "sk_1", name: "TypeScript", level: "Advanced" },
  { id: "sk_2", name: "Next.js", level: "Advanced" },
  { id: "sk_3", name: "NestJS", level: "Intermediate" },
  { id: "sk_4", name: "PostgreSQL", level: "Intermediate" },
];

export const mockEducation = [
  {
    id: "edu_1",
    institution: "ABC University",
    degree: "B.Tech",
    fieldOfStudy: "Computer Science",
    cgpa: "8.5",
  },
];

export const mockExperience = [
  {
    id: "exp_1",
    companyName: "Tech Corp",
    role: "Software Engineer Intern",
    description: "Built REST APIs and React dashboards.",
    duration: "Jun 2024 – Dec 2024",
  },
];

export const mockProjects = [
  {
    id: "proj_1",
    title: "AI Career Agent",
    description: "Premium AI-powered career operating system.",
    githubUrl: "https://github.com/example",
    liveUrl: "https://example.com",
  },
];
