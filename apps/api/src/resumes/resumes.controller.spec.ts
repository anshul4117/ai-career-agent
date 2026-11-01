import { Test, TestingModule } from "@nestjs/testing";
import { AuthenticatedRequest, ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";

describe("ResumesController", () => {
  let controller: ResumesController;

  const mockResumesService = {
    createWithUpload: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    createVersion: jest.fn(),
    getVersions: jest.fn(),
    getVersion: jest.fn(),
    getFilePathForUser: jest.fn(),
  };

  const mockUserReq = {
    user: { id: "user-1", email: "test@example.com" },
  } as unknown as AuthenticatedRequest;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [ResumesController],
      providers: [
        {
          provide: ResumesService,
          useValue: mockResumesService,
        },
      ],
    }).compile();

    controller = moduleRef.get<ResumesController>(ResumesController);
    jest.clearAllMocks();
  });

  it("should upload resume and call createWithUpload", async () => {
    const mockFile = { originalname: "resume.pdf" } as Express.Multer.File;
    mockResumesService.createWithUpload.mockResolvedValue({ id: "res-1" });

    const result = await controller.uploadResume(mockUserReq, mockFile, {
      title: "My Resume",
    });

    expect(mockResumesService.createWithUpload).toHaveBeenCalledWith(
      "user-1",
      mockFile,
      { title: "My Resume" },
    );
    expect(result.id).toBe("res-1");
  });

  it("should get all resumes for current user", async () => {
    mockResumesService.findAll.mockResolvedValue([{ id: "res-1" }]);

    const result = await controller.getResumes(mockUserReq);

    expect(mockResumesService.findAll).toHaveBeenCalledWith(
      "user-1",
      undefined,
    );
    expect(result).toHaveLength(1);
  });

  it("should get single resume by id", async () => {
    mockResumesService.findOne.mockResolvedValue({ id: "res-1" });

    const result = await controller.getResume(mockUserReq, "res-1");

    expect(mockResumesService.findOne).toHaveBeenCalledWith("user-1", "res-1");
    expect(result.id).toBe("res-1");
  });

  it("should create new version for resume", async () => {
    mockResumesService.createVersion.mockResolvedValue({ versionNumber: 2 });

    const result = await controller.createVersion(
      mockUserReq,
      "res-1",
      { changeSummary: "Version 2 changes" },
      undefined,
    );

    expect(mockResumesService.createVersion).toHaveBeenCalledWith(
      "user-1",
      "res-1",
      { changeSummary: "Version 2 changes" },
      undefined,
    );
    expect(result.versionNumber).toBe(2);
  });

  it("should delete resume", async () => {
    mockResumesService.delete.mockResolvedValue({ success: true });

    const result = await controller.deleteResume(mockUserReq, "res-1");

    expect(mockResumesService.delete).toHaveBeenCalledWith("user-1", "res-1");
    expect(result.success).toBe(true);
  });
});
