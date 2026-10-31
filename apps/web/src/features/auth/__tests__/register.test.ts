import { registerSchema } from "../schemas/auth.schema";
import { authService } from "../services/auth.service";
import { apiClient } from "@/lib/api-client";

// Mock apiClient to verify the request payload sent by authService
jest.mock("@/lib/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
  },
  ApiError: class ApiError extends Error {
    constructor(
      public readonly status: number,
      message: string,
      public readonly data?: unknown,
    ) {
      super(message);
      this.name = "ApiError";
    }
  },
}));

describe("Frontend Registration Form & Schema Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Validation Schema (registerSchema)", () => {
    it("fails when full name is missing or less than 2 characters", () => {
      // Empty string
      const resEmpty = registerSchema.safeParse({
        fullName: "",
        email: "user@example.com",
        password: "ValidPassword123!",
        confirmPassword: "ValidPassword123!",
      });
      expect(resEmpty.success).toBe(false);
      if (!resEmpty.success) {
        const nameError = resEmpty.error.errors.find(
          (e) => e.path[0] === "fullName",
        );
        expect(nameError?.message).toBe(
          "Full name must be at least 2 characters",
        );
      }

      // Single character
      const resSingle = registerSchema.safeParse({
        fullName: "A",
        email: "user@example.com",
        password: "ValidPassword123!",
        confirmPassword: "ValidPassword123!",
      });
      expect(resSingle.success).toBe(false);

      // Undefined
      const resMissing = registerSchema.safeParse({
        email: "user@example.com",
        password: "ValidPassword123!",
        confirmPassword: "ValidPassword123!",
      });
      expect(resMissing.success).toBe(false);
    });

    it("fails when email is invalid", () => {
      const invalidEmails = [
        "notanemail",
        "missingatsign.com",
        "@nodomain.com",
        "user@",
        "",
      ];

      for (const email of invalidEmails) {
        const result = registerSchema.safeParse({
          fullName: "Jane Doe",
          email,
          password: "ValidPassword123!",
          confirmPassword: "ValidPassword123!",
        });
        expect(result.success).toBe(false);
        if (!result.success) {
          const emailError = result.error.errors.find(
            (e) => e.path[0] === "email",
          );
          expect(emailError).toBeDefined();
        }
      }
    });

    it("fails when password and confirmPassword mismatch", () => {
      const result = registerSchema.safeParse({
        fullName: "Jane Doe",
        email: "jane@example.com",
        password: "Password123!",
        confirmPassword: "DifferentPassword456!",
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const mismatchError = result.error.errors.find(
          (e) => e.path[0] === "confirmPassword",
        );
        expect(mismatchError?.message).toBe("Passwords do not match");
      }
    });

    it("passes with valid registration data", () => {
      const validData = {
        fullName: "Jane Doe",
        email: "jane.doe@example.com",
        password: "StrongPassword123!",
        confirmPassword: "StrongPassword123!",
      };
      const result = registerSchema.safeParse(validData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.fullName).toBe("Jane Doe");
        expect(result.data.email).toBe("jane.doe@example.com");
      }
    });
  });

  describe("Registration Service Submission (authService.register)", () => {
    it("successfully sends fullName along with email and password in the payload", async () => {
      const mockUser = {
        id: "usr-123",
        email: "jane@example.com",
        fullName: "Jane Doe",
        subscriptionPlan: "FREE",
        emailVerified: false,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ user: mockUser });

      const result = await authService.register(
        "jane@example.com",
        "StrongPassword123!",
        "Jane Doe",
      );

      // Verify apiClient.post was called with the exact expected payload
      expect(apiClient.post).toHaveBeenCalledTimes(1);
      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "jane@example.com",
        password: "StrongPassword123!",
        fullName: "Jane Doe",
      });

      expect(result).toEqual(mockUser);
    });

    it("trims whitespace from fullName before sending", async () => {
      const mockUser = {
        id: "usr-456",
        email: "bob@example.com",
        fullName: "Bob Builder",
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ user: mockUser });

      await authService.register(
        "bob@example.com",
        "StrongPassword123!",
        "   Bob Builder   ",
      );

      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "bob@example.com",
        password: "StrongPassword123!",
        fullName: "Bob Builder",
      });
    });

    it("provides fallback derived fullName when not passed, preventing empty string", async () => {
      const mockUser = {
        id: "usr-789",
        email: "alex@example.com",
        fullName: "alex",
      };

      (apiClient.post as jest.Mock).mockResolvedValue({ user: mockUser });

      await authService.register("alex@example.com", "StrongPassword123!");

      expect(apiClient.post).toHaveBeenCalledWith("/auth/register", {
        email: "alex@example.com",
        password: "StrongPassword123!",
        fullName: "alex",
      });
    });
  });
});
