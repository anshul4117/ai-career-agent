import { authService, normalizeAuthUser } from "../services/auth.service";
import { apiClient } from "@/lib/api-client";

jest.mock("@/lib/api-client", () => ({
  apiClient: {
    post: jest.fn(),
    get: jest.fn(),
    put: jest.fn(),
  },
}));

describe("Auth Service & Normalization Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    let cookies: string[] = [];
    (globalThis as unknown as { document?: { cookie: string } }).document = {
      get cookie() {
        return cookies.join("; ");
      },
      set cookie(val: string) {
        const pair = val.split(";")[0];
        const key = pair.split("=")[0];
        cookies = cookies.filter((c) => !c.startsWith(`${key}=`));
        cookies.push(pair);
      },
    };
  });

  afterEach(() => {
    delete (globalThis as unknown as { document?: { cookie: string } })
      .document;
  });

  describe("normalizeAuthUser", () => {
    it("correctly splits fullName into firstName and lastName", () => {
      const normalized = normalizeAuthUser({
        id: "u-1",
        email: "test@example.com",
        fullName: "Sarah Connor",
      });

      expect(normalized.firstName).toBe("Sarah");
      expect(normalized.lastName).toBe("Connor");
      expect(normalized.name).toBe("Sarah Connor");
      expect(normalized.profileCompleted).toBe(false);
    });

    it("handles single-word names gracefully", () => {
      const normalized = normalizeAuthUser({
        id: "u-2",
        email: "cher@example.com",
        fullName: "Cher",
      });

      expect(normalized.firstName).toBe("Cher");
      expect(normalized.lastName).toBe("");
      expect(normalized.name).toBe("Cher");
    });

    it("maps profileCompleted and profilePhotoUrl properly", () => {
      const normalized = normalizeAuthUser({
        id: "u-3",
        email: "bob@example.com",
        fullName: "Bob Builder",
        profilePhotoUrl: "https://photos.com/bob.jpg",
        emailVerified: true,
        profileCompleted: true,
      });

      expect(normalized.profileImage).toBe("https://photos.com/bob.jpg");
      expect(normalized.verified).toBe(true);
      expect(normalized.profileCompleted).toBe(true);
    });
  });

  describe("authService.login", () => {
    it("posts credentials and updates public session cookies with profile completion state", async () => {
      const mockBackendUser = {
        id: "u-login",
        email: "candidate@example.com",
        fullName: "Alex Mercer",
        profileCompleted: true,
      };

      (apiClient.post as jest.Mock).mockResolvedValue({
        user: mockBackendUser,
      });

      const user = await authService.login(
        "candidate@example.com",
        "SecretPass123!",
      );

      expect(apiClient.post).toHaveBeenCalledWith("/auth/login", {
        email: "candidate@example.com",
        password: "SecretPass123!",
      });
      expect(user.firstName).toBe("Alex");
      expect(user.lastName).toBe("Mercer");
      expect(user.profileCompleted).toBe(true);
      expect(document.cookie).toContain("aca-session=active");
      expect(document.cookie).toContain("aca-profile-completed=true");
    });
  });

  describe("authService.completeProfile", () => {
    it("persists onboarding updates to /profile/me and marks profile completed", async () => {
      const mockUpdated = {
        id: "u-complete",
        email: "onboarding@example.com",
        fullName: "Morgan Freeman",
        headline: "Actor & Narrator",
        preferredRole: "Voice Artist",
        preferredLocation: "Remote",
        profileCompleted: true,
      };

      (apiClient.put as jest.Mock).mockResolvedValue({});
      (apiClient.get as jest.Mock).mockResolvedValue({ user: mockUpdated });

      const updated = await authService.completeProfile({
        firstName: "Morgan",
        lastName: "Freeman",
        headline: "Actor & Narrator",
        preferredRole: "Voice Artist",
        preferredLocation: "Remote",
      });

      expect(apiClient.put).toHaveBeenCalledWith("/profile/me", {
        personal: {
          firstName: "Morgan",
          lastName: "Freeman",
        },
        career: {
          headline: "Actor & Narrator",
          preferredRole: "Voice Artist",
          preferredLocation: "Remote",
        },
        preferences: {
          preferredRole: "Voice Artist",
          preferredLocation: "Remote",
        },
      });

      expect(updated.profileCompleted).toBe(true);
      expect(document.cookie).toContain("aca-profile-completed=true");
    });
  });

  describe("authService.getMe", () => {
    it("returns null immediately without calling apiClient.get when no session cookie exists", async () => {
      const result = await authService.getMe();
      expect(result).toBeNull();
      expect(apiClient.get).not.toHaveBeenCalled();
    });

    it("calls apiClient.get('/auth/me') and normalizes user when session cookie is present", async () => {
      document.cookie = "aca-session=active";
      (apiClient.get as jest.Mock).mockResolvedValue({
        user: {
          id: "u-active",
          email: "user@example.com",
          fullName: "John Doe",
          profileCompleted: false,
        },
      });

      const user = await authService.getMe();
      expect(apiClient.get).toHaveBeenCalledWith("/auth/me");
      expect(user).toBeDefined();
      expect(user?.firstName).toBe("John");
      expect(user?.lastName).toBe("Doe");
    });

    it("clears session cookies and returns null when apiClient.get('/auth/me') fails", async () => {
      document.cookie = "aca-session=active";
      (apiClient.get as jest.Mock).mockRejectedValue(new Error("Unauthorized"));

      const result = await authService.getMe();
      expect(result).toBeNull();
      expect(document.cookie).not.toContain("aca-session=active");
    });
  });
});
