"use client";
 
import React from "react";
import type { JobApplication } from "../types/application.types";
import type { ApplicationStatus } from "@/types";
import { BrutalCard } from "@/components/ui/brutal-card";
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
  Clock3
} from "lucide-react";
 
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
  { label: "Offer Accepted", value: "ACCEPTED" },
  { label: "Closed / Rejected", value: "REJECTED" },
  { label: "Withdrawn", value: "WITHDRAWN" }
];
 
export function ApplicationDetailDialog({
  application,
  onClose,
  onUpdate,
  onUpdateStatus,
  onDelete
}: ApplicationDetailDialogProps) {
  
  // Local states for inputs to avoid multiple store re-renders while typing
  const [recruiterName, setRecruiterName] = React.useState(application.recruiterName);
  const [recruiterEmail, setRecruiterEmail] = React.useState(application.recruiterEmail);
  const [phone, setPhone] = React.useState(application.phone || "");
  const [salaryNotes, setSalaryNotes] = React.useState(application.salaryNotes);
  const [salaryDiscussion, setSalaryDiscussion] = React.useState(application.salaryDiscussion || "");
  const [interviewNotes, setInterviewNotes] = React.useState(application.interviewNotes);
  const [followUpNotes, setFollowUpNotes] = React.useState(application.followUpNotes);
  const [personalNotes, setPersonalNotes] = React.useState(application.personalNotes);
  
  // Schedule states
  const [interviewDate, setInterviewDate] = React.useState(application.interviewDate || "");
  const [interviewTime, setInterviewTime] = React.useState(application.interviewTime || "");
  const [interviewType, setInterviewType] = React.useState(application.interviewType || "N/A");
  const [interviewRound, setInterviewRound] = React.useState(application.interviewRound || "");
  const [interviewStatus, setInterviewStatus] = React.useState(application.interviewStatus || "N/A");
  const [interviewerName, setInterviewerName] = React.useState(application.interviewerName || "");
  const [meetingLink, setMeetingLink] = React.useState(application.meetingLink || "");
  const [offerDeadline, setOfferDeadline] = React.useState(application.offerDeadline || "");
  const [location, setLocation] = React.useState(application.location || "");
  const [isRemote, setIsRemote] = React.useState(application.isRemote || false);
 
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
      isRemote
    });
  };
 
  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none text-left">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-foreground/50 backdrop-blur-xs transition-opacity" 
      />
 
      {/* Drawer */}
      <div className="relative w-full max-w-[460px] bg-surface border-l-[4px] border-border brutal-shadow h-full flex flex-col p-5 overflow-y-auto z-10 space-y-5">
        
        {/* Header toolbar */}
        <div className="flex justify-between items-center border-b-2 border-border/10 pb-3">
          <div>
            <span className="text-[8px] font-black text-primary uppercase tracking-widest">{application.company}</span>
            <h2 className="text-sm font-black uppercase text-foreground leading-tight tracking-tight mt-0.5">{application.jobTitle}</h2>
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
 
        {/* AI Scores Summary Row */}
        <div className="grid grid-cols-2 gap-3.5">
          <BrutalCard className="border-2 border-border bg-slate-50/50 p-2.5 rounded-sm flex flex-col items-center">
            <span className="text-[7.5px] font-black text-foreground-muted uppercase">Match Quality</span>
            <span className="text-sm font-black text-primary mt-0.5">{application.matchScore}% Match</span>
          </BrutalCard>
          
          <BrutalCard className="border-2 border-border bg-slate-50/50 p-2.5 rounded-sm flex flex-col items-center">
            <span className="text-[7.5px] font-black text-foreground-muted uppercase">Trust Quality</span>
            <span className="text-sm font-black text-foreground mt-0.5">{application.jobQuality}% Trust</span>
          </BrutalCard>
        </div>
 
        {/* Stage Selector */}
        <div className="space-y-1.5">
          <label className="text-[9px] font-black text-foreground-secondary uppercase tracking-wider block">Application Pipeline Stage</label>
          <BrutalSelect
            value={application.status}
            onChange={(e) => onUpdateStatus(application.id, e.target.value as ApplicationStatus)}
            options={STATUS_OPTIONS}
            className="text-xs font-black uppercase tracking-wider h-9"
          />
        </div>
 
        {/* Core Metadata Grid */}
        <div className="grid grid-cols-2 gap-4 text-[9px] font-black uppercase text-foreground-secondary bg-surface-secondary/10 p-3 border border-border/20 rounded-sm">
          <div className="space-y-0.5">
            <span className="text-foreground-muted block text-[7.5px]">Date Applied</span>
            <span>{application.appliedAt.split("T")[0]}</span>
          </div>
          <div className="space-y-0.5">
            <span className="text-foreground-muted block text-[7.5px]">Submission Source</span>
            <span>{application.source}</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-foreground-muted block text-[7.5px]">Resume Utilized</span>
            <span className="truncate flex items-center gap-1"><FileText className="h-3 w-3 text-foreground-muted shrink-0" /> {application.resumeUsed || "None"}</span>
          </div>
          <div className="space-y-0.5 mt-2">
            <span className="text-foreground-muted block text-[7.5px]">Cover Letter Utilized</span>
            <span className="truncate flex items-center gap-1"><FileText className="h-3 w-3 text-foreground-muted shrink-0" /> {application.coverLetterUsed || "None"}</span>
          </div>
        </div>
 
        {/* Recruiter Details */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Recruiter Contact Details</h3>
          
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1"><User className="h-3 w-3" /> Contact Name</span>
              <Input
                placeholder="Sarah Connor"
                value={recruiterName}
                onChange={(e) => setRecruiterName(e.target.value)}
                onBlur={() => handleFieldBlur("recruiterName", recruiterName)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1"><Mail className="h-3 w-3" /> Contact Email</span>
              <Input
                placeholder="sarah@linear.app"
                value={recruiterEmail}
                onChange={(e) => setRecruiterEmail(e.target.value)}
                onBlur={() => handleFieldBlur("recruiterEmail", recruiterEmail)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">Phone Number</span>
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
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1"><DollarSign className="h-3 w-3" /> Salary Budget</span>
              <Input
                placeholder="$140,000 - $160,000 USD basic + options"
                value={salaryNotes}
                onChange={(e) => setSalaryNotes(e.target.value)}
                onBlur={() => handleFieldBlur("salaryNotes", salaryNotes)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1">Negotiations Discussion</span>
              <Input
                placeholder="Discussed options pool vesting..."
                value={salaryDiscussion}
                onChange={(e) => setSalaryDiscussion(e.target.value)}
                onBlur={() => handleFieldBlur("salaryDiscussion", salaryDiscussion)}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>
        </div>
 
        {/* Interview Tracker Grid */}
        <div className="space-y-3 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Interview & Process Scheduler</h3>
          
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1"><Calendar className="h-3 w-3" /> Interview Date</span>
              <Input
                type="date"
                value={interviewDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase flex items-center gap-1"><Clock className="h-3 w-3" /> Interview Time</span>
              <Input
                type="time"
                value={interviewTime}
                onChange={(e) => setInterviewTime(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Offer Deadline</span>
              <Input
                type="date"
                value={offerDeadline}
                onChange={(e) => setOfferDeadline(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
          </div>
 
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Round Name</span>
              <Input
                placeholder="HR screening"
                value={interviewRound}
                onChange={(e) => setInterviewRound(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Invite Type</span>
              <BrutalSelect
                value={interviewType}
                onChange={(e) => {
                  const val = e.target.value as JobApplication["interviewType"];
                  setInterviewType(val);
                  onUpdate(application.id, { interviewType: val });
                }}
                options={[
                  { label: "Video Call", value: "Video Call" },
                  { label: "Onsite Panel", value: "Onsite" },
                  { label: "Phone Screen", value: "Phone Screen" },
                  { label: "Tech Challenge", value: "Technical Challenge" },
                  { label: "N/A", value: "N/A" }
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>
 
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Invite Status</span>
              <BrutalSelect
                value={interviewStatus}
                onChange={(e) => {
                  const val = e.target.value as JobApplication["interviewStatus"];
                  setInterviewStatus(val);
                  onUpdate(application.id, { interviewStatus: val });
                }}
                options={[
                  { label: "Scheduled", value: "Scheduled" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                  { label: "Pending Coordinate", value: "Pending" },
                  { label: "N/A", value: "N/A" }
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>
          </div>
 
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Interviewer Name</span>
              <Input
                placeholder="e.g. Lee Robinson"
                value={interviewerName}
                onChange={(e) => setInterviewerName(e.target.value)}
                onBlur={handleScheduleChange}
                className="h-8 text-xs font-bold border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Meeting / Call Link</span>
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
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Remote or Onsite</span>
              <BrutalSelect
                value={isRemote ? "remote" : "onsite"}
                onChange={(e) => {
                  const val = e.target.value === "remote";
                  setIsRemote(val);
                  onUpdate(application.id, { isRemote: val });
                }}
                options={[
                  { label: "Remote Location", value: "remote" },
                  { label: "Onsite / Hybrid Office", value: "onsite" }
                ]}
                className="h-8 text-[10px] font-black uppercase border border-border/40"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Office Location City</span>
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
 
        {/* Notes sections */}
        <div className="space-y-3.5 border-t border-border/10 pt-4">
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground">Personal Notes logs</h3>
          
          <div className="space-y-3">
            <div className="space-y-1">
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Interview notes</span>
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
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Follow-up reminders</span>
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
              <span className="text-[8px] font-black text-foreground-muted uppercase block">Personal evaluation notes</span>
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
          <h3 className="text-[10px] font-black uppercase tracking-widest text-foreground flex items-center gap-1"><Clock3 className="h-4 w-4" /> Application History log</h3>
          
          <div className="relative border-l-2 border-border/20 pl-4 ml-1 space-y-3 py-1">
            {application.timeline.map((evt) => (
              <div key={evt.id} className="relative leading-relaxed">
                {/* Dot */}
                <div className="absolute -left-[21px] top-1 h-2 w-2 rounded-full border border-border bg-primary shrink-0" />
                <div className="flex justify-between items-start gap-1">
                  <span className="font-black text-foreground">{evt.title}</span>
                  <span className="text-[7px] font-bold text-foreground-muted">{evt.timestamp.split("T")[0]}</span>
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
            onClick={() => {
              if (confirm("Are you sure you want to delete this application?")) {
                onDelete(application.id);
              }
            }}
            className="flex-1 h-9 border-2 border-error bg-rose-50 hover:bg-rose-100/50 text-error text-[10px] font-black uppercase tracking-wider flex items-center justify-center gap-1 rounded-sm brutal-shadow-xs hover:brutal-shadow transition-all"
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
        
      </div>
    </div>
  );
}
