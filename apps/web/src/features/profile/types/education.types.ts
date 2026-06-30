/** Education Module — Type Definitions */

export interface Education {
  id: string;
  degree: string;
  fieldOfStudy: string;
  institution: string;
  location: string;
  startDate: string; // YYYY-MM-DD
  endDate: string | null; // YYYY-MM-DD, null if currentStudy is true
  currentStudy: boolean;
  cgpa: string; // e.g. "8.5/10", "85%"
  description: string | null;
  createdAt: string;
  updatedAt: string;
}
