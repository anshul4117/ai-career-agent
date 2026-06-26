import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  keywords: [
    "AI Career Agent",
    "Career Operating System",
    "AI Job Search",
    "Job Matching AI",
    "Resume Optimization",
    "Verified Jobs",
    "No Ghost Jobs",
    "Brutalist Tech Job Platform",
  ],
  alternates: {
    canonical: "https://aicareeragent.com",
  },
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
    url: "https://aicareeragent.com",
    siteName: siteConfig.name,
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AI Career Agent — Find High-Quality Jobs. Not Spam.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og-image.png"],
    creator: "@anshul4117",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
