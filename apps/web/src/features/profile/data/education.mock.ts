/** Education Module — Mock Data */

import type { Education } from "../types/education.types";

export const MOCK_EDUCATION: Education[] = [
  {
    id: "edu_1",
    degree: "Bachelor of Technology (B.Tech)",
    fieldOfStudy: "Computer Science & Engineering",
    institution: "XYZ Institute of Technology",
    location: "Bengaluru, India",
    startDate: "2020-08-01",
    endDate: "2024-05-30",
    currentStudy: false,
    cgpa: "8.5 / 10",
    description: "Specialized in Software Engineering and Machine Learning. Head of coding club and active participant in national hackathons.",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
  {
    id: "edu_2",
    degree: "Higher Secondary Education (12th Grade)",
    fieldOfStudy: "Science (PCMC)",
    institution: "St. Joseph's Pre-University College",
    location: "Bengaluru, India",
    startDate: "2018-06-01",
    endDate: "2020-03-30",
    currentStudy: false,
    cgpa: "92.4%",
    description: "Completed with distinction. Core subjects: Physics, Chemistry, Mathematics, Computer Science.",
    createdAt: "2025-01-15T10:30:00Z",
    updatedAt: "2026-06-28T14:22:00Z",
  },
];
