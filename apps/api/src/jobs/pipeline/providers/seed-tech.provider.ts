import { Injectable } from "@nestjs/common";
import { IJobProvider, JobProviderQueryParams } from "./job-provider.interface";
import { RawJobInput } from "../types/job-pipeline.types";

@Injectable()
export class SeedTechJobProvider implements IJobProvider {
  readonly providerName = "SEED_TECH";

  async fetchJobs(params?: JobProviderQueryParams): Promise<RawJobInput[]> {
    const rawJobs: RawJobInput[] = [
      {
        externalId: "razorpay-sde-frontend-01",
        source: "COMPANY",
        title: "Senior Frontend Engineer - Checkout & Core Payments",
        companyName: "Razorpay",
        companyWebsite: "https://razorpay.com",
        companyLogo:
          "https://cdn.iconscout.com/icon/free/png-256/free-razorpay-logo-icon-download-in-svg-png-gif-file-formats--payment-gateway-brand-social-media-pack-logos-icons-226444.png?f=webp&w=128",
        location: "Bangalore, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        salaryMin: 2800000,
        salaryMax: 4200000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Razorpay
Razorpay is India's leading fintech unicorn powering online and in-person payments for millions of businesses, processing hundreds of billions in annual transaction volume.

### Key Responsibilities
- Architect, build, and optimize the Razorpay Standard Checkout SDK used by over 500,000+ merchants across web and mobile browsers.
- Drive bundle size reduction to sub-80KB and achieve sub-second checkout render times across low-bandwidth 4G networks.
- Design accessible, cross-browser payment forms supporting UPI, Netbanking, Credit/Debit cards, EMI, and Wallets.
- Collaborate with security teams on PCI-DSS Level 1 compliance, tokenization, and anti-fraud browser heuristics.

### Requirements & Qualifications
- 4+ years of hands-on frontend software engineering experience with JavaScript and TypeScript.
- Strong proficiency in React, Web Performance profiling (DevTools, Lighthouse), and browser networking (Fetch, WebSockets).
- Experience building SDKs, widgets, or embeddable iframes with zero third-party script leakage.
- Deep understanding of State Management, CSS architecture, and Responsive Design.

### Benefits & Perks
- Market-leading CTC and ESOP equity grants.
- Medical insurance of ₹10,00,000 covering employee, spouse, children, and parents.
- Flexible hybrid working policy with home office reimbursement.
- Annual learning stipend for conferences, books, and courses.`,
        applyUrl: "https://razorpay.com/jobs/senior-frontend-engineer-checkout",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 14), // 14 hours ago
        skillsRaw: [
          "React",
          "TypeScript",
          "JavaScript",
          "Web Performance",
          "Next.js",
          "SDK",
          "REST",
          "TailwindCSS",
        ],
      },
      {
        externalId: "cred-backend-dist-02",
        source: "COMPANY",
        title: "Backend Engineer - Distributed Financial Ledgers",
        companyName: "CRED",
        companyWebsite: "https://cred.club",
        companyLogo:
          "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=60",
        location: "Bangalore, India",
        workMode: "ONSITE",
        employmentType: "FULL_TIME",
        salaryMin: 3200000,
        salaryMax: 5000000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About CRED
CRED is a transparent financial club of trustworthy individuals, offering credit card management, UPI peer payments, digital banking, and luxury commerce.

### Responsibilities
- Design, scale, and maintain high-throughput distributed transaction ledgers handling tens of thousands of requests per second.
- Implement strict ACID transactions, double-entry bookkeeping safeguards, and event-sourcing pipelines.
- Build fault-tolerant microservices with Go or Java/Kotlin, backed by PostgreSQL, DynamoDB, and Kafka.
- Ensure 99.999% availability for real-time payment settlement and credit line disbursement engines.

### Requirements
- 3+ years of backend engineering experience building mission-critical distributed systems.
- Deep expertise in relational databases (PostgreSQL), index tuning, query plan analysis, and connection pooling.
- Hands-on experience with Kafka event streaming, Redis caching patterns, and Docker/Kubernetes container orchestration.
- Solid grounding in data structures, algorithms, and concurrency models.

### What CRED Offers
- Top 1% compensation in the Indian tech ecosystem with wealth-generating ESOPs.
- Gourmet meals, barista coffee, and premium wellness facilities at CRED headquarters in Indiranagar.
- Comprehensive health, mental wellness, and life insurance benefits.`,
        applyUrl: "https://careers.cred.club/job/backend-engineer-ledger",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 22), // 22 hours ago
        skillsRaw: [
          "Go",
          "Node.js",
          "PostgreSQL",
          "Kafka",
          "Distributed Systems",
          "Redis",
          "Docker",
          "Kubernetes",
          "AWS",
        ],
      },
      {
        externalId: "swiggy-sde2-platform-03",
        source: "COMPANY",
        title: "Software Development Engineer II (SDE-2) - Platform",
        companyName: "Swiggy",
        companyWebsite: "https://swiggy.com",
        companyLogo:
          "https://images.unsplash.com/photo-1526367790999-0150786686a2?w=100&auto=format&fit=crop&q=60",
        location: "Bangalore, India",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        salaryMin: 2500000,
        salaryMax: 3800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Swiggy
Swiggy is India's leading on-demand convenience platform, connecting millions of consumers with restaurants, grocery stores (Instamart), and delivery partners.

### What You Will Do
- Build robust backend microservices powering real-time order tracking, route optimization, and delivery partner dispatch.
- Scale our event-driven architecture using Kafka, RabbitMQ, and AWS SQS/SNS to handle peak weekend order volumes.
- Optimize database schemas and caching strategies across PostgreSQL and DynamoDB.
- Write clean, maintainable, and well-tested code with unit and integration test coverage exceeding 85%.

### Requirements
- 2-5 years of software development experience with Java, Go, or Node.js / TypeScript.
- Strong problem-solving skills with practical knowledge of design patterns and system architecture.
- Demonstrated experience designing RESTful APIs and asynchronous message-driven queues.
- Familiarity with CI/CD, Git workflows, and cloud deployments on AWS.

### Benefits
- "Future of Work" policy with flexible remote working options.
- Industry-standard health insurance for immediate and extended family.
- Generous annual paid time off and wellness leave.`,
        applyUrl: "https://careers.swiggy.com/job/sde2-platform-engineering",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 30), // 30 hours ago
        skillsRaw: [
          "Java",
          "Go",
          "Node.js",
          "TypeScript",
          "Kafka",
          "PostgreSQL",
          "AWS",
          "Microservices",
          "Docker",
        ],
      },
      {
        externalId: "postman-fullstack-cloud-04",
        source: "COMPANY",
        title: "Full Stack Engineer - API Workspace & Observability",
        companyName: "Postman",
        companyWebsite: "https://postman.com",
        companyLogo:
          "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=100&auto=format&fit=crop&q=60",
        location: "Bangalore / Remote, India",
        workMode: "REMOTE",
        employmentType: "FULL_TIME",
        salaryMin: 3000000,
        salaryMax: 4500000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About Postman
Postman is the world's leading API platform used by more than 30 million developers and 500,000 organizations worldwide to design, test, document, and collaborate on APIs.

### Responsibilities
- Develop interactive, real-time collaboration tools in the Postman web and desktop applications using React, TypeScript, and Node.js.
- Build resilient backend microservices handling high-frequency API telemetry, mock servers, and automated collection monitors.
- Collaborate with open-source communities and integrate OpenAPI, GraphQL, and gRPC specification standards.
- Benchmark frontend rendering speed and reduce memory consumption on large API collection trees.

### Qualifications
- 3+ years of professional full-stack web development experience.
- Strong expertise with TypeScript, React, Node.js, and modern CSS/styled systems.
- Experience with real-time architectures (WebSockets, Server-Sent Events, WebRTC).
- Practical experience with cloud architecture on AWS or GCP.

### Perks
- Fully remote work environment with global offsite retreats.
- Ergonomic workspace setup budget + monthly high-speed internet stipend.
- Comprehensive medical insurance with mental healthcare support.`,
        applyUrl:
          "https://www.postman.com/company/careers/open-positions/fullstack-engineer",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
        skillsRaw: [
          "TypeScript",
          "React",
          "Node.js",
          "GraphQL",
          "REST",
          "WebSockets",
          "Docker",
          "AWS",
          "Jest",
        ],
      },
      {
        externalId: "browserstack-devops-infra-05",
        source: "COMPANY",
        title: "Senior Infrastructure & Cloud DevOps Engineer",
        companyName: "BrowserStack",
        companyWebsite: "https://browserstack.com",
        companyLogo:
          "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=100&auto=format&fit=crop&q=60",
        location: "Mumbai, India",
        workMode: "HYBRID",
        employmentType: "FULL_TIME",
        salaryMin: 3200000,
        salaryMax: 4800000,
        currency: "INR",
        salaryPeriod: "YEARLY",
        description: `### About BrowserStack
BrowserStack is the global leader in software testing, powering more than 2 million tests every day across 15 global data centers for customers like Microsoft, Twitter, and Spotify.

### Responsibilities
- Manage and scale thousands of bare-metal and cloud Kubernetes clusters hosting mobile devices and desktop browser VMs.
- Automate zero-downtime infrastructure provisioning using Terraform, Ansible, and Helm.
- Build real-time telemetry, Prometheus alerting, and Grafana observability pipelines for sub-second incident detection.
- Implement security hardening, network isolation (VPC, Calico), and automated vulnerability scanning.

### Requirements
- 4+ years of DevOps / Site Reliability Engineering (SRE) experience managing production infrastructure at scale.
- Deep expertise in Kubernetes, Linux internals, networking (TCP/IP, BGP, DNS), and container runtimes (containerd/Docker).
- Proficiency in scripting with Python, Bash, or Go.
- Proven experience with Infrastructure as Code (Terraform) and CI/CD pipelines (GitLab/GitHub Actions).

### Benefits
- Lucrative compensation package with performance bonus and stock incentives.
- Comprehensive health insurance covering self, spouse, children, and dependent parents.
- Hybrid working options with state-of-the-art office spaces in Mumbai.`,
        applyUrl: "https://www.browserstack.com/careers/senior-devops-engineer",
        postedAt: new Date(Date.now() - 1000 * 60 * 60 * 18), // 18 hours ago
        skillsRaw: [
          "Kubernetes",
          "Docker",
          "Terraform",
          "Linux",
          "Python",
          "Go",
          "AWS",
          "CI/CD",
          "Prometheus",
        ],
      },
    ];

    if (params?.query) {
      const q = params.query.toLowerCase();
      return rawJobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.description.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.skillsRaw?.some((s) => s.toLowerCase().includes(q)),
      );
    }

    return rawJobs;
  }
}
