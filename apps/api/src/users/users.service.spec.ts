import { Test, TestingModule } from "@nestjs/testing";
import { NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { PrismaService } from "../prisma/prisma.service";

describe("UsersService", () => {
  let service: UsersService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    resume: {
      findMany: jest.fn(),
    },
    resumeVersion: {
      findMany: jest.fn(),
    },
    jobApplication: {
      findMany: jest.fn(),
    },
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrisma,
        },
      ],
    }).compile();

    service = testingModule.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe("anonymizeAndDeleteAccount", () => {
    it("should throw NotFoundException if user does not exist", async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(
        service.anonymizeAndDeleteAccount("missing-user"),
      ).rejects.toThrow(NotFoundException);
    });

    it("should gather file URLs before transaction, sanitize DB, and dispatch storage cleanup after commit", async () => {
      const userId = "target-user-1";
      mockPrisma.user.findUnique.mockResolvedValue({
        id: userId,
        email: "test@example.com",
      });
      mockPrisma.resume.findMany.mockResolvedValue([
        { fileUrl: "https://storage.com/resume1.pdf" },
      ]);
      mockPrisma.resumeVersion.findMany.mockResolvedValue([
        { fileUrl: "https://storage.com/v1.pdf" },
      ]);
      mockPrisma.jobApplication.findMany.mockResolvedValue([
        { immutableFileKey: "storage-key-app-1" },
      ]);

      const executeRawMock = jest.fn().mockResolvedValue(1);
      const userDeleteMock = jest.fn().mockResolvedValue({ id: userId });

      mockPrisma.$transaction.mockImplementation(
        async (
          cb: (tx: {
            $executeRaw: jest.Mock;
            user: { delete: jest.Mock };
          }) => Promise<unknown>,
        ) => {
          return cb({
            $executeRaw: executeRawMock,
            user: {
              delete: userDeleteMock,
            },
          });
        },
      );

      const dispatchSpy = jest
        .spyOn(
          service as unknown as {
            dispatchStorageCleanup: (keys: string[]) => Promise<void>;
          },
          "dispatchStorageCleanup",
        )
        .mockResolvedValue();

      await service.anonymizeAndDeleteAccount(userId);

      // Verify DB transaction executed sanitization and user deletion
      expect(mockPrisma.$transaction).toHaveBeenCalled();
      expect(executeRawMock).toHaveBeenCalledTimes(2); // 1 for status history, 1 for job applications
      expect(userDeleteMock).toHaveBeenCalledWith({ where: { id: userId } });

      // Verify post-commit cleanup dispatched for all collected files
      expect(dispatchSpy).toHaveBeenCalledWith(
        expect.arrayContaining([
          "https://storage.com/resume1.pdf",
          "https://storage.com/v1.pdf",
          "storage-key-app-1",
        ]),
      );
    });
  });

  describe("createUser", () => {
    it("should create user and attach an initial profile record", async () => {
      const createDto = {
        email: "new@example.com",
        fullName: "New Candidate",
        passwordHash: "hash-xyz",
      };

      const mockCreated = {
        id: "new-user-id",
        ...createDto,
        profile: { id: "new-prof-id", userId: "new-user-id" },
      };

      mockPrisma.user.create.mockResolvedValue(mockCreated);

      const result = await service.createUser(createDto);

      expect(mockPrisma.user.create).toHaveBeenCalledWith({
        data: {
          email: createDto.email,
          fullName: createDto.fullName,
          passwordHash: createDto.passwordHash,
          profile: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });
      expect(result).toEqual(mockCreated);
    });
  });

  describe("findByEmail and findById", () => {
    it("should query user by email including profile relation", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-1",
        email: "test@example.com",
      });

      const result = await service.findByEmail("test@example.com");

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: "test@example.com" },
        include: { profile: true },
      });
      expect(result?.id).toBe("u-1");
    });

    it("should query user by id including profile relation", async () => {
      mockPrisma.user.findUnique.mockResolvedValue({
        id: "u-2",
        email: "id@example.com",
      });

      const result = await service.findById("u-2");

      expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
        where: { id: "u-2" },
        include: { profile: true },
      });
      expect(result?.id).toBe("u-2");
    });
  });
});
