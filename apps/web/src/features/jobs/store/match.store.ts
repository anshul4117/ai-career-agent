"use client";

import { create } from "zustand";
import type { Job } from "../types/jobs.types";
import { mockJobs } from "../mock/jobs-data";
import { useResumeStore } from "@/features/resume/store/resume.store";
import {
  matchEngineService,
  type MatchReport,
} from "../services/match-engine.service";
import type { Skill } from "@/features/profile/types/skill.types";
import type { Education } from "@/features/profile/types/education.types";
import type { CareerPreference } from "@/features/profile/types/career-preference.types";
import type { Profile } from "@/features/profile/types/profile.types";
import { toast } from "sonner";

export interface AnalysisRecord {
  id: string;
  date: string;
  resumeId: string;
  resumeName: string;
  resumeVersion: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  matchScore: number;
  status: "Excellent" | "Good" | "Average" | "Poor";

  // Breakdown
  atsCompatibility: number;
  skillsScore: number;
  experienceScore: number;
  educationScore: number;
  certificationsScore: number;
  projectsScore: number;
  atsKeywordsScore: number;

  missingTechSkills: {
    name: string;
    priority: "High" | "Medium" | "Low";
    desc: string;
  }[];
  missingSoftSkills: {
    name: string;
    priority: "High" | "Medium" | "Low";
    desc: string;
  }[];

  resumeImprovements: string[];
  suggestedProjects: string[];
  suggestedCertifications: string[];
  portfolioImprovements: string[];
  experienceImprovements: string[];
  resumeKeywordSuggestions: string[];

  foundKeywords: string[];
  missingKeywords: string[];
  keywordDensity: number;
  importantAtsKeywords: string[];

  strengths: string[];
  weaknesses: string[];

  gapAnalysis: {
    label: string;
    requirement: string;
    resumeValue: string;
    status: "matched" | "partially" | "missing";
  }[];

  courses: string[];
  practiceProjects: string[];
}

interface MatchState {
  matches: Record<string, MatchReport>;
  loading: Record<string, boolean>;
  errors: Record<string, string>;

  history: AnalysisRecord[];
  activeAnalysis: AnalysisRecord | null;
  loadingHistory: boolean;
  loadingAnalysis: boolean;

  calculateMatch: (
    job: Job,
    profileState: {
      skills: Skill[];
      education: Education[];
      preferences: CareerPreference | null;
      profile: Profile | null;
    },
    qualityScore: number,
    force?: boolean,
  ) => Promise<void>;
  analyzeMatch: (resumeId: string, jobId: string) => Promise<void>;
  getMatchHistory: () => Promise<void>;
  refreshAnalysis: (analysisId: string) => Promise<void>;
  saveAnalysis: (analysis: AnalysisRecord) => Promise<void>;
  deleteAnalysis: (analysisId: string) => Promise<void>;
}

