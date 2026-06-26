import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { footerLinks } from "@/features/landing/data/landing-content";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-surface-secondary px-4 py-16" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-12 border-b-[3px] border-border pb-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 id="footer-heading" className="sr-only">
              Footer
            </h2>
            <Logo showTagline />
            <p className="mt-4 max-w-md text-sm leading-relaxed text-foreground-secondary">
              {siteConfig.description}
            </p>
            <Button className="mt-6" asChild>
              <Link href={siteConfig.links.register}>
                Get Started
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>

          <nav aria-label="Footer">
            <p className="mb-4 text-sm font-bold uppercase tracking-wide">Links</p>
            <ul className="space-y-3" role="list">
              {footerLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm font-medium text-foreground-secondary transition-colors hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-sm text-foreground-muted sm:flex-row">
          <p>
            © {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="font-medium">Quality over quantity.</p>
        </div>
      </div>
    </footer>
  );
}
