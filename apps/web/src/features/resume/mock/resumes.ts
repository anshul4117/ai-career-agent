import type { ParsingStatus } from "@/types";

export interface ResumeItem {
  id: string;
  fileName: string;
  uploadedAt: string;
  parsingStatus: ParsingStatus;
  fileSize: string;
}

export const mockResumes: ResumeItem[] = [
  {
    id: "res_001",
    fileName: "anshul-kumar-resume.pdf",
    uploadedAt: "2025-06-10",
    parsingStatus: "COMPLETED",
    fileSize: "245 KB",
  },
  {
    id: "res_002",
    fileName: "backend-focused-resume.pdf",
    uploadedAt: "2025-06-18",
    parsingStatus: "PENDING",
    fileSize: "198 KB",
  },
];
