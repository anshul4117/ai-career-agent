export const landingHero = {
  eyebrow: "Premium AI Career Operating System",
  headline: "FIND HIGH-QUALITY JOBS.",
  headlineAccent: "NOT SPAM.",
  subheadline: "AI-powered career operating system built for serious candidates. Zero ghost jobs, zero duplicates, and automatic resume customization.",
  primaryCta: "Get Started",
  secondaryCta: "Watch Demo",
} as const;

export const announcementBar = {
  text: "🚀 Now building the future of job discovery. Find high-quality jobs, not spam.",
} as const;

export const socialProofStats = [
  { id: "jobs", label: "Curated Jobs", value: "5,000+" },
  { id: "companies", label: "Companies", value: "300+" },
  { id: "match", label: "AI Match Accuracy", value: "95%" },
  { id: "agent", label: "AI Agent", value: "24/7" },
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
    id: "matching",
    title: "AI Resume Match",
    description:
      "Understand match scores, skill gaps, and AI recommendations before you apply.",
    icon: "target" as const,
  },
  {
    id: "cover-letter",
    title: "Cover Letter Generator",
    description: "Personalized cover letters crafted from your profile and the job description.",
    icon: "mail" as const,
  },
  {
    id: "tracking",
    title: "Application Tracker",
    description: "Manage your entire job search pipeline from saved to offer in one place.",
    icon: "clipboard" as const,
  },
  {
    id: "spam-free",
    title: "Spam-Free Jobs",
    description:
      "Every single posting is verified active. We index only trusted sources and remove duplicate listings.",
    icon: "shield" as const,
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
    title: "Discover Jobs",
    description: "Browse quality-ranked opportunities matched to your profile.",
  },
  {
    step: 4,
    title: "Apply Faster",
    description: "Optimize materials, generate cover letters, and track every application.",
  },
] as const;

export const whyChooseUs = {
  title: "AI Career Agent vs Traditional Job Boards",
  description: "Why serious candidates choose a quality-first career operating system.",
  headers: ["Feature", "AI Career Agent", "Traditional Boards"],
  rows: [
    {
      feature: "Verification",
      us: "100% verified active listings, zero ghost jobs",
      them: "Mass duplication and outdated postings",
      isUsPositive: true,
    },
    {
      feature: "Job Filtering",
      us: "AI quality score based on trust, relevance & recency",
      them: "Keyword matching and sponsored ads spam",
      isUsPositive: true,
    },
    {
      feature: "Resume Adaptability",
      us: "One-click ATS-optimization tailored to specific JDs",
      them: "Manual adjustments for every application",
      isUsPositive: true,
    },
    {
      feature: "Pipeline Tracking",
      us: "Centralized pipeline from save to offer tracking",
      them: "Siloed applications, spreadsheets & chaotic tracking",
      isUsPositive: true,
    },
  ],
} as const;

export const testimonials = [
  {
    name: "Aarav Sharma",
    role: "Frontend Engineer",
    company: "Linear Labs",
    content: "AI Career Agent cut my job search time in half. Instead of browsing thousands of ghost listings, I was recommended exactly 5 jobs that fit my profile. Got interviews for 3 of them!",
    avatarInitials: "AS",
  },
  {
    name: "Neha Patel",
    role: "B.Tech Student",
    company: "IIT Bombay",
    content: "As a student searching for summer internships, the AI Resume Match was a lifesaver. It showed me exactly what skills were missing from my resume and helped me optimize it in seconds.",
    avatarInitials: "NP",
  },
  {
    name: "Rohan Das",
    role: "Full Stack Developer",
    company: "Vercel",
    content: "The modern brutalist UI is incredibly fast, and the spam filtering actually works. This is the first career platform that focuses on developer candidate experience first.",
    avatarInitials: "RD",
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

export const footerLinks = {
  navigation: [
    { title: "Features", href: "#features" },
    { title: "How It Works", href: "#how-it-works" },
    { title: "FAQ", href: "#faq" },
  ],
  resources: [
    { title: "GitHub", href: "https://github.com/anshul4117/ai-career-agent" },
    { title: "Pricing (Soon)", href: "#" },
  ],
  legal: [
    { title: "Privacy Policy", href: "#" },
    { title: "Terms of Service", href: "#" },
  ],
} as const;

export const landingNavLinks = [
  { title: "Features", href: "#features" },
  { title: "How It Works", href: "#how-it-works" },
  { title: "FAQ", href: "#faq" },
] as const;
