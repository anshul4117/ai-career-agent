"use client";

import React, { useState } from "react";
import { useParserStore } from "../../store/resume-parser.store";
import { useProfileStore } from "../../../profile/store/profile.store";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Heading } from "@/components/ui/typography";
import { BrutalButton } from "@/components/ui/brutal-button";
import {
  ShieldAlert,
  AlertTriangle,
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Wrench,
  FolderGit2,
  Award,
  Languages,
  Share2,
  Edit3,
  Trash2,
  ArrowRightLeft,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";

// Zod schemas for editing parsed details
const personalSchema = zod.object({
  firstName: zod.string().min(1, "First name is required"),
  lastName: zod.string().min(1, "Last name is required"),
  headline: zod.string().min(1, "Headline is required"),
  email: zod.string().email("Invalid email format"),
  phone: zod.string().min(5, "Invalid phone"),
  city: zod.string().min(1, "City is required"),
  country: zod.string().min(1, "Country is required"),
});

const summarySchema = zod.object({
  summary: zod.string().min(10, "Summary must be at least 10 characters"),
});

export function ReviewPanel() {
  const router = useRouter();
  const profileStore = useProfileStore();
  const {
    reviewState,
    confidenceScores,
    updateReviewAction,
    updateReviewValue,
    resetParserStore,
    acceptParsing,
    rejectParsing,
    updateParsedField,
  } = useParserStore();

  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<
    | "personal"
    | "summary"
    | "experience"
    | "education"
    | "skills"
    | "projects"
    | "certifications"
    | "languages"
    | "socialLinks"
  >("personal");

  // Local editing states
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const existingProfile = profileStore.profile;

  // React Hook Form for Personal & Summary
  const {
    register: registerPersonal,
    handleSubmit: handlePersonalSubmit,
    setValue: setPersonalValue,
  } = useForm({
    resolver: zodResolver(personalSchema),
    defaultValues: reviewState?.personal?.value || {},
  });

  const { register: registerSummary, handleSubmit: handleSummarySubmit } =
    useForm({
      resolver: zodResolver(summarySchema),
      defaultValues: reviewState?.summary?.value || {},
    });

  if (!reviewState || !confidenceScores) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const toastId = toast.loading(
      "Syncing parsed resume details with profile workspace...",
    );
    try {
      await acceptParsing();
      toast.success(
        "Successfully synchronized parsed details with your Candidate Profile and created a new Resume Workspace Draft layout!",
        { id: toastId },
      );
      resetParserStore();
      router.push("/resume");
    } catch (err) {
      toast.error(
        "Failed to synchronize resume data: " + (err as Error).message,
        { id: toastId },
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRejectAll = async () => {
    const toastId = toast.loading("Discarding all parsed resume data...");
    try {
      await rejectParsing();
      toast.success("Parsed data successfully rejected and discarded.", {
        id: toastId,
      });
      router.push("/resume");
    } catch (err) {
      toast.error("Failed to discard parsed data: " + (err as Error).message, {
        id: toastId,
      });
    }
  };

  // Confidence rating formatter
  const renderConfidenceBadge = (score: number) => {
    let rating: "High" | "Medium" | "Low" = "High";
    if (score < 60) rating = "Low";
    else if (score < 85) rating = "Medium";

    return (
      <div className="flex flex-col gap-1 w-full max-w-[160px] md:max-w-[200px] shrink-0 text-left select-none">
        <div className="flex justify-between items-center text-[8px] font-black uppercase">
          <span>Confidence: {score}%</span>
          <span
            className={cn(
              "px-1 py-0.2 border text-[7px] rounded-sm font-black uppercase",
              rating === "High" &&
                "bg-green-100 text-green-700 border-green-300",
              rating === "Medium" &&
                "bg-amber-100 text-amber-700 border-amber-300",
              rating === "Low" && "bg-red-100 text-red-700 border-red-300",
            )}
          >
            {rating}
          </span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 dark:bg-surface-hover border border-border/20 rounded-sm overflow-hidden relative">
          <div
            className={cn(
              "h-full transition-all duration-300",
              rating === "High" && "bg-green-500",
              rating === "Medium" && "bg-amber-500",
              rating === "Low" && "bg-red-500",
            )}
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    );
  };

  const handleKeepValue = (field: string, val: string) => {
    updateParsedField("personal", field, val);
    setPersonalValue(
      field as
        | "firstName"
        | "lastName"
        | "headline"
        | "email"
        | "phone"
        | "city"
        | "country",
      val,
    );
    toast.success(`Updated field "${field}" to choice value.`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 w-full select-none pb-20">
      {/* Tab Select Left Column (Responsive) */}
      <div className="w-full lg:w-64 flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible shrink-0 border-b-2 lg:border-b-0 lg:border-r-2 border-border pb-3 lg:pb-0 lg:pr-4 select-none">
        {[
          {
            id: "personal",
            label: "Personal Details",
            icon: User,
            score: confidenceScores.personal,
          },
          {
            id: "summary",
            label: "Professional Summary",
            icon: FileText,
            score: confidenceScores.summary,
          },
          {
            id: "experience",
            label: "Experience History",
            icon: Briefcase,
            score: confidenceScores.experience,
          },
          {
            id: "education",
            label: "Education Details",
            icon: GraduationCap,
            score: confidenceScores.education,
          },
          {
            id: "skills",
            label: "Skills Tags",
            icon: Wrench,
            score: confidenceScores.skills,
          },
          {
            id: "projects",
            label: "Projects",
            icon: FolderGit2,
            score: confidenceScores.projects,
          },
          {
            id: "certifications",
            label: "Certifications",
            icon: Award,
            score: confidenceScores.certifications,
          },
          {
            id: "languages",
            label: "Languages",
            icon: Languages,
            score: confidenceScores.languages,
          },
          {
            id: "socialLinks",
            label: "Social Links",
            icon: Share2,
            score: confidenceScores.socialLinks,
          },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as typeof activeTab);
                setEditingIndex(null);
              }}
              className={cn(
                "px-3 py-2 text-left text-[10px] font-black uppercase tracking-wider border-2 rounded-sm transition-all whitespace-nowrap flex items-center justify-between gap-3 min-w-[150px] lg:min-w-0",
                isActive
                  ? "bg-primary text-white border-foreground brutal-shadow-xs translate-x-[-1px] translate-y-[-1px]"
                  : "bg-surface text-foreground border-border hover:bg-surface-secondary",
              )}
            >
              <span className="flex items-center gap-1.5">
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </span>
              {tab.score < 85 && (
                <ShieldAlert className="h-4 w-4 text-amber-500 fill-amber-100 shrink-0" />
              )}
            </button>
          );
        })}

        {/* Global Save Trigger */}
        <div className="hidden lg:flex flex-col gap-2 mt-8 pt-4 border-t border-border">
          <BrutalButton
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 w-full text-xs font-black uppercase brutal-shadow"
          >
            {isSaving ? "Syncing..." : "Accept All & Save"}
          </BrutalButton>

          <BrutalButton
            onClick={handleRejectAll}
            variant="secondary"
            className="h-10 w-full text-xs font-bold uppercase hover:bg-error hover:text-white border-error text-error"
          >
            Reject All
          </BrutalButton>
        </div>
      </div>

      {/* Main Review Sheet Area */}
      <div className="flex-1 space-y-6">
        {/* PERSONAL DETAILS TAB */}
        {activeTab === "personal" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Personal Details
                </Heading>
                <p className="text-[9px] text-foreground-secondary pt-0.5">
                  Verify contact details and choose which data parameter to use.
                </p>
              </div>
              {renderConfidenceBadge(confidenceScores.personal)}
            </div>

            {/* Difference Viewer & Chooser */}
            <div className="space-y-4">
              <Heading
                level="h4"
                className="text-xs font-black uppercase tracking-wider flex items-center gap-1"
              >
                <ArrowRightLeft className="h-3.5 w-3.5" /> Parameter Comparison
                Viewer
              </Heading>

              <div className="border border-border rounded-sm overflow-hidden text-xs">
                <div className="grid grid-cols-3 bg-surface-secondary p-2.5 font-black uppercase text-[9px] border-b border-border">
                  <div>Field Parameter</div>
                  <div>Existing Profile Value</div>
                  <div>Parsed Resume Value</div>
                </div>

                {[
                  {
                    key: "firstName",
                    label: "First Name",
                    existing: existingProfile?.personal?.firstName,
                    parsed: reviewState.personal.value.firstName,
                  },
                  {
                    key: "lastName",
                    label: "Last Name",
                    existing: existingProfile?.personal?.lastName,
                    parsed: reviewState.personal.value.lastName,
                  },
                  {
                    key: "email",
                    label: "Email Address",
                    existing: existingProfile?.contact?.email,
                    parsed: reviewState.personal.value.email,
                  },
                  {
                    key: "phone",
                    label: "Phone Number",
                    existing: existingProfile?.contact?.phone,
                    parsed: reviewState.personal.value.phone,
                  },
                  {
                    key: "city",
                    label: "City",
                    existing: existingProfile?.contact?.city,
                    parsed: reviewState.personal.value.city,
                  },
                  {
                    key: "country",
                    label: "Country",
                    existing: existingProfile?.contact?.country,
                    parsed: reviewState.personal.value.country,
                  },
                  {
                    key: "headline",
                    label: "Professional Headline",
                    existing: existingProfile?.career?.headline,
                    parsed: reviewState.personal.value.headline,
                  },
                ].map((row) => {
                  const hasDiff = row.existing !== row.parsed;
                  return (
                    <div
                      key={row.key}
                      className={cn(
                        "grid grid-cols-3 p-2.5 border-b border-border/10 items-center",
                        hasDiff ? "bg-amber-500/5" : "",
                      )}
                    >
                      <div className="font-extrabold text-[10px] uppercase text-foreground-secondary flex items-center gap-1">
                        {row.label}
                        {hasDiff && (
                          <AlertTriangle className="h-3 w-3 text-amber-500" />
                        )}
                      </div>

                      <div className="pr-2 truncate">
                        {row.existing ? (
                          <button
                            type="button"
                            onClick={() =>
                              handleKeepValue(row.key, row.existing!)
                            }
                            className="text-left font-mono hover:text-primary hover:underline truncate max-w-full block"
                            title="Click to keep existing value"
                          >
                            {row.existing}
                          </button>
                        ) : (
                          <span className="text-foreground-muted italic font-mono">
                            Not Set
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between min-w-0">
                        <span
                          className="font-mono text-foreground font-black truncate mr-1.5"
                          title={row.parsed}
                        >
                          {row.parsed}
                        </span>
                        {hasDiff && row.parsed && (
                          <button
                            type="button"
                            onClick={() => handleKeepValue(row.key, row.parsed)}
                            className="px-1.5 py-0.5 border border-border bg-primary text-white text-[8px] font-black uppercase rounded-sm hover:scale-[1.03] transition-all shrink-0"
                          >
                            Keep Parsed
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Select Status Action */}
            <div className="flex gap-2 pt-2">
              {(["accept", "ignore", "edit"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("personal", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.personal.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act} Extracted Info
                </button>
              ))}
            </div>

            {/* Editing Section */}
            {reviewState.personal.action === "edit" && (
              <form
                onSubmit={handlePersonalSubmit((data) => {
                  updateReviewValue("personal", data);
                  toast.success("Personal details updated locally!");
                })}
                className="space-y-4 pt-4 border-t border-border/10"
              >
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      First Name
                    </label>
                    <input
                      type="text"
                      {...registerPersonal("firstName")}
                      className={cn(
                        "w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm",
                        confidenceScores.personal < 85 &&
                          "border-amber-400 bg-amber-500/5",
                      )}
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      Last Name
                    </label>
                    <input
                      type="text"
                      {...registerPersonal("lastName")}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      Email Address
                    </label>
                    <input
                      type="email"
                      {...registerPersonal("email")}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      {...registerPersonal("phone")}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      City
                    </label>
                    <input
                      type="text"
                      {...registerPersonal("city")}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase text-foreground-secondary">
                      Country
                    </label>
                    <input
                      type="text"
                      {...registerPersonal("country")}
                      className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[9px] font-black uppercase text-foreground-secondary">
                    Professional Headline
                  </label>
                  <input
                    type="text"
                    {...registerPersonal("headline")}
                    className="w-full border-2 border-border bg-surface text-xs font-bold p-2 h-10 rounded-sm"
                  />
                </div>
                <BrutalButton
                  type="submit"
                  className="h-9 px-4 text-[10px] font-black uppercase"
                >
                  Apply Updates
                </BrutalButton>
              </form>
            )}
          </BrutalCard>
        )}

        {/* SUMMARY TAB */}
        {activeTab === "summary" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Professional Summary
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.summary)}
            </div>

            <div className="space-y-3">
              <Heading
                level="h4"
                className="text-xs font-black uppercase text-foreground-secondary"
              >
                Extracted Summary Text
              </Heading>
              <div className="p-3 border-2 border-border bg-surface-secondary/30 rounded-sm font-mono text-[10px] leading-relaxed text-foreground-secondary">
                {reviewState.summary.value.summary}
              </div>
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore", "edit"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("summary", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.summary.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act} Extracted Summary
                </button>
              ))}
            </div>

            {reviewState.summary.action === "edit" && (
              <form
                onSubmit={handleSummarySubmit((data) => {
                  updateReviewValue("summary", data);
                  toast.success("Summary updated locally!");
                })}
                className="space-y-3 pt-2"
              >
                <textarea
                  {...registerSummary("summary")}
                  rows={4}
                  className="w-full border-2 border-border bg-surface text-xs font-bold p-2 rounded-sm"
                />
                <BrutalButton
                  type="submit"
                  className="h-9 px-4 text-[10px] font-black uppercase"
                >
                  Apply Updates
                </BrutalButton>
              </form>
            )}
          </BrutalCard>
        )}

        {/* EXPERIENCE TAB */}
        {activeTab === "experience" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Experience History ({reviewState.experience.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.experience)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("experience", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.experience.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Extracted Items" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.experience.action === "accept" && (
              <div className="space-y-4 pt-2">
                {reviewState.experience.value.map((exp, idx) => (
                  <div
                    key={exp.id || idx}
                    className="border border-border/20 p-3 bg-slate-50/30 dark:bg-surface-secondary/30 rounded-sm relative group"
                  >
                    {editingIndex === idx ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Job Title
                            </label>
                            <input
                              type="text"
                              defaultValue={exp.jobTitle}
                              onBlur={(e) =>
                                updateParsedField("experience", idx, {
                                  jobTitle: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Company Name
                            </label>
                            <input
                              type="text"
                              defaultValue={exp.companyName}
                              onBlur={(e) =>
                                updateParsedField("experience", idx, {
                                  companyName: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Start Date
                            </label>
                            <input
                              type="text"
                              defaultValue={exp.startDate}
                              onBlur={(e) =>
                                updateParsedField("experience", idx, {
                                  startDate: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              End Date
                            </label>
                            <input
                              type="text"
                              defaultValue={exp.endDate || ""}
                              onBlur={(e) =>
                                updateParsedField("experience", idx, {
                                  endDate: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-foreground-secondary">
                            Description
                          </label>
                          <textarea
                            defaultValue={exp.description}
                            rows={3}
                            onBlur={(e) =>
                              updateParsedField("experience", idx, {
                                description: e.target.value,
                              })
                            }
                            className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                          />
                        </div>
                        <BrutalButton
                          onClick={() => setEditingIndex(null)}
                          className="h-7 px-3 text-[8px] font-black uppercase"
                        >
                          Finish Editing
                        </BrutalButton>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between font-bold text-[10px] text-foreground">
                          <span className="uppercase font-black">
                            {exp.jobTitle} — {exp.companyName}
                          </span>
                          <span className="font-mono text-[9px]">
                            {exp.startDate} to{" "}
                            {exp.currentPosition ? "Present" : exp.endDate}
                          </span>
                        </div>
                        {exp.location && (
                          <p className="text-[9px] italic text-foreground-muted">
                            {exp.location}
                          </p>
                        )}
                        <p className="text-[10px] leading-relaxed pt-1 text-foreground-secondary">
                          {exp.description}
                        </p>
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1 bg-surface border border-border hover:bg-surface-secondary text-foreground rounded-sm"
                            title="Edit this entry"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* EDUCATION TAB */}
        {activeTab === "education" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Education Details ({reviewState.education.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.education)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("education", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.education.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Extracted Items" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.education.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.education.value.map((edu, idx) => (
                  <div
                    key={edu.id || idx}
                    className="border border-border/20 p-3 bg-slate-50/30 dark:bg-surface-secondary/30 rounded-sm text-[10px] text-foreground relative group"
                  >
                    {editingIndex === idx ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Institution
                            </label>
                            <input
                              type="text"
                              defaultValue={edu.institution}
                              onBlur={(e) =>
                                updateParsedField("education", idx, {
                                  institution: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Degree
                            </label>
                            <input
                              type="text"
                              defaultValue={edu.degree}
                              onBlur={(e) =>
                                updateParsedField("education", idx, {
                                  degree: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Field of Study
                            </label>
                            <input
                              type="text"
                              defaultValue={edu.fieldOfStudy}
                              onBlur={(e) =>
                                updateParsedField("education", idx, {
                                  fieldOfStudy: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Grade / CGPA
                            </label>
                            <input
                              type="text"
                              defaultValue={edu.cgpa || ""}
                              onBlur={(e) =>
                                updateParsedField("education", idx, {
                                  cgpa: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                        </div>
                        <BrutalButton
                          onClick={() => setEditingIndex(null)}
                          className="h-7 px-3 text-[8px] font-black uppercase"
                        >
                          Finish Editing
                        </BrutalButton>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between font-bold">
                          <span>
                            {edu.degree} in {edu.fieldOfStudy}
                          </span>
                          <span className="font-mono text-[9px]">
                            {edu.startDate} – {edu.endDate}
                          </span>
                        </div>
                        <p className="pt-0.5 text-foreground-secondary">
                          {edu.institution} {edu.cgpa && `• Grade: ${edu.cgpa}`}
                        </p>
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1 bg-surface border border-border hover:bg-surface-secondary text-foreground rounded-sm"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* SKILLS TAB */}
        {activeTab === "skills" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Extracted Skills Tags ({reviewState.skills.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.skills)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("skills", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.skills.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Tags" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.skills.action === "accept" && (
              <div className="flex flex-wrap gap-2 pt-2">
                {reviewState.skills.value.map((skill, idx) => (
                  <div
                    key={skill.id || idx}
                    className="border border-border bg-surface-secondary/40 px-2.5 py-1 text-[10px] font-bold uppercase rounded-sm flex items-center gap-1.5"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[8px] px-1 border border-border bg-surface text-foreground-muted">
                      {skill.level}
                    </span>
                    <button
                      onClick={() => {
                        const filtered = reviewState.skills.value.filter(
                          (_, i) => i !== idx,
                        );
                        updateParsedField("skills", "", filtered); // triggers update
                        toast.success(`Removed tag "${skill.name}".`);
                      }}
                      className="text-error hover:text-error/80 ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* PROJECTS TAB */}
        {activeTab === "projects" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Projects ({reviewState.projects.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.projects)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("projects", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.projects.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Projects" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.projects.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.projects.value.map((proj, idx) => (
                  <div
                    key={proj.id || idx}
                    className="border border-border/20 p-3 bg-slate-50/30 dark:bg-surface-secondary/30 rounded-sm text-[10px] relative group"
                  >
                    {editingIndex === idx ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Project Title
                            </label>
                            <input
                              type="text"
                              defaultValue={proj.title}
                              onBlur={(e) =>
                                updateParsedField("projects", idx, {
                                  title: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Project Role
                            </label>
                            <input
                              type="text"
                              defaultValue={proj.role}
                              onBlur={(e) =>
                                updateParsedField("projects", idx, {
                                  role: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                        </div>
                        <div>
                          <label className="text-[8px] font-black uppercase text-foreground-secondary">
                            Description
                          </label>
                          <textarea
                            defaultValue={proj.description}
                            rows={2}
                            onBlur={(e) =>
                              updateParsedField("projects", idx, {
                                description: e.target.value,
                              })
                            }
                            className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                          />
                        </div>
                        <BrutalButton
                          onClick={() => setEditingIndex(null)}
                          className="h-7 px-3 text-[8px] font-black uppercase"
                        >
                          Finish Editing
                        </BrutalButton>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between font-bold text-foreground">
                          <span>{proj.title}</span>
                          {proj.role && (
                            <span className="font-mono text-primary text-[9px]">
                              {proj.role}
                            </span>
                          )}
                        </div>
                        <p className="pt-1 leading-relaxed text-foreground-secondary">
                          {proj.description}
                        </p>
                        {proj.techStack && proj.techStack.length > 0 && (
                          <p className="text-[9px] font-semibold text-foreground-muted pt-1">
                            Stack: {proj.techStack.join(", ")}
                          </p>
                        )}
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1 bg-surface border border-border hover:bg-surface-secondary text-foreground rounded-sm"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* CERTIFICATIONS TAB */}
        {activeTab === "certifications" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Certifications ({reviewState.certifications.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.certifications)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("certifications", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.certifications.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Certifications" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.certifications.action === "accept" && (
              <div className="space-y-3 pt-2">
                {reviewState.certifications.value.map((c, idx) => (
                  <div
                    key={c.id || idx}
                    className="border border-border/20 p-3 bg-slate-50/30 dark:bg-surface-secondary/30 rounded-sm text-[10px] relative group"
                  >
                    {editingIndex === idx ? (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Name
                            </label>
                            <input
                              type="text"
                              defaultValue={c.name}
                              onBlur={(e) =>
                                updateParsedField("certifications", idx, {
                                  name: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                          <div>
                            <label className="text-[8px] font-black uppercase text-foreground-secondary">
                              Issuer
                            </label>
                            <input
                              type="text"
                              defaultValue={c.issuingOrganization}
                              onBlur={(e) =>
                                updateParsedField("certifications", idx, {
                                  issuingOrganization: e.target.value,
                                })
                              }
                              className="w-full border border-border text-[10px] p-1.5 rounded-sm"
                            />
                          </div>
                        </div>
                        <BrutalButton
                          onClick={() => setEditingIndex(null)}
                          className="h-7 px-3 text-[8px] font-black uppercase"
                        >
                          Finish Editing
                        </BrutalButton>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between font-bold">
                          <span>{c.name}</span>
                          <span className="font-mono text-primary text-[9px]">
                            {c.issueDate}
                          </span>
                        </div>
                        <p className="pt-0.5 text-foreground-secondary">
                          {c.issuingOrganization}
                        </p>
                        <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                          <button
                            onClick={() => setEditingIndex(idx)}
                            className="p-1 bg-surface border border-border hover:bg-surface-secondary text-foreground rounded-sm"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* LANGUAGES TAB */}
        {activeTab === "languages" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Extracted Languages ({reviewState.languages.value.length})
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.languages)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("languages", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.languages.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Languages" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.languages.action === "accept" && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                {reviewState.languages.value.map((l, idx) => (
                  <div
                    key={l.id || idx}
                    className="border border-border p-3 bg-surface-secondary/20 rounded-sm text-[10px] flex items-center justify-between"
                  >
                    <div>
                      <p className="font-extrabold uppercase text-foreground">
                        {l.language}
                      </p>
                      <p className="text-[9px] text-foreground-muted">
                        Level:{" "}
                        {l.nativeLanguage ? "Native Speaker" : l.speakingLevel}
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        const filtered = reviewState.languages.value.filter(
                          (_, i) => i !== idx,
                        );
                        updateParsedField("languages", "", filtered);
                        toast.success(`Removed language "${l.language}".`);
                      }}
                      className="p-1 text-error border border-border/10 hover:border-error bg-surface rounded-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* SOCIAL LINKS TAB */}
        {activeTab === "socialLinks" && (
          <BrutalCard className="p-5 bg-surface border-[3px] border-border brutal-shadow space-y-4">
            <div className="flex justify-between items-center border-b-2 border-border/10 pb-2">
              <div>
                <Heading
                  level="h3"
                  className="text-sm font-black uppercase tracking-wider text-foreground"
                >
                  Extracted Social Links ({reviewState.socialLinks.value.length}
                  )
                </Heading>
              </div>
              {renderConfidenceBadge(confidenceScores.socialLinks)}
            </div>

            <div className="flex gap-2">
              {(["accept", "ignore"] as const).map((act) => (
                <button
                  key={act}
                  onClick={() => updateReviewAction("socialLinks", act)}
                  className={cn(
                    "px-3 py-1.5 border-2 text-[9px] font-black uppercase rounded-sm",
                    reviewState.socialLinks.action === act
                      ? "bg-primary text-white border-foreground"
                      : "bg-surface hover:bg-surface-secondary border-border",
                  )}
                >
                  {act === "accept" ? "Append Social Links" : "Ignore"}
                </button>
              ))}
            </div>

            {reviewState.socialLinks.action === "accept" && (
              <div className="space-y-2 pt-2">
                {reviewState.socialLinks.value.map((s, idx) => (
                  <div
                    key={s.id || idx}
                    className="border border-border p-3 bg-surface-secondary/20 rounded-sm text-[10px] flex items-center justify-between font-mono"
                  >
                    <div>
                      <span className="font-extrabold uppercase text-primary pr-2">
                        {s.platform}:
                      </span>
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline text-foreground-secondary"
                      >
                        {s.url}
                      </a>
                    </div>
                    <button
                      onClick={() => {
                        const filtered = reviewState.socialLinks.value.filter(
                          (_, i) => i !== idx,
                        );
                        updateParsedField("socialLinks", "", filtered);
                        toast.success(`Removed social platform link.`);
                      }}
                      className="p-1 text-error border border-border/10 hover:border-error bg-surface rounded-sm"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </BrutalCard>
        )}

        {/* Global Save Trigger for mobile stacking */}
        <div className="flex lg:hidden flex-col gap-2 pt-4">
          <BrutalButton
            onClick={handleSave}
            disabled={isSaving}
            className="h-11 w-full text-xs font-black uppercase brutal-shadow"
          >
            {isSaving ? "Syncing..." : "Accept All & Save"}
          </BrutalButton>

          <BrutalButton
            onClick={handleRejectAll}
            variant="secondary"
            className="h-10 w-full text-xs font-bold uppercase border-error text-error hover:bg-error hover:text-white"
          >
            Reject All
          </BrutalButton>
        </div>
      </div>
    </div>
  );
}
