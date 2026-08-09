import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

describe("AuthController", () => {
  let authController: AuthController;
  let authService: AuthService;

  const mockAuthResponse = {
    user: {
      id: "user-uuid-1",
      email: "test@example.com",
      fullName: "Test User",
      profilePhotoUrl: null,
      subscriptionPlan: "FREE",
      emailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    accessToken: "mock-access-token",
    refreshToken: "mock-refresh-token",
  };

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            register: jest.fn().mockResolvedValue(mockAuthResponse),
            login: jest.fn().mockResolvedValue(mockAuthResponse),
          },
        },
      ],
    }).compile();

    authController = testingModule.get<AuthController>(AuthController);
    authService = testingModule.get<AuthService>(AuthService);
  });

  describe("register", () => {
    it("should call authService.register and return the result", async () => {
      const registerDto = {
        email: "test@example.com",
        password: "password123",
        fullName: "Test User",
      };

      const result = await authController.register(registerDto);

      expect(authService.register).toHaveBeenCalledWith(registerDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });

  describe("login", () => {
    it("should call authService.login and return the result", async () => {
      const loginDto = {
        email: "test@example.com",
        password: "password123",
      };

      const result = await authController.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(mockAuthResponse);
    });
  });
});
