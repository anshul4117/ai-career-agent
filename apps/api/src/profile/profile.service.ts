import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
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
import {
  Prisma,
  ProficiencyLevel,
  SkillCategory,
  EducationType,
  EmploymentType,
  WorkMode,
} from "@prisma/client";

function splitFullName(fullName: string): [string, string] {
  const parts = (fullName || "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return ["", ""];
  if (parts.length === 1) return [parts[0], ""];
  return [parts[0], parts.slice(1).join(" ")];
}

function getInitials(name: string): string {
  const parts = (name || "").trim().split(/\s+/);
  if (parts.length === 0 || !parts[0]) return "U";
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function mapProficiencyLevel(level?: string): ProficiencyLevel {
  switch (level?.toLowerCase()) {
    case "beginner":
      return ProficiencyLevel.BEGINNER;
    case "intermediate":
      return ProficiencyLevel.INTERMEDIATE;
    case "advanced":
      return ProficiencyLevel.ADVANCED;
    case "expert":
      return ProficiencyLevel.EXPERT;
    default:
      return ProficiencyLevel.INTERMEDIATE;
  }
}

function mapSkillCategory(category?: string): SkillCategory {
  switch (category?.toUpperCase()) {
    case "PROGRAMMING_LANGUAGE":
    case "LANGUAGE":
    case "LANGUAGES":
      return SkillCategory.PROGRAMMING_LANGUAGE;
    case "FRAMEWORK":
    case "FRAMEWORKS":
      return SkillCategory.FRAMEWORK;
    case "DATABASE":
    case "DATABASES":
      return SkillCategory.DATABASE;
    case "CLOUD":
      return SkillCategory.CLOUD;
    case "DEVOPS":
      return SkillCategory.DEVOPS;
    case "TOOL":
    case "TOOLS":
      return SkillCategory.TOOL;
    case "AI_ML":
    case "AI":
    case "MACHINE LEARNING":
      return SkillCategory.AI_ML;
    default:
      return SkillCategory.OTHER;
  }
}

function mapEmploymentType(type?: string): EmploymentType {
  switch (type?.toLowerCase().replace(/[-_\s]/g, "")) {
    case "fulltime":
      return EmploymentType.FULL_TIME;
    case "parttime":
      return EmploymentType.PART_TIME;
    case "internship":
      return EmploymentType.INTERNSHIP;
    case "contract":
      return EmploymentType.CONTRACT;
    case "freelance":
      return EmploymentType.FREELANCE;
    default:
      return EmploymentType.FULL_TIME;
  }
}

function mapWorkMode(mode?: string): WorkMode {
  switch (mode?.toLowerCase()) {
    case "remote":
      return WorkMode.REMOTE;
    case "hybrid":
      return WorkMode.HYBRID;
    case "onsite":
      return WorkMode.ONSITE;
    default:
      return WorkMode.REMOTE;
  }
}

function mapEducationType(type?: string): EducationType {
  switch (type?.toLowerCase()) {
    case "high_school":
    case "high school":
      return EducationType.HIGH_SCHOOL;
    case "diploma":
      return EducationType.DIPLOMA;
    case "bachelors":
    case "bachelor":
    case "b.tech":
    case "b.e":
    case "bs":
      return EducationType.BACHELORS;
    case "masters":
    case "master":
    case "m.tech":
    case "ms":
      return EducationType.MASTERS;
    case "phd":
      return EducationType.PHD;
    default:
      return EducationType.OTHER;
  }
}

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Fetch complete profile for a user with all sections formatted for UI
   */
  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        userSkills: {
          include: { skill: true },
          orderBy: { createdAt: "asc" },
        },
        education: { orderBy: { startDate: "desc" } },
        experience: { orderBy: { startDate: "desc" } },
        projects: { orderBy: { startDate: "desc" } },
        certifications: { orderBy: { issueDate: "desc" } },
        languages: { orderBy: { createdAt: "asc" } },
        socialLinks: { orderBy: { createdAt: "asc" } },
        careerPreference: true,
      },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    let profile = user.profile;
    if (!profile) {
      profile = await this.prisma.profile.create({
        data: { userId },
      });
    }

    const [defaultFirst, defaultLast] = splitFullName(user.fullName);

    const actualFirst = defaultFirst || "";
    const actualLast = defaultLast || "";

    const skills = (user.userSkills || []).map((us) => ({
      id: us.id,
      name: us.skill.name,
      category: us.skill.category.toLowerCase(),
      level: us.proficiencyLevel.toLowerCase(),
      yearsOfExperience: us.yearsOfExperience ?? 1,
      featured: us.featured,
      createdAt: us.createdAt.toISOString(),
      updatedAt: us.updatedAt.toISOString(),
    }));

    const education = (user.education || []).map((edu) => ({
      id: edu.id,
      institution: edu.institutionName,
      degree: edu.qualificationName,
      fieldOfStudy: edu.fieldOfStudy || "",
      location: "",
      startDate: edu.startDate.toISOString().split("T")[0],
      endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : null,
      currentStudy: edu.currentStudy,
      cgpa: edu.grade || "",
      description: edu.description,
      highestEducation: edu.highestEducation,
      createdAt: edu.createdAt.toISOString(),
      updatedAt: edu.updatedAt.toISOString(),
    }));

    const experience = (user.experience || []).map((exp) => ({
      id: exp.id,
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      employmentType: exp.employmentType
        ? exp.employmentType.toLowerCase().replace("_", "-")
        : "full-time",
      location: exp.location || "",
      workMode: exp.workMode ? exp.workMode.toLowerCase() : "remote",
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
      currentPosition: exp.isCurrent,
      description: exp.description || "",
      technologiesUsed: exp.technologiesUsed || [],
      responsibilities: exp.responsibilities || [],
      achievements: exp.achievements || [],
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    }));

    const projects = (user.projects || []).map((proj) => ({
      id: proj.id,
      title: proj.title,
      shortDescription: proj.shortDescription || "",
      description: proj.description,
      techStack: proj.techStack || [],
      githubUrl: proj.repositoryUrl || null,
      liveDemoUrl: proj.projectUrl || null,
      imageUrl: proj.imageUrl || null,
      role: proj.role || "",
      category: proj.category || "Web",
      startDate: proj.startDate
        ? proj.startDate.toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      endDate: proj.endDate ? proj.endDate.toISOString().split("T")[0] : null,
      currentlyWorking: proj.isOngoing,
      featured: proj.featured,
      createdAt: proj.createdAt.toISOString(),
      updatedAt: proj.updatedAt.toISOString(),
    }));

    const certifications = (user.certifications || []).map((cert) => ({
      id: cert.id,
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate.toISOString().split("T")[0],
      expiryDate: cert.expiryDate
        ? cert.expiryDate.toISOString().split("T")[0]
        : null,
      credentialId: cert.credentialId || null,
      credentialUrl: cert.credentialUrl || null,
      neverExpires: cert.neverExpires,
      createdAt: cert.createdAt.toISOString(),
      updatedAt: cert.updatedAt.toISOString(),
    }));

    const languages = (user.languages || []).map((lang) => ({
      id: lang.id,
      language: lang.language,
      readingLevel: lang.readingLevel,
      writingLevel: lang.writingLevel,
      speakingLevel: lang.speakingLevel,
      nativeLanguage: lang.nativeLanguage,
      createdAt: lang.createdAt.toISOString(),
      updatedAt: lang.updatedAt.toISOString(),
    }));

    const socialLinks = (user.socialLinks || []).map((sl) => ({
      id: sl.id,
      platform: sl.platform,
      url: sl.url,
      createdAt: sl.createdAt.toISOString(),
      updatedAt: sl.updatedAt.toISOString(),
    }));

    const preferences = user.careerPreference
      ? {
          id: user.careerPreference.id,
          preferredRole: user.careerPreference.preferredRole || "",
          employmentType: user.careerPreference.employmentType || "full-time",
          preferredLocation: user.careerPreference.preferredLocation || "",
          workMode: user.careerPreference.workMode || "remote",
          expectedSalary: user.careerPreference.expectedSalary || "",
          currency: user.careerPreference.currency || "INR",
          noticePeriod: user.careerPreference.noticePeriod || "",
          openToWork: user.careerPreference.openToWork,
          visaSponsorshipRequired:
            user.careerPreference.visaSponsorshipRequired,
          relocationWillingness: user.careerPreference.relocationWillingness,
          preferredIndustry: user.careerPreference.preferredIndustry || "",
          preferredCompanySize:
            user.careerPreference.preferredCompanySize || "",
          preferredShift: user.careerPreference.preferredShift || "",
          createdAt: user.careerPreference.createdAt.toISOString(),
          updatedAt: user.careerPreference.updatedAt.toISOString(),
        }
      : null;

    // Calculate completion score
    let score = 0;
    const sections = [
      { id: "personal", label: "Personal Info", completed: false },
      { id: "contact", label: "Contact Details", completed: false },
      { id: "headline", label: "Professional Headline", completed: false },
      { id: "summary", label: "Career Summary", completed: false },
      { id: "skills", label: "Skills (3+)", completed: false },
      { id: "experience", label: "Work Experience", completed: false },
      { id: "education", label: "Education", completed: false },
      { id: "projects", label: "Projects", completed: false },
      { id: "social", label: "Social Links", completed: false },
      { id: "preferences", label: "Career Preferences", completed: false },
    ];

    if (user.fullName) {
      sections[0].completed = true;
      score += 10;
    }
    if (user.email && profile?.phone) {
      sections[1].completed = true;
      score += 10;
    }
    if (profile?.headline) {
      sections[2].completed = true;
      score += 10;
    }
    if (profile?.summary) {
      sections[3].completed = true;
      score += 10;
    }
    if (skills.length >= 3) {
      sections[4].completed = true;
      score += 15;
    }
    if (experience.length > 0) {
      sections[5].completed = true;
      score += 15;
    }
    if (education.length > 0) {
      sections[6].completed = true;
      score += 10;
    }
    if (projects.length > 0) {
      sections[7].completed = true;
      score += 10;
    }
    if (socialLinks.length > 0) {
      sections[8].completed = true;
      score += 5;
    }
    if (preferences) {
      sections[9].completed = true;
      score += 5;
    }

    const formattedProfile = {
      id: profile?.id || `prof_${user.id}`,
      userId: user.id,
      avatar: {
        url: user.profilePhotoUrl,
        initials: getInitials(user.fullName),
      },
      personal: {
        firstName: profile?.gender ? actualFirst : actualFirst,
        lastName: actualLast,
        dateOfBirth: profile?.dateOfBirth
          ? profile.dateOfBirth.toISOString().split("T")[0]
          : null,
        gender: profile?.gender || null,
        nationality: profile?.nationality || null,
      },
      contact: {
        email: user.email,
        phone: profile?.phone || "",
        city: profile?.city || "",
        state: profile?.state || "",
        country: profile?.country || "",
      },
      career: {
        currentRole: profile?.currentRole || "",
        yearsOfExperience: profile?.yearsOfExperience ?? 0,
        preferredRole: profile?.preferredRole || "",
        preferredLocation: profile?.preferredLocation || "",
        workPreference: profile?.workPreference || "remote",
        headline: profile?.headline || "",
        summary: profile?.summary || "",
      },
      stats: {
        skillsCount: skills.length,
        experienceCount: experience.length,
        projectsCount: projects.length,
        educationCount: education.length,
      },
      completion: {
        percentage: Math.min(100, score),
        sections,
      },
      availability: profile?.availability || "actively_looking",
      createdAt: (profile?.createdAt || user.createdAt).toISOString(),
      updatedAt: (profile?.updatedAt || user.updatedAt).toISOString(),
    };

    return {
      profile: formattedProfile,
      skills,
      education,
      experience,
      projects,
      certifications,
      languages,
      socialLinks,
      preferences,
    };
  }

  /**
   * Update full profile or selected fields for user
   */
  async updateProfile(userId: string, dto: UpdateProfileDto | PatchProfileDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // 1. Update user level info if present
    const userUpdates: { fullName?: string; profilePhotoUrl?: string | null } =
      {};
    if (
      dto.personal?.firstName !== undefined ||
      dto.personal?.lastName !== undefined
    ) {
      const [curFirst, curLast] = splitFullName(user.fullName);
      const newFirst =
        dto.personal.firstName !== undefined
          ? dto.personal.firstName
          : curFirst;
      const newLast =
        dto.personal.lastName !== undefined ? dto.personal.lastName : curLast;
      userUpdates.fullName = `${newFirst} ${newLast}`.trim() || user.fullName;
    }
    if (dto.avatarUrl !== undefined) {
      userUpdates.profilePhotoUrl = dto.avatarUrl;
    }

    if (Object.keys(userUpdates).length > 0) {
      await this.prisma.user.update({
        where: { id: userId },
        data: userUpdates,
      });
    }

    // 2. Upsert Profile record
    const profileData: Prisma.ProfileUncheckedUpdateInput = {};
    if (dto.career?.headline !== undefined)
      profileData.headline = dto.career.headline;
    if (dto.career?.summary !== undefined)
      profileData.summary = dto.career.summary;
    if (dto.career?.currentRole !== undefined)
      profileData.currentRole = dto.career.currentRole;
    if (dto.career?.yearsOfExperience !== undefined)
      profileData.yearsOfExperience = Math.round(dto.career.yearsOfExperience);
    if (dto.career?.preferredRole !== undefined)
      profileData.preferredRole = dto.career.preferredRole;
    if (dto.career?.preferredLocation !== undefined)
      profileData.preferredLocation = dto.career.preferredLocation;
    if (dto.career?.workPreference !== undefined)
      profileData.workPreference = dto.career.workPreference;

    if (dto.contact?.phone !== undefined) profileData.phone = dto.contact.phone;
    if (dto.contact?.city !== undefined) profileData.city = dto.contact.city;
    if (dto.contact?.state !== undefined) profileData.state = dto.contact.state;
    if (dto.contact?.country !== undefined)
      profileData.country = dto.contact.country;

    if (dto.personal?.gender !== undefined)
      profileData.gender = dto.personal.gender;
    if (dto.personal?.nationality !== undefined)
      profileData.nationality = dto.personal.nationality;
    if (dto.personal?.dateOfBirth !== undefined) {
      profileData.dateOfBirth = dto.personal.dateOfBirth
        ? new Date(dto.personal.dateOfBirth)
        : null;
    }

    if (dto.availability !== undefined) {
      profileData.availability = dto.availability;
    }

    await this.prisma.profile.upsert({
      where: { userId },
      create: {
        ...(profileData as Prisma.ProfileUncheckedCreateInput),
        userId,
      },
      update: profileData,
    });

    // 3. Update Preferences if present
    if (dto.preferences) {
      await this.updatePreferences(userId, dto.preferences);
    }

    // Return the updated profile
    return this.getProfile(userId);
  }

  /**
   * Partially update current user profile
   */
  async patchProfile(userId: string, dto: PatchProfileDto) {
    return this.updateProfile(userId, dto as UpdateProfileDto);
  }

  // ── Skill Operations ──────────────────────────────────────────

  async addSkill(userId: string, dto: SkillItemDto) {
    const slug = slugify(dto.name);
    const category = mapSkillCategory(dto.category);
    const level = mapProficiencyLevel(dto.level);

    // Upsert the master skill definition
    const skill = await this.prisma.skill.upsert({
      where: { name: dto.name },
      create: {
        name: dto.name,
        skillSlug: slug || `skill-${Date.now()}`,
        category,
      },
      update: { category },
    });

    // Create or update the user's skill link
    const userSkill = await this.prisma.userSkill.upsert({
      where: {
        userId_skillId: {
          userId,
          skillId: skill.id,
        },
      },
      create: {
        userId,
        skillId: skill.id,
        proficiencyLevel: level,
        yearsOfExperience: dto.yearsOfExperience ?? 1,
        featured: dto.featured ?? false,
      },
      update: {
        proficiencyLevel: level,
        yearsOfExperience: dto.yearsOfExperience,
        featured: dto.featured,
      },
      include: { skill: true },
    });

    return {
      id: userSkill.id,
      name: userSkill.skill.name,
      category: userSkill.skill.category.toLowerCase(),
      level: userSkill.proficiencyLevel.toLowerCase(),
      yearsOfExperience: userSkill.yearsOfExperience ?? 1,
      featured: userSkill.featured,
      createdAt: userSkill.createdAt.toISOString(),
      updatedAt: userSkill.updatedAt.toISOString(),
    };
  }

  async updateSkill(
    userId: string,
    skillLinkId: string,
    dto: Partial<SkillItemDto>,
  ) {
    const existing = await this.prisma.userSkill.findUnique({
      where: { id: skillLinkId },
    });

    if (!existing) {
      throw new NotFoundException("Skill not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException("Cannot modify another user's skill");
    }

    const updates: Prisma.UserSkillUncheckedUpdateInput = {};
    if (dto.level !== undefined)
      updates.proficiencyLevel = mapProficiencyLevel(dto.level);
    if (dto.yearsOfExperience !== undefined)
      updates.yearsOfExperience = dto.yearsOfExperience;
    if (dto.featured !== undefined) updates.featured = dto.featured;

    const updated = await this.prisma.userSkill.update({
      where: { id: skillLinkId },
      data: updates,
      include: { skill: true },
    });

    return {
      id: updated.id,
      name: updated.skill.name,
      category: updated.skill.category.toLowerCase(),
      level: updated.proficiencyLevel.toLowerCase(),
      yearsOfExperience: updated.yearsOfExperience ?? 1,
      featured: updated.featured,
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }

  async deleteSkill(userId: string, skillLinkId: string) {
    const existing = await this.prisma.userSkill.findUnique({
      where: { id: skillLinkId },
    });

    if (!existing) {
      throw new NotFoundException("Skill not found");
    }

    if (existing.userId !== userId) {
      throw new ForbiddenException("Cannot delete another user's skill");
    }

    await this.prisma.userSkill.delete({
      where: { id: skillLinkId },
    });

    return { success: true };
  }

  // ── Education Operations ──────────────────────────────────────

  async addEducation(userId: string, dto: EducationItemDto) {
    if (dto.highestEducation) {
      await this.prisma.education.updateMany({
        where: { userId },
        data: { highestEducation: false },
      });
    }

    const edu = await this.prisma.education.create({
      data: {
        userId,
        institutionName: dto.institution,
        qualificationName: dto.degree,
        fieldOfStudy: dto.fieldOfStudy || null,
        educationType: mapEducationType(dto.degree),
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        currentStudy: dto.currentStudy ?? false,
        grade: dto.cgpa || null,
        description: dto.description || null,
        highestEducation: dto.highestEducation ?? false,
      },
    });

    return {
      id: edu.id,
      institution: edu.institutionName,
      degree: edu.qualificationName,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate.toISOString().split("T")[0],
      endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : null,
      currentStudy: edu.currentStudy,
      cgpa: edu.grade || "",
      description: edu.description,
      highestEducation: edu.highestEducation,
      createdAt: edu.createdAt.toISOString(),
      updatedAt: edu.updatedAt.toISOString(),
    };
  }

  async updateEducation(
    userId: string,
    eduId: string,
    dto: Partial<EducationItemDto>,
  ) {
    const existing = await this.prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing) throw new NotFoundException("Education not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot modify another user's education");

    if (dto.highestEducation) {
      await this.prisma.education.updateMany({
        where: { userId, id: { not: eduId } },
        data: { highestEducation: false },
      });
    }

    const data: Prisma.EducationUncheckedUpdateInput = {};
    if (dto.institution !== undefined) data.institutionName = dto.institution;
    if (dto.degree !== undefined) {
      data.qualificationName = dto.degree;
      data.educationType = mapEducationType(dto.degree);
    }
    if (dto.fieldOfStudy !== undefined) data.fieldOfStudy = dto.fieldOfStudy;
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.currentStudy !== undefined) data.currentStudy = dto.currentStudy;
    if (dto.cgpa !== undefined) data.grade = dto.cgpa;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.highestEducation !== undefined)
      data.highestEducation = dto.highestEducation;

    const edu = await this.prisma.education.update({
      where: { id: eduId },
      data,
    });

    return {
      id: edu.id,
      institution: edu.institutionName,
      degree: edu.qualificationName,
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate.toISOString().split("T")[0],
      endDate: edu.endDate ? edu.endDate.toISOString().split("T")[0] : null,
      currentStudy: edu.currentStudy,
      cgpa: edu.grade || "",
      description: edu.description,
      highestEducation: edu.highestEducation,
      createdAt: edu.createdAt.toISOString(),
      updatedAt: edu.updatedAt.toISOString(),
    };
  }

  async deleteEducation(userId: string, eduId: string) {
    const existing = await this.prisma.education.findUnique({
      where: { id: eduId },
    });

    if (!existing) throw new NotFoundException("Education not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot delete another user's education");

    await this.prisma.education.delete({ where: { id: eduId } });
    return { success: true };
  }

  // ── Experience Operations ─────────────────────────────────────

  async addExperience(userId: string, dto: ExperienceItemDto) {
    const exp = await this.prisma.experience.create({
      data: {
        userId,
        jobTitle: dto.jobTitle,
        companyName: dto.companyName,
        employmentType: mapEmploymentType(dto.employmentType),
        location: dto.location || null,
        workMode: mapWorkMode(dto.workMode),
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isCurrent: dto.currentPosition ?? false,
        description: dto.description || null,
        technologiesUsed: dto.technologiesUsed || [],
        responsibilities: dto.responsibilities || [],
        achievements: dto.achievements || [],
      },
    });

    return {
      id: exp.id,
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      employmentType: exp.employmentType
        ? exp.employmentType.toLowerCase().replace("_", "-")
        : "full-time",
      location: exp.location || "",
      workMode: exp.workMode ? exp.workMode.toLowerCase() : "remote",
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
      currentPosition: exp.isCurrent,
      description: exp.description || "",
      technologiesUsed: exp.technologiesUsed || [],
      responsibilities: exp.responsibilities || [],
      achievements: exp.achievements || [],
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    };
  }

  async updateExperience(
    userId: string,
    expId: string,
    dto: Partial<ExperienceItemDto>,
  ) {
    const existing = await this.prisma.experience.findUnique({
      where: { id: expId },
    });

    if (!existing) throw new NotFoundException("Experience not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot modify another user's experience");

    const data: Prisma.ExperienceUncheckedUpdateInput = {};
    if (dto.jobTitle !== undefined) data.jobTitle = dto.jobTitle;
    if (dto.companyName !== undefined) data.companyName = dto.companyName;
    if (dto.employmentType !== undefined)
      data.employmentType = mapEmploymentType(dto.employmentType);
    if (dto.location !== undefined) data.location = dto.location;
    if (dto.workMode !== undefined) data.workMode = mapWorkMode(dto.workMode);
    if (dto.startDate !== undefined) data.startDate = new Date(dto.startDate);
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.currentPosition !== undefined) data.isCurrent = dto.currentPosition;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.technologiesUsed !== undefined)
      data.technologiesUsed = dto.technologiesUsed;
    if (dto.responsibilities !== undefined)
      data.responsibilities = dto.responsibilities;
    if (dto.achievements !== undefined) data.achievements = dto.achievements;

    const exp = await this.prisma.experience.update({
      where: { id: expId },
      data,
    });

    return {
      id: exp.id,
      jobTitle: exp.jobTitle,
      companyName: exp.companyName,
      employmentType: exp.employmentType
        ? exp.employmentType.toLowerCase().replace("_", "-")
        : "full-time",
      location: exp.location || "",
      workMode: exp.workMode ? exp.workMode.toLowerCase() : "remote",
      startDate: exp.startDate.toISOString().split("T")[0],
      endDate: exp.endDate ? exp.endDate.toISOString().split("T")[0] : null,
      currentPosition: exp.isCurrent,
      description: exp.description || "",
      technologiesUsed: exp.technologiesUsed || [],
      responsibilities: exp.responsibilities || [],
      achievements: exp.achievements || [],
      createdAt: exp.createdAt.toISOString(),
      updatedAt: exp.updatedAt.toISOString(),
    };
  }

  async deleteExperience(userId: string, expId: string) {
    const existing = await this.prisma.experience.findUnique({
      where: { id: expId },
    });

    if (!existing) throw new NotFoundException("Experience not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot delete another user's experience");

    await this.prisma.experience.delete({ where: { id: expId } });
    return { success: true };
  }

  // ── Project Operations ────────────────────────────────────────

  async addProject(userId: string, dto: ProjectItemDto) {
    const proj = await this.prisma.project.create({
      data: {
        userId,
        title: dto.title,
        shortDescription: dto.shortDescription || null,
        description: dto.description,
        techStack: dto.techStack || [],
        repositoryUrl: dto.githubUrl || null,
        projectUrl: dto.liveDemoUrl || null,
        imageUrl: dto.imageUrl || null,
        role: dto.role || null,
        category: dto.category || "Web",
        startDate: dto.startDate ? new Date(dto.startDate) : null,
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        isOngoing: dto.currentlyWorking ?? false,
        featured: dto.featured ?? false,
      },
    });

    return {
      id: proj.id,
      title: proj.title,
      shortDescription: proj.shortDescription || "",
      description: proj.description,
      techStack: proj.techStack || [],
      githubUrl: proj.repositoryUrl || null,
      liveDemoUrl: proj.projectUrl || null,
      imageUrl: proj.imageUrl || null,
      role: proj.role || "",
      category: proj.category || "Web",
      startDate: proj.startDate
        ? proj.startDate.toISOString().split("T")[0]
        : "",
      endDate: proj.endDate ? proj.endDate.toISOString().split("T")[0] : null,
      currentlyWorking: proj.isOngoing,
      featured: proj.featured,
      createdAt: proj.createdAt.toISOString(),
      updatedAt: proj.updatedAt.toISOString(),
    };
  }

  async updateProject(
    userId: string,
    projId: string,
    dto: Partial<ProjectItemDto>,
  ) {
    const existing = await this.prisma.project.findUnique({
      where: { id: projId },
    });

    if (!existing) throw new NotFoundException("Project not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot modify another user's project");

    const data: Prisma.ProjectUncheckedUpdateInput = {};
    if (dto.title !== undefined) data.title = dto.title;
    if (dto.shortDescription !== undefined)
      data.shortDescription = dto.shortDescription;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.techStack !== undefined) data.techStack = dto.techStack;
    if (dto.githubUrl !== undefined) data.repositoryUrl = dto.githubUrl;
    if (dto.liveDemoUrl !== undefined) data.projectUrl = dto.liveDemoUrl;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.category !== undefined) data.category = dto.category;
    if (dto.startDate !== undefined)
      data.startDate = dto.startDate ? new Date(dto.startDate) : null;
    if (dto.endDate !== undefined)
      data.endDate = dto.endDate ? new Date(dto.endDate) : null;
    if (dto.currentlyWorking !== undefined)
      data.isOngoing = dto.currentlyWorking;
    if (dto.featured !== undefined) data.featured = dto.featured;

    const proj = await this.prisma.project.update({
      where: { id: projId },
      data,
    });

    return {
      id: proj.id,
      title: proj.title,
      shortDescription: proj.shortDescription || "",
      description: proj.description,
      techStack: proj.techStack || [],
      githubUrl: proj.repositoryUrl || null,
      liveDemoUrl: proj.projectUrl || null,
      imageUrl: proj.imageUrl || null,
      role: proj.role || "",
      category: proj.category || "Web",
      startDate: proj.startDate
        ? proj.startDate.toISOString().split("T")[0]
        : "",
      endDate: proj.endDate ? proj.endDate.toISOString().split("T")[0] : null,
      currentlyWorking: proj.isOngoing,
      featured: proj.featured,
      createdAt: proj.createdAt.toISOString(),
      updatedAt: proj.updatedAt.toISOString(),
    };
  }

  async deleteProject(userId: string, projId: string) {
    const existing = await this.prisma.project.findUnique({
      where: { id: projId },
    });

    if (!existing) throw new NotFoundException("Project not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot delete another user's project");

    await this.prisma.project.delete({ where: { id: projId } });
    return { success: true };
  }

  // ── Certification Operations ──────────────────────────────────

  async addCertification(userId: string, dto: CertificationItemDto) {
    const cert = await this.prisma.certification.create({
      data: {
        userId,
        name: dto.name,
        issuingOrganization: dto.issuingOrganization,
        issueDate: new Date(dto.issueDate),
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        credentialId: dto.credentialId || null,
        credentialUrl: dto.credentialUrl || null,
        neverExpires: dto.neverExpires ?? false,
      },
    });

    return {
      id: cert.id,
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate.toISOString().split("T")[0],
      expiryDate: cert.expiryDate
        ? cert.expiryDate.toISOString().split("T")[0]
        : null,
      credentialId: cert.credentialId || null,
      credentialUrl: cert.credentialUrl || null,
      neverExpires: cert.neverExpires,
      createdAt: cert.createdAt.toISOString(),
      updatedAt: cert.updatedAt.toISOString(),
    };
  }

  async updateCertification(
    userId: string,
    certId: string,
    dto: Partial<CertificationItemDto>,
  ) {
    const existing = await this.prisma.certification.findUnique({
      where: { id: certId },
    });

    if (!existing) throw new NotFoundException("Certification not found");
    if (existing.userId !== userId)
      throw new ForbiddenException(
        "Cannot modify another user's certification",
      );

    const data: Prisma.CertificationUncheckedUpdateInput = {};
    if (dto.name !== undefined) data.name = dto.name;
    if (dto.issuingOrganization !== undefined)
      data.issuingOrganization = dto.issuingOrganization;
    if (dto.issueDate !== undefined) data.issueDate = new Date(dto.issueDate);
    if (dto.expiryDate !== undefined)
      data.expiryDate = dto.expiryDate ? new Date(dto.expiryDate) : null;
    if (dto.credentialId !== undefined) data.credentialId = dto.credentialId;
    if (dto.credentialUrl !== undefined) data.credentialUrl = dto.credentialUrl;
    if (dto.neverExpires !== undefined) data.neverExpires = dto.neverExpires;

    const cert = await this.prisma.certification.update({
      where: { id: certId },
      data,
    });

    return {
      id: cert.id,
      name: cert.name,
      issuingOrganization: cert.issuingOrganization,
      issueDate: cert.issueDate.toISOString().split("T")[0],
      expiryDate: cert.expiryDate
        ? cert.expiryDate.toISOString().split("T")[0]
        : null,
      credentialId: cert.credentialId || null,
      credentialUrl: cert.credentialUrl || null,
      neverExpires: cert.neverExpires,
      createdAt: cert.createdAt.toISOString(),
      updatedAt: cert.updatedAt.toISOString(),
    };
  }

  async deleteCertification(userId: string, certId: string) {
    const existing = await this.prisma.certification.findUnique({
      where: { id: certId },
    });

    if (!existing) throw new NotFoundException("Certification not found");
    if (existing.userId !== userId)
      throw new ForbiddenException(
        "Cannot delete another user's certification",
      );

    await this.prisma.certification.delete({ where: { id: certId } });
    return { success: true };
  }

  // ── Language Operations ───────────────────────────────────────

  async addLanguage(userId: string, dto: LanguageItemDto) {
    const lang = await this.prisma.language.create({
      data: {
        userId,
        language: dto.language,
        readingLevel: dto.readingLevel || "intermediate",
        writingLevel: dto.writingLevel || "intermediate",
        speakingLevel: dto.speakingLevel || "intermediate",
        nativeLanguage: dto.nativeLanguage ?? false,
      },
    });

    return {
      id: lang.id,
      language: lang.language,
      readingLevel: lang.readingLevel,
      writingLevel: lang.writingLevel,
      speakingLevel: lang.speakingLevel,
      nativeLanguage: lang.nativeLanguage,
      createdAt: lang.createdAt.toISOString(),
      updatedAt: lang.updatedAt.toISOString(),
    };
  }

  async updateLanguage(
    userId: string,
    langId: string,
    dto: Partial<LanguageItemDto>,
  ) {
    const existing = await this.prisma.language.findUnique({
      where: { id: langId },
    });

    if (!existing) throw new NotFoundException("Language not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot modify another user's language");

    const data: Prisma.LanguageUncheckedUpdateInput = {};
    if (dto.language !== undefined) data.language = dto.language;
    if (dto.readingLevel !== undefined) data.readingLevel = dto.readingLevel;
    if (dto.writingLevel !== undefined) data.writingLevel = dto.writingLevel;
    if (dto.speakingLevel !== undefined) data.speakingLevel = dto.speakingLevel;
    if (dto.nativeLanguage !== undefined)
      data.nativeLanguage = dto.nativeLanguage;

    const lang = await this.prisma.language.update({
      where: { id: langId },
      data,
    });

    return {
      id: lang.id,
      language: lang.language,
      readingLevel: lang.readingLevel,
      writingLevel: lang.writingLevel,
      speakingLevel: lang.speakingLevel,
      nativeLanguage: lang.nativeLanguage,
      createdAt: lang.createdAt.toISOString(),
      updatedAt: lang.updatedAt.toISOString(),
    };
  }

  async deleteLanguage(userId: string, langId: string) {
    const existing = await this.prisma.language.findUnique({
      where: { id: langId },
    });

    if (!existing) throw new NotFoundException("Language not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot delete another user's language");

    await this.prisma.language.delete({ where: { id: langId } });
    return { success: true };
  }

  // ── Social Link Operations ────────────────────────────────────

  async addSocialLink(userId: string, dto: SocialLinkItemDto) {
    const link = await this.prisma.socialLink.create({
      data: {
        userId,
        platform: dto.platform,
        url: dto.url,
      },
    });

    return {
      id: link.id,
      platform: link.platform,
      url: link.url,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    };
  }

  async updateSocialLink(
    userId: string,
    linkId: string,
    dto: Partial<SocialLinkItemDto>,
  ) {
    const existing = await this.prisma.socialLink.findUnique({
      where: { id: linkId },
    });

    if (!existing) throw new NotFoundException("Social link not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot modify another user's social link");

    const data: Prisma.SocialLinkUncheckedUpdateInput = {};
    if (dto.platform !== undefined) data.platform = dto.platform;
    if (dto.url !== undefined) data.url = dto.url;

    const link = await this.prisma.socialLink.update({
      where: { id: linkId },
      data,
    });

    return {
      id: link.id,
      platform: link.platform,
      url: link.url,
      createdAt: link.createdAt.toISOString(),
      updatedAt: link.updatedAt.toISOString(),
    };
  }

  async deleteSocialLink(userId: string, linkId: string) {
    const existing = await this.prisma.socialLink.findUnique({
      where: { id: linkId },
    });

    if (!existing) throw new NotFoundException("Social link not found");
    if (existing.userId !== userId)
      throw new ForbiddenException("Cannot delete another user's social link");

    await this.prisma.socialLink.delete({ where: { id: linkId } });
    return { success: true };
  }

  // ── Preferences Operations ────────────────────────────────────

  async updatePreferences(userId: string, dto: CareerPreferenceDto) {
    const pref = await this.prisma.careerPreference.upsert({
      where: { userId },
      create: {
        userId,
        preferredRole: dto.preferredRole,
        employmentType: dto.employmentType,
        preferredLocation: dto.preferredLocation,
        workMode: dto.workMode,
        expectedSalary: dto.expectedSalary,
        currency: dto.currency || "INR",
        noticePeriod: dto.noticePeriod,
        openToWork: dto.openToWork ?? true,
        visaSponsorshipRequired: dto.visaSponsorshipRequired ?? false,
        relocationWillingness: dto.relocationWillingness ?? true,
        preferredIndustry: dto.preferredIndustry,
        preferredCompanySize: dto.preferredCompanySize,
        preferredShift: dto.preferredShift,
      },
      update: {
        preferredRole: dto.preferredRole,
        employmentType: dto.employmentType,
        preferredLocation: dto.preferredLocation,
        workMode: dto.workMode,
        expectedSalary: dto.expectedSalary,
        currency: dto.currency,
        noticePeriod: dto.noticePeriod,
        openToWork: dto.openToWork,
        visaSponsorshipRequired: dto.visaSponsorshipRequired,
        relocationWillingness: dto.relocationWillingness,
        preferredIndustry: dto.preferredIndustry,
        preferredCompanySize: dto.preferredCompanySize,
        preferredShift: dto.preferredShift,
      },
    });

    return {
      id: pref.id,
      preferredRole: pref.preferredRole || "",
      employmentType: pref.employmentType || "full-time",
      preferredLocation: pref.preferredLocation || "",
      workMode: pref.workMode || "remote",
      expectedSalary: pref.expectedSalary || "",
      currency: pref.currency || "INR",
      noticePeriod: pref.noticePeriod || "",
      openToWork: pref.openToWork,
      visaSponsorshipRequired: pref.visaSponsorshipRequired,
      relocationWillingness: pref.relocationWillingness,
      preferredIndustry: pref.preferredIndustry || "",
      preferredCompanySize: pref.preferredCompanySize || "",
      preferredShift: pref.preferredShift || "",
      createdAt: pref.createdAt.toISOString(),
      updatedAt: pref.updatedAt.toISOString(),
    };
  }
}
