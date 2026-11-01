import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import type { Request, Response } from "express";
import { ResumeStatus } from "@prisma/client";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ResumesService } from "./resumes.service";
import {
  CreateResumeDto,
  CreateResumeVersionDto,
  UpdateResumeDto,
} from "./dto/create-resume.dto";

export interface AuthenticatedRequest extends Request {
  user: {
    id: string;
    email: string;
  };
}

@UseGuards(JwtAuthGuard)
@Controller("resumes")
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  /**
   * Upload resume and atomically create Version 1.
   */
  @Post("upload")
  @UseInterceptors(FileInterceptor("file"))
  async uploadResume(
    @Req() req: AuthenticatedRequest,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateResumeDto,
  ) {
    return this.resumesService.createWithUpload(req.user.id, file, dto);
  }

  /**
   * Create resume from builder without file upload.
   */
  @Post()
  async createResume(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateResumeDto,
  ) {
    return this.resumesService.create(req.user.id, dto);
  }

  /**
   * List all resumes for current user.
   */
  @Get()
  async getResumes(
    @Req() req: AuthenticatedRequest,
    @Query("status") status?: ResumeStatus,
  ) {
    return this.resumesService.findAll(req.user.id, status);
  }

  /**
   * Get single resume with versions and analyses.
   */
  @Get(":id")
  async getResume(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.resumesService.findOne(req.user.id, id);
  }

  /**
   * Update resume metadata and settings.
   */
  @Patch(":id")
  async updateResume(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: UpdateResumeDto,
  ) {
    return this.resumesService.update(req.user.id, id, dto);
  }

  /**
   * Delete resume and clean up physical storage.
   */
  @Delete(":id")
  @HttpCode(HttpStatus.OK)
  async deleteResume(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
  ) {
    return this.resumesService.delete(req.user.id, id);
  }

  /**
   * Create a new immutable version for a resume.
   */
  @Post(":id/versions")
  @UseInterceptors(FileInterceptor("file"))
  async createVersion(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: CreateResumeVersionDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.resumesService.createVersion(req.user.id, id, dto, file);
  }

  /**
   * List all versions of a resume.
   */
  @Get(":id/versions")
  async getVersions(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.resumesService.getVersions(req.user.id, id);
  }

  /**
   * Get specific version details and content snapshot.
   */
  @Get(":id/versions/:versionId")
  async getVersion(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Param("versionId") versionId: string,
  ) {
    return this.resumesService.getVersion(req.user.id, id, versionId);
  }

  /**
   * Stream stored resume file with ownership check.
   */
  @Get("files/:userId/:fileName")
  async downloadFile(
    @Req() req: AuthenticatedRequest,
    @Param("userId") targetUserId: string,
    @Param("fileName") fileName: string,
    @Res() res: Response,
  ) {
    const storageKey = `${targetUserId}/${fileName}`;
    const filePath = await this.resumesService.getFilePathForUser(
      req.user.id,
      storageKey,
    );
    res.sendFile(filePath);
  }
}
