/**
 * API service placeholders.
 * Real implementations will connect to /api/v1 when backend is ready.
 */

export const servicesPlaceholder = {
  auth: "services/auth.service.ts",
  profile: "services/profile.service.ts",
  jobs: "services/job.service.ts",
  applications: "services/application.service.ts",
  resume: "services/resume.service.ts",
} as const;
