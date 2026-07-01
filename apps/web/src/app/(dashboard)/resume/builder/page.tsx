"use client";

import React, { useState } from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/page-header";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading } from "@/components/ui/typography";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Code, 
  Sparkles, 
  Download, 
  Save, 
  Eye, 
  ArrowLeft 
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActiveTab = "personal" | "experience" | "education" | "skills" | "ai";

export default function ResumeBuilderPage() {
  // Tabs state
  const [activeTab, setActiveTab] = useState<ActiveTab>("personal");

  // Form states
  const [personalInfo, setPersonalInfo] = useState({
    firstName: "Anshul",
    lastName: "Kumar",
    headline: "Frontend Specialist & React Developer",
    email: "anshul@example.com",
    phone: "+91 98765 43210",
    github: "github.com/anshul4117",
    linkedin: "linkedin.com/in/anshul",
  });

  const [experience, setExperience] = useState({
    title: "Software Engineer Intern",
    company: "Linear Labs",
    dates: "June 2025 - Present",
    bullets: "• Led refactoring of Zustand authentication store for 3x improvement in page load consistency.\n• Crafted premium brutalist UI design system using CSS variables and clean React primitives.\n• Integrated Zod validation layer on onboarding form pipelines.",
  });

  const [education, setEducation] = useState({
    degree: "B.Tech in Computer Science",
    school: "IIT Bombay",
    dates: "2022 - 2026",
  });

  const [skills, setSkills] = useState("React, Next.js, TypeScript, Zustand, Tailwind CSS, Jest, Zod, Git, Node.js");
  const [template, setTemplate] = useState<"brutalist-bold" | "modern-clean">("brutalist-bold");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 800);
  };

  const handleExport = () => {
    alert("Exporting PDF... (Mock UI PDF generation initiated)");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/resume" className="p-2 border-[3px] border-border bg-surface brutal-shadow-sm hover:translate-x-[-2px] hover:translate-y-[-2px] hover:brutal-shadow transition-all active:translate-x-0 active:translate-y-0 active:shadow-none">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <PageHeader
            title="Resume Builder"
            description="Construct and optimize your resume for automated target applications."
          />
        </div>

        <div className="flex gap-2">
          <BrutalButton onClick={handleSave} disabled={isSaving} variant="secondary" className="h-11 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5">
            <Save className="h-4 w-4" />
            {isSaving ? "Saving..." : "Save Draft"}
          </BrutalButton>
          <BrutalButton onClick={handleExport} className="h-11 uppercase font-bold text-xs tracking-wider flex items-center gap-1.5">
            <Download className="h-4 w-4" />
            Export PDF
          </BrutalButton>
        </div>
      </div>

      {saveSuccess && (
        <div className="bg-success/15 border-[3px] border-success text-success-foreground p-3 font-bold text-xs uppercase brutal-shadow">
          Draft saved successfully at {new Date().toLocaleTimeString()}!
        </div>
      )}

      {/* Main Builder Grid */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Column: Form Editors */}
        <div className="lg:col-span-5 space-y-4">
          {/* Form Tabs */}
          <div className="flex border-b-2 border-border pb-1 gap-1 overflow-x-auto select-none">
            {(["personal", "experience", "education", "skills", "ai"] as ActiveTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-1.5 text-[10px] font-black uppercase tracking-wider border-2 border-border brutal-shadow-sm transition-all active:translate-x-0 active:translate-y-0 active:shadow-none",
                  activeTab === tab ? "bg-foreground text-surface border-foreground" : "bg-surface text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-4 brutal-shadow">
            {activeTab === "personal" && (
              <div className="space-y-4">
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Personal Information
                </Heading>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="first-name" className="font-bold text-xs uppercase text-foreground-secondary">First Name</label>
                    <input
                      id="first-name"
                      value={personalInfo.firstName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="last-name" className="font-bold text-xs uppercase text-foreground-secondary">Last Name</label>
                    <input
                      id="last-name"
                      value={personalInfo.lastName}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="headline" className="font-bold text-xs uppercase text-foreground-secondary">Headline</label>
                  <input
                    id="headline"
                    value={personalInfo.headline}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, headline: e.target.value })}
                    className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="font-bold text-xs uppercase text-foreground-secondary">Email</label>
                    <input
                      id="email"
                      value={personalInfo.email}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="phone" className="font-bold text-xs uppercase text-foreground-secondary">Phone</label>
                    <input
                      id="phone"
                      value={personalInfo.phone}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="github" className="font-bold text-xs uppercase text-foreground-secondary">GitHub</label>
                    <input
                      id="github"
                      value={personalInfo.github}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="linkedin" className="font-bold text-xs uppercase text-foreground-secondary">LinkedIn</label>
                    <input
                      id="linkedin"
                      value={personalInfo.linkedin}
                      onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "experience" && (
              <div className="space-y-4">
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-primary" />
                  Work Experience
                </Heading>

                <div className="space-y-1">
                  <label htmlFor="job-title" className="font-bold text-xs uppercase text-foreground-secondary">Position Title</label>
                  <input
                    id="job-title"
                    value={experience.title}
                    onChange={(e) => setExperience({ ...experience, title: e.target.value })}
                    className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="company" className="font-bold text-xs uppercase text-foreground-secondary">Company</label>
                    <input
                      id="company"
                      value={experience.company}
                      onChange={(e) => setExperience({ ...experience, company: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="dates" className="font-bold text-xs uppercase text-foreground-secondary">Dates / Duration</label>
                    <input
                      id="dates"
                      value={experience.dates}
                      onChange={(e) => setExperience({ ...experience, dates: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label htmlFor="bullets" className="font-bold text-xs uppercase text-foreground-secondary">Description Bullets</label>
                  <textarea
                    id="bullets"
                    value={experience.bullets}
                    onChange={(e) => setExperience({ ...experience, bullets: e.target.value })}
                    rows={6}
                    className="w-full border-2 border-border p-2 text-sm focus:outline-primary font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {activeTab === "education" && (
              <div className="space-y-4">
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  Education
                </Heading>

                <div className="space-y-1">
                  <label htmlFor="degree" className="font-bold text-xs uppercase text-foreground-secondary">Degree / Certification</label>
                  <input
                    id="degree"
                    value={education.degree}
                    onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                    className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label htmlFor="school" className="font-bold text-xs uppercase text-foreground-secondary">Institution / School</label>
                    <input
                      id="school"
                      value={education.school}
                      onChange={(e) => setEducation({ ...education, school: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="edu-dates" className="font-bold text-xs uppercase text-foreground-secondary">Graduation Year</label>
                    <input
                      id="edu-dates"
                      value={education.dates}
                      onChange={(e) => setEducation({ ...education, dates: e.target.value })}
                      className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "skills" && (
              <div className="space-y-4">
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Code className="h-5 w-5 text-primary" />
                  Skills & Languages
                </Heading>

                <div className="space-y-1">
                  <label htmlFor="skills-list" className="font-bold text-xs uppercase text-foreground-secondary">Skills (Comma-separated)</label>
                  <textarea
                    id="skills-list"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    rows={4}
                    className="w-full border-2 border-border p-2 text-sm focus:outline-primary"
                  />
                </div>

                <div className="pt-2 border-t-2 border-border/10">
                  <p className="font-bold text-xs uppercase text-foreground-secondary mb-2">Template Layout</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer">
                      <input
                        type="radio"
                        name="templateOption"
                        checked={template === "brutalist-bold"}
                        onChange={() => setTemplate("brutalist-bold")}
                        className="accent-primary"
                      />
                      Brutalist Bold
                    </label>
                    <label className="flex items-center gap-2 font-bold text-xs uppercase cursor-pointer">
                      <input
                        type="radio"
                        name="templateOption"
                        checked={template === "modern-clean"}
                        onChange={() => setTemplate("modern-clean")}
                        className="accent-primary"
                      />
                      Modern Clean
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "ai" && (
              <div className="space-y-4">
                <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  AI Optimization
                </Heading>

                <div className="p-3 bg-primary/10 border-2 border-primary text-primary rounded-md space-y-1 brutal-shadow-sm">
                  <p className="font-bold text-xs uppercase">ATS Alignment Score</p>
                  <p className="text-2xl font-black">88% Match</p>
                  <p className="text-[11px] text-foreground-secondary">Based on matches with targeted frontend specifications.</p>
                </div>

                <div className="space-y-3">
                  <p className="font-bold text-xs uppercase text-foreground-secondary">AI Optimization Suggestions</p>
                  <ul className="space-y-2 text-xs leading-relaxed">
                    <li className="p-2 border-2 border-border bg-surface-secondary rounded-sm">
                      💡 <strong>Add keyword:</strong> Consider integrating &quot;REST APIs&quot; or &quot;GraphQL&quot; into your Skills tags.
                    </li>
                    <li className="p-2 border-2 border-border bg-surface-secondary rounded-sm">
                      💡 <strong>Bullet Optimization:</strong> Change <em>&quot;Led refactoring of Zustand authentication store...&quot;</em> to incorporate quantitative metrics like: <em>&quot;resulting in a 40% reduction in hydration latency.&quot;</em>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </BrutalCard>
        </div>

        {/* Right Column: Live Preview */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between border-b-2 border-border pb-2">
            <span className="font-black text-xs uppercase text-foreground-muted flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              Live Preview
            </span>
            <span className="text-[10px] uppercase font-bold text-foreground-muted">Auto-Saving enabled</span>
          </div>

          <BrutalCard className={cn(
            "p-8 border-[3px] border-border brutal-shadow min-h-[600px] flex flex-col justify-between",
            template === "brutalist-bold" ? "bg-surface" : "bg-stone-50 border-double border-8"
          )}>
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="border-b-[4px] border-border pb-4">
                <h1 className="text-3xl font-black uppercase tracking-tight">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <p className="text-base font-bold text-primary mt-1 uppercase tracking-wider">{personalInfo.headline}</p>
                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground-secondary font-mono mt-3">
                  <span>✉ {personalInfo.email}</span>
                  <span>☎ {personalInfo.phone}</span>
                  <span>🔗 {personalInfo.github}</span>
                  <span>🔗 {personalInfo.linkedin}</span>
                </div>
              </div>

              {/* Experience */}
              <div className="space-y-3">
                <h2 className="text-base font-extrabold uppercase border-b-2 border-border pb-1 tracking-wider">
                  Professional Experience
                </h2>
                <div>
                  <div className="flex justify-between items-baseline font-bold text-sm">
                    <span>{experience.title} — <span className="text-foreground-secondary">{experience.company}</span></span>
                    <span className="text-xs text-foreground-muted font-mono">{experience.dates}</span>
                  </div>
                  <div className="mt-2 text-xs leading-relaxed text-foreground-secondary whitespace-pre-line font-serif">
                    {experience.bullets}
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className="space-y-3">
                <h2 className="text-base font-extrabold uppercase border-b-2 border-border pb-1 tracking-wider">
                  Education
                </h2>
                <div>
                  <div className="flex justify-between items-baseline font-bold text-sm">
                    <span>{education.degree}</span>
                    <span className="text-xs text-foreground-muted font-mono">{education.dates}</span>
                  </div>
                  <p className="text-xs text-foreground-secondary">{education.school}</p>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-3">
                <h2 className="text-base font-extrabold uppercase border-b-2 border-border pb-1 tracking-wider">
                  Technical Expertise
                </h2>
                <div className="flex flex-wrap gap-2 pt-1">
                  {skills.split(",").map((s, idx) => {
                    const tag = s.trim();
                    if (!tag) return null;
                    return (
                      <span key={idx} className="px-2 py-0.5 border-2 border-border text-[10px] font-bold uppercase bg-surface-secondary brutal-shadow-sm">
                        {tag}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-12 text-center text-[10px] text-foreground-muted font-mono uppercase tracking-widest">
              Generated by AI Career Agent Builder
            </div>
          </BrutalCard>
        </div>
      </div>
    </div>
  );
}
