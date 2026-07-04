import Link from "next/link";
import { Heading } from "@/components/ui/typography";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 text-center select-none">
      <BrutalCard className="p-8 max-w-md w-full border-[3px] border-border bg-surface brutal-shadow space-y-6 rounded-sm">
        <div className="inline-flex p-3 bg-red-100 border-2 border-border text-red-600 rounded-sm">
          <AlertCircle className="h-10 w-10 stroke-[2.5px]" />
        </div>
        
        <div className="space-y-2">
          <Heading level="h1" className="text-5xl font-black uppercase tracking-tighter text-foreground">
            404 Error
          </Heading>
          <Heading level="h3" className="text-xs font-black uppercase tracking-wider text-foreground-secondary">
            Page Not Found
          </Heading>
        </div>

        <p className="text-[11px] text-foreground-muted leading-relaxed font-semibold max-w-sm mx-auto">
          The page or workspace directory you are looking for does not exist, has been archived, or requires authentication.
        </p>

        <div className="pt-2 flex justify-center">
          <BrutalButton asChild className="h-10 px-6 text-xs font-black uppercase tracking-wider brutal-shadow-xs">
            <Link href="/dashboard">Return to Dashboard</Link>
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  );
}
