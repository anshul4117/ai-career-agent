"use client";

import React, { useState } from "react";
import Link from "next/link";
import { LandingNavbar } from "@/features/landing/components/landing-navbar";
import { LandingFooter } from "@/features/landing/components/landing-footer";
import { BrutalCard } from "@/components/ui/brutal-card";
import { BrutalButton } from "@/components/ui/brutal-button";
import { Heading, Text } from "@/components/ui/typography";
import { ErrorMessage } from "@/features/auth/components/error-message";
import { Mail, Github, Linkedin, HelpCircle, Check } from "lucide-react";
import { InlineLoader } from "@/components/ui/brand-loader";

export default function ContactPage() {
  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const { name, email, subject, message } = formData;
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      setError("Please fill out all required fields.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Please supply a valid email address.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar />

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12 md:py-20 space-y-12">
        {/* Header block */}
        <section className="text-center space-y-3 max-w-2xl mx-auto">
          <Heading level="h1" className="text-4xl sm:text-5xl font-black uppercase tracking-tight">
            CONTACT SUPPORT & SALES
          </Heading>
          <Text className="text-foreground-secondary text-sm leading-relaxed">
            Have questions about matches, resume builders, or platform performance? Submit details below to get in touch with our team.
          </Text>
        </section>

        <div className="grid gap-6 md:grid-cols-5">
          {/* Form Column */}
          <div className="md:col-span-3">
            {isSuccess ? (
              <BrutalCard className="bg-surface border-[3px] border-border p-6 text-center space-y-4 brutal-shadow">
                <div className="mx-auto h-12 w-12 rounded-full border-[3px] border-border bg-success flex items-center justify-center brutal-shadow-sm">
                  <Check className="h-6 w-6 text-white stroke-[3px]" />
                </div>
                <Heading level="h2" className="text-2xl font-black uppercase tracking-tight">Message Received!</Heading>
                <Text className="text-foreground-secondary text-xs leading-relaxed max-w-sm mx-auto">
                  Thank you for getting in touch. One of our engineers or support representatives will reach out to you within 24 hours.
                </Text>
                <div className="pt-2">
                  <BrutalButton onClick={() => setIsSuccess(false)} variant="secondary" className="w-full h-11 uppercase font-bold text-xs tracking-wider">
                    Submit Another Message
                  </BrutalButton>
                </div>
              </BrutalCard>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <BrutalCard className="bg-surface border-[3px] border-border p-6 space-y-4 brutal-shadow">
                  <ErrorMessage message={error} onClose={() => setError(null)} />

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1">
                      <label htmlFor="contact-name" className="font-bold text-xs uppercase text-foreground-secondary">
                        Name <span className="text-error">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="John Doe"
                        className="w-full border-2 border-border p-2.5 text-sm focus:outline-primary bg-surface"
                        disabled={isSubmitting}
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="contact-email" className="font-bold text-xs uppercase text-foreground-secondary">
                        Email Address <span className="text-error">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com"
                        className="w-full border-2 border-border p-2.5 text-sm focus:outline-primary bg-surface"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-subject" className="font-bold text-xs uppercase text-foreground-secondary">
                      Subject <span className="text-error">*</span>
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="E.g., Resume builder issue, Partnership inquiry"
                      className="w-full border-2 border-border p-2.5 text-sm focus:outline-primary bg-surface"
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="contact-message" className="font-bold text-xs uppercase text-foreground-secondary">
                      Message <span className="text-error">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Write your detailed message here..."
                      rows={5}
                      className="w-full border-2 border-border p-2.5 text-sm focus:outline-primary bg-surface"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </BrutalCard>

                <BrutalButton
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 uppercase font-bold text-sm tracking-wide flex items-center justify-center gap-2"
                >
                  {isSubmitting && <InlineLoader />}
                  Submit Message
                </BrutalButton>
              </form>
            )}
          </div>

          {/* Socials & Help Sidebar */}
          <div className="md:col-span-2 space-y-4">
            <BrutalCard className="bg-surface-secondary border-[3px] border-border p-6 space-y-4 brutal-shadow">
              <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                Office Desk
              </Heading>
              
              <div className="space-y-2 text-xs leading-relaxed text-foreground-secondary">
                <p>📍 <strong>Bengaluru Office:</strong><br />Indiranagar Workspace, Bengaluru, Karnataka, India</p>
                <p>✉ <strong>General Queries:</strong><br />support@aicareeragent.com</p>
              </div>
            </BrutalCard>

            <BrutalCard className="bg-surface-secondary border-[3px] border-border p-6 space-y-3 brutal-shadow">
              <Heading level="h3" className="text-lg font-black uppercase tracking-tight">Social Networks</Heading>
              
              <div className="grid gap-2">
                <a
                  href="https://github.com/anshul4117/ai-career-agent"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 border-2 border-border bg-surface text-xs font-bold uppercase tracking-wider brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow transition-all"
                >
                  <Github className="h-4 w-4" />
                  GitHub Repository
                </a>
                <a
                  href="https://www.linkedin.com/in/anshul-ab7135245/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2 border-2 border-border bg-surface text-xs font-bold uppercase tracking-wider brutal-shadow-sm hover:translate-x-[-1px] hover:translate-y-[-1px] hover:brutal-shadow transition-all"
                >
                  <Linkedin className="h-4 w-4" />
                  LinkedIn Profile
                </a>
              </div>
            </BrutalCard>

            <BrutalCard className="bg-surface-secondary border-[3px] border-border p-6 space-y-3 brutal-shadow">
              <Heading level="h3" className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Help & Guides
              </Heading>
              <Text className="text-foreground-secondary text-xs leading-relaxed">
                Check out our FAQs to find fast answers to questions regarding subscription details and ATS scores.
              </Text>
              <div className="pt-1">
                <BrutalButton asChild variant="secondary" className="w-full h-10 uppercase font-bold text-xs tracking-wider">
                  <Link href="/faq">Visit FAQs</Link>
                </BrutalButton>
              </div>
            </BrutalCard>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
