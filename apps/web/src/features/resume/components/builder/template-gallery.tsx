"use client";

import React from "react";
import { useBuilderStore } from "../../store/builder.store";
import { useThemeStore } from "../../store/theme.store";
import { MOCK_TEMPLATES } from "../../services/resume.service";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading, Text } from "@/components/ui/typography";
import { Star, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function TemplateGallery() {
  const { currentResume, updateTemplate } = useBuilderStore();
  const { favoritedTemplates, toggleFavoriteTemplate } = useThemeStore();

  if (!currentResume) return null;

  const currentTemplateId = currentResume.templateId;

  // Enhance template details for user recommendations
  const getTemplateMeta = (id: string) => {
    switch (id) {
      case "classic":
        return {
          category: "Academic & Traditional",
          recommendedFor: "Lawyers, Academics, Executives",
          color: "bg-[#e2e8f0]"
        };
      case "modern":
        return {
          category: "Professional & Modern",
          recommendedFor: "Software Engineers, Product Managers",
          color: "bg-[#bfdbfe]"
        };
      case "minimal":
        return {
          category: "Clean & Simple",
          recommendedFor: "Minimalists, Designers, Writers",
          color: "bg-[#f1f5f9]"
        };
      case "professional":
        return {
          category: "Executive & Corporate",
          recommendedFor: "Finance, Consulting, Sales",
          color: "bg-[#cbd5e1]"
        };
      case "developer":
        return {
          category: "Monospace & Technical",
          recommendedFor: "Developers, DevOps, System Admins",
          color: "bg-[#0f172a] text-white"
        };
      case "creative":
        return {
          category: "Artistic & Colorful",
          recommendedFor: "Artists, Designers, Marketers",
          color: "bg-[#fef08a]"
        };
      default:
        return {
          category: "General",
          recommendedFor: "All professionals",
          color: "bg-surface"
        };
    }
  };

  const handleDuplicateTemplate = (templateId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate template duplication/cloning by creating a layout message
    toast.success(`Cloned template "${templateId.toUpperCase()}" configurations to your clipboard settings!`);
  };

  return (
    <div className="space-y-4 p-3 select-none">
      <Heading level="h5" className="text-[10px] font-black uppercase tracking-widest text-foreground-secondary border-b-2 border-border/10 pb-2 mb-2">
        Available Templates ({MOCK_TEMPLATES.length})
      </Heading>

      <div className="flex flex-col gap-3">
        {MOCK_TEMPLATES.map((tmpl) => {
          const isActive = currentTemplateId === tmpl.id;
          const isFav = favoritedTemplates.includes(tmpl.id);
          const meta = getTemplateMeta(tmpl.id);

          return (
            <BrutalCard
              key={tmpl.id}
              onClick={() => updateTemplate(tmpl.id)}
              className={cn(
                "border-2 border-border p-3.5 cursor-pointer hover:bg-surface-secondary/20 transition-all duration-150 rounded-sm",
                isActive ? "border-primary bg-primary/5 brutal-shadow-xs" : "bg-surface brutal-shadow-xs"
              )}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm uppercase text-foreground truncate">
                      {tmpl.name}
                    </h4>
                    {isActive && (
                      <span className="flex items-center gap-0.5 bg-primary text-white text-[7px] font-black uppercase px-1 rounded-sm">
                        <Check className="h-2 w-2 stroke-[4px]" /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[8px] font-black uppercase text-foreground-muted tracking-wider pt-0.5">
                    {meta.category}
                  </p>
                </div>

                {/* Actions Panel */}
                <div className="flex items-center gap-1">
                  {/* Favorite Toggle */}
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); toggleFavoriteTemplate(tmpl.id); }}
                    className={cn(
                      "p-1 border border-border rounded-sm hover:bg-surface transition-colors h-7 w-7 flex items-center justify-center",
                      isFav ? "bg-amber-100 dark:bg-amber-500/20 border-amber-400 dark:border-amber-500/40 text-amber-500" : "bg-surface text-foreground-muted"
                    )}
                    aria-label="Favorite Template"
                  >
                    <Star className={cn("h-4.5 w-4.5", isFav && "fill-amber-400")} />
                  </button>

                  {/* Duplicate */}
                  <button
                    type="button"
                    onClick={(e) => handleDuplicateTemplate(tmpl.id, e)}
                    className="p-1 border border-border bg-surface hover:bg-surface-secondary rounded-sm h-7 w-7 flex items-center justify-center text-foreground-muted"
                    aria-label="Duplicate Template"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Template Preview thumbnail mock box */}
              <div className={cn(
                "h-20 w-full mt-2.5 border border-border flex items-center justify-center text-[10px] font-bold uppercase rounded-sm border-dashed",
                meta.color
              )}>
                {tmpl.name} Layout
              </div>

              <Text variant="muted" className="text-[10px] mt-2.5 leading-relaxed font-semibold">
                {tmpl.description}
              </Text>

              <div className="mt-2 text-[9px] font-mono text-foreground-secondary bg-surface-secondary/40 p-1.5 border border-border/10 rounded-sm">
                <span className="font-bold text-foreground">For:</span> {meta.recommendedFor}
              </div>
            </BrutalCard>
          );
        })}
      </div>
    </div>
  );
}
