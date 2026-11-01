import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { ResumesController } from "./resumes.controller";
import { ResumesService } from "./resumes.service";
import { ResumeStorageService } from "./storage/resume-storage.service";

@Module({
  imports: [PrismaModule],
  controllers: [ResumesController],
  providers: [ResumesService, ResumeStorageService],
  exports: [ResumesService, ResumeStorageService],
})
export class ResumesModule {}
