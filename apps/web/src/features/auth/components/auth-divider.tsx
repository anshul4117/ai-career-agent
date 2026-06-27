import { Text } from "@/components/ui/typography";

export function AuthDivider() {
  return (
    <div className="relative my-6 flex items-center justify-center select-none" aria-hidden="true">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t-[2px] border-border/10" />
      </div>
      <div className="relative bg-surface px-4">
        <Text variant="muted" className="text-xs uppercase font-extrabold tracking-widest text-foreground-muted/65">
          Or
        </Text>
      </div>
    </div>
  );
}
