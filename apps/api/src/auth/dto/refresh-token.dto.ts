import { IsOptional, IsString } from "class-validator";

export class RefreshTokenDto {
  @IsOptional()
  @IsString({ message: "Refresh token must be a string" })
  refreshToken?: string;
}
