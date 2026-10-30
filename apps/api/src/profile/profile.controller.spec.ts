import { Test, TestingModule } from "@nestjs/testing";
import type { Request } from "express";
import { ProfileController } from "./profile.controller";
import { ProfileService } from "./profile.service";
import {
  UpdateProfileDto,
  SkillItemDto,
  ExperienceItemDto,
} from "./dto/update-profile.dto";
import { PatchProfileDto } from "./dto/patch-profile.dto";

describe("ProfileController", () => {
  let controller: ProfileController;
  let service: ProfileService;

  const mockUserReq = {
    user: {
      id: "user-123",
      email: "alex@example.com",
    },
  } as unknown as Request;

  const mockProfileResponse = {
    profile: {
      id: "prof-1",
      userId: "user-123",
      fullName: "Alex Rivera",
      email: "alex@example.com",
      completionPercentage: 80,
    },
    skills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: [],
    preferences: null,
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [
        {
          provide: ProfileService,
          useValue: {
            getProfile: jest.fn().mockResolvedValue(mockProfileResponse),
            updateProfile: jest.fn().mockResolvedValue(mockProfileResponse),
            patchProfile: jest.fn().mockResolvedValue(mockProfileResponse),
            addSkill: jest
              .fn()
              .mockResolvedValue({ id: "sk-1", name: "TypeScript" }),
            updateSkill: jest
              .fn()
              .mockResolvedValue({ id: "sk-1", name: "TypeScript" }),
            deleteSkill: jest.fn().mockResolvedValue({ success: true }),
            addEducation: jest
              .fn()
              .mockResolvedValue({ id: "edu-1", institution: "MIT" }),
            updateEducation: jest
              .fn()
              .mockResolvedValue({ id: "edu-1", institution: "MIT" }),
            deleteEducation: jest.fn().mockResolvedValue({ success: true }),
            addExperience: jest
              .fn()
              .mockResolvedValue({ id: "exp-1", companyName: "Google" }),
            updateExperience: jest
              .fn()
              .mockResolvedValue({ id: "exp-1", companyName: "Google" }),
            deleteExperience: jest.fn().mockResolvedValue({ success: true }),
            addProject: jest
              .fn()
              .mockResolvedValue({ id: "proj-1", title: "Career Agent" }),
            updateProject: jest
              .fn()
              .mockResolvedValue({ id: "proj-1", title: "Career Agent" }),
            deleteProject: jest.fn().mockResolvedValue({ success: true }),
            addCertification: jest
              .fn()
              .mockResolvedValue({ id: "cert-1", name: "AWS SAA" }),
            updateCertification: jest
              .fn()
              .mockResolvedValue({ id: "cert-1", name: "AWS SAA" }),
            deleteCertification: jest.fn().mockResolvedValue({ success: true }),
            addLanguage: jest
              .fn()
              .mockResolvedValue({ id: "lang-1", language: "English" }),
            updateLanguage: jest
              .fn()
              .mockResolvedValue({ id: "lang-1", language: "English" }),
            deleteLanguage: jest.fn().mockResolvedValue({ success: true }),
            addSocialLink: jest
              .fn()
              .mockResolvedValue({ id: "soc-1", platform: "github" }),
            updateSocialLink: jest
              .fn()
              .mockResolvedValue({ id: "soc-1", platform: "github" }),
            deleteSocialLink: jest.fn().mockResolvedValue({ success: true }),
            updatePreferences: jest
              .fn()
              .mockResolvedValue({ preferredRole: "Staff Engineer" }),
          },
        },
      ],
    }).compile();

    controller = testingModule.get<ProfileController>(ProfileController);
    service = testingModule.get<ProfileService>(ProfileService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /profile/me", () => {
    it("should return the user's profile using the authenticated user ID", async () => {
      const result = await controller.getMyProfile(mockUserReq);
      expect(service.getProfile).toHaveBeenCalledWith("user-123");
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe("PUT /profile/me", () => {
    it("should update the entire profile for the authenticated user", async () => {
      const dto: UpdateProfileDto = {
        personal: { firstName: "Alex", lastName: "Rivera" },
        career: { headline: "Senior Full Stack Engineer" },
      };

      const result = await controller.updateMyProfile(mockUserReq, dto);
      expect(service.updateProfile).toHaveBeenCalledWith("user-123", dto);
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe("PATCH /profile/me", () => {
    it("should partially update the profile for the authenticated user", async () => {
      const dto: PatchProfileDto = {
        availability: "available",
      };

      const result = await controller.patchMyProfile(mockUserReq, dto);
      expect(service.patchProfile).toHaveBeenCalledWith("user-123", dto);
      expect(result).toEqual(mockProfileResponse);
    });
  });

  describe("Skills endpoints", () => {
    it("should delegate addSkill with user-123", async () => {
      const skillDto = {
        name: "TypeScript",
        level: "advanced",
        yearsOfExperience: 5,
      } as unknown as SkillItemDto;
      await controller.addSkill(mockUserReq, skillDto);
      expect(service.addSkill).toHaveBeenCalledWith("user-123", skillDto);
    });

    it("should delegate updateSkill with user-123", async () => {
      const skillDto = {
        level: "expert",
      } as unknown as Partial<SkillItemDto>;
      await controller.updateSkill(mockUserReq, "sk-1", skillDto);
      expect(service.updateSkill).toHaveBeenCalledWith(
        "user-123",
        "sk-1",
        skillDto,
      );
    });

    it("should delegate deleteSkill with user-123", async () => {
      await controller.deleteSkill(mockUserReq, "sk-1");
      expect(service.deleteSkill).toHaveBeenCalledWith("user-123", "sk-1");
    });
  });

  describe("Experience endpoints", () => {
    it("should delegate addExperience with user-123", async () => {
      const expDto = {
        jobTitle: "Lead Dev",
        companyName: "Google",
      } as unknown as ExperienceItemDto;
      await controller.addExperience(mockUserReq, expDto);
      expect(service.addExperience).toHaveBeenCalledWith("user-123", expDto);
    });

    it("should delegate deleteExperience with user-123", async () => {
      await controller.deleteExperience(mockUserReq, "exp-1");
      expect(service.deleteExperience).toHaveBeenCalledWith(
        "user-123",
        "exp-1",
      );
    });
  });
});