const initialHistory: AnalysisRecord[] = [
  {
    id: "match-1",
    date: "2026-07-27T10:00:00Z",
    resumeId: "res_001",
    resumeName: "anshul-kumar-resume-v2.pdf",
    resumeVersion: "v2.0",
    jobId: "job-1",
    jobTitle: "Senior Frontend Engineer",
    companyName: "TechCorp",
    matchScore: 92,
    status: "Excellent",
    atsCompatibility: 94,
    skillsScore: 90,
    experienceScore: 95,
    educationScore: 100,
    certificationsScore: 80,
    projectsScore: 90,
    atsKeywordsScore: 92,
    missingTechSkills: [
      {
        name: "GraphQL",
        priority: "Medium",
        desc: "Data queries and mutation schema optimizations.",
      },
      {
        name: "NextJS ISR",
        priority: "Low",
        desc: "Incremental Static Regeneration configurations.",
      },
    ],
    missingSoftSkills: [
      {
        name: "Technical Mentorship",
        priority: "Low",
        desc: "Mentoring junior and associate engineers.",
      },
    ],
    resumeImprovements: [
      "Quantify impact in TechCorp role: e.g., 'Reduced page load speed by 25%'.",
      "Format bullet points using the Google X-Y-Z formula.",
    ],
    suggestedProjects: ["Build a GraphQL wrapper for headless CMS products."],
    suggestedCertifications: ["AWS Certified Solutions Architect"],
    portfolioImprovements: [
      "Add interactive WebGL/Framer Motion demos directly on the homepage.",
    ],
    experienceImprovements: [
      "Add context about cross-functional collaboration with product design.",
    ],
    resumeKeywordSuggestions: [
      "Apollo Client",
      "Server-Side Rendering",
      "Micro-frontends",
    ],
    foundKeywords: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Zustand",
      "Next.js",
    ],
    missingKeywords: ["GraphQL", "Micro-frontends", "Apollo Client"],
    keywordDensity: 3.4,
    importantAtsKeywords: [
      "React",
      "TypeScript",
      "Next.js",
      "GraphQL",
      "Tailwind CSS",
    ],
    strengths: [
      "8+ years of production experience in frontend React stacks.",
      "Extensive knowledge of responsive brutalist design implementations.",
      "Clear track record of building accessible components (A11y).",
    ],
    weaknesses: [
      "No direct production references for GraphQL integrations.",
      "Missing active AWS or cloud infrastructure certifications.",
    ],
    gapAnalysis: [
      {
        label: "Frontend Stack",
        requirement: "React 19, Next.js 15, TypeScript",
        resumeValue: "React, Next.js, TS Lead",
        status: "matched",
      },
      {
        label: "Years of Experience",
        requirement: "5+ years required",
        resumeValue: "8 years of experience",
        status: "matched",
      },
      {
        label: "Data Query API",
        requirement: "GraphQL, Apollo Client",
        resumeValue: "REST API, Fetch Client",
        status: "partially",
      },
    ],
    courses: [
      "GraphQL Deep Dive - Frontend Masters",
      "Next.js App Router Masterclass - Vercel",
    ],
    practiceProjects: ["Server-side rendered GraphQL micro-blog portal"],
  },
  {
    id: "match-2",
    date: "2026-07-26T15:30:00Z",
    resumeId: "res_001",
    resumeName: "anshul-kumar-resume-v2.pdf",
    resumeVersion: "v2.0",
    jobId: "job-2",
    jobTitle: "Senior Full Stack Developer",
    companyName: "SaaSify",
    matchScore: 68,
    status: "Average",
    atsCompatibility: 70,
    skillsScore: 60,
    experienceScore: 75,
    educationScore: 90,
    certificationsScore: 50,
    projectsScore: 70,
    atsKeywordsScore: 65,
    missingTechSkills: [
      {
        name: "NodeJS",
        priority: "High",
        desc: "Core server-side scripting runtime.",
      },
      {
        name: "PostgreSQL",
        priority: "High",
        desc: "Relational database architecture.",
      },
      {
        name: "Redis",
        priority: "Medium",
        desc: "Caching layers and memory store optimization.",
      },
    ],
    missingSoftSkills: [
      {
        name: "Product Engineering mindset",
        priority: "Medium",
        desc: "Owning feature life cycles from concept to user feedback.",
      },
    ],
    resumeImprovements: [
      "Add Node/Express service building details.",
      "State database schema design experience.",
    ],
    suggestedProjects: [
      "Build a REST API backend with Node, Express, PostgreSQL, and Redis caching.",
    ],
    suggestedCertifications: [
      "Node.js Application Developer Certification (JSNAD)",
    ],
    portfolioImprovements: [
      "Host live full-stack projects with public Swagger documentation.",
    ],
    experienceImprovements: [
      "Include deployment pipelines (Docker/CI) managed personally.",
    ],
    resumeKeywordSuggestions: [
      "Express",
      "RESTful APIs",
      "Relational Database",
      "Redis Cache",
    ],
    foundKeywords: ["React", "TypeScript", "Tailwind CSS"],
    missingKeywords: ["Node.js", "PostgreSQL", "Redis", "Docker"],
    keywordDensity: 1.8,
    importantAtsKeywords: [
      "React",
      "Node.js",
      "PostgreSQL",
      "Docker",
      "REST API",
    ],
    strengths: [
      "Strong React/Next.js frontend expertise.",
      "Clear CSS modular architectures knowledge.",
    ],
    weaknesses: [
      "Weak backend service experience listed on resume.",
      "No PostgreSQL relational database metrics.",
    ],
    gapAnalysis: [
      {
        label: "Backend Runtime",
        requirement: "Node.js (Express/Nest)",
        resumeValue: "Minimal client scripts",
        status: "missing",
      },
      {
        label: "Relational DB",
        requirement: "PostgreSQL",
        resumeValue: "None listed",
        status: "missing",
      },
      {
        label: "Frontend",
        requirement: "React, Tailwind",
        resumeValue: "Expert developer",
        status: "matched",
      },
    ],
    courses: [
      "Fullstack Web Development with Node & Postgres - Udemy",
      "Redis Developer Course - Redis University",
    ],
    practiceProjects: ["Redis-cached PostgreSQL relational analytics API"],
  },
];

