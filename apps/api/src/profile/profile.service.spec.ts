import { Test, TestingModule } from "@nestjs/testing";
import { ForbiddenException, NotFoundException } from "@nestjs/common";
import { ProfileService } from "./profile.service";
import { PrismaService } from "../prisma/prisma.service";
import {
  User,
  Profile,
  UserSkill,
  Education,
  Experience,
  Project,
  Certification,
  Language,
  SocialLink,
} from "@prisma/client";

describe("ProfileService", () => {
  let service: ProfileService;
  let prisma: PrismaService;

  const mockProfile = {
    id: "prof-1",
    userId: "user-123",
    headline: "Senior Software Engineer",
    summary: "Passionate developer with 8+ years experience",
    phone: "+1234567890",
    dateOfBirth: new Date("1995-05-15"),
    gender: "male",
    nationality: "US",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    currentRole: "Lead Architect",
    yearsOfExperience: 8,
    preferredRole: "Staff Engineer",
    preferredLocation: "San Francisco, CA",
    workPreference: "remote",
    availability: "immediately",
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
  } as unknown as Profile;

  const mockUser = {
    id: "user-123",
    email: "alex@example.com",
    fullName: "Alex Rivera",
    profilePhotoUrl: "https://example.com/avatar.jpg",
    subscriptionPlan: "FREE",
    emailVerified: true,
    createdAt: new Date("2025-01-01"),
    updatedAt: new Date("2025-01-01"),
    profile: mockProfile,
    userSkills: [],
    education: [],
    experience: [],
    projects: [],
    certifications: [],
    languages: [],
    socialLinks: [],
    careerPreference: null,
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        ProfileService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            profile: {
              findUnique: jest.fn(),
              create: jest.fn(),
              upsert: jest.fn(),
            },
            userSkill: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            skill: {
              upsert: jest.fn(),
            },
            education: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
              delete: jest.fn(),
            },
            experience: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            project: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            certification: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            language: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            socialLink: {
              findMany: jest.fn().mockResolvedValue([]),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            careerPreference: {
              findUnique: jest.fn().mockResolvedValue(null),
              upsert: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = testingModule.get<ProfileService>(ProfileService);
    prisma = testingModule.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should throw NotFoundException if user does not exist", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue(null);

      await expect(service.getProfile("non-existent")).rejects.toThrow(
        NotFoundException,
      );
    });

    it("should return assembled profile with completion percentage", async () => {
      jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(mockUser as unknown as User);

      const result = await service.getProfile("user-123");

      expect(result).toHaveProperty("profile");
      expect(result.profile.userId).toBe("user-123");
      expect(result.profile.career.headline).toBe("Senior Software Engineer");
      expect(result.profile.completion.percentage).toBeGreaterThan(0);
      expect(result.skills).toEqual([]);
      expect(result.education).toEqual([]);
      expect(result.experience).toEqual([]);
      expect(result.projects).toEqual([]);
    });

    it("should auto-create profile shell if user exists but has no profile record yet", async () => {
      jest.spyOn(prisma.user, "findUnique").mockResolvedValue({
        ...mockUser,
        profile: null,
      } as unknown as User);
      jest.spyOn(prisma.profile, "create").mockResolvedValue({
        id: "new-prof",
        userId: "user-123",
        headline: null,
        summary: null,
        phone: null,
        dateOfBirth: null,
        gender: null,
        nationality: null,
        city: null,
        state: null,
        country: null,
        currentRole: null,
        yearsOfExperience: 0,
        preferredRole: null,
        preferredLocation: null,
        workPreference: null,
        availability: "immediate",
        createdAt: new Date(),
        updatedAt: new Date(),
      } as unknown as Profile);

      const result = await service.getProfile("user-123");
      expect(prisma.profile.create).toHaveBeenCalledWith({
        data: { userId: "user-123" },
      });
      expect(result.profile.userId).toBe("user-123");
    });
  });

  describe("updateProfile", () => {
    it("should update user names and upsert profile data", async () => {
      jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(mockUser as unknown as User);
      jest.spyOn(prisma.user, "update").mockResolvedValue({
        ...mockUser,
        fullName: "Alexander Rivera",
      } as unknown as User);
      jest.spyOn(prisma.profile, "upsert").mockResolvedValue(mockProfile);
      jest.spyOn(prisma.profile, "findUnique").mockResolvedValue(mockProfile);

      const result = await service.updateProfile("user-123", {
        personal: { firstName: "Alexander", lastName: "Rivera" },
        career: { headline: "Staff Engineer", currentRole: "Lead" },
        contact: { phone: "+1987654321", city: "Seattle" },
      });

      expect(prisma.user.update).toHaveBeenCalled();
      expect(prisma.profile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId: "user-123" },
        }),
      );
      expect(result).toHaveProperty("profile");
    });
  });

  describe("patchProfile", () => {
    it("should selectively patch fields without overwriting unmodified fields", async () => {
      jest
        .spyOn(prisma.user, "findUnique")
        .mockResolvedValue(mockUser as unknown as User);
      jest.spyOn(prisma.profile, "upsert").mockResolvedValue(mockProfile);
      jest.spyOn(prisma.profile, "findUnique").mockResolvedValue(mockProfile);

      await service.patchProfile("user-123", {
        career: { headline: "New Headline Only" },
      });

      expect(prisma.profile.upsert).toHaveBeenCalledWith(
        expect.objectContaining({
          update: expect.objectContaining({ headline: "New Headline Only" }),
        }),
      );
    });
  });

  describe("Ownership Isolation & Authorization", () => {
    it("should throw ForbiddenException if user tries to update another user's skill", async () => {
      jest.spyOn(prisma.userSkill, "findUnique").mockResolvedValue({
        id: "skill-1",
        userId: "different-user-999",
      } as unknown as UserSkill);

      await expect(
        service.updateSkill("user-123", "skill-1", { level: "expert" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to delete another user's skill", async () => {
      jest.spyOn(prisma.userSkill, "findUnique").mockResolvedValue({
        id: "skill-1",
        userId: "different-user-999",
      } as unknown as UserSkill);

      await expect(service.deleteSkill("user-123", "skill-1")).rejects.toThrow(
        ForbiddenException,
      );
    });

    it("should throw ForbiddenException if user tries to update another user's experience", async () => {
      jest.spyOn(prisma.experience, "findUnique").mockResolvedValue({
        id: "exp-1",
        userId: "different-user-999",
      } as unknown as Experience);

      await expect(
        service.updateExperience("user-123", "exp-1", { jobTitle: "Lead" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to delete another user's education", async () => {
      jest.spyOn(prisma.education, "findUnique").mockResolvedValue({
        id: "edu-1",
        userId: "different-user-999",
      } as unknown as Education);

      await expect(
        service.deleteEducation("user-123", "edu-1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to update another user's project", async () => {
      jest.spyOn(prisma.project, "findUnique").mockResolvedValue({
        id: "proj-1",
        userId: "different-user-999",
      } as unknown as Project);

      await expect(
        service.updateProject("user-123", "proj-1", { title: "Hacked" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to update another user's certification", async () => {
      jest.spyOn(prisma.certification, "findUnique").mockResolvedValue({
        id: "cert-1",
        userId: "different-user-999",
      } as unknown as Certification);

      await expect(
        service.updateCertification("user-123", "cert-1", { name: "Fake" }),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to delete another user's language", async () => {
      jest.spyOn(prisma.language, "findUnique").mockResolvedValue({
        id: "lang-1",
        userId: "different-user-999",
      } as unknown as Language);

      await expect(
        service.deleteLanguage("user-123", "lang-1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw ForbiddenException if user tries to delete another user's social link", async () => {
      jest.spyOn(prisma.socialLink, "findUnique").mockResolvedValue({
        id: "soc-1",
        userId: "different-user-999",
      } as unknown as SocialLink);

      await expect(
        service.deleteSocialLink("user-123", "soc-1"),
      ).rejects.toThrow(ForbiddenException);
    });

    it("should throw NotFoundException if entity does not exist", async () => {
      jest.spyOn(prisma.userSkill, "findUnique").mockResolvedValue(null);

      await expect(
        service.updateSkill("user-123", "non-existent-skill", {
          level: "expert",
        }),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
