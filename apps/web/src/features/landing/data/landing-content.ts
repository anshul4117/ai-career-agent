export const landingHero = {
  eyebrow: "Premium AI Career Operating System",
  headline: "FIND HIGH-QUALITY JOBS.",
  headlineAccent: "NOT SPAM.",
  subheadline: "AI-powered career discovery built for serious candidates.",
  primaryCta: "Get Started",
  secondaryCta: "Watch Demo",
} as const;

export const socialProofStats = [
  { id: "jobs", label: "Total Jobs", value: "12,400+" },
  { id: "users", label: "Total Users", value: "8,200+" },
  { id: "companies", label: "Companies", value: "1,500+" },
] as const;

export const landingFeatures = [
  {
    id: "discovery",
    title: "AI Job Discovery",
    description:
      "Surface only relevant, trusted, and active opportunities — never thousands of spam listings.",
    icon: "search" as const,
  },
  {
    id: "resume",
    title: "Resume Optimization",
    description:
      "ATS-friendly resume improvements tailored to each role you pursue.",
    icon: "file" as const,
  },
  {
    id: "cover-letter",
    title: "Cover Letter Generation",
    description: "Personalized cover letters crafted from your profile and the job description.",
    icon: "mail" as const,
  },
  {
    id: "matching",
    title: "Job Matching",
    description:
      "Understand match scores, skill gaps, and AI recommendations before you apply.",
    icon: "target" as const,
  },
  {
    id: "tracking",
    title: "Application Tracking",
    description: "Manage your entire job search pipeline from saved to offer in one place.",
    icon: "clipboard" as const,
  },
] as const;

export const howItWorksSteps = [
  {
    step: 1,
    title: "Create Profile",
    description: "Build a structured candidate profile with skills, experience, and goals.",
  },
  {
    step: 2,
    title: "Upload Resume",
    description: "Let AI extract skills, education, and projects into your profile.",
  },
  {
    step: 3,
    title: "Find Jobs",
    description: "Browse quality-ranked opportunities matched to your profile.",
  },
  {
    step: 4,
    title: "Apply Faster",
    description: "Optimize materials, generate cover letters, and track every application.",
  },
] as const;

export const faqItems = [
  {
    id: "faq-1",
    question: "How is this different from other job boards?",
    answer:
      "We prioritize quality over quantity. Every job is scored for freshness, trust, and relevance to your profile — so you spend less time filtering spam and more time preparing for interviews.",
  },
  {
    id: "faq-2",
    question: "Do you auto-apply to jobs?",
    answer:
      "Not in Version 1. You stay in control of every application. We help you discover, match, and prepare — you decide what to submit.",
  },
  {
    id: "faq-3",
    question: "Which job sources do you support?",
    answer:
      "At launch we integrate Wellfound, YC Jobs, Internshala, and company career pages. LinkedIn, Naukri, and Indeed are planned for future releases.",
  },
  {
    id: "faq-4",
    question: "Who is AI Career Agent built for?",
    answer:
      "Students, fresh graduates, and technology professionals who want a serious, quality-first job search — not another overwhelming job board.",
  },
] as const;

export const footerLinks = [
  { title: "About", href: "#" },
  { title: "Contact", href: "#" },
  { title: "Privacy Policy", href: "#" },
  { title: "Terms", href: "#" },
] as const;

export const landingNavLinks = [
  { title: "Features", href: "#features" },
  { title: "How It Works", href: "#how-it-works" },
  { title: "FAQ", href: "#faq" },
] as const;
