import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean;
}

export function Logo({ className, showTagline = false }: LogoProps) {
  return (
    <Link href="/" className={cn("inline-flex flex-col gap-0.5", className)}>
      <span className="font-heading text-lg font-bold tracking-tight text-foreground">
        AI Career Agent
      </span>
      {showTagline && (
        <span className="text-xs font-medium text-foreground-muted">Career OS</span>
      )}
    </Link>
  );
}
