import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { JobPipelineService } from "../job-pipeline.service";

@Injectable()
export class JobSchedulerService {
  private readonly logger = new Logger(JobSchedulerService.name);

  constructor(private readonly pipelineService: JobPipelineService) {}

  /**
   * Periodic collection job. Off by default in development unless ENABLE_JOB_SCHEDULER="true".
   */
  @Cron(process.env.JOB_CRON_SCHEDULE || "0 */6 * * *")
  async handleScheduledCollection() {
    const isEnabled = process.env.ENABLE_JOB_SCHEDULER === "true";
    if (!isEnabled) {
      this.logger.debug(
        "Job Collection Scheduler is disabled by default in dev (ENABLE_JOB_SCHEDULER != true).",
      );
      return;
    }

    this.logger.log("Triggering automated periodic job collection run...");
    try {
      const summary = await this.pipelineService.runPipeline();
      this.logger.log(
        `Automated collection complete: ${summary.totalIngested} ingested, ${summary.approvedCount} approved.`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `Automated collection failed: ${(err as Error).message}`,
        (err as Error).stack,
      );
    }
  }

  /**
   * Daily expiry cleanup job. Deactivates jobs unseen for N days (default 14 days).
   */
  @Cron(process.env.JOB_EXPIRY_CRON_SCHEDULE || "0 2 * * *")
  async handleScheduledJobExpiry() {
    const isExpiryEnabled = process.env.ENABLE_JOB_EXPIRY !== "false";
    if (!isExpiryEnabled) return;

    this.logger.log("Triggering daily job expiry check...");
    try {
      const days = Number(process.env.JOB_EXPIRY_DAYS || "14");
      const expiredCount = await this.pipelineService.expireStaleJobs(days);
      this.logger.log(
        `Job expiry check complete. Deactivated ${expiredCount} stale jobs.`,
      );
    } catch (err: unknown) {
      this.logger.error(
        `Daily job expiry check failed: ${(err as Error).message}`,
      );
    }
  }
}
