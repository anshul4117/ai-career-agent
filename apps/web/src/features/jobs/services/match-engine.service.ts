import type { Skill } from "@/features/profile/types/skill.types";
import type { CareerPreference } from "@/features/profile/types/career-preference.types";
import type { Education } from "@/features/profile/types/education.types";
import type { Job } from "../types/jobs.types";
 
export interface SkillMatchResult {
  score: number;
  matched: string[];
  missing: string[];
  additional: string[];
}
 
export interface SectionMatchResult {
  score: number;
  label: string;
}
 
export interface MatchReason {
  met: boolean;
  text: string;
}
 
export interface MatchReport {
  overallScore: number;
  overallLabel: "Excellent Match" | "Great Match" | "Good Match" | "Fair Match" | "Low Match";
  skills: SkillMatchResult;
  experience: SectionMatchResult;
  education: SectionMatchResult;
  location: SectionMatchResult;
  salary: SectionMatchResult;
  quality: SectionMatchResult;
  reasons: MatchReason[];
  recommendations: string[];
}
 
export const matchEngineService = {
  /**
   * Computes overlap between user profile skills and required listing skills
   */
  calculateSkillMatch(userSkills: Skill[], requiredSkills: string[]): SkillMatchResult {
    if (requiredSkills.length === 0) {
      return { score: 100, matched: [], missing: [], additional: userSkills.map(s => s.name) };
    }
 
    const userSkillNames = userSkills.map((s) => s.name.toLowerCase());
    const matched: string[] = [];
    const missing: string[] = [];
 
    requiredSkills.forEach((req) => {
      const reqLower = req.toLowerCase();
      // Match exactly or by substring inclusion
      const found = userSkillNames.find((u) => u === reqLower || u.includes(reqLower) || reqLower.includes(u));
      if (found) {
        matched.push(req);
      } else {
        missing.push(req);
      }
    });
 
    const additional = userSkills
      .filter((s) => !requiredSkills.some((req) => {
        const reqL = req.toLowerCase();
        const sL = s.name.toLowerCase();
        return reqL === sL || reqL.includes(sL) || sL.includes(reqL);
      }))
      .map((s) => s.name);
 
    const score = Math.round((matched.length / requiredSkills.length) * 100);
 
    return {
      score,
      matched,
      missing,
      additional
    };
  },
 
  /**
   * Evaluates candidate years of experience against listing seniority requirements
   */
  calculateExperienceMatch(yearsOfExp: number, experienceLevelRequired: string): SectionMatchResult {
    let requiredMin = 0;
    switch (experienceLevelRequired.toLowerCase()) {
      case "entry": requiredMin = 0; break;
      case "mid": requiredMin = 2; break;
      case "senior": requiredMin = 5; break;
      case "lead": requiredMin = 9; break;
      default: requiredMin = 0;
    }
 
    if (yearsOfExp >= requiredMin) {
      return { 
        score: 100, 
        label: `${yearsOfExp} yrs of experience meets/exceeds requirement (${requiredMin}+ yrs).` 
      };
    }
 
    const diff = requiredMin - yearsOfExp;
    if (diff === 1) {
      return { score: 80, label: `Only 1 year short of requirement (${requiredMin}+ yrs).` };
    }
    if (diff === 2) {
      return { score: 60, label: `2 years short of requirement (${requiredMin}+ yrs).` };
    }
    return { score: 30, label: `${diff} years short of requirement (${requiredMin}+ yrs).` };
  },
 
  /**
   * Scans job descriptions for degree hints and checks against profile education credentials
   */
  calculateEducationMatch(userEducations: Education[], jobDescription: string): SectionMatchResult {
    if (userEducations.length === 0) {
      return { score: 50, label: "No educational credentials configured in profile." };
    }
 
    const descLower = jobDescription.toLowerCase();
    const hasMasterReq = descLower.includes("master") || descLower.includes("m.s") || descLower.includes("post-grad");
 
    const userDegrees = userEducations.map((e) => `${e.degree || ""} ${e.fieldOfStudy || ""}`.toLowerCase());
    const userHasMaster = userDegrees.some((d) => d.includes("master") || d.includes("mtech") || d.includes("ms") || d.includes("mba"));
 
    if (hasMasterReq && !userHasMaster) {
      return { 
        score: 70, 
        label: "Listing prefers a Master's degree; your profile lists lower credentials." 
      };
    }
 
    return { score: 100, label: "Educational background aligns with job criteria." };
  },
 
  /**
   * Compares candidate location and remote/hybrid work preference with job mode
   */
  calculateLocationMatch(
    userPreferences: CareerPreference | null,
    jobLocation: string,
    jobRemoteType: string
  ): SectionMatchResult {
    if (jobRemoteType === "remote") {
      return { score: 100, label: "Remote posting matches global location criteria." };
    }
 
    if (!userPreferences) {
      return { score: 80, label: "Matches location criteria (no preferences configured)." };
    }
 
    const prefLoc = userPreferences.preferredLocation?.toLowerCase() || "";
    const jobLoc = jobLocation.toLowerCase();
    const locMatch = jobLoc.includes(prefLoc) || prefLoc.includes(jobLoc);
 
    if (locMatch) {
      return { 
        score: 100, 
        label: `Location matches preferred city (${userPreferences.preferredLocation}).` 
      };
    }
 
    return { 
      score: 50, 
      label: `Job is in ${jobLocation}; preferred location is ${userPreferences.preferredLocation || "any"}.` 
    };
  },
 
  /**
   * Computes salary threshold match against preferred expectations
   */
  calculateSalaryMatch(
    userPreferences: CareerPreference | null,
    salaryMin: number | null,
    salaryMax: number | null
  ): SectionMatchResult {
    if (!userPreferences || !userPreferences.expectedSalary) {
      return { score: 90, label: "Matches compensation targets (no criteria configured)." };
    }
 
    if (salaryMin === null && salaryMax === null) {
      return { score: 80, label: "Compensation undisclosed by employer." };
    }
 
    const expectedStr = userPreferences.expectedSalary.replace(/,/g, "").trim();
    const expected = parseFloat(expectedStr);
    if (isNaN(expected)) {
      return { score: 100, label: "Expected salary format could not be verified." };
    }
 
    if (salaryMax && expected > salaryMax) {
      return { 
        score: 60, 
        label: `Expected salary ($${Math.round(expected/1000)}k) exceeds employer budget limit ($${Math.round(salaryMax/1000)}k).` 
      };
    }
 
    return { score: 100, label: `Expected salary aligns with employer budget.` };
  },
 
  /**
   * Generates custom lists of reasons based on matches
   */
  generateReasons(
    skills: SkillMatchResult,
    exp: SectionMatchResult,
    edu: SectionMatchResult,
    loc: SectionMatchResult,
    sal: SectionMatchResult,
    qualityScore: number
  ): MatchReason[] {
    const reasons: MatchReason[] = [];
 
    // Skills
    if (skills.score >= 80) {
      reasons.push({ met: true, text: "Your core skills align perfectly with listing requirements." });
    } else if (skills.score >= 50) {
      reasons.push({ met: true, text: `Matches ${skills.matched.length} key required skill tags.` });
    } else {
      reasons.push({ met: false, text: `Missing ${skills.missing.length} required skill tags.` });
    }
 
    // Experience
    reasons.push({
      met: exp.score >= 80,
      text: exp.score >= 80 ? "Experience duration meets or exceeds criteria." : "Requires additional years of experience."
    });
 
    // Education
    if (edu.score >= 80) {
      reasons.push({ met: true, text: "Education credentials match listing preferences." });
    }
 
    // Location
    reasons.push({
      met: loc.score >= 80,
      text: loc.score >= 80 ? "Job location aligns with your remote/city preferences." : "Location is outside preferred geography."
    });
 
    // Salary
    if (sal.score >= 80) {
      reasons.push({ met: true, text: "Employer salary limits meet expectation limits." });
    } else {
      reasons.push({ met: false, text: "Compensation is lower than expected target." });
    }
 
    // Quality
    if (qualityScore >= 80) {
      reasons.push({ met: true, text: "High quality verified listing." });
    }
 
    return reasons;
  },
 
  /**
   * Recommends tutorials/training modules for missing skills
   */
  generateRecommendations(missingSkills: string[]): string[] {
    if (missingSkills.length === 0) {
      return ["Your skill profile is 100% matched for this role!"];
    }
    return missingSkills.map((s) => {
      const lower = s.toLowerCase();
      if (lower.includes("react")) return "Build a sample project in React and learn Hooks";
      if (lower.includes("node")) return "Learn Node.js event loops and create Express/Nest services";
      if (lower.includes("docker")) return "Learn Docker containerization and image tagging";
      if (lower.includes("aws")) return "Take AWS Cloud Practitioner or Solutions Architect training";
      if (lower.includes("kubernetes")) return "Study Kubernetes pods, deployments, and cluster management";
      if (lower.includes("redis")) return "Study Redis caching, rate limiters, and data structures";
      if (lower.includes("design")) return "Practice system design fundamentals (scaling, load balancers)";
      if (lower.includes("typescript")) return "Migrate a JavaScript codebase to TypeScript";
      return `Acquire hands-on experience and complete certification for ${s}`;
    });
  },
 
  /**
   * Evaluates overall match report by merging weighted components
   */
  calculateOverallMatch(
    userSkills: Skill[],
    userEducations: Education[],
    userPreferences: CareerPreference | null,
    yearsOfExp: number,
    job: Job,
    jobQualityScore: number
  ): MatchReport {
    const skillsRes = this.calculateSkillMatch(userSkills, job.skillsRequired);
    const expRes = this.calculateExperienceMatch(yearsOfExp, job.experienceLevel);
    const eduRes = this.calculateEducationMatch(userEducations, job.description);
    const locRes = this.calculateLocationMatch(userPreferences, job.location, job.remoteType);
    const salRes = this.calculateSalaryMatch(userPreferences, job.salaryMin, job.salaryMax);
 
    // Weighted match calculation
    const weightedScore =
      skillsRes.score * 0.4 +
      expRes.score * 0.25 +
      eduRes.score * 0.1 +
      locRes.score * 0.1 +
      salRes.score * 0.05 +
      jobQualityScore * 0.1;
 
    const overallScore = Math.round(weightedScore);
 
    let overallLabel: "Excellent Match" | "Great Match" | "Good Match" | "Fair Match" | "Low Match";
    if (overallScore >= 90) overallLabel = "Excellent Match";
    else if (overallScore >= 80) overallLabel = "Great Match";
    else if (overallScore >= 70) overallLabel = "Good Match";
    else if (overallScore >= 50) overallLabel = "Fair Match";
    else overallLabel = "Low Match";
 
    const reasons = this.generateReasons(skillsRes, expRes, eduRes, locRes, salRes, jobQualityScore);
    const recommendations = this.generateRecommendations(skillsRes.missing);
 
    return {
      overallScore,
      overallLabel,
      skills: skillsRes,
      experience: expRes,
      education: eduRes,
      location: locRes,
      salary: salRes,
      quality: { score: jobQualityScore, label: jobQualityScore >= 80 ? "High Quality" : "Average Quality" },
      reasons,
      recommendations
    };
  }
};
