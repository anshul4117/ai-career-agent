import { Injectable, Logger } from "@nestjs/common";
import { AtsType } from "@prisma/client";
import { validateSafeUrl, SsrfSecurityException } from "./ssrf-validator";

export interface AtsDetectionResult {
  atsType: AtsType;
  atsSlug?: string;
  endpointOk: boolean;
  jobCount?: number;
  confidence: "HIGH" | "MEDIUM" | "LOW" | "NONE";
  reason: string;
  sampleApplyUrl?: string;
}

@Injectable()
export class AtsDetectorService {
  private readonly logger = new Logger(AtsDetectorService.name);
  private readonly USER_AGENT =
    "AICareerAgent-ATSDetector/1.0 (+https://ai-career-agent.vercel.app)";

  /**
   * Detects and validates ATS provider and slug from careerUrl or domain.
   */
  async detectAndValidate(
    careerUrlOrDomain: string,
  ): Promise<AtsDetectionResult> {
    if (!careerUrlOrDomain || typeof careerUrlOrDomain !== "string") {
      return {
        atsType: AtsType.NONE,
        endpointOk: false,
        confidence: "NONE",
        reason: "Empty or invalid input URL/domain",
      };
    }

    const trimmed = careerUrlOrDomain.trim();

    // 1. Direct URL Pattern Matching
    const directPattern = this.detectFromUrlPattern(trimmed);
    if (directPattern) {
      this.logger.debug(
        `Pattern match found: ${directPattern.atsType} [${directPattern.atsSlug}] for ${trimmed}`,
      );
      const validation = await this.validatePublicEndpoint(
        directPattern.atsType,
        directPattern.atsSlug,
      );

      return {
        atsType: directPattern.atsType,
        atsSlug: directPattern.atsSlug,
        endpointOk: validation.ok,
        jobCount: validation.jobCount,
        confidence: validation.ok ? "HIGH" : "LOW",
        reason: validation.ok
          ? `Direct URL pattern validated with ${validation.jobCount} live jobs`
          : `Direct URL pattern matched but public endpoint failed: ${validation.error}`,
        sampleApplyUrl: validation.sampleApplyUrl,
      };
    }

    // 2. HTML Inspection on custom career page (with SSRF protection & safety limits)
    try {
      const safeUrl = await validateSafeUrl(trimmed);
      const htmlResult = await this.inspectCareerPageHtml(safeUrl.toString());

      if (htmlResult) {
        const validation = await this.validatePublicEndpoint(
          htmlResult.atsType,
          htmlResult.atsSlug,
        );

        return {
          atsType: htmlResult.atsType,
          atsSlug: htmlResult.atsSlug,
          endpointOk: validation.ok,
          jobCount: validation.jobCount,
          confidence: validation.ok ? "MEDIUM" : "LOW",
          reason: validation.ok
            ? `Detected via career page HTML inspection and validated with ${validation.jobCount} live jobs`
            : `HTML inspection detected ${htmlResult.atsType} [${htmlResult.atsSlug}] but public endpoint validation failed`,
          sampleApplyUrl: validation.sampleApplyUrl,
        };
      }
    } catch (err: unknown) {
      if (err instanceof SsrfSecurityException) {
        this.logger.warn(`SSRF Blocked during ATS detection: ${err.message}`);
        return {
          atsType: AtsType.NONE,
          endpointOk: false,
          confidence: "NONE",
          reason: `Blocked by SSRF security filter: ${err.message}`,
        };
      }
      this.logger.debug(
        `HTML inspection skipped or failed for ${trimmed}: ${(err as Error).message}`,
      );
    }

    // 3. Fallback: Probing standard ATS slugs using domain root name
    const domainSlug = this.extractDomainSlug(trimmed);
    if (domainSlug) {
      const probeResult = await this.probeCommonAtsPlatforms(domainSlug);
      if (probeResult) {
        return probeResult;
      }
    }

    return {
      atsType: AtsType.NONE,
      endpointOk: false,
      confidence: "NONE",
      reason: "No supported ATS platform detected or verified",
    };
  }

