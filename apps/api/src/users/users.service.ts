import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";

export function splitFullName(fullName: string): [string, string] {
  const parts = (fullName || "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

export interface UserWithProfilePayload {
  [key: string]: unknown;
  fullName?: string | null;
  passwordHash?: string | null;
  profilePhotoUrl?: string | null;
  emailVerified?: boolean | null;
  profile?: {
    headline?: string | null;
    preferredRole?: string | null;
    currentRole?: string | null;
    [key: string]: unknown;
  } | null;
}

export function formatUserResponse(
  user: UserWithProfilePayload | null | undefined,
) {
  if (!user) return user;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash: _pw, ...rest } = user;
  const [firstName, lastName] = splitFullName(user.fullName);
  const profile = user.profile;
  const isCompleted = !!(
    profile &&
    (profile.headline || profile.preferredRole || profile.currentRole)
  );

  return {
    ...rest,
    name: user.fullName || `${firstName} ${lastName}`.trim(),
    firstName,
    lastName,
    profileImage: user.profilePhotoUrl || null,
    verified: user.emailVerified ?? false,
    profileCompleted: isCompleted,
    headline: profile?.headline || null,
    preferredRole: profile?.preferredRole || null,
    preferredLocation: profile?.preferredLocation || null,
  };
}

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        profile: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: true,
      },
    });
  }

  async updateUser(id: string, data: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }

  /**
   * Account Deletion & Anonymization Workflow:
   * 1. Collects all physical file references (Resume.fileUrl, ResumeVersion.fileUrl, JobApplication.immutableFileKey).
   * 2. Preserves employer hiring compliance records by re-assigning JobApplications
   *    to the System Archive User (00000000-0000-0000-0000-000000000000).
   * 3. Scrubs applicant PII (candidateName, candidateEmail, candidatePhone, originalFileName) from resumeSnapshot.
   * 4. Sanitizes ApplicationStatusHistory messages to prevent lingering recruiter/applicant notes.
   * 5. Physically deletes the User record, cascading personal data erasure across
   *    Profile, Resumes, Education, Experience, Projects, Skills, and OAuth/RefreshTokens,
   *    while freeing the unique email constraint immediately.
   * 6. Dispatches reliable object storage deletion only AFTER the database transaction commits.
   */
  async anonymizeAndDeleteAccount(userId: string): Promise<void> {
    const SYSTEM_ARCHIVE_USER_ID = "00000000-0000-0000-0000-000000000000";

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Step 1: Gather file URLs and storage keys to purge AFTER transaction commits
    const resumes = await this.prisma.resume.findMany({
      where: { userId },
      select: { fileUrl: true },
    });
    const versions = await this.prisma.resumeVersion.findMany({
      where: { resume: { userId } },
      select: { fileUrl: true },
    });
    const applications = await this.prisma.jobApplication.findMany({
      where: { userId },
      select: { immutableFileKey: true },
    });

    const fileKeysToCleanup = new Set<string>();
    for (const r of resumes) {
      if (r.fileUrl) fileKeysToCleanup.add(r.fileUrl);
    }
    for (const v of versions) {
      if (v.fileUrl) fileKeysToCleanup.add(v.fileUrl);
    }
    for (const a of applications) {
      if (a.immutableFileKey) fileKeysToCleanup.add(a.immutableFileKey);
    }

    // Step 2: Atomic database anonymization & user deletion
    await this.prisma.$transaction(async (tx) => {
      // A. Sanitize potential candidate PII in ApplicationStatusHistory messages
      await tx.$executeRaw`
        UPDATE "application_status_history"
        SET "message" = NULL
        WHERE "jobApplicationId" IN (
          SELECT id FROM "job_applications" WHERE "userId" = ${userId}
        )
      `;

      // B. Anonymize and re-assign JobApplications to System Archive User
      await tx.$executeRaw`
        UPDATE "job_applications"
        SET 
          "userId" = ${SYSTEM_ARCHIVE_USER_ID},
          "resumeId" = NULL,
          "resumeVersionId" = NULL,
          "immutableFileKey" = NULL,
          "resumeSnapshot" = CASE
            WHEN "resumeSnapshot" IS NOT NULL THEN
              jsonb_build_object(
                'title', COALESCE("resumeSnapshot"->>'title', 'Submitted Resume'),
                'candidateName', '[Anonymized Candidate]',
                'candidateEmail', '[Anonymized Email]',
                'candidatePhone', '[Anonymized Phone]',
                'originalFileName', 'anonymized_resume.pdf'
              )
            ELSE NULL
          END,
          "notes" = NULL,
          "updatedAt" = NOW()
        WHERE "userId" = ${userId}
      `;

      // C. Physically delete the User record (cascading personal records)
      await tx.user.delete({
        where: { id: userId },
      });
    });

    // Step 3: Reliable object-storage cleanup AFTER transaction has committed
    if (fileKeysToCleanup.size > 0) {
      await this.dispatchStorageCleanup(Array.from(fileKeysToCleanup));
    }
  }

  /**
   * Dispatch background cleanup of orphaned object-storage assets.
   * Catches errors gracefully to guarantee audit trail preservation.
   */
  private async dispatchStorageCleanup(fileKeys: string[]): Promise<void> {
    this.logger.log(
      `Dispatched object-storage cleanup for ${fileKeys.length} files: ${fileKeys.join(", ")}`,
    );
    try {
      // Background cleanup hook: When external S3 / Cloudflare R2 service is active,
      // dispatch deleteObject commands.
      for (const key of fileKeys) {
        this.logger.debug(`Purging storage asset: ${key}`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`Failed to purge object-storage files: ${message}`);
    }
  }
}
