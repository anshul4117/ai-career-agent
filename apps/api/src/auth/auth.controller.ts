import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { JwtAuthGuard } from "./guards/jwt-auth.guard";

const COOKIE_OPTS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // ── Register ──────────────────────────────────────────────────
  @Post("register")
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const data = await this.authService.register(registerDto);
    res
      .cookie("aca-access-token", data.accessToken, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000, // 15 min
      })
      .cookie("aca-refresh-token", data.refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      // Keep the public session cookie so the Next.js middleware can see it
      .cookie("aca-session", "active", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches refresh-token session lifetime
      })
      .cookie(
        "aca-profile-completed",
        (data.user as { profileCompleted?: boolean }).profileCompleted
          ? "true"
          : "false",
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      )
      .json({ user: data.user });
  }

  // ── Login ─────────────────────────────────────────────────────
  @HttpCode(HttpStatus.OK)
  @Post("login")
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const data = await this.authService.login(loginDto);
    res
      .cookie("aca-access-token", data.accessToken, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("aca-refresh-token", data.refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      })
      .cookie("aca-session", "active", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days, matches refresh-token session lifetime
      })
      .cookie(
        "aca-profile-completed",
        (data.user as { profileCompleted?: boolean }).profileCompleted
          ? "true"
          : "false",
        {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax" as const,
          path: "/",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        },
      )
      .json({ user: data.user });
  }

  // ── Me ────────────────────────────────────────────────────────
  @UseGuards(JwtAuthGuard)
  @Get("me")
  async me(@Req() req: Request) {
    // req.user is populated by JwtStrategy.validate()
    return { user: req.user };
  }

  // ── Refresh ───────────────────────────────────────────────────
  /**
   * Refreshes the short-lived access token using a valid refresh token.
   *
   * SECURITY ARCHITECTURE NOTE:
   * Refresh tokens are stateless signed JWTs with a 7-day expiration.
   * Because the database schema is frozen in Milestone 1 without a token
   * revocation table or token family tracking, refresh tokens cannot be revoked
   * server-side prior to their expiration date.
   */
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Body() _body: RefreshTokenDto,
    @Res() res: Response,
  ) {
    // Prefer refresh token from HttpOnly cookie, fall back to body
    const token =
      (req.cookies as Record<string, string>)?.["aca-refresh-token"] ||
      _body?.refreshToken;

    if (!token) {
      throw new UnauthorizedException("Refresh token missing");
    }

    const data = await this.authService.refreshFromToken(token);

    res
      .cookie("aca-access-token", data.accessToken, {
        ...COOKIE_OPTS,
        maxAge: 15 * 60 * 1000,
      })
      .cookie("aca-session", "active", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      })
      .json({ user: data.user });
  }

  // ── Logout ────────────────────────────────────────────────────
  /**
   * Logout endpoint.
   * Instructs the client browser to delete all authentication and session cookies.
   *
   * SECURITY ARCHITECTURE LIMITATION:
   * Refresh tokens in Milestone 1 are stateless JWTs. There is NO server-side token
   * blacklist or database revocation table. Consequently, logout terminates the session
   * by instructing the client to clear cookies (Max-Age=0). If a refresh token was
   * intercepted or copied before logout, it remains cryptographically valid until its
   * 7-day expiration. Server-side revocation and token family rotation are planned
   * for a future milestone when schema modifications are permitted.
   */
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res() res: Response) {
    const clearOpts = { ...COOKIE_OPTS, maxAge: 0 };
    res
      .clearCookie("aca-access-token", clearOpts)
      .clearCookie("aca-refresh-token", clearOpts)
      .cookie("aca-session", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
      })
      .cookie("aca-profile-completed", "", {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
        maxAge: 0,
      })
      .json({ message: "Logged out successfully" });
  }
}
