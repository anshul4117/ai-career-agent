import type { Resume } from "../../resume/types/resume.types";
import type { 
  CoverLetterDraft, 
  CoverLetterTemplate, 
  CoverLetterTone 
} from "../types/cover-letter.types";
 
export const coverLetterService = {
  /**
   * Generates a tailored cover letter using resume details, target job, company, template type, and tone
   */
  generate(
    resume: Resume | null,
    jobTitle: string,
    company: string,
    jobDescription: string,
    template: CoverLetterTemplate,
    tone: CoverLetterTone
  ): string {
    const personal = resume?.content?.personal;
    const name = personal ? `${personal.firstName} ${personal.lastName}` : "Alex Rivera";
    const email = personal?.email || "alex.rivera@example.com";
    const phone = personal?.phone || "+1 (555) 019-2834";
    const location = personal?.city && personal?.country ? `${personal.city}, ${personal.country}` : "San Francisco, CA";
    
    // Pick experience context if available
    const lastExp = resume?.content?.experience?.[0];
    const expSnippet = lastExp 
      ? `Having recently served as a ${lastExp.jobTitle} at ${lastExp.companyName}, where I was responsible for ${lastExp.description.split(".")[0].toLowerCase()},`
      : `With my extensive experience in developing high-performance applications and designing scalable architectures,`;
 
    // Tone adjustments
    let opening = "";
    let pitch = "";
    let closing = "";
 
    switch (tone) {
      case "friendly":
        opening = `I was absolutely thrilled to come across the open ${jobTitle} role at ${company}. Your team's collaborative spirit and focus on building developer-friendly tooling resonate deeply with me.`;
        pitch = `${expSnippet} I love solving complex technical challenges while keeping user experiences simple and delightful. I've always aimed to be a helpful teammate who elevates the group's productivity.`;
        closing = `I would love to hop on a quick call to chat about how my background fits your team goals. Thanks so much for your time!`;
        break;
      case "confident":
        opening = `I am writing to pitch myself for the ${jobTitle} position at ${company}. Given my track record of engineering scalable, high-performance infrastructures and leading agile teams, I am confident I can drive immediate value for your technical org.`;
        pitch = `${expSnippet} I specialize in boosting performance and cutting build delivery times by 30%+. I don't just write clean code; I architect systems that scale to handle millions of monthly transactions.`;
        closing = `I look forward to discussing how my technical execution can help ${company} surpass its engineering benchmarks. Thank you for your consideration.`;
        break;
      case "formal":
        opening = `Please accept this letter as formal application for the position of ${jobTitle} at ${company}. I have long admired your organization's commitment to compliance, architectural standards, and professional excellence.`;
        pitch = `${expSnippet} I bring a disciplined approach to systems engineering, ensuring all products align with security directives and maintainable design patterns. I have successfully orchestrated cross-functional integrations throughout my career.`;
        closing = `I am available at your convenience for a formal interview. Thank you for evaluating my credentials.`;
        break;
      case "enthusiastic":
        opening = `I am writing to express my immense excitement about the ${jobTitle} opportunity at ${company}! I have been following your growth closely and admire your mission to democratize workflows and empower teams.`;
        pitch = `${expSnippet} I bring high energy, a hunger to learn, and hands-on expertise building feature-rich interfaces. I am passionate about shipping features that make a real, positive difference in users' daily workflows.`;
        closing = `I am incredibly excited about what the future holds for ${company} and would be honored to contribute to your journey. Let's build something awesome together!`;
        break;
      case "professional":
      default:
        opening = `I am writing to express my strong interest in the ${jobTitle} position at ${company}. With my background in engineering stable web platforms and collaborating with cross-functional product teams, I am well-prepared to contribute to your engineering goals.`;
        pitch = `${expSnippet} I focus on writing clean, testable, and highly performant code. I enjoy collaborating with product designers to bridge the gap between technical requirements and user-centric interfaces.`;
        closing = `I would welcome the opportunity to discuss my qualifications in detail. Thank you for your time and evaluation.`;
        break;
    }
 
    // Template wrappers
    const dateStr = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    
    const headerBlock = `${name}\n${email} | ${phone}\n${location}\n\n${dateStr}\n\nHiring Team\n${company}`;
    
    switch (template) {
      case "startup":
        return `// STARTUP TECH FORMAT\n\n${headerBlock}\n\nRE: Disrupting the status quo as your next ${jobTitle}\n\nHey Hiring Team,\n\n${opening}\n\n${pitch}\n\n${jobDescription ? `Looking at your job details: "${jobDescription.slice(0, 120)}...", I see a perfect overlap with my expertise in building resilient applications.` : `I am excited to bring my engineering background and build-first mindset to help ${company} capture new market milestones.`}\n\n${closing}\n\nBest,\n\n${name}`;
      case "enterprise":
        return `// ENTERPRISE BLOCK FORMAT\n\n${headerBlock}\n\nSUBJECT: Formal Application for ${jobTitle} (Ref: AI-Agent-S10)\n\nDear Members of the Hiring Committee,\n\n${opening}\n\n${pitch}\n\n${jobDescription ? `In reference to your core requirements: "${jobDescription.slice(0, 120)}...", I possess proven competencies in orchestrating similar systems architecture workflows.` : `I am prepared to help ${company} deploy secure, robust solutions that support your enterprise objectives.`}\n\n${closing}\n\nRespectfully yours,\n\n${name}`;
      case "modern":
        return `// MODERN STREAMLINED FORMAT\n\n${name} // ${email}\n${jobTitle} Candidate for ${company}\n-------------------------------------------\n\nDear Hiring Leader,\n\n${opening}\n\n${pitch}\n\n${closing}\n\nWarm regards,\n\n${name}`;
      case "minimal":
        return `${name}\n${email}\n\nDear Hiring Team,\n\n${opening}\n\n${pitch}\n\n${closing}\n\nSincerely,\n${name}`;
      case "professional":
      default:
        return `// STANDARD PROFESSIONAL FORMAT\n\n${headerBlock}\n\nSubject: Application for ${jobTitle}\n\nDear Hiring Manager,\n\n${opening}\n\n${pitch}\n\n${jobDescription ? `Regarding your specifications: "${jobDescription.slice(0, 120)}...", my profile demonstrates extensive alignment with these engineering goals.` : `I am confident that my experience and dedication to code quality make me an excellent fit for this position.`}\n\n${closing}\n\nSincerely,\n\n${name}`;
    }
  },
 
  /**
   * CRUD helpers backing to local storage
   */
  getAll(): CoverLetterDraft[] {
    if (typeof window === "undefined") return [];
    const data = localStorage.getItem("cover_letters_drafts");
    if (!data) {
      // Seed default mock cover letter drafts if empty
      const defaultDrafts: CoverLetterDraft[] = [
        {
          id: "cl_1",
          title: "Vercel Frontend Developer Layout",
          jobTitle: "Senior Frontend Engineer",
          company: "Vercel",
          jobDescription: "Build next generation rendering frameworks and fast developer interfaces.",
          template: "modern",
          tone: "confident",
          content: "// MODERN STREAMLINED FORMAT\n\nAlex Rivera // alex.rivera@example.com\nSenior Frontend Engineer Candidate for Vercel\n-------------------------------------------\n\nDear Hiring Leader,\n\nI am writing to pitch myself for the Senior Frontend Engineer position at Vercel. Given my track record of engineering scalable, high-performance infrastructures and leading agile teams, I am confident I can drive immediate value for your technical org.\n\nWith my extensive experience in developing high-performance applications and designing scalable architectures, I specialize in boosting performance and cutting build delivery times by 30%+. I don't just write clean code; I architect systems that scale to handle millions of monthly transactions.\n\nI look forward to discussing how my technical execution can help Vercel surpass its engineering benchmarks. Thank you for your consideration.\n\nWarm regards,\n\nAlex Rivera",
          isFavorite: true,
          versions: [],
          createdAt: "2026-07-08T15:00:00Z",
          updatedAt: "2026-07-08T15:00:00Z"
        }
      ];
      localStorage.setItem("cover_letters_drafts", JSON.stringify(defaultDrafts));
      return defaultDrafts;
    }
    return JSON.parse(data);
  },
 
  saveAll(drafts: CoverLetterDraft[]): void {
    if (typeof window === "undefined") return;
    localStorage.setItem("cover_letters_drafts", JSON.stringify(drafts));
  }
};
