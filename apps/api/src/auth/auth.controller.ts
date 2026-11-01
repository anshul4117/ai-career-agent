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
  async register(
    @Body() registerDto: RegisterDto,
    @Res() res: Response,
    @Req() req?: Request,
  ) {
    const userAgent = req?.headers?.["user-agent"];
    const ipAddress = req?.ip;
    const metadata =
      userAgent || ipAddress ? { userAgent, ipAddress } : undefined;

    const data = metadata
      ? await this.authService.register(registerDto, metadata)
      : await this.authService.register(registerDto);
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
  async login(
    @Body() loginDto: LoginDto,
    @Res() res: Response,
    @Req() req?: Request,
  ) {
    const userAgent = req?.headers?.["user-agent"];
    const ipAddress = req?.ip;
    const metadata =
      userAgent || ipAddress ? { userAgent, ipAddress } : undefined;

    const data = metadata
      ? await this.authService.login(loginDto, metadata)
      : await this.authService.login(loginDto);
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
  @HttpCode(HttpStatus.OK)
  @Post("refresh")
  async refresh(
    @Req() req: Request,
    @Body() _body: RefreshTokenDto,
    @Res() res: Response,
  ) {
    // Prefer refresh token from HttpOnly cookie, fall back to body
    const token =
      (req?.cookies as Record<string, string>)?.["aca-refresh-token"] ||
      _body?.refreshToken;

    if (!token) {
      throw new UnauthorizedException("Refresh token missing");
    }

    const userAgent = req?.headers?.["user-agent"];
    const ipAddress = req?.ip;
    const metadata =
      userAgent || ipAddress ? { userAgent, ipAddress } : undefined;

    const data = metadata
      ? await this.authService.refreshFromToken(token, metadata)
      : await this.authService.refreshFromToken(token);

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
      });

    // If a new refresh token was minted or rotated, update the HttpOnly refresh cookie
    if (data.refreshToken) {
      res.cookie("aca-refresh-token", data.refreshToken, {
        ...COOKIE_OPTS,
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });
    }

    res.json({ user: data.user });
  }

  // ── Logout ────────────────────────────────────────────────────
  @HttpCode(HttpStatus.OK)
  @Post("logout")
  async logout(@Res() res: Response, @Req() req?: Request) {
    const token =
      (req?.cookies as Record<string, string>)?.["aca-refresh-token"] ||
      (req?.body as Record<string, string>)?.refreshToken;

    if (token) {
      await this.authService.revokeToken(token);
    }

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
