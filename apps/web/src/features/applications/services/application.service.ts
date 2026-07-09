import type { JobApplication } from "../types/application.types";
 
export const mockApplicationsList: JobApplication[] = [
  {
    id: "app_001",
    jobTitle: "Senior Backend Engineer",
    company: "Linear Labs",
    matchScore: 92,
    jobQuality: 88,
    status: "SAVED",
    appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    source: "LinkedIn",
    resumeUsed: "Anshul_Resume_v4.pdf",
    coverLetterUsed: "Linear_CoverLetter.pdf",
    recruiterName: "Sarah Connor",
    recruiterEmail: "sarah.c@linear.app",
    phone: "+1 (555) 101-2048",
    salaryNotes: "$140,000 - $160,000 USD basic + options",
    salaryDiscussion: "Discussed equity component; 0.25% option pool offered.",
    interviewNotes: "Pre-screen scheduled for next week. Study Linear board workflows.",
    followUpNotes: "Follow up next Tuesday if no response.",
    personalNotes: "Very cool product. Fits perfectly with my Rust and Go background.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "N/A",
    interviewRound: "HR Screening",
    interviewStatus: "N/A",
    interviewerName: "Sarah Connor",
    meetingLink: "https://meet.google.com/abc-defg-hij",
    offerDeadline: "",
    isRemote: true,
    location: "Remote, US",
    salaryRange: "150000",
    timeline: [
      {
        id: "evt_1",
        stage: "SAVED",
        title: "Job Saved",
        description: "Listing bookmarked to career discovery pipeline.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "app_002",
    jobTitle: "Full Stack Engineer",
    company: "Vercel Startup",
    matchScore: 88,
    jobQuality: 91,
    status: "INTERVIEW",
    appliedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    source: "YC Careers",
    resumeUsed: "Anshul_Resume_v4.pdf",
    coverLetterUsed: "N/A",
    recruiterName: "Lee Robinson",
    recruiterEmail: "lee@vercel.com",
    phone: "+1 (555) 420-6900",
    salaryNotes: "$130k + equity package",
    salaryDiscussion: "Discussed base increase to $140k.",
    interviewNotes: "Technical panel focused on Next.js Server Components and layout strategies.",
    followUpNotes: "Thank-you email sent right after technical round.",
    personalNotes: "Interviewers were very nice. Relies heavily on Tailwind CSS.",
    interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    interviewTime: "14:00",
    interviewType: "Video Call",
    interviewRound: "Technical Deep-Dive",
    interviewStatus: "Scheduled",
    interviewerName: "Lee Robinson",
    meetingLink: "https://zoom.us/j/123456789",
    offerDeadline: "",
    isRemote: false,
    location: "New York, NY",
    salaryRange: "130000",
    timeline: [
      {
        id: "evt_2",
        stage: "SAVED",
        title: "Saved Job",
        description: "Listing bookmarked.",
        timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_3",
        stage: "APPLIED",
        title: "Submitted",
        description: "Sent profile through YC Work at a Startup portal.",
        timestamp: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_4",
        stage: "SCREENING",
        title: "Resume Cleared",
        description: "Recruiter reviewed profile and passed screening filters.",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_5",
        stage: "INTERVIEW",
        title: "Technical Round Scheduled",
        description: "Coordinate dates for video panel round.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "app_003",
    jobTitle: "Software Engineer - UI Platform",
    company: "Stripe",
    matchScore: 94,
    jobQuality: 95,
    status: "SCREENING",
    appliedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Direct Portal",
    resumeUsed: "Anshul_Resume_v4.pdf",
    coverLetterUsed: "Stripe_CoverLetter.pdf",
    recruiterName: "Pat Collison",
    recruiterEmail: "pat@stripe.com",
    phone: "",
    salaryNotes: "Competitive salary + RSUs",
    salaryDiscussion: "",
    interviewNotes: "Hiring team is looking for deep frontend engineering chops.",
    followUpNotes: "Ping Pat on Monday.",
    personalNotes: "Highest rated company quality in my queue.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "N/A",
    interviewRound: "N/A",
    interviewStatus: "N/A",
    interviewerName: "",
    meetingLink: "",
    offerDeadline: "",
    isRemote: false,
    location: "San Francisco, CA",
    salaryRange: "180000",
    timeline: [
      {
        id: "evt_6",
        stage: "SAVED",
        title: "Saved Job",
        description: "Bookmarked Stripe UI Platform role.",
        timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_7",
        stage: "APPLIED",
        title: "Applied",
        description: "Sent application to corporate board.",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "app_004",
    jobTitle: "UX Engineer",
    company: "Netflix",
    matchScore: 81,
    jobQuality: 90,
    status: "OFFER",
    appliedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Indeed",
    resumeUsed: "Anshul_Resume_v4.pdf",
    coverLetterUsed: "N/A",
    recruiterName: "Reed Hastings",
    recruiterEmail: "r.hastings@netflix.com",
    phone: "+1 (555) 987-6543",
    salaryNotes: "$250,000 USD fully liquid salary",
    salaryDiscussion: "Offer is final, no equity component but high cash.",
    interviewNotes: "Drafted offer with RSUs option. Reviewing contract details.",
    followUpNotes: "Negotiated base bump. Waiting for final response.",
    personalNotes: "Incredible opportunity. The interview loop was challenging but fast.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "N/A",
    interviewRound: "N/A",
    interviewStatus: "N/A",
    interviewerName: "Reed Hastings",
    meetingLink: "https://netflix.zoom.us/my/reed",
    offerDeadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isRemote: true,
    location: "Los Gatos, CA",
    salaryRange: "250000",
    timeline: [
      {
        id: "evt_8",
        stage: "SAVED",
        title: "Saved",
        description: "Bookmarked.",
        timestamp: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_9",
        stage: "APPLIED",
        title: "Applied",
        description: "Submitted Indeed profile.",
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_10",
        stage: "INTERVIEW",
        title: "Completed Technical & Executive Rounds",
        description: "Cleared both frontend coding test and leadership fit panels.",
        timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_11",
        stage: "OFFER",
        title: "Offer Letter Sent",
        description: "Hired! Compensation details received.",
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "app_005",
    jobTitle: "Developer Advocate",
    company: "Supabase",
    matchScore: 76,
    jobQuality: 82,
    status: "ACCEPTED",
    appliedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    source: "Twitter / X",
    resumeUsed: "Anshul_Resume_v4.pdf",
    coverLetterUsed: "Supabase_Advocate.pdf",
    recruiterName: "Paul Copplestone",
    recruiterEmail: "paul@supabase.io",
    phone: "",
    salaryNotes: "Remote salary package ($120k + tokens)",
    salaryDiscussion: "Confirmed tokens vesting over 4 years.",
    interviewNotes: "Showcased my custom React database dashboards.",
    followUpNotes: "Signed paperwork completed.",
    personalNotes: "Stoked to start. Focuses on Postgres advocacy.",
    interviewDate: "",
    interviewTime: "",
    interviewType: "N/A",
    interviewRound: "N/A",
    interviewStatus: "N/A",
    interviewerName: "Paul Copplestone",
    meetingLink: "",
    offerDeadline: "",
    isRemote: true,
    location: "Remote, Global",
    salaryRange: "120000",
    timeline: [
      {
        id: "evt_12",
        stage: "SAVED",
        title: "Saved",
        description: "Bookmarked.",
        timestamp: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_13",
        stage: "APPLIED",
        title: "Applied",
        description: "Emailed Paul direct pitch.",
        timestamp: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_14",
        stage: "INTERVIEW",
        title: "Interviews Cleared",
        description: "Completed product panel loops.",
        timestamp: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "evt_15",
        stage: "ACCEPTED",
        title: "Contract Signed",
        description: "Signed start date coordinates set for next month.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];
 
export const applicationService = {
  async getApplications(): Promise<JobApplication[]> {
    return [...mockApplicationsList];
  }
};
