import * as React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { Heading, Text } from "@/components/ui/typography";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "error";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title: string;
  description?: string;
  onClose?: () => void;
}

const icons: Record<AlertVariant, React.ComponentType<{ className?: string }>> = {
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
  error: AlertCircle,
};

const styles: Record<AlertVariant, { container: string; border: string; icon: string }> = {
  info: {
    container: "bg-info/10 border-info text-info-foreground",
    border: "border-info",
    icon: "text-info",
  },
  success: {
    container: "bg-success/10 border-success text-success-foreground",
    border: "border-success",
    icon: "text-success",
  },
  warning: {
    container: "bg-warning/10 border-warning text-warning-foreground",
    border: "border-warning",
    icon: "text-warning",
  },
  error: {
    container: "bg-error/10 border-error text-error-foreground",
    border: "border-error",
    icon: "text-error",
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ title, description, variant = "info", onClose, className, ...props }, ref) => {
    const Icon = icons[variant];
    const colorStyle = styles[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex items-start gap-3 rounded-md p-3.5 border-[3px] brutal-shadow text-foreground",
          colorStyle.container,
          className
        )}
        {...props}
      >
        <div className={cn("inline-flex h-6 items-center justify-center rounded-sm", colorStyle.icon)}>
          <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
        </div>
        <div className="flex-1 space-y-1">
          <Heading level="h5" className="text-sm font-bold leading-none tracking-tight">
            {title}
          </Heading>
          {description && (
            <Text variant="small" className="leading-relaxed opacity-90 text-foreground-secondary">
              {description}
            </Text>
          )}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-sm p-1 text-foreground-muted hover:bg-foreground/5 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:ring-offset-background"
            aria-label="Dismiss alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);
Alert.displayName = "Alert";
