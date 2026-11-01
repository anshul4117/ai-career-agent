import { Injectable } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard("jwt") {
  // Override handleRequest so that 401 is NOT thrown if user is unauthenticated
  override handleRequest<TUser = unknown>(
    _err: unknown,
    user: TUser,
  ): TUser | null {
    return user || null;
  }
}
