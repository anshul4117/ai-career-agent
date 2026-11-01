import { resumeService, BackendResume } from "../services/resume.service";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    patch: jest.fn(),
    delete: jest.fn(),
    upload: jest.fn(),
  },
}));

describe("Resume Service (Web)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const mockBackendResume: BackendResume = {
    id: "res-123",
    userId: "user-1",
    title: "Full Stack Engineer Resume",
    fileUrl: "/api/v1/resumes/files/user-1/file.pdf",
    fileType: "PDF",
    fileSize: 1024 * 120, // 120KB
    originalFileName: "john_doe_resume.pdf",
    isDefault: true,
    status: "ACTIVE",
    currentVersion: 1,
    templateId: "developer",
    themeConfig: null,
    customSections: null,
    createdAt: "2026-11-01T10:00:00.000Z",
    updatedAt: "2026-11-01T10:00:00.000Z",
    versions: [
      {
        id: "ver-1",
        versionNumber: 1,
        title: "Full Stack Engineer Resume (v1)",
        fileUrl: "/api/v1/resumes/files/user-1/file.pdf",
        createdAt: "2026-11-01T10:00:00.000Z",
      },
    ],
    analyses: [
      {
        overallAtsScore: 88,
      },
    ],
  };

  it("fetches resumes and maps to frontend format", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([mockBackendResume]);

    const resumes = await resumeService.getAll();

    expect(apiClient.get).toHaveBeenCalledWith("/resumes");
    expect(resumes).toHaveLength(1);
    expect(resumes[0].id).toBe("res-123");
    expect(resumes[0].title).toBe("Full Stack Engineer Resume");
    expect(resumes[0].atsScore).toBe(88);
    expect(resumes[0].isDefault).toBe(true);
  });

  it("fetches and maps uploaded resumes with version history", async () => {
    (apiClient.get as jest.Mock).mockResolvedValue([mockBackendResume]);

    const uploaded = await resumeService.getUploadedResumes();

    expect(uploaded).toHaveLength(1);
    expect(uploaded[0].fileName).toBe("john_doe_resume.pdf");
    expect(uploaded[0].fileSize).toBe("120 KB");
    expect(uploaded[0].version).toBe(1);
    expect(uploaded[0].versionHistory).toHaveLength(1);
  });

  it("uploads resume file and returns normalized UploadedResume", async () => {
    (apiClient.upload as jest.Mock).mockResolvedValue(mockBackendResume);

    const mockFile = new File(["dummy content"], "my_resume.pdf", {
      type: "application/pdf",
    });

    const result = await resumeService.upload(mockFile, {
      title: "My Custom Title",
      isDefault: true,
    });

    expect(apiClient.upload).toHaveBeenCalledWith(
      "/resumes/upload",
      expect.any(FormData),
    );
    expect(result.id).toBe("res-123");
    expect(result.fileName).toBe("john_doe_resume.pdf");
  });

  it("deletes resume via apiClient.delete", async () => {
    (apiClient.delete as jest.Mock).mockResolvedValue({});

    await resumeService.delete("res-123");

    expect(apiClient.delete).toHaveBeenCalledWith("/resumes/res-123");
  });

  it("updates resume via apiClient.patch", async () => {
    (apiClient.patch as jest.Mock).mockResolvedValue({
      ...mockBackendResume,
      title: "Updated Title",
    });

    const updated = await resumeService.update("res-123", {
      title: "Updated Title",
    });

    expect(apiClient.patch).toHaveBeenCalledWith("/resumes/res-123", {
      title: "Updated Title",
    });
    expect(updated.title).toBe("Updated Title");
  });
});
