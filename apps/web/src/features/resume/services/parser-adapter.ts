import type { ParserAdapter, ExtractedData, SectionConfidence } from "../types/parser.types";

export class MockParserAdapter implements ParserAdapter {
  async parseResume(
    fileName: string,
    rolePreset: "engineer" | "frontend" | "backend" | "fullstack" | "analyst"
  ): Promise<{ data: ExtractedData; confidence: SectionConfidence }> {
    // Simulate API processing network latency (1.8s)
    await new Promise((resolve) => setTimeout(resolve, 1800));

    const mockData = this.getMockPreset(rolePreset);
    const confidence = this.getMockConfidence(rolePreset);

    return {
      data: mockData,
      confidence
    };
  }

  private getMockPreset(role: string): ExtractedData {
    const defaultData: ExtractedData = {
      personal: {
        firstName: "Alex",
        lastName: "Rivera",
        headline: "Software Engineer",
        email: "alex.rivera@example.com",
        phone: "+1 (555) 019-2834",
        city: "San Francisco",
        country: "USA"
      },
      summary: {
        summary: "Passionate developer focused on building high-performance scalable systems."
      },
      skills: [
        { id: "s1", name: "JavaScript", yearsOfExperience: "5", level: "expert" },
        { id: "s2", name: "React", yearsOfExperience: "3", level: "expert" }
      ],
      experience: [
        {
          id: "exp1",
          companyName: "TechCorp Inc.",
          jobTitle: "Software Developer",
          location: "San Francisco, CA",
          startDate: "2023-01",
          endDate: "",
          currentPosition: true,
          description: "Led development of core front-facing systems and optimized load times by 20%."
        }
      ],
      education: [
        {
          id: "edu1",
          institution: "State University",
          degree: "B.S.",
          fieldOfStudy: "Computer Science",
          startDate: "2019-09",
          endDate: "2023-05",
          currentStudy: false,
          cgpa: "3.8"
        }
      ],
      projects: [
        {
          id: "proj1",
          title: "Metrics Dashboard",
          role: "Lead Creator",
          description: "Built custom tracking dashboard mapping live pipeline status.",
          techStack: ["React", "TypeScript", "Node"]
        }
      ],
      certifications: [
        {
          id: "cert1",
          name: "AWS Certified Developer",
          issuingOrganization: "Amazon Web Services",
          issueDate: "2023-11"
        }
      ],
      languages: [
        { id: "lang1", language: "English", speakingLevel: "Native", nativeLanguage: true },
        { id: "lang2", language: "Spanish", speakingLevel: "Conversational", nativeLanguage: false }
      ],
      socialLinks: [
        { id: "sl1", platform: "GitHub", url: "https://github.com/alexrivera" },
        { id: "sl2", platform: "LinkedIn", url: "https://linkedin.com/in/alexrivera" }
      ]
    };

    if (role === "engineer") {
      return {
        ...defaultData,
        personal: {
          ...defaultData.personal,
          headline: "Senior Software Engineer (Systems)"
        },
        summary: {
          summary: "Principal developer specializing in backend cloud infrastructure, system performance tuning, and high-throughput transactional architectures. Experienced in building distributed serverless microservices with AWS and Go."
        },
        skills: [
          { id: "s1", name: "Go (Golang)", yearsOfExperience: "6", level: "expert" },
          { id: "s2", name: "AWS (ECS, Lambda, RDS)", yearsOfExperience: "5", level: "expert" },
          { id: "s3", name: "Docker & Kubernetes", yearsOfExperience: "4", level: "expert" },
          { id: "s4", name: "System Architecture", yearsOfExperience: "6", level: "expert" },
          { id: "s5", name: "PostgreSQL", yearsOfExperience: "5", level: "intermediate" }
        ],
        experience: [
          {
            id: "exp1",
            companyName: "CloudScale Infrastructures",
            jobTitle: "Senior Systems Engineer",
            location: "Austin, TX (Remote)",
            startDate: "2021-08",
            endDate: "",
            currentPosition: true,
            description: "Architected distributed message processing queue handling 100k+ requests per second. Migrated legacy monolith systems to serverless ECS cluster, reducing cloud overhead spendings by 35%."
          },
          {
            id: "exp2",
            companyName: "DevFlow Automation",
            jobTitle: "Software Engineer II",
            location: "San Jose, CA",
            startDate: "2019-06",
            endDate: "2021-07",
            currentPosition: false,
            description: "Developed custom CI/CD deployment orchestrations. Managed Postgres database optimizations, indexing schemas to resolve slow query latencies."
          }
        ],
        projects: [
          {
            id: "proj1",
            title: "Distributed Cron Daemon",
            role: "Principal Author",
            description: "Open-source Go library providing fault-tolerant job schedules across cluster pods.",
            techStack: ["Go", "Redis", "gRPC"]
          }
        ]
      };
    }

    if (role === "frontend") {
      return {
        ...defaultData,
        personal: {
          ...defaultData.personal,
          headline: "Lead Frontend Engineer"
        },
        summary: {
          summary: "UX-centric frontend specialist dedicated to engineering beautiful responsive web client interfaces. Expert in React, Next.js, tailwind layout queries, and visual accessibility standards (WCAG AA compliance)."
        },
        skills: [
          { id: "s1", name: "React & Next.js", yearsOfExperience: "5", level: "expert" },
          { id: "s2", name: "TypeScript", yearsOfExperience: "4", level: "expert" },
          { id: "s3", name: "TailwindCSS & CSS3", yearsOfExperience: "5", level: "expert" },
          { id: "s4", name: "Figma to Code Layouts", yearsOfExperience: "3", level: "expert" },
          { id: "s5", name: "Web Accessibility (WCAG)", yearsOfExperience: "2", level: "intermediate" }
        ],
        experience: [
          {
            id: "exp1",
            companyName: "PixelPerfect Labs",
            jobTitle: "Senior Frontend Engineer",
            location: "San Francisco, CA",
            startDate: "2022-03",
            endDate: "",
            currentPosition: true,
            description: "Redesigned core onboarding flows with Next.js, increasing profile conversion scores by 18%. Standardized responsive CSS modules across internal design systems."
          }
        ],
        projects: [
          {
            id: "proj1",
            title: "Glassmorphic Component Kit",
            role: "Sole Contributor",
            description: "Modular Brutalist React component library featuring hard shadow offsets and CSS variable theme customization.",
            techStack: ["React", "TypeScript", "Tailwind"]
          }
        ]
      };
    }

    if (role === "backend") {
      return {
        ...defaultData,
        personal: {
          ...defaultData.personal,
          headline: "Backend & API Engineer"
        },
        summary: {
          summary: "Data-driven backend engineer focused on Node.js core, Express RESTful endpoints, SQL/NoSQL databases, cache optimization, and microservice mesh communications."
        },
        skills: [
          { id: "s1", name: "Node.js & Express", yearsOfExperience: "5", level: "expert" },
          { id: "s2", name: "MongoDB & Redis", yearsOfExperience: "4", level: "expert" },
          { id: "s3", name: "SQL Databases (Postgres)", yearsOfExperience: "4", level: "expert" },
          { id: "s4", name: "GraphQL APIs", yearsOfExperience: "3", level: "intermediate" }
        ],
        experience: [
          {
            id: "exp1",
            companyName: "SecureData Networks",
            jobTitle: "Backend Developer",
            location: "Denver, CO",
            startDate: "2020-05",
            endDate: "",
            currentPosition: true,
            description: "Created backend authentication tokens pipeline. Managed database migrations, executing zero-downtime releases."
          }
        ],
        projects: [
          {
            id: "proj1",
            title: "Rate Limiter Cache",
            role: "Co-developer",
            description: "Distributed middleware module restricting server queries via sliding window Redis keys.",
            techStack: ["Node.js", "Redis", "Express"]
          }
        ]
      };
    }

    if (role === "fullstack") {
      return {
        ...defaultData,
        personal: {
          ...defaultData.personal,
          headline: "Full Stack Engineer"
        },
        summary: {
          summary: "Versatile product architect building full stack SaaS products from scratch. Fluent in Next.js Server Components, PostgreSQL database schemas, and Vercel pipeline serverless cloud environments."
        },
        skills: [
          { id: "s1", name: "Next.js & React", yearsOfExperience: "4", level: "expert" },
          { id: "s2", name: "TypeScript & Node", yearsOfExperience: "4", level: "expert" },
          { id: "s3", name: "Prisma ORM & SQL", yearsOfExperience: "3", level: "expert" },
          { id: "s4", name: "REST API Integration", yearsOfExperience: "4", level: "expert" }
        ],
        experience: [
          {
            id: "exp1",
            companyName: "SaaS Launchpad Co.",
            jobTitle: "Lead Full Stack Engineer",
            location: "Remote (Boston, MA)",
            startDate: "2022-10",
            endDate: "",
            currentPosition: true,
            description: "Shipped three standalone web applications from concept to production launch, integrating Stripe subscription configurations."
          }
        ],
        projects: [
          {
            id: "proj1",
            title: "Subscription Billing Portal",
            role: "Developer",
            description: "Secure customer checkout billing page utilizing Prisma queries and Stripe webhooks.",
            techStack: ["Next.js", "Prisma", "Postgres", "Stripe"]
          }
        ]
      };
    }

    if (role === "analyst") {
      return {
        ...defaultData,
        personal: {
          ...defaultData.personal,
          firstName: "Diana",
          lastName: "Chen",
          headline: "Senior Data & Analytics Specialist"
        },
        summary: {
          summary: "Data analyst specializing in parsing customer behavior data, compiling predictive pipelines via Python Pandas, and building business dashboard portals using Tableau and SQL query aggregates."
        },
        skills: [
          { id: "s1", name: "SQL (BigQuery, Redshift)", yearsOfExperience: "5", level: "expert" },
          { id: "s2", name: "Python (Pandas, NumPy)", yearsOfExperience: "4", level: "expert" },
          { id: "s3", name: "Tableau & PowerBI", yearsOfExperience: "4", level: "expert" },
          { id: "s4", name: "Data Modeling & Cleaning", yearsOfExperience: "4", level: "expert" }
        ],
        experience: [
          {
            id: "exp1",
            companyName: "Insight Capital Analytics",
            jobTitle: "Senior Business Intelligence Analyst",
            location: "Chicago, IL",
            startDate: "2021-01",
            endDate: "",
            currentPosition: true,
            description: "Designed executive dashboards tracking live retention metrics, supporting critical product decisions."
          }
        ],
        projects: [
          {
            id: "proj1",
            title: "Cohort Churn Models",
            role: "Lead Analyst",
            description: "Statistical pipeline predicting user unsubscribe triggers based on in-app session latencies.",
            techStack: ["Python", "Jupyter", "SQL"]
          }
        ]
      };
    }

    return defaultData;
  }

  private getMockConfidence(role: string): SectionConfidence {
    const baseConfidence: SectionConfidence = {
      personal: 98,
      summary: 95,
      skills: 91,
      experience: 88,
      education: 94,
      projects: 78, // Needs review
      certifications: 89,
      languages: 92,
      socialLinks: 96
    };

    if (role === "analyst") {
      return {
        ...baseConfidence,
        projects: 72, // low confidence
        experience: 84 // borderline low confidence
      };
    }

    if (role === "engineer") {
      return {
        ...baseConfidence,
        projects: 81,
        experience: 90
      };
    }

    return baseConfidence;
  }
}
export const mockParserAdapter = new MockParserAdapter();
