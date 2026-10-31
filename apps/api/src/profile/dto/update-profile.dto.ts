import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class PersonalInfoDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string | null;

  @IsOptional()
  @IsString()
  gender?: string | null;

  @IsOptional()
  @IsString()
  nationality?: string | null;
}

export class ContactInfoDto {
  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  city?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;
}

export class CareerInfoDto {
  @IsOptional()
  @IsString()
  currentRole?: string;

  @IsOptional()
  @IsNumber()
  yearsOfExperience?: number;

  @IsOptional()
  @IsString()
  preferredRole?: string;

  @IsOptional()
  @IsString()
  preferredLocation?: string;

  @IsOptional()
  @IsString()
  workPreference?: string;

  @IsOptional()
  @IsString()
  headline?: string;

  @IsOptional()
  @IsString()
  summary?: string;
}

export class SkillItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  level?: string;

  @IsOptional()
  @IsInt()
  yearsOfExperience?: number;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class EducationItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  institution: string;

  @IsString()
  degree: string;

  @IsOptional()
  @IsString()
  fieldOfStudy?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsOptional()
  @IsBoolean()
  currentStudy?: boolean;

  @IsOptional()
  @IsString()
  cgpa?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsBoolean()
  highestEducation?: boolean;
}

export class ExperienceItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  jobTitle: string;

  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  workMode?: string;

  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsOptional()
  @IsBoolean()
  currentPosition?: boolean;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  technologiesUsed?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  responsibilities?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];
}

export class ProjectItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  techStack?: string[];

  @IsOptional()
  @IsString()
  githubUrl?: string | null;

  @IsOptional()
  @IsString()
  liveDemoUrl?: string | null;

  @IsOptional()
  @IsString()
  imageUrl?: string | null;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  startDate?: string;

  @IsOptional()
  @IsString()
  endDate?: string | null;

  @IsOptional()
  @IsBoolean()
  currentlyWorking?: boolean;

  @IsOptional()
  @IsBoolean()
  featured?: boolean;
}

export class CertificationItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  name: string;

  @IsString()
  issuingOrganization: string;

  @IsString()
  issueDate: string;

  @IsOptional()
  @IsString()
  expiryDate?: string | null;

  @IsOptional()
  @IsString()
  credentialId?: string | null;

  @IsOptional()
  @IsString()
  credentialUrl?: string | null;

  @IsOptional()
  @IsBoolean()
  neverExpires?: boolean;
}

export class LanguageItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  language: string;

  @IsOptional()
  @IsString()
  readingLevel?: string;

  @IsOptional()
  @IsString()
  writingLevel?: string;

  @IsOptional()
  @IsString()
  speakingLevel?: string;

  @IsOptional()
  @IsBoolean()
  nativeLanguage?: boolean;
}

export class SocialLinkItemDto {
  @IsOptional()
  @IsString()
  id?: string;

  @IsString()
  platform: string;

  @IsString()
  url: string;
}

export class CareerPreferenceDto {
  @IsOptional()
  @IsString()
  preferredRole?: string;

  @IsOptional()
  @IsString()
  employmentType?: string;

  @IsOptional()
  @IsString()
  preferredLocation?: string;

  @IsOptional()
  @IsString()
  workMode?: string;

  @IsOptional()
  @IsString()
  expectedSalary?: string;

  @IsOptional()
  @IsString()
  currency?: string;

  @IsOptional()
  @IsString()
  noticePeriod?: string;

  @IsOptional()
  @IsBoolean()
  openToWork?: boolean;

  @IsOptional()
  @IsBoolean()
  visaSponsorshipRequired?: boolean;

  @IsOptional()
  @IsBoolean()
  relocationWillingness?: boolean;

  @IsOptional()
  @IsString()
  preferredIndustry?: string;

  @IsOptional()
  @IsString()
  preferredCompanySize?: string;

  @IsOptional()
  @IsString()
  preferredShift?: string;
}

export class UpdateProfileDto {
  @IsOptional()
  @ValidateNested()
  @Type(() => PersonalInfoDto)
  personal?: PersonalInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => ContactInfoDto)
  contact?: ContactInfoDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => CareerInfoDto)
  career?: CareerInfoDto;

  @IsOptional()
  @IsString()
  avatarUrl?: string | null;

  @IsOptional()
  @IsString()
  availability?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CareerPreferenceDto)
  preferences?: CareerPreferenceDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SkillItemDto)
  skills?: SkillItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EducationItemDto)
  education?: EducationItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExperienceItemDto)
  experience?: ExperienceItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectItemDto)
  projects?: ProjectItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationItemDto)
  certifications?: CertificationItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LanguageItemDto)
  languages?: LanguageItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SocialLinkItemDto)
  socialLinks?: SocialLinkItemDto[];
}
