import { calculateProfileCompletion } from "../utils/completion-engine";
import type { Profile } from "../types/profile.types";

describe("Profile Completion Engine Tests", () => {
  const emptyProfile: Profile = {
    id: "prof-1",
    userId: "usr-1",
    avatar: { url: null, initials: "JD" },
    personal: {
      firstName: "",
      lastName: "",
      dateOfBirth: null,
      gender: null,
      nationality: null,
    },
    contact: {
      email: "jane@example.com",
      phone: "",
      city: "",
      state: "",
      country: "",
    },
    career: {
      currentRole: "",
      yearsOfExperience: 0,
      preferredRole: "",
      preferredLocation: "",
      workPreference: "remote",
      headline: "",
      summary: "",
    },
    stats: {
      skillsCount: 0,
      experienceCount: 0,
      projectsCount: 0,
      educationCount: 0,
    },
    completion: { percentage: 0, sections: [] },
    availability: "actively_looking",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  it("calculates 0% completion when all optional fields and sub-sections are empty", () => {
    const audit = calculateProfileCompletion(
      emptyProfile,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      null,
    );

    expect(audit.percentage).toBe(0);
    expect(audit.completedSections).toHaveLength(0);
    expect(audit.missingSections).toHaveLength(10);
  });

  it("calculates partial completion when personal and preferences are provided", () => {
    const profileWithPersonal: Profile = {
      ...emptyProfile,
      personal: {
        ...emptyProfile.personal,
        firstName: "Jane",
        lastName: "Doe",
      },
      contact: {
        ...emptyProfile.contact,
        phone: "+1234567890",
      },
    };

    const preferences = {
      id: "pref-1",
      userId: "usr-1",
      preferredRole: "Frontend Engineer",
      employmentType: "full-time" as const,
      preferredLocation: "San Francisco",
      workMode: "remote" as const,
      expectedSalary: "120000",
      currency: "USD",
      noticePeriod: "Immediate",
      openToWork: true,
      visaSponsorshipRequired: false,
      relocationWillingness: true,
      preferredIndustry: "Tech",
      preferredCompanySize: "Startup",
      preferredShift: "Day",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const audit = calculateProfileCompletion(
      profileWithPersonal,
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      preferences,
    );

    // personal (15) + contact (10) + preferences (10) = 35%
    expect(audit.percentage).toBe(35);
    expect(audit.completedSections.map((s) => s.id)).toEqual([
      "personal",
      "contact",
      "preferences",
    ]);
  });

  it("calculates 100% completion when all 10 sections are populated", () => {
    const completeProfile: Profile = {
      ...emptyProfile,
      personal: {
        ...emptyProfile.personal,
        firstName: "Jane",
        lastName: "Doe",
      },
      contact: {
        ...emptyProfile.contact,
        phone: "+1234567890",
      },
    };

    const dummySkill = {
      id: "sk-1",
      name: "TypeScript",
      category: "Programming Language",
      level: "advanced" as const,
      yearsOfExperience: 5,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyEdu = {
      id: "edu-1",
      institution: "MIT",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Computer Science",
      location: "Cambridge, MA",
      startDate: "2018-09-01",
      endDate: "2022-05-30",
      currentStudy: false,
      cgpa: "3.9",
      description: "Graduated with honors",
      highestEducation: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyExp = {
      id: "exp-1",
      jobTitle: "Senior Software Engineer",
      companyName: "Acme Corp",
      employmentType: "full-time" as const,
      location: "Remote",
      workMode: "remote" as const,
      startDate: "2022-06-01",
      endDate: null,
      currentPosition: true,
      description: "Building scalable frontend web apps",
      technologiesUsed: ["React", "TypeScript", "Next.js"],
      responsibilities: ["Lead engineering team"],
      achievements: ["Increased perf by 40%"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyProject = {
      id: "proj-1",
      title: "AI Agent",
      shortDescription: "Autonomous career agent",
      description: "Full-stack AI powered career copilot",
      techStack: ["Next.js", "NestJS", "PostgreSQL"],
      githubUrl: "https://github.com/example/repo",
      liveDemoUrl: "https://demo.example.com",
      imageUrl: null,
      role: "Lead Architect",
      category: "Full Stack" as const,
      startDate: "2024-01-01",
      endDate: null,
      currentlyWorking: true,
      featured: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyCert = {
      id: "cert-1",
      name: "AWS Certified Solutions Architect",
      issuingOrganization: "Amazon Web Services",
      issueDate: "2023-01-01",
      expiryDate: null,
      credentialId: "AWS-123456",
      credentialUrl: "https://aws.amazon.com/verify/123",
      neverExpires: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyLang = {
      id: "lang-1",
      language: "English",
      readingLevel: "fluent" as const,
      writingLevel: "fluent" as const,
      speakingLevel: "native" as const,
      nativeLanguage: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummySocial = {
      id: "soc-1",
      platform: "github" as const,
      url: "https://github.com/janedoe",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const dummyPref = {
      id: "pref-1",
      userId: "usr-1",
      preferredRole: "Principal Engineer",
      employmentType: "full-time" as const,
      preferredLocation: "Remote",
      workMode: "remote" as const,
      expectedSalary: "180000",
      currency: "USD",
      noticePeriod: "1 month",
      openToWork: true,
      visaSponsorshipRequired: false,
      relocationWillingness: false,
      preferredIndustry: "Software",
      preferredCompanySize: "Series A-C",
      preferredShift: "Day",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const audit = calculateProfileCompletion(
      completeProfile,
      [dummySkill],
      [dummyEdu],
      [dummyExp],
      [dummyProject],
      [dummyCert],
      [dummyLang],
      [dummySocial],
      dummyPref,
    );

    expect(audit.percentage).toBe(100);
    expect(audit.completedSections).toHaveLength(10);
    expect(audit.missingSections).toHaveLength(0);
  });
});
