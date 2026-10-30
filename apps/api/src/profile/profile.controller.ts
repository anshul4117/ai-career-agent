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
  Put,
  Req,
  UseGuards,
} from "@nestjs/common";
import type { Request } from "express";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { ProfileService } from "./profile.service";
import {
  UpdateProfileDto,
  SkillItemDto,
  EducationItemDto,
  ExperienceItemDto,
  ProjectItemDto,
  CertificationItemDto,
  LanguageItemDto,
  SocialLinkItemDto,
  CareerPreferenceDto,
} from "./dto/update-profile.dto";
import { PatchProfileDto } from "./dto/patch-profile.dto";

interface AuthenticatedUser {
  id: string;
  email: string;
}

@UseGuards(JwtAuthGuard)
@Controller("profile")
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  // ── Core Profile Endpoints ────────────────────────────────────

  /**
   * Retrieve the current user's profile and all related sections
   */
  @Get("me")
  async getMyProfile(@Req() req: Request) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.getProfile(user.id);
  }

  /**
   * Create or update the current user's profile
   */
  @Put("me")
  async updateMyProfile(@Req() req: Request, @Body() dto: UpdateProfileDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateProfile(user.id, dto);
  }

  /**
   * Update selected profile fields for the current user
   */
  @Patch("me")
  async patchMyProfile(@Req() req: Request, @Body() dto: PatchProfileDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.patchProfile(user.id, dto);
  }

  // ── Skills Endpoints ──────────────────────────────────────────

  @Post("skills")
  async addSkill(@Req() req: Request, @Body() dto: SkillItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addSkill(user.id, dto);
  }

  @Put("skills/:id")
  async updateSkill(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<SkillItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateSkill(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("skills/:id")
  async deleteSkill(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteSkill(user.id, id);
  }

  // ── Education Endpoints ───────────────────────────────────────

  @Post("education")
  async addEducation(@Req() req: Request, @Body() dto: EducationItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addEducation(user.id, dto);
  }

  @Put("education/:id")
  async updateEducation(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<EducationItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateEducation(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("education/:id")
  async deleteEducation(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteEducation(user.id, id);
  }

  // ── Experience Endpoints ──────────────────────────────────────

  @Post("experience")
  async addExperience(@Req() req: Request, @Body() dto: ExperienceItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addExperience(user.id, dto);
  }

  @Put("experience/:id")
  async updateExperience(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<ExperienceItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateExperience(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("experience/:id")
  async deleteExperience(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteExperience(user.id, id);
  }

  // ── Project Endpoints ─────────────────────────────────────────

  @Post("projects")
  async addProject(@Req() req: Request, @Body() dto: ProjectItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addProject(user.id, dto);
  }

  @Put("projects/:id")
  async updateProject(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<ProjectItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateProject(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("projects/:id")
  async deleteProject(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteProject(user.id, id);
  }

  // ── Certification Endpoints ───────────────────────────────────

  @Post("certifications")
  async addCertification(
    @Req() req: Request,
    @Body() dto: CertificationItemDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addCertification(user.id, dto);
  }

  @Put("certifications/:id")
  async updateCertification(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<CertificationItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateCertification(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("certifications/:id")
  async deleteCertification(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteCertification(user.id, id);
  }

  // ── Language Endpoints ────────────────────────────────────────

  @Post("languages")
  async addLanguage(@Req() req: Request, @Body() dto: LanguageItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addLanguage(user.id, dto);
  }

  @Put("languages/:id")
  async updateLanguage(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<LanguageItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateLanguage(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("languages/:id")
  async deleteLanguage(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteLanguage(user.id, id);
  }

  // ── Social Link Endpoints ─────────────────────────────────────

  @Post("social-links")
  async addSocialLink(@Req() req: Request, @Body() dto: SocialLinkItemDto) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.addSocialLink(user.id, dto);
  }

  @Put("social-links/:id")
  async updateSocialLink(
    @Req() req: Request,
    @Param("id") id: string,
    @Body() dto: Partial<SocialLinkItemDto>,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updateSocialLink(user.id, id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete("social-links/:id")
  async deleteSocialLink(@Req() req: Request, @Param("id") id: string) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.deleteSocialLink(user.id, id);
  }

  // ── Preferences Endpoint ──────────────────────────────────────

  @Put("preferences")
  async updatePreferences(
    @Req() req: Request,
    @Body() dto: CareerPreferenceDto,
  ) {
    const user = req.user as AuthenticatedUser;
    return this.profileService.updatePreferences(user.id, dto);
  }
}
