export const AUTH_ROUTES = {
  login: "/login",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",
  completeProfile: "/complete-profile",
  dashboard: "/dashboard",
} as const;

export const PUBLIC_ROUTES = [
  "/",
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
  AUTH_ROUTES.forgotPassword,
  AUTH_ROUTES.resetPassword,
  AUTH_ROUTES.verifyEmail,
] as const;

export const PROTECTED_ROUTES = [
  AUTH_ROUTES.dashboard,
  "/profile",
  "/resume",
  "/jobs",
  "/applications",
  "/cover-letters",
  "/settings",
] as const;

export const AUTH_STORAGE_KEY = "aca-auth-session";
