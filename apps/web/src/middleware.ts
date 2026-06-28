import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define protected routes that require authentication
const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/resume",
  "/jobs",
  "/applications",
  "/cover-letters",
  "/settings",
  "/complete-profile",
];

// Define guest-only routes (auth pages)
const guestRoutes = [
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-email",
];

function isProtectedRoute(pathname: string) {
  return protectedRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

function isGuestRoute(pathname: string) {
  return guestRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
}

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const sessionCookie = req.cookies.get("aca-session");
  const isAuthenticated = !!sessionCookie;

  // If an authenticated user accesses a guest route, redirect to dashboard
  if (isGuestRoute(pathname) && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // If an unauthenticated user accesses a protected route, redirect to login
  if (isProtectedRoute(pathname) && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in query params
    "/((?!_next|[^?]*\\.(?:html|css|js|gif|svg|jpg|jpeg|png|woff2?|ico|csv|docx|xlsx|fit|gpx|zip)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
export default middleware;
