import type { AuthUser } from "../types/auth.types";

interface DatabaseUser extends AuthUser {
  password?: string;
}

const USERS_KEY = "aca-users";
const SESSION_KEY = "aca-current-user";
const COOKIE_NAME = "aca-session";

// Helper to simulate network latency
const delay = (ms = 800) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to set cookie for middleware route guarding
function setSessionCookie() {
  if (typeof document === "undefined") return;
  // Expires in 7 days
  const expires = new Date();
  expires.setTime(expires.getTime() + 7 * 24 * 60 * 60 * 1000);
  document.cookie = `${COOKIE_NAME}=active;path=/;expires=${expires.toUTCString()};SameSite=Lax`;
}

// Helper to clear cookie
function clearSessionCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${COOKIE_NAME}=;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT;max-age=0;SameSite=Lax`;
}

// Seed mock database if not already initialized
function initializeMockDatabase(): DatabaseUser[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(USERS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // fallback if corrupted
    }
  }

  const defaultUsers = [
    {
      id: "usr_1",
      email: "user@example.com",
      password: "password123",
      firstName: "John",
      lastName: "Doe",
      name: "John Doe",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=John",
      createdAt: new Date().toISOString(),
      profileCompleted: true,
      verified: true,
    },
    {
      id: "usr_2",
      email: "newuser@example.com",
      password: "password123",
      firstName: "Jane",
      lastName: "Smith",
      name: "Jane Smith",
      profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=Jane",
      createdAt: new Date().toISOString(),
      profileCompleted: false,
      verified: false,
    },
  ];

  localStorage.setItem(USERS_KEY, JSON.stringify(defaultUsers));
  return defaultUsers;
}

export const authService = {
  /** Log in user */
  async login(email: string, password: string): Promise<AuthUser> {
    await delay();
    const users = initializeMockDatabase();
    const userMatch = users.find((u: DatabaseUser) => u.email.toLowerCase() === email.toLowerCase());

    if (!userMatch || userMatch.password !== password) {
      throw new Error("Invalid email or password.");
    }

    // Exclude password from current session user object
    const authUser: DatabaseUser = { ...userMatch };
    delete authUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setSessionCookie();
    return authUser;
  },

  /** Log in via Google Simulation */
  async loginWithGoogle(): Promise<AuthUser> {
    await delay();
    const users = initializeMockDatabase();
    // Default to the first user or create one
    let googleUser = users.find((u: DatabaseUser) => u.email === "googleuser@example.com");
    if (!googleUser) {
      googleUser = {
        id: `usr_${Date.now()}`,
        email: "googleuser@example.com",
        firstName: "Google",
        lastName: "User",
        name: "Google User",
        profileImage: "https://api.dicebear.com/7.x/bottts/svg?seed=Google",
        createdAt: new Date().toISOString(),
        profileCompleted: true,
        verified: true,
      };
      users.push(googleUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    const authUser: DatabaseUser = { ...googleUser };
    delete authUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setSessionCookie();
    return authUser;
  },

  /** Register user */
  async register(email: string, password: string): Promise<AuthUser> {
    await delay();
    const users = initializeMockDatabase();
    const exists = users.some((u: DatabaseUser) => u.email.toLowerCase() === email.toLowerCase());

    if (exists) {
      throw new Error("User with this email already exists.");
    }

    const newUser = {
      id: `usr_${Date.now()}`,
      email,
      password,
      firstName: "",
      lastName: "",
      name: "",
      profileImage: `https://api.dicebear.com/7.x/bottts/svg?seed=${email}`,
      createdAt: new Date().toISOString(),
      profileCompleted: false,
      verified: false,
    };

    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const authUser: DatabaseUser = { ...newUser };
    delete authUser.password;
    // Do not set session yet, user must verify email first
    return authUser;
  },

  /** Register via Google Simulation */
  async registerWithGoogle(): Promise<AuthUser> {
    return this.loginWithGoogle();
  },

  /** Log out current user */
  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(SESSION_KEY);
    clearSessionCookie();
  },

  /** Verify email mock */
  async verifyEmail(code: string): Promise<AuthUser> {
    await delay();
    if (!code || code.length < 4) {
      throw new Error("Invalid verification code. Please enter a valid code.");
    }

    // In mock mode, find the last registered unverified user and verify them
    const users = initializeMockDatabase();
    const unverifiedUser = [...users].reverse().find((u: DatabaseUser) => !u.verified);

    if (!unverifiedUser) {
      // Fallback: if no unverified users, use Jane Smith or make user
      throw new Error("No pending verification found. Try logging in.");
    }

    unverifiedUser.verified = true;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    const authUser: DatabaseUser = { ...unverifiedUser };
    delete authUser.password;
    localStorage.setItem(SESSION_KEY, JSON.stringify(authUser));
    setSessionCookie();
    return authUser;
  },

  /** Simulate forgot password request */
  async forgotPassword(email: string): Promise<void> {
    await delay();
    const users = initializeMockDatabase();
    const exists = users.some((u: DatabaseUser) => u.email.toLowerCase() === email.toLowerCase());

    if (!exists) {
      throw new Error("No user found with that email address.");
    }
  },

  /** Simulate password reset */
  async resetPassword(password: string, token: string): Promise<void> {
    await delay();
    if (!token) {
      throw new Error("Invalid or expired password reset token.");
    }

    const users = initializeMockDatabase();
    // For simplicity, reset the first user or default user
    if (users.length > 0) {
      users[0].password = password;
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  },

  /** Get current active session user */
  getCurrentUser(): AuthUser | null {
    if (typeof window === "undefined") return null;
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;
    try {
      return JSON.parse(session);
    } catch {
      return null;
    }
  },

  /** Check if currently authenticated */
  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  },

  /** Update profile data and mark completed */
  async completeProfile(data: {
    firstName: string;
    lastName: string;
    headline: string;
    preferredRole: string;
    preferredLocation: string;
  }): Promise<AuthUser> {
    await delay();
    const currentUser = this.getCurrentUser();
    if (!currentUser) {
      throw new Error("No active session found.");
    }

    const users = initializeMockDatabase();
    const userIndex = users.findIndex((u: DatabaseUser) => u.id === currentUser.id);

    const updatedUser = {
      ...currentUser,
      ...data,
      name: `${data.firstName} ${data.lastName}`.trim(),
      profileCompleted: true,
    };

    if (userIndex !== -1) {
      users[userIndex] = {
        ...users[userIndex],
        ...updatedUser,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  },
};

export type AuthService = typeof authService;