  // Per-host rate limiting timestamp map (min 500ms between requests to same host)
  private readonly hostLastRequest = new Map<string, number>();

  private async enforceHostRateLimit(hostname: string): Promise<void> {
    const minIntervalMs = 500;
    const now = Date.now();
    const last = this.hostLastRequest.get(hostname) || 0;
    const elapsed = now - last;
    if (elapsed < minIntervalMs) {
      await new Promise((resolve) =>
        setTimeout(resolve, minIntervalMs - elapsed),
      );
    }
    this.hostLastRequest.set(hostname, Date.now());
  }

  detectFromUrlPattern(
    urlStr: string,
  ): { atsType: AtsType; atsSlug: string } | null {
    const url = urlStr.toLowerCase();

    // Greenhouse
    // boards.greenhouse.io/{slug} or job-boards.greenhouse.io/{slug} or embed/job_board(?/js)?\?(?:.*&)?for={slug}
    const ghEmbed = url.match(
      /(?:boards|job-boards)\.greenhouse\.io\/(?:embed\/job_board(?:\/js)?\?(?:[^"'\s]*&)?for=)([a-zA-Z0-9_-]+)/i,
    );
    if (ghEmbed && ghEmbed[1]) {
      return { atsType: AtsType.GREENHOUSE, atsSlug: ghEmbed[1].toLowerCase() };
    }
    const ghMatch = url.match(
      /(?:boards|job-boards)\.greenhouse\.io\/([a-zA-Z0-9_-]+)/i,
    );
    if (ghMatch && ghMatch[1] && ghMatch[1] !== "embed") {
      return { atsType: AtsType.GREENHOUSE, atsSlug: ghMatch[1].toLowerCase() };
    }

    // Lever
    // jobs.lever.co/{slug}
    const leverMatch = url.match(/jobs\.lever\.co\/([a-zA-Z0-9_-]+)/i);
    if (leverMatch && leverMatch[1]) {
      return { atsType: AtsType.LEVER, atsSlug: leverMatch[1].toLowerCase() };
    }

    // Ashby
    // jobs.ashbyhq.com/{slug}
    const ashbyMatch = url.match(/jobs\.ashbyhq\.com\/([a-zA-Z0-9_-]+)/i);
    if (ashbyMatch && ashbyMatch[1]) {
      return { atsType: AtsType.ASHBY, atsSlug: ashbyMatch[1].toLowerCase() };
    }

    // SmartRecruiters
    // careers.smartrecruiters.com/{slug} or jobs.smartrecruiters.com/{slug}
    const srMatch = url.match(
      /(?:careers|jobs)\.smartrecruiters\.com\/([a-zA-Z0-9_-]+)/i,
    );
    if (srMatch && srMatch[1]) {
      return {
        atsType: AtsType.SMARTRECRUITERS,
        atsSlug: srMatch[1].toLowerCase(),
      };
    }

    // Workable
    // apply.workable.com/{slug}
    const workableMatch = url.match(/apply\.workable\.com\/([a-zA-Z0-9_-]+)/i);
    if (workableMatch && workableMatch[1]) {
      return {
        atsType: AtsType.WORKABLE,
        atsSlug: workableMatch[1].toLowerCase(),
      };
    }

    // Recruitee
    // {slug}.recruitee.com
    const recruiteeMatch = url.match(
      /(?:https?:\/\/)?([a-zA-Z0-9_-]+)\.recruitee\.com/i,
    );
    if (
      recruiteeMatch &&
      recruiteeMatch[1] &&
      recruiteeMatch[1] !== "www" &&
      recruiteeMatch[1] !== "api"
    ) {
      return {
        atsType: AtsType.RECRUITEE,
        atsSlug: recruiteeMatch[1].toLowerCase(),
      };
    }

    return null;
  }

  /**
   * Checks if robots.txt on origin permits fetching this path.
   */
  async isRobotsAllowed(url: URL): Promise<boolean> {
    try {
      const robotsUrlStr = `${url.protocol}//${url.host}/robots.txt`;
      const safeRobotsUrl = await validateSafeUrl(robotsUrlStr);
      await this.enforceHostRateLimit(safeRobotsUrl.hostname);

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);

      const res = await fetch(safeRobotsUrl.toString(), {
        headers: { "User-Agent": this.USER_AGENT },
        signal: controller.signal,
        redirect: "manual",
      });
      clearTimeout(timeout);

      if (res.status === 404 || res.status === 410) {
        return true; // No robots.txt, scraping allowed
      }
      if (!res.ok) {
        return true;
      }

      const text = await res.text();
      const lines = text.split(/\r?\n/).map((l) => l.trim());
      let appliesToUs = false;

      for (const line of lines) {
        if (!line || line.startsWith("#")) continue;
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;
        const key = line.slice(0, colonIdx).trim().toLowerCase();
        const val = line.slice(colonIdx + 1).trim();

        if (key === "user-agent") {
          appliesToUs =
            val === "*" || val.toLowerCase().includes("aicareeragent");
        } else if (appliesToUs && key === "disallow") {
          if (val === "/" || (val && url.pathname.startsWith(val))) {
            return false;
          }
        }
      }

      return true;
    } catch {
      // In case of error reaching robots.txt, fail open with caution
      return true;
    }
  }

  private async inspectCareerPageHtml(
    targetUrl: string,
  ): Promise<{ atsType: AtsType; atsSlug: string } | null> {
    const initialUrl = new URL(
      targetUrl.startsWith("http") ? targetUrl : `https://${targetUrl}`,
    );

    // Check robots.txt
    const allowed = await this.isRobotsAllowed(initialUrl);
    if (!allowed) {
      this.logger.debug(
        `Career page HTML inspection blocked by robots.txt for ${targetUrl}`,
      );
      return null;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    let currentUrl = initialUrl.toString();
    let redirects = 0;
    const maxRedirects = 3;

    try {
      let finalResponse: Response | null = null;

      while (redirects <= maxRedirects) {
        const parsed = new URL(currentUrl);
        await this.enforceHostRateLimit(parsed.hostname);

        const res = await fetch(currentUrl, {
          headers: {
            "User-Agent": this.USER_AGENT,
            Accept: "text/html,application/xhtml+xml",
          },
          signal: controller.signal,
          redirect: "manual",
        });

        if (res.status >= 300 && res.status < 400) {
          redirects++;
          if (redirects > maxRedirects) {
            this.logger.debug(
              `Max redirects (${maxRedirects}) exceeded for ${targetUrl}`,
            );
            return null;
          }
          const location = res.headers.get("location");
          if (!location) return null;

          const nextUrlObj = new URL(location, currentUrl);
          // SSRF validation on every redirect hop
          const validated = await validateSafeUrl(nextUrlObj.toString());
          currentUrl = validated.toString();
          continue;
        }

        finalResponse = res;
        break;
      }

      if (!finalResponse || !finalResponse.ok) return null;

      // Read max 1MB response body
      const buffer = await finalResponse.arrayBuffer();
      const maxBytes = 1024 * 1024;
      const sliced =
        buffer.byteLength > maxBytes ? buffer.slice(0, maxBytes) : buffer;
      const html = new TextDecoder("utf-8").decode(sliced);

      // 1. Direct search in HTML text
      const directMatch = this.detectFromUrlPattern(html);
      if (directMatch) return directMatch;

      // 2. Scan href, src, data-url attributes
      const attrRegex = /(?:href|src|data-url)=["']([^"']+)["']/gi;
      let attrMatch: RegExpExecArray | null;
      while ((attrMatch = attrRegex.exec(html)) !== null) {
        const foundUrl = attrMatch[1];
        const detected = this.detectFromUrlPattern(foundUrl);
        if (detected) return detected;
      }

      return null;
    } catch (err: unknown) {
      if (err instanceof SsrfSecurityException) throw err;
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }

  async validatePublicEndpoint(
    atsType: AtsType,
    slug: string,
  ): Promise<{
    ok: boolean;
    jobCount?: number;
    error?: string;
    sampleApplyUrl?: string;
  }> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      if (atsType === AtsType.GREENHOUSE) {
        const url = `https://boards-api.greenhouse.io/v1/boards/${slug}/jobs`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const data = (await res.json()) as {
          jobs?: { absolute_url: string }[];
        };
        const jobs = data.jobs || [];
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl:
            jobs[0]?.absolute_url || `https://boards.greenhouse.io/${slug}`,
        };
      }

      if (atsType === AtsType.LEVER) {
        const url = `https://api.lever.co/v0/postings/${slug}?mode=json`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const jobs = (await res.json()) as { hostedUrl: string }[];
        if (!Array.isArray(jobs))
          return { ok: false, error: "Non-array response" };
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl: jobs[0]?.hostedUrl || `https://jobs.lever.co/${slug}`,
        };
      }

      if (atsType === AtsType.ASHBY) {
        const url = `https://api.ashbyhq.com/posting-api/job-board/${slug}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const data = (await res.json()) as { jobs?: { jobUrl: string }[] };
        const jobs = data.jobs || [];
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl: jobs[0]?.jobUrl || `https://jobs.ashbyhq.com/${slug}`,
        };
      }

      if (atsType === AtsType.SMARTRECRUITERS) {
        const url = `https://api.smartrecruiters.com/v1/companies/${slug}/postings?limit=10`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const data = (await res.json()) as { content?: unknown[] };
        const jobs = data.content || [];
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl: `https://jobs.smartrecruiters.com/${slug}`,
        };
      }

