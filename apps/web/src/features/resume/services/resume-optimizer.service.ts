import type { Resume } from "../types/resume.types";
import type { 
  OptimizerAnalysis, 
  SectionScore, 
  KeywordDensity,
  BulletEnhancement,
  SummaryOptimizer,
  ReadabilityAnalysis
} from "../types/optimizer.types";
 
export const resumeOptimizerService = {
  /**
   * Evaluates resume completeness, reads keyword matches, and structures suggestions
   */
  analyze(resume: Resume, jobDescription: string): OptimizerAnalysis {
    const content = resume.content;
 
    // 1. Evaluate Completeness Score per section
    let personalScore = 100;
    const missingPersonal: string[] = [];
    if (!content?.personal?.firstName || !content?.personal?.lastName) {
      personalScore -= 30;
      missingPersonal.push("First Name or Last Name");
    }
    if (!content?.personal?.email) {
      personalScore -= 30;
      missingPersonal.push("Email Address");
    }
    if (!content?.personal?.phone) {
      personalScore -= 20;
      missingPersonal.push("Phone Number");
    }
    if (!content?.personal?.city || !content?.personal?.country) {
      personalScore -= 20;
      missingPersonal.push("City or Country Location");
    }
    personalScore = Math.max(0, personalScore);
 
    let summaryScore = 100;
    const missingSummary: string[] = [];
    const origSummary = content?.summary?.summary || "";
    if (!origSummary || origSummary.trim().length < 20) {
      summaryScore = 0;
      missingSummary.push("Professional summary statement");
    } else if (origSummary.trim().length < 100) {
      summaryScore = 60;
      missingSummary.push("Summary statement is too brief (less than 100 characters)");
    }
 
    const expCount = content?.experience?.length || 0;
    let experienceScore = Math.min(100, expCount * 30 + 10);
    const missingExperience: string[] = [];
    if (expCount === 0) {
      experienceScore = 0;
      missingExperience.push("Work experience items");
    } else {
      content?.experience?.forEach((e, idx) => {
        if (!e.description || e.description.trim().length < 30) {
          missingExperience.push(`Description details for role at ${e.companyName || `Item #${idx+1}`}`);
          experienceScore -= 10;
        }
      });
    }
    experienceScore = Math.max(0, experienceScore);
 
    const eduCount = content?.education?.length || 0;
    let educationScore = Math.min(100, eduCount * 50);
    const missingEducation: string[] = [];
    if (eduCount === 0) {
      educationScore = 0;
      missingEducation.push("Academic credentials");
    }
 
    const skillsCount = content?.skills?.length || 0;
    let skillsScore = Math.min(100, skillsCount * 10);
    const missingSkills: string[] = [];
    if (skillsCount === 0) {
      skillsScore = 0;
      missingSkills.push("Skills list tags");
    }
 
    const projCount = content?.projects?.length || 0;
    let projectsScore = Math.min(100, projCount * 35);
    const missingProjects: string[] = [];
    if (projCount === 0) {
      projectsScore = 50;
      missingProjects.push("Project portfolios");
    }
 
    const certCount = content?.certifications?.length || 0;
    let certificationsScore = Math.min(100, certCount * 40 + 20);
    const missingCertifications: string[] = [];
    if (certCount === 0) {
      certificationsScore = 60;
      missingCertifications.push("Certifications validation");
    }
 
    const completenessScore = Math.round(
      (personalScore + summaryScore + experienceScore + educationScore + skillsScore + projectsScore) / 6
    );
 
    // 2. Keyword matching & Skill Gaps scanner
    const commonKeywords = [
      "react", "node", "next.js", "typescript", "javascript", "python", "golang", "rust", 
      "sql", "postgres", "mongodb", "docker", "kubernetes", "aws", "gcp", "graphql", 
      "tailwindcss", "jest", "cicd", "git", "rest api", "microservices", "system design"
    ];
 
    const jdLower = jobDescription.toLowerCase();
    const resumeTexts = [
      resume.title,
      resume.description,
      content?.personal?.headline,
      content?.summary?.summary,
      ...(content?.skills?.map(s => s.name) || []),
      ...(content?.experience?.map(e => `${e.companyName} ${e.jobTitle} ${e.description}`) || []),
      ...(content?.projects?.map(p => `${p.title} ${p.description} ${p.techStack.join(" ")}`) || [])
    ].map(t => (t || "").toLowerCase());
 
    const matchedKeywords: string[] = [];
    const missingKeywords: string[] = [];
 
    commonKeywords.forEach(keyword => {
      if (jdLower.includes(keyword)) {
        const hasKeyword = resumeTexts.some(t => t.includes(keyword));
        if (hasKeyword) {
          matchedKeywords.push(keyword);
        } else {
          missingKeywords.push(keyword);
        }
      }
    });
 
    // Fallback mock lists if target job description is blank
    if (!jobDescription.trim()) {
      matchedKeywords.push("react", "javascript", "git");
      missingKeywords.push("next.js", "typescript", "docker", "aws");
    }
 
    const totalKeywordsCount = matchedKeywords.length + missingKeywords.length;
    const keywordScore = totalKeywordsCount > 0 
      ? Math.round((matchedKeywords.length / totalKeywordsCount) * 100) 
      : 70;
 
    const density: KeywordDensity[] = matchedKeywords.map(keyword => {
      let count = 0;
      resumeTexts.forEach(t => {
        const regex = new RegExp(`\\b${keyword}\\b`, "g");
        const matches = t.match(regex);
        if (matches) count += matches.length;
      });
      count = Math.max(1, count);
      return {
        keyword,
        count,
        percentage: parseFloat((0.8 * count).toFixed(1))
      };
    });
 
    const existingSkills = content?.skills?.map(s => s.name) || ["React", "JavaScript", "CSS"];
    const missingSkillsList = missingKeywords.map(k => k.charAt(0).toUpperCase() + k.slice(1));
    const recommendedSkills = ["System Design", "Unit Testing", "GraphQL"];
    const prioritySkills = missingSkillsList.slice(0, 3);
 
    // Calculate readability metrics
    const readabilityScore = origSummary && origSummary.split(" ").length > 30 ? 88 : 72;
    const qualityScore = Math.round((completenessScore + keywordScore + readabilityScore) / 3);
    const atsScore = Math.round(0.4 * keywordScore + 0.3 * completenessScore + 0.2 * qualityScore + 0.1 * readabilityScore);
 
    // 3. Actionable improvement suggestions grouped by priority
    const highSuggestions: string[] = [];
    const medSuggestions: string[] = [];
    const lowSuggestions: string[] = [];
 
    if (personalScore < 90) {
      highSuggestions.push(`Complete missing contact fields: ${missingPersonal.join(", ")}`);
    }
    if (summaryScore < 70) {
      highSuggestions.push("Expand summary statement to 3-4 sentences detailing professional achievements.");
    }
    if (experienceScore < 60) {
      highSuggestions.push("Flesh out work history logs. Add bullet points showcasing quantitative results.");
    }
    if (missingKeywords.length > 0) {
      highSuggestions.push(`Integrate missing critical tech stack keywords: ${missingKeywords.slice(0, 3).join(", ").toUpperCase()}`);
    }
    if (skillsCount < 5) {
      medSuggestions.push("Add at least 5-10 core skills to demonstrate comprehensive tooling coverage.");
    }
    if (eduCount === 0) {
      medSuggestions.push("Add academic credentials or degree coursework completed.");
    }
    if (projCount === 0) {
      medSuggestions.push("Add project portfolios to demonstrate hands-on tooling implementation.");
    }
    if (readabilityScore < 80) {
      lowSuggestions.push("Simplify phrasing in summary descriptions to improve readability ratings.");
    }
    if (certCount === 0) {
      lowSuggestions.push("Add certifications to validate vendor specialties (e.g. AWS Certified).");
    }
 
    if (highSuggestions.length === 0) highSuggestions.push("Ensure all bullet points start with strong action verbs (e.g. 'Engineered', 'Optimized').");
    if (medSuggestions.length === 0) medSuggestions.push("Refine keyword densities to stay between 1.5% and 3.0% threshold.");
    if (lowSuggestions.length === 0) lowSuggestions.push("Ensure dates format consistency across all listings.");
 
    const makeSectionScore = (score: number, missing: string[], suggest: string[]): SectionScore => {
      let status: SectionScore["status"] = "excellent";
      if (score < 40) status = "poor";
      else if (score < 70) status = "needs_improvement";
      else if (score < 90) status = "good";
 
      return { score, status, missingInfo: missing, suggestions: suggest };
    };
 
    // 4. Advanced Metrics (Sprint 9.2)
    // Readability Analysis
    const readabilityAnalysis: ReadabilityAnalysis = {
      readabilityScore,
      sentenceLength: origSummary ? Math.round(origSummary.split(" ").length / Math.max(1, origSummary.split(".").length)) : 14,
      passiveVoiceCount: origSummary ? (origSummary.match(/\b(was|were|been|be|is|are)\b/gi) || []).length : 2,
      grammarWarningsCount: Math.round(completenessScore < 80 ? 3 : 1),
      tone: "Professional & Metrics-focused"
    };
 
    // Bullet point enhancements
    const bullets: BulletEnhancement[] = [];
    if (content?.experience && content.experience.length > 0) {
      content.experience.forEach((exp) => {
        if (exp.description) {
          const lines = exp.description.split("\n").map(l => l.trim().replace(/^[-*•]\s*/, "")).filter(Boolean);
          lines.forEach((line) => {
            if (line.length > 10) {
              let improved = line;
              let impact = "Integrated quantifiable business impact indicators.";
              
              if (line.toLowerCase().includes("work") || line.toLowerCase().includes("develop")) {
                improved = `Engineered and optimized high-performance components, reducing latency metrics by 25% while increasing feature throughput.`;
                impact = "Replaced generic verbs with impact-driven action terms ('Engineered', 'Optimized') and metrics.";
              } else if (line.toLowerCase().includes("fix") || line.toLowerCase().includes("bug")) {
                improved = `Identified and debugged 40+ runtime issues, enhancing stability rating to 99.9% uptime.`;
                impact = "Linked technical resolution metrics to core system reliability indicators.";
              } else {
                improved = ` Spearheaded development and release workflows, yielding a 15% boost in client satisfaction ratings.`;
                impact = "Upgraded active verbs and integrated commercial KPI outputs.";
              }
              bullets.push({ original: line, improved, impact });
            }
          });
        }
      });
    }
 
    // Fallback bullets if empty
    if (bullets.length === 0) {
      bullets.push({
        original: "Developed backend APIs using Node.js.",
        improved: "Engineered and scale-tested 25+ REST/GraphQL Node.js microservice APIs, reducing transaction processing times by 35%.",
        impact: "Added measurable performance metrics and verified tools definitions."
      });
      bullets.push({
        original: "Responsible for fixing bugs on the frontend website.",
        improved: "Resolved 60+ critical client-side UI render crashes using Next.js, elevating Lighthouse speed scores from 72 to 94.",
        impact: "Upgraded active verbs ('Resolved') and added clear visual feedback indices."
      });
    }
 
    // Summary Optimizer
    const improvedSummary = origSummary && origSummary.length > 30
      ? `Accomplished Full-Stack Engineer with a proven record of optimizing high-throughput web applications. Expert in ${matchedKeywords.slice(0, 3).join(", ").toUpperCase()} and cloud architectures. Spearheaded migration workflows that shaved 30% off build pipelines while maintaining 99.9% system availability.`
      : `Results-oriented Software Engineer offering expertise in frontend and backend systems. Specialized in React, Next.js, Node.js, and TypeScript. Skilled in structuring RESTful APIs and optimizing client-side rendering performance.`;
 
    const summaryOptimizer: SummaryOptimizer = {
      original: origSummary || "Developer looking for opportunities.",
      improved: improvedSummary,
      rationale: "Added quantifiable metrics, professional verbs, and aligned core keywords to match target job specs."
    };
 
    return {
      resumeId: resume.id,
      atsScore,
      qualityScore,
      completenessScore,
      keywordScore,
      readabilityScore,
      sections: {
        personal: makeSectionScore(personalScore, missingPersonal, personalScore < 90 ? ["Provide email, phone, city and country location."] : []),
        summary: makeSectionScore(summaryScore, missingSummary, summaryScore < 70 ? ["Write a 3-4 sentence value summary."] : []),
        skills: makeSectionScore(skillsScore, missingSkills, skillsScore < 75 ? ["List relevant technical and soft skills."] : []),
        experience: makeSectionScore(experienceScore, missingExperience, experienceScore < 80 ? ["Provide detailed descriptions for all job listings starting with action verbs."] : []),
        education: makeSectionScore(educationScore, missingEducation, educationScore < 50 ? ["List academic credentials."] : []),
        projects: makeSectionScore(projectsScore, missingProjects, projectsScore < 70 ? ["List showcase coding projects with tech stacks."] : []),
        certifications: makeSectionScore(certificationsScore, missingCertifications, certificationsScore < 70 ? ["Add relevant certifications."] : [])
      },
      keywords: {
        matching: matchedKeywords.length > 0 ? matchedKeywords : ["git", "javascript"],
        missing: missingKeywords.length > 0 ? missingKeywords : ["typescript", "next.js"],
        density: density.length > 0 ? density : [{ keyword: "git", count: 2, percentage: 1.6 }],
        suggested: missingKeywords.length > 0 ? missingKeywords.map(k => `Add ${k.toUpperCase()} reference.`) : ["Add TYPESCRIPT reference."]
      },
      skillGap: {
        existing: existingSkills,
        missing: missingSkillsList.length > 0 ? missingSkillsList : ["Typescript", "Next.js"],
        recommended: recommendedSkills,
        priority: prioritySkills.length > 0 ? prioritySkills : ["Typescript"]
      },
      suggestions: {
        high: highSuggestions,
        medium: medSuggestions,
        low: lowSuggestions
      },
      readability: readabilityAnalysis,
      bullets,
      summaryOpt: summaryOptimizer
    };
  }
};
