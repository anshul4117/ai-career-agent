import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class AdminGuard implements CanActivate {
  private readonly logger = new Logger(AdminGuard.name);

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const adminKey = request.headers["x-admin-key"] as string | undefined;
    const configuredAdminKey = process.env.ADMIN_API_KEY || "dev-admin-key";

    // 1. Verify via x-admin-key header
    if (adminKey && adminKey === configuredAdminKey) {
      return true;
    }

    // 2. Verify via authenticated user email if JWT is present
    const user = (request as unknown as { user?: { email?: string } }).user;
    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (user?.email && adminEmails.includes(user.email.toLowerCase())) {
      return true;
    }

    this.logger.warn(
      `Unauthorized admin endpoint attempt from IP: ${request.ip}`,
    );
    throw new ForbiddenException(
      "Admin access required. Provide a valid x-admin-key header or admin session.",
    );
  }
}
