import {
  BadRequestException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { ResumeFileType } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { ResumesService } from "./resumes.service";
import { ResumeStorageService } from "./storage/resume-storage.service";

describe("ResumesService", () => {
  let service: ResumesService;

  const mockPrismaService = {
    $transaction: jest.fn((cb) => cb(mockPrismaService)),
    resume: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
    resumeVersion: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockStorageService = {
    saveFile: jest.fn(),
    deleteFile: jest.fn(),
    getFilePath: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        ResumesService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: ResumeStorageService, useValue: mockStorageService },
      ],
    }).compile();

    service = moduleRef.get<ResumesService>(ResumesService);
    jest.clearAllMocks();
  });

  describe("createWithUpload", () => {
    const mockFile: Express.Multer.File = {
      fieldname: "file",
      originalname: "my_software_resume.pdf",
      encoding: "7bit",
      mimetype: "application/pdf",
      size: 1024 * 50, // 50KB
      buffer: Buffer.from("dummy pdf content"),
      stream: null as unknown as import("stream").Readable,
      destination: "",
      filename: "",
      path: "",
    };

    it("throws BadRequestException if file is missing or has no buffer", async () => {
      await expect(
        service.createWithUpload(
          "user-1",
          null as unknown as Express.Multer.File,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException if file size exceeds 5MB", async () => {
      const largeFile = {
        ...mockFile,
        size: 6 * 1024 * 1024, // 6MB
      };
      await expect(
        service.createWithUpload("user-1", largeFile),
      ).rejects.toThrow(BadRequestException);
    });

    it("throws BadRequestException for unsupported file formats", async () => {
      const unsupportedFile = {
        ...mockFile,
        mimetype: "image/png",
      };
      await expect(
        service.createWithUpload("user-1", unsupportedFile),
      ).rejects.toThrow(BadRequestException);
    });

    it("atomically creates Resume and initial ResumeVersion 1 in transaction", async () => {
      mockStorageService.saveFile.mockResolvedValue({
        fileUrl: "/api/v1/resumes/files/user-1/saved.pdf",
        storageKey: "user-1/saved.pdf",
        originalFileName: "my_software_resume.pdf",
        fileSize: 1024 * 50,
      });

      const createdResume = {
        id: "res-1",
        userId: "user-1",
        title: "my_software_resume",
        fileUrl: "/api/v1/resumes/files/user-1/saved.pdf",
        fileType: ResumeFileType.PDF,
        currentVersion: 1,
        isDefault: true,
      };

      const createdVersion = {
        id: "ver-1",
        resumeId: "res-1",
        versionNumber: 1,
        title: "my_software_resume (v1)",
        fileUrl: "/api/v1/resumes/files/user-1/saved.pdf",
      };

      mockPrismaService.resume.create.mockResolvedValue(createdResume);
      mockPrismaService.resumeVersion.create.mockResolvedValue(createdVersion);

      const result = await service.createWithUpload("user-1", mockFile, {
        isDefault: true,
      });

      expect(mockPrismaService.resume.updateMany).toHaveBeenCalledWith({
        where: { userId: "user-1", isDefault: true },
        data: { isDefault: false },
      });
      expect(mockPrismaService.resume.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: "user-1",
            currentVersion: 1,
            isDefault: true,
          }),
        }),
      );
      expect(mockPrismaService.resumeVersion.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            resumeId: "res-1",
            versionNumber: 1,
          }),
        }),
      );
      expect(result.id).toBe("res-1");
      expect(result.versions[0].versionNumber).toBe(1);
    });
  });

  describe("findOne", () => {
    it("throws NotFoundException if resume does not exist", async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue(null);
      await expect(service.findOne("user-1", "nonexistent")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("throws ForbiddenException if resume belongs to another user", async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue({
        id: "res-2",
        userId: "other-user",
      });
      await expect(service.findOne("user-1", "res-2")).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("returns resume when user is owner", async () => {
      const mockResume = { id: "res-1", userId: "user-1", title: "My Resume" };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const result = await service.findOne("user-1", "res-1");
      expect(result.title).toBe("My Resume");
    });
  });

  describe("createVersion", () => {
    it("creates incremented version 2 and updates parent resume currentVersion", async () => {
      const mockResume = {
        id: "res-1",
        userId: "user-1",
        title: "Staff Engineer Resume",
        currentVersion: 1,
        fileUrl: "/path/v1.pdf",
      };
      mockPrismaService.resume.findUnique.mockResolvedValue(mockResume);

      const createdVersion = {
        id: "ver-2",
        resumeId: "res-1",
        versionNumber: 2,
        title: "Staff Engineer Resume (v2)",
        contentSnapshot: { summary: "Updated leadership experience" },
      };
      mockPrismaService.resumeVersion.create.mockResolvedValue(createdVersion);

      const result = await service.createVersion("user-1", "res-1", {
        changeSummary: "Added leadership bullets",
        contentSnapshot: { summary: "Updated leadership experience" },
      });

      expect(mockPrismaService.resumeVersion.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          resumeId: "res-1",
          versionNumber: 2,
          changeSummary: "Added leadership bullets",
        }),
      });
      expect(mockPrismaService.resume.update).toHaveBeenCalledWith({
        where: { id: "res-1" },
        data: expect.objectContaining({
          currentVersion: 2,
        }),
      });
      expect(result.versionNumber).toBe(2);
    });
  });

  describe("delete", () => {
    it("deletes resume from database and triggers storage cleanup", async () => {
      mockPrismaService.resume.findUnique.mockResolvedValue({
        id: "res-1",
        userId: "user-1",
        fileUrl: "/api/v1/resumes/files/user-1/res1.pdf",
      });
      mockPrismaService.resume.delete.mockResolvedValue({});

      const result = await service.delete("user-1", "res-1");

      expect(mockPrismaService.resume.delete).toHaveBeenCalledWith({
        where: { id: "res-1" },
      });
      expect(mockStorageService.deleteFile).toHaveBeenCalledWith(
        "user-1/res1.pdf",
      );
      expect(result.success).toBe(true);
    });
  });
});
