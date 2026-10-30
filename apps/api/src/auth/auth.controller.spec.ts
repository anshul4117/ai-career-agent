import { Test, TestingModule } from "@nestjs/testing";
import type { Request, Response } from "express";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockUser = {
    id: "user-uuid-1",
    email: "test@example.com",
    fullName: "Test User",
    profilePhotoUrl: null,
    subscriptionPlan: "FREE",
    emailVerified: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockAuthResponse = {
    user: mockUser,
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  /** Build a minimal mock express Response that chains cookie/json calls */
  function mockRes() {
    const res = {
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      json: jest.fn(),
    } as unknown as Response;
    (res.cookie as jest.Mock).mockReturnValue(res);
    (res.clearCookie as jest.Mock).mockReturnValue(res);
    (res.json as jest.Mock).mockReturnValue(res);
    return res;
  }

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResponse),
            login: jest.fn().mockResolvedValue(mockAuthResponse),
            refreshFromToken: jest
              .fn()
              .mockResolvedValue({ user: mockUser, accessToken: "new-token" }),
          },
        },
      ],
    }).compile();

    authController = testingModule.get<AuthController>(AuthController);
    authService = testingModule.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should call authService.register and set cookies", async () => {
      const registerDto = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };
      const res = mockRes();

      await authController.register(registerDto, res);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe("login", () => {
    it("should call authService.login and set cookies", async () => {
      const loginDto = {
        email: "test@example.com",
        password: "password123",
      };
      const res = mockRes();

      await authController.login(loginDto, res);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe("refresh", () => {
    it("should refresh from cookie when present and set fresh access cookie", async () => {
      const mockReq = {
        cookies: { "aca-refresh-token": "valid-refresh-cookie" },
      } as unknown as Request;
      const res = mockRes();

      await authController.refresh(mockReq, {}, res);

      expect(authService.refreshFromToken).toHaveBeenCalledWith(
        "valid-refresh-cookie",
      );
      expect(res.cookie).toHaveBeenCalledWith(
        "aca-access-token",
        "new-token",
        expect.objectContaining({ httpOnly: true, maxAge: 15 * 60 * 1000 }),
      );
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });

    it("should fall back to body refreshToken if cookie is absent", async () => {
      const mockReq = { cookies: {} } as unknown as Request;
      const res = mockRes();

      await authController.refresh(
        mockReq,
        { refreshToken: "valid-body-token" },
        res,
      );

      expect(authService.refreshFromToken).toHaveBeenCalledWith(
        "valid-body-token",
      );
      expect(res.json).toHaveBeenCalledWith({ user: mockUser });
    });
  });

  describe("logout", () => {
    it("should clear all access, refresh, and session cookies with maxAge 0", async () => {
      const res = mockRes();

      await authController.logout(res);

      // Verify clearance of HttpOnly access token
      expect(res.clearCookie).toHaveBeenCalledWith(
        "aca-access-token",
        expect.objectContaining({ httpOnly: true, maxAge: 0, path: "/" }),
      );
      // Verify clearance of HttpOnly refresh token
      expect(res.clearCookie).toHaveBeenCalledWith(
        "aca-refresh-token",
        expect.objectContaining({ httpOnly: true, maxAge: 0, path: "/" }),
      );
      // Verify clearance of public session cookie
      expect(res.cookie).toHaveBeenCalledWith(
        "aca-session",
        "",
        expect.objectContaining({ httpOnly: false, maxAge: 0, path: "/" }),
      );
      // Verify clearance of public profile-completed cookie
      expect(res.cookie).toHaveBeenCalledWith(
        "aca-profile-completed",
        "",
        expect.objectContaining({ httpOnly: false, maxAge: 0, path: "/" }),
      );
      expect(res.json).toHaveBeenCalledWith({
        message: "Logged out successfully",
      });
    });
  });
});
