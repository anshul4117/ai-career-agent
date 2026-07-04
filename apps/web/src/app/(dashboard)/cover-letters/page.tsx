"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Copy, Download, Save, Sparkles, Check } from "lucide-react";
import { useProfileStore } from "@/features/profile/store/profile.store";

export default function CoverLettersPage() {
  const profileStore = useProfileStore();
  const userProfile = profileStore.profile;
  const userName = userProfile 
    ? `${userProfile.personal.firstName} ${userProfile.personal.lastName}` 
    : "Alex Rivera";
  const userEmail = userProfile?.contact.email || "alex.rivera@example.com";
  const userPhone = userProfile?.contact.phone || "+1 (555) 019-2834";

  // Form States
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  
  // Interactive States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedText, setGeneratedText] = useState("");
  const [toastMsg, setToastMsg] = useState("");

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3000);
  };

  const handleGenerate = async () => {
    if (!jobTitle || !company) {
      triggerToast("Job Title and Company are required!");
      return;
    }

    setIsGenerating(true);
    // Simulate AI generation delay
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const mockLetter = `[Candidate Contact Details]
${userName}
${userEmail} | ${userPhone}
Date: ${new Date().toLocaleDateString()}

Hiring Committee
${company}

Subject: Application for ${jobTitle} Role

Dear Hiring Team at ${company},

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. With my background in engineering high-performance scalable systems and a passion for crafting beautiful, responsive user experiences, I am confident in my ability to make an immediate positive impact on your team.

${description 
  ? `In reviewing your job specifications: "${description.slice(0, 100)}...", I noticed a strong emphasis on capabilities that align perfectly with my technical skill set. I have successfully led similar initiatives in my career, consistently delivering quality-first results.`
  : `Your focus on engineering excellence and high-quality product delivery aligns perfectly with my work philosophy. Throughout my career, I have dedicated myself to optimizing performance and building structured, maintainable codebases.`}

I would welcome the opportunity to discuss how my qualifications align with the needs of ${company}. Thank you for your time and consideration.

Sincerely,

${userName}`;

    setGeneratedText(mockLetter);
    setIsGenerating(false);
    triggerToast("Cover letter generated!");
  };

  const handleCopy = () => {
    if (!generatedText) return;
    navigator.clipboard.writeText(generatedText);
    triggerToast("Copied to clipboard!");
  };

  const handleDownload = () => {
    if (!generatedText) return;
    const blob = new Blob([generatedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${company.replace(/\s+/g, "_")}_Cover_Letter.txt`;
    link.click();
    URL.revokeObjectURL(url);
    triggerToast("Download initiated!");
  };

  const handleSave = () => {
    if (!generatedText) return;
    triggerToast("Saved to cover letters database!");
  };

  return (
    <div className="space-y-6 pb-12 select-none">
      <PageHeader
        title="Cover Letters"
        description="Generate personalized, highly-tailored cover letters instantly with AI."
      />

      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed bottom-4 right-4 z-50 bg-primary text-white border-2 border-border p-3 text-[10px] font-black uppercase tracking-wider brutal-shadow flex items-center gap-1.5" role="alert">
          <Check className="h-4 w-4 stroke-[3px]" /> {toastMsg}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        
        {/* Generator Controls */}
        <Card className="border-[3px] border-border brutal-shadow bg-surface rounded-sm">
          <CardHeader className="border-b-2 border-border/10 pb-3">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-primary animate-pulse" /> Generator Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="jobTitle" className="text-[10px] font-black uppercase text-foreground-secondary">
                Job Title *
              </Label>
              <Input 
                id="jobTitle" 
                placeholder="e.g. Senior Frontend Developer" 
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="company" className="text-[10px] font-black uppercase text-foreground-secondary">
                Target Company *
              </Label>
              <Input 
                id="company" 
                placeholder="e.g. Linear Labs" 
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="h-10 text-xs font-bold"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[10px] font-black uppercase text-foreground-secondary">
                Job Description Details (Optional)
              </Label>
              <textarea
                id="description"
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Paste key responsibilities or keywords from the job description..."
                className="flex w-full rounded-sm bg-surface px-3 py-2 text-xs font-semibold brutal-border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary placeholder:text-foreground-muted"
              />
            </div>

            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating}
              className="h-10 w-full text-xs font-black uppercase brutal-shadow"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...
                </>
              ) : (
                "Generate Cover Letter"
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Live Preview Panel */}
        <Card className="border-[3px] border-border brutal-shadow bg-surface rounded-sm">
          <CardHeader className="border-b-2 border-border/10 pb-3">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-foreground">
              Document Preview
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col h-full min-h-[380px]">
            
            {generatedText ? (
              <textarea
                readOnly
                value={generatedText}
                className="flex-1 w-full p-4 text-[10px] font-mono leading-relaxed bg-slate-50 border-2 border-border rounded-sm focus:outline-none min-h-[300px]"
              />
            ) : (
              <div className="flex-1 border-2 border-dashed border-border/25 rounded-sm bg-surface-secondary/5 flex items-center justify-center text-center p-8 min-h-[300px]">
                <p className="text-[10px] font-bold text-foreground-muted max-w-xs leading-relaxed uppercase tracking-wider">
                  Fill in parameters and click generate to build your personalized cover letter.
                </p>
              </div>
            )}

            {/* Actions list */}
            <div className="mt-4 flex flex-wrap gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCopy}
                disabled={!generatedText}
                className="h-8 px-3 text-[9px] font-black uppercase flex items-center gap-1 border-2 border-border brutal-shadow-xs"
              >
                <Copy className="h-3.5 w-3.5" /> Copy Text
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleDownload}
                disabled={!generatedText}
                className="h-8 px-3 text-[9px] font-black uppercase flex items-center gap-1 border-2 border-border brutal-shadow-xs"
              >
                <Download className="h-3.5 w-3.5" /> Download (.txt)
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSave}
                disabled={!generatedText}
                className="h-8 px-3 text-[9px] font-black uppercase flex items-center gap-1 border border-border/30 hover:bg-surface-secondary ml-auto"
              >
                <Save className="h-3.5 w-3.5" /> Save Template
              </Button>
            </div>

          </CardContent>
        </Card>

      </div>
    </div>
  );
}
