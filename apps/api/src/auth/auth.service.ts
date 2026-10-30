import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { UsersService } from "../users/users.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private sanitizeUser<T extends Record<string, unknown>>(user: T) {
    const sanitized = { ...user };
    delete sanitized.passwordHash;
    return sanitized;
  }

  async register(registerDto: RegisterDto) {
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
    const refreshToken = await this.generateRefreshToken(user);

    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return {
      user: userWithoutPassword,
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
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
    const refreshToken = await this.generateRefreshToken(user);

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
   * Validate a refresh token and return a fresh access token + user.
   *
   * SECURITY ARCHITECTURE NOTE:
   * Refresh tokens are stateless and verified cryptographically via
   * jwtService.verifyAsync against JWT_REFRESH_SECRET.
   * Tokens are not tracked in a revocation database in Milestone 1 (schema is frozen);
   * revocation relies on client cookie clearance on logout and token expiration (7 days).
   */
  async refreshFromToken(refreshToken: string) {
    let payload: { sub: string; email: string };
    try {
      payload = await this.jwtService.verifyAsync<{
        sub: string;
        email: string;
      }>(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key",
      });
    } catch {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    const user = await this.usersService.findById(payload.sub);
    if (!user) {
      throw new UnauthorizedException("User no longer exists");
    }

    const accessToken = await this.generateAccessToken(user);
    const userWithoutPassword = this.sanitizeUser(
      user as Record<string, unknown>,
    );

    return { user: userWithoutPassword, accessToken };
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

  async generateRefreshToken(user: { id: string; email: string }) {
    const payload = { sub: user.id, email: user.email };
    const options: JwtSignOptions = {
      secret: process.env.JWT_REFRESH_SECRET || "jwt-refresh-secret-key",
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN ||
        "7d") as JwtSignOptions["expiresIn"],
    };
    return this.jwtService.signAsync(payload, options);
  }
}
