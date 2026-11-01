import * as dotenv from "dotenv";
dotenv.config();

import { PrismaService } from "../../../prisma/prisma.service";

const CLOSURE_PATTERNS = [
  /no longer (available|open|accepting applications)/i,
  /position (has been )?filled/i,
  /job (has )?expired/i,
  /this (job|posting) is closed/i,
  /applications? (are )?closed/i,
  /not currently accepting applications/i,
  /404 - page not found/i,
  /this vacancy is no longer available/i,
];

const AGGREGATOR_DOMAINS = [
  "adzuna",
  "jsearch",
  "rapidapi",
  "indeed",
  "naukri",
  "monster",
  "ziprecruiter",
  "linkedin.com/jobs/view",
];

export async function runStratifiedLinkAudit() {
  const prisma = new PrismaService();
  console.log("=== STRATIFIED LINK AUDIT (CAPPED AT 10 PER COMPANY) ===");

  const activeJobs = await prisma.job.findMany({
    where: { isActive: true },
    select: {
      id: true,
      title: true,
      applyUrl: true,
      validatedApplyUrl: true,
      company: { select: { id: true, name: true } },
      jobSources: { select: { source: true, sourceJobUrl: true }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  // Group by company and cap at 10
  const companyMap = new Map<string, typeof activeJobs>();
  for (const job of activeJobs) {
    const list = companyMap.get(job.company.name) || [];
    if (list.length < 10) {
      list.push(job);
      companyMap.set(job.company.name, list);
    }
  }

  const sample: typeof activeJobs = [];
  for (const jobs of companyMap.values()) {
    sample.push(...jobs);
  }

  console.log(
    `Stratified sample size: ${sample.length} jobs across ${companyMap.size} distinct companies.`,
  );

  let validDirectCount = 0;
  let expiredContentCount = 0;
  let redirectAggregatorCount = 0;
  let deadHttpCount = 0;
  let redirectedCount = 0;

  const results: Array<{
    company: string;
    title: string;
    initialUrl: string;
    finalUrl: string;
    status: "VALID" | "EXPIRED_CONTENT" | "REDIRECT_AGGREGATOR" | "DEAD_HTTP";
    httpStatus: number;
    redirectHops: number;
    closureReason?: string;
  }> = [];

  // Concurrency 5 to be polite to ATS servers
  for (let i = 0; i < sample.length; i += 5) {
    const batch = sample.slice(i, i + 5);
    await Promise.all(
      batch.map(async (j) => {
        const initialUrl =
          j.validatedApplyUrl ||
          j.applyUrl ||
          j.jobSources[0]?.sourceJobUrl ||
          "";
        if (!initialUrl) {
          deadHttpCount++;
          results.push({
            company: j.company.name,
            title: j.title,
            initialUrl: "",
            finalUrl: "",
            status: "DEAD_HTTP",
            httpStatus: 0,
            redirectHops: 0,
            closureReason: "MISSING_URL",
          });
          return;
        }

        try {
          const controller = new AbortController();
          const timeout = setTimeout(() => controller.abort(), 6000);

          const res = await fetch(initialUrl, {
            method: "GET",
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
              Accept:
                "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            },
            signal: controller.signal,
            redirect: "follow",
          });
          clearTimeout(timeout);

          const finalUrl = res.url || initialUrl;
          const isRedirected = finalUrl !== initialUrl;
          if (isRedirected) redirectedCount++;

          // Check if landed on an aggregator
          const isAggregator = AGGREGATOR_DOMAINS.some((d) =>
            finalUrl.toLowerCase().includes(d),
          );
          if (isAggregator) {
            redirectAggregatorCount++;
            results.push({
              company: j.company.name,
              title: j.title,
              initialUrl,
              finalUrl,
              status: "REDIRECT_AGGREGATOR",
              httpStatus: res.status,
              redirectHops: isRedirected ? 1 : 0,
            });
            return;
          }

          if (!res.ok && res.status !== 403 && res.status !== 401) {
            // Dead HTTP (404, 410, 500)
            deadHttpCount++;
            results.push({
              company: j.company.name,
              title: j.title,
              initialUrl,
              finalUrl,
              status: "DEAD_HTTP",
              httpStatus: res.status,
              redirectHops: isRedirected ? 1 : 0,
              closureReason: `HTTP_${res.status}`,
            });
            return;
          }

          // Read body for closure text (up to 50KB)
          let bodyText = "";
          try {
            const rawBody = await res.text();
            bodyText = rawBody.slice(0, 50000);
          } catch {
            // body read failed, treat status
          }

          let matchedClosure: string | undefined = undefined;
          for (const pattern of CLOSURE_PATTERNS) {
            if (pattern.test(bodyText)) {
              matchedClosure = pattern.source;
              break;
            }
          }

          if (matchedClosure) {
            expiredContentCount++;
            results.push({
              company: j.company.name,
              title: j.title,
              initialUrl,
              finalUrl,
              status: "EXPIRED_CONTENT",
              httpStatus: res.status,
              redirectHops: isRedirected ? 1 : 0,
              closureReason: `CONTENT_CLOSURE_DETECTED: ${matchedClosure}`,
            });
          } else {
            validDirectCount++;
            results.push({
              company: j.company.name,
              title: j.title,
              initialUrl,
              finalUrl,
              status: "VALID",
              httpStatus: res.status,
              redirectHops: isRedirected ? 1 : 0,
            });
          }
        } catch (err: unknown) {
          deadHttpCount++;
          results.push({
            company: j.company.name,
            title: j.title,
            initialUrl,
            finalUrl: "",
            status: "DEAD_HTTP",
            httpStatus: 0,
            redirectHops: 0,
            closureReason:
              (err as Error).message || "TIMEOUT_OR_CONNECTION_ERROR",
          });
        }
      }),
    );
  }

  console.log("\n=== Stratified Link Health Results ===");
  console.log(`Total Stratified Sample: ${sample.length}`);
  console.log(
    ` - Valid Direct Human-Facing Links: ${validDirectCount} (${((validDirectCount / sample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Expired / Closed Text in Page:   ${expiredContentCount} (${((expiredContentCount / sample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Redirected to Aggregators:       ${redirectAggregatorCount} (${((redirectAggregatorCount / sample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Dead / 404 / 410 / Timeout:       ${deadHttpCount} (${((deadHttpCount / sample.length) * 100).toFixed(1)}%)`,
  );
  console.log(
    ` - Links that required Redirects:   ${redirectedCount} (${((redirectedCount / sample.length) * 100).toFixed(1)}%)`,
  );

  await prisma.$disconnect();
  return {
    sampleSize: sample.length,
    validDirectCount,
    expiredContentCount,
    redirectAggregatorCount,
    deadHttpCount,
    redirectedCount,
  };
}

if (require.main === module) {
  runStratifiedLinkAudit().catch(console.error);
}
