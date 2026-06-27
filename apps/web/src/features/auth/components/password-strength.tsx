import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface PasswordStrengthProps {
  value: string;
}

export function PasswordStrength({ value = "" }: PasswordStrengthProps) {
  const requirements = [
    { label: "At least 8 characters", met: value.length >= 8 },
    { label: "At least one uppercase letter", met: /[A-Z]/.test(value) },
    { label: "At least one lowercase letter", met: /[a-z]/.test(value) },
    { label: "At least one number", met: /[0-9]/.test(value) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(value) },
  ];

  return (
    <div className="space-y-1.5 p-3 bg-surface-secondary border-2 border-border rounded-md text-xs font-medium">
      <p className="font-heading font-bold uppercase tracking-wider text-[10px] text-foreground-muted mb-2">
        Password Requirements:
      </p>
      <ul className="space-y-1" role="list">
        {requirements.map((req, idx) => (
          <li key={idx} className="flex items-center gap-1.5 text-left">
            {req.met ? (
              <Check className="h-3.5 w-3.5 text-success stroke-[3px]" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 text-foreground-muted/40 stroke-[2.5px]" aria-hidden="true" />
            )}
            <span className={cn(req.met ? "text-success font-semibold" : "text-foreground-secondary")}>
              {req.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
