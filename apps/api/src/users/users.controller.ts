import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from "@nestjs/common";
import type { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { UsersService } from "./users.service";
import { DeleteAccountDto } from "./dto/delete-account.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  /**
   * DELETE /users/me
   * Secure account deletion & anonymization endpoint:
   * - Protected by JwtAuthGuard.
   * - Enforces re-authentication (password verification for credential accounts).
   * - Requires explicit confirmPhrase: "DELETE MY ACCOUNT".
   * - Scrubs candidate PII while preserving anonymized compliance history.
   * - Clears authentication session cookie.
   */
  @UseGuards(JwtAuthGuard)
  @Delete("me")
  @HttpCode(HttpStatus.OK)
  async deleteAccount(
    @Req() req: Request & { user: { id: string; email: string } },
    @Body() body: DeleteAccountDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.usersService.findById(req.user.id);
    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    // 1. Re-authentication verification
    if (user.passwordHash) {
      if (!body?.password) {
        throw new UnauthorizedException(
          "Password confirmation is required to delete your account.",
        );
      }
      const isPasswordValid = await bcrypt.compare(
        body.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException(
          "Invalid password. Account deletion aborted.",
        );
      }
    }

    // 2. Explicit confirmation phrase safeguard
    if (body?.confirmPhrase !== "DELETE MY ACCOUNT") {
      throw new UnauthorizedException(
        'Confirmation phrase mismatch. Please provide confirmPhrase: "DELETE MY ACCOUNT".',
      );
    }

    // 3. Execute anonymization and deletion
    await this.usersService.anonymizeAndDeleteAccount(req.user.id);

    // 4. Invalidate all session cookies
    const isProd = process.env.NODE_ENV === "production";
    const sameSiteMode: "none" | "lax" = isProd ? "none" : "lax";
    const clearOpts = {
      httpOnly: true,
      secure: isProd,
      sameSite: sameSiteMode,
      path: "/",
      maxAge: 0,
    };
    const clearPublicOpts = {
      httpOnly: false,
      secure: isProd,
      sameSite: sameSiteMode,
      path: "/",
      maxAge: 0,
    };

    res.clearCookie?.("aca-access-token", clearOpts);
    res.clearCookie?.("aca-refresh-token", clearOpts);
    res.cookie?.("aca-session", "", clearPublicOpts);
    res.cookie?.("aca-profile-completed", "", clearPublicOpts);

    return {
      success: true,
      message:
        "Account and associated personal data successfully anonymized and deleted.",
    };
  }
}
