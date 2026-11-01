import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Prisma, SubscriptionPlan } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { PrismaService } from "../prisma/prisma.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

interface MockPrisma {
  refreshToken: {
    create: jest.Mock;
    findUnique: jest.Mock;
    update: jest.Mock;
    updateMany: jest.Mock;
  };
  $transaction: jest.Mock;
}

interface MockJwt {
  signAsync: jest.Mock;
  verifyAsync: jest.Mock;
}

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;
  let prismaMock: MockPrisma;
  let jwtMock: MockJwt;

  const mockUser = {
    id: "user-uuid-1",
    email: "test@example.com",
    fullName: "Test User",
    passwordHash: "hashedPassword123",
    profilePhotoUrl: null,
    subscriptionPlan: SubscriptionPlan.FREE,
    emailVerified: false,
    profile: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            createUser: jest.fn(),
            findById: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("mock-jwt-token"),
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            refreshToken: {
              create: jest.fn().mockResolvedValue({ id: "rt-1" }),
              findUnique: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
            $transaction: jest.fn((callback) =>
              callback({
                $queryRaw: jest.fn(),
                refreshToken: {
                  create: jest.fn().mockResolvedValue({ id: "rt-1" }),
                  update: jest.fn(),
                  updateMany: jest.fn(),
                },
              }),
            ),
          },
        },
      ],
    }).compile();

    authService = testingModule.get<AuthService>(AuthService);
    usersService = testingModule.get<UsersService>(UsersService);
    prismaMock = testingModule.get(PrismaService);
    jwtMock = testingModule.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should successfully register a new user and return tokens", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");
      jest.spyOn(usersService, "createUser").mockResolvedValue(mockUser);

      const result = await authService.register({
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(usersService.createUser).toHaveBeenCalledWith({
        email: "test@example.com",
        fullName: "Test User",
        passwordHash: "hashedPassword123",
      });
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.user?.email).toBe("test@example.com");
      expect(result.accessToken).toBe("mock-jwt-token");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.refreshToken.length).toBe(64);
    });

    it("should throw ConflictException if user email already exists", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValue(mockUser);

      await expect(
        authService.register({
          email: "test@example.com",
          password: "password123",
          fullName: "Test User",
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe("login", () => {
    it("should successfully login user with valid credentials", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await authService.login({
        email: "test@example.com",
        password: "password123",
      });

      expect(usersService.findByEmail).toHaveBeenCalledWith("test@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith(
        "password123",
        "hashedPassword123",
      );
      expect(result.user).not.toHaveProperty("passwordHash");
      expect(result.accessToken).toBe("mock-jwt-token");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.refreshToken.length).toBe(64);
    });

    it("should throw UnauthorizedException if user is not found", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValue(null);

      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "password123",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it("should throw UnauthorizedException if password does not match", async () => {
      jest.spyOn(usersService, "findByEmail").mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe("refreshFromToken", () => {
    it("should rotate valid database-backed refresh token", async () => {
      const existingToken = {
        id: "rt-1",
        userId: "user-uuid-1",
        familyId: "family-1",
        isRevoked: false,
        expiresAt: new Date(Date.now() + 1000000),
      };

      prismaMock.refreshToken.findUnique.mockResolvedValue(existingToken);
      prismaMock.$transaction.mockImplementation(
        async (
          cb: (tx: {
            $queryRaw: jest.Mock;
            refreshToken: {
              update: jest.Mock;
              create: jest.Mock;
              updateMany: jest.Mock;
            };
          }) => Promise<unknown>,
        ) =>
          cb({
            $queryRaw: jest.fn().mockResolvedValue([existingToken]),
            refreshToken: {
              update: jest.fn().mockResolvedValue({}),
              create: jest.fn().mockResolvedValue({ id: "rt-2" }),
              updateMany: jest.fn(),
            },
          }),
      );
      jest.spyOn(usersService, "findById").mockResolvedValue(mockUser);

      const result = await authService.refreshFromToken("valid-raw-token");

      expect(result.accessToken).toBe("mock-jwt-token");
      expect(typeof result.refreshToken).toBe("string");
      expect(result.refreshToken.length).toBe(64);
      expect(result.user?.email).toBe("test@example.com");
    });

    it("should commit family revocation and throw UnauthorizedException when replay is detected", async () => {
      const revokedToken = {
        id: "rt-1",
        userId: "user-uuid-1",
        familyId: "family-1",
        isRevoked: true,
        expiresAt: new Date(Date.now() + 1000000),
      };

      prismaMock.refreshToken.findUnique.mockResolvedValue(revokedToken);
      const updateManyMock = jest.fn().mockResolvedValue({ count: 2 });
      prismaMock.$transaction.mockImplementation(
        async (
          cb: (tx: {
            $queryRaw: jest.Mock;
            refreshToken: {
              updateMany: jest.Mock;
              update: jest.Mock;
              create: jest.Mock;
            };
          }) => Promise<unknown>,
        ) =>
          cb({
            $queryRaw: jest.fn().mockResolvedValue([revokedToken]),
            refreshToken: {
              updateMany: updateManyMock,
              update: jest.fn(),
              create: jest.fn(),
            },
          }),
      );

      await expect(
        authService.refreshFromToken("replayed-token"),
      ).rejects.toThrow("Session terminated due to token reuse detection");

      // Verify family revocation was committed in transaction
      expect(updateManyMock).toHaveBeenCalledWith({
        where: { familyId: "family-1" },
        data: { isRevoked: true },
      });
    });

    it("should migrate legacy stateless JWT and burn its hash to prevent reuse", async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);
      jwtMock.verifyAsync.mockResolvedValue({
        sub: "user-uuid-1",
        email: "test@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      jest.spyOn(usersService, "findById").mockResolvedValue(mockUser);

      const createMock = jest.fn().mockResolvedValue({ id: "rt-new" });
      prismaMock.$transaction.mockImplementation(
        async (
          cb: (tx: {
            refreshToken: {
              create: jest.Mock;
            };
          }) => Promise<unknown>,
        ) =>
          cb({
            refreshToken: {
              create: createMock,
            },
          }),
      );

      const result = await authService.refreshFromToken("legacy.jwt.token");

      expect(result.accessToken).toBe("mock-jwt-token");
      expect(typeof result.refreshToken).toBe("string");
      // Expect 2 creates: 1 to burn the legacy token, 1 to mint the new successor token
      expect(createMock).toHaveBeenCalledTimes(2);
      expect(createMock).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          data: expect.objectContaining({
            isRevoked: true,
          }),
        }),
      );
      expect(createMock).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          data: expect.objectContaining({
            isRevoked: false,
          }),
        }),
      );
    });

    it("should handle concurrent legacy migrations gracefully without HTTP 500 when P2002 occurs", async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);
      jwtMock.verifyAsync.mockResolvedValue({
        sub: "user-uuid-1",
        email: "test@example.com",
        exp: Math.floor(Date.now() / 1000) + 3600,
      });
      jest.spyOn(usersService, "findById").mockResolvedValue(mockUser);

      // Simulate concurrent insert collision (P2002 unique constraint failed)
      const p2002Error = new Prisma.PrismaClientKnownRequestError(
        "Unique constraint failed on the fields: (`tokenHash`)",
        {
          code: "P2002",
          clientVersion: "5.0.0",
        },
      );

      prismaMock.$transaction.mockRejectedValue(p2002Error);

      await expect(
        authService.refreshFromToken("legacy.jwt.token"),
      ).rejects.toThrow("Refresh token has already been migrated");
    });

    it("should safely reject stateless migration if cutoff has passed or is unconfigured in production", async () => {
      prismaMock.refreshToken.findUnique.mockResolvedValue(null);

      // Temporarily mock production environment
      const originalEnv = process.env.NODE_ENV;
      const originalCutoff = process.env.STATELESS_MIGRATION_CUTOFF;
      const originalDeploy = process.env.DEPLOYMENT_TIMESTAMP;

      delete process.env.STATELESS_MIGRATION_CUTOFF;
      delete process.env.DEPLOYMENT_TIMESTAMP;
      process.env.NODE_ENV = "production";

      try {
        await expect(
          authService.refreshFromToken("unconfigured.legacy.jwt"),
        ).rejects.toThrow(
          "Stateless session expired or migration window closed",
        );
      } finally {
        process.env.NODE_ENV = originalEnv;
        if (originalCutoff)
          process.env.STATELESS_MIGRATION_CUTOFF = originalCutoff;
        if (originalDeploy) process.env.DEPLOYMENT_TIMESTAMP = originalDeploy;
      }
    });
  });

  describe("getStatelessMigrationCutoff", () => {
    const originalEnv = process.env;

    beforeEach(() => {
      process.env = { ...originalEnv };
    });

    afterAll(() => {
      process.env = originalEnv;
    });

    it("should calculate cutoff as exactly 7 days from DEPLOYMENT_TIMESTAMP", () => {
      const deployTime = "2026-11-01T12:00:00.000Z";
      process.env.DEPLOYMENT_TIMESTAMP = deployTime;
      delete process.env.STATELESS_MIGRATION_CUTOFF;

      const cutoff = authService.getStatelessMigrationCutoff();
      expect(cutoff).not.toBeNull();
      const expected = new Date(
        new Date(deployTime).getTime() + 7 * 24 * 60 * 60 * 1000,
      );
      expect(cutoff?.getTime()).toBe(expected.getTime());
    });

    it("should parse explicit STATELESS_MIGRATION_CUTOFF in UTC", () => {
      const explicitCutoff = "2026-11-15T00:00:00.000Z";
      process.env.STATELESS_MIGRATION_CUTOFF = explicitCutoff;

      const cutoff = authService.getStatelessMigrationCutoff();
      expect(cutoff?.toISOString()).toBe(explicitCutoff);
    });

    it("should return null in production if neither variable is configured", () => {
      process.env.NODE_ENV = "production";
      delete process.env.STATELESS_MIGRATION_CUTOFF;
      delete process.env.DEPLOYMENT_TIMESTAMP;

      const cutoff = authService.getStatelessMigrationCutoff();
      expect(cutoff).toBeNull();
    });
  });

  describe("revokeToken", () => {
    it("should mark token as revoked in database", async () => {
      prismaMock.refreshToken.updateMany.mockResolvedValue({ count: 1 });

      await authService.revokeToken("logout-raw-token");

      expect(prismaMock.refreshToken.updateMany).toHaveBeenCalledWith({
        where: { tokenHash: expect.any(String) },
        data: { isRevoked: true },
      });
    });
  });
});
