import Link from "next/link";
import { ArrowRight, Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Text, Heading } from "@/components/ui/typography";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/features/landing/data/landing-content";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-secondary px-4 py-16 border-t-[3px] border-border" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-6xl space-y-12">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12">
          {/* Logo & Description */}
          <div className="lg:col-span-5 space-y-4">
            <h2 id="footer-heading" className="sr-only">
              Footer
            </h2>
            <Logo showTagline />
            <Text variant="small" className="max-w-md leading-relaxed">
              {siteConfig.description}
            </Text>
            <div className="pt-2">
              <BrutalButton size="default" className="text-sm font-bold uppercase tracking-wide" asChild>
                <Link href={siteConfig.links.register}>
                  Get Started
                  <ArrowRight className="h-4 w-4 ml-1.5" aria-hidden="true" />
                </Link>
              </BrutalButton>
            </div>
          </div>

          {/* Nav Links Column 1: Navigation */}
          <nav className="lg:col-span-2 space-y-4" aria-label="Footer main navigation">
            <Heading level="h5" className="text-sm font-bold uppercase tracking-wider text-foreground">
              Navigation
            </Heading>
            <ul className="space-y-3" role="list">
              {footerLinks.navigation.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Nav Links Column 2: Resources */}
          <nav className="lg:col-span-2 space-y-4" aria-label="Footer resources">
            <Heading level="h5" className="text-sm font-bold uppercase tracking-wider text-foreground">
              Resources
            </Heading>
            <ul className="space-y-3" role="list">
              {footerLinks.resources.map((link) => (
                <li key={link.title}>
                  {link.href === "#" ? (
                    <span className="text-sm font-medium text-foreground-muted cursor-not-allowed">
                      {link.title}
                    </span>
                  ) : (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground hover:underline"
                    >
                      {link.title}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          {/* Nav Links Column 3: Legal */}
          <nav className="lg:col-span-3 space-y-4" aria-label="Footer legal links">
            <Heading level="h5" className="text-sm font-bold uppercase tracking-wider text-foreground">
              Legal
            </Heading>
            <ul className="space-y-3" role="list">
              {footerLinks.legal.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground hover:underline"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t-[3px] border-border pt-8 text-sm text-foreground-muted sm:flex-row">
          <Text variant="small">
            © {year} {siteConfig.name}. All rights reserved.
          </Text>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/anshul4117/ai-career-agent"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/anshul4117"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="Twitter / X"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/anshul-ab7135245/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-muted hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
          <Text variant="small" className="font-semibold text-foreground-secondary uppercase tracking-wider">
            Quality over quantity.
          </Text>
        </div>
      </div>
    </footer>
  );
}
