import { Test, TestingModule } from "@nestjs/testing";
import { ConflictException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { SubscriptionPlan, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
  compare: jest.fn(),
}));

describe("AuthService", () => {
  let authService: AuthService;
  let usersService: UsersService;

  const mockUser: User = {
    id: "user-uuid-1",
    email: "test@example.com",
    fullName: "Test User",
    passwordHash: "hashedPassword123",
    profilePhotoUrl: null,
    subscriptionPlan: SubscriptionPlan.FREE,
    emailVerified: false,
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
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue("mock-jwt-token"),
          },
        },
      ],
    }).compile();

    authService = testingModule.get<AuthService>(AuthService);
    usersService = testingModule.get<UsersService>(UsersService);
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
      expect(result.user.email).toBe("test@example.com");
      expect(result.accessToken).toBe("mock-jwt-token");
      expect(result.refreshToken).toBe("mock-jwt-token");
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
      expect(result.refreshToken).toBe("mock-jwt-token");
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
});
