import { Injectable, Logger } from "@nestjs/common";
import { UrlValidationState, VerificationConfidence } from "@prisma/client";

export interface UrlValidationResult {
  validationState: UrlValidationState;
  verificationConfidence: VerificationConfidence;
  validatedApplyUrl?: string;
  isAtsPortal: boolean;
  httpStatus?: number;
  reason?: string;
}

@Injectable()
export class JobUrlValidatorService {
  private readonly logger = new Logger(JobUrlValidatorService.name);

  // Legitimate Applicant Tracking Systems (ATS) and Verified Company Career Portals
  private readonly recognizedAtsDomains = [
    "greenhouse.io",
    "boards.greenhouse.io",
    "lever.co",
    "jobs.lever.co",
    "myworkdayjobs.com",
    "workday.com",
    "smartrecruiters.com",
    "jobs.smartrecruiters.com",
    "ashbyhq.com",
    "jobs.ashbyhq.com",
    "jobvite.com",
    "recruitee.com",
    "bamboohr.com",
    "taleo.net",
    "icims.com",
    "breezy.hr",
    "workable.com",
    "applytojob.com",
    "rippling-ats.com",
    "careers.google.com",
    "careers.microsoft.com",
    "amazon.jobs",
    "razorpay.com",
    "careers.swiggy.com",
    "cred.club",
    "juspay.in",
    "meesho.io",
    "zeptonow.com",
    "phonepe.com",
    "zomato.com",
    "postman.com",
    "browserstack.com",
    "flipkartcareers.com",
    "freshworks.com",
    "zerodha.com",
    "groww.in",
    "sliceit.com",
    "paytm.com",
    "clevertap.com",
    "remotive.com",
  ];

  isRecognizedPortal(url: string): boolean {
    try {
      const parsed = new URL(url);
      const hostname = parsed.hostname.toLowerCase();
      return this.recognizedAtsDomains.some(
        (domain) => hostname === domain || hostname.endsWith(`.${domain}`),
      );
    } catch {
      return false;
    }
  }

