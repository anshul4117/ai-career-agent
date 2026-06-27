import { Logo } from "@/components/shared/logo";
import { Heading, Text } from "@/components/ui/typography";

interface AuthHeaderProps {
  title: string;
  description: string;
}

export function AuthHeader({ title, description }: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center mb-6">
      <Logo className="mb-4" />
      <Heading level="h3" className="text-xl md:text-2xl font-bold uppercase tracking-tight mb-2">
        {title}
      </Heading>
      <Text variant="small" className="text-foreground-secondary text-sm">
        {description}
      </Text>
    </div>
  );
}
