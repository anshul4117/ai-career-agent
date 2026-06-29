import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <BrutalCard className="max-w-md w-full bg-surface border-[3px] border-border brutal-shadow p-6 text-center space-y-6">
        <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider border-2 border-border brutal-shadow">
          Coming Soon
        </div>
        <Heading level="h2" className="text-3xl font-black uppercase tracking-tight">
          FAQ
        </Heading>
        <Text className="text-foreground-secondary leading-relaxed">
          Find answers to frequently asked questions about resume customization, matching algorithms, spam filtering, and account controls.
        </Text>
        <div className="pt-2">
          <BrutalButton asChild variant="default" className="w-full h-12 uppercase font-bold text-sm tracking-wide">
            <Link href="/">Back to Home</Link>
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  );
}
