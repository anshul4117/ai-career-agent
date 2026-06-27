import Link from "next/link";
import { Text } from "@/components/ui/typography";

interface AuthFooterProps {
  mainLinkText: string;
  mainLinkHref: string;
  mainLinkActionText: string;
  secondaryLinkText?: string;
  secondaryLinkHref?: string;
}

export function AuthFooter({
  mainLinkText,
  mainLinkHref,
  mainLinkActionText,
  secondaryLinkText,
  secondaryLinkHref,
}: AuthFooterProps) {
  return (
    <div className="mt-6 flex flex-col items-center gap-3 text-center border-t border-border/10 pt-4">
      <Text variant="small" className="text-xs sm:text-sm text-foreground-secondary">
        {mainLinkText}{" "}
        <Link href={mainLinkHref} className="font-bold text-primary hover:underline">
          {mainLinkActionText}
        </Link>
      </Text>

      {secondaryLinkText && secondaryLinkHref && (
        <Link
          href={secondaryLinkHref}
          className="text-xs font-semibold text-foreground-secondary hover:text-foreground hover:underline"
        >
          {secondaryLinkText}
        </Link>
      )}

      <div className="flex items-center gap-4 text-[10px] uppercase font-bold tracking-wider text-foreground-muted/60 mt-2">
        <Link href="#" className="hover:underline">
          Terms
        </Link>
        <span>·</span>
        <Link href="#" className="hover:underline">
          Privacy
        </Link>
        <span>·</span>
        <Link href="#" className="hover:underline">
          Support
        </Link>
      </div>
    </div>
  );
}