  async validateUrl(
    url: string | undefined | null,
    options?: { checkHttp?: boolean; timeoutMs?: number },
  ): Promise<UrlValidationResult> {
    if (!url || typeof url !== "string" || url.trim() === "") {
      return {
        validationState: UrlValidationState.INVALID,
        verificationConfidence: VerificationConfidence.UNVERIFIED,
        isAtsPortal: false,
        reason: "MISSING_URL",
      };
    }

    const trimmedUrl = url.trim();

    // 1. Structure and Protocol Validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(trimmedUrl);
      if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
        return {
          validationState: UrlValidationState.INVALID,
          verificationConfidence: VerificationConfidence.UNVERIFIED,
          isAtsPortal: false,
          reason: "UNSUPPORTED_PROTOCOL",
        };
      }
    } catch {
      return {
        validationState: UrlValidationState.INVALID,
        verificationConfidence: VerificationConfidence.UNVERIFIED,
        isAtsPortal: false,
        reason: "MALFORMED_URL",
      };
    }

    const isAts = this.isRecognizedPortal(trimmedUrl);

    // If HTTP check is not explicitly requested (e.g. fast path during batch ingestion)
    if (options?.checkHttp === false) {
      return {
        validationState: isAts
          ? UrlValidationState.VERIFIED
          : UrlValidationState.UNVERIFIED,
        verificationConfidence: isAts
          ? VerificationConfidence.COMPANY_PORTAL_MATCHED
          : VerificationConfidence.SOURCE_CONFIRMED,
        validatedApplyUrl: trimmedUrl,
        isAtsPortal: isAts,
      };
    }

    // 2. HTTP Validation with Redirect Tracking & Timeout
    const timeoutMs = options?.timeoutMs ?? 3500;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      // First try HEAD method to minimize bandwidth and latency
      let response = await fetch(trimmedUrl, {
        method: "HEAD",
        signal: controller.signal,
        redirect: "follow",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
          Accept:
            "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        },
      });

      // If HEAD is rejected with 405 Method Not Allowed, fallback to GET with small byte range
      if (response.status === 405) {
        response = await fetch(trimmedUrl, {
          method: "GET",
          signal: controller.signal,
          redirect: "follow",
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            Range: "bytes=0-1024",
          },
        });
      }

      clearTimeout(timeoutId);

      const status = response.status;
      const finalUrl = response.url || trimmedUrl;
      const isRedirected = finalUrl !== trimmedUrl;

      // HTTP 2xx or 3xx Successful
      if (status >= 200 && status < 400) {
        return {
          validationState: isRedirected
            ? UrlValidationState.REDIRECTED
            : UrlValidationState.VERIFIED,
          verificationConfidence: isAts
            ? VerificationConfidence.COMPANY_PORTAL_MATCHED
            : VerificationConfidence.APPLICATION_LINK_VERIFIED,
          validatedApplyUrl: finalUrl,
          isAtsPortal: isAts || this.isRecognizedPortal(finalUrl),
          httpStatus: status,
        };
      }

      // HTTP 404 / 410 -> Expired / Unavailable
      if (status === 404 || status === 410) {
        return {
          validationState: UrlValidationState.EXPIRED,
          verificationConfidence: VerificationConfidence.UNVERIFIED,
          validatedApplyUrl: finalUrl,
          isAtsPortal: isAts,
          httpStatus: status,
          reason: `HTTP_${status}_PAGE_NOT_FOUND`,
        };
      }

      // HTTP 401 / 403 -> WAF / Cloudflare or protected portal
      // IMPORTANT: Do NOT mark ATS portals as invalid or expired solely due to 403 bot blocks
      if (status === 401 || status === 403) {
        return {
          validationState: isAts
            ? UrlValidationState.VERIFIED
            : UrlValidationState.UNVERIFIED,
          verificationConfidence: isAts
            ? VerificationConfidence.COMPANY_PORTAL_MATCHED
            : VerificationConfidence.SOURCE_CONFIRMED,
          validatedApplyUrl: finalUrl,
          isAtsPortal: isAts,
          httpStatus: status,
          reason: `HTTP_${status}_ACCESS_RESTRICTED`,
        };
      }

      // Server Errors (500, 502, 503, 504) -> Temporary
      if (status >= 500) {
        return {
          validationState: UrlValidationState.TEMPORARILY_UNAVAILABLE,
          verificationConfidence: isAts
            ? VerificationConfidence.COMPANY_PORTAL_MATCHED
            : VerificationConfidence.UNVERIFIED,
          validatedApplyUrl: finalUrl,
          isAtsPortal: isAts,
          httpStatus: status,
          reason: `SERVER_ERROR_${status}`,
        };
      }

      return {
        validationState: UrlValidationState.UNVERIFIED,
        verificationConfidence: VerificationConfidence.UNVERIFIED,
        validatedApplyUrl: finalUrl,
        isAtsPortal: isAts,
        httpStatus: status,
      };
    } catch (err: unknown) {
      clearTimeout(timeoutId);
      const isAbort =
        err instanceof Error &&
        (err.name === "AbortError" || err.message.includes("aborted"));

      // Temporary network errors or timeouts must NEVER permanently mark a job as expired
      return {
        validationState: isAbort
          ? UrlValidationState.TEMPORARILY_UNAVAILABLE
          : isAts
            ? UrlValidationState.VERIFIED
            : UrlValidationState.UNVERIFIED,
        verificationConfidence: isAts
          ? VerificationConfidence.COMPANY_PORTAL_MATCHED
          : VerificationConfidence.UNVERIFIED,
        validatedApplyUrl: trimmedUrl,
        isAtsPortal: isAts,
        reason: isAbort ? "NETWORK_TIMEOUT" : "CONNECTION_ERROR",
      };
    }
  }
}