      if (atsType === AtsType.WORKABLE) {
        const url = `https://apply.workable.com/api/v1/widget/accounts/${slug}`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const data = (await res.json()) as { jobs?: { url: string }[] };
        const jobs = data.jobs || [];
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl: jobs[0]?.url || `https://apply.workable.com/${slug}`,
        };
      }

      if (atsType === AtsType.RECRUITEE) {
        const url = `https://${slug}.recruitee.com/api/offers/`;
        const res = await fetch(url, {
          headers: {
            Accept: "application/json",
            "User-Agent": this.USER_AGENT,
          },
          signal: controller.signal,
        });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
        const data = (await res.json()) as {
          offers?: { careers_url: string }[];
        };
        const jobs = data.offers || [];
        return {
          ok: true,
          jobCount: jobs.length,
          sampleApplyUrl:
            jobs[0]?.careers_url || `https://${slug}.recruitee.com`,
        };
      }

      return { ok: false, error: `Unsupported ATS type ${atsType}` };
    } catch (err: unknown) {
      return { ok: false, error: (err as Error).message };
    } finally {
      clearTimeout(timeout);
    }
  }

  private extractDomainSlug(input: string): string | null {
    try {
      const clean = input
        .toLowerCase()
        .replace(/^(?:https?:\/\/)?(?:www\.)?/i, "")
        .split("/")[0]
        .split("?")[0];
      const parts = clean.split(".");
      if (parts.length >= 2) {
        return parts[0]; // e.g. "linear" from "linear.app"
      }
      return null;
    } catch {
      return null;
    }
  }

  private async probeCommonAtsPlatforms(
    slug: string,
  ): Promise<AtsDetectionResult | null> {
    const candidates: AtsType[] = [
      AtsType.GREENHOUSE,
      AtsType.LEVER,
      AtsType.ASHBY,
    ];

    for (const ats of candidates) {
      const validation = await this.validatePublicEndpoint(ats, slug);
      if (validation.ok && (validation.jobCount || 0) > 0) {
        return {
          atsType: ats,
          atsSlug: slug,
          endpointOk: true,
          jobCount: validation.jobCount,
          confidence: "MEDIUM",
          reason: `Discovered and verified via standard slug probe on ${ats}`,
          sampleApplyUrl: validation.sampleApplyUrl,
        };
      }
    }

    return null;
  }
}
