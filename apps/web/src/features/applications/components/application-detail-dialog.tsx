"use client";

import React, { useState } from "react";
import type {
  JobApplication,
  ApplicationNote,
} from "../types/application.types";
import type { ApplicationStatus } from "@/types";
import { motion } from "framer-motion";
import { BrutalCard } from "@/components/ui/brutal-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BrutalSelect } from "@/components/ui/brutal-select";
import {
  X,
  Trash2,
  Calendar,
  Clock,
  User,
  Mail,
  DollarSign,
  FileText,
  Clock3,
  AlertTriangle,
  Plus,
  Paperclip,
  Bell,
  Edit,
  FileUp,
  Sparkles,
} from "lucide-react";
import { useConfirm } from "@/components/ui/confirm-dialog";
import { useApplicationStore } from "../store/application.store";

interface ApplicationDetailDialogProps {
  application: JobApplication;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<JobApplication>) => void;
  onUpdateStatus: (id: string, status: ApplicationStatus) => void;
  onDelete: (id: string) => void;
}

const STATUS_OPTIONS: { label: string; value: ApplicationStatus }[] = [
  { label: "Saved Opportunity", value: "SAVED" },
  { label: "Applied", value: "APPLIED" },
  { label: "Screening", value: "SCREENING" },
  { label: "Assessment", value: "ASSESSMENT" },
  { label: "Interview", value: "INTERVIEW" },
  { label: "Offer Received", value: "OFFER" },
  { label: "Offer Accepted (Hired)", value: "ACCEPTED" },
  { label: "Closed / Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" },
];

const STAGES: { key: ApplicationStatus; label: string }[] = [
  { key: "SAVED", label: "Saved" },
  { key: "APPLIED", label: "Applied" },
  { key: "SCREENING", label: "Screening" },
  { key: "INTERVIEW", label: "Interview" },
  { key: "ASSESSMENT", label: "Assessment" },
  { key: "OFFER", label: "Offer" },
  { key: "ACCEPTED", label: "Hired" },
];

