import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma, ResumeFileType, ResumeStatus } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ResumeStorageService } from "./storage/resume-storage.service";
import {
  CreateResumeDto,
  CreateResumeVersionDto,
  UpdateResumeDto,
} from "./dto/create-resume.dto";

const ALLOWED_MIME_TYPES: Record<string, ResumeFileType> = {
  "application/pdf": ResumeFileType.PDF,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    ResumeFileType.DOCX,
  "application/msword": ResumeFileType.DOCX,
};

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

@Injectable()
export class ResumesService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storageService: ResumeStorageService,
  ) {}

  /**
   * Determine file type from MIME type.
   */
  private resolveFileType(mimeType: string): ResumeFileType {
    const fileType = ALLOWED_MIME_TYPES[mimeType];
    if (!fileType) {
      throw new BadRequestException(
        "Invalid file type. Only PDF and DOCX documents are accepted (max 5MB).",
      );
    }
    return fileType;
  }

  /**
   * Upload resume and atomically initialize both Resume and Version 1.
   */
  async createWithUpload(
    userId: string,
    file: Express.Multer.File,
    dto: CreateResumeDto = {},
  ) {
    if (!file || !file.buffer) {
      throw new BadRequestException("Resume file is required.");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new BadRequestException("File size exceeds 5MB limit.");
    }

    const fileType = this.resolveFileType(file.mimetype);
    const stored = await this.storageService.saveFile(userId, file);

    const title =
      dto.title?.trim() ||
      file.originalname.replace(/\.[^/.]+$/, "").trim() ||
      "Untitled Resume";

    return this.prisma.$transaction(async (tx) => {
      // If setting as default, clear previous defaults for this user
      if (dto.isDefault) {
        await tx.resume.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      // 1. Create parent Resume record (currentVersion = 1)
      const resume = await tx.resume.create({
        data: {
          userId,
          title,
          fileUrl: stored.fileUrl,
          fileType,
          fileSize: stored.fileSize,
          originalFileName: stored.originalFileName,
          isDefault: dto.isDefault ?? false,
          status: ResumeStatus.ACTIVE,
          currentVersion: 1,
          templateId: dto.templateId ?? "default",
          themeConfig:
            (dto.themeConfig as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          customSections:
            (dto.customSections as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });

      // 2. Atomically create initial ResumeVersion (versionNumber = 1)
      const version = await tx.resumeVersion.create({
        data: {
          resumeId: resume.id,
          versionNumber: 1,
          title: `${title} (v1)`,
          fileUrl: stored.fileUrl,
          contentSnapshot: {},
          themeSnapshot:
            (dto.themeConfig as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          changeSummary: "Initial version",
        },
      });

      return {
        ...resume,
        versions: [version],
      };
    });
  }

  /**
   * Create resume from builder without initial file.
   */
  async create(userId: string, dto: CreateResumeDto = {}) {
    const title = dto.title?.trim() || "Untitled Resume";

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.resume.updateMany({
          where: { userId, isDefault: true },
          data: { isDefault: false },
        });
      }

      const resume = await tx.resume.create({
        data: {
          userId,
          title,
          fileUrl: "",
          fileType: ResumeFileType.PDF,
          fileSize: 0,
          originalFileName: `${title}.pdf`,
          isDefault: dto.isDefault ?? false,
          status: ResumeStatus.ACTIVE,
          currentVersion: 1,
          templateId: dto.templateId ?? "default",
          themeConfig:
            (dto.themeConfig as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          customSections:
            (dto.customSections as Prisma.InputJsonValue) ?? Prisma.JsonNull,
        },
      });

      const version = await tx.resumeVersion.create({
        data: {
          resumeId: resume.id,
          versionNumber: 1,
          title: `${title} (v1)`,
          fileUrl: "",
          contentSnapshot: (dto.customSections as Prisma.InputJsonValue) ?? {},
          themeSnapshot:
            (dto.themeConfig as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          changeSummary: "Initial version",
        },
      });

      return {
        ...resume,
        versions: [version],
      };
    });
  }

  /**
   * List all resumes belonging to user.
   */
  async findAll(userId: string, status?: ResumeStatus) {
    return this.prisma.resume.findMany({
      where: {
        userId,
        ...(status ? { status } : {}),
      },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 5,
        },
        parseResults: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: [{ isDefault: "desc" }, { updatedAt: "desc" }],
    });
  }

  /**
   * Find single resume with ownership verification.
   */
  async findOne(userId: string, id: string) {
    const resume = await this.prisma.resume.findUnique({
      where: { id },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
        },
        parseResults: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!resume) {
      throw new NotFoundException("Resume not found");
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException("Access denied to this resume");
    }

    return resume;
  }

  /**
   * Update resume metadata and preferences.
   */
  async update(userId: string, id: string, dto: UpdateResumeDto) {
    await this.findOne(userId, id); // validates ownership

    return this.prisma.$transaction(async (tx) => {
      if (dto.isDefault) {
        await tx.resume.updateMany({
          where: { userId, isDefault: true, id: { not: id } },
          data: { isDefault: false },
        });
      }

      return tx.resume.update({
        where: { id },
        data: {
          ...(dto.title !== undefined ? { title: dto.title.trim() } : {}),
          ...(dto.isDefault !== undefined ? { isDefault: dto.isDefault } : {}),
          ...(dto.status !== undefined ? { status: dto.status } : {}),
          ...(dto.templateId !== undefined
            ? { templateId: dto.templateId }
            : {}),
          ...(dto.themeConfig !== undefined
            ? { themeConfig: dto.themeConfig as Prisma.InputJsonValue }
            : {}),
          ...(dto.customSections !== undefined
            ? { customSections: dto.customSections as Prisma.InputJsonValue }
            : {}),
        },
      });
    });
  }

  /**
   * Create a new immutable version for an existing resume.
   */
  async createVersion(
    userId: string,
    resumeId: string,
    dto: CreateResumeVersionDto,
    file?: Express.Multer.File,
  ) {
    const resume = await this.findOne(userId, resumeId);

    let fileUrl = resume.fileUrl;
    if (file && file.buffer) {
      if (file.size > MAX_FILE_SIZE) {
        throw new BadRequestException("File size exceeds 5MB limit.");
      }
      this.resolveFileType(file.mimetype);
      const stored = await this.storageService.saveFile(userId, file);
      fileUrl = stored.fileUrl;
    }

    return this.prisma.$transaction(async (tx) => {
      const nextVersionNumber = resume.currentVersion + 1;
      const title =
        dto.title?.trim() || `${resume.title} (v${nextVersionNumber})`;

      const version = await tx.resumeVersion.create({
        data: {
          resumeId,
          versionNumber: nextVersionNumber,
          title,
          fileUrl,
          contentSnapshot: (dto.contentSnapshot as Prisma.InputJsonValue) ?? {},
          themeSnapshot:
            (dto.themeSnapshot as Prisma.InputJsonValue) ?? Prisma.JsonNull,
          changeSummary: dto.changeSummary ?? null,
        },
      });

      await tx.resume.update({
        where: { id: resumeId },
        data: {
          currentVersion: nextVersionNumber,
          fileUrl,
          updatedAt: new Date(),
        },
      });

      return version;
    });
  }

  /**
   * List all versions of a specific resume.
   */
  async getVersions(userId: string, resumeId: string) {
    await this.findOne(userId, resumeId); // validates ownership

    return this.prisma.resumeVersion.findMany({
      where: { resumeId },
      orderBy: { versionNumber: "desc" },
    });
  }

  /**
   * Get specific version with ownership validation.
   */
  async getVersion(userId: string, resumeId: string, versionId: string) {
    await this.findOne(userId, resumeId);

    const version = await this.prisma.resumeVersion.findUnique({
      where: { id: versionId },
    });

    if (!version || version.resumeId !== resumeId) {
      throw new NotFoundException("Resume version not found");
    }

    return version;
  }

  /**
   * Delete resume and clean up storage post-commit.
   */
  async delete(userId: string, id: string) {
    const resume = await this.findOne(userId, id);

    // Extract storage key from relative fileUrl
    const storageKey = resume.fileUrl?.replace(
      /^\/api\/v1\/resumes\/files\//,
      "",
    );

    await this.prisma.resume.delete({
      where: { id },
    });

    // Cleanup physical file after DB commit
    if (storageKey) {
      await this.storageService.deleteFile(storageKey);
    }

    return { success: true, message: "Resume deleted successfully" };
  }

  /**
   * Return absolute file path for serving/downloading with ownership check.
   */
  async getFilePathForUser(userId: string, storageKey: string) {
    if (!storageKey.startsWith(`${userId}/`)) {
      throw new ForbiddenException("Access denied to requested file");
    }

    const filePath = this.storageService.getFilePath(storageKey);
    if (!filePath) {
      throw new NotFoundException("File not found on storage");
    }

    return filePath;
  }
}
