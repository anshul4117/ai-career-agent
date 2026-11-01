import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from "@nestjs/common";
import { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { OptionalJwtAuthGuard } from "./guards/optional-jwt-auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { JobsService } from "./jobs.service";
import { JobPipelineService } from "./pipeline/job-pipeline.service";
import { QueryJobsDto, RunPipelineDto, SaveJobDto } from "./dto/query-jobs.dto";

import {
  CompanyImporterService,
  CompanyImportRow,
} from "./pipeline/company-registry/company-importer.service";
import { CompanyDiscoveryService } from "./pipeline/company-registry/company-discovery.service";

export interface AuthenticatedUser {
  id: string;
  email: string;
}

export interface OptionalAuthRequest extends Request {
  user?: AuthenticatedUser;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Controller("jobs")
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly pipelineService: JobPipelineService,
    private readonly companyImporter: CompanyImporterService,
    private readonly companyDiscovery: CompanyDiscoveryService,
  ) {}

  @Get()
  @UseGuards(OptionalJwtAuthGuard)
  async getJobs(@Req() req: OptionalAuthRequest, @Query() query: QueryJobsDto) {
    const userId = req.user?.id;
    return this.jobsService.findAll(query, userId);
  }

  @Get("saved")
  @UseGuards(JwtAuthGuard)
  async getSavedJobs(@Req() req: AuthenticatedRequest) {
    return this.jobsService.getSavedJobs(req.user.id);
  }

  @Get(":id")
  @UseGuards(OptionalJwtAuthGuard)
  async getJob(@Req() req: OptionalAuthRequest, @Param("id") id: string) {
    const userId = req.user?.id;
    return this.jobsService.findOne(id, userId);
  }

  @Post(":id/save")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async saveJob(
    @Req() req: AuthenticatedRequest,
    @Param("id") id: string,
    @Body() dto: SaveJobDto,
  ) {
    return this.jobsService.saveJob(req.user.id, id, dto);
  }

  @Delete(":id/save")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async unsaveJob(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.jobsService.unsaveJob(req.user.id, id);
  }

  @Post(":id/apply")
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async trackApply(@Req() req: AuthenticatedRequest, @Param("id") id: string) {
    return this.jobsService.trackApplication(req.user.id, id);
  }

  @Post("collect")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async triggerPipeline(@Body() dto: RunPipelineDto) {
    return this.pipelineService.runPipeline({
      query: dto.query,
      location: dto.location,
      providerNames: dto.providers,
    });
  }

  @Get("metrics")
  @UseGuards(AdminGuard)
  async getMetrics() {
    return this.pipelineService.getCollectionMetrics();
  }

  @Post("admin/companies/import")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async importCompanies(
    @Body()
    body: {
      rows?: CompanyImportRow[];
      csvContent?: string;
      dryRun?: boolean;
    },
  ) {
    let rowsToImport = body.rows || [];
    if (body.csvContent) {
      const parsed = this.companyImporter.parseCsv(body.csvContent);
      rowsToImport = [...rowsToImport, ...parsed];
    }
    return this.companyImporter.importCompanies(rowsToImport, {
      dryRun: Boolean(body.dryRun),
    });
  }

  @Post("admin/companies/discover")
  @UseGuards(AdminGuard)
  @HttpCode(HttpStatus.OK)
  async discoverCompanies() {
    return this.companyDiscovery.runDiscovery();
  }
}
