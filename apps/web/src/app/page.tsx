import type { Metadata } from "next";
import { LandingPage } from "@/features/landing/components/landing-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  openGraph: {
    title: `${siteConfig.name} — ${siteConfig.tagline}`,
    description: siteConfig.description,
    type: "website",
  },
};

export default function HomePage() {
  return <LandingPage />;
}
