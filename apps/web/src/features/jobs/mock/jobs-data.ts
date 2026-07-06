import type { Job, Company, ExperienceLevel, RemoteType, EmploymentType } from "../types/jobs.types";

export const mockCompanies: Company[] = [
  {
    id: "co_linear",
    name: "Linear Labs",
    logoUrl: null,
    website: "https://linear.app",
    industry: "AI & Productivity",
    fundingStage: "series-a",
    companySize: "11-50",
    headquarters: "San Francisco, CA",
    techStack: ["Next.js", "React", "TypeScript", "Node.js", "PostgreSQL"],
    cultureDescription: "Craft-oriented, high autonomy, quality-first design principles.",
    benefitsList: ["Full Medical", "Remote Budget", "Learning Allowance", "Equity"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/linear", linkedin: "https://linkedin.com/company/linear" },
    openPositionsCount: 12,
    createdAt: "2023-01-10T00:00:00Z",
    updatedAt: "2026-01-10T00:00:00Z"
  },
  {
    id: "co_cloudscale",
    name: "CloudScale Systems",
    logoUrl: null,
    website: "https://cloudscale.net",
    industry: "Cloud Infrastructure",
    fundingStage: "ipo",
    companySize: "500+",
    headquarters: "Austin, TX",
    techStack: ["Go", "Kubernetes", "AWS", "Rust", "Terraform"],
    cultureDescription: "Scale-driven, telemetry-obsessed, highly collaborative infrastructure experts.",
    benefitsList: ["401k Matching", "Unlimited PTO", "On-site Gym", "Conference Budgets"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/cloudscale", linkedin: "https://linkedin.com/company/cloudscale" },
    openPositionsCount: 25,
    createdAt: "2015-05-14T00:00:00Z",
    updatedAt: "2026-05-14T00:00:00Z"
  },
  {
    id: "co_pixelperfect",
    name: "PixelPerfect UI",
    logoUrl: null,
    website: "https://pixelperfect.design",
    industry: "Design & UX Tools",
    fundingStage: "series-c",
    companySize: "201-500",
    headquarters: "New York, NY",
    techStack: ["React", "TypeScript", "TailwindCSS", "WebAssembly", "Rust"],
    cultureDescription: "Design-first, detail-focused, interactive canvas creators.",
    benefitsList: ["Workspace Stipend", "Health & Wellness Allowance", "Stock Options", "Remote Friendly"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/pixelperfect", linkedin: "https://linkedin.com/company/pixelperfect" },
    openPositionsCount: 15,
    createdAt: "2019-08-20T00:00:00Z",
    updatedAt: "2026-08-20T00:00:00Z"
  },
  {
    id: "co_byteflow",
    name: "ByteFlow Finance",
    logoUrl: null,
    website: "https://byteflow.io",
    industry: "Fintech",
    fundingStage: "series-b",
    companySize: "51-200",
    headquarters: "Bengaluru, India",
    techStack: ["Python", "Django", "React", "PostgreSQL", "Redis", "Kafka"],
    cultureDescription: "Fast-moving, metrics-driven, secure banking infrastructure developers.",
    benefitsList: ["Health Insurance", "Performance Bonuses", "Flexible Hours", "Gym Memberships"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/byteflow", linkedin: "https://linkedin.com/company/byteflow" },
    openPositionsCount: 8,
    createdAt: "2021-03-12T00:00:00Z",
    updatedAt: "2026-03-12T00:00:00Z"
  },
  {
    id: "co_roboai",
    name: "RoboAI Corp",
    logoUrl: null,
    website: "https://roboai.tech",
    industry: "AI & Robotics",
    fundingStage: "series-a",
    companySize: "11-50",
    headquarters: "Boston, MA",
    techStack: ["C++", "Python", "ROS", "PyTorch", "Docker"],
    cultureDescription: "R&D heavy, academic precision, pioneering robot logic control.",
    benefitsList: ["Relocation Package", "Premium Healthcare", "Stock Grants", "Patent Bonuses"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/roboai", linkedin: "https://linkedin.com/company/roboai" },
    openPositionsCount: 10,
    createdAt: "2022-09-05T00:00:00Z",
    updatedAt: "2026-09-05T00:00:00Z"
  },
  {
    id: "co_healthgrid",
    name: "HealthGrid",
    logoUrl: null,
    website: "https://healthgrid.com",
    industry: "Healthcare Tech",
    fundingStage: "ipo",
    companySize: "500+",
    headquarters: "Chicago, IL",
    techStack: ["Java", "Spring Boot", "Angular", "Oracle", "Azure"],
    cultureDescription: "Compliance-centered, mission-driven, patient healthcare privacy.",
    benefitsList: ["Dental & Vision", "HSA Matching", "Tuition Reimbursement", "Pension Plans"],
    isActivelyHiring: false,
    socialLinks: { linkedin: "https://linkedin.com/company/healthgrid" },
    openPositionsCount: 0,
    createdAt: "2010-11-18T00:00:00Z",
    updatedAt: "2026-11-18T00:00:00Z"
  },
  {
    id: "co_stripe_start",
    name: "Stripe Startup",
    logoUrl: null,
    website: "https://stripestartup.co",
    industry: "Fintech & Payments",
    fundingStage: "seed",
    companySize: "1-10",
    headquarters: "London, UK",
    techStack: ["Node.js", "TypeScript", "React", "MongoDB"],
    cultureDescription: "Super scrappy, shipping multiple times a day, highly autonomous builders.",
    benefitsList: ["Flexible Remote", "Laptop Budget", "Co-working Space Passes"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/stripestart" },
    openPositionsCount: 3,
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2026-04-01T00:00:00Z"
  },
  {
    id: "co_logitech",
    name: "LogiTech Solutions",
    logoUrl: null,
    website: "https://logitechsolutions.net",
    industry: "Logistics Software",
    fundingStage: "ipo",
    companySize: "500+",
    headquarters: "Seattle, WA",
    techStack: ["C#", ".NET Core", "React", "SQL Server", "Azure"],
    cultureDescription: "Process-driven, supply chain scaling, dependable logistics solutions.",
    benefitsList: ["Commuter Benefits", "Onsite Cafeteria", "Health Savings Account", "Annual Bonus"],
    isActivelyHiring: true,
    socialLinks: { linkedin: "https://linkedin.com/company/logitech" },
    openPositionsCount: 18,
    createdAt: "2008-04-20T00:00:00Z",
    updatedAt: "2026-04-20T00:00:00Z"
  },
  {
    id: "co_devopsmatrix",
    name: "DevOps Matrix",
    logoUrl: null,
    website: "https://devopsmatrix.io",
    industry: "DevOps & Automation",
    fundingStage: "series-c",
    companySize: "201-500",
    headquarters: "Seattle, WA",
    techStack: ["Go", "Rust", "Docker", "AWS", "Bash"],
    cultureDescription: "Kubernetes configuration compliance, continuous delivery automation experts.",
    benefitsList: ["Unlimited PTO", "Home Office Fund", "Stock Options", "Top Tier Healthcare"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/devopsmatrix", linkedin: "https://linkedin.com/company/devopsmatrix" },
    openPositionsCount: 14,
    createdAt: "2018-02-15T00:00:00Z",
    updatedAt: "2026-02-15T00:00:00Z"
  },
  {
    id: "co_datapulse",
    name: "DataPulse Analytics",
    logoUrl: null,
    website: "https://datapulse.ai",
    industry: "Big Data & BI",
    fundingStage: "series-a",
    companySize: "11-50",
    headquarters: "Toronto, Canada",
    techStack: ["Python", "Spark", "PostgreSQL", "Tableau", "AWS"],
    cultureDescription: "Data-informed decisions, statistics-oriented, scientific rigor.",
    benefitsList: ["Wellness Allowance", "Stock Options", "Flexible Hours", "Parental Leave"],
    isActivelyHiring: true,
    socialLinks: { github: "https://github.com/datapulse", linkedin: "https://linkedin.com/company/datapulse" },
    openPositionsCount: 7,
    createdAt: "2023-05-18T00:00:00Z",
    updatedAt: "2026-05-18T00:00:00Z"
  }
];

// Helper variables to dynamically seed 100 jobs
const titles = [
  "Software Engineer",
  "Backend Engineer",
  "Frontend Engineer",
  "Full Stack Engineer",
  "DevOps Engineer",
  "AI Engineer",
  "Data Scientist",
  "Product Manager",
  "UI/UX Designer"
];

const remoteTypes: RemoteType[] = ["remote", "hybrid", "onsite"];
const employmentTypes: EmploymentType[] = ["full-time", "part-time", "contract", "internship"];
const experienceLevels: ExperienceLevel[] = ["entry", "mid", "senior", "lead"];

const companySkills: Record<string, string[]> = {
  co_linear: ["React", "TypeScript", "Next.js", "Node.js", "GraphQL"],
  co_cloudscale: ["Go", "Kubernetes", "AWS", "Terraform", "Rust"],
  co_pixelperfect: ["React", "TypeScript", "TailwindCSS", "Figma", "CSS3"],
  co_byteflow: ["Python", "Django", "PostgreSQL", "React", "Kafka"],
  co_roboai: ["Python", "C++", "PyTorch", "ROS", "OpenCV"],
  co_healthgrid: ["Java", "Spring Boot", "Angular", "Oracle", "Azure"],
  co_stripe_start: ["Node.js", "React", "TypeScript", "MongoDB", "Stripe API"],
  co_logitech: ["C#", ".NET Core", "React", "SQL Server", "Azure"],
  co_devopsmatrix: ["Go", "Docker", "Kubernetes", "AWS", "Bash"],
  co_datapulse: ["Python", "Spark", "PostgreSQL", "Tableau", "SQL"]
};

// Seeding 100+ Jobs (Exactly 100 listings)
export const mockJobs: Job[] = [];

for (let i = 1; i <= 100; i++) {
  const company = mockCompanies[(i - 1) % mockCompanies.length];
  const title = titles[(i - 1) % titles.length];
  const remoteType = remoteTypes[i % remoteTypes.length];
  const employmentType = employmentTypes[i % employmentTypes.length];
  const experienceLevel = experienceLevels[i % experienceLevels.length];
  const skills = companySkills[company.id] || ["React", "TypeScript"];
  
  // Stagger salaries
  const baseSalary = 60000 + ((i * 137) % 12) * 12000;
  const minSalary = baseSalary;
  const maxSalary = baseSalary + 20000 + ((i * 47) % 5) * 8000;
  
  mockJobs.push({
    id: `job_seed_${i.toString().padStart(3, "0")}`,
    title,
    companyId: company.id,
    companyInfo: {
      name: company.name,
      logoUrl: company.logoUrl,
      industry: company.industry,
      website: company.website
    },
    location: remoteType === "remote" ? "Remote" : `${company.headquarters.split(",")[0]}, USA`,
    remoteType,
    employmentType,
    salaryMin: minSalary,
    salaryMax: maxSalary,
    currency: "USD",
    experienceLevel,
    skillsRequired: skills.slice(0, 3 + (i % 3)),
    benefits: company.benefitsList.slice(0, 2 + (i % 3)),
    description: `Join us as a ${title} and help us build the next generation of scalable products. You will work within an experienced group of engineers and designers using our modern stack to ship high-impact features.`,
    responsibilities: [
      `Design, implement, and support scalable components for our ${company.industry} core product.`,
      "Partner with other engineers to execute best practice code architecture conventions.",
      "Conduct code audits and participate in agile sprints."
    ],
    requirements: [
      `Minimum 2+ years of software design experience in building distributed systems.`,
      `Strong proficiency with: ${skills.slice(0, 2).join(", ")}.`,
      "Excellent communication skills and ability to work autonomously."
    ],
    postedDate: new Date(Date.now() - (i % 14) * 24 * 60 * 60 * 1000).toISOString(),
    expiryDate: null,
    source: i % 3 === 0 ? "wellfound" : i % 3 === 1 ? "greenhouse" : "ycombinator",
    sourceJobId: `ext_src_${i * 289}`,
    externalApplyUrl: `https://example.com/apply/job-${i}`,
    trustScore: 85 + (i % 15),
    freshnessScore: 90 - (i % 10),
    isSaved: i % 11 === 0,
    isApplied: false,
    viewedAt: null
  });
}
