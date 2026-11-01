import { Injectable } from "@nestjs/common";
import { NormalizedJob, SpamDetectionResult } from "./types/job-pipeline.types";

interface SpamRule {
  id: string;
  weight: number;
  reason: string;
  test: (job: NormalizedJob) => boolean;
}

@Injectable()
export class JobSpamDetectorService {
  private readonly rules: SpamRule[] = [
    // 1. Advance Fee & Payment Scams (High Severity)
    {
      id: "UPFRONT_FEE_SCAM",
      weight: 0.7,
      reason:
        "Job mentions paying upfront fees, deposit, or registration charges.",
      test: (job) => {
        const text = `${job.title} ${job.description}`.toLowerCase();
        return (
          text.includes("wire money") ||
          text.includes("pay upfront") ||
          text.includes("registration fee") ||
          text.includes("training fee") ||
          text.includes("security deposit") ||
          text.includes("western union") ||
          text.includes("send upi") ||
          text.includes("crypto payment")
        );
      },
    },

    // 2. High-Risk Recruitment Channels (Telegram / Personal WhatsApp / Disposable)
    {
      id: "SUSPICIOUS_COMMUNICATION_CHANNELS",
      weight: 0.5,
      reason:
        "Directs applicant to unverified Telegram or personal WhatsApp contact for recruitment.",
      test: (job) => {
        const text = `${job.description} ${job.applyUrl}`.toLowerCase();
        return (
          text.includes("t.me/") ||
          text.includes("telegram @") ||
          text.includes("contact on whatsapp") ||
          text.includes("chat on whatsapp") ||
          text.includes("wa.me/")
        );
      },
    },

    // 3. Get-Rich-Quick & Unrealistic Cash Promises
    {
      id: "UNREALISTIC_EARNING_CLAIMS",
      weight: 0.45,
      reason:
        "Unrealistic get-rich-quick claims or daily guaranteed cash promises.",
      test: (job) => {
        const text = `${job.title} ${job.description}`.toLowerCase();
        return (
          text.includes("earn daily") ||
          text.includes("daily cash") ||
          text.includes("guaranteed income") ||
          text.includes("no skills needed earn") ||
          text.includes("typing job daily payout") ||
          text.includes("work 1 hour earn")
        );
      },
    },

    // 4. Free Webmail Domain for Corporate Hiring
    {
      id: "FREE_WEBMAIL_CORPORATE",
      weight: 0.3,
      reason:
        "Uses free consumer email (gmail, yahoo) instead of company domain for applications.",
      test: (job) => {
        const text = job.description.toLowerCase();
        return (
          (text.includes("send cv to") || text.includes("email resume to")) &&
          (text.includes("@gmail.com") ||
            text.includes("@yahoo.com") ||
            text.includes("@hotmail.com"))
        );
      },
    },

    // 5. Excessive Uppercase / Screaming Text
    {
      id: "EXCESSIVE_CAPITALIZATION",
      weight: 0.25,
      reason:
        "Excessive capitalization in title or description indicating spammy marketing.",
      test: (job) => {
        const letters = job.title.replace(/[^a-zA-Z]/g, "");
        if (letters.length < 10) return false;
        const upper = letters.replace(/[^A-Z]/g, "").length;
        return upper / letters.length > 0.7;
      },
    },

    // 6. Suspicious Shortened Apply Links
    {
      id: "SUSPICIOUS_APPLY_URL",
      weight: 0.4,
      reason:
        "Apply URL uses URL shorteners frequently associated with redirect scams.",
      test: (job) => {
        const url = (job.applyUrl || "").toLowerCase();
        return (
          url.includes("bit.ly/") ||
          url.includes("tinyurl.com/") ||
          url.includes("is.gd/") ||
          url.includes("t.co/") ||
          url.includes("cutt.ly/")
        );
      },
    },

    // 7. Extremely Sparse Content
    {
      id: "EXTREMELY_SPARSE_DESCRIPTION",
      weight: 0.35,
      reason:
        "Description is unusually short (less than 15 words) with no verifiable role details.",
      test: (job) => {
        const words = job.description.trim().split(/\s+/).filter(Boolean);
        return words.length < 15;
      },
    },
  ];

  detectSpam(job: NormalizedJob): SpamDetectionResult {
    let score = 0.0;
    const triggeredReasons: string[] = [];

    for (const rule of this.rules) {
      if (rule.test(job)) {
        score += rule.weight;
        triggeredReasons.push(rule.reason);
      }
    }

    // Clamp score to [0.0, 1.0]
    const spamScore = Math.min(1.0, Math.round(score * 100) / 100);
    // Threshold: 0.40 or higher flags as spam
    const isSpam = spamScore >= 0.4;

    return {
      isSpam,
      spamScore,
      reasons: triggeredReasons,
    };
  }
}
