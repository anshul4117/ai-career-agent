import { Test, TestingModule } from "@nestjs/testing";
import type { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";

jest.mock("bcrypt", () => ({
  compare: jest.fn(),
}));

describe("UsersController", () => {
  let controller: UsersController;

  const mockUsersService = {
    findById: jest.fn(),
    anonymizeAndDeleteAccount: jest.fn(),
  };

  const mockResponse = {
    clearCookie: jest.fn(),
  } as unknown as Response;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = testingModule.get<UsersController>(UsersController);
    jest.clearAllMocks();
  });

  describe("deleteAccount", () => {
    it("should throw UnauthorizedException if password is missing for local user", async () => {
      mockUsersService.findById.mockResolvedValue({
        id: "user-1",
        passwordHash: "hashed-pwd",
      });

      const req = {
        user: { id: "user-1", email: "test@example.com" },
      } as unknown as Request & { user: { id: string; email: string } };

      await expect(
        controller.deleteAccount(
          req,
          { confirmPhrase: "DELETE MY ACCOUNT" },
          mockResponse,
        ),
      ).rejects.toThrow("Password confirmation is required");
    });

    it("should throw UnauthorizedException if password does not match", async () => {
      mockUsersService.findById.mockResolvedValue({
        id: "user-1",
        passwordHash: "hashed-pwd",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const req = {
        user: { id: "user-1", email: "test@example.com" },
      } as unknown as Request & { user: { id: string; email: string } };

      await expect(
        controller.deleteAccount(
          req,
          { password: "wrong-password", confirmPhrase: "DELETE MY ACCOUNT" },
          mockResponse,
        ),
      ).rejects.toThrow("Invalid password");
    });

    it("should throw UnauthorizedException if confirmPhrase is invalid", async () => {
      mockUsersService.findById.mockResolvedValue({
        id: "user-1",
        passwordHash: "hashed-pwd",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const req = {
        user: { id: "user-1", email: "test@example.com" },
      } as unknown as Request & { user: { id: string; email: string } };

      await expect(
        controller.deleteAccount(
          req,
          { password: "correct-password", confirmPhrase: "no" },
          mockResponse,
        ),
      ).rejects.toThrow("Confirmation phrase mismatch");
    });

    it("should successfully anonymize, delete account, and clear refresh cookie when credentials valid", async () => {
      mockUsersService.findById.mockResolvedValue({
        id: "user-1",
        passwordHash: "hashed-pwd",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockUsersService.anonymizeAndDeleteAccount.mockResolvedValue(undefined);

      const req = {
        user: { id: "user-1", email: "test@example.com" },
      } as unknown as Request & { user: { id: string; email: string } };

      const result = await controller.deleteAccount(
        req,
        { password: "correct-password", confirmPhrase: "DELETE MY ACCOUNT" },
        mockResponse,
      );

      expect(mockUsersService.anonymizeAndDeleteAccount).toHaveBeenCalledWith(
        "user-1",
      );
      expect(mockResponse.clearCookie).toHaveBeenCalledWith(
        "aca-refresh-token",
        expect.any(Object),
      );
      expect(result.success).toBe(true);
    });
  });
});
