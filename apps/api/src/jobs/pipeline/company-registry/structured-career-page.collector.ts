import { Injectable, Logger } from "@nestjs/common";
import { AtsDetectorService } from "./ats-detector.service";
import { validateSafeUrl, SsrfSecurityException } from "./ssrf-validator";
import { RawJob } from "../sources/job-source.interface";
import * as crypto from "crypto";

export interface CompanyTarget {
  id: string;
  name: string;
  domain?: string | null;
  careerUrl?: string | null;
  careerPageUrl?: string | null;
  websiteUrl?: string | null;
  city?: string | null;
  state?: string | null;
}

@Injectable()
export class StructuredCareerPageCollector {
  private readonly logger = new Logger(StructuredCareerPageCollector.name);
  private readonly USER_AGENT =
    "AICareerAgent-StructuredCollector/1.0 (+https://ai-career-agent.vercel.app)";

  constructor(private readonly atsDetector: AtsDetectorService) {}

  /**
   * Safely checks a company's career page for structured data (schema.org JobPosting JSON-LD or RSS feed).
   * Only operates if robots.txt permits. Returns empty array if no structured data exists.
   */
  async collectFromStructuredCareerPage(
    company: CompanyTarget,
  ): Promise<RawJob[]> {
    const rawTarget =
      company.careerUrl || company.careerPageUrl || company.websiteUrl;
    if (!rawTarget) return [];

    let safeUrl: URL;
    try {
      safeUrl = await validateSafeUrl(rawTarget);
    } catch (err: unknown) {
      if (err instanceof SsrfSecurityException) {
        this.logger.warn(
          `SSRF Blocked during structured crawl: ${err.message}`,
        );
      }
      return [];
    }

    // Strictly check robots.txt
    const allowed = await this.atsDetector.isRobotsAllowed(safeUrl);
    if (!allowed) {
      this.logger.debug(
        `Structured crawl blocked by robots.txt for ${safeUrl.toString()}`,
      );
      return [];
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    try {
      const res = await fetch(safeUrl.toString(), {
        headers: {
          "User-Agent": this.USER_AGENT,
          Accept: "text/html,application/xhtml+xml,application/rss+xml",
        },
        signal: controller.signal,
        redirect: "manual",
      });

      if (!res.ok) return [];

      const buffer = await res.arrayBuffer();
      const maxBytes = 1024 * 1024; // 1MB cap
      const sliced =
        buffer.byteLength > maxBytes ? buffer.slice(0, maxBytes) : buffer;
      const html = new TextDecoder("utf-8").decode(sliced);

      // 1. Look for schema.org JobPosting JSON-LD
      const jsonLdJobs = this.extractJsonLdJobs(
        html,
        company,
        safeUrl.toString(),
      );
      if (jsonLdJobs.length > 0) {
        this.logger.log(
          `Extracted ${jsonLdJobs.length} structured JSON-LD jobs for [${company.name}].`,
        );
        return jsonLdJobs;
      }

      // 2. Look for RSS / Atom job feed
      const rssJobs = this.extractRssJobs(html, company, safeUrl.toString());
      if (rssJobs.length > 0) {
        this.logger.log(
          `Extracted ${rssJobs.length} RSS feed jobs for [${company.name}].`,
        );
        return rssJobs;
      }

      return [];
    } catch (err: unknown) {
      this.logger.debug(
        `Structured collection skipped for ${company.name}: ${(err as Error).message}`,
      );
      return [];
    } finally {
      clearTimeout(timeout);
    }
  }

  private extractJsonLdJobs(
    html: string,
    company: CompanyTarget,
    pageUrl: string,
  ): RawJob[] {
    const jobs: RawJob[] = [];
    const scriptRegex =
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
    let match: RegExpExecArray | null;

    while ((match = scriptRegex.exec(html)) !== null) {
      try {
        const rawJson = JSON.parse(match[1]);
        const items = Array.isArray(rawJson)
          ? rawJson
          : rawJson["@graph"]
            ? rawJson["@graph"]
            : [rawJson];

        for (const item of items) {
          if (item["@type"] === "JobPosting") {
            const title = item.title;
            const applyUrl = item.url || item.directApply || pageUrl;
            if (!title) continue;

            const externalHash = crypto
              .createHash("md5")
              .update(`${company.name}-${title}-${applyUrl}`)
              .digest("hex")
              .slice(0, 16);

            const locationStr =
              item.jobLocation?.address?.addressLocality ||
              company.city ||
              "India";

            jobs.push({
              sourceJobId: `jsonld-${externalHash}`,
              source: "COMPANY",
              title,
              company: company.name,
              location: locationStr,
              isRemote: false,
              description: item.description || title,
              applyUrl,
              applyLinkStatus: "company_portal",
              postedAt: item.datePosted
                ? new Date(item.datePosted)
                : new Date(),
              skills: [],
              rawPayload: {
                ...item,
                structuredType: "schema.org/JobPosting",
              },
            });
          }
        }
      } catch {
        // Skip malformed JSON blocks
      }
    }

    return jobs;
  }

  private extractRssJobs(
    html: string,
    company: CompanyTarget,
    pageUrl: string,
  ): RawJob[] {
    const jobs: RawJob[] = [];
    if (!html.includes("<rss") && !html.includes("<feed")) {
      return [];
    }

    const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
    let itemMatch: RegExpExecArray | null;

    while ((itemMatch = itemRegex.exec(html)) !== null) {
      const itemXml = itemMatch[1];
      const titleMatch = itemXml.match(
        /<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/i,
      );
      const linkMatch = itemXml.match(
        /<link>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/link>/i,
      );
      const descMatch = itemXml.match(
        /<description>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/description>/i,
      );
      const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i);

      const title = titleMatch ? titleMatch[1].trim() : null;
      const applyUrl = linkMatch ? linkMatch[1].trim() : pageUrl;

      if (title) {
        const externalHash = crypto
          .createHash("md5")
          .update(`${company.name}-${title}-${applyUrl}`)
          .digest("hex")
          .slice(0, 16);

        jobs.push({
          sourceJobId: `rss-${externalHash}`,
          source: "COMPANY",
          title,
          company: company.name,
          location: company.city || "India",
          isRemote: false,
          description: descMatch ? descMatch[1].trim() : title,
          applyUrl,
          applyLinkStatus: "company_portal",
          postedAt: dateMatch ? new Date(dateMatch[1].trim()) : new Date(),
          skills: [],
          rawPayload: {
            sourceType: "RSS",
          },
        });
      }
    }

    return jobs;
  }
}
