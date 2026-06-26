import Link from "next/link";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { landingNavLinks } from "@/features/landing/data/landing-content";

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b-[3px] border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:h-[72px] md:px-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex" aria-label="Landing page">
          {landingNavLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-foreground-secondary transition-colors hover:text-foreground"
            >
              {link.title}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Button variant="ghost" size="sm" className="hidden sm:inline-flex" asChild>
            <Link href={siteConfig.links.login}>Login</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href={siteConfig.links.register}>Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