export const useMatchStore = create<MatchState>((set, get) => ({
  matches: {},
  loading: {},
  errors: {},

  history: initialHistory,
  activeAnalysis: null,
  loadingHistory: false,
  loadingAnalysis: false,

  calculateMatch: async (job, profileState, qualityScore, force = false) => {
    const id = job.id;
    if (!force && get().matches[id]) return;

    set((state) => ({
      loading: { ...state.loading, [id]: true },
      errors: { ...state.errors, [id]: "" },
    }));

    try {
      // Simulate evaluation latency (400ms) for high fidelity feedback
      await new Promise((resolve) => setTimeout(resolve, 400));

      const yearsOfExp = profileState.profile?.career?.yearsOfExperience || 0;

      const report = matchEngineService.calculateOverallMatch(
        profileState.skills,
        profileState.education,
        profileState.preferences,
        yearsOfExp,
        job,
        qualityScore,
      );

      set((state) => ({
        matches: { ...state.matches, [id]: report },
        loading: { ...state.loading, [id]: false },
      }));
    } catch {
      set((state) => ({
        loading: { ...state.loading, [id]: false },
        errors: {
          ...state.errors,
          [id]: "Failed to perform AI match calculations.",
        },
      }));
    }
  },

  analyzeMatch: async (resumeId, jobId) => {
    set({ loadingAnalysis: true, activeAnalysis: null });

    try {
      // 800ms simulated async delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      const job = mockJobs.find((j) => j.id === jobId);
      const resumeStore = useResumeStore.getState();
      const resume = resumeStore.uploadedResumes.find((r) => r.id === resumeId);

      const jobTitle = job ? job.title : "Target Role";
      const companyName = job ? job.companyInfo.name : "Target Employer";
      const resumeName = resume ? resume.fileName : "current_resume.pdf";

      // Mock match generation
      const mockScore = Math.floor(Math.random() * 25) + 70; // 70 to 95
      let status: "Excellent" | "Good" | "Average" | "Poor" = "Good";
      if (mockScore >= 90) status = "Excellent";
      else if (mockScore >= 75) status = "Good";
      else if (mockScore >= 50) status = "Average";
      else status = "Poor";

      const analysis: AnalysisRecord = {
        id: `match-${Date.now()}`,
        date: new Date().toISOString(),
        resumeId,
        resumeName,
        resumeVersion: resume ? `v${resume.version}.0` : "v1.0",
        jobId,
        jobTitle,
        companyName,
        matchScore: mockScore,
        status,
        atsCompatibility: Math.round(mockScore * 0.98),
        skillsScore: Math.round(mockScore * 0.95),
        experienceScore: Math.round(mockScore * 0.96),
        educationScore: 90,
        certificationsScore: 75,
        projectsScore: 85,
        atsKeywordsScore: Math.round(mockScore * 0.97),
        missingTechSkills: [
          {
            name: "Docker",
            priority: "High",
            desc: "Container deployment configurations.",
          },
          {
            name: "GraphQL",
            priority: "Medium",
            desc: "Data queries and mutation schemas.",
          },
        ],
        missingSoftSkills: [
          {
            name: "Scrum Master Certification",
            priority: "Low",
            desc: "Agile project organization.",
          },
        ],
        resumeImprovements: [
          "Include bulleted points referencing Docker/Kubernetes container orchestrations.",
          "Add details about API integrations using GraphQL.",
        ],
        suggestedProjects: [
          "Deploy a microservice-orchestrated portal using Docker containers.",
        ],
        suggestedCertifications: ["Certified Kubernetes Administrator (CKA)"],
        portfolioImprovements: [
          "Include public Docker registry repositories on portfolio page.",
        ],
        experienceImprovements: [
          "State involvement in setting up automated CI/CD build scripts.",
        ],
        resumeKeywordSuggestions: [
          "Docker Compose",
          "GraphQL Schema",
          "Orchestration",
        ],
        foundKeywords: ["React", "TypeScript", "Tailwind CSS", "Next.js"],
        missingKeywords: ["Docker", "GraphQL", "CI/CD"],
        keywordDensity: 2.8,
        importantAtsKeywords: [
          "React",
          "TypeScript",
          "Next.js",
          "Docker",
          "GraphQL",
        ],
        strengths: [
          "Strong background in frontend application deployment.",
          "Excellent typography and user interaction modular styles.",
        ],
        weaknesses: [
          "Lack of explicit Docker orchestration experience listed.",
          "Missing Apollo Client or custom GraphQL schema models.",
        ],
        gapAnalysis: [
          {
            label: "Frontend Tech Stack",
            requirement: "React 19, TypeScript",
            resumeValue: "Matched - Senior Developer",
            status: "matched",
          },
          {
            label: "Deploy Tools",
            requirement: "Docker, Containers",
            resumeValue: "Missing - no references",
            status: "missing",
          },
          {
            label: "API Protocol",
            requirement: "GraphQL, Rest APIs",
            resumeValue: "Rest Client fetch only",
            status: "partially",
          },
        ],
        courses: [
          "Docker and Kubernetes - The Complete Guide - Udemy",
          "Advanced GraphQL - Apollo Odyssey",
        ],
        practiceProjects: ["GraphQL-driven containerized micro-dashboard"],
      };

      set((state) => ({
        activeAnalysis: analysis,
        history: [analysis, ...state.history],
        loadingAnalysis: false,
      }));

      toast.success("AI job matching analysis complete!");
    } catch {
      set({ loadingAnalysis: false });
      toast.error("AI job match calculation failed.");
    }
  },

  getMatchHistory: async () => {
    set({ loadingHistory: true });
    await new Promise((resolve) => setTimeout(resolve, 800));
    set({ history: initialHistory, loadingHistory: false });
  },

  refreshAnalysis: async (analysisId) => {
    set({ loadingAnalysis: true });
    await new Promise((resolve) => setTimeout(resolve, 800));

    set((state) => {
      const idx = state.history.findIndex((h) => h.id === analysisId);
      if (idx === -1) return { loadingAnalysis: false };

      const record = state.history[idx];
      const updatedRecord = {
        ...record,
        date: new Date().toISOString(),
        matchScore: Math.min(100, record.matchScore + 2), // slightly adjust score for refresh effect
      };

      const newHist = [...state.history];
      newHist[idx] = updatedRecord;

      return {
        history: newHist,
        activeAnalysis: updatedRecord,
        loadingAnalysis: false,
      };
    });
    toast.success("AI Analysis refreshed successfully!");
  },

  saveAnalysis: async (analysis) => {
    console.log("Saving analysis details:", analysis.id);
    toast.success("AI Match report persisted to database workspace.");
  },

  deleteAnalysis: async (analysisId) => {
    set((state) => ({
      history: state.history.filter((h) => h.id !== analysisId),
      activeAnalysis:
        state.activeAnalysis?.id === analysisId ? null : state.activeAnalysis,
    }));
    toast.success("AI Match analysis record deleted.");
  },
}));
