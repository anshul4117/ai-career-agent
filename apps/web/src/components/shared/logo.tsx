import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  showTagline?: boolean; // Kept for backwards compatibility
  iconOnly?: boolean;
  variant?: "default" | "monochrome-dark" | "monochrome-light";
  href?: string;
}

export function Logo({
  className,
  iconOnly = false,
  variant = "default",
  href = "/",
}: LogoProps) {
  // Select asset path based on variant and iconOnly mode
  let src = "/logo.svg";
  let width = 144;
  let height = 40;

  if (iconOnly) {
    width = 43;
    height = 36;
    if (variant === "monochrome-dark") {
      src = "/icon-black.svg";
    } else if (variant === "monochrome-light") {
      src = "/icon-white.svg";
    } else {
      src = "/favicon.svg";
    }
  } else {
    if (variant === "monochrome-dark") {
      src = "/logo-black.svg";
    } else if (variant === "monochrome-light") {
      src = "/logo-white.svg";
    } else {
      src = "/logo.svg";
    }
  }

  return (
    <Link href={href} className={cn("inline-flex items-center select-none", className)}>
      <Image
        src={src}
        alt="AI Career Agent Logo"
        width={width}
        height={height}
        priority
        className={cn(
          iconOnly ? "h-9 w-auto shrink-0" : "h-10 w-auto shrink-0"
        )}
      />
    </Link>
  );
}
