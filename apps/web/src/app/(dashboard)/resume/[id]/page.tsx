import Link from "next/link";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ResumePreviewPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="p-6 space-y-6">
      <BrutalCard className="bg-surface border-[3px] border-border brutal-shadow p-6 text-center space-y-6 max-w-lg mx-auto">
        <div className="inline-block px-3 py-1 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider border-2 border-border brutal-shadow">
          Coming Soon
        </div>
        <Heading level="h2" className="text-3xl font-black uppercase tracking-tight">
          Resume Preview
        </Heading>
        <Text className="text-foreground-secondary leading-relaxed">
          Preview and analyze resume file details (ID: {id}) for matched metrics and formatting improvements.
        </Text>
        <div className="pt-2">
          <BrutalButton asChild variant="default" className="w-full h-12 uppercase font-bold text-sm tracking-wide">
            <Link href="/resume">Back to Resumes</Link>
          </BrutalButton>
        </div>
      </BrutalCard>
    </div>
  );
}
