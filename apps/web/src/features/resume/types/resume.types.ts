/** Resume Module — Type Definitions */

export interface Resume {
  id: string;
  title: string;
  description: string;
  templateId: string;
  status: "active" | "archived";
  isDefault: boolean;
  atsScore: number;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  previewColor: string; // Neon accents for Brutalist look
}
