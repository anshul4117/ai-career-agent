import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { Prisma } from "@prisma/client";
import * as bcrypt from "bcrypt";
import * as crypto from "crypto";
import { PrismaService } from "../prisma/prisma.service";
import { UsersService, formatUserResponse } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  private sanitizeUser<T extends Record<string, unknown>>(user: T) {
    return formatUserResponse(user);
  }

  private hashToken(token: string): string {
    return crypto.createHash("sha256").update(token).digest("hex");
  }

  /**
   * Evaluates the stateless JWT migration cutoff date.
   * - If STATELESS_MIGRATION_CUTOFF is configured, parses and validates as UTC ISO timestamp.
   * - If DEPLOYMENT_TIMESTAMP is configured, computes exactly 7 days (7 * 24 * 60 * 60 * 1000 ms) from deployment.
   * - If production and neither is configured, fails safely by returning null (stateless migration disabled).
   * - In development / test, defaults to a dynamic 7-day window from current process execution.
   */
  getStatelessMigrationCutoff(): Date | null {
    if (process.env.STATELESS_MIGRATION_CUTOFF) {
      const parsed = new Date(process.env.STATELESS_MIGRATION_CUTOFF);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }

    if (process.env.DEPLOYMENT_TIMESTAMP) {
      const deployedAt = new Date(process.env.DEPLOYMENT_TIMESTAMP);
      if (!isNaN(deployedAt.getTime())) {
        return new Date(deployedAt.getTime() + 7 * 24 * 60 * 60 * 1000);
      }
    }

    if (process.env.NODE_ENV === "production") {
      // Fail safely in production: reject unconfigured stateless migration window
      return null;
    }

    // Dynamic 7-day window for non-production environments
    return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  }

  async register(
    registerDto: RegisterDto,
    metadata: { userAgent?: string; ipAddress?: string } = {},
  ) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(registerDto.password, saltRounds);

    const user = await this.usersService.createUser({
      email: registerDto.email,
      fullName: registerDto.fullName,
      passwordHash,
    });

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.issueRefreshToken(
      user.id,
      undefined,
      metadata.userAgent,
      metadata.ipAddress,
    );

    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(
    loginDto: LoginDto,
    metadata: { userAgent?: string; ipAddress?: string } = {},
  ) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user || !user.passwordHash) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.issueRefreshToken(
      user.id,
      undefined,
      metadata.userAgent,
      metadata.ipAddress,
    );

    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  /**
   * Validate a refresh token with atomic rotation, replay detection,
   * and dual-mode stateless JWT migration support.
   */
  async refreshFromToken(
    refreshToken: string,
    metadata: { userAgent?: string; ipAddress?: string } = {},
  ) {
    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token missing");
    }

    const tokenHash = this.hashToken(refreshToken);

    // 1. Check if token exists in database (either migrated or issued under Phase 1)
    const existingDbToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
    });

    if (existingDbToken) {
      return this.rotateDatabaseRefreshToken(tokenHash, metadata);
    }

    // 2. Token not found in DB: Check stateless JWT fallback if within cutoff period
    const cutoff = this.getStatelessMigrationCutoff();
    if (cutoff && new Date() < cutoff) {
      return this.migrateStatelessJwt(refreshToken, tokenHash, metadata);
    }

    throw new UnauthorizedException(
      "Stateless session expired or migration window closed. Please log in again.",
    );
  }

  /**
   * Atomic rotation of database-backed refresh token.
   * Commits replay revocation to database before throwing to ensure audit trail is preserved.
   */
  private async rotateDatabaseRefreshToken(
    incomingHash: string,
    metadata: { userAgent?: string; ipAddress?: string },
  ) {
    const result = await this.prisma.$transaction(async (tx) => {
      // Row-level lock to serialize concurrent refresh requests
      const [tokenRecord] = await tx.$queryRaw<
        Array<{
          id: string;
          userId: string;
          familyId: string;
          isRevoked: boolean;
          expiresAt: Date;
        }>
      >`
        SELECT id, "userId", "familyId", "isRevoked", "expiresAt"
        FROM "refresh_tokens"
        WHERE "tokenHash" = ${incomingHash}
        FOR UPDATE
      `;

      if (!tokenRecord) {
        return { status: "INVALID" as const };
      }

      // Replay attack detection: If already revoked, invalidate entire family and COMMIT
      if (tokenRecord.isRevoked) {
        await tx.refreshToken.updateMany({
          where: { familyId: tokenRecord.familyId },
          data: { isRevoked: true },
        });
        return { status: "REPLAY" as const, familyId: tokenRecord.familyId };
      }

      // Expiry check
      if (tokenRecord.expiresAt < new Date()) {
        await tx.refreshToken.update({
          where: { id: tokenRecord.id },
          data: { isRevoked: true },
        });
        return { status: "EXPIRED" as const };
      }

      // Legitimate rotation: mint new token
      const newRawToken = crypto.randomBytes(32).toString("hex");
      const newHash = this.hashToken(newRawToken);
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

      await tx.refreshToken.update({
        where: { id: tokenRecord.id },
        data: {
          isRevoked: true,
          replacedByTokenHash: newHash,
          updatedAt: new Date(),
        },
      });

      await tx.refreshToken.create({
        data: {
          userId: tokenRecord.userId,
          tokenHash: newHash,
          familyId: tokenRecord.familyId,
          expiresAt,
          userAgent: metadata.userAgent,
          ipAddress: metadata.ipAddress,
        },
      });

      return {
        status: "SUCCESS" as const,
        userId: tokenRecord.userId,
        newRawToken,
      };
    });

    // Handle results outside transaction so revocation updates are committed
    if (result.status === "INVALID") {
      throw new UnauthorizedException("Invalid refresh token");
    }
    if (result.status === "EXPIRED") {
      throw new UnauthorizedException(
        "Refresh token expired. Please log in again.",
      );
    }
    if (result.status === "REPLAY") {
      throw new UnauthorizedException(
        "Session terminated due to token reuse detection.",
      );
    }

    const user = await this.usersService.findById(result.userId);
    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    const accessToken = await this.generateAccessToken(user);
    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken: result.newRawToken,
    };
  }

  /**
   * Migrate a legacy stateless JWT to the database-backed rotation model.
   * Burns the legacy JWT hash to prevent repeated migration into multiple families.
   */
  private async migrateStatelessJwt(
    legacyJwt: string,
    tokenHash: string,
    metadata: { userAgent?: string; ipAddress?: string },
  ) {
    let payload: { sub: string; email: string; exp?: number };
    try {
      payload = await this.jwtService.verifyAsync(legacyJwt, {
        secret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key",
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    const newRawToken = crypto.randomBytes(32).toString("hex");
    const newHash = this.hashToken(newRawToken);
    const familyId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const legacyExpiresAt = payload.exp
      ? new Date(payload.exp * 1000)
      : expiresAt;

    // Atomically burn legacy JWT and create new token family
    try {
      await this.prisma.$transaction(async (tx) => {
        // Burn legacy token
        await tx.refreshToken.create({
          data: {
            userId: user.id,
            tokenHash,
            familyId,
            isRevoked: true, // Marked revoked immediately so it can never be used again
            replacedByTokenHash: newHash,
            expiresAt: legacyExpiresAt,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,
          },
        });

        // Mint active successor token
        await tx.refreshToken.create({
          data: {
            userId: user.id,
            tokenHash: newHash,
            familyId,
            isRevoked: false,
            expiresAt,
            userAgent: metadata.userAgent,
            ipAddress: metadata.ipAddress,
          },
        });
      });
    } catch (error: unknown) {
      if (
        (typeof error === "object" &&
          error !== null &&
          "code" in error &&
          (error as { code: string }).code === "P2002") ||
        (error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === "P2002")
      ) {
        // Concurrency race: Another concurrent request migrated this legacy token first.
        // Return 401 Unauthorized with a clear message instead of an unhandled 500 error.
        throw new UnauthorizedException(
          "Refresh token has already been migrated. Please retry with your new session token.",
        );
      }
      throw error;
    }

    const accessToken = await this.generateAccessToken(user);
    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken: newRawToken,
    };
  }

  /**
   * Explicitly revoke a refresh token on logout.
   */
  async revokeToken(rawToken: string): Promise<void> {
    if (!rawToken) return;
    const tokenHash = this.hashToken(rawToken);
    try {
      await this.prisma.refreshToken.updateMany({
        where: { tokenHash },
        data: { isRevoked: true },
      });
    } catch {
      // Graceful fallback if token not found or already deleted
    }
  }

  private async issueRefreshToken(
    userId: string,
    familyId?: string,
    userAgent?: string,
    ipAddress?: string,
  ): Promise<string> {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const tokenHash = this.hashToken(rawToken);
    const activeFamilyId = familyId || crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

    await this.prisma.refreshToken.create({
      data: {
        userId,
        tokenHash,
        familyId: activeFamilyId,
        expiresAt,
        userAgent,
        ipAddress,
      },
    });

    return rawToken;
  }

  async generateAccessToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const options: JwtSignOptions = {
      secret:
        process.env.JWT_ACCESS_SECRET ||
        process.env.JWT_SECRET ||
        "jwt-access-secret-key",
      expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
        "15m") as JwtSignOptions["expiresIn"],
    };
    return this.jwtService.signAsync(payload, options);
  }
}
