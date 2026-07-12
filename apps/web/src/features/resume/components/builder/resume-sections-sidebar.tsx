"use client";

import React, { useEffect, useRef } from "react";
import { useBuilderStore } from "../../store/builder.store";
import { 
  User, FileText, Briefcase, GraduationCap, Award, 
  FolderGit2, FileBadge, Languages, Share2, EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isCompleted: boolean;
  isHidden: boolean;
}

interface ResumeSectionsSidebarProps {
  isCollapsed?: boolean;
  isMobileHeader?: boolean;
}

export function ResumeSectionsSidebar({ 
  isCollapsed = false, 
  isMobileHeader = false 
}: ResumeSectionsSidebarProps) {
  const { currentResume, activeSection, setActiveSection } = useBuilderStore();
  const activeTabRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isMobileHeader && activeTabRef.current) {
      activeTabRef.current.scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  }, [activeSection, isMobileHeader]);

  if (!currentResume || !currentResume.content) return null;

  const content = currentResume.content;
  const order = content.sectionsOrder || ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"];
  const hiddenSections = content.hiddenSections || [];
  const customSections = content.customSections || [];

  // Map built-in sections details
  const builtInMap: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; isCompleted: boolean }> = {
    personal: {
      label: "Personal Info",
      icon: User,
      isCompleted: !!(content.personal?.firstName && content.personal?.lastName && content.personal?.email),
    },
    summary: {
      label: "Summary",
      icon: FileText,
      isCompleted: !!content.summary?.summary?.trim(),
    },
    experience: {
      label: "Experience",
      icon: Briefcase,
      isCompleted: (content.experience || []).length > 0,
    },
    education: {
      label: "Education",
      icon: GraduationCap,
      isCompleted: (content.education || []).length > 0,
    },
    skills: {
      label: "Skills",
      icon: Award,
      isCompleted: (content.skills || []).length > 0,
    },
    projects: {
      label: "Projects",
      icon: FolderGit2,
      isCompleted: (content.projects || []).length > 0,
    },
    certifications: {
      label: "Certifications",
      icon: FileBadge,
      isCompleted: (content.certifications || []).length > 0,
    },
    languages: {
      label: "Languages",
      icon: Languages,
      isCompleted: (content.languages || []).length > 0,
    },
    socialLinks: {
      label: "Social Links",
      icon: Share2,
      isCompleted: (content.socialLinks || []).length > 0,
    },
  };

  // Build the list in order
  const sections: SectionItem[] = order.map((sectionId) => {
    const isHidden = hiddenSections.includes(sectionId);
    
    // Check if custom
    if (sectionId.startsWith("custom_")) {
      const customSec = customSections.find((c) => c.id === sectionId);
      return {
        id: sectionId,
        label: customSec?.title || "Custom Section",
        icon: FolderGit2,
        isCompleted: (customSec?.items || []).length > 0,
        isHidden,
      };
    }

    const info = builtInMap[sectionId];
    if (info) {
      return {
        id: sectionId,
        label: info.label,
        icon: info.icon,
        isCompleted: info.isCompleted,
        isHidden,
      };
    }

    return {
      id: sectionId,
      label: sectionId,
      icon: FolderGit2,
      isCompleted: false,
      isHidden,
    };
  });

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    
    // Temporarily set scroll block to prevent observer conflicts
    if (typeof window !== "undefined") {
      (window as Window & { isScrollingToSection?: boolean }).isScrollingToSection = true;
    }

    const el = document.getElementById(`editor-${sectionId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setTimeout(() => {
      if (typeof window !== "undefined") {
        (window as Window & { isScrollingToSection?: boolean }).isScrollingToSection = false;
      }
    }, 800);
  };

  // 1. MOBILE HEADER MODE (Horizontal Pill Tabs)
  if (isMobileHeader) {
    return (
      <nav className="flex flex-row gap-2 overflow-x-auto pb-1.5 scrollbar-none scroll-smooth">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          return (
            <button
              key={sec.id}
              ref={isActive ? activeTabRef : null}
              onClick={() => handleSectionClick(sec.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-2 border-2 text-[10px] font-black uppercase tracking-wider shrink-0 transition-all duration-150 h-10 select-none",
                isActive
                  ? "bg-primary text-white border-foreground brutal-shadow-xs"
                  : "bg-surface text-foreground border-border hover:bg-surface-secondary",
                sec.isHidden && "opacity-60 border-dashed"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              <span>{sec.label}</span>
              {sec.isHidden && <EyeOff className="h-3 w-3 text-error ml-0.5" />}
              {sec.isCompleted && <span className="text-[7px] bg-success text-white px-1 rounded-sm">✔</span>}
            </button>
          );
        })}
      </nav>
    );
  }

  // 2. VERTICAL SIDEBAR MODE (Desktop/Tablet)
  return (
    <aside className="w-full flex flex-col gap-2 p-3 select-none">
      {!isCollapsed && (
        <h3 className="font-black text-xs uppercase text-foreground-secondary tracking-widest border-b-2 border-border/10 pb-2 mb-1">
          Sections
        </h3>
      )}

      <nav className="flex flex-col gap-1.5">
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          
          if (isCollapsed) {
            // Collapsed (Icon-only) Mode
            return (
              <button
                key={sec.id}
                onClick={() => handleSectionClick(sec.id)}
                className={cn(
                  "relative flex items-center justify-center h-11 w-11 border-2 transition-all duration-150 rounded-sm active:translate-x-0 active:translate-y-0",
                  isActive
                    ? "bg-primary text-white border-foreground brutal-shadow-xs"
                    : "bg-surface text-foreground border-border hover:bg-surface-secondary",
                  sec.isHidden && "opacity-50 border-dashed"
                )}
                title={`${sec.label}${sec.isHidden ? " (Hidden)" : ""}`}
                aria-label={sec.label}
              >
                <Icon className="h-4.5 w-4.5" />
                
                {/* Completion status dot */}
                {sec.isCompleted && (
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-success border border-white" />
                )}
                {/* Hidden status indicator */}
                {sec.isHidden && (
                  <span className="absolute bottom-0 right-0 bg-error text-white text-[6px] px-0.5 rounded-sm">
                    H
                  </span>
                )}
              </button>
            );
          }

          // Fully Expanded Sidebar mode
          return (
            <button
              key={sec.id}
              onClick={() => handleSectionClick(sec.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-2.5 border-2 text-left font-black uppercase text-[10px] tracking-wider transition-all duration-150 h-11",
                isActive
                  ? "bg-primary text-white border-foreground brutal-shadow-xs translate-x-[-1px] translate-y-[-1px]"
                  : "bg-surface text-foreground border-border hover:bg-surface-secondary",
                sec.isHidden && "opacity-60 border-dashed"
              )}
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              <span className="truncate flex-1">{sec.label}</span>
              
              <div className="shrink-0 flex items-center justify-center gap-1.5">
                {sec.isHidden && (
                  <EyeOff className="h-3.5 w-3.5 text-error shrink-0" />
                )}
                {sec.isCompleted ? (
                  <span className={cn(
                    "flex items-center justify-center h-4 w-4 border rounded-full text-[8px]",
                    isActive ? "bg-white dark:bg-surface text-primary border-white" : "bg-success text-white border-success"
                  )}>
                    ✔
                  </span>
                ) : (
                  <span className="h-4 w-4 border rounded-full block border-current opacity-40" />
                )}
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
