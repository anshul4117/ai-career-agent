import * as React from "react";
import { cn } from "@/lib/utils";

export interface BrutalTooltipProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  content: React.ReactNode;
  children: React.ReactElement;
  delay?: number;
}

export const Tooltip = ({ content, children, delay = 300, className, ...props }: BrutalTooltipProps) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const tooltipId = React.useId();

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const trigger = React.cloneElement(children, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    "aria-describedby": tooltipId,
  } as React.HTMLAttributes<HTMLElement>);

  return (
    <div className="relative inline-block">
      {trigger}
      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={cn(
            "absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-semibold text-surface bg-foreground brutal-border rounded-sm brutal-shadow-hover whitespace-nowrap pointer-events-none transition-all duration-150 animate-in fade-in slide-in-from-bottom-1",
            className
          )}
          {...props}
        >
          {content}
          {/* Arrow */}
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-[3px] border-[5px] border-transparent border-t-foreground" />
        </div>
      )}
    </div>
  );
};
