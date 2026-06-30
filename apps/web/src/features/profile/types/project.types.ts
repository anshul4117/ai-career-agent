/** Projects Module — Type Definitions */

export interface Project {
  id: string;
  title: string;
  description: string;
  techStack: string[];
  githubUrl: string | null;
  liveDemoUrl: string | null;
  imageUrl: string | null;
  teamSize: number;
  role: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD, null if ongoing
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}
