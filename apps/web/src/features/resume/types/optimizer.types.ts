export interface SectionScore {
  score: number; // 0-100
  status: "excellent" | "good" | "needs_improvement" | "poor";
  missingInfo: string[];
  suggestions: string[];
}
 
export interface KeywordDensity {
  keyword: string;
  count: number;
  percentage: number;
}
 
export interface BulletEnhancement {
  original: string;
  improved: string;
  impact: string;
}
 
export interface SummaryOptimizer {
  original: string;
  improved: string;
  rationale: string;
}
 
export interface ReadabilityAnalysis {
  readabilityScore: number;
  sentenceLength: number;
  passiveVoiceCount: number;
  grammarWarningsCount: number;
  tone: string;
}
 
export interface ResumeVersion {
  id: string;
  name: string; // e.g. "Backend Developer", "Frontend Developer"
  title: string;
  atsScore: number;
  createdAt: string;
}
 
export interface OptimizationHistory {
  id: string;
  date: string;
  atsScore: number;
  jobTitle: string;
  version: string;
}
 
export interface OptimizerAnalysis {
  resumeId: string;
  atsScore: number;
  qualityScore: number;
  completenessScore: number;
  keywordScore: number;
  readabilityScore: number;
 
  sections: {
    personal: SectionScore;
    summary: SectionScore;
    skills: SectionScore;
    experience: SectionScore;
    education: SectionScore;
    projects: SectionScore;
    certifications: SectionScore;
  };
 
  keywords: {
    matching: string[];
    missing: string[];
    density: KeywordDensity[];
    suggested: string[];
  };
 
  skillGap: {
    existing: string[];
    missing: string[];
    recommended: string[];
    priority: string[];
  };
 
  suggestions: {
    high: string[];
    medium: string[];
    low: string[];
  };
 
  // Advanced features (Sprint 9.2)
  readability: ReadabilityAnalysis;
  bullets: BulletEnhancement[];
  summaryOpt: SummaryOptimizer;
}
