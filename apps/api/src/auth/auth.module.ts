import { Module } from "@nestjs/common";
import { JwtModule, JwtModuleOptions, JwtSignOptions } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UsersModule } from "../users/users.module";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";

const jwtConfig: JwtModuleOptions = {
  secret:
    process.env.JWT_ACCESS_SECRET ||
    process.env.JWT_SECRET ||
    "jwt-access-secret-key",
  signOptions: {
    expiresIn: (process.env.JWT_ACCESS_EXPIRES_IN ||
      "15m") as JwtSignOptions["expiresIn"],
  },
};

@Module({
  imports: [UsersModule, PassportModule, JwtModule.register(jwtConfig)],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
