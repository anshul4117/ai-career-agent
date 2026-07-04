"use client";

import React from "react";
import { useBuilderStore } from "../../store/builder.store";
import { useExportStore } from "../../store/export.store";
import { DEFAULT_THEME } from "../../services/theme.service";
import { cn } from "@/lib/utils";

export const ResumePreview = React.memo(function ResumePreview() {
  const currentResume = useBuilderStore((state) => state.currentResume);
  const { settings } = useExportStore();

  if (!currentResume || !currentResume.content) {
    return (
      <div className="flex items-center justify-center h-full min-h-[500px] border-3 border-dashed border-border bg-surface-secondary/20">
        <span className="text-xs font-black uppercase text-foreground-muted">Loading preview canvas...</span>
      </div>
    );
  }

  const { personal, summary, experience, education, skills, projects, certifications, languages, socialLinks } = currentResume.content;

  const order = currentResume.content.sectionsOrder || ["personal", "summary", "experience", "education", "skills", "projects", "certifications", "languages", "socialLinks"];
  const hiddenSections = currentResume.content.hiddenSections || [];
  const customSections = currentResume.content.customSections || [];

  const visibleSections = order.filter((secId) => !hiddenSections.includes(secId));

  // Retrieve theme customizations (Sprint 3.6)
  const theme = currentResume.theme || { ...DEFAULT_THEME };

  // Set up CSS custom properties (variables)
  const themeStyles = {
    "--primary-color": theme.primaryColor,
    "--accent-color": theme.accentColor,
    "--background-color": theme.backgroundColor,
    "--text-color": theme.textColor,
    "--heading-color": theme.headingColor,
    "--heading-font": theme.headingFont === "Times New Roman" ? "Times New Roman, serif" : theme.headingFont === "Georgia" ? "Georgia, serif" : theme.headingFont === "Playfair Display" ? "'Playfair Display', serif" : theme.headingFont === "Fira Code" ? "'Fira Code', monospace" : "var(--font-sans)",
    "--body-font": theme.bodyFont === "Times New Roman" ? "Times New Roman, serif" : theme.bodyFont === "Georgia" ? "Georgia, serif" : theme.bodyFont === "Playfair Display" ? "'Playfair Display', serif" : theme.bodyFont === "Fira Code" ? "'Fira Code', monospace" : "var(--font-sans)",
    fontSize: theme.fontSize,
    lineHeight: theme.lineHeight === "tight" ? "1.25" : theme.lineHeight === "relaxed" ? "1.6" : "1.4",
    letterSpacing: theme.letterSpacing === "tracking-tight" ? "-0.025em" : theme.letterSpacing === "tracking-wide" ? "0.025em" : "0em",
  } as React.CSSProperties;

  // Determine Sidebar Position column division (Left/Right)
  const leftKeys = ["skills", "languages", "certifications", "socialLinks"];
  const getIsSidebarSection = (secId: string) => {
    if (leftKeys.includes(secId)) return true;
    if (secId.startsWith("custom_")) {
      const cs = customSections.find((c) => c.id === secId);
      if (cs && cs.items.every((item) => !item.description?.trim())) {
        return true;
      }
    }
    return false;
  };

  const leftSections = visibleSections.filter((id) => getIsSidebarSection(id));
  const rightSections = visibleSections.filter((id) => !leftSections.includes(id) && id !== "personal");

  // Section card wrap styles
  const getSectionWrapperClass = () => {
    return cn(
      "p-3 transition-all",
      theme.sectionBackground,
      theme.roundedCorners,
      theme.borderStyle !== "border-none" && theme.borderStyle
    );
  };

  // ----------------------------------------------------
  // CLASSIC TEMPLATE RENDERER
  // ----------------------------------------------------
  const renderClassicSection = (secId: string) => {
    const borderStyle = { borderColor: "var(--accent-color)" };
    const headingStyle = { fontFamily: "var(--heading-font)", color: "var(--heading-color)" };
    const bodyStyle = { fontFamily: "var(--body-font)", color: "var(--text-color)" };

    if (secId.startsWith("custom_")) {
      const cs = customSections.find((c) => c.id === secId);
      if (!cs || cs.items.length === 0) return null;
      return (
        <div key={secId} className={cn(getSectionWrapperClass(), theme.sectionSpacing)} style={borderStyle}>
          <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
            {cs.title}
          </h3>
          <div className={cn("space-y-2", theme.itemSpacing)}>
            {cs.items.map((item) => (
              <div key={item.id} className="text-[10px] space-y-0.5" style={bodyStyle}>
                <div className="flex justify-between font-bold">
                  <span>{item.title} {item.subtitle && `— ${item.subtitle}`}</span>
                  {item.date && <span className="font-normal font-mono text-[9px]">{item.date}</span>}
                </div>
                {item.description && <p className="leading-normal">{item.description}</p>}
              </div>
            ))}
          </div>
        </div>
      );
    }

    switch (secId) {
      case "summary":
        return summary.summary ? (
          <div key="summary" className={cn(getSectionWrapperClass(), "space-y-1")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Professional Summary
            </h3>
            <p className="text-[10px] leading-relaxed" style={bodyStyle}>{summary.summary}</p>
          </div>
        ) : null;
      case "experience":
        return experience && experience.length > 0 ? (
          <div key="experience" className={cn(getSectionWrapperClass(), "space-y-2")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Experience History
            </h3>
            <div className={cn("space-y-2.5", theme.itemSpacing)}>
              {experience.map((exp) => (
                <div key={exp.id} className="space-y-0.5" style={bodyStyle}>
                  <div className="flex justify-between font-bold text-[10px]">
                    <span style={{ color: "var(--primary-color)" }}>{exp.jobTitle} — {exp.companyName}</span>
                    <span className="font-normal font-mono text-[9px]">
                      {exp.startDate} to {exp.currentPosition ? "Present" : exp.endDate}
                    </span>
                  </div>
                  {exp.location && <p className="text-[9px] italic">{exp.location}</p>}
                  {exp.description && <p className="text-[10px] leading-normal">{exp.description}</p>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "education":
        return education && education.length > 0 ? (
          <div key="education" className={cn(getSectionWrapperClass(), "space-y-2")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Education
            </h3>
            <div className={cn("space-y-2", theme.itemSpacing)}>
              {education.map((edu) => (
                <div key={edu.id} className="text-[10px]" style={bodyStyle}>
                  <div className="flex justify-between font-bold">
                    <span>{edu.degree} in {edu.fieldOfStudy}</span>
                    <span className="font-normal font-mono text-[9px]">{edu.startDate} – {edu.endDate}</span>
                  </div>
                  <p>{edu.institution} {edu.cgpa && `• Grade: ${edu.cgpa}`}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "projects":
        return projects && projects.length > 0 ? (
          <div key="projects" className={cn(getSectionWrapperClass(), "space-y-2")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Key Projects
            </h3>
            <div className={cn("space-y-2", theme.itemSpacing)}>
              {projects.map((proj) => (
                <div key={proj.id} className="text-[10px] space-y-0.5" style={bodyStyle}>
                  <div className="font-bold" style={{ color: "var(--primary-color)" }}>{proj.title} ({proj.role})</div>
                  {proj.description && <p className="leading-normal">{proj.description}</p>}
                  {proj.techStack && proj.techStack.length > 0 && (
                    <p className="text-[9px] font-semibold">Tech stack: {proj.techStack.join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "skills":
        return skills && skills.length > 0 ? (
          <div key="skills" className={cn(getSectionWrapperClass(), "space-y-1.5")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Skills
            </h3>
            <p className="text-[10px] leading-normal" style={bodyStyle}>
              {skills.map((s) => `${s.name} (${s.level})`).join(", ")}
            </p>
          </div>
        ) : null;
      case "certifications":
        return certifications && certifications.length > 0 ? (
          <div key="certifications" className={cn(getSectionWrapperClass(), "space-y-1.5")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Certifications
            </h3>
            <div className={cn("space-y-1.5", theme.itemSpacing)}>
              {certifications.map((c) => (
                <div key={c.id} className="text-[10px] flex justify-between" style={bodyStyle}>
                  <span><span className="font-bold">{c.name}</span> — {c.issuingOrganization}</span>
                  {c.issueDate && <span className="font-mono text-[9px]">{c.issueDate}</span>}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "languages":
        return languages && languages.length > 0 ? (
          <div key="languages" className={cn(getSectionWrapperClass(), "space-y-1.5")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Languages
            </h3>
            <p className="text-[10px] leading-normal" style={bodyStyle}>
              {languages.map((l) => `${l.language} (${l.nativeLanguage ? "Native" : l.speakingLevel})`).join(", ")}
            </p>
          </div>
        ) : null;
      case "socialLinks":
        return socialLinks && socialLinks.length > 0 ? (
          <div key="socialLinks" className={cn(getSectionWrapperClass(), "space-y-1.5")} style={borderStyle}>
            <h3 className="font-bold text-[10px] uppercase tracking-widest pb-0.5" style={{ ...headingStyle, ...borderStyle, borderBottomWidth: theme.dividerStyle !== "divider-none" ? "1px" : "0" }}>
              Social Links
            </h3>
            <div className="flex flex-wrap gap-x-3 text-[10px] font-mono" style={bodyStyle}>
              {socialLinks.map((s) => (
                <span key={s.id}>{s.platform}: {s.url}</span>
              ))}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  };

  // ----------------------------------------------------
  // LAYOUT ENGINE - DYNAMIC COLUMNS (1 OR 2 COLUMNS SWITCH)
  // ----------------------------------------------------
  const renderTemplateBody = () => {
    if (theme.columns === 1) {
      return (
        <div className={cn("w-full transition-all", theme.sectionSpacing)}>
          {visibleSections.map((secId) => renderClassicSection(secId))}
        </div>
      );
    }

    const sidebarColumn = (
      <div className={cn("col-span-1 space-y-4", theme.sectionSpacing)}>
        {leftSections.map((secId) => renderClassicSection(secId))}
      </div>
    );

    const mainColumn = (
      <div className={cn("col-span-2 space-y-4", theme.sectionSpacing)}>
        {rightSections.map((secId) => renderClassicSection(secId))}
      </div>
    );

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {theme.sidebarPosition === "left" ? (
          <>
            {sidebarColumn}
            {mainColumn}
          </>
        ) : (
          <>
            {mainColumn}
            {sidebarColumn}
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full bg-[#f1f5f9] p-4 md:p-6 border-3 border-border rounded-sm h-[80vh] md:h-[calc(100vh-140px)] overflow-y-auto brutal-shadow-sm select-none">
      {/* Printable Sheet Canvas Mock */}
      <div 
        id="resume-print-preview-container"
        style={themeStyles}
        className={cn(
          "bg-white shadow-lg border-2 border-slate-300 w-full min-h-[1050px] mx-auto text-left leading-relaxed transition-all relative",
          theme.widthMode === "compact" ? "max-w-[720px]" : "max-w-[840px]",
          theme.margins,
          settings.hideColors && "grayscale"
        )}
      >
        
        {/* Page Break Indicators (Screen only, hidden on print!) */}
        {settings.pageBreakPreview && (
          <>
            {[1, 2, 3].map((pageIndex) => {
              const height = (settings.paperSize === "a4" ? 1123 : 1056) * pageIndex;
              return (
                <div 
                  key={pageIndex}
                  className="absolute left-0 right-0 border-t-2 border-dashed border-error/50 flex justify-end select-none pointer-events-none print:hidden"
                  style={{ top: `${height}px` }}
                >
                  <span className="bg-error/15 text-error text-[8px] font-black uppercase px-1.5 py-0.5 rounded-bl-sm">
                    Page {pageIndex} Break
                  </span>
                </div>
              );
            })}
          </>
        )}

        {/* HEADER SECTION (Static at top) */}
        {!hiddenSections.includes("personal") && (
          <div 
            className="pb-4 mb-5 border-b-2 select-none"
            style={{ 
              borderColor: "var(--accent-color)", 
              fontFamily: "var(--heading-font)" 
            }}
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-3">
              <div>
                <h1 className="text-2xl font-bold tracking-tight uppercase" style={{ color: "var(--heading-color)" }}>
                  {personal.firstName || "John"} {personal.lastName || "Doe"}
                </h1>
                <p className="italic text-[10px] font-semibold tracking-wide" style={{ color: "var(--primary-color)" }}>
                  {personal.headline || "Professional Headline"}
                </p>
              </div>
              <div 
                className="flex flex-col text-[9px] font-mono text-left md:text-right space-y-0.5" 
                style={{ color: "var(--text-color)", fontFamily: "var(--body-font)" }}
              >
                {personal.phone && <span>{personal.phone}</span>}
                {personal.email && <span>{personal.email}</span>}
                {(personal.city || personal.country) && (
                  <span>{personal.city}{personal.city && personal.country ? ", " : ""}{personal.country}</span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Dynamic Column Split Layout */}
        {renderTemplateBody()}

      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";
