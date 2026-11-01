import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";
import { ResumeStatus } from "@prisma/client";

export class CreateResumeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  themeConfig?: Record<string, unknown>;

  @IsOptional()
  customSections?: Record<string, unknown>;
}

export class UpdateResumeDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @IsOptional()
  @IsEnum(ResumeStatus)
  status?: ResumeStatus;

  @IsOptional()
  @IsString()
  templateId?: string;

  @IsOptional()
  themeConfig?: Record<string, unknown>;

  @IsOptional()
  customSections?: Record<string, unknown>;
}

export class CreateResumeVersionDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  contentSnapshot?: Record<string, unknown>;

  @IsOptional()
  themeSnapshot?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  changeSummary?: string;
}
