export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  profileImage?: string;
  createdAt?: string;
}

export interface AuthSessionState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type AuthStatus = "idle" | "loading" | "authenticated" | "unauthenticated";
