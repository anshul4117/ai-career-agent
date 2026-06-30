/** Profile Module — Mock Data */

import type { Profile } from "../types/profile.types";

export const MOCK_PROFILE: Profile = {
  id: "profile_001",
  userId: "user_001",
  avatar: {
    url: null,
    initials: "AK",
  },
  personal: {
    firstName: "Anshul",
    lastName: "Kumar",
    dateOfBirth: "1999-06-15",
    gender: "male",
    nationality: "Indian",
  },
  contact: {
    email: "anshul@example.com",
    phone: "+91 98765 43210",
    city: "Bengaluru",
    state: "Karnataka",
    country: "India",
  },
  career: {
    currentRole: "Full Stack Developer",
    yearsOfExperience: 3,
    preferredRole: "Senior Full Stack Developer",
    preferredLocation: "Bengaluru / Remote",
    workPreference: "remote",
    headline: "Full Stack Developer | AI Enthusiast",
    summary:
      "Passionate software engineer with 3+ years of experience building scalable web applications and AI-powered products. Skilled in TypeScript, React, Next.js, Node.js, and cloud infrastructure.",
  },
  stats: {
    skillsCount: 12,
    experienceCount: 3,
    projectsCount: 5,
    educationCount: 2,
  },
  completion: {
    percentage: 72,
    sections: [
      { id: "personal", label: "Personal Information", completed: true },
      { id: "contact", label: "Contact Details", completed: true },
      { id: "career", label: "Career Summary", completed: true },
      { id: "skills", label: "Skills & Expertise", completed: true },
      { id: "experience", label: "Work Experience", completed: true },
      { id: "education", label: "Education", completed: true },
      { id: "projects", label: "Projects & Portfolio", completed: false },
      { id: "certifications", label: "Certifications", completed: false },
      { id: "languages", label: "Languages", completed: false },
      { id: "social", label: "Social Links", completed: false },
    ],
  },
  availability: "actively_looking",
  createdAt: "2025-01-15T10:30:00Z",
  updatedAt: "2026-06-28T14:22:00Z",
};

export const AVAILABILITY_LABELS: Record<string, { label: string; color: string }> = {
  actively_looking: { label: "Actively Looking", color: "success" },
  open_to_offers: { label: "Open to Offers", color: "warning" },
  not_looking: { label: "Not Looking", color: "error" },
};

export const WORK_PREFERENCE_LABELS: Record<string, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};