export function ApplicationDetailDialog({
  application,
  onClose,
  onUpdate,
  onUpdateStatus,
  onDelete,
}: ApplicationDetailDialogProps) {
  const { confirm, ConfirmationDialog } = useConfirm();
  const {
    addNote,
    updateNote,
    deleteNote,
    loading: storeLoading,
  } = useApplicationStore();

  // Local states for inputs to avoid multiple store re-renders while typing
  const [recruiterName, setRecruiterName] = React.useState(
    application.recruiterName,
  );
  const [recruiterEmail, setRecruiterEmail] = React.useState(
    application.recruiterEmail,
  );
  const [phone, setPhone] = React.useState(application.phone || "");
  const [salaryNotes, setSalaryNotes] = React.useState(application.salaryNotes);
  const [salaryDiscussion, setSalaryDiscussion] = React.useState(
    application.salaryDiscussion || "",
  );
  const [interviewNotes, setInterviewNotes] = React.useState(
    application.interviewNotes,
  );
  const [followUpNotes, setFollowUpNotes] = React.useState(
    application.followUpNotes,
  );
  const [personalNotes, setPersonalNotes] = React.useState(
    application.personalNotes,
  );

  // Schedule states
  const [interviewDate, setInterviewDate] = React.useState(
    application.interviewDate || "",
  );
  const [interviewTime, setInterviewTime] = React.useState(
    application.interviewTime || "",
  );
  const [interviewType, setInterviewType] = React.useState(
    application.interviewType || "N/A",
  );
  const [interviewRound, setInterviewRound] = React.useState(
    application.interviewRound || "",
  );
  const [interviewStatus, setInterviewStatus] = React.useState(
    application.interviewStatus || "N/A",
  );
  const [interviewerName, setInterviewerName] = React.useState(
    application.interviewerName || "",
  );
  const [meetingLink, setMeetingLink] = React.useState(
    application.meetingLink || "",
  );
  const [offerDeadline] = React.useState(application.offerDeadline || "");
  const [location, setLocation] = React.useState(application.location || "");
  const [isRemote, setIsRemote] = React.useState(application.isRemote || false);

  // Follow-up reminder date state
  const [followUpDate, setFollowUpDate] = useState(
    application.offerDeadline || "",
  );

  // Interactive notes state
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteText, setEditingNoteText] = useState("");

  // Mock attachments state
  const [attachments] = useState([
    {
      name: application.resumeUsed || "Resume_Main_v2.pdf",
      size: "1.4 MB",
      type: "PDF",
    },
    ...(application.coverLetterUsed && application.coverLetterUsed !== "N/A"
      ? [{ name: application.coverLetterUsed, size: "820 KB", type: "PDF" }]
      : []),
  ]);

  // Debounce updates back to store
  const handleFieldBlur = (field: keyof JobApplication, val: string) => {
    onUpdate(application.id, { [field]: val });
  };

  const handleScheduleChange = () => {
    onUpdate(application.id, {
      interviewDate,
      interviewTime,
      interviewType: interviewType as JobApplication["interviewType"],
      interviewRound,
      interviewStatus: interviewStatus as JobApplication["interviewStatus"],
      interviewerName,
      meetingLink,
      offerDeadline,
      location,
      isRemote,
    });
  };

  // Note Handlers
  const handleAddNoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    await addNote(application.id, newNoteText.trim());
    setNewNoteText("");
  };

  const handleStartEditNote = (note: ApplicationNote) => {
    setEditingNoteId(note.id);
    setEditingNoteText(note.content);
  };

  const handleSaveEditNote = async (noteId: string) => {
    if (!editingNoteText.trim()) return;
    await updateNote(application.id, noteId, editingNoteText.trim());
    setEditingNoteId(null);
    setEditingNoteText("");
  };

  const handleDeleteNoteClick = async (noteId: string) => {
    const confirmDelete = await confirm({
      title: "Delete Note",
      description: "Delete this note forever from the log?",
      isDestructive: true,
      confirmLabel: "Delete",
    });
    if (confirmDelete) {
      await deleteNote(application.id, noteId);
    }
  };

  // Follow-up reminder logic
  const getFollowUpStatus = () => {
    if (!followUpDate)
      return {
        label: "No Follow-up Scheduled",
        color: "text-foreground-muted",
      };
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(followUpDate);
    due.setHours(0, 0, 0, 0);

    if (due.getTime() < today.getTime()) {
      return {
        label: "Overdue Reminder",
        color: "text-rose-600 dark:text-rose-400 animate-pulse font-black",
      };
    } else if (due.getTime() === today.getTime()) {
      return {
        label: "Action Due Today",
        color: "text-amber-600 dark:text-amber-400 animate-bounce font-black",
      };
    }
    return {
      label: "Upcoming Scheduled",
      color: "text-green-600 dark:text-green-400 font-bold",
    };
  };

  const reminderStatus = getFollowUpStatus();

  // Find index of current status in pipeline
  const currentStageIndex = STAGES.findIndex(
    (s) => s.key === application.status,
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none text-left">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-xs"
      />

      {/* Drawer */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-2xl bg-background border-l-[3px] border-border brutal-shadow-hover h-full overflow-y-auto z-10 flex flex-col p-5 space-y-5"
      >
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b-2 border-border/10 pb-3">
          <div>
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">
              {application.company}
            </span>
            <h2 className="text-sm font-black uppercase text-foreground leading-tight tracking-tight mt-0.5">
              {application.jobTitle}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 border-2 border-border brutal-shadow-xs hover:bg-surface-secondary rounded-sm"
            aria-label="Close details panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Status Pipeline Progress Timeline */}
        <div className="border-2 border-border bg-surface p-4 rounded-sm brutal-shadow-xs space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] font-black text-foreground-secondary uppercase tracking-wider">
              Pipeline Stage Progression
            </span>
            {application.status === "REJECTED" && (
              <Badge className="text-[7.5px] font-black uppercase px-2 py-0.5 bg-rose-100 text-rose-700 border border-rose-300 rounded-none shadow-none">
                Application Rejected / Closed
              </Badge>
            )}
            {application.status === "WITHDRAWN" && (
              <Badge className="text-[7.5px] font-black uppercase px-2 py-0.5 bg-slate-100 text-slate-700 border border-slate-300 rounded-none shadow-none">
                Application Withdrawn
              </Badge>
            )}
          </div>

          {/* Interactive Step Timeline */}
          {application.status !== "REJECTED" &&
          application.status !== "WITHDRAWN" ? (
            <div className="relative flex justify-between items-center text-[7px] font-black uppercase text-center mt-2.5">
              {/* Line Connector */}
              <div className="absolute top-3.5 left-[10px] right-[10px] h-0.5 bg-slate-200 dark:bg-surface-hover -z-10" />
              <div
                className="absolute top-3.5 left-[10px] h-0.5 bg-primary -z-10 transition-all duration-300"
                style={{
                  width: `${currentStageIndex >= 0 ? (currentStageIndex / (STAGES.length - 1)) * 100 : 0}%`,
                }}
              />

              {STAGES.map((stage, idx) => {
                const isCompleted = idx <= currentStageIndex;
                const isActive = idx === currentStageIndex;
                return (
                  <button
                    key={stage.key}
                    onClick={() => onUpdateStatus(application.id, stage.key)}
                    className="flex flex-col items-center gap-1.5 focus:outline-none transition-all group"
                  >
                    <div
                      className={`h-7 w-7 rounded-full border-2 border-border flex items-center justify-center font-bold text-[10px] transition-all brutal-shadow-xs ${
                        isActive
                          ? "bg-primary text-white scale-110"
                          : isCompleted
                            ? "bg-primary/20 text-primary border-primary/50"
                            : "bg-surface text-foreground-muted"
                      }`}
                    >
                      {isCompleted ? "✓" : idx + 1}
                    </div>
                    <span
                      className={`text-[6.5px] tracking-tight ${isActive ? "text-primary font-black" : "text-foreground-secondary"}`}
                    >
                      {stage.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 bg-rose-50/50 dark:bg-rose-500/5 border-2 border-dashed border-rose-300/40 rounded-sm text-center flex flex-col items-center gap-1.5">
              <AlertTriangle className="h-6 w-6 text-rose-500" />
              <div className="text-[10px] font-black uppercase text-rose-700 dark:text-rose-400">
                Pipeline Closed
              </div>
              <p className="text-[8px] font-bold text-foreground-muted max-w-sm normal-case">
                This application is archived as{" "}
                {application.status.toLowerCase()}. You can reset the stage
                status to active above if you wish to reopen it.
              </p>
              <Button
                size="sm"
                onClick={() => onUpdateStatus(application.id, "APPLIED")}
                className="h-7 text-[8.5px] font-black uppercase border-2 border-border bg-surface text-foreground rounded-sm px-2.5 brutal-shadow-xs hover:brutal-shadow"
              >
                Reopen Application
              </Button>
            </div>
          )}
        </div>

        {/* AI Scores Summary Row */}
        <div className="grid grid-cols-2 gap-3.5">
          <BrutalCard className="border-2 border-border bg-slate-50/50 dark:bg-surface-secondary/50 p-2.5 rounded-sm flex flex-col items-center">
            <span className="text-[7.5px] font-black text-foreground-muted uppercase">
              Match Quality
            </span>
            <span className="text-sm font-black text-primary mt-0.5">
              {application.matchScore}% Match
            </span>
          </BrutalCard>

          <BrutalCard className="border-2 border-border bg-slate-50/50 dark:bg-surface-secondary/50 p-2.5 rounded-sm flex flex-col items-center">
            <span className="text-[7.5px] font-black text-foreground-muted uppercase">
              Trust Quality
            </span>
            <span className="text-sm font-black text-foreground mt-0.5">
              {application.jobQuality}% Trust
            </span>
          </BrutalCard>
        </div>

        {/* Stage Selector Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-foreground-secondary uppercase tracking-wider block">
            Modify Pipeline Stage Status
          </label>
          <BrutalSelect
            value={application.status}
            onChange={(e) =>
              onUpdateStatus(
                application.id,
                e.target.value as ApplicationStatus,
              )
            }
            options={STATUS_OPTIONS}
            className="text-xs font-black uppercase tracking-wider h-9"
          />
        </div>

        {/* Core Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase text-foreground-secondary bg-surface-secondary/10 p-3 border border-border/20 rounded-sm">
          <div className="space-y-0.5">
            <span className="text-foreground-muted block text-[7.5px]">
              Date Applied
            </span>
            <span>{application.appliedAt.split("T")[0]}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-foreground-muted block text-[7.5px]">
              Submission Source
            </span>
            <span>{application.source}</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-foreground-muted block text-[7.5px]">
              Resume Utilized
            </span>
            <span className="truncate flex items-center gap-1">
              <FileText className="h-3 w-3 text-foreground-muted shrink-0" />{" "}
              {application.resumeUsed || "None"}
            </span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-foreground-muted block text-[7.5px]">
              Cover Letter Utilized
            </span>
            <span className="truncate flex items-center gap-1">
              <FileText className="h-3 w-3 text-foreground-muted shrink-0" />{" "}
              {application.coverLetterUsed || "None"}
            </span>
          </div>
        </div>

        {/* Follow-up Reminder Card */}
        <BrutalCard className="border-[3px] border-border bg-surface p-4 rounded-sm brutal-shadow-xs grid gap-4 sm:grid-cols-2 items-center">
          <div className="space-y-1.5 text-left">
            <h4 className="text-[9px] font-black uppercase tracking-wider text-foreground flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5 text-primary" /> Follow-up Reminder
              Card
            </h4>
            <div className="space-y-0.5">
              <span className="text-[7.5px] font-bold text-foreground-muted uppercase block">
                Next follow-up target date
              </span>
              <Input
                type="date"
                value={followUpDate}
                onChange={(e) => {
                  setFollowUpDate(e.target.value);
                  onUpdate(application.id, { offerDeadline: e.target.value });
                }}
                className="h-8 text-xs font-bold border border-border/40 w-full"
              />
            </div>
          </div>
          <div className="h-full border-l-2 border-border/10 pl-4 flex flex-col justify-center space-y-1">
            <span className="text-[7.5px] font-black text-foreground-muted uppercase">
              Reminder Status
            </span>
            <div
              className={`text-[10px] uppercase font-black ${reminderStatus.color}`}
            >
              {reminderStatus.label}
            </div>
            <p className="text-[8px] font-bold text-foreground-muted normal-case normal-case mt-0.5 leading-snug">
              Triggers a system alert notification once target follow-up date
              matches current workspace clock.
            </p>
          </div>
        </BrutalCard>

        {/* Recruiter Details */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
            Recruiter Contact Details
          </h3>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                <User className="h-3 w-3" /> Contact Name
              </span>
              <Input
                placeholder="Sarah Connor"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                onBlur={() => handleFieldBlur("recruiterName", recruiterName)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                <Mail className="h-3 w-3" /> Contact Email
              </span>
              <Input
                placeholder="sarah@linear.app"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                onBlur={() => handleFieldBlur("recruiterEmail", recruiterEmail)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                Phone Number
              </span>
              <Input
                placeholder="+1 (555) 101-2048"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                onBlur={() => handleFieldBlur("phone", phone)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                <DollarSign className="h-3 w-3" /> Salary Budget
              </span>
              <Input
                placeholder="$140,000 - $160,000 USD basic + options"
                value={salaryNotes}
                onChange={(e) => setSalaryNotes(e.target.value)}
                onBlur={() => handleFieldBlur("salaryNotes", salaryNotes)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                Negotiations Discussion
              </span>
              <Input
                placeholder="Discussed options pool vesting..."
                value={salaryDiscussion}
                onChange={(e) => setSalaryDiscussion(e.target.value)}
                onBlur={() =>
                  handleFieldBlur("salaryDiscussion", salaryDiscussion)
                }
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>
        </div>

        {/* Interview Tracker Grid */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
            Interview & Process Scheduler
          </h3>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                <Calendar className="h-3 w-3" /> Interview Date
              </span>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">
                <Clock className="h-3 w-3" /> Start Time
              </span>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Round Topic
              </span>
              <Input
                placeholder="e.g. HR Pre-screen"
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Round Style / Medium
              </span>
              <BrutalSelect
                value={interviewType}
                onChange={(e) => {
                  const val = e.target.value as JobApplication["interviewType"];
                  setInterviewType(val);
                  onUpdate(application.id, { interviewType: val });
                }}
                options={[
                  { label: "Video Panel Round", value: "Video Call" },
                  { label: "Onsite Panel Round", value: "Onsite" },
                  { label: "Phone Screen Call", value: "Phone Screen" },
                  { label: "Tech Challenge", value: "Technical Challenge" },
                  { label: "N/A", value: "N/A" },
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Invite Status
              </span>
              <BrutalSelect
                value={interviewStatus}
                onChange={(e) => {
                  const val = e.target
                    .value as JobApplication["interviewStatus"];
                  setInterviewStatus(val);
                  onUpdate(application.id, { interviewStatus: val });
                }}
                options={[
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Pending Coordinate", value: "Pending" },
                  { label: "N/A", value: "N/A" },
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Interviewer Name
              </span>
              <Input
                placeholder="e.g. Lee Robinson"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Meeting / Call Link
              </span>
              <Input
                placeholder="e.g. https://zoom.us/j/..."
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Remote or Onsite
              </span>
              <BrutalSelect
                value={isRemote ? "remote" : "onsite"}
                onChange={(e) => {
                  const val = e.target.value === "remote";
                  setIsRemote(val);
                  onUpdate(application.id, { isRemote: val });
                }}
                options={[
                  { label: "Remote Location", value: "remote" },
                  { label: "Onsite / Hybrid Office", value: "onsite" },
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Office Location City
              </span>
              <Input
                placeholder="e.g. San Francisco, CA"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>
        </div>

        {/* Interactive Notes Section */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Sparkles className="h-4 w-4 text-primary" /> Application Notes
            Workspace
          </h3>

          {/* Add note input box */}
          <form onSubmit={handleAddNoteSubmit} className="flex gap-2">
            <Input
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Type note details here (e.g. key feedback, follow-up thoughts)..."
              className="h-9 text-xs font-bold border-2 border-border bg-surface"
              disabled={storeLoading}
            />
            <Button
              type="submit"
              disabled={storeLoading || !newNoteText.trim()}
              className="h-9 px-3.5 text-[9px] font-black uppercase border-2 border-border bg-primary text-white hover:bg-primary/90 brutal-shadow-xs flex items-center gap-1"
            >
              <Plus className="h-4 w-4" /> Add Note
            </Button>
          </form>

          {/* Notes logs feed */}
          <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
            {(application.notes || []).length > 0 ? (
              (application.notes || []).map((note) => (
                <div
                  key={note.id}
                  className="p-3 border-2 border-border rounded-sm bg-surface-secondary/20 flex flex-col justify-between gap-1"
                >
                  {editingNoteId === note.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={editingNoteText}
                        onChange={(e) => setEditingNoteText(e.target.value)}
                        className="w-full text-xs font-bold p-2 border border-border bg-surface rounded-sm focus:outline-none"
                        rows={2}
                      />
                      <div className="flex justify-end gap-1.5">
                        <Button
                          onClick={() => setEditingNoteId(null)}
                          className="h-7 text-[8px] font-black uppercase border border-border bg-surface text-foreground px-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={() => handleSaveEditNote(note.id)}
                          className="h-7 text-[8px] font-black uppercase border border-border bg-primary text-white px-2"
                        >
                          Save Changes
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-bold leading-relaxed text-foreground-secondary normal-case whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex justify-between items-center pt-1 border-t border-border/5 text-[7px] font-black text-foreground-muted uppercase">
                        <span>{new Date(note.createdAt).toLocaleString()}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleStartEditNote(note)}
                            className="hover:text-primary flex items-center gap-0.5 focus:outline-none"
                          >
                            <Edit className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => handleDeleteNoteClick(note.id)}
                            className="hover:text-rose-600 flex items-center gap-0.5 focus:outline-none"
                          >
                            <Trash2 className="h-3 w-3" /> Delete
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[8px] font-bold text-foreground-muted italic py-3 text-center uppercase tracking-wider border border-dashed border-border/20 rounded-sm">
                No custom notes registered for this pipeline role yet.
              </p>
            )}
          </div>
        </div>

        {/* Attachments Section */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1.5">
            <Paperclip className="h-4 w-4 text-foreground-secondary" />{" "}
            Attachments & Portfolios
          </h3>

          <div className="grid gap-2 sm:grid-cols-2">
            {attachments.map((file) => (
              <div
                key={file.name}
                className="p-2.5 border border-border/30 rounded-sm bg-slate-50/50 dark:bg-surface-secondary/50 flex justify-between items-center text-[9px] font-bold uppercase text-foreground-secondary"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-primary shrink-0" />
                  <div className="truncate">
                    <span className="font-black text-foreground block truncate">
                      {file.name}
                    </span>
                    <span className="text-[7.5px] text-foreground-muted">
                      {file.size} • {file.type}
                    </span>
                  </div>
                </div>
                <Badge className="text-[6.5px] font-black bg-surface border border-border/30 text-foreground-secondary px-1 py-0 shadow-none rounded-sm">
                  Attached
                </Badge>
              </div>
            ))}

            {/* Mock upload attachment button */}
            <div className="p-2 border border-dashed border-border/40 hover:border-primary rounded-sm flex items-center justify-center bg-surface cursor-pointer text-[8.5px] font-black uppercase text-foreground-muted transition-colors group">
              <span className="flex items-center gap-1 group-hover:text-primary">
                <FileUp className="h-3.5 w-3.5" /> Upload File Attachment
              </span>
            </div>
          </div>
        </div>

        {/* Legacy notes fallback (kept for data safety) */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">
            Personal Logs (Draft Area)
          </h3>

          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Interview notes draft
              </span>
              <textarea
                placeholder="Key concepts mentioned by interviewers..."
                value={interviewNotes}
                onChange={(e) => setInterviewNotes(e.target.value)}
                onBlur={() => handleFieldBlur("interviewNotes", interviewNotes)}
                rows={2}
                className="w-full text-xs font-bold p-2 border border-border/40 bg-surface rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Follow-up checklist
              </span>
              <textarea
                placeholder="Follow up dates and notes..."
                value={followUpNotes}
                onChange={(e) => setFollowUpNotes(e.target.value)}
                onBlur={() => handleFieldBlur("followUpNotes", followUpNotes)}
                rows={2}
                className="w-full text-xs font-bold p-2 border border-border/40 bg-surface rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">
                Personal evaluation notes draft
              </span>
              <textarea
                placeholder="Company pros & cons, fit evaluation..."
                value={personalNotes}
                onChange={(e) => setPersonalNotes(e.target.value)}
                onBlur={() => handleFieldBlur("personalNotes", personalNotes)}
                rows={2}
                className="w-full text-xs font-bold p-2 border border-border/40 bg-surface rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>

        {/* Timelines logs */}
        <div className="space-y-3 border-t border-border/10 pt-4 text-[9px] font-bold uppercase tracking-wider text-foreground-secondary">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1">
            <Clock3 className="h-4 w-4" /> Application History log
          </h3>

          <div className="relative border-l-2 border-border/20 pl-4 ml-1 space-y-3 py-1">
            {application.timeline.map((evt) => (
              <div key={evt.id} className="relative leading-relaxed">
                {/* Dot */}
                <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full border border-border bg-primary shrink-0" />
                <div className="flex justify-between items-start gap-1">
                  <span className="font-black text-foreground">
                    {evt.title}
                  </span>
                  <span className="text-[7px] font-bold text-foreground-muted">
                    {evt.timestamp.split("T")[0]}
                  </span>
                </div>
                <p className="text-[8px] font-medium text-foreground-muted normal-case lowercase first-letter:uppercase mt-0.5 leading-snug">
                  {evt.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer toolbar actions */}
        <div className="border-t border-border/10 pt-4 flex gap-3">
          <Button
            onClick={async () => {
              const isConfirmed = await confirm({
                title: "Delete Application",
                description:
                  "Are you sure you want to delete this application?",
                isDestructive: true,
                confirmLabel: "Delete",
              });
              if (isConfirmed) {
                onDelete(application.id);
              }
            }}
            className="flex-1 h-9 border-2 border-error bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20/50 text-error text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 rounded-sm brutal-shadow-xs hover:brutal-shadow transition-all"
          >
            <Trash2 className="h-4 w-4" /> Delete Application
          </Button>

          <Button
            onClick={onClose}
            className="flex-1 h-9 border-2 border-border bg-surface hover:bg-surface-secondary text-foreground text-[10px] font-black uppercase tracking-wider flex items-center justify-center rounded-sm brutal-shadow-xs hover:brutal-shadow transition-all"
          >
            Close Details
          </Button>
        </div>

        <ConfirmationDialog />
      </motion.div>
    </div>
  );
}
